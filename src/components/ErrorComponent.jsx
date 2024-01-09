import animationData from "../public/animation/network-error.json";
import Lottie from "lottie-react";

const ErrorComponent = ({ error }) => {
  return (
    <div className='min-h-[calc(100vh-70px)] bg-black/10 flex flex-col items-center justify-center p-4 gap-2 text-slate-900 dark:text-slate-200'>
      <Lottie animationData={animationData} className='w-full max-w-72' />
      {error.message.includes("Failed to fetch") ? (
        <div className='text-center text-base'>
          Failed to fetch feed. Check your internet connection or try again
          later.
        </div>
      ) : (
        <p className='text-center text-base'>Something went wrong.</p>
      )}
    </div>
  );
};

export default ErrorComponent;
