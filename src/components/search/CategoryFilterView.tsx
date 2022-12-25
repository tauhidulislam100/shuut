import React from "react";

interface IProps {
  categoryList: Record<string, any>[];
  selected?: string;
  onChange?: (name: string) => void;
  onApply?: () => void;
  onClear?: () => void;
}

const CategoryFilterView = ({
  categoryList,
  selected,
  onChange,
  onApply,
  onClear,
}: IProps) => {
  return (
    <>
      <h1 className="text-2xl font-lota font-semibold mt-5">Category</h1>
      <div className="grid xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 grid-cols-3  xl:gap-x-8 gap-x-5 gap-y-10 mt-5 xl:px-16">
        {categoryList?.map((category: Record<string, string>) => (
          <div
            onClick={() => onChange?.(category.name)}
            key={category.id}
            className={`cursor-pointer flex flex-col justify-center items-center`}
          >
            <div
              className={`lg:w-36 lg:h-36 md:w-24 md:h-24 sm:w-16 sm:h-16 w-12 h-12 font-lota rounded-full flex justify-center items-center border ${
                category.name === selected
                  ? "bg-secondary bg-opacity-[0.08]"
                  : "border-[#9D9D9D] bg-[#9D9D9D]/10 text-[#0A2429]"
              }`}
            >
              <img
                src={category.icon}
                alt={category.name}
                className="object-cover md:w-[43px] sm:w-[35px] w-[25px] max-w-full"
              />
            </div>
            <h4
              className={`text-center lg:text-2xl md:text-xl sm:text-lg text-sm mt-5 ${
                selected === category.name ? "text-secondary" : ""
              }`}
            >
              {category.name}
            </h4>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-end gap-5 py-2 w-full">
        <button
          onClick={onClear}
          className="sm:w-[193px] sm:px-0 px-8 font-sofia-pro bg-[#FAFAFA] border border-[#DFDFE6] rounded-md text-[#263238] h-12 items-center text-lg font-semibold"
        >
          Clear
        </button>
        <button
          onClick={onApply}
          className="sm:px-10 px-4 font-sofia-pro bg-secondary hover:bg-primary rounded-md text-white h-12 items-center sm:text-lg text-base font-semibold"
        >
          Apply Filter
        </button>
      </div>
    </>
  );
};

export default CategoryFilterView;
