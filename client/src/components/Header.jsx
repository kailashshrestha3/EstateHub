import React from "react";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-slate-300">
      <div className="flex items-center justify-between p-3 mx-auto max-w-6xl">
        <h1 className="text-sm sm:text-xl font-bold">
          <Link to="/">
            <span className="text-slate-500">Real</span>
            <span className="text-slate-700">State</span>
          </Link>
        </h1>
        <form className="flex items-center px-2 py-1 border rounded-xl w-24 sm:w-64">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none "
          />
          <FaSearch className="text-slate-500" />
        </form>
        <ul className="flex items-center gap-4 ">
          <li>
            <Link
              to="/"
              className="hidden sm:inline text-slate-700 hover:underline"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className="hidden sm:inline text-slate-700 hover:underline"
            >
              About
            </Link>
          </li>
          <li>
            <Link to="/signin" className="text-slate-700 hover:underline">
              Sign in
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
