import React from "react";

const Navbar = () => {
  return (
    <nav className="w-full fixed flex justify-between text-xl font-bold bg-white/30 backdrop-blur-sm p-2 h-12 xs:text-lg xs:h-10 md:text-2xl">
      <ul>
        <li>Travel Blog</li>
      </ul>
      <ul className="flex gap-12 xs:gap-5 text-xl">
        <li>
          <a className="hover:text-blue-800" href="/getall">
            All Blogs
          </a>
        </li>
        <li>
          <a className="hover:text-blue-800" href="/signup">
            SignUp
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
