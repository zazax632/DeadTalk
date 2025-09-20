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
const auth = firebase.auth();

// ========================
// DeadTalk 100 Questions
// ========================
const questions = [
  "ถ้าคุณสามารถย้อนเวลากลับไปแก้ไขเรื่องหนึ่งในชีวิต คุณอยากเปลี่ยนอะไร?",
  "สิ่งที่คุณกลัวที่สุดในความสัมพันธ์คืออะไร?",
  "ความทรงจำในวัยเด็กที่ทำให้คุณยังรู้สึกเจ็บอยู่คือเรื่องอะไร?",
  "คุณคิดว่าคนรอบตัวคุณเห็นคุณเป็นคนแบบไหนจริงๆ?",
  "มีเรื่องอะไรที่คุณยังไม่เคยบอกใคร แต่คิดว่าถ้าเล่าจะรู้สึกเบาขึ้น?",
  "คุณเคยเสียใจมากที่สุดเรื่องอะไรในชีวิต?",
  "อะไรคือสิ่งที่ทำให้คุณรู้สึกโดดเดี่ยวที่สุด?",
  "คุณคิดว่าใครเป็นคนที่คุณไว้ใจได้มากที่สุด ทำไม?",
  "มีเหตุการณ์ไหนในชีวิตที่ทำให้คุณรู้สึกว่า “ชีวิตเปลี่ยนไปตลอดกาล”?",
  "คุณเคยรู้สึกว่าตัวเองไม่คู่ควรกับใครหรืออะไรบ้างไหม?",
  "อะไรคือความฝันที่คุณไม่เคยกล้าบอกใคร?",
  "คุณเคยทำร้ายใครโดยไม่ตั้งใจหรือไม่? ความรู้สึกตอนนั้นเป็นอย่างไร?",
  "คุณเคยรู้สึกว่าตัวเองหมดหวังจริง ๆ ครั้งสุดท้ายเมื่อไหร่?",
  "อะไรคือสิ่งที่ทำให้คุณร้องไห้โดยไม่รู้ตัว?",
  "คุณอยากให้คนอื่นจดจำคุณในด้านไหนมากที่สุด?",
  "ในความสัมพันธ์ที่ผ่านมา คุณเคยรู้สึกว่าตัวเองถูกเข้าใจผิดบ่อยไหม?",
  "คุณคิดว่าตัวเองยังรักษาความสัมพันธ์เก่า ๆ ได้ไหม?",
  "อะไรคือความทรงจำที่เจ็บปวดที่สุด แต่คุณไม่อยากลืม?",
  "คุณเคยรู้สึกว่าต้องปกป้องตัวเองมากเกินไปจนพลาดโอกาสรักไหม?",
  "คุณอยากแก้ไขความสัมพันธ์กับใครสักคน ถ้าได้โอกาสอีกครั้ง คุณจะทำอย่างไร?",
  "อะไรคือสิ่งที่คุณอยากทำแต่กลัวที่สุด?",
  "คุณเคยถูกหักหลังจากใครหรือสถานการณ์ไหนบ้าง?",
  "คุณคิดว่าความเหงาคืออะไรสำหรับตัวคุณ?",
  "มีช่วงเวลาไหนที่คุณรู้สึกว่า “ไม่เหลือใครเลย”?",
  "อะไรคือสิ่งที่คุณยังโกรธคนอื่นอยู่แม้เวลาผ่านไปนาน?",
  "คุณเคยรักใครโดยไม่หวังให้เขารักตอบไหม?",
  "มีเหตุการณ์ไหนที่ทำให้คุณเสียความมั่นใจในตัวเองมากที่สุด?",
  "คุณคิดว่าตัวเองเคยหลงทางในชีวิตจริง ๆ หรือไม่?",
  "อะไรคือสิ่งที่คุณอยากบอกตัวเองตอนอายุ 10 ปี?",
  "คุณเคยคิดอยากหนีจากทุกอย่างไหม?",
  "มีใครที่คุณยังอยากพูดคำขอโทษแม้เวลาจะผ่านไปนาน?",
  "คุณเคยรู้สึกว่าตัวเองไม่สามารถพึ่งพาใครได้เลยไหม?",
  "สิ่งที่ทำให้คุณรู้สึกปลอดภัยที่สุดคืออะไร?",
  "อะไรคือความลับที่คุณเก็บไว้เพราะกลัวคนอื่นจะไม่เข้าใจ?",
  "คุณเคยรู้สึกว่าโลกไม่ยุติธรรมกับตัวเองไหม?",
  "คุณเคยมีความรักที่ไม่สมหวังหรือไม่?",
  "คุณเคยทำอะไรที่ละอายใจแต่ไม่มีใครรู้ไหม?",
  "สิ่งที่ทำให้คุณยิ้มได้จริง ๆ คืออะไร?",
  "คุณเคยพยายามเปลี่ยนตัวเองเพื่อใครหรือสถานการณ์ไหม?",
  "มีความคิดอะไรที่คุณไม่กล้าบอกใคร?",
  "คุณเคยเสียใจกับการตัดสินใจแบบทันทีทันใดไหม?",
  "ใครคือคนที่คุณอยากให้เข้าใจคุณที่สุด?",
  "คุณเคยรู้สึกว่าคนรอบตัวไม่เห็นคุณค่าของตัวเองไหม?",
  "อะไรคือสิ่งที่คุณเสียใจแต่กลับไม่สามารถแก้ไขได้?",
  "คุณเคยถูกปฏิเสธในสิ่งที่สำคัญที่สุดไหม?",
  "คุณเคยรู้สึกว่าตัวเองเป็นภาระต่อใครไหม?",
  "สิ่งที่ทำให้คุณกลัวที่สุดเกี่ยวกับอนาคตคืออะไร?",
  "คุณเคยมีความรู้สึก “อยากหายไปจากทุกคน” ไหม?",
  "มีใครที่คุณคิดถึงมากที่สุดตอนนี้?",
  "อะไรคือสิ่งที่คุณอยากให้คนอื่นเข้าใจเกี่ยวกับตัวคุณ?",
  "คุณเคยรู้สึกว่าตัวเองเป็นคนแปลกแยกไหม?",
  "สิ่งที่ทำให้คุณรู้สึกอ่อนแอที่สุดคืออะไร?",
  "คุณเคยคิดว่าชีวิตคุณหมดหวังจริง ๆ ไหม?",
  "คุณอยากจะบอกใครสักคนว่าอะไรแต่ไม่กล้า?",
  "มีเหตุการณ์ไหนที่ทำให้คุณตัดสินใจเปลี่ยนชีวิตทันที?",
  "คุณเคยเสียใจที่ไม่ได้พูดความรู้สึกจริง ๆ กับใครไหม?",
  "สิ่งที่ทำให้คุณรู้สึกภูมิใจในตัวเองคืออะไร?",
  "คุณเคยเจ็บปวดจากความรักแบบไหนมากที่สุด?",
  "คุณเคยสงสัยว่าตัวเองควรอยู่บนโลกนี้ไหม?",
  "คุณเคยรักใครจนลืมตัวเองไหม?",
  "มีใครที่คุณอยากกลับไปขอโทษหรือขอคืนดีกับเขาไหม?",
  "คุณเคยคิดว่าตัวเองถูกทิ้งโดยไม่มีเหตุผลไหม?",
  "สิ่งที่คุณเกลียดในตัวเองมากที่สุดคืออะไร?",
  "คุณเคยเสียใจที่ไว้วางใจใครมากเกินไปไหม?",
  "คุณอยากใช้เวลาทำอะไรเพื่อตัวเองที่สุดในชีวิต?",
  "คุณเคยคิดว่าตัวเองไม่มีค่าไหม?",
  "อะไรคือความทรงจำที่คุณอยากเก็บไว้ตลอดไป?",
  "คุณเคยรู้สึกว่าใครบางคนทำร้ายคุณทางอารมณ์ไหม?",
  "คุณอยากบอกตัวเองในอดีตว่าควรทำอะไรต่างไปไหม?",
  "คุณเคยรู้สึกว่าไม่มีใครเข้าใจคุณจริง ๆ ไหม?",
  "คุณเคยเศร้าแบบไม่รู้สาเหตุไหม?",
  "อะไรคือสิ่งที่คุณอยากบอกคนที่จากไปแล้ว?",
  "คุณเคยหลงรักคนที่ไม่ควรรักไหม?",
  "สิ่งที่ทำให้คุณหัวเราะอย่างสุดใจคืออะไร?",
  "คุณเคยรู้สึกอิจฉาคนอื่นแบบไม่สามารถควบคุมได้ไหม?",
  "คุณเคยลังเลระหว่างหัวใจและเหตุผลไหม?",
  "อะไรคือสิ่งที่คุณอยากทำแต่ไม่กล้าทำเพราะกลัวล้มเหลว?",
  "คุณเคยเสียใจที่ไม่ได้บอกความรักกับใครสักคนไหม?",
  "คุณเคยรู้สึกว่าต้องปกป้องตัวเองเกินไปจนเหนื่อยไหม?",
  "คุณเคยเก็บความเศร้าไว้คนเดียวไหม?",
  "คุณเคยตั้งคำถามว่าตัวเองทำอะไรผิดในชีวิตไหม?",
  "คุณอยากใช้ชีวิตในวัยเด็กอีกครั้งไหม?",
  "คุณเคยคิดว่าคนที่คุณรักทำร้ายคุณทางอารมณ์ไหม?",
  "อะไรคือสิ่งที่ทำให้คุณรู้สึกมีค่าในตัวเอง?",
  "คุณเคยรักใครจนเจ็บปวดแต่ก็ไม่อยากเลิกไหม?",
  "คุณเคยคิดว่าตัวเองไม่เหมาะกับใครหรือสิ่งใดไหม?",
  "คุณอยากพูดอะไรกับคนที่ทำร้ายใจคุณที่สุด?",
  "คุณเคยรู้สึกว่าไม่มีใครเห็นความเหนื่อยของคุณไหม?",
  "คุณเคยรักใครโดยไม่หวังสิ่งตอบแทนไหม?",
  "สิ่งที่คุณอยากทำก่อนตายคืออะไร?",
  "คุณเคยเสียใจเพราะไม่ได้ทำตามหัวใจตัวเองไหม?",
  "คุณอยากขอโทษใครสักคน แต่ทำไม่ได้ไหม?",
  "คุณเคยรู้สึกว่าตัวเองโดดเดี่ยวแม้อยู่กับคนอื่นไหม?",
  "คุณเคยเสียใจกับการเลือกทางเดินชีวิตของตัวเองไหม?",
  "คุณอยากพูดอะไรกับตัวเองตอนนี้ถ้าได้กลับไป?",
  "คุณเคยรู้สึกว่าตัวเองไม่ควรได้รับความรักไหม?",
  "คุณเคยอยากเลิกสนใจโลกใบนี้ไหม?",
  "คุณอยากให้คนอื่นจำสิ่งไหนเกี่ยวกับคุณที่สุด?",
  "คุณเคยรู้สึกว่าไม่มีใครฟังคุณจริง ๆ ไหม?",
  "ถ้าคุณสามารถเปลี่ยนแปลงใจใครได้ คุณอยากเปลี่ยนใจใครและทำไม?"
];

// ---------------------- URL & Elements ----------------------
const urlParams = new URLSearchParams(window.location.search);
let username = urlParams.get('user');   // ชื่อผู้ใช้
const currentRoomId = urlParams.get('room'); // ถ้ามี

const roomDisplay = document.getElementById('roomIdDisplay');
const userDisplay = document.getElementById('usernameDisplayRoom');
const messagesDiv = document.getElementById('messages');
const msgInput = document.getElementById('msgInput');
const sendBtn = document.getElementById('sendBtn');
const questionDisplay = document.getElementById('currentQuestion');
const timerDisplay = document.getElementById('timer');

// ---------------------- Lobby ----------------------
const createRoomBtn = document.getElementById('createRoomBtn');
const joinRoomBtn = document.getElementById('joinRoomBtn');
const roomCodeInput = document.getElementById('roomCodeInput');
const roomMsg = document.getElementById('roomMsg');

if (roomDisplay) roomDisplay.textContent = currentRoomId;
if (userDisplay) userDisplay.textContent = username;

if (createRoomBtn) {
  createRoomBtn.addEventListener('click', () => {
    const roomId = 'room_' + Math.floor(1000 + Math.random() * 9000); // room_0000 - room_9999
    window.location.href = `room.html?user=${encodeURIComponent(username)}&room=${roomId}`;
  });
}

if (joinRoomBtn) {
  joinRoomBtn.addEventListener('click', () => {
    const roomId = roomCodeInput.value.trim();
    if (!roomId) return roomMsg.textContent = "กรุณากรอกรหัสห้อง";
    window.location.href = `room.html?user=${encodeURIComponent(username)}&room=${roomId}`;
  });
}

// ---------------------- Room ----------------------
if (currentRoomId && username) {
  const messagesRef = db.ref("rooms/" + currentRoomId + "/messages");
  const statusRef = db.ref("status/" + currentRoomId);
  const playersRef = db.ref("status/" + currentRoomId + "/players");

  // แสดง chat
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

  // ผู้เล่นเข้าห้อง
  playersRef.child(username).set(true);
  playersRef.child(username).onDisconnect().remove();

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
    if (!data || !data.currentQuestion || !questionDisplay) return;
    questionDisplay.textContent = data.currentQuestion;
  });
}