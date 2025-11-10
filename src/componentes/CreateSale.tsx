"use client";
import React, { use, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { BiLoaderCircle } from "react-icons/bi";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/store/store";
// import { } from "@/store/salesSlice";
import { createSales, deleteSale, getSalesDetailes } from "@/store/salesSlice";
import { SaleInterface } from "@/lib/models/SaleModel";
import Image from "next/image";

interface SaleFormValues {
  name: string;
  image: File | null;
  disccountPercentage: number | "";
  category: string;
  start: string;
  end: string;
}

const CreateSale: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [salesData, setSalesData] = useState<SaleInterface[] | null>(null);
  const salesDetails = useAppSelector((store) => store.sale);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getSalesDetailes());
  }, []);
  useEffect(() => {
    setSalesData(salesDetails?.data);
  }, [salesDetails]);

  console.log(salesData);
  const initialValues: SaleFormValues = {
    name: "",
    image: null,
    disccountPercentage: "",
    category: "",
    start: "",
    end: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Sale name is required"),
    image: Yup.mixed().required("Sale image is required"),
    disccountPercentage: Yup.number()
      .required("Discount is required")
      .min(1, "Minimum 1%")
      .max(100, "Maximum 100%"),
    category: Yup.string().required("Category is required"),
    start: Yup.date().required("Start date is required"),
    end: Yup.date()
      .required("End date is required")
      .min(Yup.ref("start"), "End date cannot be before start date"),
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    handleSubmit,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (formValues, { resetForm }) => {
      setIsLoading(true);
      try {
        const formData = new FormData();
        formData.append("name", formValues.name);
        if (formValues.image) formData.append("image", formValues.image);
        formData.append(
          "disccountPercentage",
          String(formValues.disccountPercentage)
        );
        formData.append("category", formValues.category);
        formData.append("start", formValues.start);
        formData.append("end", formValues.end);
        dispatch(createSales(formData));
        toast.success("Sale created successfully!");
        resetForm();
      } catch (err) {
        console.log(err);
        toast.error("Something went wrong");
      } finally {
        setIsLoading(false);
      }
    },
  });
  const handleSaleDeletion = (id: string) => {
    console.log(id);
    dispatch(deleteSale(id as string))
      .unwrap()
      .then((res) => {
        console.log(res);
        if (res.success) {
          toast.success(res.message);
        } else {
          toast.error(res.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md max-w-3xl mx-auto mt-10">
      {salesData ? (
        <>
          {salesDetails.isError == true && (
            <div className="w-full flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {salesData.map((sale) => (
              <div
                key={sale._id}
                className="p-4 rounded-lg shadow-md bg-white flex flex-col items-center"
              >
                <Image
                  src={sale.image as string}
                  alt={sale.name}
                  height={200}
                  width={500}
                  className="w-full h-48 object-cover rounded-lg mb-2"
                />
                <h2 className="text-lg font-bold">{sale.name}</h2>
                <p className="text-sm text-gray-600">{sale.category}</p>
                <p className="text-green-700 font-semibold">
                  Discount: {sale.disccountPercentage}%
                </p>
                <p className="text-gray-500 text-sm">
                  Start: {new Date(sale.start).toLocaleString()}
                </p>
                <p className="text-gray-500 text-sm">
                  End: {new Date(sale.end).toLocaleString()}
                </p>
                <button
                  onClick={() => handleSaleDeletion(sale._id as string)}
                  className="px-3 bg-red-700/90 mt-2 text-white cursor-pointer hover:bg-red-600/70 rounded-lg py-1 text-base"
                >
                  Sale delete
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div>
          <h1 className="text-2xl font-bold mb-6">Create Sale</h1>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-5">
            {/* Name */}
            <div>
              <label className="block mb-1 font-medium text-green-800">
                Sale Name
              </label>
              <input
                type="text"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter sale name"
                className="border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {touched.name && errors.name && (
                <p className="text-red-600 text-sm">{errors.name}</p>
              )}
            </div>

            {/* Image */}
            <div>
              <label className="block mb-1 font-medium text-green-800">
                Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFieldValue("image", e.currentTarget.files?.[0] || null)
                }
                onBlur={handleBlur}
                className="border bg-green-600 text-white p-2 rounded w-full"
              />
              {touched.image && errors.image && (
                <p className="text-red-600 text-sm">{errors.image}</p>
              )}
            </div>

            {/* Discount */}
            <div>
              <label className="block mb-1 font-medium text-green-800">
                Discount %
              </label>
              <input
                type="number"
                name="disccountPercentage"
                value={values.disccountPercentage}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter discount percentage"
                className="border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {touched.disccountPercentage && errors.disccountPercentage && (
                <p className="text-red-600 text-sm">
                  {errors.disccountPercentage}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block mb-1 font-medium text-green-800">
                Category
              </label>
              <select
                name="category"
                value={values.category}
                onChange={handleChange}
                onBlur={handleBlur}
                className="border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="" disabled>
                  Choose category
                </option>
                <option value="cloth">Cloth</option>
                <option value="makeup">Makeup</option>
                <option value="food">Food</option>
                <option value="jewellery">Jewellery</option>
              </select>
              {touched.category && errors.category && (
                <p className="text-red-600 text-sm">{errors.category}</p>
              )}
            </div>

            {/* Start Date */}
            <div>
              <label className="block mb-1 font-medium text-green-800">
                Start Date
              </label>
              <input
                type="datetime-local"
                name="start"
                value={values.start}
                onChange={handleChange}
                onBlur={handleBlur}
                className="border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {touched.start && errors.start && (
                <p className="text-red-600 text-sm">{errors.start}</p>
              )}
            </div>

            {/* End Date */}
            <div>
              <label className="block mb-1 font-medium text-green-800">
                End Date
              </label>
              <input
                type="datetime-local"
                name="end"
                value={values.end}
                onChange={handleChange}
                onBlur={handleBlur}
                className="border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {touched.end && errors.end && (
                <p className="text-red-600 text-sm">{errors.end}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="flex items-center justify-center bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
            >
              {isLoading ? (
                <BiLoaderCircle size={25} className="animate-spin" />
              ) : (
                "Create Sale"
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CreateSale;
