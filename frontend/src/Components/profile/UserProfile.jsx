import React, { useState, useEffect } from "react";
import {
  getallcategoryquery,
  getalltenderquery,
  searchTendersQuery,
} from "../../api/tender";
import Navbar from "../Navbar";
import Loading from "../utils/Loading";
import TenderCard from "../tender/TenderCard";
import CategoryFilter from "../utils/CategoryFilter";
import PriceRangeFilter from "../utils/PriceRangeFilter";
import { GetUserDetails } from "../../api/user";
import Rightupbar from "../utils/Rightupbar";
import Rightdownbar from "../utils/Rightdownbar";
import { useDebounce } from "../../hooks/useDebounce";
import { useParams } from "react-router";

const UserProfile = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showSoldTenders, setShowSoldTenders] = useState(true);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearchTerm = useDebounce(searchTerm, 2000);
  const { userId } = useParams();

   const [loading, setLoading] = useState({
    categories: true,
    tenders: true,
    search: false,
    user: true,
  });

  const [error, setError] = useState({
    categories: null,
    tenders: null,
    search: null,
    user: null,
  });


 
  // Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getallcategory();
        console.log('c',res)
        setCategories(res  || []);
      } catch (err) {
        setError((prev) => ({ ...prev, categories: "Failed to load categories" }));
      } finally {
        setLoading((prev) => ({ ...prev, categories: false }));
      }
    };
    fetchCategories();
  }, []);

  // Tenders
  useEffect(() => {
    const fetchTenders = async () => {
      try {
        const res = await getalltender();
        setTenders(res  || []);
      } catch (err) {
        setError((prev) => ({ ...prev, tenders: "Failed to load tenders" }));
      } finally {
        setLoading((prev) => ({ ...prev, tenders: false }));
      }
    };
    fetchTenders();
  }, []);

  // Search Results
  useEffect(() => {
    if (!debouncedSearchTerm) return;
    const fetchSearchResults = async () => {
      setLoading((prev) => ({ ...prev, search: true }));
      try {
        const res = await searchTenders(debouncedSearchTerm);
        setSearchResults(res || []);
      } catch (err) {
        setError((prev) => ({ ...prev, search: "Search failed" }));
      } finally {
        setLoading((prev) => ({ ...prev, search: false }));
      }
    };
    fetchSearchResults();
  }, [debouncedSearchTerm]);

  // User Details
  useEffect(() => {
    if (!userId) return;
    const fetchUser = async () => {
      try {
        const res = await GetUserDetails(userId);
        setUser(res || null);
      } catch (err) {
        setError((prev) => ({ ...prev, user: "Failed to load user" }));
      } finally {
        setLoading((prev) => ({ ...prev, user: false }));
      }
    };
    fetchUser();
  }, [userId]);



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

  const getFilteredTenders = () => {
    let res = [];

    if (debouncedSearchTerm && searchResults) {
      res = searchResults || [];

      if (user.role === "vendor") {
        res = searchResults?.data.filter(
          (tender) => tender.buyerId === user.id
        );
      } else if (user.role === "company") {
        res = searchResults?.data.filter(
          (tender) =>
            tender.companyId === user.id &&
            (showSoldTenders || tender.status !== "sold")
        );
      }

      return res?.filter((tender) => {
        const categoryName = tender.category.toLowerCase();
        const isCategorySelected =
          !selectedCategories.length ||
          selectedCategories.includes(categoryName);

        const isPriceInRange =
          !selectedPriceRanges.length ||
          selectedPriceRanges.some((priceRangeId) => {
            const range = dummyPriceRanges.find((r) => r.id === priceRangeId);
            return (
              range &&
              tender.cost >= range.minPrice &&
              tender.cost <= range.maxPrice
            );
          });

        const isSoldStatusMatch = !showSoldTenders || tender.status === "sold";

        return isCategorySelected && isPriceInRange && isSoldStatusMatch;
      });
    } else {
      res = tenders;

      if (user.role === "vendor") {
        res = tenders.filter((tender) => tender.buyerId === user.id);
      } else if (user.role === "company") {
        res = tenders.filter(
          (tender) =>
            tender.companyId === user.id &&
            (showSoldTenders || tender.status !== "sold")
        );
      }

      return res.filter((tender) => {
        const isSearchMatch =
          !debouncedSearchTerm ||
          tender.title
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase());

        const categoryName = tender.category.toLowerCase();
        const isCategorySelected =
          !selectedCategories.length ||
          selectedCategories.includes(categoryName);

        const isPriceInRange =
          !selectedPriceRanges.length ||
          selectedPriceRanges.some((priceRangeId) => {
            const range = dummyPriceRanges.find((r) => r.id === priceRangeId);
            return (
              range &&
              tender.cost >= range.minPrice &&
              tender.cost <= range.maxPrice
            );
          });

        const isSoldStatusMatch = !showSoldTenders || tender.status === "sold";

        return (
          isSearchMatch &&
          isCategorySelected &&
          isPriceInRange &&
          isSoldStatusMatch
        );
      });
    }
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
          <TenderCard key={tender.id} tender={tender} user={user} />
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
    </div>
  );
};

export default UserProfile;
