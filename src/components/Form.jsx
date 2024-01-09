import { useFormik } from "formik";
import { MdEdit } from "react-icons/md";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "../state/authSlice";
import { useDropzone } from "react-dropzone";
import { useCallback, useState } from "react";

const registerSchema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Please fill in this field"),
  email: yup
    .string()
    .required("Please put in your email")
    .email("Must be an email!"),
  password: yup.string().required("Please fill in a password"),
  location: yup.string().required("Please fill in this field."),
  personalInterests: yup.string().required("Please fill in this filled."),
  picture: yup.string().required("Please put in a profile picture"),
});
const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required("Please put in your email")
    .email("Must be an email!"),
  password: yup.string().required("Please fill in a password"),
});

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  location: "",
  personalInterests: "",
  picture: "",
};

const initialValuesLogin = {
  email: "",
  password: "",
};
const Form = () => {
  const [pageType, setPageType] = useState("login");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.length
      ? formik.setFieldValue("picture", acceptedFiles[0])
      : formik.setFieldValue("picture", "");
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpeg"],
    },
  });
  const formik = useFormik({
    initialValues: isLogin ? initialValuesLogin : initialValuesRegister,
    validationSchema: isLogin ? loginSchema : registerSchema,
    onSubmit: (values, { setErrors }) => {
      if (isLogin) {
        const logUser = async () => {
          try {
            const response = await fetch(
              `${import.meta.env.VITE_BASE_URL}/auth/login`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(values),
              }
            );
            const data = await response.json();
            if (data.errors) throw new Error(JSON.stringify(data.errors)); //It was stringified so that it can be used by the browser.

            localStorage.setItem("user", JSON.stringify(data.user));
            dispatch(setLogin({ user: data.user }));
            navigate("/", { replace: true });
            console.log(data);
          } catch (err) {
            const errorMessage = JSON.parse(err.message); //Here, it is. You can then parse it so that you can do with it what you want.
            setErrors(errorMessage);
            console.log(errorMessage);
          }
        };
        logUser();
      }

      if (isRegister) {
        const registerUser = async () => {
          //because you are sending a picture, you use the formData object and then append all the values to the formData, before sending to the server.
          const formData = new FormData();
          for (let value in values) {
            formData.append(value, values[value]);
          }
          formData.append("picture", values.picture); //This sends the file itself so that it can be stored on the server.
          formData.append("picturePath", values.picture.name); //This sends the name of the file, which inturn is the path to the file.

          try {
            const response = await fetch(
              `${import.meta.env.VITE_BASE_URL}/auth/register`,
              {
                method: "POST",
                body: formData,
              }
            );
            const data = await response.json();
            if (data.errors) throw new Error(JSON.stringify(data.errors));
            setPageType("login");
          } catch (err) {
            const errorMessage = JSON.parse(err.message);
            setErrors(errorMessage);
            console.log(err.message);
          }
        };
        registerUser();
      }
    },
  });

  return (
    <div className='h-full w-full max-w-3xl mx-auto'>
      <form onSubmit={formik.handleSubmit}>
        {isLogin && (
          <div className='flex flex-col gap-4 p-3'>
            <div>
              <label htmlFor='email'>Email</label>
              <input
                type='text'
                name='email'
                id='email'
                placeholder='chathive@example.com'
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <div className='text-red-600 text-xs mt-1'>
                {formik.errors.email &&
                  formik.touched.email &&
                  formik.errors.email}
              </div>
            </div>
            <div>
              <label htmlFor='password'>Password</label>
              <input
                type='password'
                name='password'
                id='password'
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <div className='text-red-600 text-xs mt-1'>
                {formik.errors.password &&
                  formik.touched.password &&
                  formik.errors.password}
              </div>
            </div>
            <button
              className='col-span-2 bg-slate-900 text-slate-200 py-3 rounded-md hover:bg-slate-800'
              type='submit'>
              Login
            </button>
            <div className='text-xs text-slate-800 dark:text-slate-200'>
              Don't have an accout?
              <button
                type='button'
                className='ml-1 underline'
                onClick={() => {
                  setPageType("register");
                  formik.resetForm();
                }}>
                Sign up
              </button>
            </div>
          </div>
        )}
        {isRegister && (
          <div className='grid grid-cols-2 gap-4 p-3'>
            <h1 className='col-span-2 text-xl text-slate-800 dark:text-slate-200 font-bold'>
              Welcome to ChatHive!
            </h1>
            <div>
              <label htmlFor='firstName'>First Name</label>
              <input
                type='text'
                name='firstName'
                id='firstName'
                placeholder='Jane'
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <div className='text-red-600 text-xs mt-1'>
                {formik.errors.firstName &&
                  formik.touched.firstName &&
                  formik.errors.firstName}
              </div>
            </div>
            <div>
              <label htmlFor='lastName'>Last Name</label>
              <input
                type='text'
                name='lastName'
                id='lastName'
                placeholder='Doe'
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <div className='text-red-600 text-xs mt-1'>
                {formik.errors.lastName &&
                  formik.touched.lastName &&
                  formik.errors.lastName}
              </div>
            </div>
            <div className='col-span-2'>
              <label htmlFor='email'>Email</label>
              <input
                type='text'
                name='email'
                id='email'
                placeholder='chathive@example.com'
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <div className='text-red-600 text-xs mt-1'>
                {formik.errors.email &&
                  formik.touched.email &&
                  formik.errors.email}
              </div>
            </div>
            <div className='col-span-2'>
              <label htmlFor='password'>Password</label>
              <input
                type='password'
                name='password'
                id='password'
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <div className='text-red-600 text-xs mt-1'>
                {formik.errors.password &&
                  formik.touched.password &&
                  formik.errors.password}
              </div>
            </div>
            <div className='col-span-2'>
              <label htmlFor='personalInterests'>
                Personal Interests/Hobbies
              </label>
              <input
                type='text'
                name='personalInterests'
                id='personalInterests'
                placeholder='favorite movies, hobbies, values'
                value={formik.values.personalInterests}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <div className='text-red-600 text-xs mt-1'>
                {formik.errors.personalInterests &&
                  formik.touched.personalInterests &&
                  formik.errors.personalInterests}
              </div>
            </div>
            <div className='col-span-2'>
              <label htmlFor='location'>Location</label>
              <input
                type='text'
                name='location'
                id='location'
                value={formik.values.location}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <div className='text-red-600 text-xs mt-1'>
                {formik.errors.location &&
                  formik.touched.location &&
                  formik.errors.location}
              </div>
            </div>
            <div
              {...getRootProps()}
              className='col-span-2 h-40 border-2 border-dashed rounded-md p-8 border-slate-500 flex items-center justify-center'>
              <input {...getInputProps()} />
              {!formik.values.picture ? (
                <div>
                  {isDragActive ? (
                    <p>Drop the files here ...</p>
                  ) : (
                    <div>
                      <p className='bg-slate-300 dark:bg-slate-900 p-10 hidden sm:block text-slate-900 dark:text-slate-200 cursor-pointer'>
                        Drag 'n' drop photo, or click to upload.
                      </p>
                      <p className='bg-slate-300 dark:bg-slate-900 p-10 sm:hidden text-slate-900 dark:text-slate-200'>
                        Click to upload photo.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className='w-full flex justify-between bg-slate-300 dark:bg-slate-900 p-10 text-slate-900 dark:text-slate-200'>
                  <p>{formik.values.picture.name}</p>
                  <button type='button'>
                    <MdEdit />
                  </button>
                </div>
              )}
            </div>
            <button
              className='col-span-2 bg-slate-900 text-slate-200 py-3 rounded-md hover:bg-slate-800'
              type='submit'>
              Sign up
            </button>
            <div className='text-xs text-slate-800 dark:text-slate-200'>
              Already a member?
              <button
                type='button'
                className='ml-1 underline'
                onClick={() => {
                  setPageType("login");
                  formik.resetForm();
                }}>
                Log in
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default Form;
