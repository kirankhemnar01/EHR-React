import React from "react";
import Header from "../workspace/Header/header";

const Layout = ({ children }) => {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
};

export default Layout;
