import React from "react";
import Navigation from "./Navigation";
import Breadcrumb from "./Breadcrumb";

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-6">
        <Breadcrumb />
        <main className="mt-6">{children}</main>
      </div>
    </div>
  );
}

export default Layout;
