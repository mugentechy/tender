import { Avatar } from "@chakra-ui/react";
import React from "react";
import { GetCompanies } from "../../api/user";
import Loading from "./Loading";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Rightupbar = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await GetCompanies();
        
        setCompanies(res || []);
        setLoading(false);
      } catch (err) {
        setError("Error loading companies.");
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: "800px", minWidth: "400px" }}>
        <Loading />
      </div>
    );
  }

  if (error) {
    return <div>Error loading companies.</div>;
  }

  return (
    <div className="w-[70%] col-span-1 relative lg:h-[40vh] h-[50vh] my-4 mx-4 border rounded-xl bg-gray-50 overflow-scroll scrollbar-hide shadow-lg">
      <div className="sticky top-0 z-40 bg-blue-700 p-1 h-10 w-full">
        <h1 className="text-base text-center cursor-pointer font-bold text-gray-50 py-1 w-full">
          Registered Companies
        </h1>
      </div>
      <ul>
        {companies?.map((company) => {

          return (
            <div
              className="flex mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-300 p-1 group cursor-pointer hover:shadow-lg m-auto"
              key={company.id}
            >
              <Avatar
                className="w-10 h-10 bg-gray-500 rounded-3xl"
                src={company.profileImage}
              />
              
                <h3 className="text-gray-800  font-semibold">{company}</h3>
             
            </div>
          );
        })}
      </ul>
    </div>
  );
};

export default Rightupbar;
