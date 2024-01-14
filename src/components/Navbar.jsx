import { useState } from "react";
import {
  MdSearch,
  MdMessage,
  MdDarkMode,
  MdLightMode,
  MdNotifications,
  MdMenu,
  MdHelp,
  MdClose,
} from "react-icons/md";
import { FaChevronDown } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { setMode } from "../state/authSlice";
import { useNavigate, Link } from "react-router-dom";
import Tippy from "@tippyjs/react";
import Tooltip from "./ToolTip";
const buttonStyle =
  "hover:scale-125 transition ease-in text-slate-800 dark:text-slate-200 text-3xl sm:text-lg";

const Navbar = ({ setShowSearch }) => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const dispatch = useDispatch();
  const [isDropDown, setIsDropDown] = useState(false);
  const navigate = useNavigate();
  const mode = useSelector((state) => state.mode);

  const handleDropDown = () => {
    setIsDropDown(!isDropDown);
  };
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <div
      className={`bg-slate-50 h-[70px] dark:bg-slate-900 flex justify-between items-center px-6 gap-4`}>
      <div>
        <Link to='/'>
          <h1 className='text-slate-800 dark:text-slate-200 text-2xl font-[700] mt-1'>
            CircleSync
          </h1>
        </Link>
      </div>
      <button
        className='-mr-3 sm:hidden ml-auto'
        onClick={() => {
          setShowSearch(true);
        }}>
        <MdSearch fontSize={34} />
      </button>

      <button
        className='-mt-1 sm:hidden text-slate-800 dark:text-slate-200'
        type='button'
        onClick={() => {
          setIsMobileMenuToggled(true);
        }}>
        <MdMenu fontSize={36} />
      </button>

      <div
        className={`sm:flex-1 bg-slate-50 sm:bg-transparent shadow-md sm:shadow-none fixed z-10 sm:static sm:w-auto w-[60%] ${
          isMobileMenuToggled ? "right-0" : "right-[-100%]"
        } top-0 sm:h-auto h-full transition-[right] duration-300 ease-in sm:dark:bg-transparent dark:bg-slate-900`}>
        <button
          type='button'
          onClick={() => {
            setIsMobileMenuToggled(false);
          }}
          className='absolute p-2 top-0 right-0 sm:hidden text-slate-800 dark:text-slate-200'>
          <MdClose fontSize={38} />
        </button>
        <div className='flex sm:flex-row flex-col sm:space-x-4 sm:justify-end sm:mt-0 mt-20 sm:space-y-0 space-y-8 items-center'>
          <Tippy content={<Tooltip message='Theme' />}>
            <button
              type='button'
              className={buttonStyle}
              onClick={() => {
                dispatch(setMode());
              }}>
              {mode === "light" ? <MdLightMode /> : <MdDarkMode />}
            </button>
          </Tippy>
          <Tippy content={<Tooltip message='messages' />}>
            <button type='button' className={buttonStyle}>
              <MdMessage />
            </button>
          </Tippy>
          <Tippy content={<Tooltip message='notifications' />}>
            <button type='button' className={buttonStyle}>
              <MdNotifications />
            </button>
          </Tippy>
          <Tippy content={<Tooltip message='help' />}>
            <button type='button' className={buttonStyle}>
              <MdHelp />
            </button>
          </Tippy>
          <button
            type='button'
            className={`${buttonStyle} hidden sm:block`}
            onClick={() => {
              setShowSearch(true);
            }}>
            <MdSearch />
          </button>

          <div className='relative  text-xs'>
            <div className='rounded-md'>
              <button
                type='button'
                className=' dark:bg-slate-200 bg-slate-800 text-slate-200 dark:text-slate-800 size-full p-2 items-center flex gap-2 rounded-md'
                onClick={handleDropDown}>
                Account
                <FaChevronDown fontSize={12} className='-mt-1' />
              </button>
            </div>
            {isDropDown && (
              <ul className='absolute shadow-md rounded-sm w-full  top-[110%]'>
                <li className='dark:bg-slate-200 bg-slate-800 text-slate-200 dark:text-slate-800'>
                  <button
                    type='button'
                    onClick={handleLogout}
                    className='size-full p-2'>
                    Log Out
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
