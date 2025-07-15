import React, { useState, useEffect } from "react";
import { getallcategoryquery, getalltenderquery, searchTendersQuery } from "../../api/tender";
import Navbar from "../Navbar";
import Loading from "../utils/Loading";
import TenderCard from "../tender/TenderCard";
import CategoryFilter from "../utils/CategoryFilter";
import PriceRangeFilter from "../utils/PriceRangeFilter";
import { GetMyDetails } from "../../api/user";
import Rightupbar from "../utils/Rightupbar";
import Rightdownbar from "../utils/Rightdownbar";
import { useDebounce } from "../../hooks/useDebounce";

const Home = () => {
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [tenders, setTenders] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState({ user: true, categories: true, tenders: true });
  const [error, setError] = useState({ user: null, categories: null, tenders: null });

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showSoldTenders, setShowSoldTenders] = useState(false);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 1500);


  // Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await GetMyDetails();
       
        setUser(res|| null);
      } catch (err) {
        setError((prev) => ({ ...prev, user: "Failed to load user" }));
      } finally {
        setLoading((prev) => ({ ...prev, user: false }));
      }
    };
    fetchUser();
  }, []);

  

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getallcategoryquery();
        setCategories(res || []);
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
        setTenders(res || []);
      } catch (err) {
        setError((prev) => ({ ...prev, tenders: "Failed to load tenders" }));
      } finally {
        setLoading((prev) => ({ ...prev, tenders: false }));
      }
    };
    fetchTenders();
  }, []);

  // Search tenders
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (debouncedSearchTerm) {
        try {
          const res = await searchTendersQuery(debouncedSearchTerm);
          setSearchResults(res?.data || []);
        } catch (err) {
          console.error("Search error:", err);
        }
      }
    };
    fetchSearchResults();
  }, [debouncedSearchTerm]);

  if (loading.user || loading.categories || loading.tenders) {
    return (
      <div style={{ minHeight: "800px", minWidth: "1200px" }}>
        <Loading />
      </div>
    );
  }

  if (error.user || error.categories || error.tenders) {
    return <div>Error loading data.</div>;
  }

  const dummyPriceRanges = [
    { id: 1, label: "Under 1000", minPrice: 0, maxPrice: 1000 },
    { id: 2, label: "1001 - 1500", minPrice: 1001, maxPrice: 1500 },
    { id: 3, label: "1501 - 2000", minPrice: 1501, maxPrice: 2000 },
    { id: 4, label: "2001 - 2500", minPrice: 2001, maxPrice: 2500 },
    { id: 5, label: "Over 2500", minPrice: 2501, maxPrice: Infinity },
  ];

const handleCategoryChange = (categoryId) => {
  const categoryName = categories[categoryId]?.toLowerCase();
  if (!categoryName) return; // guard clause for invalid index

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
          {filteredTenders.length === 0 ? (
            <p className="text-center">No tenders available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 p-4">
              {filteredTenders.map((tender) => (
                <TenderCard key={tender.id} tender={tender} user={user} />
              ))}
            </div>
          )}
        </div>
        <div className="hidden lg:grid justify-items-center w-[43%] bg-gray-200">
          <Rightupbar />
          <Rightdownbar />
        </div>
      </div>
    </div>
  );
};

export default Home;
