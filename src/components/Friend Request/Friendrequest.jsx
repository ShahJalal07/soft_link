import { BsThreeDotsVertical } from "react-icons/bs";

import "./Friendrequest.css";
import { getDatabase, onValue, push, ref, remove, set } from "firebase/database";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import ProfilePicture from "../ProfilePicture/ProfilePicture";

const Friendrequest = () => {
  
  const db = getDatabase();
  const data = useSelector((state) => state.userInfo.userInfo);

  // friend request get start
  let [friendRequestList, setFriendRequestList] = useState([]);
  useEffect(() => {
    const friendRequestRef = ref(db, "friendRequest");
    
    onValue(friendRequestRef, (snapshort) => {
      let list = [];
      snapshort.forEach((item) => {
        if (data.uid === item.val().receiverID) {
          list.push({ ...item.val(), id: item.key });
        }
      });
      setFriendRequestList(list);
    });
  }, []);
  // friend request get end

  // friend request accept start
  const handelFriendRequestAccept = (item) => {
    set(push(ref(db, "friends")), {
      ...item
    })
    .then(()=>{
      remove(ref(db, "friendRequest/" + item.id))
    });
  };
  // friend request accept end

  // friend request cancle start
  const handelFriendCancle = (item)=>{
    remove(ref(db, "friendRequest/" + item.id))
  }
  // friend request cancle end

  

  return (
    
    <div>
      <div className="containerTitle">
        <h2>Friend Request</h2>
        <BsThreeDotsVertical />
      </div>
      {friendRequestList.map((item) => {
        return (
          <div key={item.id} className="friendreq_box">
            <div className="friendreq_list">
              <div className="friendreq">
                <div className="friendreq_img">
                  <ProfilePicture imgID={item.senderID} />
                </div>
                <div className="friendreq_name">
                  <h4> {item?.senderName} </h4>
                </div>
              </div>

              <div className="">
                <button onClick={() => handelFriendCancle(item)} className="button_v_2">Delete</button>
                <button
                  onClick={() => handelFriendRequestAccept(item)}
                  className="button_v_1"
                >
                  Accept
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Friendrequest;
