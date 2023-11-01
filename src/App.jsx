import firebase from "./firebase.config"
import './App.css'
import { Route, Routes } from "react-router-dom"
import SignUpSignIn from "./pages/SignupSignIn/SignUpSignIn"
import Home from "./pages/home/Home"
import ForgotPassword from "./pages/forgotpassword/ForgotPassword"

function App() {
  
  return (
    <>
    <Routes>
      <Route path="/" element={<SignUpSignIn/>} />
      <Route path="/home" element={<Home/>} />
      <Route path="/forgotpass" element={<ForgotPassword/>} />
    </Routes>
    </>
  )
}

export default App
