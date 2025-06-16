import React from "react";
import Navbar from "./Navbar";
import img1 from "../assets/img1.jpg";
import img2 from "../assets/img2.jpg";

const Home = () => {
  return (
    <div>
      <Navbar />
      <div>
        <img
          src={img2}
          alt="img"
          className=" object-cover -z-10-0 w-screen h-screen xs:h-screen md:h-screen md:w-screen lg:w-screen lg:h-screen"
        />
        {/*
          object-cover: This class name is used to specify that the image should be scaled to cover the entire container without losing its aspect ratio.
          */}
        <h1 className="z-20 w-96 text-4xl text-white font-bold p-10 absolute top-[10vw] md:top-[31vw] md:left-[25vw] md:text-5xl lg:top-[9vw] lg:left-[38vw] left-[1vw] xs:text-3xl xs:top-[23vh] xs:-left-2 ">
          Share Your Travel Stories and Inspire Others with Your Unforgettable
          Adventures and Memories!
        </h1>
      </div>
    </div>
  );
};

export default Home;
