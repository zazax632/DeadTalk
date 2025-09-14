// ---------------------- Firebase Config ----------------------
const firebaseConfig = {
  apiKey: "AIzaSyBWavAWu-Za3Q6n-cPJu2vBCWtpRLjbsEc",
  authDomain: "deadtalk3-7bd8d.firebaseapp.com",
  databaseURL: "https://deadtalk3-7bd8d-default-rtdb.firebaseio.com",
  projectId: "deadtalk3-7bd8d",
  storageBucket: "deadtalk3-7bd8d.appspot.com",
  messagingSenderId: "623956597741",
  appId: "1:623956597741:web:3e16f6b3f3e16f6b3e16f6"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

let username = null, currentRoomId = null, timer = null, usedQuestions = [];

// ---------------------- Questions 100 ----------------------
const questions = [
  // ใส่ 100 ข้อคำถามง่าย + ลึก ที่เราจัดเตรียม
];

// ---------------------- Utility ----------------------
function getRandomQuestion() {
  if (usedQuestions.length === questions.length) usedQuestions = [];
  let q;
  do { q = questions[Math.floor(Math.random()*questions.length)]; }
  while(usedQuestions.includes(q.text));
  usedQuestions.push(q.text);
  return q.text;
}

function startTimer() {
  let time = 180;
  const timerSpan = document.getElementById('timer');
  if (!timerSpan) return;
  timerSpan.textContent="03:00";
  clearInterval(timer);
  timer=setInterval(()=>{
    time--;
    let m = String(Math.floor(time/60)).padStart(2,'0');
    let s = String(time%60).padStart(2,'0');
    timerSpan.textContent=`${m}:${s}`;
    if(time<=0){
      clearInterval(timer);
      const qP=document.getElementById('currentQuestion');
      if(qP) qP.textContent="หมดเวลา!";
    }
  },1000);
}

// ---------------------- Login/Register ----------------------
if(document.getElementById('loginBtn')){
  const loginBtn=document.getElementById('loginBtn');
  const registerBtn=document.getElementById('registerBtn');
  const toggleForm=document.getElementById('toggleForm');
  const formTitle=document.getElementById('form-title');
  const emailInput=document.getElementById('email');
  const passwordInput=document.getElementById('password');

  toggleForm.addEventListener('click', ()=>{
    if(loginBtn.style.display!=="none"){
      loginBtn.style.display="none"; registerBtn.style.display="block";
      formTitle.textContent="สมัครสมาชิก"; toggleForm.textContent="เข้าสู่ระบบ";
    } else {
      loginBtn.style.display="block"; registerBtn.style.display="none";
      formTitle.textContent="เข้าสู่ระบบ"; toggleForm.textContent="สมัครสมาชิก";
    }
  });

  document.addEventListener('keypress', function(e){
    if(e.key==='Enter'){
      if(loginBtn.style.display!=="none") loginBtn.click();
      else registerBtn.click();
    }
  });

  registerBtn.addEventListener('click', ()=>{
    const email=emailInput.value.trim(), password=passwordInput.value.trim();
    if(!email||!password) return alert("กรุณากรอกข้อมูล");
    auth.createUserWithEmailAndPassword(email,password)
      .then(()=>alert("สมัครสำเร็จ!"))
      .catch(e=>alert("ผิดพลาด: "+e.message));
  });

  loginBtn.addEventListener('click', ()=>{
    const email=emailInput.value.trim(), password=passwordInput.value.trim();
    if(!email||!password) return alert("กรุณากรอกข้อมูล");
    auth.signInWithEmailAndPassword(email,password)
      .then(userCredential=>{
        username=email.split("@")[0];
        username = prompt("ตั้งชื่อผู้ใช้ของคุณ:", username) || username;
        window.location.href="lobby.html?user="+username;
      })
      .catch(e=>alert("เข้าสู่ระบบล้มเหลว: "+e.message));
  });
}

// ---------------------- Lobby ----------------------
if(document.getElementById('createRoomBtn')){
  const createRoomBtn=document.getElementById('createRoomBtn');
  const joinRoomBtn=document.getElementById('joinRoomBtn');
  const roomCodeInput=document.getElementById('roomCodeInput');
  const roomMsg=document.getElementById('roomMsg');
  const urlParams = new URLSearchParams(window.location.search);
  username = urlParams.get('user') || username;
  document.getElementById('usernameDisplay').textContent=username;

  createRoomBtn.addEventListener('click', ()=>{
    const roomId="room_"+Math.random().toString(36).substring(2,8);
    db.ref("rooms/"+roomId).set({createdBy:username});
    currentRoomId=roomId;
    window.location.href="room.html?room="+roomId+"&user="+username;
  });

  joinRoomBtn.addEventListener('click', ()=>{
    const roomId=roomCodeInput.value.trim();
    db.ref("rooms/"+roomId).get().then(snap=>{
      if(snap.exists()){
        currentRoomId=roomId;
        window.location.href="room.html?room="+roomId+"&user="+username;
      } else alert("รหัสห้องไม่ถูกต้อง");
    });
  });
}

// ---------------------- Room ----------------------
if(document.getElementById('messages')){
  const urlParams = new URLSearchParams(window.location.search);
  username=urlParams.get('user');
  currentRoomId=urlParams.get('room');
  document.getElementById('roomIdDisplay').textContent=currentRoomId;
  document.getElementById('usernameDisplayRoom').textContent=username;

  const msgInput=document.getElementById('msgInput');
  const sendBtn=document.getElementById('sendBtn');
  const messagesDiv=document.getElementById('messages');

  const messagesRef=db.ref("rooms/"+currentRoomId+"/messages");

  // โหลดข้อความ
  messagesRef.on('child_added', snap=>{
    const data=snap.val();
    const div=document.createElement('div');
    div.classList.add('msg');
    div.textContent=`${data.user}: ${data.text}`;
    messagesDiv.appendChild(div);
    messagesDiv.scrollTop=messagesDiv.scrollHeight;
  });

  function sendMessage(){
    const text=msgInput.value.trim();
    if(!text) return;
    messagesRef.push({user:username,text});
    msgInput.value="";
  }

  sendBtn.addEventListener('click', sendMessage);
  msgInput.addEventListener('keypress', e=>{if(e.key==='Enter') sendMessage();});

  // เริ่มคำถามแรก
  document.getElementById('currentQuestion').textContent=getRandomQuestion();
  startTimer();
}
