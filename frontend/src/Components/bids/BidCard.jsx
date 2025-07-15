import React from "react";
import { GetMyDetails } from "../../api/user";
import { tenderdetailsquery } from "../../api/tender";
import Loading from "../utils/Loading";
import { useParams } from "react-router";

const BidCard = ({
  bid,
  toAccept,
  toReject,
  toDelete,
  loadingAccept,
  loadingReject,
  loadingDelete,
}) => {
  const { tenderId } = useParams();
 
  const [loading, setLoading] = useState({
    user: true,
    tenderDetails: true,
  });

  const [error, setError] = useState({
    user: null,
    tenderDetails: null,
  });

  // Fetch user details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await GetMyDetails();
        setUser(res?.data?.user || null);
      } catch (err) {
        setError((prev) => ({ ...prev, user: "Failed to fetch user details" }));
      } finally {
        setLoading((prev) => ({ ...prev, user: false }));
      }
    };
    fetchUser();
  }, []);

  // Fetch tender details
  useEffect(() => {
    if (!tenderId) return;
    const fetchTenderDetails = async () => {
      try {
        const res = await getTenderDetails(tenderId);
        setTenderDetails(res?.message || null);
      } catch (err) {
        setError((prev) => ({ ...prev, tenderDetails: "Failed to fetch tender details" }));
      } finally {
        setLoading((prev) => ({ ...prev, tenderDetails: false }));
      }
    };
    fetchTenderDetails();
  }, [tenderId])

  if (userLoading || tenderDetailsLoading) return <Loading />;
  if (userError) return <div>Error in user fetching in BidCard</div>;
  if (tenderDetailsError) return <div>Error in tender fetching in BidCard</div>;

  const loggedInUserId = user?.id;

  return (
    <div
      key={bid?.id}
      className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between"
    >
      <div>
        <p className="text-gray-700">Reference Id: {bid?.id}</p>
        <p className="text-gray-700">Vendor: {bid?.vendor.name}</p>
        <p className="text-gray-500">Amount: {bid.amount} Lakhs</p>
        <p className="text-gray-500">Status: {bid.status}</p>
        <p className="text-gray-500">Date: {bid.updatedAt}</p>
      </div>
      <div>
        {loggedInUserId === tenderDetails.companyId ? (
          <div>
            {tenderDetails.status !== "sold" && (
              <div className="flex space-x-2">
                {bid.status !== "rejected" && (
                  <button
                    className={`bg-green-500 text-white py-2 px-4 rounded-lg ${
                      loadingAccept
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-green-600"
                    }`}
                    onClick={toAccept}
                    disabled={loadingAccept}
                  >
                    {loadingAccept ? "Accepting..." : "Accept"}
                  </button>
                )}
                {bid.status !== "rejected" && (
                  <button
                    className={`bg-red-500 text-white py-2 px-4 rounded-lg ${
                      loadingReject
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-red-600"
                    }`}
                    onClick={toReject}
                    disabled={loadingReject}
                  >
                    {loadingReject ? "Rejecting..." : "Reject"}
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          loggedInUserId === bid.vendorId &&
          bid.status !== "rejected" && (
            <button
              onClick={toDelete}
              className={`bg-red-500 text-white py-2 px-4 rounded-lg ${
                loadingDelete
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-red-600"
              }`}
              disabled={loadingDelete}
            >
              {loadingDelete ? "Deleting..." : "Delete"}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default BidCard;
