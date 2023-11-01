import { BsThreeDotsVertical } from "react-icons/bs";
import "./Blocklist.css";
import { useEffect, useState } from "react";
import { getDatabase, onValue, ref, remove } from "firebase/database";
import { useSelector } from "react-redux";
import ProfilePicture from "../ProfilePicture/ProfilePicture";

const Blocklist = () => {
  const [blockList, setBlockList] = useState([]);
  const db = getDatabase();
  const data = useSelector((state) => state.userInfo.userInfo);

  useEffect(() => {
    const blockRef = ref(db, "block");
    onValue(blockRef, (snapShort) => {
      const list = [];
      snapShort.forEach((item) => {
        if (data.uid == item.val().blockByID) {
          list.push({
            id: item.key,
            block: item.val().block,
            blockID: item.val().blockID,
          });
        } 
        
        // else {
        //   list.push({
        //     id: item.key,
        //     blockByName: item.val().blockByName,
        //     blockByID: item.val().blockByID,
        //   });
        // }
      });
      setBlockList(list);
    });
  }, []);

  // unblock start
  const handelUnclock = (item) => {
    remove(ref(db, "block/" + item.id));
  };
  // unblock end

  return (
    <div>
      <div className="containerTitle">
        <h2>Blocked Users</h2>
        <BsThreeDotsVertical />
      </div>

      {blockList.map((item, i) => {
        return (
          <div key={i} className="blocklist_box">
            <div className="blocklist_list">
              <div className="blocklist">
                <div className="blocklist_img">
                  {item.blockByID ? (
                    <ProfilePicture imgID={item.blockByID} />
                  ) : (
                    <ProfilePicture imgID={item.blockID} />
                  )}
                </div>
                <div className="blocklist_name">
                  <h4> {item.blockID ? item.block : item.blockByName} </h4>
                  <h5>Hello Everyone</h5>
                </div>
              </div>

              <div className="">
                {item.blockByID ? (
                  ""
                  // <button className="button_v_3">I Blocked You</button>
                ) : (
                  <button
                    onClick={() => handelUnclock(item)}
                    className="button_v_3"
                  >
                    Unblock
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Blocklist;
