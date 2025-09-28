import React from "react";
import img2 from "../assets/img2.jpg";
import img1 from "../assets/img1.jpg";
import axios from "axios";
import Navbar_Sign from "./Navbar_Sign";
axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL;
axios.defaults.withCredentials = true;

const AllBlogs = () => {
  const [blogs, setb] = React.useState([]);
  React.useEffect(() => {
    axios
      .get("/getblog")
      .then((res) => {
        setb(res.data);
      })
      .catch((err) => alert("Error"));
  }, [blogs]);
  return (
    <div className="min-h-screen bg-gray-50 pb-10 h-screen w-full">
      <Navbar_Sign/>
      <div>
        {/*<img
          src={img2}
          alt="img"
          className=" object-cover -z-10-0 w-screen h-screen xs:h-screen md:h-screen md:w-screen lg:w-screen lg:h-screen"
        />*/}
        <h2 className="absolute text-black top-[18vh] left-[44vw] text-center p-3 text-xl font-bold md:text-4xl md:left-[39vw] md:top-[12vh] lg:text-3xl xs:left-[35vw] xs:top-16">
          All Blogs
        </h2>
        <div className="z-20 relative top-[20vh] -left-7 grid grid-cols-3 text-black p-4 font-medium gap-10 xs:grid-cols-1 xs:left-0 xs:top-14 md:w-[100vw] md:top-[13vh] md:grid-cols-2 lg:grid-cols-3 lg:w-[95vw]">
          {blogs.length > 0 ? (
            blogs.map((blog) => (
              <div
                key={blog.id}
                className="flex flex-col border-2 border-gray-500 p-4 rounded-lg shadow-lg text-center transition-transform duration-300 hover:scale-105  m-8 overflow-auto cursor-pointer max-h-[70vh] md:max-h-[45vh] lg:max-h-[80vh] l g:w-[28vw]"
                //bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 cursor-pointer
              >
                {blog.img && (
                  <img
                    src={blog.img}
                    alt="img"
                    className="w-full h-full object-cover max-h-60"
                  />
                )}
                <div className="font-bold text-xl">
                  {/* Blog Name (Location) */}
                  <div className="p-4 bg-gray-100 text-center">
                    <h3 className="font-bold text-xl text-gray-800">
                      {blog.name}
                    </h3>
                  </div>
                  <br />
                  <div className=" flex flex-col flex-grow">
                    <p className="text-gray-700 text-base mb-4 flex-grow overflow-hidden ">
                      {/* line-clamp-4 truncates text to 4 lines with ellipsis if overflow */}
                      {blog.content}
                    </p>
                    <p className="text-sm text-blue-600 hover:underline mt-auto">
                      {blog.mail}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-xl text-gray-600 py-20">
              No blogs available yet. Be the first to share!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllBlogs;

{
  /* <div className="z-30 border-2 relative top-[20vh] w-80 p-5 overflow-auto max-h-[60vh] text-center text-base ">
            <img src={img1} className="w-64 h-[30vh]"></img>
            <p>Name of place</p>
            <p>
              Contrary to popular belief, Lorem Ipsum is not simply random text.
              It has roots in a piece of classical Latin literature from 45 BC,
              making it over 2000 years old. Richard McClintock, a Latin
              professor at Hampden-Sydney College in Virginia, looked up one of
              the more obscure Latin words, consectetur, from a Lorem Ipsum
              passage, and going through the cites of the word in classical
              literature, discovered the undoubtable source. Lorem Ipsum comes
              from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et
              Malorum" (The Extremes of Good and Evil) by Cicero, written in 45
              BC. This book is a treatise on the theory of ethics, very popular
              during the Renaissance. The first line of Lorem Ipsum, "Lorem
              ipsum dolor sit amet..", comes from a line in section 1.10.32.
            </p>
            <p>email@gmail.com</p>
          </div>*/
}
