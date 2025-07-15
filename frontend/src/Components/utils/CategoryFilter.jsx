import React from "react";

const CategoryFilter = ({
  categories,
  selectedCategories,
  onCategoryChange,
}) => {

  return (
    <div className="w-[80%] col-span-1 relative lg:h-[40vh] h-[50vh] my-4 mx-4 border rounded-xl bg-gray-50 overflow-scroll scrollbar-hide shadow-lg">
      <div className="sticky top-0 z-40 bg-blue-700 p-1 h-10 w-full">
        <h1 className="text-base text-center cursor-pointer font-bold text-gray-50 py-1 w-full">
          Categories
        </h1>
      </div>
      <ul>
        {categories?.map((category, index) => (
          <div
            className="flex mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-300 p-1 group cursor-pointer hover:shadow-lg m-auto"
            key={index}
          >
            <input
              type="checkbox"
              id={`category-${index}`}
              checked={selectedCategories.includes(category.toLowerCase())}
              onClick={() => onCategoryChange(index)}
              style={{ transform: "scale(1.5)" }}
            />
            <label
              htmlFor={`category-${index}`}
              className={`text-base ${
                selectedCategories.includes(category.toLowerCase())
                  ? "text-gray-800"
                  : "text-gray-800"
              } font-semibold`}
            >
              {category.length > 25
                ? category.substring(0, 25) + "..."
                : category}
            </label>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default CategoryFilter;
