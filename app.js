// app.js

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyBWavAWu-Za3Q6n-cPJu2vBCWtpRLjbsEc",
    authDomain: "deadtalk3-7bd8d.firebaseapp.com",
    databaseURL: "https://deadtalk3-7bd8d-default-rtdb.firebaseio.com",
    projectId: "deadtalk3-7bd8d",
    storageBucket: "deadtalk3-7bd8d.appspot.com",
    messagingSenderId: "623956597741",
    appId: "1:623956597741:web:กรอกค่าที่ Firebase ให้"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  let userName = "";
  let currentRoom = "";
  let chatRef = null;
  let statusRef = null;
  let userStatusRef = null;
  let amOnlineRef = null;
  
  // Enter username and go to Lobby
  function enterName() {
    const name = document.getElementById('nameInput').value.trim();
    if (name) {
      userName = name;
      document.getElementById('displayName').textContent = userName;
      document.getElementById('home').style.display = 'none';
      document.getElementById('lobby').style.display = 'block';
    }
  }
  
  // Join or create a chat room
  function joinRoom() {
    const room = document.getElementById('roomInput').value.trim();
    if (!room) return;
    currentRoom = room;
    // Update UI
    document.getElementById('roomNameDisplay').textContent = "Room: " + currentRoom;
    document.getElementById('lobby').style.display = 'none';
    document.getElementById('chatroom').style.display = 'block';
  
    // Firebase references
    chatRef = firebase.database().ref('chatrooms/' + currentRoom);
    statusRef = firebase.database().ref('status/' + currentRoom);
    userStatusRef = statusRef.child(userName);
  
    // Online presence: set true and remove on disconnect
    amOnlineRef = firebase.database().ref('.info/connected');
    amOnlineRef.on('value', function(snapshot) {
      if (snapshot.val() === true) {
        // Set this user as online in the room
        userStatusRef.onDisconnect().remove();
        userStatusRef.set(true);
      }
    });
  
    // Load existing messages and listen for new ones
    chatRef.on('child_added', function(snapshot) {
      const msg = snapshot.val();
      if (msg) {
        const msgDiv = document.getElementById('messages');
        const p = document.createElement('p');
        p.innerHTML = "<strong>" + msg.sender + ":</strong> " + msg.text;
        msgDiv.appendChild(p);
        // Auto-scroll to bottom
        msgDiv.scrollTop = msgDiv.scrollHeight;
      }
    });
  
    // Listen for online users in this room
    statusRef.on('value', function(snapshot) {
      const users = [];
      snapshot.forEach(function(childSnapshot) {
        users.push(childSnapshot.key);
      });
      document.getElementById('onlineList').textContent = users.join(', ');
    });
  }
  
  // Send a message
  function sendMessage() {
    const input = document.getElementById('messageInput');
    const text = input.value.trim();
    if (text && chatRef) {
      chatRef.push({ sender: userName, text: text });
      input.value = '';
    }
  }
  
  // Leave the room
  function leaveRoom() {
    if (userStatusRef) {
      userStatusRef.remove();
    }
    // Detach listeners
    if (chatRef) {
      chatRef.off();
    }
    if (statusRef) {
      statusRef.off();
    }
    if (amOnlineRef) {
      amOnlineRef.off();
    }
    // Clear chat UI
    document.getElementById('messages').innerHTML = '';
    document.getElementById('onlineList').textContent = '';
    // Show lobby
    document.getElementById('chatroom').style.display = 'none';
    document.getElementById('lobby').style.display = 'block';
  }
  