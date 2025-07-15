import { Avatar } from "@chakra-ui/react";
import React from "react";
import { GetVendors } from "../../api/user";
import { useEffect, useState } from "react";
import Loading from "./Loading";

const Rightdownbar = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await GetVendors();
      
        setVendors(res || []);
        setLoading(false);
      } catch (err) {
        setError("Error loading vendors.");
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  return (
    <div className="max-w-[70%] col-span-1 relative lg:h-[40vh] h-[50vh] my-4 mx-4 border rounded-xl bg-gray-50 overflow-scroll scrollbar-hide shadow-lg">
      <div className="sticky top-0 z-40 bg-blue-700 p-1 h-10 w-full">
        <h1 className="text-base text-center cursor-pointer font-bold text-gray-50 py-1 w-full">
          Registered Vendors
        </h1>
      </div>
      <ul>
        {vendors?.map((vendor) => {
    
          return (
            <div
              className="flex flex-grow mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-300 p-1 group cursor-pointer hover:shadow-lg m-auto"
              key={vendor.id}
            >
              <Avatar
                className="w-10 h-10 bg-gray-500 rounded-3xl"
                src={vendor.profileImage}
              />
              <h3 className="text-gray-800 font-semibold">{vendor}</h3>
            </div>
          );
        })}
      </ul>
    </div>
  );
};

export default Rightdownbar;
