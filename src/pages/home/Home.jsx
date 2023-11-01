import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import "./Home.css";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BiSearch } from "react-icons/bi";
import { FaBeer } from "react-icons/fa";
import GroupList from "../../components/GroupList/GroupList";
import Friends from "../../components/Friends/Friends";
import User from "../../components/User/User";
import Friendrequest from "../../components/Friend Request/Friendrequest";
import Mygroups from "../../components/Mygroups/Mygroups";
import Blocklist from "../../components/Blocklist/Blocklist";

import React, { createRef } from "react";
import { Cropper } from "react-cropper";
// import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadString,
} from "firebase/storage";
import { getAuth, updateProfile } from "firebase/auth";
import { modelclass, userLoginInfo } from "../../slices/userSlice";
import { blurClassAdd } from "../../slices/userSlice";

const home = () => {
  const auth = getAuth();
  const dispatch = useDispatch();
  const storage = getStorage();

  const data = useSelector((state) => state.userInfo.userInfo);
  const blur = useSelector((state) => state.userInfo.blur);
  const model = useSelector((state) => state.userInfo.model);

  const handelModel = () => {
    dispatch(blurClassAdd(false));
    dispatch(modelclass(false));
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (!data) {
      navigate("/");
    }
  }, []);

  // react cropper start

  const [image, setImage] = useState("");

  const [cropData, setCropData] = useState("");
  const cropperRef = createRef();

  const handelProfilePicture = (e) => {
    e.preventDefault(); 
    let files;

    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };

  const getCropData = () => {
    if (typeof cropperRef.current?.cropper !== "undefined") {
      setCropData(cropperRef.current?.cropper.getCroppedCanvas().toDataURL());
      const storageRef = ref(storage, auth.currentUser.uid);
      const message4 = cropperRef.current?.cropper
        .getCroppedCanvas()
        .toDataURL();
      uploadString(storageRef, message4, "data_url").then((snapshot) => {
        getDownloadURL(storageRef).then((downLoadURL) => {
          console.log(downLoadURL);
          updateProfile(auth.currentUser, {
            photoURL: downLoadURL,
          });
          dispatch(blurClassAdd(false));
          dispatch(modelclass(false));
          setImage("");

          dispatch(userLoginInfo({ ...data, photoURL: downLoadURL }));
          localStorage.setItem(
            "user",
            JSON.stringify({ ...data, photoURL: downLoadURL })
          );
        });
      });
    }
  };
  console.log(cropData);
  // react cropper end

  return (
    <div>
      <div className={model ? "blure" : ""}>
        <Navbar />

        <div className="main_content">
          <div className="item_box">
            {/* search bar start */}
            <div className="searchbar">
              <BiSearch className="search_icon" />
              <input type="text" placeholder="Search" />
              <BsThreeDotsVertical className="three_dot" />
            </div>
            {/* search bar end */}

            {/* group start */}
            <div className="group_item">
              <GroupList />
            </div>
            {/* group end */}
          </div>

          {/* friend list start*/}
          <div className="item_box">
            <div className="item">
              <Friends />
            </div>
          </div>
          {/* friend list end */}

          {/* user start */}
          <div className="item_box">
            <div className="item">
              <User />
            </div>
          </div>
          {/* user end */}

          {/* friend request start */}
          <div className="item_box">
            <div className="item">
              <Friendrequest />
            </div>
          </div>
          {/* friend request end */}

          {/* My Group start */}
          <div className="item_box">
            <div className="item">
              <Mygroups />
            </div>
          </div>
          {/* My Group end */}

          {/* Block list start */}
          <div className="item_box">
            <div className="item">
              <Blocklist />
            </div>
          </div>
          {/* Block list end */}
        </div>
      </div>
      {/* modal start  */}
      {blur && (
        <div className="modal">
          <div className="profileImage">
            <h2>Upload Your Profile Picture</h2>
            {image && (
              <div className="profile-priv">
                <div className="img-preview"></div>
              </div>
            )}

            <input onChange={handelProfilePicture} type="file" />
            {image && (
              <Cropper
                ref={cropperRef}
                style={{ height: 200, width: "100%" }}
                zoomTo={0.3}
                initialAspectRatio={1}
                preview=".img-preview"
                src={image}
                viewMode={1}
                minCropBoxHeight={10}
                minCropBoxWidth={10}
                background={false}
                responsive={true}
                autoCropArea={1}
                checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                guides={true}
              />
            )}
            <div className="model_button_area">
              <button
                onClick={getCropData}
                className={image ? "button_v_1" : "button_v_11"}
              >
                Upload
              </button>
              <button className="button_v_2" onClick={handelModel}>
                Cancle
              </button>
            </div>
          </div>
        </div>
      )}
      {/* modal end */}
    </div>
  );
};

export default home;
