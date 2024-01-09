import Form from "../components/Form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "../state/authSlice";
import Dropzone from "react-dropzone";

const Login = () => {
  return (
    <div className='h-full w-full'>
      <div className='bg-slate-50 dark:bg-slate-900 p-3'>
        <h1 className='text-center text-slate-800 dark:text-slate-200 text-3xl font-[700]'>
          CircleSync
        </h1>
      </div>
      <div>
        <Form />
      </div>
    </div>
  );
};

export default Login;
