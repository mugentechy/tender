import React from "react";
import { Link } from "react-router-dom";
import StarRating from "../utils/StarRating";
const renderStarRating = (rating) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    const starClass = i <= rating ? "text-yellow-500" : "text-yellow-200";

    stars.push(
      <span key={i} className={`text-2xl mr-1 ${starClass}`}>
        ★
      </span>
    );
  }

  return stars;
};
const TenderCard = ({ tender, user, toDelete, loadingDelete }) => {


  const isCompanyTender =
    tender?.companyId === user?.id && user?.role === "company";
  const isUnsold = tender.status !== "sold";
  return (
    <div className="bg-gray-50 rounded-lg p-4 cursor-pointer shadow-lg ">
      <div className="flex flex-col items-center ">
        <div className="w-full h-40 rounded-lg overflow-hidden m-2">
          <img
            src={
              tender.imageUrl ||
              "https://media.istockphoto.com/id/1267010934/photo/experienced-engineer-explaining-the-problems-in-construction-works-development-after-recession.jpg?b=1&s=612x612&w=0&k=20&c=SA3ZB024TeuvRX_l_650nAIC3Ebfnf707vkbY1ifYEo="
            }
            alt={tender.companyName}
            className=" object-cover   mb-2 transition-transform duration-300 ease-in-out transform hover:scale-110  "
          />
        </div>
        <h2 className="text-xl font-semibold">{tender.title}</h2>
        <p className="text-gray-600 text-sm">{tender.description}</p>
        <p className="text-gray-400 text-sm mt-2">
          Company: {tender.companyName}
        </p>
        <p className="text-gray-400 text-sm">Category: {tender.category}</p>
        <p className="text-gray-400 text-sm">Cost: {tender.cost} Lakhs</p>
        <p className="text-gray-400 text-sm">Status: {tender.status}</p>

        <div className="flex items-center mt-2">
          <div className="mr-2">{renderStarRating(tender.rating)}</div>
          <div className="text-gray-400 text-sm">(Rating: {tender.rating})</div>
        </div>

        <div className="mt-4 flex flex-col items-center">
          {user && user.role === "admin" && <StarRating tenderId={tender.id} />}

          <div className="mt-4 flex justify-center items-center">
            {isCompanyTender && isUnsold && (
              <div>
                <Link to={`/updatetender/${tender.id}`}>
                  <button className="bg-blue-500 text-white rounded-md px-2 py-1 mr-2">
                    Update
                  </button>
                </Link>
                <button
                  onClick={toDelete}
                  disabled={loadingDelete}
                  className="bg-red-500 text-white rounded-md px-2 py-1 mr-2"
                >
                  {loadingDelete ? "Deleting..." : "Delete"}
                </button>
              </div>
            )}
            <Link to={`/tender/${tender.id}`}>
              <button className="bg-green-500 text-white rounded-md px-2 py-1 mr-2">
                Details
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenderCard;
