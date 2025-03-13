"use client";

import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";

const validationSchema = Yup.object({
  firstname: Yup.string().min(3, "Minimal 3 karakter").required("Wajib diisi"),
  lastname: Yup.string().required("Wajib diisi"),
  email: Yup.string().email("Email tidak valid").required("Wajib diisi"),
  password: Yup.string()
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      "Minimum eight characters, at least one letter, one number and one special character"
    )
    .required("Wajib diisi"),
});

export default function RegisterPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800">
      <div className="container mx-auto flex bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="w-1/2 flex flex-col justify-center items-center bg-gray-800 p-4">
          <Image src="/home.png" alt="Register Page" width={300} height={300} />
          <p className="text-x1 text-white font-bold mt-4">
            Create Your Account
          </p>
        </div>
        <div className="w-1/2 p-8">
          <h2 className="text-2x1 font-bold mb-4">Register</h2>
          <Formik
            initialValues={{
              firstname: "",
              lastname: "",
              email: "",
              password: "",
            }}
            validationSchema={validationSchema}
            onSubmit={async (values) => {
              try {
                await axios.post(
                  "http://localhost:5001/users/",
                  values
                );
                router.push("/");
              } catch (error) {
                console.error("Register failed", error);
              }
            }}
          >
            <Form>
              <Field
                type="text"
                name="firstname"
                placeholder="First Name"
                className="w-full p-2 border rounded mb-3"
              />
              <ErrorMessage
                name="firstname"
                component="div"
                className="text-red-500 text-sm"
              />

              <Field
                type="text"
                name="lastname"
                placeholder="Last Name"
                className="w-full p-2 border rounded mb-3"
              />
              <ErrorMessage
                name="lastname"
                component="div"
                className="text-red-500 text-sm"
              />

              <Field
                type="email"
                name="email"
                placeholder="Email"
                className="w-full p-2 border rounded mb-3"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm"
              />

              <Field
                type="password"
                name="password"
                placeholder="Password"
                className="w-full p-2 border rounded mb-3"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm"
              />

              <button
                type="submit"
                className="w-full bg-green-500 text-white py-2 rounded"
              >
                Register
              </button>
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
}
