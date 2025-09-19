// ---------------------- Firebase Config ----------------------
const firebaseConfig = {
  apiKey: "AIzaSyBWavAWu-Za3Q6n-cPJu2vBCWtpRLjbsEc",
  authDomain: "deadtalk3-7bd8d.firebaseapp.com",
  databaseURL: "https://deadtalk3-7bd8d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "deadtalk3-7bd8d",
  storageBucket: "deadtalk3-7bd8d.appspot.com",
  messagingSenderId: "623956597741",
  appId: "1:623956597741:web:3e16f6b3f3e16f6b3e16f6"
  };
  firebase.initializeApp(firebaseConfig);
  const db = firebase.database();
  
  let username = null;
  let currentRoomId = null;
  let questionTimer = null;
  
  // ---------------------- Questions ----------------------
  const questions = [
  "ถ้าวันนี้เป็นวันสุดท้ายของชีวิต คุณอยากทำอะไร?",
  "อะไรคือสิ่งที่ทำให้คุณยิ้มได้เสมอ?",
  "คุณเคยร้องไห้เพราะความสุขครั้งสุดท้ายเมื่อไหร่?",
  "อะไรคือความทรงจำที่คุณอยากกลับไปอีกครั้ง?",
  "คำถามอื่นๆ..."
  ];
  
  // ---------------------- Room ----------------------
  const urlParams = new URLSearchParams(window.location.search);
  username = urlParams.get('user');
  currentRoomId = urlParams.get('room');
  
  document.getElementById('roomIdDisplay').textContent = currentRoomId;
  document.getElementById('usernameDisplayRoom').textContent = username;
  
  const messagesDiv = document.getElementById('messages');
  const msgInput = document.getElementById('msgInput');
  const sendBtn = document.getElementById('sendBtn');
  
  const messagesRef = db.ref("rooms/" + currentRoomId + "/messages");
  const statusRef = db.ref("status/" + currentRoomId);
  const playersRef = db.ref("status/" + currentRoomId + "/players");
  
  // ---------------------- Chat ----------------------
  messagesRef.on('child_added', snap => {
  const data = snap.val();
  if (!data) return;
  const div = document.createElement('div');
  div.classList.add('msg');
  div.textContent = `${data.user}: ${data.text}`;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });
  
  function sendMessage() {
  const text = msgInput.value.trim();
  if (!text) return;
  messagesRef.push({ user: username, text });
  msgInput.value = "";
  }
  sendBtn.addEventListener('click', sendMessage);
  msgInput.addEventListener('keypress', e => { if (e.key === 'Enter') sendMessage(); });
  
  // ---------------------- Player Join ----------------------
  // ลงทะเบียนผู้เล่น
  playersRef.child(username).set(true);
  
  // ลบผู้เล่นเมื่อปิดหน้า
  window.addEventListener('beforeunload', () => {
  playersRef.child(username).remove();
  });
  
  // ---------------------- Question ----------------------
  let questionStarted = false;
  
  playersRef.on('value', snap => {
  const players = snap.val() || {};
  const playerCount = Object.keys(players).length;
  
  // เริ่มคำถามเมื่อผู้เล่น >= 2 คน
  if (!questionStarted && playerCount >= 2) {
  questionStarted = true;
  
  const firstQ = questions[Math.floor(Math.random() * questions.length)];
  statusRef.set({ currentQuestion: firstQ, startTime: Date.now() });
  
  // เปลี่ยนคำถามทุก 3 นาที
  questionTimer = setInterval(() => {
  const newQ = questions[Math.floor(Math.random() * questions.length)];
  statusRef.update({ currentQuestion: newQ, startTime: Date.now() });
  }, 3 * 60 * 1000);
  }
  });
  
  // ฟังคำถามและเวลา
  let timerInterval = null;
  statusRef.on('value', snap => {
  const data = snap.val();
  if (!data) return;
  
  // อัปเดตคำถาม
  document.getElementById('currentQuestion').textContent = data.currentQuestion;
  
  // อัปเดตตัวจับเวลา
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
  const elapsed = Math.floor((Date.now() - data.startTime) / 1000);
  let remaining = 180 - elapsed;
  if (remaining < 0) remaining = 0;
  const m = String(Math.floor(remaining / 60)).padStart(2,'0');
  const s = String(remaining % 60).padStart(2,'0');
  document.getElementById('timer').textContent = `${m}:${s}`;
  }, 500);
  });