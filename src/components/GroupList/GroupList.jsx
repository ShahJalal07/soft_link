import { useEffect, useState } from "react";
import "./GroupList.css";
import { AiFillCloseCircle, AiFillPlusCircle } from "react-icons/ai";
import { getDatabase, onValue, push, ref, remove, set } from "firebase/database";
import { useSelector } from "react-redux";

const GroupList = () => {
  const data = useSelector((state) => state.userInfo.userInfo);
  const [show, setShow] = useState(true);

  const [groupName, setGroupName] = useState("");
  const handelGroupName = (e) => {
    setGroupName(e.target.value);
    setNameError("");
  };
  const [groupInfo, setGroupInfo] = useState("");
  const handelGroupInfo = (e) => {
    setGroupInfo(e.target.value);
    setInfoError("");
  };

  // error start
  const [NameError, setNameError] = useState("");
  const [InfoError, setInfoError] = useState("");
  // error end

  // database start
  const db = getDatabase();
  // database end

  // group data send start
  const handelGroup = () => {
    if (groupName == "") {
      setNameError("Group Name Is Requared");
    } else if (groupInfo == "") {
      setInfoError("Group Info Is Requared");
    } else {
      set(push(ref(db, "groups")), {
        groupName: groupName,
        groupInfo: groupInfo,
        adminName: data.displayName,
        adminID: data.uid,
      }).then(() => {
        setGroupName("");
        setGroupInfo("");
        setShow(true);
      });
    }
  };
  // group data send end

  // group data get start
  const groupRef = ref(db, "groups");
  const [groupList, setGroupList] = useState([]);
  useEffect(() => {
    onValue(groupRef, (snapShort) => {
      const list = [];
      snapShort.forEach((item) => {
        if (data.uid != item.val().adminID) {
          list.push({ ...item.val(), id: item.key });
        }
      });
      setGroupList(list);
    });
  }, []);

  // group data get end

  // handel join start
  const handelJoin = (item) => {
    set(push(ref(db, "groupJoinRequest")), {
      groupId: item.id,
      groupName: item.groupName,
      groupInfo: item.groupInfo,
      groupAdminName: item.adminName,
      groupAdminID: item.adminID,
      senderID: data.uid,
      sernderName: data.displayName,
    });
  };
  // handel join end

  // group requestlist get start
  const [groupRequestList, setGroupRequestList] = useState([]);
  useEffect(() => {
    const groupRequestRef = ref(db, "groupJoinRequest");
    onValue(groupRequestRef, (snapShort) => {
      let list = [];
      snapShort.forEach((item) => {
        list.push(
          item.val().senderID + item.val().groupId ||
            item.val().groupId + item.val().senderID
        );
      });
      setGroupRequestList(list);
    });
  }, []);
  // group requestlist get end

  
  // cancle group request start
  const [groupRequestget, setGroupRequestget] = useState([])
  useEffect(() => {
  const groupRequestRef= ref(db, "groupJoinRequest")
  
  onValue(groupRequestRef,(snapShort)=>{
    const list=[]
    snapShort.forEach((item)=>{
      list.push({...item.val(), key:item.key})
    })
    setGroupRequestget(list)
  })
  
  }, [])
  
  const handelJoinCancle =(item)=>{
    const cancle={
      groupId: item.id,
      groupName: item.groupName,
      groupInfo: item.groupInfo,
      groupAdminName: item.adminName,
      groupAdminID: item.adminID,
      senderID: data.uid,
      sernderName: data.displayName,
    }
    const cancleRequest = groupRequestget?.find((item)=>
      item.senderID===cancle.senderID && item.groupAdminID===cancle.groupAdminID
    )
    remove(ref(db, "groupJoinRequest/" + cancleRequest.key))
  }
  // cancle group request end

  return (
    <div>
      <div className="containerTitle">
        <h2>Group List</h2>

        {show ? (
          <AiFillPlusCircle
            onClick={() => setShow(false)}
            className="group_icon"
          />
        ) : (
          <AiFillCloseCircle
            onClick={() => setShow(true)}
            className="group_icon_close"
          />
        )}
      </div>

      <div className="group_box">
        {show ? (
          groupList.map((item, i) => {
            return (
              <div key={i} className="group_list">
                <div className="group_list_item">
                  <div className="group_img">
                    
                  </div>

                  <div className="group_name_area">
                    <h4>{item.groupName}</h4>
                    <h3>{item.adminName}</h3>
                    <h5>{item.groupInfo}</h5>
                  </div>
                </div>
                <div>
                  {groupRequestList.includes(data.uid + item.id) ||
                  groupRequestList.includes(item.id + data.uid) ? (
                    <button onClick={()=>handelJoinCancle(item)} className="button_v_2">Cancle Request</button>
                  ) : (
                    <button
                      onClick={() => handelJoin(item)}
                      className="button_v_1"
                    >
                      Join
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="creatgroup">
            <input
              value={groupName}
              onChange={handelGroupName}
              type="text"
              placeholder="Give the group name"
            />
            <p className="errortext">{NameError}</p>
            <input
              value={groupInfo}
              onChange={handelGroupInfo}
              type="text"
              placeholder="Give the group info"
            />
            <p className="errortext">{InfoError}</p>
            <button onClick={handelGroup} className="button_v_3">
              Creat Your Group
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupList;
