import React from "react";

const Navbar_Sign = () => {
  return (
    <nav className="w-full fixed flex justify-between text-xl font-bold bg-white/30 backdrop-blur-sm p-2 h-12 xs:text-base xs:h-10 xs:w-full md:text-3xl lg:text-xl">
      <ul>
        <li>Travel Blog</li>
      </ul>
      <ul className="flex gap-12 xs:gap-8">
        <li>
          <a className="hover:text-blue-800" href="/getall">
            All Blogs
          </a>
        </li>
        <li>
          <a className="hover:text-blue-800" href="/">
            Home
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar_Sign;
