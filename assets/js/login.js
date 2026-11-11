/**
 * ICT EASY LEARNING - NEUMORPHIC AUTH SCRIPT (login.js)
 * Handles authentic login, registration, password reset, avatar uploads, and sessions
 * Seamlessly integrates with Node.js Express & MongoDB backend (port 5000 / Live Server / GitHub Pages)
 */

let uploadedAvatarDataUrl = '';

/**
 * বাংলা ও ইংরেজি সংখ্যার স্বাভাবিক রূপান্তরকারী হেল্পার
 * (যেমন: মোবাইল নম্বর '০১৭...' বা পাসওয়ার্ড '১২৩৪' যাতে ইংরেজি '017...', '1234' এর সাথে হুবহু মিলে)
 */
function normalizeBanglaDigits(str) {
    if (!str && str !== 0) return '';
    const bn = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(str).replace(/[০-৯]/g, d => bn.indexOf(d)).trim();
}
window.normalizeBanglaDigits = normalizeBanglaDigits;

document.addEventListener('DOMContentLoaded', () => {
    initAuthTabs();
    initPasswordToggles();
    initAvatarUpload();
    initInputClearListeners();
    checkExistingSession();
    checkServerConnectionStatus();
});

/**
 * ব্যাকএন্ড এপিআই বেস URL নির্ধারণ
 * লাইভ সার্ভার (৫৫০০), লোকালহোস্ট (৩০০০/৫০০), ফাইল বা গিটহাব পেজ সব জায়গা থেকেই ব্যাকএন্ড যুক্ত থাকবে
 */
function getAuthApiBaseUrl() {
    // ১. কাস্টম লাইভ ব্যাকএন্ড URL (যদি কনফিগার করা থাকে)
    const liveApi = localStorage.getItem('ICT_LIVE_API_URL');
    if (liveApi && liveApi.trim() !== '') {
        return liveApi.trim().replace(/\/+$/, '');
    }

    // ২. গ্লোবাল BACKEND_URL যদি api.js থেকে সেট থাকে
    if (window.BACKEND_URL && window.BACKEND_URL.trim() !== '') {
        return window.BACKEND_URL.trim().replace(/\/+$/, '');
    }

    // ৩. ব্যাকএন্ড সার্ভার পোর্ট (৫০০০) থেকে সরাসরি ব্রাউজ করলে রিলেটিভ রুট ''
    if (window.location.port === '5000' || (window.location.origin && window.location.origin.includes(':5000'))) {
        return '';
    }

    const hostname = window.location.hostname;

    // ৪. লোকাল নেটওয়ার্ক আইপি (মোবাইল ব্রাউজিং: 192.168.x.x, 10.x.x.x, 172.x.x.x)
    if (/^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)/.test(hostname)) {
        return `${window.location.protocol}//${hostname}:5000`;
    }

    // ৫. লোকালহোস্ট বা লাইভ সার্ভার (e.g. 127.0.0.1:5500, localhost:3000, localhost:5173 ইত্যাদি)
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:5000';
    }

    // ৬. ফাইল সিস্টেম (file:///)
    if (window.location.protocol === 'file:') {
        return 'http://localhost:5000';
    }

    // ৭. গিটহাব পেজ বা অন্যান্য ওয়েব হোস্টিং - ডিফল্ট লোকাল বা লাইভ ব্যাকএন্ড ট্রাই করবে
    return 'http://localhost:5000';
}
window.getAuthApiBaseUrl = getAuthApiBaseUrl;

/**
 * নিরাপদভাবে ওয়েবসাইটের হোম পেজে নিয়ে যাওয়ার হেল্পার (GitHub Pages ও Localhost উভয় ক্ষেত্রে নির্ভুল)
 */
function redirectToHome() {
    if (window.location.host.includes('github.io')) {
        const parts = window.location.pathname.split('/').filter(Boolean);
        const repo = parts.length > 0 ? parts[0] : '';
        window.location.href = repo ? `/${repo}/index.html` : '/index.html';
        return;
    }
    const isPages = window.location.pathname.includes('/pages/');
    window.location.href = isPages ? '../index.html' : 'index.html';
}
window.redirectToHome = redirectToHome;

/**
 * লগইন/ক্রিয়েট একাউন্ট বাটনের ঠিক উপরে এরর বা স্বাগত মেসেজ প্রদর্শনকারী হেল্পার
 */
function setAuthAlert(message, type = 'error', viewId = null) {
    let targetAlert = null;
    if (viewId === 'signup' || (!viewId && document.getElementById('signupView')?.classList.contains('active'))) {
        targetAlert = document.getElementById('signupAuthAlert');
    } else if (viewId === 'forgot' || (!viewId && document.getElementById('forgotView')?.classList.contains('active'))) {
        targetAlert = document.getElementById('forgotAuthAlert');
    } else {
        targetAlert = document.getElementById('loginAuthAlert');
    }

    if (!targetAlert) {
        showToast(message, type);
        return;
    }

    if (!message) {
        targetAlert.style.display = 'none';
        targetAlert.innerHTML = '';
        targetAlert.className = 'auth-inline-alert';
        return;
    }

    let icon = '<i class="fa-solid fa-circle-exclamation"></i>';
    if (type === 'success') {
        icon = '<i class="fa-solid fa-circle-check"></i>';
    } else if (type === 'info') {
        icon = '<i class="fa-solid fa-circle-info"></i>';
    }

    targetAlert.className = `auth-inline-alert ${type}`;
    targetAlert.innerHTML = `${icon}<span>${message}</span>`;
    targetAlert.style.display = 'flex';

    // ব্যবহারকারীর দৃষ্টি আকর্ষণের জন্য সুন্দর স্মুথ স্ক্রোল (যদি ভিউ ছোট থাকে)
    targetAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
window.setAuthAlert = setAuthAlert;

/**
 * সকল ইনলাইন অ্যালার্ট মুছে ফেলা
 */
function clearAuthAlerts() {
    ['loginAuthAlert', 'signupAuthAlert', 'forgotAuthAlert'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.style.display = 'none';
            el.innerHTML = '';
            el.className = 'auth-inline-alert';
        }
    });
}
window.clearAuthAlerts = clearAuthAlerts;

/**
 * ইনপুটে টাইপ করার সাথে সাথে পূর্ববর্তী এরর মেসেজ স্বয়ংক্রিয়ভাবে মুছে যাওয়ার ব্যবস্থা
 */
function initInputClearListeners() {
    document.querySelectorAll('.neumorphic-input').forEach(input => {
        input.addEventListener('input', () => {
            clearAuthAlerts();
        });
    });
}

/**
 * ভিউ সুইচিং (Login <-> Create Account <-> Forgot Password)
 */
function initAuthTabs() {
    const hash = window.location.hash.toLowerCase();
    if (hash === '#signup' || hash === '#register') {
        switchAuthView('signup');
    } else if (hash === '#forgot' || hash === '#reset') {
        switchAuthView('forgot');
    } else {
        switchAuthView('login');
    }

    window.addEventListener('hashchange', () => {
        const h = window.location.hash.toLowerCase();
        if (h === '#signup' || h === '#register') {
            switchAuthView('signup');
        } else if (h === '#forgot' || h === '#reset') {
            switchAuthView('forgot');
        } else {
            switchAuthView('login');
        }
    });
}

function switchAuthView(viewName) {
    clearAuthAlerts();

    const loginView = document.getElementById('loginView');
    const signupView = document.getElementById('signupView');
    const forgotView = document.getElementById('forgotView');

    if (!loginView || !signupView) return;

    // Reset all views
    loginView.classList.remove('active');
    signupView.classList.remove('active');
    if (forgotView) forgotView.classList.remove('active');

    if (viewName === 'signup') {
        signupView.classList.add('active');
        window.location.hash = 'signup';
        setTimeout(() => document.getElementById('signupFullName')?.focus(), 150);
    } else if (viewName === 'forgot') {
        if (forgotView) forgotView.classList.add('active');
        window.location.hash = 'forgot';
        setTimeout(() => document.getElementById('forgotEmailOrNumber')?.focus(), 150);
    } else {
        loginView.classList.add('active');
        window.location.hash = 'login';
        setTimeout(() => document.getElementById('loginEmailOrNumber')?.focus(), 150);
    }
}
window.switchAuthView = switchAuthView;

/**
 * পাসওয়ার্ড লুকানো/দেখানোর আইকন টগল
 */
function initPasswordToggles() {
    document.querySelectorAll('.password-toggle-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);
            if (!input) return;

            const icon = this.querySelector('i');
            if (input.type === 'password') {
                input.type = 'text';
                if (icon) {
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                }
            } else {
                input.type = 'password';
                if (icon) {
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            }
        });
    });
}

/**
 * ছবি আপলোড ও প্রিভিউ (ইনসেট সার্কেলের ভেতরে ক্লিক করলেই ফাইল পিকার ওপেন হবে)
 * স্বয়ংক্রিয়ভাবে ক্যানভাসে ২৪০x২৪০ সাইজে অপ্টিমাইজড করে যাতে সহজে সেভ হয়
 */
function initAvatarUpload() {
    const avatarInput = document.getElementById('signupAvatarInput');
    const avatarSocket = document.getElementById('signupAvatarSocket');
    const avatarPreview = document.getElementById('signupAvatarPreview');
    const defaultIcon = document.getElementById('signupDefaultIcon');

    if (!avatarInput || !avatarSocket) return;

    avatarSocket.addEventListener('click', (e) => {
        if (e.target !== avatarInput) {
            avatarInput.click();
        }
    });

    avatarInput.addEventListener('change', function(e) {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        // সাইজ চেক (১০ মেগাবাইট পর্যন্ত অনুমোদিত)
        if (file.size > 10 * 1024 * 1024) {
            setAuthAlert('ছবির সাইজ সর্বোচ্চ ১০ মেগাবাইট হতে পারবে!', 'error', 'signup');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(evt) {
            const rawDataUrl = evt.target.result;
            const img = new Image();
            img.onload = function() {
                try {
                    // সুন্দর সেন্টার ক্রপিং এবং অপ্টিমাইজেশন
                    const canvas = document.createElement('canvas');
                    const targetSize = 240;
                    canvas.width = targetSize;
                    canvas.height = targetSize;
                    const ctx = canvas.getContext('2d');

                    const minSide = Math.min(img.width, img.height);
                    const startX = (img.width - minSide) / 2;
                    const startY = (img.height - minSide) / 2;

                    ctx.drawImage(img, startX, startY, minSide, minSide, 0, 0, targetSize, targetSize);
                    uploadedAvatarDataUrl = canvas.toDataURL('image/jpeg', 0.88);
                } catch(canvasErr) {
                    uploadedAvatarDataUrl = rawDataUrl;
                }

                if (avatarPreview && defaultIcon) {
                    avatarPreview.src = uploadedAvatarDataUrl;
                    avatarPreview.style.display = 'block';
                    defaultIcon.style.display = 'none';
                }
                setAuthAlert('প্রোফাইল ছবি সফলভাবে যুক্ত হয়েছে!', 'info', 'signup');
            };
            img.onerror = function() {
                uploadedAvatarDataUrl = rawDataUrl;
                if (avatarPreview && defaultIcon) {
                    avatarPreview.src = uploadedAvatarDataUrl;
                    avatarPreview.style.display = 'block';
                    defaultIcon.style.display = 'none';
                }
            };
            img.src = rawDataUrl;
        };
        reader.readAsDataURL(file);
    });
}

/**
 * রেজিস্টার / অ্যাকাউন্ট তৈরি হ্যান্ডলার (ডাটাবেজ ও ব্যাকএন্ডে সরাসরি সংরক্ষণ)
 */
async function handleCreateAccount(e) {
    if (e) e.preventDefault();
    clearAuthAlerts();

    const fullName = (document.getElementById('signupFullName')?.value || '').trim();
    const emailOrNumber = (document.getElementById('signupEmailOrNumber')?.value || '').trim();
    const collegeName = (document.getElementById('signupCollegeName')?.value || '').trim();
    const hscYear = (document.getElementById('signupHscYear')?.value || '').trim();
    const password = (document.getElementById('signupPassword')?.value || '').trim();
    const confirmPassword = (document.getElementById('signupConfirmPassword')?.value || '').trim();

    if (!fullName) {
        setAuthAlert('দয়া করে আপনার সম্পূর্ণ নাম লিখুন', 'error', 'signup');
        document.getElementById('signupFullName')?.focus();
        return;
    }

    if (!emailOrNumber) {
        setAuthAlert('ইমেইল অথবা মোবাইল নম্বর লিখুন', 'error', 'signup');
        document.getElementById('signupEmailOrNumber')?.focus();
        return;
    }

    if (!password) {
        setAuthAlert('একটি পাসওয়ার্ড প্রদান করুন', 'error', 'signup');
        document.getElementById('signupPassword')?.focus();
        return;
    }

    if (password.length < 4) {
        setAuthAlert('পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে', 'error', 'signup');
        document.getElementById('signupPassword')?.focus();
        return;
    }

    if (password !== confirmPassword) {
        setAuthAlert('পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মিলছে না!', 'error', 'signup');
        document.getElementById('signupConfirmPassword')?.focus();
        return;
    }

    // ডিফল্ট বা ইউজার আপলোডকৃত ছবি
    const defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80';
    const finalAvatar = uploadedAvatarDataUrl || defaultAvatar;

    const payload = {
        name: fullName,
        emailOrNumber: emailOrNumber,
        college: collegeName || 'এইচএসসি পরীক্ষার্থী',
        hscYear: hscYear || 'HSC 2026',
        password: password,
        avatar: finalAvatar
    };

    const submitBtn = document.querySelector('#signupView button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> অ্যাকাউন্ট তৈরি হচ্ছে...';
    }

    let backendSuccess = false;
    let savedUser = null;
    const baseUrl = getAuthApiBaseUrl();

    // ১. ব্যাকএন্ডে রেজিস্ট্রেশন রিকোয়েস্ট পাঠানো (সর্বদাই চেষ্টা করবে)
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 7000);

        const response = await fetch(`${baseUrl}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            const errorMsg = (data && data.message) || 'এই ইমেইল বা নম্বর দিয়ে ইতিমধ্যে একাউন্ট রয়েছে!';
            setAuthAlert(errorMsg, 'error', 'signup');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerText = 'CREATE ACCOUNT';
            }
            return; // ডুপ্লিকেট বা ভ্যালিডেশন এরর হলে বন্ধ করবে
        }

        if (data && data.success) {
            backendSuccess = true;
            savedUser = data.user;
        }
    } catch (netErr) {
        console.warn('Backend register request failed or timed out, fallback to local storage:', netErr.message);
    }

    // ২. লোকাল রেজিস্ট্রি আপডেট (GitHub Pages ও অফলাইন ফলব্যাক)
    let accounts = [];
    try {
        accounts = JSON.parse(localStorage.getItem('ict_registered_accounts') || '[]');
    } catch (err) { accounts = []; }

    // যদি ব্যাকএন্ড অফলাইনে থাকে তবে লোকাল ডুপ্লিকেট চেক
    if (!backendSuccess) {
        const existing = accounts.find(a => a.emailOrNumber === emailOrNumber);
        if (existing) {
            setAuthAlert('এই ইমেইল বা নম্বর দিয়ে ইতিমধ্যে অ্যাকাউন্ট রয়েছে! অনুগ্রহ করে লগইন করুন।', 'error', 'signup');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerText = 'CREATE ACCOUNT';
            }
            return;
        }
    }

    // স্টুডেন্ট প্রোফাইল অবজেক্ট তৈরি
    const profile = {
        name: (savedUser && savedUser.name) || fullName,
        email: (savedUser && savedUser.emailOrNumber) || emailOrNumber,
        emailOrNumber: (savedUser && savedUser.emailOrNumber) || emailOrNumber,
        college: (savedUser && savedUser.college) || payload.college,
        hsc_batch: (savedUser && savedUser.hscYear) || payload.hscYear,
        batch: (savedUser && savedUser.hscYear) || payload.hscYear,
        hscYear: (savedUser && savedUser.hscYear) || payload.hscYear,
        avatar: (savedUser && savedUser.avatar) || finalAvatar,
        points: (savedUser && savedUser.points !== undefined) ? savedUser.points : 25,
        testsCompleted: (savedUser && savedUser.testsCompleted) || 0,
        isCurrentUser: true
    };

    localStorage.setItem('ict_student_profile', JSON.stringify(profile));
    localStorage.setItem('ict_is_logged_in', 'true');

    // লোকাল অ্যাকাউন্টেও সংরক্ষণ
    accounts = accounts.filter(a => a.emailOrNumber !== emailOrNumber);
    accounts.push({
        name: profile.name,
        emailOrNumber: emailOrNumber,
        college: profile.college,
        hscYear: profile.hscYear,
        password: password,
        avatar: profile.avatar
    });
    localStorage.setItem('ict_registered_accounts', JSON.stringify(accounts));

    // বাটনের ঠিক উপরে স্বাগত মেসেজ প্রদর্শন
    if (backendSuccess) {
        setAuthAlert(`স্বাগতম, ${fullName}! অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে এবং সার্ভারে জমা হয়েছে।`, 'success', 'signup');
    } else {
        const isLive = localStorage.getItem('ICT_LIVE_API_URL');
        const hint = isLive ? 'সার্ভার অফলাইন হওয়ায় ডিভাইসে সেভ হয়েছে।' : 'সার্ভার অফলাইন থাকায় ডিভাইসে সেভ হয়েছে। অন্য ফোনে পেতে সার্ভার কানেক্ট করুন।';
        setAuthAlert(`স্বাগতম, ${fullName}! অ্যাকাউন্ট তৈরি হয়েছে (${hint})`, 'success', 'signup');
    }

    if (submitBtn) {
        submitBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> সফল হয়েছে!';
    }

    // ব্যবহারকারী যাতে স্বাগত মেসেজ দেখতে পান তাই ১.২ সেকেন্ড পর রিডাইরেক্ট
    setTimeout(() => {
        redirectToHome();
    }, 1200);
}
window.handleCreateAccount = handleCreateAccount;

/**
 * লগইন হ্যান্ডলার (যাচাইকরণ ব্যতীত কোনো ইউজার প্রবেশ করতে পারবে না)
 */
async function handleLogin(e) {
    if (e) e.preventDefault();
    clearAuthAlerts();

    const emailOrNumber = (document.getElementById('loginEmailOrNumber')?.value || '').trim();
    const password = (document.getElementById('loginPassword')?.value || '').trim();
    const rememberMe = document.getElementById('loginRememberMe')?.checked;

    if (!emailOrNumber) {
        setAuthAlert('ইমেইল অথবা মোবাইল নম্বর লিখুন', 'error', 'login');
        document.getElementById('loginEmailOrNumber')?.focus();
        return;
    }

    if (!password) {
        setAuthAlert('পাসওয়ার্ড লিখুন', 'error', 'login');
        document.getElementById('loginPassword')?.focus();
        return;
    }

    const submitBtn = document.querySelector('#loginView button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> যাচাই হচ্ছে...';
    }

    let loggedInUser = null;
    const baseUrl = getAuthApiBaseUrl();

    // ১. ব্যাকএন্ডের মাধ্যমে অথেনটিকেশন যাচাইকরণ
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 7000);

        const response = await fetch(`${baseUrl}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ emailOrNumber, password }),
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        const data = await response.json().catch(() => null);

        if (response.ok && data && data.success) {
            loggedInUser = data.user;
        } else if (response.status === 400 || response.status === 401 || (data && data.message)) {
            const msg = (data && data.message) || 'ভুল ইমেইল/নম্বর অথবা পাসওয়ার্ড!';
            setAuthAlert(msg, 'error', 'login');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerText = 'Login';
            }
            return; // ভুল হলে লগইন বন্ধ!
        }
    } catch (netErr) {
        console.warn('Backend login network error, fallback to local storage:', netErr.message);
    }

    // ২. ফলব্যাক চেক (GitHub Pages বা ডাটাবেজ students.json ও লোকাল রেজিস্ট্রি)
    if (!loggedInUser) {
        let allAccounts = [];

        // প্রথমে লোকাল স্টোরেজের একাউন্ট লোড করি
        try {
            const localAccs = JSON.parse(localStorage.getItem('ict_registered_accounts') || '[]');
            if (Array.isArray(localAccs)) allAccounts.push(...localAccs);
        } catch (err) {}

        // GitHub Pages বা অন্যান্য ডিভাইসে থাকা database/students.json থেকে একাউন্ট লোড করি
        try {
            const isPages = window.location.pathname.includes('/pages/');
            const jsonPath = isPages ? '../database/students.json' : 'database/students.json';
            const res = await fetch(jsonPath, { cache: 'no-cache' });
            if (res.ok) {
                const remoteList = await res.json();
                if (Array.isArray(remoteList)) {
                    remoteList.forEach(s => {
                        const sNum = normalizeBanglaDigits(s.emailOrNumber || s.email || '');
                        if (sNum && !allAccounts.some(a => normalizeBanglaDigits(a.emailOrNumber || a.email || '') === sNum)) {
                            allAccounts.push(s);
                        }
                    });
                }
            }
        } catch (e) {
            console.warn('students.json fallback fetch error:', e.message);
        }

        const cleanInput = normalizeBanglaDigits(emailOrNumber).toLowerCase();
        const cleanPass = normalizeBanglaDigits(password);

        const matchedAccount = allAccounts.find(a => {
            const userNum = normalizeBanglaDigits(a.emailOrNumber || a.email || '').toLowerCase();
            return userNum === cleanInput || ((a.emailOrNumber || a.email || '').toLowerCase() === emailOrNumber.toLowerCase());
        });

        if (!matchedAccount) {
            setAuthAlert('এই ইমেইল বা নম্বর দিয়ে কোনো অ্যাকাউন্ট পাওয়া যায় নি! সঠিক তথ্য দিন অথবা Create Account করুন।', 'error', 'login');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerText = 'Login';
            }
            return;
        }

        const matchedPass = normalizeBanglaDigits(matchedAccount.password || '');
        if (matchedPass !== cleanPass && matchedAccount.password !== password) {
            setAuthAlert('ভুল পাসওয়ার্ড! দয়া করে সঠিক পাসওয়ার্ড দিন অথবা Forgot Password ব্যবহার করুন।', 'error', 'login');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerText = 'Login';
            }
            return;
        }

        loggedInUser = {
            id: matchedAccount._id || ('user_' + Date.now()),
            name: matchedAccount.name,
            emailOrNumber: matchedAccount.emailOrNumber || matchedAccount.email || emailOrNumber,
            college: matchedAccount.college || 'এইচএসসি পরীক্ষার্থী',
            hscYear: matchedAccount.hscYear || 'HSC 2026',
            avatar: matchedAccount.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
            points: matchedAccount.points !== undefined ? matchedAccount.points : 25,
            testsCompleted: matchedAccount.testsCompleted || 0
        };

        // লোকাল স্টোরেজেও ক্যাশ করে রাখি যাতে পরবর্তীতে দ্রুত কাজ করে
        try {
            let cached = JSON.parse(localStorage.getItem('ict_registered_accounts') || '[]');
            if (!cached.some(c => normalizeBanglaDigits(c.emailOrNumber) === cleanInput)) {
                cached.push(matchedAccount);
                localStorage.setItem('ict_registered_accounts', JSON.stringify(cached));
            }
        } catch(e) {}
    }

    // ৩. সফল লগইন হলে প্রোফাইল সংরক্ষণ
    const profile = {
        name: loggedInUser.name,
        email: loggedInUser.emailOrNumber,
        emailOrNumber: loggedInUser.emailOrNumber,
        college: loggedInUser.college,
        hsc_batch: loggedInUser.hscYear || 'HSC 2026',
        batch: loggedInUser.hscYear || 'HSC 2026',
        hscYear: loggedInUser.hscYear || 'HSC 2026',
        avatar: loggedInUser.avatar,
        points: loggedInUser.points !== undefined ? loggedInUser.points : 25,
        testsCompleted: loggedInUser.testsCompleted || 0,
        isCurrentUser: true
    };

    localStorage.setItem('ict_student_profile', JSON.stringify(profile));
    localStorage.setItem('ict_is_logged_in', 'true');

    if (rememberMe) {
        localStorage.setItem('ict_remember_login', 'true');
    }

    // বাটনের ঠিক উপরে স্বাগত মেসেজ প্রদর্শন
    setAuthAlert(`স্বাগতম, ${profile.name}! সফলভাবে লগইন হয়েছে।`, 'success', 'login');

    if (submitBtn) {
        submitBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> সফল হয়েছে!';
    }

    // ১.২ সেকেন্ড পর সরাসরি হোম পেজে রিডাইরেক্ট
    setTimeout(() => {
        redirectToHome();
    }, 1200);
}
window.handleLogin = handleLogin;

/**
 * পাসওয়ার্ড রিসেট হ্যান্ডলার (Forgot Password)
 */
async function handleResetPassword(e) {
    if (e) e.preventDefault();
    clearAuthAlerts();

    const emailOrNumber = (document.getElementById('forgotEmailOrNumber')?.value || '').trim();
    const newPassword = (document.getElementById('forgotNewPassword')?.value || '').trim();
    const confirmPassword = (document.getElementById('forgotConfirmPassword')?.value || '').trim();

    if (!emailOrNumber) {
        setAuthAlert('দয়া করে নিবন্ধিত ইমেইল বা মোবাইল নম্বর দিন', 'error', 'forgot');
        document.getElementById('forgotEmailOrNumber')?.focus();
        return;
    }

    if (!newPassword) {
        setAuthAlert('নতুন পাসওয়ার্ড লিখুন', 'error', 'forgot');
        document.getElementById('forgotNewPassword')?.focus();
        return;
    }

    if (newPassword.length < 4) {
        setAuthAlert('নতুন পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে', 'error', 'forgot');
        document.getElementById('forgotNewPassword')?.focus();
        return;
    }

    if (newPassword !== confirmPassword) {
        setAuthAlert('নতুন পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মিলছে না!', 'error', 'forgot');
        document.getElementById('forgotConfirmPassword')?.focus();
        return;
    }

    const submitBtn = document.querySelector('#forgotView button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> পাসওয়ার্ড রিসেট হচ্ছে...';
    }

    let resetDone = false;
    const baseUrl = getAuthApiBaseUrl();

    // ১. ব্যাকএন্ডে রিসেট রিকোয়েস্ট পাঠানো
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 7000);

        const response = await fetch(`${baseUrl}/api/auth/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ emailOrNumber, newPassword }),
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        const data = await response.json().catch(() => null);

        if (response.ok && data && data.success) {
            resetDone = true;
        } else if (response.status === 404 || response.status === 400 || (data && data.message)) {
            setAuthAlert((data && data.message) || 'কোনো অ্যাকাউন্ট পাওয়া যায়নি!', 'error', 'forgot');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerText = 'RESET PASSWORD';
            }
            return;
        }
    } catch (err) {
        console.warn('Backend reset password network error:', err.message);
    }

    // ২. লোকাল অ্যাকাউন্ট আপডেট
    let accounts = [];
    try {
        accounts = JSON.parse(localStorage.getItem('ict_registered_accounts') || '[]');
    } catch (e) { accounts = []; }

    const targetAccount = accounts.find(a => a.emailOrNumber === emailOrNumber);

    if (!resetDone && !targetAccount) {
        setAuthAlert('এই ইমেইল বা নম্বর দিয়ে কোনো অ্যাকাউন্ট খুঁজে পাওয়া যায়নি!', 'error', 'forgot');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerText = 'RESET PASSWORD';
        }
        return;
    }

    if (targetAccount) {
        targetAccount.password = newPassword;
        localStorage.setItem('ict_registered_accounts', JSON.stringify(accounts));
    }

    setAuthAlert('পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে! নতুন পাসওয়ার্ড দিয়ে লগইন করুন।', 'success', 'forgot');

    if (submitBtn) {
        submitBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> সম্পন্ন হয়েছে';
    }

    // লগইন ভিউতে ফেরত পাঠানো এবং ইমেইল প্রি-ফিল করা
    const loginEmailInput = document.getElementById('loginEmailOrNumber');
    if (loginEmailInput) loginEmailInput.value = emailOrNumber;
    const loginPassInput = document.getElementById('loginPassword');
    if (loginPassInput) {
        loginPassInput.value = '';
    }

    setTimeout(() => {
        switchAuthView('login');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerText = 'RESET PASSWORD';
        }
    }, 1500);
}
window.handleResetPassword = handleResetPassword;

/**
 * গেস্ট হিসেবে প্রবেশ
 */
function continueAsGuest() {
    let profile = JSON.parse(localStorage.getItem('ict_student_profile') || 'null');
    if (!profile) {
        profile = {
            name: 'তানভীর',
            email: 'guest@ictlearning.com',
            emailOrNumber: 'guest@ictlearning.com',
            college: 'সরকারি মুজিব কলেজ',
            hsc_batch: 'HSC 2026',
            batch: 'HSC 2026',
            hscYear: 'HSC 2026',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
            points: 25,
            isCurrentUser: true
        };
        localStorage.setItem('ict_student_profile', JSON.stringify(profile));
    }
    localStorage.setItem('ict_is_logged_in', 'true');
    setAuthAlert('গেস্ট হিসেবে প্রবেশ করা হচ্ছে...', 'info');
    setTimeout(() => {
        redirectToHome();
    }, 500);
}
window.continueAsGuest = continueAsGuest;

/**
 * পূর্ববর্তী সেশন চেক (যদি ইতিমধ্যে লগইন থাকে)
 */
function checkExistingSession() {
    const isLoggedIn = localStorage.getItem('ict_is_logged_in') === 'true';
    const params = new URLSearchParams(window.location.search);
    const forceShow = params.get('force') === 'true';

    if (isLoggedIn && !forceShow) {
        const guestFooter = document.querySelector('.auth-guest-footer');
        if (guestFooter) {
            guestFooter.innerHTML = `
                <button type="button" onclick="redirectToHome()" class="guest-link-btn" style="color: #0066FF; font-weight: 700;">
                    <i class="fa-solid fa-house"></i> আপনি ইতিমধ্যে লগইন আছেন - হোম পেজে প্রবেশ করুন &rarr;
                </button>
            `;
        }
    }
}

/**
 * সাধারণ টোস্ট নোটিফিকেশন (যদি অতিরিক্ত নোটিফিকেশন দরকার হয়)
 */
function showToast(message, type = 'info') {
    let toast = document.getElementById('auth-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'auth-toast';
        toast.style.cssText = `
            position: fixed;
            top: 55px;
            left: 50%;
            transform: translateX(-50%) translateY(-15px);
            background: #1E293B;
            color: #FFFFFF;
            padding: 12px 24px;
            border-radius: 9999px;
            font-size: 0.92rem;
            font-weight: 600;
            box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
            z-index: 99999999;
            opacity: 0;
            transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
            pointer-events: none;
            display: flex;
            align-items: center;
            gap: 10px;
            max-width: 90%;
            text-align: center;
        `;
        document.body.appendChild(toast);
    }

    let icon = '<i class="fa-solid fa-circle-info" style="color: #60A5FA; font-size: 1.1rem;"></i>';
    if (type === 'success') icon = '<i class="fa-solid fa-circle-check" style="color: #4ADE80; font-size: 1.1rem;"></i>';
    if (type === 'error') icon = '<i class="fa-solid fa-circle-exclamation" style="color: #F87171; font-size: 1.1rem;"></i>';

    toast.innerHTML = `${icon} <span>${message}</span>`;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    toast.style.top = '55px';

    clearTimeout(window.authToastTimeout);
    window.authToastTimeout = setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(-15px)';
    }, 3200);
}

/**
 * সার্ভার সংযোগ ও লাইভ API কনফিগারেশন হেল্পার
 */
function openServerConfigModal() {
    const modal = document.getElementById('serverConfigModal');
    const input = document.getElementById('customApiUrlInput');
    if (input) {
        input.value = localStorage.getItem('ICT_LIVE_API_URL') || getAuthApiBaseUrl();
    }
    if (modal) modal.style.display = 'flex';
}
window.openServerConfigModal = openServerConfigModal;

function closeServerConfigModal() {
    const modal = document.getElementById('serverConfigModal');
    if (modal) modal.style.display = 'none';
}
window.closeServerConfigModal = closeServerConfigModal;

function saveCustomServerConfig() {
    const input = document.getElementById('customApiUrlInput');
    let url = (input ? input.value : '').trim().replace(/\/+$/, '');
    if (url) {
        localStorage.setItem('ICT_LIVE_API_URL', url);
        window.BACKEND_URL = url;
        showToast('সার্ভার URL সফলভাবে সংরক্ষণ করা হয়েছে!', 'success');
    } else {
        localStorage.removeItem('ICT_LIVE_API_URL');
        showToast('ডিফল্ট সার্ভার URL নির্ধারণ করা হয়েছে!', 'info');
    }
    closeServerConfigModal();
    checkServerConnectionStatus();
}
window.saveCustomServerConfig = saveCustomServerConfig;

function resetServerConfigToDefault() {
    localStorage.removeItem('ICT_LIVE_API_URL');
    const input = document.getElementById('customApiUrlInput');
    if (input) input.value = '';
    showToast('ডিফল্ট সেটিংসে ফিরিয়ে নেওয়া হয়েছে', 'info');
    closeServerConfigModal();
    checkServerConnectionStatus();
}
window.resetServerConfigToDefault = resetServerConfigToDefault;

async function checkServerConnectionStatus() {
    const statusDot = document.getElementById('serverStatusDot');
    const statusText = document.getElementById('serverStatusText');
    const baseUrl = getAuthApiBaseUrl();

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);
        const res = await fetch(`${baseUrl}/api/health`, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (res.ok) {
            if (statusDot) {
                statusDot.className = 'server-status-dot';
                statusDot.title = 'সার্ভার সচল (Online)';
            }
            if (statusText) statusText.textContent = 'সার্ভার সচল (Online)';
            return true;
        }
    } catch (e) {}

    if (statusDot) {
        statusDot.className = 'server-status-dot offline';
        statusDot.title = 'সার্ভার অফলাইন (Offline)';
    }
    if (statusText) statusText.textContent = 'সার্ভার অফলাইন (Offline)';
    return false;
}
window.checkServerConnectionStatus = checkServerConnectionStatus;
