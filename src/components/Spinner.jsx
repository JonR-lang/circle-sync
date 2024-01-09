import { BallTriangle } from "react-loader-spinner";

const Spinner = ({ message }) => {
  return (
    <>
      <BallTriangle
        height={100}
        width={100}
        radius={5}
        color='#4fa94d'
        ariaLabel='ball-triangle-loading'
        wrapperStyle={{}}
        wrapperClass=''
        visible={true}
      />
      <div className='mt-3'>{message}</div>
    </>
  );
};

export default Spinner;
