const OrderSkeleton = () => {
  return (
    <div className="bg-gray-100 w-full mt-6 shadow animate-pulse">
      <p className="h-5 w-40 bg-gray-300 rounded mb-4"></p>

      <div className="overflow-y-auto max-h-[500px] mt-[10px]">
        <table className="w-[768px] lg:w-full text-left border-collapse">
          <thead className="bg-white sticky top-0">
            <tr>
              {[...Array(7)].map((_, i) => (
                <th key={i} className="px-2 py-3 border-b">
                  <div className="h-4 bg-gray-300 rounded"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b">
                {[...Array(7)].map((_, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-2 py-3 border-l border-gray-300"
                  >
                    <div className="h-4 bg-gray-300 rounded"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default OrderSkeleton