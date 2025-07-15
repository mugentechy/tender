import React from "react";

const PriceRangeFilter = ({
  priceRanges,
  selectedPriceRanges,
  onPriceRangeChange,
}) => {
  return (
    <div className="w-[80%] col-span-1 relative lg:h-[40vh] h-[50vh] my-4 mx-4 border rounded-xl bg-gray-50 overflow-scroll scrollbar-hide shadow-lg">
      <div className="sticky top-0 z-40 bg-blue-700 p-1 h-10 w-full">
        <h1 className="text-base text-center cursor-pointer font-bold text-gray-50 py-1 w-full">
          Price Ranges
        </h1>
      </div>
      <ul>
        {priceRanges.map((range) => (
          <li
            className="flex mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-300 p-1 group cursor-pointer hover:shadow-lg m-auto"
            key={range.id}
          >
            <input
              type="checkbox"
              id={`price-range-${range.id}`}
              checked={selectedPriceRanges.includes(range.id)}
              onChange={() => onPriceRangeChange(range.id)}
              style={{ transform: "scale(1.5)" }}
            />
            <label
              htmlFor={`price-range-${range.id}`}
              className={`text-base ${
                selectedPriceRanges.includes(range.id)
                  ? "text-gray-800"
                  : "text-gray-800"
              } font-semibold`}
            >
              {range.label.length > 25
                ? range.label.substring(0, 25) + "..."
                : range.label}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PriceRangeFilter;
