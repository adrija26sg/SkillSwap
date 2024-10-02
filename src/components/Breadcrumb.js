import React from "react";
import { Link, useLocation } from "react-router-dom";

function Breadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const getBreadcrumbName = (path) => {
    const nameMap = {
      discover: "Discover Skills",
      sessions: "Learning Sessions",
      progress: "My Progress",
      messages: "Messages",
    };
    return nameMap[path] || path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <nav className="bg-gray-100 py-2 px-4 rounded-lg shadow-sm">
      <ol className="flex items-center space-x-2 text-sm text-gray-600">
        <li>
          <Link to="/" className="hover:text-blue-600">
            Home
          </Link>
        </li>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;

          return (
            <li key={routeTo} className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              {isLast ? (
                <span className="text-blue-600 font-medium">
                  {getBreadcrumbName(name)}
                </span>
              ) : (
                <Link to={routeTo} className="hover:text-blue-600">
                  {getBreadcrumbName(name)}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
