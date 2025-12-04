const ProductCardSkeleton = () => {
  return (
    <div className="bg-[#F5F6EF] shadow rounded-xl p-3 flex flex-col gap-3 animate-pulse">
      <div className="w-full h-56 bg-gray-300 rounded-xl"></div>

      <div className="flex justify-between w-full">
        <div className="h-4 w-32 bg-gray-300 rounded"></div>
        <div className="h-4 w-16 bg-gray-300 rounded"></div>
      </div>

      <div className="flex justify-between w-full">
        <div className="flex gap-2">
          <div className="h-4 w-20 bg-gray-300 rounded"></div>
          <div className="h-4 w-24 bg-gray-300 rounded"></div>
        </div>

        <div className="h-4 w-20 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
