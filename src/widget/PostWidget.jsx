import PostForm from "../components/PostForm";
import { useState, useEffect } from "react";
import PostComponent from "../components/PostComponent";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router-dom";
import { useErrorBoundary } from "react-error-boundary";
import { getRefreshToken } from "../utils/refreshToken";

const PostWidget = () => {
  const [posts, setPosts] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { showBoundary } = useErrorBoundary();
  const [isPostChanged, setIsPostChanged] = useState(false);

  const getPosts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/posts`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401) {
          const refreshResponse = await getRefreshToken();
          if (refreshResponse) {
            console.log("RefreshResponse is okay");
            await getPosts();
            return;
          } else {
            navigate("/login", { replace: true });
          }
        } else {
          throw new Error(
            "Failed to fetch resource. Check your internet connection and try again."
          );
        }
      }

      const data = await response.json();
      setPosts(data);
      setIsLoading(false);
    } catch (error) {
      console.log("Fetch posts error:", error);
      setIsLoading(false);
      showBoundary(error);
    }
  };

  useEffect(() => {
    getPosts();
    setIsPostChanged(false);
  }, [isPostChanged]);

  return (
    <div className='text-slate-900 dark:text-slate-200 flex-[2] order-3 sm:order-2 overflow-y-scroll h-screen'>
      <PostForm setIsPostChanged={setIsPostChanged} />
      {isLoading && (
        <div className='min-h-[100vh-75px] z-10 flex flex-col justify-center items-center'>
          <Spinner message='Updating your feed...' />
        </div>
      )}
      <div className='flex flex-col gap-4'>
        {posts?.map((post, index) => (
          <PostComponent
            key={index}
            post={post}
            setIsPostChanged={setIsPostChanged}
          />
        ))}
      </div>
    </div>
  );
};

export default PostWidget;
