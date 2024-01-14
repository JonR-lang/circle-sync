import { storage } from "../utils/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { MdOutlineImage, MdDelete } from "react-icons/md";
import { useDropzone } from "react-dropzone";
import { useState, useCallback } from "react";
import NoProfile from "../public/assets/noprofile.png";
import Spinner from "./Spinner";

const PostForm = ({ setIsPostChanged }) => {
  const [isImage, setIsImage] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [isPosting, setIsPosting] = useState(false);
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [description, setDescription] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const onDrop = useCallback((acceptedFiles) => {
    setImageFile(acceptedFiles[0]);
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
    console.log(acceptedFiles[0]);
    setIsImage(true);
  }, []);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
  });
  //For deleting a the picture incase you change your mind and do not want to post it anymore.
  const handleDelete = () => {
    setIsImage(false);
    setImageFile(null);
    setImage(null);
  };
  const handleChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPosting(true);
    let imageUrl;

    try {
      if (imageFile) {
        const imageRef = ref(storage, `images/${imageFile.name + v4()}`);
        console.log(imageRef);
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
        console.log(imageUrl);
      }

      const post = {
        userId: user?._id,
        description: description,
        picturePath: imageUrl ? imageUrl : "",
      };

      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/posts`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        credentials: "include",
        body: JSON.stringify(post),
      });

      if (!response.ok) {
        if (response.status === 401) {
          const refreshResponse = await getRefreshToken();
          if (refreshResponse) {
            console.log("RefreshResponse is okay");
            await handleSubmit();
            return;
          } else {
            navigate("/login", { replace: true });
          }
        } else {
          throw new Error("Something went wrong.");
        }
      }
      const data = await response.json();
      setIsPostChanged(true);
      console.log(data);
    } catch (err) {
      setError(err.message);
      setTimeout(() => {
        setError("");
      }, 4000);
      console.log(err.message);
    } finally {
      handleDelete();
      setDescription("");
      setIsPosting(false);
    }
  };

  return (
    <>
      {error && (
        <div className='bg-red-600 text-white px-4 py-2 font-bold absolute top-5 left-[50%] translate-x-[-50%] rounded-md'>
          An Error Occured.
        </div>
      )}
      <div className='py-4'>
        {isPosting ? (
          <div className='flex flex-col items-center gap-4'>
            <Spinner message='Posting...' />
          </div>
        ) : (
          <form className='flex flex-col gap-2' onSubmit={handleSubmit}>
            <div className='flex gap-4 items-center'>
              <div className='overflow-hidden rounded-full size-16 shrink-0'>
                {user?.picturePath ? (
                  <img
                    src={`${import.meta.env.VITE_BASE_URL}/${
                      user?.picturePath
                    }`}
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
              <div className='w-full h-fit'>
                <input
                  type='text'
                  value={description}
                  className='rounded-full w-full'
                  placeholder='What is on your mind?'
                  onChange={handleChange}
                />
              </div>
            </div>
            <div
              className={`px-5 flex ${
                isImage ? "flex-col" : null
              } items-center justify-between`}>
              {isImage ? (
                <div className='mt-4 rounded-md overflow-hidden relative'>
                  <img src={image} alt={imageFile?.name} />
                  <button
                    type='button'
                    onClick={handleDelete}
                    className='p-2 bg-black/30 rounded-full absolute top-2 right-2'>
                    <MdDelete fontSize={30} />
                  </button>
                </div>
              ) : (
                <div className='flex-1 border-r-2 dark:border-r-slate-200/15 border-r-slate-500/30'>
                  <div
                    {...getRootProps()}
                    className='w-fit flex items-center opacity-80 gap-1 cursor-pointer'>
                    <input {...getInputProps()} />
                    Add Image
                    <MdOutlineImage fontSize={30} />
                  </div>
                </div>
              )}
              <div className='flex flex-1'>
                <button
                  type='submit'
                  disabled={(description || image) == null || ""}
                  className={`bg-blue-500 px-6 py-2 rounded-full ml-auto ${
                    isImage && "mt-4"
                  }`}>
                  Post
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default PostForm;
