import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Account from "./pages/Account";
import ProtectedRoute from "./firebaseConfig/ProtectedRoute.jsx";
import OrganDonar from "./pages/OrganDonar.jsx";
import BloodDonorPage from "./pages/BloodDonorPage.jsx";

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/blood-donar" element={<BloodDonorPage />} />
        <Route path="/organ-donar" element={<OrganDonar />} />

        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
