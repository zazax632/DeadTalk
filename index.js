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
const auth = firebase.auth();
const db = firebase.database();

// ---------------------- Elements ----------------------
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const displayNameInput = document.getElementById('displayName');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const toggleForm = document.getElementById('toggleForm');
const formTitle = document.getElementById('form-title');

let isLogin = true; // true = login, false = register

// ---------------------- Toggle Login/Register ----------------------
if (toggleForm) {
    toggleForm.addEventListener('click', () => {
        isLogin = !isLogin;
        if (isLogin) {
            formTitle.textContent = 'เข้าสู่ระบบ';
            loginBtn.style.display = 'block';
            registerBtn.style.display = 'none';
            displayNameInput.style.display = 'none';
            toggleForm.textContent = 'สมัครสมาชิก';
        } else {
            formTitle.textContent = 'สมัครสมาชิก';
            loginBtn.style.display = 'none';
            registerBtn.style.display = 'block';
            displayNameInput.style.display = 'block';
            toggleForm.textContent = 'เข้าสู่ระบบ';
        }
    });
}

// ---------------------- Login ----------------------
if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        if (!email || !password) return alert('กรุณากรอกอีเมลและรหัสผ่าน');

        auth.signInWithEmailAndPassword(email, password)
            .then(userCredential => {
                const uid = userCredential.user.uid;
                return db.ref('users/' + uid + '/displayName').once('value');
            })
            .then(snapshot => {
                const username = snapshot.val() || emailInput.value.split('@')[0];
                window.location.href = `lobby.html?user=${encodeURIComponent(username)}`;
            })
            .catch(error => alert('เข้าสู่ระบบไม่สำเร็จ: ' + error.message));
    });
}

// ---------------------- Register ----------------------
if (registerBtn) {
    registerBtn.addEventListener('click', () => {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const displayName = displayNameInput.value.trim();
        if (!email || !password || !displayName) return alert('กรุณากรอกอีเมล รหัสผ่าน และชื่อผู้ใช้');

        auth.createUserWithEmailAndPassword(email, password)
            .then(userCredential => {
                const user = userCredential.user;
                const uid = user.uid;
                // ตอนนี้ user authenticate แล้ว เราสามารถเขียนลง Realtime Database ได้
                return db.ref('users/' + uid).set({ displayName: displayName });
            })
            .then(() => {
                alert('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
                isLogin = true;
                formTitle.textContent = 'เข้าสู่ระบบ';
                loginBtn.style.display = 'block';
                registerBtn.style.display = 'none';
                displayNameInput.style.display = 'none';
                toggleForm.textContent = 'สมัครสมาชิก';
            })
            .catch(error => alert('สมัครสมาชิกไม่สำเร็จ: ' + error.message));
    });
}