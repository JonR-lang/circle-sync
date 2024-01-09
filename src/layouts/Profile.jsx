import PostComponent from "../components/PostComponent";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import UserWidget from "../widget/UserWidget";
import FriendWidget from "../widget/FriendWidget";
import Lottie from "lottie-react";
import animationData from "../public/animation/Animation - 1704511751365.json";

const Profile = () => {
  const { userId } = useParams();
  const [posts, setPosts] = useState();

  const getUserPosts = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/posts/${userId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!response.ok) {
        console.log("Response not okay o");
        if (response.status === 401) {
          console.log(response);
          const refreshResponse = await fetch(
            "http://localhost:3001/auth/refresh-token",
            {
              method: "POST",
              credentials: "include",
            }
          );

          if (refreshResponse.ok) {
            console.log("RefreshResponse is okay");
            await getUserPosts();
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
      setPosts(data);
    } catch (err) {}
  };

  useEffect(() => {
    getUserPosts();
  }, [userId]);
  return (
    <div className='py-4 flex sm:flex-row flex-col max-w-[900px] mx-auto gap-3'>
      <div className='flex-1'>
        <UserWidget userId={userId} />
        <FriendWidget userId={userId} />
      </div>
      <div className='flex flex-col gap-3 flex-[1.5]'>
        {posts && posts.length > 0 ? (
          posts?.map((post) => <PostComponent key={post._id} post={post} />)
        ) : (
          <div className='flex-[1.5] text-2xl font-bold text-center mt-4 items-center flex flex-col gap-4'>
            <Lottie animationData={animationData} className='w-full max-w-72' />
            <p>User's Feed is Quiet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
