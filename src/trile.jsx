import React, { useState, useEffect } from 'react';
import { getDatabase, ref, set, remove, Database } from 'firebase/database';

// Initialize Firebase (import your Firebase configuration)

function App() {
  const [currentUser, setCurrentUser] = useState("user1_id");
  const [receiverUser, setReceiverUser] = useState("user2_id");

  const sendFriendRequest = () => {
    const senderRef = ref(database, `users/${currentUser}/friends/${receiverUser}`);
    set(senderRef, false); // Set the request as pending

    const receiverRef = ref(database, `users/${receiverUser}/friends/${currentUser}`);
    set(receiverRef, false); // Set the request as pending for the receiver
  };

  const cancelFriendRequest = () => {
    const senderRef = ref(database, `users/${currentUser}/friends/${receiverUser}`);
    remove(senderRef);

    const receiverRef = ref(database, `users/${receiverUser}/friends/${currentUser}`);
    remove(receiverRef);
  };

  useEffect(() => {
    // You can use this hook to load user data or handle authentication
    // For example, setCurrentUser based on the logged-in user
  }, []);

  return (
    <div>
      <h1>Friend Request Example</h1>
      <p>Current User: {currentUser}</p>
      <p>Receiver User: {receiverUser}</p>
      <button onClick={sendFriendRequest}>Send Friend Request</button>
      <button onClick={cancelFriendRequest}>Cancel Friend Request</button>
    </div>
  );
}

export default App;
