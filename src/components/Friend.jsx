import { useEffect, useState } from "react";
import { MdOutlinePersonAdd, MdOutlinePersonRemove } from "react-icons/md";
import { Link } from "react-router-dom";
import NoProfile from "../public/assets/noprofile.png";
import { getRefreshToken } from "../utils/refreshToken";

const Friend = ({ friend, friends, setFriends, userIdParams }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [error, setError] = useState("");
  const [isFriend, setIsFriend] = useState(false);

  useEffect(() => {
    //On componentdid mount, this hook runs, so that the isFriend state is properly set for each component. I might remove this, because it useless. Because the code belows handles the removal of friends from the list once the user removes the friend.
    if (friend && friend.friends && friend.friends.includes(user._id)) {
      setIsFriend(true);
    } else {
      setIsFriend(false);
    }
  }, [friends]);

  const patchFriend = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/users/${user._id}/${friend._id}`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      //If the response is not okay, check the reason for this, and if the reason for this is because the access token is expired, request a new one via the refresh token. If the refresh token is expired, the user is redirected to the login page.
      if (!response.ok) {
        if (response.status === 401) {
          const refreshResponse = await getRefreshToken();
          if (refreshResponse) {
            console.log("RefreshResponse is okay");
            await patchFriend();
            return;
          } else {
            navigate("/login", { replace: true });
          }
        } else {
          throw new Error("Something went wrong.");
        }
      }
      const data = await response.json();

      console.log(data);
    } catch (err) {
      //In the case of an error, the isFriend state is reverted to what it was. CHECK handleAddFriend() to understand why. Also, because when the button is clicked, the new friend is added to the array before making the patch request. So in the event of an error, the friends is changed to what it was before, then and error message is displayed at the top of the screen for 3 seconds.
      if (!userIdParams) {
        setIsFriend(!isFriend);
        const previousFriends = [...friends]; //back up of the initial friends array.
        setFriends(previousFriends);
      }

      console.log(err.message);
      setError("An Error Occured");
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  // When the button is clicked, the value of this which is a boolean, changes to the opposite. Then, as seen below, before the patch request is made, the friend Id is already added to the array. This is done this way for smoother user experience. However, if the patch request fails, it is removed from the array.
  const handleAddFriend = async () => {
    setIsFriend(!isFriend);
    console.log(isFriend);
    if (!userIdParams) {
      if (!isFriend) {
        setFriends([...friends, friend]);
      } else {
        setFriends((prevFriends) =>
          prevFriends.filter(
            (existingFriend) => existingFriend._id !== friend._id
          )
        );
      }
    }

    await patchFriend();
    console.log("This button was clicked!");
  };

  return (
    <div className='text-slate-900 dark:text-slate-200 flex items-center dark:bg-white/5 bg-white/20 shadow-md gap-3 p-3 rounded-md'>
      {friend?.picturePath ? (
        <img
          src={`http://localhost:3001/${friend?.picturePath}`}
          alt='user-image'
          className='size-16 object-cover rounded-full shrink-0'
        />
      ) : (
        <img
          src={NoProfile}
          alt='user-image'
          className='size-16 object-cover rounded-full shrink-0'
        />
      )}
      <Link to={`/profile/${friend?._id}`}>
        <h4>{`${friend?.firstName} ${friend?.lastName}`}</h4>
      </Link>
      {friend?._id !== user._id && (
        <button type='button' onClick={handleAddFriend} className='ml-auto'>
          {isFriend ? (
            <MdOutlinePersonRemove fontSize={30} />
          ) : (
            <MdOutlinePersonAdd fontSize={30} />
          )}
        </button>
      )}
    </div>
  );
};

export default Friend;
