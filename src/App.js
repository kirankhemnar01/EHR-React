import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes,useLocation } from "react-router-dom";
import Signup from "./views/authentication/sign-up";
import NotFound from "./views/error/404";
import Home from "./views/workspace/Home";
import Header from "./views/workspace/Header/header";
import Signin from "./views/authentication/sign-in";
import PhysicianDetails from "./views/workspace/Patient/View/details";
import SignupDoctor from "./views/authentication/sign-up-doctor";
import PaymentSuccess from "./views/workspace/Components/success";
import PaymentCancel from "./views/workspace/Components/payment-cancel";
import PaymentChannels from "./views/workspace/Components/payment-card-form3";
import Snackbar from "./ui-component/snackbar";

const App = () => {
  const [hideHeader, setHideHeader] = useState(false);
  // const location = useLocation();
  const currentPathname = window.location.pathname;
  console.log("currentPathname", currentPathname);
  useEffect(() => {
    if (currentPathname === "/signup" || currentPathname === "/signin") {
      setHideHeader(true)
    }
  },[currentPathname])

  return (
    <Router>
      {/* {!hideHeader && <Header />} */}
      <Header />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin/:role" element={<Signin />} />
        <Route path="/error" element={<NotFound />} />
        <Route path="/home/details/:id" element={<PhysicianDetails />} />
        <Route path="/signupDoctor" element={<SignupDoctor />} />
        <Route path="/success" element={<PaymentSuccess />} />
        <Route path="/cancel" element={<PaymentCancel />} />
        <Route path="/payment" element={<PaymentChannels />} />
      </Routes>
      <Snackbar />
    </Router>
  );
};

export default App;
