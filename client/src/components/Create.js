import React from "react";
import Navbar_login from "./Navbar_login";
import axios from "axios";
import { MdDelete, MdEdit } from "react-icons/md";

axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL;
axios.defaults.withCredentials = true;
const Create = () => {
  const [file, setf] = React.useState();
  const [img, seti] = React.useState([]);
  const [name, sett] = React.useState("");
  const [content, setc] = React.useState("");
  const [mail, setm] = React.useState("");

  // const [blogs, setBlogs] = React.useState([]);

  const [editId, setEditId] = React.useState(null);
  const [editTitle, setEditTitle] = React.useState("");
  const [editContent, setEditContent] = React.useState("");
  const [editMail, setEditMail] = React.useState("");

  React.useEffect(() => {
    const fetchUserBlogs = async () => {
      try {
        const res = await axios.get("/get");
        seti(res.data);
      } catch (err) {
        console.error("Error fetching user blogs:", err);
      }
    };
    fetchUserBlogs();
  }, []);

  const handle = (e) => {
    e.preventDefault();
    if (!name || !content || !mail || !file) {
      alert("Enter all details");
    }
    const formdata = new FormData();
    if (file) {
      formdata.append("file", file);
    }
    formdata.append("name", name);
    formdata.append("content", content);
    formdata.append("mail", mail);
    console.log(file);
    axios
      .post("/upload", formdata)
      .then((res) => {
        console.log(res.data.imgUrl); // <-- Cloudinary URL
        fetchUserBlogs(); // refresh blog list
      })
      .catch((err) => console.log(err));
    setf(null);
    sett("");
    setc("");
    setm("");
    document.getElementById("blogImageInput").value = null;
    fetchUserBlogs();
  };

  React.useEffect(() => {
    axios
      .get("/get")
      .then((res) => seti(res.data))
      .catch((err) => alert("Error"));
  }, [img]);

  const handleEdit = (blog) => {
    setEditId(blog._id);
    setEditTitle(blog.name);
    setEditContent(blog.content);
    setEditMail(blog.mail);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      console.log(editId);
      const response = await axios.put(`/update/${editId}`, {
        name: editTitle,
        content: editContent,
        mail: editMail,
      });
      console.log(response.data.updatedCard);
      const updatedCard = response.data.updatedCard;
      seti((prev) =>
        prev.map((blog) => (blog._id == updatedCard._id ? updatedCard : blog))
      );
      setEditId(null);
      setEditTitle("");
      setEditContent("");
      setEditMail("");
    } catch (err) {
      console.error("Error is: ", err);
    }
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditTitle("");
    setEditContent("");
    setEditMail("");
  };

  const handelete = (id) => {
    axios
      .delete("/del/" + id)
      .then((res) => seti(res.data))
      .catch((err) => console.log(err));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <Navbar_login />
      <div className="border-2 border-black w-full max-w-2xl mt-10 p-8 bg-white rounded-lg shadow-2xl flex flex-col gap-5 relative left-[25%] top-[1vw] items-center xs:w-11/12 xs:left-[3vw] md:p-3 md:w-[60vw] lg:p-1 lg:w-[45vw]">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-8 text-center md:text-2xl lg:text-3xl xs:font-bold ">
          Add Blog
        </h2>
        <form className="text-center p-4 xs:p-2">
          <div>
            <label
              htmlFor="blogImage"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Blog Image
            </label>
            <input
              type="file"
              id="blogImageInput"
              className="block w-full text-sm text-black
                       border border-black rounded-full
                         file:mr-4 file:py-2 file:px-4 file:cursor-pointer
                         file:rounded-full file:border-0
                         file:text-sm file:font-semibold
                         file:bg-blue-50 file:text-blue-700
                         hover:file:bg-blue-100 cursor-pointer xs:w-64 md:w-72 lg:w-80"
              onChange={(e) => setf(e.target.files[0])}
              required
            />
          </div>
          <br />
          <br />
          <div>
            <label
              htmlFor="locationName"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Name of Location
            </label>
            <input
              type="text"
              placeholder="e.g., The Swiss Alps, Taj Mahal"
              className="-full p-3 border border-black rounded-md shadow-sm
                          focus:border-black
                         outline-none text-gray-800 placeholder-gray-400 xs:w-64 md:w-72 lg:w-80"
              required
              onChange={(e) => sett(e.target.value)}
            />
          </div>
          <br />
          <br />
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Description
            </label>
            <textarea
              placeholder="Share your unforgettable adventure and memories..."
              rows="8"
              cols="45"
              className="w-full p-3 border border-black rounded-md shadow-sm
                         focus:border-black
                         outline-none resize-y text-gray-800 placeholder-gray-400 xs:w-64 md:w-72 lg:w-80"
              required
              onChange={(e) => setc(e.target.value)}
            />
          </div>
          <br />
          <br />
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Your Email
            </label>
            <input
              type="email"
              placeholder="Email"
              required
              onChange={(e) => setm(e.target.value)}
              className="w-full p-3 border border-black rounded-md shadow-sm
                          focus:border-black
                         outline-none text-gray-800 placeholder-gray-400 xs:w-64 md:w-72 lg:w-80"
            />
          </div>
          <br />
          <br />
          <button
            type="submit"
            onClick={(e) => handle(e)}
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md
                       hover:bg-blue-700 focus:outline-none
                        transition duration-200 ease-in-out shadow-md xs:w-64 md:w-72 lg:w-80"
          >
            Add
          </button>
        </form>
      </div>
      <br />
      <br />
      <br />
      <div>
        <h2 className="text-center font-bold p-3 text-xl md:text-2xl lg:text-3xl">
          Your Blogs
        </h2>
        <div className="grid grid-cols-3 xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {Array.isArray(img) && img.length === 0 ? (
            <div className="col-span-3 text-center py-10">
              <h4 className="text-gray-500 text-lg md:text-xl lg:text-2xl font-semibold">
                No Blogs available. Create one above!
              </h4>
            </div>
          ) : (
            img.map((image) => (
              <div
                key={image._id}
                className="flex flex-col border-2 border-black p-4 text-center m-5 overflow-auto max-h-[70vh] md:max-h-[50vh] lg:max-h-[80vh] lg:w-96"
              >
                {editId === image._id ? ( // If this note is being edited
                  <form onSubmit={handleUpdate} className="edit-form">
                    <input
                      type="text"
                      placeholder="e.g., The Swiss Alps, Taj Mahal"
                      value={editTitle}
                      className="-full p-3 border border-black rounded-md shadow-sm
                          focus:border-black
                         outline-none text-gray-800 placeholder-gray-400 xs:w-64 md:w-72 lg:w-80"
                      required
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                    <textarea
                      placeholder="Share your unforgettable adventure and memories..."
                      rows="8"
                      cols="45"
                      value={editContent}
                      className="w-full p-3 border border-black rounded-md shadow-sm
                         focus:border-black
                         outline-none resize-y text-gray-800 placeholder-gray-400 xs:w-64 md:w-72 lg:w-80"
                      required
                      onChange={(e) => setEditContent(e.target.value)}
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      required
                      value={editMail}
                      onChange={(e) => setEditMail(e.target.value)}
                      className="w-full p-3 border border-black rounded-md shadow-sm
                          focus:border-black
                         outline-none text-gray-800 placeholder-gray-400 xs:w-64 md:w-72 lg:w-80"
                    />
                    <div className="flex flex-col xs:flex-row justify-around mt-4 gap-2 xs:gap-4">
                      {" "}
                      {/* Added responsive flex and gap */}
                      <button
                        type="submit"
                        className="bg-green-600 text-white font-bold py-2 px-4 xs:px-6 rounded-md
                                   hover:bg-green-700 focus:outline-none text-sm xs:text-base
                                   transition duration-200 ease-in-out shadow-md flex-grow"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="bg-red-600 text-white font-bold py-2 px-4 xs:px-6 rounded-md
                                   hover:bg-red-700 focus:outline-none text-sm xs:text-base
                                   transition duration-200 ease-in-out shadow-md flex-grow"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <img src={image.img} alt="img" className="max-h-64" />
                    <div className="font-bold text-xl">
                      <h2>{image.name}</h2>
                      <br />
                      <p>{image.content}</p>
                      <br />
                      <p>{image.mail}</p>
                      <br />
                      <div className="flex justify-center">
                        <span
                          className="flex justify-center cursor-pointer text-red-600 hover:text-red-800"
                          onClick={() => handelete(image._id)}
                          // className="mt-auto self-end p-2 text-red-600 hover:text-red-800 transition duration-150"
                        >
                          <MdDelete size={28} />
                        </span>

                        <span
                          className="flex justify-center cursor-pointer text-yellow-600 hover:text-yellow-800"
                          onClick={() => handleEdit(image)}
                          // className="mt-auto self-end p-2 text-red-600 hover:text-red-800 transition duration-150"
                        >
                          <MdEdit size={28} />
                        </span>
                      </div>
                    </div>
                  </>
                )}{" "}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Create;
