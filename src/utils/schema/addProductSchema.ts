import * as Yup from "yup";
export const addProductValidation = Yup.object({
  name: Yup.string().min(2).required(),
  image: Yup.string().required(),
  description: Yup.string().required(),
  price: Yup.string()
    .matches(/^[0-9]+$/, "Phone number must contain only digits")
    .min(1)
    .required(),
  category: Yup.string().required(),
  available: Yup.boolean().required(),
  bestSeller: Yup.boolean().required(),
});

