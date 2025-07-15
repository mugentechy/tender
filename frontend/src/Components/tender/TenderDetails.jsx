import React, { useState, useEffect } from "react";

import { tenderdetailsquery } from "../../api/tender";

import { useParams } from "react-router-dom";

import Loading from "../utils/Loading";

import BidList from "../bids/BidList";
import TenderDetailsCard from "./TenderDetailsCard";

const TenderDetails = () => {
  const { tenderId } = useParams();
  const [tenderDetails, setTenderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTenderDetails = async () => {
      try {
        const res = await tenderdetailsquery(tenderId);

        setTenderDetails(res);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (tenderId) {
      fetchTenderDetails();
    }
  }, [tenderId]);



  if (error) {
    return <div>Error loading tenderdetails.</div>;
  }
  if (loading) {
    return (
      <div style={{ minHeight: "800px", minWidth: "1200px" }}>
        <Loading />
      </div>
    );
  }

  return (
    <div className="bg-gray-200 w-full overflow-y-scroll scrollbar-hide pt-4">
      <TenderDetailsCard tenderDetails={tenderDetails} />
      <BidList />
    </div>
  );
};

export default TenderDetails;
