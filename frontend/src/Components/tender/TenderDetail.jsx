import React, { useState, useEffect } from "react";
import TenderDetails from "./TenderDetails";
import Navbar from "../Navbar";
import Rightupbar from "../utils/Rightupbar";
import Rightdownbar from "../utils/Rightdownbar";

import { GetMyDetails } from "../../api/user";
import Loading from "../utils/Loading";

const TenderDetail = () => {

    const [user, setUser] = useState(null);
      const [loading, setLoading] = useState({ user: true, tender: true, bids: true });

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






  return (
    <div className="t">
      <div className="">
        <Navbar user={user} />
        <div className="flex flex-row h-[90vh] min-w-screen ">
          <TenderDetails />

          <div className="hidden lg:grid justify-items-center w-[43%]  bg-gray-200 ">
            <Rightupbar />

            <Rightdownbar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenderDetail;
