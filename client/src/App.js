// import logo from './logo.svg';
// import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import ForgotPass from "./components/ForgotPass";
import ResetPass from "./components/ResetPass";
import Home from "./components/Home";
import AllBlogs from "./components/AllBlogs";
import AllBlogsSignIn from "./components/AllBlogsSignIn";
import Create from "./components/Create";
// import Expense from './components/Expense';

function App() {
  return (
    <div className="App">
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/signup" element={<SignUp />}></Route>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/forgotpass" element={<ForgotPass />}></Route>
      <Route path="/resetpass/:token" element={<ResetPass />}></Route>
      <Route path="/getall" element={<AllBlogs/>}></Route>
      <Route path="/create" element={<Create/>}></Route>
      <Route path="/getallsign" element={<AllBlogsSignIn/>}></Route>
    </Routes>
</BrowserRouter>
    </div>
  );
}

export default App;
