import UserWidget from "../widget/UserWidget";
import PostWidget from "../widget/PostWidget";
import FriendWidget from "../widget/FriendWidget";

const Feed = () => {
  return (
    <div className='flex flex-col gap-4 sm:flex-row w-full justify-center'>
      <UserWidget />
      <PostWidget />

      <div className='flex-1 order-2 sm:order-3'>
        <FriendWidget />
      </div>
    </div>
  );
};

export default Feed;
