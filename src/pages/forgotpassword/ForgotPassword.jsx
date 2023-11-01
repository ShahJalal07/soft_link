import "./forgotPass.css";
import Lottie from "lottie-react";
import forget from "../animation/forget.json";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate("");

  const handelEmail = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  };
  const handelSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setEmailError("email is requard");
    } else {
      const auth = getAuth();
      setEmail("");
      sendPasswordResetEmail(auth, email)
        .then(() => {
          console.log("hello");
          setTimeout(() => {
            navigate("/");
          }, 2000);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode);
          console.log(errorMessage);
          if (error.code == "auth/user-not-found") {
            setEmailError("user not found");
          }
        });
    }
  };

  // privet route
  
  
  return (
    <div className="forgotpage">
      <div className="forget-box">
        <div>
          <Lottie className="forget-animation" animationData={forget} />
        </div>

        <div>
          <form className="forgot-from" onSubmit={handelSubmit}>
            <h1 className="forget-title">Forget Password</h1>
            <input
              onChange={handelEmail}
              value={email}
              className="forget-input-box"
              type="email"
              placeholder="Email Address"
            />
            <p className="emailError">{emailError}</p>
            <div className="buttons">
              <button className="send-btn">RESET PASSWORD</button>
            </div>
            <Link to="/" className="back-btn">
              Banck to SingIn
            </Link>
          </form>
        </div>
        <img className="shape" src="shape.png" alt="" />
        <img className="shape2" src="shape.png" alt="" />
      </div>
      <div></div>
    </div>
  );
};

export default ForgotPassword;
