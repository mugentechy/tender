import React, { useState } from "react";
import {
  deleteTender,
  getallcategoryquery,
  getalltenderquery,
  getMyTendersQuery,
  searchTendersQuery,
} from "../../api/tender";
import Navbar from "../Navbar";
import Loading from "../utils/Loading";
import TenderCard from "../tender/TenderCard";
import CategoryFilter from "../utils/CategoryFilter";
import PriceRangeFilter from "../utils/PriceRangeFilter";
import { GetMyDetails } from "../../api/user";
import Rightupbar from "../utils/Rightupbar";
import Rightdownbar from "../utils/Rightdownbar";
import { useDebounce } from "../../hooks/useDebounce";
import Confirmation from "../utils/ConfirmationModal";
import { useEffect } from "react";

const MyProfile = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showSoldTenders, setShowSoldTenders] = useState(true);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTender, setSelectedTender] = useState(null);
  const [confirmationType, setConfirmationType] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 2000);

  // States for all data
  const [categories, setCategories] = useState([]);
  const [tenders, setTenders] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [myTenders, setMyTenders] = useState([]);
  const [user, setUser] = useState(null);

  // Loading/Error States
  const [loading, setLoading] = useState({
    categories: true,
    tenders: true,
    search: false,
    myTenders: false,
    user: true,
  });

  const [error, setError] = useState({
    categories: null,
    tenders: null,
    search: null,
    myTenders: null,
    user: null,
  });
 
  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getallcategoryquery();
        setCategories(res|| []);
      
      } catch (err) {
        setError((prev) => ({ ...prev, categories: "Failed to load categories" }));
      } finally {
        setLoading((prev) => ({ ...prev, categories: false }));
      }
    };
    fetchCategories();
  }, []);

  // Fetch tenders
  useEffect(() => {
    const fetchTenders = async () => {
      try {
        const res = await getalltenderquery();
        console.log('r',res)
        setTenders(res || []);
      } catch (err) {
        setError((prev) => ({ ...prev, tenders: "Failed to load tenders" }));
      } finally {
        setLoading((prev) => ({ ...prev, tenders: false }));
      }
    };
    fetchTenders();
  }, []);

  // Fetch user details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await GetMyDetails();
        setUser(res || null);
      } catch (err) {
        setError((prev) => ({ ...prev, user: "Failed to load user" }));
      } finally {
        setLoading((prev) => ({ ...prev, user: false }));
      }
    };
    fetchUser();
  }, []);

  // Fetch search results when debouncedSearchTerm changes
  useEffect(() => {
    if (!debouncedSearchTerm) return;

    const fetchSearch = async () => {
      setLoading((prev) => ({ ...prev, search: true }));
      try {
        const res = await searchTendersQuery(debouncedSearchTerm);
        setSearchResults(res?.message || []);
      } catch (err) {
        setError((prev) => ({ ...prev, search: "Search failed" }));
      } finally {
        setLoading((prev) => ({ ...prev, search: false }));
      }
    };
    fetchSearch();
  }, [debouncedSearchTerm]);

  // Manual refetch handlers
  const refetchAllTenders = async () => {
    setLoading((prev) => ({ ...prev, tenders: true }));
    try {
      const res = await getalltenderquery();

      setTenders(res || []);
    } catch (err) {
      setError((prev) => ({ ...prev, tenders: "Failed to reload tenders" }));
    } finally {
      setLoading((prev) => ({ ...prev, tenders: false }));
    }
  };

  const refetchMyTenders = async () => {
    setLoading((prev) => ({ ...prev, myTenders: true }));
    try {
      const res = await getMyTendersQuery();
     
      setMyTenders(res || []);
    } catch (err) {
      setError((prev) => ({ ...prev, myTenders: "Failed to reload my tenders" }));
    } finally {
      setLoading((prev) => ({ ...prev, myTenders: false }));
    }
  };

  if (loading['categories'] || loading['tenders'] || loading['user']) {
    return (
      <div style={{ minHeight: "800px", minWidth: "1200px" }}>
        <Loading />
      </div>
    );
  }

  const dummyPriceRanges = [
    { id: 1, label: "Under 1000", minPrice: 0, maxPrice: 1000 },
    { id: 2, label: "1001 - 1500", minPrice: 1001, maxPrice: 1500 },
    { id: 3, label: "1501 - 2000", minPrice: 1501, maxPrice: 2000 },
    { id: 4, label: "2001 - 2500", minPrice: 2001, maxPrice: 2500 },
    { id: 5, label: "Over 2500", minPrice: 2501, maxPrice: Infinity },
  ];

  const handleCategoryChange = (categoryId) => {
    const categoryName = categories[categoryId].toLowerCase();
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((name) => name !== categoryName)
        : [...prev, categoryName]
    );
  };

  const handlePriceRangeChange = (priceRangeId) => {
    setSelectedPriceRanges((prev) =>
      prev.includes(priceRangeId)
        ? prev.filter((range) => range !== priceRangeId)
        : [...prev, priceRangeId]
    );
  };

  const handleSearchChange = (query) => {
    setSearchTerm(query);
  };

  const handleConfirmAction = async () => {
    try {
      switch (confirmationType) {
        case "delete":
          setLoadingDelete(true);
          await deleteTender(selectedTender.id);

          refetchAllTenders();
          refetchMyTenders();

          showToast("Tender deleted successfully", "success");
          break;

        default:
          break;
      }
    } catch (error) {
      showToast("Some Error Occured in Deleting Tender", "error");
    } finally {
      setLoadingDelete(false);

      setSelectedTender(null);
      setConfirmationType(null);
    }
  };

  const getFilteredTenders = () => {
  const sourceTenders =
    debouncedSearchTerm && Array.isArray(searchResults.message)
      ? searchResults.message
      : Array.isArray(tenders) ? tenders : [];

  return sourceTenders.filter((tender) => {
    if (!tender || !tender.category || typeof tender.category !== "string") return false;

    const categoryName = tender.category.toLowerCase();

    const isCategorySelected =
      !selectedCategories.length || selectedCategories.includes(categoryName);

    const isPriceInRange =
      !selectedPriceRanges.length ||
      selectedPriceRanges.some((rangeId) => {
        const range = dummyPriceRanges.find((r) => r.id === rangeId);
        return (
          range &&
          tender.cost >= range.minPrice &&
          tender.cost <= range.maxPrice
        );
      });

    const isSoldStatusMatch =
      !showSoldTenders || tender.status?.toLowerCase() === "sold";

    return isCategorySelected && isPriceInRange && isSoldStatusMatch;
  });
};



  const filteredTenders = getFilteredTenders();

  

  const renderTenders = () => {
    if (debouncedSearchTerm && searchResults && searchResults?.length === 0) {
      return <div className="text-gray-600">No matches found.</div>;
    }

    if (filteredTenders?.length === 0) {
      return <p>No tenders available.</p>;
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 p-4">
        {filteredTenders?.map((tender) => (
          <TenderCard
            key={tender.id}
            tender={tender}
            user={user}
            toDelete={() => {
              setSelectedTender(tender);
              setConfirmationType("delete");
            }}
            loadingDelete={loadingDelete}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="t">
      <Navbar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        handleSearch={() => {}}
        user={user}
      />
      <div className="flex flex-row h-[90vh]">
        <div className="hidden lg:grid justify-items-center w-[43%] bg-gray-200">
          <CategoryFilter
            categories={categories}
            selectedCategories={selectedCategories}
            onCategoryChange={handleCategoryChange}
          />
          <PriceRangeFilter
            priceRanges={dummyPriceRanges}
            selectedPriceRanges={selectedPriceRanges}
            onPriceRangeChange={handlePriceRangeChange}
          />
        </div>
        <div className="bg-gray-200 w-full overflow-y-scroll scrollbar-hide">
          <div className="p-4 text-center">
            <div className="relative inline-block">
              <img
                src={
                  user.profileImage ||
                  "https://png.pngtree.com/png-vector/20200614/ourlarge/pngtree-businessman-user-avatar-character-vector-illustration-png-image_2242909.jpg"
                }
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
              />
              <div className="absolute bottom-0 right-0 h-6 w-6 bg-green-400 border-2 border-white rounded-full"></div>
            </div>
            <h2 className="text-2xl font-semibold">{user.name}</h2>
            <p className="text-gray-600">{user.role}</p>
          </div>
          <div className="flex justify-between p-4 px-16">
            <h1
              className={`cursor-pointer font-bold text-xl ${
                !showSoldTenders ? "text-blue-700" : "text-gray-500"
              }`}
              onClick={() => setShowSoldTenders(false)}
            >
              Unsold Tenders
            </h1>
            <h1
              className={`cursor-pointer font-bold text-xl ${
                showSoldTenders ? "text-blue-700" : "text-gray-500"
              }`}
              onClick={() => setShowSoldTenders(true)}
            >
              Sold Tenders
            </h1>
          </div>
          {renderTenders()}
        </div>
        <div className="hidden lg:grid justify-items-center w-[43%] bg-gray-200">
          <Rightupbar />
          <Rightdownbar />
        </div>
      </div>
      {selectedTender && (
        <Confirmation
          message={
            confirmationType === "delete"
              ? "Are you sure you want to delete this Tender?"
              : "Not valid action"
          }
          onConfirm={handleConfirmAction}
          onCancel={() => {
            setSelectedTender(null);
            setConfirmationType(null);
          }}
          confirmButtonClass={
            confirmationType === "delete"
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-red-500 hover:bg-red-600 text-white"
          }
        />
      )}
    </div>
  );
};

export default MyProfile;
