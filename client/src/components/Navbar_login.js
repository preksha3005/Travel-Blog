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
    <nav className="w-full h-14 flex justify-between text-lg font-bold bg-blue-400/30 backdrop-blur-sm p-2 xs:text-base xs:h-10 xs:w-full md:text-2xl lg:text-2xl">
      <ul className="navbar">
        <li>Travel Blog</li>
      </ul>

      <ul className="flex relative -left-5 gap-20 text-xl">
        <li>
          <a className="hover:text-blue-800" href="/getallsign">
            All Blogs
          </a>
        </li>
        <li>
          <div className="hover:text-blue-800">{initial}</div>
        </li>
        <li>
          <a onClick={handlelog} className="hover:text-blue-800 cursor-pointer">
            Logout
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar_login;
