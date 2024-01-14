import { FaRegComment } from "react-icons/fa6";
import { IoMdHeartEmpty, IoMdHeart, IoIosSend } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { formatDistanceToNow } from "date-fns";
import NoProfile from "../public/assets/noprofile.png";
import { useEffect, useState } from "react";
import { getRefreshToken } from "../utils/refreshToken";
import { Link } from "react-router-dom";

const PostComponent = ({ post, setIsPostChanged }) => {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [isLiked, setIsLiked] = useState(false);
  const [numberOfLikes, setNumberOfLikes] = useState("");
  const [numberOfComments, setNumberOfComments] = useState("");
  const [error, setError] = useState("");
  const [isCommentClicked, setIsCommentClicked] = useState(false);
  const [comment, setComment] = useState("");
  const [isDeleteShown, setIsDeleteShown] = useState(false);
  const [deleteModal, showDeleteModal] = useState(false);

  useEffect(() => {
    if (post && post.likes && post.likes.includes(currentUser._id)) {
      setIsLiked(true);
    }
  }, []);

  const handleLike = async (id) => {
    setIsLiked(!isLiked);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/posts/${id}/like`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "PATCH",
          credentials: "include",
          body: JSON.stringify({ userId: currentUser._id }),
        }
      );
      if (!response.ok) {
        if (response.status === 401) {
          const refreshResponse = await getRefreshToken();
          if (refreshResponse) {
            console.log("RefreshResponse is okay");
            await handleLike(id);
            return;
          } else {
            navigate("/login", { replace: true });
          }
        } else {
          throw new Error("Something went wrong.");
        }
      }
      const data = await response.json();
      setNumberOfLikes(data?.length);
    } catch (error) {
      setIsLiked(!setIsLiked);
      setError(error.message);
    } finally {
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  const handleComment = async () => {
    setIsCommentClicked(!isCommentClicked);
    setComment("");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/posts/${post._id}/comment`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            comment,
            userId: currentUser._id,
            picturePath: currentUser.picturePath,
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
          }),
        }
      );
      if (!response.ok) {
        if (response.status === 401) {
          const refreshResponse = await getRefreshToken();
          if (refreshResponse) {
            console.log("RefreshResponse is okay");
            await handleComment();
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
      setNumberOfComments(data.comments.length);
    } catch (error) {
      setError(error.message);
    } finally {
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  const handleMouseEnter = () => {
    setIsDeleteShown(true);
  };

  const handleMouseLeave = () => {
    setTimeout(() => {
      setIsDeleteShown(false);
    }, 1000);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/posts/${id}/deletePost`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!response.ok) {
        if (response.status === 401) {
          const refreshResponse = await getRefreshToken();
          if (refreshResponse) {
            console.log("RefreshResponse is okay");
            await handleDelete(id);
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
      setIsPostChanged(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  useEffect(() => {
    setNumberOfLikes(post.likes.length);
    setNumberOfComments(post.comments.length);
  }, []);

  return (
    <>
      {error && (
        <div className='bg-red-600 text-white px-4 py-2 font-bold fixed top-5 left-[50%] translate-x-[-50%] rounded-md'>
          An Error Occured!
        </div>
      )}
      {post && (
        <div
          className='flex flex-col relative'
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}>
          <div className='flex flex-col bg-slate-50 dark:bg-white/5 rounded-xl overflow-hidden'>
            <div className='flex flex-col border-b-[1px] border-b-slate-400 dark:border-b-gray-300/20 gap-4 px-2 pt-2'>
              <figure className='overflow-hidden rounded-lg '>
                {post.picturePath ? (
                  <img
                    src={post.picturePath}
                    alt='post-image'
                    className='size-full object-cover'
                  />
                ) : null}
              </figure>
              <div className='text-lg'>{post.description}</div>
              <p className='text-xs mb-1'>
                {formatDistanceToNow(post.createdAt, {
                  includeSeconds: true,
                  addSuffix: true,
                })}
              </p>
            </div>
            <div className='px-4 py-4 flex justify-between items-center'>
              <div className='flex justify-between items-center gap-3'>
                <Link to={`/profile/${post.userId}`} className='shrink-0'>
                  {post.userPicturePath ? (
                    <img
                      src={post.userPicturePath}
                      alt='profile-image'
                      className='size-12 rounded-full object-cover'
                    />
                  ) : (
                    <img
                      src={NoProfile}
                      alt='no-profile-picture'
                      className='size-12 rounded-full object-cover'
                    />
                  )}
                </Link>

                <Link
                  to={`/profile/${post.userId}`}
                  className='font-bold'>{`${post.firstName} ${post.lastName}`}</Link>
              </div>
              <div className='flex justify-between items-center gap-3'>
                <button
                  className='flex gap-2 items-center'
                  onClick={() => {
                    setIsCommentClicked(!isCommentClicked);
                    console.log("buttonclicked");
                  }}>
                  {numberOfComments !== 0 && (
                    <small className='text-sm'>
                      {numberOfComments && numberOfComments}
                    </small>
                  )}

                  <FaRegComment fontSize={26} />
                </button>
                <button
                  onClick={() => {
                    handleLike(post._id);
                  }}
                  className='flex gap-1 items-center'>
                  {numberOfLikes !== 0 && (
                    <small className='text-sm'>
                      {numberOfLikes && numberOfLikes}
                    </small>
                  )}
                  {isLiked ? (
                    <IoMdHeart fontSize={29} className='text-red-600' />
                  ) : (
                    <IoMdHeartEmpty fontSize={29} />
                  )}
                </button>
              </div>
            </div>
          </div>
          {isDeleteShown && currentUser._id === post.userId && (
            <button
              className='absolute z-10 top-3 p-2 rounded-full bg-black/40 right-3'
              type='button'
              onClick={() => showDeleteModal(true)}>
              <MdDelete fontSize={25} />
            </button>
          )}
          {deleteModal && (
            <div className='bg-black/15 fixed inset-0 flex justify-center items-center px-6 z-20 border border-orange-500'>
              <div className='rounded-lg w-full max-w-sm text-center flex flex-col bg-slate-100 dark:bg-slate-900 overflow-hidden border border-orange-500'>
                <div className='py-8 px-4 border-b border-b-orange-500'>
                  Hey there! Just checking, are you sure you want to delete this
                  post?
                </div>
                <div className='flex'>
                  <button
                    className='flex-1 py-2'
                    onClick={() => showDeleteModal(false)}>
                    Cancel
                  </button>
                  <button
                    className='flex-1 bg-red-600 text-white py-2'
                    onClick={() => {
                      showDeleteModal(false);
                      handleDelete(post._id);
                    }}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {isCommentClicked && (
        <div className='w-full text-sm bg-slate-50 dark:bg-white/5 p-4 rounded-md -mt-3'>
          <div className='relative w-full rounded-sm overflow-hidden'>
            <input
              type='text'
              name='comment'
              id='comment'
              placeholder='Add a comment'
              value={comment}
              className='dark:border dark:border-slate-500 border-b border-b-slate-300 bg-transparent shadow-none rounded-none p-0 py-1 px-2 focus:outline-none w-full h-full'
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              className='absolute right-2 top-[50%] translate-y-[-50%]'
              onClick={handleComment}
              disabled={!comment}>
              <IoIosSend fontSize={24} />
            </button>
          </div>
          <div className='flex flex-col gap-4 mt-2 max-h-96 overflow-y-auto'>
            {post.comments.length !== 0 ? (
              post.comments.map((user, index) => (
                <div className='flex gap-2 items-center' key={index}>
                  <Link to={`/profile/${user.userId}`} className='shrink-0'>
                    {user.picturePath ? (
                      <img
                        src={user.picturePath}
                        alt='profile-picture'
                        className='size-10 rounded-full shrink-0'
                      />
                    ) : (
                      <img
                        src={NoProfile}
                        alt='no-profile-picture'
                        className='size-10 rounded-full shrink-0'
                      />
                    )}
                  </Link>
                  <div className='flex flex-col'>
                    <Link
                      to={`/profile/${user.userId}`}
                      className='font-bold'>{`${user.firstName} ${user.lastName}`}</Link>
                    <p>{user.comment}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className='mt-2'>Be the first to comment {":)"}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PostComponent;
