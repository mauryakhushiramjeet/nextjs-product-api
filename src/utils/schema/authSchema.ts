import * as Yup from "yup";
export const loginValodationSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: Yup.string().required().min(6),
});
export const signUpValidation = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: Yup.string().required().min(6),
  name: Yup.string().required().min(2),
});
