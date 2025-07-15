import React from "react";

const TenderDetailsCard = ({ tenderDetails }) => {
  
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full md:max-w-4xl mx-4 md:mx-auto">
      <div className="flex items-center justify-center">
        <div className="flex flex-row w-24 h-24 rounded-full overflow-hidden items-center justify-center">
          <img
            src={
              tenderDetails?.imageUrl ||
              "https://media.istockphoto.com/id/1267010934/photo/experienced-engineer-explaining-the-problems-in-construction-works-development-after-recession.jpg?b=1&s=612x612&w=0&k=20&c=SA3ZB024TeuvRX_l_650nAIC3Ebfnf707vkbY1ifYEo="
            }
            alt={tenderDetails?.title}
            className="w-24 h-24 rounded-full mx-2 transition-transform duration-300 ease-in-out transform hover:scale-110"
          />
        </div>
        <div className="ml-4">
          <h2 className="text-3xl font-bold">{tenderDetails?.title}</h2>
          <p className="text-gray-600">{tenderDetails?.companyName}</p>
     
        </div>
      </div>
      <div className="mt-4 text-center">
        <p className="text-gray-700">{tenderDetails?.category}</p>
         <p className="text-2xl text-gray-500">{tenderDetails?.cost}Ksh</p>
        <p className="text-2xl text-gray-500">{tenderDetails?.description} Lakhs</p>
        <p className="text-gray-600">Status: {tenderDetails?.status}</p>
      </div>
    </div>
  );
};

export default TenderDetailsCard;
