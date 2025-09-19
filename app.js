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
  
  // ---------------------- Questions ----------------------
  const questions = [
  "ถ้าวันนี้เป็นวันสุดท้ายของชีวิต คุณอยากทำอะไร?",
  "อะไรคือสิ่งที่ทำให้คุณยิ้มได้เสมอ?",
  "คุณเคยร้องไห้เพราะความสุขครั้งสุดท้ายเมื่อไหร่?",
  "อะไรคือความทรงจำที่คุณอยากกลับไปอีกครั้ง?",
  "คำถามอื่นๆ..."
  ];
  
  // ---------------------- Elements ----------------------
  const urlParams = new URLSearchParams(window.location.search);
  const username = urlParams.get('user');
  const currentRoomId = urlParams.get('room');
  
  const roomDisplay = document.getElementById('roomIdDisplay');
  const userDisplay = document.getElementById('usernameDisplayRoom');
  const messagesDiv = document.getElementById('messages');
  const msgInput = document.getElementById('msgInput');
  const sendBtn = document.getElementById('sendBtn');
  const questionDisplay = document.getElementById('currentQuestion');
  const timerDisplay = document.getElementById('timer');
  
  if (roomDisplay) roomDisplay.textContent = currentRoomId;
  if (userDisplay) userDisplay.textContent = username;
  
  const messagesRef = currentRoomId ? db.ref("rooms/" + currentRoomId + "/messages") : null;
  const statusRef = currentRoomId ? db.ref("status/" + currentRoomId) : null;
  const playersRef = currentRoomId ? db.ref("status/" + currentRoomId + "/players") : null;
  
  // ---------------------- Chat & Room ----------------------
  if (currentRoomId && username) {
  // Chat
  messagesRef.on('child_added', snap => {
  const data = snap.val();
  if (!data || !messagesDiv) return;
  const div = document.createElement('div');
  div.classList.add('msg');
  div.textContent = `${data.user}: ${data.text}`;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });
  
  function sendMessage() {
  if (!msgInput) return;
  const text = msgInput.value.trim();
  if (!text) return;
  messagesRef.push({ user: username, text });
  msgInput.value = "";
  }
  
  if (sendBtn) sendBtn.addEventListener('click', sendMessage);
  if (msgInput) msgInput.addEventListener('keypress', e => { if (e.key === 'Enter') sendMessage(); });
  
  // Player Join
  playersRef.child(username).set(true);
  window.addEventListener('beforeunload', () => {
  playersRef.child(username).remove();
  });
  
  // Question & Timer
  let questionStarted = false;
  let questionTimer = null;
  let timerInterval = null;
  
  playersRef.on('value', snap => {
  const players = snap.val() || {};
  const playerCount = Object.keys(players).length;
  
  if (!questionStarted && playerCount >= 2) {
  questionStarted = true;
  const firstQ = questions[Math.floor(Math.random() * questions.length)];
  statusRef.set({ currentQuestion: firstQ, startTime: Date.now() });
  
  // เปลี่ยนคำถามทุก 3 นาที
  questionTimer = setInterval(() => {
  const newQ = questions[Math.floor(Math.random() * questions.length)];
  statusRef.update({ currentQuestion: newQ, startTime: Date.now() });
  }, 3 * 60 * 1000);
  
  // Timer
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
  statusRef.once('value').then(snap => {
  const data = snap.val();
  if (!data || !data.startTime || !timerDisplay) return;
  const elapsed = Math.floor((Date.now() - data.startTime) / 1000);
  let remaining = 180 - elapsed;
  if (remaining < 0) remaining = 0;
  const m = String(Math.floor(remaining / 60)).padStart(2,'0');
  const s = String(remaining % 60).padStart(2,'0');
  timerDisplay.textContent = `${m}:${s}`;
  });
  }, 500);
  }
  });
  
  // ฟังคำถามปัจจุบัน
  statusRef.on('value', snap => {
  const data = snap.val();
  if (!data || !questionDisplay || !data.currentQuestion) return;
  questionDisplay.textContent = data.currentQuestion;
  });
  }