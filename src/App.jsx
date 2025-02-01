/* eslint-disable no-unused-vars */
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig/firebase";
import { PrivateRoute } from "./components/PrivateRoute";
import PrivatePage from "./pages/PrivatePage";

const App = () => {
  const [user, setUser] = useState(null);
  const [isFetch, setisFetch] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setisFetch(false);
      } else {
        setUser(null);
        setisFetch(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (isFetch) {
    return (
      <div className=" grid place-content-center font-medium h-screen">
        Loading...
      </div>
    );
  }
  return (
    <div>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/my-matches"
            element={
              <PrivateRoute user={user}>
                <PrivatePage />
              </PrivateRoute>
            }
          ></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
