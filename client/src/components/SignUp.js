import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import img2 from "../assets/img2.jpg";
import Navbar_Sign from "./Navbar_Sign";

const SignUp = () => {
  const [name, setn] = React.useState("");
  const [email, sete] = React.useState("");
  const [password, setp] = React.useState("");
  const navigate = useNavigate();
  const handle = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/sign", { name, email, password })
      .then((result) => {
        if (result.data.message) {
          console.log(result.data.message);
          alert(result.data.message);
        } else {
          console.log(result.data);
          alert(result.data);
        }
        if (result.data.status) navigate("/login");
      })
    //   .catch((err) => console.log(err));
  };
  return (
    <div className="relative h-80">
      <Navbar_Sign />
      <img src={img2} alt="img" className=" object-cover -z-10-0 xs:h-screen md:h-screen lg:h-screen lg:w-screen" />
      <div className="z-20 relative -top-[42vw] left-[35vw] w-96 text-white font-bold border-2 p-10 bg-white/6 backdrop-blur-sm xs:left-[4.5vw] xs:-top-[140vw] xs:text-base xs:p-4 xs:w-[90vw] xs:h-[55vh] md:-top-[100vw] md:left-[13vw] md:text-3xl md:w-[75vw] md:h-[65vw] lg:-top-[42.5vw] lg:left-[32vw] lg:h-[39vw] lg:text-2xl lg:w-[40vw]">
        <h2 className="text-center p-3 text-xl md:text-4xl lg:text-2xl">SignUp</h2>
        <form onSubmit={handle} className="text-center lg:mt-4">
          <input
            type="text"
            placeholder="Enter name"
            className="border-b-2 text-black outline-none bg-transparent text-xl"
            name="name"
            required
            onChange={(e) => setn(e.target.value)}
          />
          <br />
          <br />
          <input
            type="email"
            placeholder="Enter email"
            className="border-b-2 text-black outline-none bg-transparent text-xl"
            name="email"
            required
            onChange={(e) => sete(e.target.value)}
          />
          <br />
          <br />
          <input
            type="password"
            placeholder="Enter password"
            className="border-b-2 text-black outline-none bg-transparent text-xl"
            name="password"
            required
            onChange={(e) => setp(e.target.value)}
          />
          <br />
          <br />
          <button type="submit" className="border-2 p-1 w-28 lg:w-44 lg:p-2 lg:mt-5 md:w-52 text-xl hover:underline ">
            SignUp
          </button>
        </form>
        <p className="text-center p-2 lg:mt-6 text-2xl">
          Already have an account?{" "}
          <Link to="/login" className="underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};
export default SignUp;
