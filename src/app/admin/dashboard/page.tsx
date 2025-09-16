import Image from "next/image";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { AiFillProduct } from "react-icons/ai";

const AdminDashboard = () => {
  const adminButton = [
    {
      btn: "Add Product",
      icons: <MdOutlineAddCircleOutline size={20} />,
    },
    {
      btn: "View Product",
      icons: <AiFillProduct size={20} />,
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-60 bg-[#F7F7F5] shadow-lg flex flex-col p-5">
        <div className="flex flex-col items-center mb-3 w-fit p-2">
          <Image src="/images/pngtree.png" alt="logo" height={50} width={60} />
          <p className="text-gray-400 text-sm mt-2">Main Menu</p>
        </div>

        <div className="flex flex-col">
          {adminButton.map((btn, index) => (
            <button
              key={index}
              className="flex items-center gap-2 text-gray-700 hover:text-green-600 p-2 rounded-lg transition"
            >
              <span>{btn.icons}</span>
              <span>{btn.btn}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-10 bg-white">
        <h1 className="text-2xl font-bold mb-5">Add Product</h1>
        <form className=" p-6 rounded-lg shadow-md  flex gap-20 ">
          <div className="flex flex-col space-y-3">
            <div>
              <label className="block mb-1 font-medium text-green-800">
                Product Name
              </label>
              <input
                type="text"
                placeholder="Enter product name"
                className=" border border-gray-300 text-sm rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-green-800">
                Product Description
              </label>
              <textarea
                placeholder="Enter product name"
                cols={40}
                rows={3}
                className=" border border-gray-300 resize-none text-sm rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block mb-1 text-green-800 font-medium">
                Price
              </label>
              <input
                type="number"
                placeholder="Enter price"
                className=" border text-sm border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-green-800">
                Image
              </label>
              <input
                type="file"
                className=" border bg-green-600 text-white text-sm py-2 rounded px-2"
              />
            </div>
          </div>
          <div className="flex flex-col space-y-3">
            <div className="flex gap-3">
              <p className="text-sm text-green-800">Available</p>
              <label className="block mb-1 font-medium">
                <input
                  type="radio"
                  value="true"
                  name="available"
                  className="bg-green-600 text-white text-sm py-2 rounded px-2"
                />{" "}
                <span className="text-sm">Yes</span>
              </label>
              <label className="block mb-1 font-medium">
                <input
                  type="radio"
                  value="false"
                  name="available"
                  className=" border bg-green-600 text-white text-sm py-2 rounded px-2"
                />{" "}
                <span className="text-sm">No</span>
              </label>
            </div>
            <div>
              <select className="border border-green-600 px-3 py-2 outline-none rounded-lg text-sm">
                <option value="cloth" className="text-gray-500" disabled selected >Choose product category</option>

                <option value="cloth">Cloth</option>
                <option value="makeup">Makeup</option>
                <option value="food">Food</option>
                <option value="growsarry">growsarry</option>
              </select>
            </div>
            <button
              type="submit"
              className="px-5 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;
