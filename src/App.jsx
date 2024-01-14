import { useNavigate, Routes, Route } from "react-router-dom";
import Home from "./layouts/Home";
import Login from "./layouts/Login";
import { useEffect, useLayoutEffect } from "react";
import { useSelector } from "react-redux";

function App() {
  const mode = useSelector((state) => state.mode);
  const navigate = useNavigate();
  const isAuth = Boolean(JSON.parse(localStorage.getItem("user")));
  useEffect(() => {
    window.localStorage.setItem("mode", mode);
  }, [mode]);

  useLayoutEffect(() => {
    document.body.classList.toggle("dark", mode === "dark");
  }, [mode]);

  useEffect(() => {
    if (!isAuth) {
      navigate("login");
    }
  }, []);

  return (
    <div className='bg-slate-200 dark:bg-slate-950 min-h-screen'>
      <Routes>
        <Route exact path='/login' element={<Login />} />
        <Route path='*' element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
