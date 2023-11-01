import "./Navbar.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AiFillHome, AiFillSetting } from "react-icons/ai";
import { BsFillChatDotsFill, BsFillCloudUploadFill } from "react-icons/bs";
import { IoMdNotifications } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { getAuth, signOut } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { blurClassAdd, modelclass } from "../../slices/userSlice";
import { userLoginInfo } from "../../slices/userSlice";

const Navbar = () => {
  const blur = useSelector((state) => state.userInfo.blur);
  const data = useSelector((state) => state.userInfo.userInfo);

  const dispatch = useDispatch();
  const auth = getAuth();
  const navigate = useNavigate();

  const handelModel = () => {
    dispatch(blurClassAdd(true));
    dispatch(modelclass(true));
  };

  const handelSignOut = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
        dispatch(userLoginInfo(null));
        localStorage.removeItem("user");
      })
      .catch((error) => {
        
      });
  };

  return (
    <nav className="navbar">
      <div className="nav-content">
        <div className="profileArea">
          <div className="profileImg ">
          <h2 className="defaultProfile">{data?.displayName[0]}</h2>

            <img className="" src={data?.photoURL} alt="profile" />

            <div onClick={handelModel} className="overlay">
              <BsFillCloudUploadFill className="uploadIcon" />
            </div>
          </div>

          {/* <div className="profileImg">
          <img className="" src="" alt="profile" />
          </div> */}

          <h1>{data?.displayName}</h1>
        </div>

        <ul className="manu_items">
          <li>
            <NavLink
              className={({ isActive, isPending }) =>
                isPending ? "" : isActive ? "active" : "no_active"
              }
            >
              <AiFillHome to="/home" />{" "}
            </NavLink>{" "}
          </li>

          <li>
            <NavLink
              to="/chat"
              className={({ isActive, isPending }) =>
                isPending ? "" : isActive ? "active" : "no_active"
              }
            >
              <BsFillChatDotsFill />{" "}
            </NavLink>{" "}
          </li>

          <li>
            <NavLink
              to="/notification"
              className={({ isActive, isPending }) =>
                isPending ? "" : isActive ? "active" : "no_active"
              }
            >
              <IoMdNotifications />{" "}
            </NavLink>{" "}
          </li>
          <li>
            <NavLink
              to="/setting"
              className={({ isActive, isPending }) =>
                isPending ? "" : isActive ? "active" : "no_active"
              }
            >
              <AiFillSetting />{" "}
            </NavLink>{" "}
          </li>
          <div className="logout .no_active">
            <li>
              <Link to="">
                <IoLogOut className="log_out .no_active" onClick={handelSignOut} />
              </Link>
            </li>
          </div>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
