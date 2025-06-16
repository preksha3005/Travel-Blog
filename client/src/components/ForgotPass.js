import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import img2 from "../assets/img2.jpg";
import Navbar_Sign from "./Navbar_Sign";
const ForgotPass = () => {
  const [email, sete] = React.useState("");
  const navigate = useNavigate();
  const handle = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/forgotpass", { email })
      .then((result) => {
        if (result.data.status) {
          alert("Check your mail")
          navigate("/login");
        }
      })
      .catch((err) => console.log(err));
    sete(" ");
  };
  axios.defaults.withCredentials = true;
  return (
    <div className="container">
      <Navbar_Sign />
      <img
        src={img2}
        alt="img"
        className=" object-cover -z-10-0 xs:h-screen xs:w-screen md:h-screen lg:h-screen lg:w-screen"
      />
      <div className="z-20 relative -top-[40vw] left-[35vw] w-96  text-white font-bold border-2 p-10 bg-white/6 backdrop-blur-sm xs:left-[5vw] xs:-top-[112vw] xs:text-xl xs:w-[88vw] md:-top-[82vw] md:left-[19vw] md:text-3xl md:w-[65vw] md:h-[40vw] lg:-top-[36vw] lg:left-[32vw] lg:h-[26vw] lg:text-2xl lg:w-[40vw]">
        <h2 className="text-center p-3 text-xl md:text-3xl lg:text-3xl">Forgot Password</h2>
        <form onSubmit={handle} className="text-center lg:mt-4 md:p-5">
          <input
            type="email"
            placeholder="Enter email"
            className="border-b-2 text-black outline-none bg-transparent xs:w-52 xs:text-base"
            name="email"
            required
            onChange={(e) => sete(e.target.value)}
          />

          <br />
          <br />
          <button type="submit" className="border-2 p-1 w-28 lg:w-44 lg:p-2 lg:mt-5">
            Send
          </button>
        </form>
        <br />
      </div>
    </div>
  );
};

export default ForgotPass;
