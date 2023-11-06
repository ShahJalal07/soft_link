import { BsThreeDotsVertical } from "react-icons/bs";
import "./Mygroups.css";
import {
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  set,
} from "firebase/database";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { modelclass } from "../../slices/userSlice";
import { AiFillCloseCircle } from "react-icons/ai";
import ProfilePicture from "../ProfilePicture/ProfilePicture";
const Mygroups = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.userInfo.userInfo);
  const group = useSelector((state) => state.userInfo.groupdelete);
  const db = getDatabase();
  const groupRef = ref(db, "groups");

  const [groupList, setGroupList] = useState([]);

  useEffect(() => {
    onValue(groupRef, (snapShort) => {
      const list = [];
      snapShort.forEach((item) => {
        if (data.uid == item.val().adminID) {
          list.push({ ...item.val(), id: item.key });
        }
      });
      setGroupList(list);
    });
  }, []);

  // group delete start

  const [groupColse, setgroupClose] = useState(false);

  const handelgroupdelete = (item) => {
    localStorage.setItem("group", JSON.stringify(item));
    // dispatch(modelclass(true));
    setgroupClose(true);
  };

  const groupdata = JSON.parse(localStorage.getItem("group"));
  const [input, setInput] = useState("");

  const [isDeleteActive, setIsDeleteActive] = useState(false);
  const grouningput = (e) => {
    const inputText = e.target.value;
    if (inputText === groupdata?.groupName) {
      setIsDeleteActive(true);
    } else {
      setIsDeleteActive(false);
    }
    setInput(inputText);
  };

  const handelDelete = (item) => {
    remove(ref(db, "groups/" + item.id));
    localStorage.removeItem("group");
    setgroupClose(false);
    setInput("");
    setIsDeleteActive(false);
  };
  // group delete end

  // pop up close start
  const handelCancle = () => {
    localStorage.removeItem("group");
    setgroupClose(false);
    setInput("");
  };
  // pop up close end

  const [requestClose, setRequestClose] = useState(false);
  const [groupData, setGroupData] = useState([]);
  const [groupJoinRequestList, setgroupJoinRequestList] = useState([]);

  // group request get and close start
  const handelRequestClose = (group) => {
    setRequestClose(!requestClose);
    setGroupData(group);

    const groupRequestRef = ref(db, "groupJoinRequest");
    onValue(groupRequestRef, (snapShort) => {
      let list = [];
      snapShort.forEach((item) => {
        if (
          data.uid == item.val().groupAdminID &&
          item.val().groupId == group.id
        ) {
          list.push({
            ...item.val(),
            id: item.key,
          });
        }
      });
      setgroupJoinRequestList(list);
    });
  };
  //group request get and close end

  // group request get for length show start

  let list = [];
  const groupId = groupList.find((item) => {
    list.push(item);
  });

  const [requestList, setRequestList] = useState([]);
  useEffect(() => {
    const groupRequestRef = ref(db, "groupJoinRequest");
    onValue(groupRequestRef, (snapShort) => {
      let list = [];
      snapShort.forEach((item) => {
        if (data.uid == item.val().groupAdminID) {
          list.push({
            ...item.val(),
            id: item.key,
          });
        }
      });
      setRequestList(list);
    });
  }, []);
  // group request get for length show end

  //group request accept start
  const handelGroupRequestAccept = (item) => {
    set(push(ref(db, "groupMenmbers")), {
      groupID: item.groupId,
      groupName: item.groupName,
      adminID: item.groupAdminID,
      adminName: item.groupAdminName,
      senderID: item.senderID,
      sernderName: item.sernderName,
    }).then(() => {
      remove(ref(db, "groupJoinRequest/" + item.id));
    });
  };
  //group request accept end

  // group request cnacle start
  const handelGroupRequestCancle = (item) => {
    remove(ref(db, "groupJoinRequest/" + item.id));
  };
  // group request cnacle end

  // group info start
  const [groupInfoClose, setGroupInfoClose] = useState(false);
  const [groupMemnersList, setGroupMembersList] = useState([]);
  console.log(groupMemnersList);
  const handelGroupInfo = (groupInfo) => {
    setGroupData(groupInfo)
    setGroupInfoClose(!groupInfoClose);
    const groupMemberRef = ref(db, "groupMenmbers");
    onValue(groupMemberRef, (snapShort) => {
      const list = [];
      snapShort.forEach((item) => {
        if (
          data.uid == groupInfo.adminID &&
          item.val().groupID == groupInfo.id
        ) {
          list.push({ ...item.val(), id: item.key });
        }
      });
      setGroupMembersList(list);
    });
  };
  // group info end

  // group member unfriend start
  const handelGrouMemberUnfriend=(item)=>{
    remove(ref(db, "groupMenmbers/" + item.id));
  }
  // group member unfriend end

  return (
    <div>
      {groupInfoClose ? (
        <div className="containerTitle ti">
          <h2>{groupData.groupName}</h2>
          <AiFillCloseCircle
            className="group_req_icon_close"
            onClick={() => setGroupInfoClose(!groupInfoClose)}
          />
        </div>
      ) : requestClose ? (
        <div className="containerTitle ti">
          <h2>{groupData.groupName}</h2>
          <AiFillCloseCircle
            onClick={() => setRequestClose(!requestClose)}
            className="group_req_icon_close"
          />
        </div>
      ) : (
        <div className="containerTitle ti">
          <h2>My Groups</h2>
          <BsThreeDotsVertical />
        </div>
      )}

      {requestClose ? (
        <div className="group_request_list">
          {groupJoinRequestList.map((item, i) => {
            return (
              <div key={i} className="group_req_list">
                <div className="groupreq">
                  <div className="group_img">
                    <ProfilePicture imgID={item.senderID} />
                  </div>
                  <div className="group_name">
                    <h4> {item.sernderName} </h4>
                  </div>
                </div>

                <div className="">
                  <button
                    onClick={() => handelGroupRequestCancle(item)}
                    className="button_v_2"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handelGroupRequestAccept(item)}
                    className="button_v_3"
                  >
                    Accept
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : groupColse ? (
        <div className="group_delet">
          <h1>
            Do yo wante to delete <span>{groupdata.groupName} </span> ?
          </h1>
          <input
            onChange={grouningput}
            type="text"
            placeholder="Delete group name"
            value={input}
          />
          <div className="group_buttons">
            {isDeleteActive ? (
              <button
                onClick={() => handelDelete(groupdata)}
                className="button_v_2"
              >
                confirm
              </button>
            ) : (
              <button className="group_confirm">Confirm</button>
            )}

            <button onClick={handelCancle} className="button_v_1">
              cancle
            </button>
          </div>
        </div>
      ) : groupInfoClose ? (
        <div className="group_request_list">
          {groupMemnersList.map((item, i) => {
            return (
              <div key={i} className="group_req_list">
                <div className="groupreq">
                  <div className="group_img">
                    <ProfilePicture imgID={item.senderID} />
                  </div>
                  <div className="group_name">
                    <h4> {item.sernderName} </h4>
                  </div>
                </div>

                <div className="">
                  <button
                    onClick={() => handelGrouMemberUnfriend(item)}
                    className="button_v_2"
                  >
                   Unfriend
                  </button>
                  
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        groupList.map((item, i) => {
          return (
            <div key={i} className="mygroup_box">
              <div className="mygroup_list">
                <div className="mygroup">
                  <div className="mygroup_img"></div>
                  <div className="mygroup_name">
                    <h4>{item.groupName}</h4>
                    <h3>{item.adminName}</h3>
                    <h5>{item.groupInfo}</h5>
                  </div>
                </div>

                <div className="mygroupDateTime">
                  <button
                    onClick={() => handelgroupdelete(item)}
                    className="button_v_2"
                  >
                    Delete
                  </button>

                  <button
                    onClick={() => handelRequestClose(item)}
                    className="button_v_1"
                  >
                    <span className="group_req_count">{list.length}</span>
                    Request
                  </button>
                  <button
                    onClick={() => handelGroupInfo(item)}
                    className="button_v_3"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Mygroups;
