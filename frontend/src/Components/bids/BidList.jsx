
import React, { useState, useEffect } from "react";
import {
  getallbidsquery,
  createbid,
  acceptBid,
  rejectBid,
  deletebid,
} from "../../api/bid";
import { GetMyDetails } from "../../api/user";
import { tenderdetailsquery } from "../../api/tender";
import { useParams } from "react-router-dom";
import Loading from "../utils/Loading";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BidCard from "./BidCard";
import Confirmation from "../utils/ConfirmationModal";







const BidList = () => {
  const { tenderId } = useParams();

  const [user, setUser] = useState(null);
  const [tenderDetails, setTenderDetails] = useState(null);
  const [bids, setBids] = useState([]);

  const [error, setError] = useState({});
  const [loading, setLoading] = useState({ user: true, tender: true, bids: true });

  const [selectedBid, setSelectedBid] = useState(null);
  const [confirmationType, setConfirmationType] = useState(null);
  const [isBidding, setIsBidding] = useState(false);
  const [bidAmount, setBidAmount] = useState(0);
  const [sortBy, setSortBy] = useState(null);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingAccept, setLoadingAccept] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await GetMyDetails();
        setUser(res);
      } catch (err) {
        setError((prev) => ({ ...prev, user: "Failed to load user" }));
      } finally {
        setLoading((prev) => ({ ...prev, user: false }));
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!tenderId) return;

    const fetchTender = async () => {
      try {
        const res = await tenderdetailsquery(tenderId);
        setTenderDetails(res?.message || null);
      } catch (err) {
        setError((prev) => ({ ...prev, tender: "Failed to load tender" }));
      } finally {
        setLoading((prev) => ({ ...prev, tender: false }));
      }
    };

    fetchTender();
  }, [tenderId]);

  useEffect(() => {
    if (!tenderId) return;

    const fetchBids = async () => {
      try {
        const res = await getallbidsquery(tenderId);
        setBids(res?.message || []);
      } catch (err) {
        setError((prev) => ({ ...prev, bids: "Failed to load bids" }));
      } finally {
        setLoading((prev) => ({ ...prev, bids: false }));
      }
    };

    fetchBids();
  }, [tenderId]);

  const refetchBids = async () => {
    try {
      setLoading((prev) => ({ ...prev, bids: true }));
      const res = await getallbidsquery(tenderId);
      setBids(res?.message || []);
    } catch (err) {
      setError((prev) => ({ ...prev, bids: "Failed to reload bids" }));
    } finally {
      setLoading((prev) => ({ ...prev, bids: false }));
    }
  };

  const refetchTenderDetails = async () => {
    try {
      setLoading((prev) => ({ ...prev, tender: true }));
      const res = await tenderdetailsquery(tenderId);
      setTenderDetails(res?.message || null);
    } catch (err) {
      setError((prev) => ({ ...prev, tender: "Failed to reload tender" }));
    } finally {
      setLoading((prev) => ({ ...prev, tender: false }));
    }
  };

  const showToast = (message, type = "error") => {
    toast[type](message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  if (loading.user || loading.tender || loading.bids) {
    return (
      <div style={{ minHeight: "800px", minWidth: "1200px" }}>
        <Loading />
      </div>
    );
  }

  if (error.user || error.tender || error.bids) {
    return <div>Error loading data.</div>;
  }

  const handleSort = (order) => setSortBy(order);

  const handleBid = async () => {
    try {
      setLoadingAdd(true);
      const bidAmountFloat = parseFloat(bidAmount);

      if (isNaN(bidAmountFloat)) return showToast("Invalid bid amount");
      if (bidAmountFloat < tenderDetails.cost)
        return showToast("Bid must be higher than tender cost");

      await createbid(bidAmountFloat, tenderId);
      await refetchBids();
      showToast("Bid submitted", "success");
    } catch {
      showToast("Error submitting bid");
    } finally {
      setLoadingAdd(false);
      setIsBidding(false);
      setBidAmount(0);
    }
  };

  const handleConfirmAction = async () => {
    try {
      switch (confirmationType) {
        case "delete":
          setLoadingDelete(true);
          await deletebid(selectedBid.id);
          await refetchBids();
          showToast("Bid deleted", "success");
          break;
        case "accept":
          setLoadingAccept(true);
          await acceptBid(selectedBid.id);
          await refetchBids();
          await refetchTenderDetails();
          showToast("Bid accepted", "success");
          break;
        case "reject":
          setLoadingReject(true);
          await rejectBid(selectedBid.id);
          await refetchBids();
          showToast("Bid rejected", "success");
          break;
      }
    } catch {
      showToast("Error processing action");
    } finally {
      setLoadingDelete(false);
      setLoadingAccept(false);
      setLoadingReject(false);
      setSelectedBid(null);
      setConfirmationType(null);
    }
  };

  const sortedBids = [...bids];
  if (sortBy === "lowToHigh") sortedBids.sort((a, b) => a.amount - b.amount);
  if (sortBy === "highToLow") sortedBids.sort((a, b) => b.amount - a.amount);

  return (
    <div>
      <div className="max-w-4xl mx-auto mt-8 space-y-4">
        {isBidding ? (
          <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-center">
            <input
              type="text"
              placeholder="Enter your bid amount"
              className="w-48 py-2 px-3 border rounded-l-lg"
              onChange={(e) => setBidAmount(e.target.value)}
            />
            <button
              onClick={handleBid}
              className="bg-blue-500 text-white py-2 px-6 rounded-r-lg hover:bg-blue-600"
              disabled={loadingAdd}
            >
              {loadingAdd ? "Submitting..." : "Submit Bid"}
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            {user.role === "vendor" && (
              <button
                onClick={() => setIsBidding(true)}
                className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600"
              >
                Bid
              </button>
            )}
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto mt-8 space-y-4">
        <div className="flex justify-center">
          <h3 className="text-2xl font-semibold">Bids</h3>
          <div className="ml-4 flex">
            <button
              className={`${
                sortBy === "lowToHigh"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-700"
              } py-2 px-4 rounded-l-lg`}
              onClick={() => handleSort("lowToHigh")}
            >
              Low to High
            </button>
            <button
              className={`${
                sortBy === "highToLow"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-700"
              } py-2 px-4 rounded-r-lg`}
              onClick={() => handleSort("highToLow")}
            >
              High to Low
            </button>
          </div>
        </div>

        {sortedBids?.length > 0 ? (
          sortedBids.map((bid) => (
            <BidCard
              key={bid.id}
              bid={bid}
              toAccept={() => {
                setSelectedBid(bid);
                setConfirmationType("accept");
              }}
              toReject={() => {
                setSelectedBid(bid);
                setConfirmationType("reject");
              }}
              toDelete={() => {
                setSelectedBid(bid);
                setConfirmationType("delete");
              }}
              loadingAccept={loadingAccept}
              loadingReject={loadingReject}
              loadingDelete={loadingDelete}
            />
          ))
        ) : (
          <div className="flex items-center justify-center">
            <p className="text-gray-600">No bids yet.</p>
          </div>
        )}
      </div>

      {selectedBid && (
        <Confirmation
          message={
            confirmationType === "delete"
              ? "Are you sure you want to delete this bid?"
              : confirmationType === "accept"
              ? "Are you sure you want to accept this bid?"
              : "Are you sure you want to reject this bid?"
          }
          onConfirm={handleConfirmAction}
          onCancel={() => {
            setSelectedBid(null);
            setConfirmationType(null);
          }}
          confirmButtonClass={
            confirmationType === "accept"
              ? "bg-green-500 hover:bg-green-600 text-white"
              : "bg-red-500 hover:bg-red-600 text-white"
          }
        />
      )}
    </div>
  );
};

export default BidList;
