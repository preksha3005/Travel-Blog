import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL;
axios.defaults.withCredentials = true;

const Navbar_login = () => {
  const [initial, seti] = React.useState("");
  const navigate = useNavigate();
  React.useEffect(() => {
    axios
      .get("/initial")
      .then((res) => seti(res.data.initial))
      .catch((err) => console.log("Error"));
  }, []);
  const handlelog = () => {
    axios
      .get("/logout")
      .then((res) => {
        if (res.data.status) {
          navigate("/login");
          console.log(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    // <nav className="w-full h-14 flex justify-between text-lg font-bold bg-blue-400/30 backdrop-blur-sm p-2 xs:text-base xs:h-10 xs:w-full md:text-2xl lg:text-2xl">
    //   <ul className="navbar">
    //     <li>
    //       <a className="hover:text-blue-800" href="/create">
    //         Travel Blog
    //       </a>
    //     </li>
    //   </ul>

    //   <ul className="flex relative -left-5 gap-20 text-xl">
    //     <a className="hover:text-blue-800" href="/create">
    //       Home
    //     </a>
    //     <li>
    //       <a className="hover:text-blue-800" href="/getallsign">
    //         All Blogs
    //       </a>
    //     </li>
    //     <li>
    //       <div className="hover:text-blue-800">{initial}</div>
    //     </li>
    //     <li>
    //       <a onClick={handlelog} className="hover:text-blue-800 cursor-pointer">
    //         Logout
    //       </a>
    //     </li>
    //   </ul>
    // </nav>

    <nav className="w-full h-14 flex flex-col md:flex-row justify-between items-center text-lg font-bold bg-blue-400/30 backdrop-blur-sm p-2 xs:text-base xs:h-14 md:text-2xl lg:text-2xl">
  {/* Logo / Brand */}
  <ul className="navbar flex justify-center md:justify-start w-full md:w-auto mb-2 md:mb-0">
    <li>
      <a className="hover:text-blue-800" href="/create">
        Travel Blog
      </a>
    </li>
  </ul>

  {/* Menu items */}
  <ul className="flex flex-col md:flex-row gap-2 md:gap-20 items-center text-xl md:text-lg w-full md:w-auto">
    <li>
      <a className="hover:text-blue-800" href="/create">
        Home
      </a>
    </li>
    <li>
      <a className="hover:text-blue-800" href="/getallsign">
        All Blogs
      </a>
    </li>
    <li>
      <div className="hover:text-blue-800">{initial}</div>
    </li>
    <li>
      <a
        onClick={handlelog}
        className="hover:text-blue-800 cursor-pointer"
      >
        Logout
      </a>
    </li>
  </ul>
</nav>

  );
};

export default Navbar_login;


