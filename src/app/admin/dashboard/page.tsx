"use client";
import Image from "next/image";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { AiFillProduct } from "react-icons/ai";
import AddProduct from "@/componentes/AddProduct";
import { useEffect, useState } from "react";
import ViewProduct from "@/componentes/ViewProduct";

const AdminDashboard = () => {
  const [activePage, setActivePage] = useState<string>("ViewProduct");
  const [textActive, setTextActive] = useState<string>("View Product");
  const [editedProductId, setEditedProductId] = useState<string | null>(null);

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
  const handleEditedProductId = (id: string) => {
    if (id != null) {
      setActivePage("AddProduct");

      setEditedProductId(id);
    }
  };

  const handlePages = (btn: string) => {
    setTextActive(btn);
    switch (btn) {
      case "Add Product":
        setEditedProductId(null);
        setActivePage("AddProduct");
        break;
      case "View Product":
        setActivePage("ViewProduct");
        break;
      default:
        setActivePage("");
        break;
    }
  };

  const renderPage = () => {
    switch (activePage) {
      case "AddProduct":
        return (
          <AddProduct
            productId={editedProductId}
            setProductId={setEditedProductId}
          />
        );
      case "ViewProduct":
        return <ViewProduct onEdite={handleEditedProductId} />;
      default:
    }
  };

  // console.log("admon dashbord editedproduct is is here", editedProductId);
  return (
    <div className="flex bg-gray-100 ">
      <div className="w-60 bg-[#F7F7F5] shadow-lg flex flex-col p-5 h-[500px]">
        <div className="flex flex-col items-center mb-3 w-fit p-2">
          <Image src="/images/pngtree.png" alt="logo" height={50} width={60} />
          <p className="text-gray-400 text-sm mt-2">Main Menu</p>
        </div>

        <div className="flex flex-col">
          {adminButton.map((btn, index) => (
            <button
              key={index}
              onClick={() => handlePages(btn.btn)}
              className={` ${
                textActive == btn.btn ? "text-green-600" : "text-gray-700"
              } flex items-center gap-2 cursor-pointer  hover:text-green-800 p-2 rounded-lg transition`}
            >
              <span>{btn.icons}</span>
              <span>{btn.btn}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 px-10 pb-5 bg-white ">{renderPage()}</div>
    </div>
  );
};

export default AdminDashboard;
