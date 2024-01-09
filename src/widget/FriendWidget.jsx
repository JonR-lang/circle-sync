import Friend from "../components/Friend";
import { useEffect, useState } from "react";
import { delay, motion } from "framer-motion";
import { getRefreshToken } from "../utils/refreshToken";
import { FaCaretDown, FaCaretUp } from "react-icons/fa6";

const FriendWidget = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [friends, setFriends] = useState(null);
  const dropDownVariants = {
    open: { opacity: 1, height: "auto" },
    close: { opacity: 0, height: "0" },
  };

  const getUserFriends = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/users/${
          userId ? userId : currentUser._id
        }/friends`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!response.ok) {
        if (response.status === 401) {
          console.log(response);
          const refreshResponse = await getRefreshToken();
          if (refreshResponse) {
            console.log("RefreshResponse is okay");
            await getUserFriends();
            return;
          } else {
            navigate("/login", { replace: true });
          }
        } else {
          throw new Error("Something went wrong.");
        }
      }

      const data = await response.json();

      setFriends(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getUserFriends();
  }, [userId]);

  return (
    <div className='mt-2'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='text-slate-900 dark:text-slate-200 flex items-center dark:bg-white/5 bg-white/20 p-3 rounded-md justify-between sm:hidden w-full shadow-md'>
        <p className='text=lg font-bold'>Friends</p>
        {isOpen ? <FaCaretUp /> : <FaCaretDown />}
      </button>
      <motion.div
        initial={false}
        animate={isOpen ? "open" : "close"}
        variants={dropDownVariants}
        className='overflow-hidden block sm:hidden'>
        {friends && friends?.length === 0 && (
          <div className=' dark:bg-white/5 bg-white/20 p-3 rounded flex-1'>
            No friends to display
          </div>
        )}

        <div className='flex flex-col py-2 gap-3 flex-1'>
          {friends &&
            friends?.map((friend, index) => (
              <Friend
                key={index}
                friend={friend && friend}
                friends={friends && friends}
                setFriends={setFriends}
                userIdParams={userId}
              />
            ))}
        </div>
      </motion.div>
      <h2 className='text-xl font-bold tracking-wider hidden sm:block'>
        Friends
      </h2>
      <div className='hidden sm:block'>
        {friends && friends?.length === 0 && (
          <div className=' dark:bg-white/5 bg-white/20 p-3 rounded'>
            No friends to display
          </div>
        )}

        <div className='flex flex-col py-2 gap-3 flex-1'>
          {friends &&
            friends?.map((friend, index) => (
              <Friend
                key={index}
                friend={friend && friend}
                friends={friends && friends}
                setFriends={setFriends}
                userIdParams={userId}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default FriendWidget;
