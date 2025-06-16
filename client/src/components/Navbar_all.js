import React from "react";

const Navbar_all = () => {
  return (
    <nav className="w-full h-14 flex justify-between text-lg font-bold bg-blue-400/30 backdrop-blur-sm p-2 xs:text-base xs:h-10 xs:w-full md:text-2xl lg:text-2xl">
      <ul>
        <li>Travel Blog</li>
      </ul>
      <ul className="flex relative gap-12 text-xl xs:gap-4 xs:-left-2">
      <li>
      <a className="hover:text-blue-800 hover:underline cursor-pointer" href="/">
      Home
      </a>
      </li>
      <li>
        <a className="hover:text-blue-800 hover:underline cursor-pointer" href="/signup">
          Sign Up
        </a>
      </li>
      </ul>
    </nav>
  );
};

export default Navbar_all;
