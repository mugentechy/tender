import { TextField } from "@mui/material";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerUser } from "../../api";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router";
import Loading from "../utils/Loading";
import register1 from "../../assets/register1.jpg";
import axios from "axios";
function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [button, setbutton] = useState(false);
  const [apiError, setApiError] = useState(null);
  const showToast = (message, type = "error") => {
    toast[type](message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  const {
    reset,
    register,
    handleSubmit,
    setError,
    clearErrors,
    setValue,
    formState: { errors, isSubmitting, isValidating },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "",
    },
  });

const onSubmit = async (formData) => {
  setbutton(true);
  try {
    const { data } = await axios.post("http://localhost:5000/api/auth/register", formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    showToast("User Registered Successfully", "success");
    navigate("/login");
    reset();
    setApiError(null);
    setValue("name", "");
    setValue("email", "");
    setValue("password", "");
    setValue("role", "");
  } catch (err) {
    console.error("Register error:", err);

    const errorMessage =
      err?.response?.data?.message || "Something went wrong. Try again.";

    showToast(errorMessage, "error");
    setApiError(errorMessage);
    setbutton(false);
  }
};


  return (
    <div className="flex">
      <div className=" hidden lg:block w-1/2 h-screen bg-blue-400">
        <img className="object-cover h-full w-full" src={register1} />
      </div>
      <div className="flex lg:w-1/2  sm:w-full h-screen justify-center p-10">
        <div className="flex flex-col ">
          <div className="p-4 m-4">
            <span className="font-mont text-blue-800 text-4xl font-bold">
              Tender
            </span>
            <span className="font-mont text-blue-400 text-4xl font-bold">
              Vault
            </span>
          </div>
          <p className="text-gray-500">New User? </p>
          <h1 className="font-bold text-3xl font-mono">Register</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-5 my-10">
              <div className="">
                <TextField
                  id="outlined-basic"
                  label="Name"
                  variant="outlined"
                  className="w-full rounded-lg text-white"
                  {...register("name")}
                />
              </div>
              <div className="">
                <TextField
                  id="outlined-basic"
                  label="Role?   company/vendor"
                  variant="outlined"
                  className="w-full rounded-lg text-white"
                  {...register("role")}
                />
              </div>
              <div className="">
                <TextField
                  id="outlined-basic"
                  label="Email"
                  variant="outlined"
                  className="w-full rounded-lg text-white"
                  {...register("email")}
                />
              </div>
              <div className="relative">
                <TextField
                  id="outlined-basic"
                  label="Password"
                  variant="outlined"
                  className={`w-full rounded-lg text-white ${
                    errors.password ? "border-red-500" : ""
                  }`}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter a password"
                  {...register("password")}
                />
                <div
                  className="absolute top-8 right-1 translate-x-[-50%] translate-y-[-50%] hover:cursor-pointer"
                  onClick={() => {
                    setShowPassword((showPassword) => !showPassword);
                  }}
                >
                  {showPassword ? (
                    <AiFillEye size={20} />
                  ) : (
                    <AiFillEyeInvisible size={20} />
                  )}
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm italic">
                    {errors.password.message}
                  </p>
                )}
                {apiError && (
                  <p className="text-red-500 text-sm italic">{apiError}</p>
                )}
              </div>
              {/* <div className="">
                <label htmlFor="document" className="text-white">
                  Upload Document
                </label>
                <input
                  type="file"
                  id="document"
                  name="document"
                  accept=".pdf,.doc,.docx"
                  className="w-full rounded-lg text-white"
                  {...register("document")}
                />
              </div> */}
            </div>
            <div className="flex mx-10 p-5">
              <p
                className="
            text-gray-500 
          
            "
              >
                Already have an account?{" "}
              </p>
              <p
                className="text-blue-500 hover: cursor-pointer"
                onClick={() => {
                  navigate("/Login");
                }}
              >
                {"  "}
                Sign In
              </p>
            </div>
            {!button ? (
              <button className="py-2 px-10 mx-24 my-4 bg-blue-400  text-white  rounded-xl hover:bg-blue-500 hover:text-white hover:scale-110 duration-300">
                Register
              </button>
            ) : (
              <Loading />
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
