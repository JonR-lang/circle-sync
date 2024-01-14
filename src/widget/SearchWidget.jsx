import { useEffect, useState } from "react";
import Search from "../components/Search";
import { Link } from "react-router-dom";
import NoProfile from "../public/assets/noprofile.png";
import FoundUsers from "../components/FoundUsers";

const SearchWidget = ({ setShowSearch }) => {
  const [users, setUsers] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const searchUser = async () => {
    console.log("clicked");
    try {
      setIsLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/users/search/${searchTerm}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();
      setUsers(data);
      console.log(data);
    } catch (err) {
      console.log(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) searchUser();
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  return (
    <div className='absolute top-0 left-0 z-10 w-full bg-slate-100 dark:bg-slate-950 shadow-lg'>
      <div className='flex gap-2 p-2 px-4'>
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <button
          onClick={() => {
            setShowSearch(false);
          }}>
          cancel
        </button>
      </div>
      <div className='px-3 py-5 space-y-3'>
        {users && users.length > 0 ? (
          users.map((user, index) => (
            <Link
              to={`/profile/${user._id}`}
              key={index}
              onClick={() => {
                setShowSearch(false);
              }}
              className='flex items-center gap-3'>
              {user?.picturePath ? (
                <img
                  src={user.picturePath}
                  alt='user-profile-image'
                  className='size-12 shrink-0 rounded-full object-cover'
                />
              ) : (
                <img
                  src={NoProfile}
                  alt='user-profile-image'
                  className='size-12 shrink-0 rounded-full object-cover'
                />
              )}
              <p className='font-bold'>{`${user.firstName} ${user.lastName}`}</p>
            </Link>
          ))
        ) : !searchTerm ? (
          <div>Scour Userbase..</div>
        ) : (
          <div>No users found</div>
        )}
      </div>
    </div>
  );
};

export default SearchWidget;
