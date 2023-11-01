import { BsThreeDotsVertical } from "react-icons/bs";

import "./Friends.css";
import {
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  set,
} from "firebase/database";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import ProfilePicture from "../ProfilePicture/ProfilePicture";

const Friends = () => {
  const db = getDatabase();
  const data = useSelector((state) => state.userInfo.userInfo);
  const [friendList, setFriendList] = useState([]);
  console.log(friendList);

  // get friends start
  useEffect(() => {
    const friendRef = ref(db, "friends");
    onValue(friendRef, (snapshort) => {
      const list = [];
      snapshort.forEach((item) => {
        if (
          data.uid == item.val().receiverID ||
          data.uid == item.val().senderID
        ) {
          list.push({ ...item.val(), id: item.key });
        }
      });
      setFriendList(list);
    });
  }, []);
  // get friends end

  // unfriend start
  const handelUnfriend = (item) => {
    remove(ref(db, "friends/" + item.id));
  };
  // unfriend end

  // block start
  const handelBlock = (item) => {
    if (data.uid == item.senderID) {
      set(push(ref(db, "block")), {
        block: item.receiverName,
        blockID: item.receiverID,

        blockByName: item.senderName,
        blockByID: item.senderID,
      }).then(() => {
        remove(ref(db, "friends/" + item.id));
      });
    } else {
      set(push(ref(db, "block")), {
        block: item.senderName,
        blockID: item.senderID,

        blockByName: item.receiverName,
        blockByID: item.receiverID,
      }).then(() => {
        remove(ref(db, "friends/" + item.id));
      });
    }
  };
  // block end

  return (
    <div>
      <div className="containerTitle">
        <h2>Friends</h2>
        <BsThreeDotsVertical />
      </div>

      {friendList.map((item, i) => {
        return (
          <div key={i} className="friends_box">
            <div className="friends_list">
              <div className="friends">
                <div className="friends_img">
                  <ProfilePicture
                    imgID={
                      data.uid == item.senderID
                        ? item.receiverID
                        : item.senderID
                    }
                  />
                </div>
                <div className="friends_name">
                  {data.uid == item.senderID ? (
                    <h4> {item.receiverName} </h4>
                  ) : (
                    <h4> {item.senderName} </h4>
                  )}

                  <h5>Hello Everyone</h5>
                </div>
              </div>

              <div className="">
                <button
                  onClick={() => handelUnfriend(item)}
                  className="button_v_3"
                >
                  Unfriend
                </button>
                <button
                  onClick={() => handelBlock(item)}
                  className="button_v_2"
                >
                  Block
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Friends;
