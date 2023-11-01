import { useEffect, useState } from "react";
import "./SignUpSignIn.css";
import { AiFillCheckCircle } from "react-icons/ai";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { Vortex } from "react-loader-spinner";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userLoginInfo } from "../../slices/userSlice";
import { getDatabase, ref, set } from "firebase/database";

const SignUpSignIn = () => {
  // privet route start

  const data = useSelector((state) => state.userInfo.userInfo);
  useEffect(() => {
    if (data) {
      navigate("/home");
    }
  });
  // privet route end

  // redux dispatch starts
  const dispatch = useDispatch();
  // redux dispatch end

  // sign in, sign up open close state
  const [open, setOpen] = useState(false);

  // sing-up and sing-in open close start
  const handelSingupOpen = () => {
    setOpen(true);
  };
  const handelSingInOpen = () => {
    setOpen(false);
  };
  // sing-up and sing-in open close end

  // toggle button
  const [lockopen1, setLockopen1] = useState(false);
  const toggole1 = () => {
    setLockopen1(true);
    setTimeout(() => {
      setLockopen1(false);
    }, 1000);
  };

  const [lockopen, setLockopen] = useState(false);
  const toggole2 = () => {
    setLockopen(true);
    setTimeout(() => {
      setLockopen(false);
    }, 1000);
  };

  const [lockopen3, setLockopen3] = useState(false);
  const toggole3 = () => {
    setLockopen3(true);
    setTimeout(() => {
      setLockopen3(false);
    }, 1000);
  };

  // resistation start

  // username
  const [user, setUser] = useState("");
  const handelUser = (e) => {
    setUser(e.target.value);
    setUserError("");
  };
  const [userError, setUserError] = useState("");
  // user name regex
  const usernameRegex = /^[a-zA-Z ]+$/;

  // email
  const [email, setEmail] = useState("");
  const handelEmail = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  };
  const [emailError, setEmailError] = useState("");
  // email regex test
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  // password start
  const [password, setpassword] = useState("");
  const handelPassword = (e) => {
    setpassword(e.target.value);

    const isNonWhiteSpace = /^\S*$/;
    if (!isNonWhiteSpace.test(password)) {
      setPasswordError("Password must not contain Whitespaces.");
      setPasswordError("");
    }

    const isContainsUppercase = /^(?=.*[A-Z]).*$/;
    if (!isContainsUppercase.test(password)) {
      setPasswordError("use at least one Uppercase Character.");
    }

    const isContainsLowercase = /^(?=.*[a-z]).*$/;
    if (!isContainsLowercase.test(password)) {
      setPasswordError("use at least one Lowercase Character.");
    }

    const isContainsNumber = /^(?=.*[0-9]).*$/;
    if (!isContainsNumber.test(password)) {
      setPasswordError("use at least one Digit.");
    }
    const isContainsSymbol =
      /^(?=.*[~`!@#$%^&*()--+={}/[\]|\\:;"'<>,.?/_₹]).*$/;
    if (!isContainsSymbol.test(password)) {
      setPasswordError("use at least one Special Symbol.");
    }

    const isValidLength = /^.{6,10}$/;
    if (!isValidLength.test(password)) {
      setPasswordError("Password must be 6-10 Characters Long.");
    }

    if (isValidFullPass.test(password)) {
      setPasswordError("");
    }
  };
  const [passwordError, setPasswordError] = useState("");
  const isValidFullPass =
    /^(?=.*\S)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$@^%&? "])[a-zA-Z0-9!#$@^%&?]{6,10}$/;
  // password end

  //confirm password start
  const [confirmpass, setConfirmpass] = useState("");
  const handelConfirmpass = (e) => {
    setConfirmpass(e.target.value);
    setconfirmpassError("");
  };
  const [confirmpassError, setconfirmpassError] = useState("");
  //confirm password end

  // loader starts
  const [loader, setLoader] = useState(false);
  // loader end

  // auth start
  const auth = getAuth();
  // auth end
  const db = getDatabase();

  const handelSingUp = (e) => {
    e.preventDefault();
    if (!user) {
      setUserError("user name is required");
    } else if (!usernameRegex.test(user)) {
      setUserError("user name is not valid");
    }
    if (!email) {
      setEmailError("email is required");
    } else if (!emailRegex.test(email)) {
      setEmailError("Email Is Not Valid");
    }
    if (!password) {
      setPasswordError("password is required");
    }

    if (!confirmpass) {
      setconfirmpassError("confirm password is required");
    }
    if (password !== confirmpass) {
      setconfirmpassError("Password is not match");
    }
    // firebase registation starts
    if (user && email && password && confirmpass && password == confirmpass) {
      setLoader(true);
      setUser("");
      setEmail("");
      setpassword("");
      setConfirmpass("");
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // update profile
          updateProfile(auth.currentUser, {
            displayName: user,
            photoURL: "https://example.com/jane-q-user/profile.jpg",
          })
            .then(() => {
              const user = userCredential.user;
              console.log(user);
              setLoader(false);
              setUser("");
              setEmail("");
              setpassword("");
              setConfirmpass("");
              // navigate("/home")
              setOpen(false);
            })
            .then(() => {
              set(ref(db, "users/" + auth.currentUser.uid), {
                name: user,
                email: email,
                // profile_picture : imageUrl
              });
            })
            .catch((error) => {
              console.log(error.code);
              console.log(error.message);
            });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode);
          console.log(errorMessage);
          setLoader(false);
          setUser("");
          setEmail("");
          setpassword("");
          setConfirmpass("");
          if (errorMessage.includes("auth/email-already-in-use")) {
            setEmailError("email already in use");
            setUser("");
            setEmail("");
            setpassword("");
            setConfirmpass("");
          }
        });
    }
    // firebase registation end
  };
  //  registation end

  // log in start
  const [logEmail, setLogEmail] = useState();
  const logEmailhandel = (e) => {
    setLogEmail(e.target.value);
    setLogEmailError("");
  };
  const [logPass, setLogPass] = useState();
  const logPasshandel = (e) => {
    setLogPass(e.target.value);
    setLogPassError("");
  };
  const [logemailError, setLogEmailError] = useState();
  const [logpassError, setLogPassError] = useState();

  const handelSingIn = (e) => {
    e.preventDefault();
    if (!logEmail) {
      setLogEmailError("Email Is Requared");
    }
    if (!logPass) {
      setLogPassError("password Is Requared");
    } else {
      setLoader(true);
      setLogEmail("");
      setLogPass("");
      signInWithEmailAndPassword(auth, logEmail, logPass)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log(user);
          setLoader(false);
          navigate("/home");
          dispatch(userLoginInfo(user));
          localStorage.setItem("user", JSON.stringify(user));
        })
        .catch((error) => {
          setLoader(false);
          const errorCode = error.code;

          if (errorCode == "auth/user-not-found") {
            setLogEmailError("user not found");
          }
          if (errorCode == "auth/wrong-password") {
            setLogPassError("wrong password");
          }
        });
    }
  };
  // log in end

  // navigate
  const navigate = useNavigate();
  return (
    <div>
      <div className={open ? "container sign-up-mode" : "container"}>
        <div className="forms-container">
          <div className="singin-sinup">
            {/* sing in start */}
            <form onSubmit={handelSingIn} action="" className="sing-in-form">
              <h2 className="title">Sing In</h2>
              <div className="input-field">
                <i className="fas fa-envelope"></i>
                <input
                  onChange={logEmailhandel}
                  value={logEmail}
                  type="email"
                  placeholder="Email"
                />
                <p className="errortag">{logemailError}</p>
              </div>
              <div className="input-field">
                {lockopen3 == false ? (
                  <i onClick={toggole3} className="fas fa-lock"></i>
                ) : (
                  <i className="fa-solid fa-unlock"></i>
                )}
                <input
                  onChange={logPasshandel}
                  value={logPass}
                  type={lockopen3 == false ? "password" : "text"}
                  placeholder="Password"
                />
                <p className="errortag">{logpassError}</p>
              </div>

              {/* sing in button starts */}
              {loader ? (
                <Vortex></Vortex>
              ) : (
                <input type="submit" value="Sign In" className="btn solid" />
              )}
              {/* sing in button end */}
              <p className="social-text">Or Sing In with social platforms</p>
              <div className="social-media">
                <a href="#" className="social-icon">
                  <i className="fab fa-facebook"></i>
                </a>
                <a href="#" className="social-icon">
                  <i className="fa-brands fa-twitter"></i>
                </a>
                <a href="#" className="social-icon">
                  <i className="fa-brands fa-google"></i>
                </a>
                <a href="#" className="social-icon">
                  <i className="fa-brands fa-linkedin-in"></i>
                </a>
              </div>
              {/* forgget password */}
              <div className="forgetpass">
                <Link to="/forgotpass">Forgot Password?</Link>
              </div>
            </form>
            {/* sing in end */}

            {/* sing up start */}
            <form onSubmit={handelSingUp} action="" className="sing-up-form">
              <h2 className="title">Sign Up</h2>
              {/* user name */}
              <div className="input-field">
                <i className="fas fa-user"></i>
                <input
                  onChange={handelUser}
                  type="text"
                  value={user}
                  placeholder="Username"
                  className="username"
                />
                <p className="errortag">{userError}</p>
              </div>
              {/* email */}
              <div className="input-field">
                <i className="fas fa-envelope"></i>
                <input
                  onChange={handelEmail}
                  type="email"
                  value={email}
                  placeholder="Email"
                />
                <p className="errortag">{emailError}</p>
              </div>
              {/* password */}
              <div className="input-field">
                {lockopen1 == false ? (
                  <i onClick={toggole1} className="fas fa-lock"></i>
                ) : (
                  <i className="fa-solid fa-unlock"></i>
                )}
                <input
                  onChange={handelPassword}
                  type={lockopen1 == false ? "password" : "text"}
                  placeholder="Password"
                  value={password}
                />
                {isValidFullPass.test(password) ? (
                  <p className="strongTag">
                    <AiFillCheckCircle className="stringIcon" />
                    Strong Pssword
                  </p>
                ) : (
                  <p className="errortag"> {passwordError} </p>
                )}
              </div>
              {/* re-password */}
              <div className="input-field">
                {lockopen == false ? (
                  <i onClick={toggole2} className="fas fa-lock"></i>
                ) : (
                  <i className="fa-solid fa-unlock"></i>
                )}
                <input
                  onChange={handelConfirmpass}
                  type={lockopen == false ? "password" : "text"}
                  placeholder="Re-Password"
                  value={confirmpass}
                />
                <p className="errortag">{confirmpassError}</p>
              </div>
              {/* submit button */}
              {loader ? (
                <Vortex></Vortex>
              ) : (
                <input type="submit" value="Sign Up" className="btn solid" />
              )}
              {/* social mediae */}
              <p className="social-text">Or Sing Up with social platforms</p>
              <div className="social-media">
                <a href="#" className="social-icon">
                  <i className="fab fa-facebook"></i>
                </a>
                <a href="#" className="social-icon">
                  <i className="fa-brands fa-twitter"></i>
                </a>
                <a href="#" className="social-icon">
                  <i className="fa-brands fa-google"></i>
                </a>
                <a href="#" className="social-icon">
                  <i className="fa-brands fa-linkedin-in"></i>
                </a>
              </div>
            </form>
            {/* sing up end */}
          </div>
        </div>

        {/* panels control starts */}
        <div className="panels-container">
          <div className="panel left-panel">
            <div className="content">
              <h3>New here ?</h3>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Et,
                dignissimos.
              </p>
              <button
                onClick={handelSingupOpen}
                className="btn transparent"
                id="sing-up-btn"
              >
                Sing Up
              </button>
            </div>
            {/* <img src="images/log.svg" className="image" alt=""> */}
            <img src="log.svg" alt="" className="image" />
          </div>

          <div className="panel right-panel">
            <div className="content">
              <h3>One of user ?</h3>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Et,
                dignissimos.
              </p>
              <button
                onClick={handelSingInOpen}
                className="btn transparent"
                id="sing-in-btn"
              >
                Sing in
              </button>
            </div>
            {/* <img src="images/register.svg" className="image" alt=""> */}
            <img src="register.svg" alt="" className="image" />
          </div>
        </div>
        {/* panels control end */}
      </div>
    </div>
  );
};

export default SignUpSignIn;
