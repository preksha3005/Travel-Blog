import React from "react";
import axios from "axios";
import { useNavigate, Link, useParams } from "react-router-dom";
// import Navbar from "./Navbar";
import img2 from "../assets/img2.jpg";
import Navbar_Sign from "./Navbar_Sign";

axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL;
axios.defaults.withCredentials = true;

const ResetPass = () => {
  const [password, setp] = React.useState("");
  const { token } = useParams();
  const navigate = useNavigate();
  const handle = (e) => {
    e.preventDefault();
    axios
      .post("/resetpass/"+token, { password })
      .then((result) => {
        if (result.data.status) navigate("/login");
      })
      .catch((err) => console.log(err));
    setp(" ");
  };
  return (
    <div className="container">
      <Navbar_Sign />
      <img
        src={img2}
        alt="img"
        className=" object-cover -z-10-0 xs:h-screen md:h-screen lg:h-screen lg:w-screen"
      />
      <div className="z-20 relative -top-[40vw] left-[35vw] w-96  text-white font-bold border-2 p-10 bg-white/6 backdrop-blur-sm xs:left-[4.5vw] xs:-top-[172vw] xs:text-xl xs:w-[88vw] md:-top-[100vw] md:left-[19vw] md:text-3xl md:w-[65vw] md:h-[65vw] lg:-top-[35vw] lg:left-[32vw] lg:h-[26vw] lg:text-2xl lg:w-[40vw]">
        <h2 className="text-center p-3 text-xl md:text-2xl lg:text-3xl">Reset Password</h2>
        <form onSubmit={handle} className="form1">
          <input
            type="password"
            placeholder="Enter password"
            className="border-b-2 text-black outline-none bg-transparent"
            name="password"
            required
            onChange={(e) => setp(e.target.value)}
          />
          <br />
          <br />
          <button type="submit" className="border-2 p-1 w-28 lg:w-44 lg:p-2 lg:mt-5">
            Reset
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPass;
