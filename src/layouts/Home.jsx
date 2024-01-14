import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";
import NotFound from "./NotFound";
import Profile from "./Profile";
import ErrorComponent from "../components/ErrorComponent";
import { ErrorBoundary } from "react-error-boundary";
import Feed from "./Feed";
import SearchWidget from "../widget/SearchWidget";

const Home = () => {
  const [showSearch, setShowSearch] = useState(false);

  const errorHandler = (error, errorInfo) => {
    console.log("Logging", error, errorInfo);
  };
  return (
    <div className='text-slate-900 dark:text-slate-200'>
      <Navbar showSearch={showSearch} setShowSearch={setShowSearch} />
      <ErrorBoundary FallbackComponent={ErrorComponent} onError={errorHandler}>
        <div className='px-4 py-3'>
          {showSearch && (
            <SearchWidget
              showSearch={showSearch}
              setShowSearch={setShowSearch}
            />
          )}

          <Routes>
            <Route path='/profile/:userId' element={<Profile />} />
            <Route path='/' element={<Feed />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default Home;
