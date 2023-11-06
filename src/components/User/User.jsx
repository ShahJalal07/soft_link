import { BsThreeDotsVertical } from "react-icons/bs";
import "./User.css";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  remove,
} from "firebase/database";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ProfilePicture from "../ProfilePicture/ProfilePicture";

const User = () => {
  const data = useSelector((state) => state.userInfo.userInfo);
  const db = getDatabase();
  const [userList, setUserList] = useState([]);

  // get database from database start
  useEffect(() => {
    const userRef = ref(db, "users");
    onValue(userRef, (snapShort) => {
      let list = [];
      snapShort.forEach((item) => {
        if (data.uid !== item.key) {
          list.push({ ...item.val(), id: item.key });
        }
      });
      setUserList(list);
    });
  }, []);
  // get database from database end

  // friend request send start
  const handelFriendRequest = (item) => {
    set(push(ref(db, "friendRequest")), {
      senderID: data.uid,
      senderName: data.displayName,
      receiverID: item.id,
      receiverName: item.name,
    });
  };
  // friend request send end

  // friend request value get start
  const [friendRequestList, setFriendRequestList] = useState("");

  useEffect(() => {
    const friendRequestRef = ref(db, "friendRequest");
    onValue(friendRequestRef, (snapShort) => {
      let list = [];
      snapShort.forEach((item) => {
        list.push(item.val().receiverID + item.val().senderID);
      });
      setFriendRequestList(list);
    });
  }, []);

  // friend request value get end

  // friend list start
  const [friendList, setFriendList] = useState([]);
  useEffect(() => {
    const friendListRef = ref(db, "friends");
    onValue(friendListRef, (snapShort) => {
      let list = [];
      snapShort.forEach((item) => {
        list.push(
          item.val().receiverID + item.val().senderID ||
            item.val().senderID + item.val().receiverID
        );
      });
      setFriendList(list);
    });
  }, []);
  // friend list end

  // cancle friend request start
  const [friendRequest, setFriendRequest] = useState([]);
  
  useEffect(() => {
    const friendRequestLisRef = ref(db, "friendRequest");
    onValue(friendRequestLisRef, (snapShort) => {
      let list = [];
      snapShort.forEach((item) => {
        // list.push(item.val().receiverID + item.val().senderID);
        list.push({ ...item.val(), key: item.key });
      });
      setFriendRequest(list);
    });
  }, []);

  const handelCancleRequest = (item) => {
    
    const cancle = {
      senderID: data.uid,
      senderName: data.displayName,
      receiverID: item.id,
      receiverName: item.name,  
    };

    const check = friendRequest?.find(
      (items) =>
        items.receiverID === cancle.receiverID &&
        items.senderID === cancle.senderID
    );
    remove(ref(db, "friendRequest/" + check.key));
  };
  // cancle friend request end

  // block start
  const [blockList, setBlockList] = useState([]);
  useEffect(() => {
    const blockRef = ref(db, "block");
    onValue(blockRef, (snapShort) => {
      let list = [];
      snapShort.forEach((item) => {
        list.push(item.val().blockByID + item.val().blockID);
      });
      setBlockList(list);
    });
  }, []);
  // block end

  return (
    <div>
      <div className="containerTitle">
        <h2>user list</h2>
        <BsThreeDotsVertical />
      </div>

      <div className="user_box">
        {userList.map((item, i) => {
          return (
            <div key={i} className="user_list">
              <div className="user">
                <div className="user_img">
                  <ProfilePicture imgID={item?.id} />
                </div>
                <div className="user_name">
                  <h4>{item?.name}</h4>
                  <h5>{item?.email}</h5>
                </div>
              </div>

              <div className="">
                {blockList.includes(item.id + data.uid) ||
                blockList.includes(data.uid + item.id) ? (
                  <h1 className="not_available">Not Available</h1>
                ) : friendList.includes(data.uid + item.id) ||
                  friendList.includes(item.id + data.uid) ? (
                  <button className="button_v_4">Friend</button>
                ) : friendRequestList.includes(item.id + data.uid) ||
                  friendRequestList.includes(data.uid + item.id) ? (
                  <button
                    onClick={() => handelCancleRequest(item)}
                    className="button_v_3"
                  >
                    cancel request
                  </button>
                ) : (
                  <button
                    onClick={() => handelFriendRequest(item)}
                    className="button_v_1"
                  >
                    Add Friend
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default User;
