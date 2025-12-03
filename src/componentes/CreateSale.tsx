"use client";
import React, { use, useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { BiLoaderCircle } from "react-icons/bi";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/store/store";
// import { } from "@/store/salesSlice";
import { createSales, deleteSale, getSalesDetailes } from "@/store/salesSlice";
import Image from "next/image";
import { CategoryType, getCategory } from "@/store/categorySlice";
import { SaleViewInterface } from "@/types";
import { MdCancel } from "react-icons/md";

interface SaleFormValues {
  name: string;
  image: File | null;
  disccountPercentage: number | "";
  categoryId: string[];
  start: string;
  end: string;
}

const CreateSale: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [salesData, setSalesData] = useState<SaleViewInterface[] | null>(null);
  const categoryStore = useAppSelector((store) => store.category);
  const [categoryButtons, setCategoryButtons] = useState<CategoryType[] | null>(
    null
  );

  const [createSale, setCreateSale] = useState<boolean>(false);
  const salesDetails = useAppSelector((store) => store.sale);
  const dispatch = useAppDispatch();
  console.log(salesDetails);
  useEffect(() => {
    dispatch(getSalesDetailes());
  }, []);
  useEffect(() => {
    setSalesData(salesDetails?.data);
  }, [salesDetails]);

  const initialValues: SaleFormValues = {
    name: "",
    image: null,
    disccountPercentage: "",
    categoryId: [] as string[],
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
    categoryId: Yup.array()
      .min(1, "At least one category is required")
      .required("Category is required"),
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
        values.categoryId.forEach((id) => {
          formData.append("categoryId", id);
        });
        formData.append("start", formValues.start);
        formData.append("end", formValues.end);
        dispatch(createSales(formData))
          .unwrap()
          .then((res) => {
            console.log(res);
            if (res?.success) {
              toast.success(res?.message);
              resetForm();
              setIsLoading(false);
              setCreateSale(true);
            } else {
              toast.error(res?.message);
              setIsLoading(false);
            }
          })
          .catch((error) => {
            console.log(error);
            setIsLoading(false);
          });
      } catch (err) {
        console.log(err);
        toast.error("Something went wrong");
        setIsLoading(false);
      }
    },
  });
  const handleSaleDeletion = (id: string) => {
    // console.log(id);
    dispatch(deleteSale(id as string))
      .unwrap()
      .then((res) => {
        console.log(res);
        if (res.success) {
          toast.success(res.message);
          setCreateSale(true);
        } else {
          toast.error(res.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    dispatch(getCategory());
  }, []);

  useEffect(() => {
    if (categoryStore.category) {
      setCategoryButtons(categoryStore.category);
    }
  }, [categoryStore.category]);
  useEffect(() => {
    if (categoryButtons) {
      setFieldValue(
        "categoryId",
        categoryButtons.map((cat) => cat?._id)
      );
    }
  }, [categoryButtons]);
  const handleCategoryDelete = (id: string) => {
    setCategoryButtons((prev) =>
      prev ? prev.filter((cat) => cat._id !== id) : null
    );
    setFieldValue(
      "categoryId",
      values?.categoryId.filter((catId) => catId != id)
    );
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-2xl font-bold text-gray-800 mb-5">
          {!createSale ? "Sale" : "Create Sale"}
        </p>
        {salesData && (
          <button
            className="px-3 py-2 bg-gray-600 text-white rounded-lg cursor-pointer"
            onClick={() => setCreateSale((prev) => !prev)}
          >
            {" "}
            {createSale ? "Show Sale" : "Create  "}
          </button>
        )}
      </div>
      <div className="p-3 bg-gray-100 rounded-lg shadow-md  mx-auto">
        {!createSale && salesData && salesData?.length > 0 ? (
          <>
            {salesDetails.isError == true && (
              <div className="w-full flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(salesData || []).map((sale) => (
                <div
                  key={sale._id}
                  className="px-5 py-4 rounded-xl shadow-lg bg-white flex flex-col items-start transition-transform"
                >
                  <div className="w-full h-48 relative mb-4">
                    <Image
                      src={sale.image as string}
                      alt={sale.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>

                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {sale.name}
                  </h2>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {sale?.categoryId?.map((cat) => (
                      <span
                        key={cat?._id}
                        className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full"
                      >
                        {cat?.categoryName}
                      </span>
                    ))}
                  </div>

                  <p className="text-green-700 font-semibold mb-1">
                    Discount: {sale.disccountPercentage}%
                  </p>

                  <p className="text-gray-500 text-sm mb-1">
                    Start: {new Date(sale.start).toLocaleString()}
                  </p>
                  <p className="text-gray-500 text-sm mb-3">
                    End: {new Date(sale.end).toLocaleString()}
                  </p>

                  <button
                    onClick={() => handleSaleDeletion(sale._id as string)}
                    className="self-end px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div>
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

              <div>
                <label className="block mb-1 font-medium text-green-800">
                  Category
                </label>

                <div className=" p-2 grid grid-cols-3 gap-5">
                  {(categoryButtons || []).map((cat) => (
                    <div
                      key={cat?._id}
                      className="capitalize border relative border-gray-400 p-1 text-center"
                    >
                      <p> {cat?.categoryName}</p>
                      <button
                        className="absolute top-[-10px] right-[-8px] text-gray-500 cursor-pointer"
                        onClick={() => handleCategoryDelete(cat?._id as string)}
                      >
                        <MdCancel />
                      </button>
                    </div>
                  ))}
                </div>

                {errors.categoryId && (
                  <p className="text-red-600 text-sm">{errors.categoryId}</p>
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
                disabled={isLoading}
                className={`flex cursor-pointer items-center justify-center ${
                  isLoading ? "bg-green-400 cursor-none" : "bg-green-600"
                } bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition`}
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
    </>
  );
};

export default CreateSale;
