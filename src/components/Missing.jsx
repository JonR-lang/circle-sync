import Lottie from "lottie-react";
import animationData from "../public/animation/404-1.json";

const Missing = () => {
  return (
    <div>
      <Lottie animationData={animationData} className='w-full max-w-72' />
    </div>
  );
};

export default Missing;
