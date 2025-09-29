import React, { useEffect } from "react";
import { useFormik } from "formik";
import { ProductType } from "@/lib/models/ProductModel";
import { addProductValidation } from "@/utils/schema/addProductSchema";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { toast } from "react-toastify";
import { addProduct } from "@/store/addProductSlice";
import { BiLoaderCircle } from "react-icons/bi";
import { useState } from "react";
import { getProductById } from "@/store/getProductByIdSlice";
import { updateProductId } from "@/store/updateProductSlice";
interface productIdType {
  productId: string | null;
  setProductId: (id: null) => void;
}
const AddProduct: React.FC<productIdType> = ({ productId, setProductId }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<ProductType>({
    image: null,
    name: "",
    price: "",
    category: "",
    description: "",
    available: false,
    bestSeller: false,
  });
  // console.log("product id is ", productId);
  const dispatch = useAppDispatch();
  const editedProduct = useAppSelector((store) => store.Product);
  // const router = useRouter();

  const formData = new FormData();

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    touched,
    errors,
    values,
    setFieldValue,
  } = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: addProductValidation,
    onSubmit: async (value, action) => {
      // console.log(value);
      setIsLoading(true);
      try {
        if (value?.image) formData.append("image", value.image);
        formData.append("name", value.name);

        formData.append("price", String(value.price));
        formData.append("description", value.description);
        formData.append("category", value.category);
        formData.append("available", String(value.available));

        formData.append("bestSeller", String(value.bestSeller));
        if (!productId) {
          dispatch(addProduct(formData))
            .then((res) => {
              if (res.payload?.success) {
                setIsLoading(false);
                toast.success(res.payload.message);
                action.resetForm();
                setProductId(null);
              } else {
                toast.error(res.payload.message);
                setIsLoading(false);
              }
            })
            .catch((error) => {
              console.log(error);
              setIsLoading(false);
            });
        } else {
          dispatch(updateProductId({ id: productId, formData }))
            .then((res) => {
              // console.log(res.payload);
              console.log("response is", res);
              if (res.payload?.success) {
                toast.success(res.payload.message);
                action.resetForm();
                // setU
              } else {
                toast.error(res.payload.message);
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      } catch (error) {
        console.log(error);
      }
    },
  });
  useEffect(() => {
    if (productId != null) {
      dispatch(getProductById(productId));
    }
  }, [productId]);

  useEffect(() => {
    if (
      productId != null &&
      !editedProduct?.isError &&
      !editedProduct?.loading &&
      editedProduct.data != null
    ) {
      console.log(editedProduct);
      const {
        name,
        available,
        image,
        bestSeller,
        category,
        description,
        _id,
        price,
      } = editedProduct.data;
      setInitialValues({
        name,
        available,
        image,
        bestSeller,
        category,
        description,
        _id,
        price,
      });
    } else {
      setInitialValues({
        image: null,
        name: "",
        price: "",
        category: "",
        description: "",
        available: false,
        bestSeller: false,
      });
    }
  }, [editedProduct?.data, productId]);
  // console.log(values);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-5">
        {productId ? "Update Product" : "Add Product"}
      </h1>
      <form
        className=" p-6 rounded-lg shadow-md  flex gap-20 bg-gray-100"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col space-y-4">
          <div>
            <label className="block mb-1 font-medium text-green-800">
              Product Name
            </label>
            <input
              name="name"
              type="text"
              value={values.name}
              onBlur={handleBlur}
              onChange={handleChange}
              placeholder="Enter product name"
              className=" border border-gray-300 text-sm rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {touched.name && errors.name && (
              <p className="mt-1 text-sm text-red-700">{errors.name}</p>
            )}
          </div>
          <div>
            <label className="block mb-1 font-medium text-green-800">
              Product Description
            </label>
            <textarea
              name="description"
              onChange={handleChange}
              value={values.description}
              onBlur={handleBlur}
              placeholder="Enter product name"
              cols={40}
              rows={3}
              className=" border border-gray-300 resize-none text-sm rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {touched.description && errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>
          <div>
            <label className="block mb-1 text-green-800 font-medium">
              Price
            </label>
            <input
              name="price"
              onBlur={handleBlur}
              value={values.price}
              onChange={handleChange}
              type="string"
              placeholder="Enter price"
              className=" border text-sm border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {touched.price && errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price}</p>
            )}
          </div>
          <div>
            <label className="block mb-1 font-medium text-green-800">
              Image
            </label>
            <input
              name="image"
              onChange={(e) => {
                if (e.currentTarget.files) {
                  setFieldValue("image", e.currentTarget?.files?.[0]);
                }
              }}
              type="file"
              accept="image/*"
              onBlur={handleBlur}
              className=" border bg-green-600 text-white text-sm py-2 rounded px-2"
            />
            {touched.image && errors.image && (
              <p className="mt-1 text-sm text-red-600">{errors.image}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col space-y-3">
          <div className="flex flex-col gap-1">
            {" "}
            <div className="flex gap-3">
              <p className="text-sm text-green-800">Available</p>
              <label className="block mb-1 font-medium">
                <input
                  type="radio"
                  value="true"
                  onBlur={handleBlur}
                  onChange={() => setFieldValue("available", true)}
                  name="available"
                  checked={values.available == true}
                  className="bg-green-600 text-white text-sm py-2 rounded px-2"
                />{" "}
                <span className="text-sm">Yes</span>
              </label>
              <label className="block mb-1 font-medium">
                <input
                  type="radio"
                  value="false"
                  onBlur={handleBlur}
                  onChange={() => setFieldValue("available", false)}
                  name="available"
                  checked={values.available == false}
                  className=" border bg-green-600 text-white text-sm py-2 rounded px-2"
                />{" "}
                <span className="text-sm">No</span>
              </label>
            </div>
            <div className="flex gap-3">
              <p className="text-sm text-green-800">bestSeller</p>
              <label className="block mb-1 font-medium">
                <input
                  type="radio"
                  value="true"
                  onBlur={handleBlur}
                  onChange={() => setFieldValue("bestSeller", true)}
                  name="bestSeller"
                  checked={values.bestSeller == true}
                  className="bg-green-600 text-white text-sm py-2 rounded px-2"
                />{" "}
                <span className="text-sm">Yes</span>
              </label>
              <label className="block mb-1 font-medium">
                <input
                  type="radio"
                  value="false"
                  onBlur={handleBlur}
                  onChange={() => setFieldValue("bestSeller", false)}
                  name="bestSeller"
                  checked={values.bestSeller == false}
                  className=" border bg-green-600 text-white text-sm py-2 rounded px-2"
                />{" "}
                <span className="text-sm">No</span>
              </label>
            </div>
            {touched.available && errors.available && (
              <p className=" text-sm text-red-600">{errors.available}</p>
            )}
          </div>
          <div>
            <select
              name="category"
              value={values.category}
              onBlur={handleBlur}
              onChange={handleChange}
              className="border border-green-600 px-3 py-2 outline-none rounded-lg text-sm"
            >
              <option value="" className="text-gray-500" disabled>
                Choose product category
              </option>
              <option value="cloth">Cloth</option>
              <option value="makeup">Makeup</option>
              <option value="food">Food</option>
              <option value="jewellery">Jewellery</option>
            </select>
            {touched.category && errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category}</p>
            )}
          </div>
          <button
            type="submit"
            className="px-5 flex items-center w-full justify-center cursor-pointer bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            {isLoading ? (
              <span className="animate-spin">
                <BiLoaderCircle size={30} />
              </span>
            ) : (
              <span>{productId ? "Save changes" : "Add product"}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
