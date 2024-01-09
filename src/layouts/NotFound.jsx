import Navbar from "../components/Navbar";
import Missing from "../components/Missing";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <>
      <Navbar />
      <div className='flex flex-col items-center justify-center min-h-[calc(100vh-75px)] text-slate-900 dark:text-slate-200'>
        <Missing />
        <p className='text-center text-lg'>
          Lost in the digital ether, seeking truth amidst the bytes.
        </p>
        <button
          type='button'
          className='mt-6 px-4 py-2 bg-slate-800 rounded-md text-slate-200'
          onClick={() => {
            navigate("/");
          }}>
          Home page
        </button>
      </div>
    </>
  );
};

export default NotFound;
