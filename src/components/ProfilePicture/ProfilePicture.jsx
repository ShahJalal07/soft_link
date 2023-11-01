import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { useEffect, useState } from "react";

const ProfilePicture = ({ imgID }) => {
  let [profilePicture, setProfilePicture] = useState("");
  const storage = getStorage();
  const profilePictureRef = ref(storage, imgID);

  useEffect(() => {
    getDownloadURL(profilePictureRef)
      .then((url) => {
        setProfilePicture(url);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div>
      <img src={profilePicture} alt="" />
    </div>
  );
};

export default ProfilePicture;
