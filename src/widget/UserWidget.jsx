import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import NoProfile from "../public/assets/noprofile.png";
import { MdModeEditOutline, MdLocationOn } from "react-icons/md";
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import { FaTwitter, FaInstagram, FaLink } from "react-icons/fa6";
import { getRefreshToken } from "../utils/refreshToken";
import { MdOutlinePersonAdd, MdOutlinePersonRemove } from "react-icons/md";

const UserWidget = ({ userId }) => {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [editSocial, setEditSocial] = useState("");
  const [socialInput, setSocialInput] = useState("");
  const [isSocialInputUpdated, setIsSocialInputUpdated] = useState(false);
  const [user, setUser] = useState();
  const [isFriend, setIsFriend] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const isTwitter = editSocial === "twitter";

  const getCurrentUser = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/users/${currentUser._id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          const refreshResponse = await getRefreshToken();
          if (refreshResponse) {
            console.log("RefreshResponse is okay");
            await getCurrentUser();
            return;
          } else {
            navigate("/login", { replace: true });
          }
        } else {
          throw new Error("Something went wrong.");
        }
      }

      const data = await response.json();
      setUser(data);
    } catch (err) {
      console.log(err.message);
    }
  };

  const getUserProfile = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/users/${userId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          const refreshResponse = await getRefreshToken();
          if (refreshResponse) {
            console.log("RefreshResponse is okay");
            await getUserProfile();
            return;
          } else {
            navigate("/login", { replace: true });
          }
        } else {
          throw new Error("Something went wrong.");
        }
      }

      const data = await response.json();
      setUser(data);
    } catch (err) {
      console.log(err.message);
    }
  };

  const patchFriend = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/users/${userId}/${currentUser._id}`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

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
      setIsFriend(!isFriend);
      console.log(err.message);
      setError("An Error Occured");
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  const handleAddFriend = async () => {
    setIsFriend(!isFriend);
    await patchFriend();
  };

  const handleSocialsSubmit = async () => {
    const keyName = isTwitter ? "twitter" : "instagram";
    console.log(keyName);
    console.log(socialInput);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/users/${currentUser._id}/${
          isTwitter ? "updateTwitter" : "updateInstagram"
        }`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "PUT",
          body: JSON.stringify({ [keyName]: socialInput }),
          credentials: "include",
        }
      );
      if (!response.ok) {
        if (response.status === 401) {
          const refreshResponse = await getRefreshToken();
          if (refreshResponse) {
            console.log("RefreshResponse is okay");
            await handleSocialsSubmit();
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
      setIsSocialInputUpdated(true);
    } catch (error) {
      console.log(error.message);
      setError("An Error Occured");
      setTimeout(() => {
        setError("");
      }, 3000);
    } finally {
      setEditSocial("");
      setSocialInput("");
    }
  };

  useEffect(() => {
    if (userId) {
      getUserProfile();
    } else {
      getCurrentUser();
      setIsSocialInputUpdated(false);
    }
  }, [userId, isSocialInputUpdated]);

  useEffect(() => {
    if (user && user.friends) {
      setIsFriend(user.friends.includes(currentUser._id));
    } else {
      setIsFriend(false);
    }
  }, [user]);

  return (
    <>
      {error && (
        <div className='bg-red-600 text-white px-4 py-2 font-bold fixed top-5 left-[50%] translate-x-[-50%] rounded-md'>
          An Error Occured!
        </div>
      )}
      {user && (
        <div className='flex flex-col order-1 w-full gap-2 text-slate-900 dark:text-slate-200 flex-1'>
          <div className='p-3 rounded flex items-center justify-between gap-3 dark:bg-white/10 bg-white/20 shadow-md'>
            <div className='overflow-hidden rounded-full size-16 shrink-0'>
              {user?.picturePath ? (
                <img
                  src={user?.picturePath}
                  alt='user-image'
                  className='size-full object-cover'
                />
              ) : (
                <img
                  src={NoProfile}
                  alt='user-image'
                  className='size-full object-cover'
                />
              )}
            </div>

            <div className='mr-auto'>
              <Link to={`/profile/${user._id}`}>
                <h2 className='text-xl font-bold'>{`${user.firstName} ${user.lastName}`}</h2>
              </Link>

              {isFriend && <p className='text-sm opacity-80'>Friends</p>}
            </div>
            {userId && userId !== currentUser._id && (
              <button onClick={handleAddFriend}>
                {isFriend ? (
                  <MdOutlinePersonRemove fontSize={36} />
                ) : (
                  <MdOutlinePersonAdd fontSize={36} />
                )}
              </button>
            )}
          </div>

          <div className='p-3 rounded flex flex-col gap-2 bg-white/20 dark:bg-white/10 shadow-md'>
            <div className='flex gap-4 items-center'>
              <MdLocationOn fontSize={38} />
              <p className='text-sm opacity-80'>{user.location}</p>
            </div>
            <div className='flex gap-4 items-center'>
              <GiPerspectiveDiceSixFacesRandom fontSize={36} />
              <p className='text-sm opacity-80'>{user.personalInterests}</p>
            </div>
          </div>

          <div className='p-3 rounded dark:bg-white/10 bg-white/20 shadow-md'>
            <div className='flex justify-between items-center'>
              <p className='opacity-80 text-sm'>Profile views</p>
              <span className='font-bold'>{user.viewedProfile}</span>
            </div>
            <div className='flex justify-between items-center'>
              <p className='opacity-80 text-sm'>Post impressions</p>
              <span className='font-bold'>{user.impressions}</span>
            </div>
          </div>
          <div className='p-3 rounded dark:bg-white/10 bg-white/20 space-y-4 shadow-md'>
            <h3 className='text-xl font-bold'>Social Profiles</h3>
            <div className='flex gap-3 items-center'>
              <FaTwitter fontSize={30} />
              <div className='flex flex-col'>
                <h4 className='font-bold'>Twitter</h4>
                {user?.socials?.twitter ? (
                  <a
                    href={`https://www.twitter.com/${user.socials.twitter}`}
                    target='_blank'
                    rel='noreferrer noopener'
                    className='text-xs opacity-80 text-blue-500'>
                    <div className='flex gap-1 items-center'>
                      <FaLink />
                      {user.socials.twitter.length > 15
                        ? user.socials.twitter.slice(0, 3).concat("...")
                        : user.socials.twitter}
                    </div>
                  </a>
                ) : (
                  <p className='text-xs opacity-80'>None provided</p>
                )}
              </div>
              {!!!userId && (
                <button
                  onClick={() => setEditSocial("twitter")}
                  className='ml-auto'>
                  <MdModeEditOutline fontSize={20} />
                </button>
              )}
            </div>
            <div className='flex gap-3 items-center'>
              <FaInstagram fontSize={30} />
              <div className='flex flex-col'>
                <h4 className='font-bold'>Instagram</h4>
                {user?.socials?.instagram ? (
                  <a
                    href={`https://www.instagram.com/${user.socials.instagram}`}
                    target='_blank'
                    rel='noreferrer noopener'
                    className='text-xs opacity-80 text-blue-500'>
                    <div className='flex gap-1 items-center'>
                      <FaLink />{" "}
                      {user.socials.instagram.length > 15
                        ? user.socials.instagram.slice(0, 15).concat("...")
                        : user.socials.instagram}
                    </div>
                  </a>
                ) : (
                  <p className='text-xs opacity-80'>None provided</p>
                )}
              </div>
              {!!!userId && (
                <button
                  onClick={() => setEditSocial("instagram")}
                  className='ml-auto'>
                  <MdModeEditOutline fontSize={20} />
                </button>
              )}
            </div>
          </div>
          <div
            className={`p-3 rounded dark:bg-slate-900 bg-slate-200 border border-slate-900 shadow-xl fixed right-5 ${
              !!editSocial ? "bottom-5" : "bottom-[-100%] z-10"
            } left-5 transition-[bottom]`}>
            <div className={`${editSocial ? "block" : "hidden"}`}>
              <h3 className='py-2 font-semibold text-lg'>
                {isTwitter ? "Twitter" : "Instagram"} Username
              </h3>
              <input
                type='text'
                value={socialInput}
                onChange={(e) => setSocialInput(e.target.value)}
              />
              <div className='flex gap-3 justify-end mt-3'>
                <button
                  type='button'
                  onClick={() => {
                    setEditSocial("");
                  }}
                  className='px-2 py-1 rounded-md bg-red-500 dark:bg-red-600 text-white w-20'>
                  Cancel
                </button>
                <button
                  type='button'
                  className='px-2 py-1 rounded-md border border-slate-800 dark:border-slate-200 w-20'
                  onClick={handleSocialsSubmit}
                  disabled={!socialInput}>
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserWidget;
