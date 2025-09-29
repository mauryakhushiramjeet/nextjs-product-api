import * as Yup from "yup";

const shippingValidationSchema = Yup.object({
  fullname: Yup.string()
    .required("Full name is required")
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name cannot exceed 50 characters"),
  paymentMethod: Yup.string().required(),
  phone: Yup.string()
    .required("Phone number is required")
    .matches(/^[0-9]{10,15}$/, "Phone number must be between 10 and 15 digits"),

  address: Yup.string()
    .required("Address is required")
    .min(5, "Address must be at least 5 characters")
    .max(100, "Address cannot exceed 100 characters"),

  city: Yup.string()
    .required("City is required")
    .min(2, "City must be at least 2 characters")
    .max(50, "City cannot exceed 50 characters"),

  state: Yup.string()
    .required("State is required")
    .min(2, "State must be at least 2 characters")
    .max(50, "State cannot exceed 50 characters"),

  country: Yup.string()
    .required("Country is required")
    .min(2, "Country must be at least 2 characters")
    .max(50, "Country cannot exceed 50 characters"),

  addressType: Yup.string()
    .required("Address type is required")
    .oneOf(
      ["home", "office", "other"],
      "Address type must be home, office, or other"
    ),
});

export default shippingValidationSchema;
