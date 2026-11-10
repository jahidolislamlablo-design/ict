/**
 * ICT EASY LEARNING - NEUMORPHIC AUTH SCRIPT (login.js)
 * Handles authentic login, registration, password reset, avatar uploads, and sessions
 */

let uploadedAvatarDataUrl = '';

document.addEventListener('DOMContentLoaded', () => {
    initAuthTabs();
    initPasswordToggles();
    initAvatarUpload();
    checkExistingSession();
});

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
    } else if (viewName === 'forgot') {
        if (forgotView) forgotView.classList.add('active');
        window.location.hash = 'forgot';
    } else {
        loginView.classList.add('active');
        window.location.hash = 'login';
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
 * স্বয়ংক্রিয়ভাবে ক্যানভাসে ২৫০x২৫০ সাইজে অপ্টিমাইজড করে যাতে সহজে সেভ হয়
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
            showToast('ছবির সাইজ সর্বোচ্চ ১০ মেগাবাইট হতে পারবে!', 'error');
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
                showToast('প্রোফাইল ছবি সফলভাবে নির্বাচন করা হয়েছে!', 'success');
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
 * রেজিস্টার / অ্যাকাউন্ট তৈরি হ্যান্ডলার (ডাটাবেজ ও ব্যাকএন্ডে সংরক্ষণ)
 */
async function handleCreateAccount(e) {
    if (e) e.preventDefault();

    const fullName = (document.getElementById('signupFullName')?.value || '').trim();
    const emailOrNumber = (document.getElementById('signupEmailOrNumber')?.value || '').trim();
    const collegeName = (document.getElementById('signupCollegeName')?.value || '').trim();
    const hscYear = (document.getElementById('signupHscYear')?.value || '').trim();
    const password = (document.getElementById('signupPassword')?.value || '').trim();
    const confirmPassword = (document.getElementById('signupConfirmPassword')?.value || '').trim();

    if (!fullName) {
        showToast('দয়া করে আপনার সম্পূর্ণ নাম লিখুন', 'error');
        document.getElementById('signupFullName')?.focus();
        return;
    }

    if (!emailOrNumber) {
        showToast('ইমেইল অথবা মোবাইল নম্বর লিখুন', 'error');
        document.getElementById('signupEmailOrNumber')?.focus();
        return;
    }

    if (!password) {
        showToast('একটি পাসওয়ার্ড প্রদান করুন', 'error');
        document.getElementById('signupPassword')?.focus();
        return;
    }

    if (password.length < 4) {
        showToast('পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে', 'error');
        document.getElementById('signupPassword')?.focus();
        return;
    }

    if (password !== confirmPassword) {
        showToast('পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মিলছে না!', 'error');
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

    let backendSuccess = false;
    const isStaticHost = window.location.host.includes('github.io') || window.location.protocol === 'file:';

    // ১. ব্যাকএন্ডে রেজিস্ট্রেশন রিকোয়েস্ট পাঠানো (যদি সার্ভার সক্রিয় থাকে)
    if (!isStaticHost) {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            // যদি সার্ভারে রাউট না থাকে (404/405), লোকাল রেজিস্ট্রি দিয়ে চলবে
            if (response.status !== 404 && response.status !== 405) {
                const data = await response.json().catch(() => null);

                if (!response.ok) {
                    const errorMsg = (data && data.message) || 'এই ইমেইল বা নম্বর দিয়ে ইতিমধ্যে একাউন্ট রয়েছে!';
                    showToast(errorMsg, 'error');
                    return; // থামিয়ে দিন
                }

                if (data && data.success) {
                    backendSuccess = true;
                    const profile = {
                        name: data.user.name || fullName,
                        email: data.user.emailOrNumber || emailOrNumber,
                        college: data.user.college || payload.college,
                        hsc_batch: data.user.hscYear || payload.hscYear,
                        batch: data.user.hscYear || payload.hscYear,
                        avatar: data.user.avatar || finalAvatar,
                        points: data.user.points !== undefined ? data.user.points : 25,
                        testsCompleted: data.user.testsCompleted || 0,
                        isCurrentUser: true
                    };
                    localStorage.setItem('ict_student_profile', JSON.stringify(profile));
                }
            }
        } catch (netErr) {
            // নেটওয়ার্ক ফেইল হলে স্বয়ংক্রিয়ভাবে ফলব্যাক অ্যাকাউন্টে সেভ হবে
        }
    }

    // ২. লোকাল রেজিস্ট্রি আপডেট (GitHub Pages ও অফলাইন ফলব্যাক)
    let accounts = [];
    try {
        accounts = JSON.parse(localStorage.getItem('ict_registered_accounts') || '[]');
    } catch (err) { accounts = []; }

    // যদি ব্যাকএন্ড অফলাইন থাকে, তবে লোকাল ডুপ্লিকেট চেক
    if (!backendSuccess) {
        const existing = accounts.find(a => a.emailOrNumber === emailOrNumber);
        if (existing) {
            showToast('এই ইমেইল বা নম্বর দিয়ে ইতিমধ্যে অ্যাকাউন্ট রয়েছে! অনুগ্রহ করে লগইন করুন।', 'error');
            return;
        }

        const profile = {
            name: fullName,
            email: emailOrNumber,
            college: payload.college,
            hsc_batch: payload.hscYear,
            batch: payload.hscYear,
            avatar: finalAvatar,
            points: 25,
            testsCompleted: 0,
            isCurrentUser: true
        };
        localStorage.setItem('ict_student_profile', JSON.stringify(profile));
    }

    // লোকাল অ্যাকাউন্টে সেভ
    accounts = accounts.filter(a => a.emailOrNumber !== emailOrNumber);
    accounts.push({
        name: fullName,
        emailOrNumber: emailOrNumber,
        college: payload.college,
        hscYear: payload.hscYear,
        password: password,
        avatar: finalAvatar
    });
    localStorage.setItem('ict_registered_accounts', JSON.stringify(accounts));
    localStorage.setItem('ict_is_logged_in', 'true');

    showToast(`স্বাগতম, ${fullName}! অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে।`, 'success');

    // সরাসরি হোম পেজে রিডাইরেক্ট
    setTimeout(() => {
        redirectToHome();
    }, 600);
}
window.handleCreateAccount = handleCreateAccount;

/**
 * লগইন হ্যান্ডলার (যাচাইকরণ ব্যতীত কোনো ইউজার প্রবেশ করতে পারবে না)
 */
async function handleLogin(e) {
    if (e) e.preventDefault();

    const emailOrNumber = (document.getElementById('loginEmailOrNumber')?.value || '').trim();
    const password = (document.getElementById('loginPassword')?.value || '').trim();
    const rememberMe = document.getElementById('loginRememberMe')?.checked;

    if (!emailOrNumber) {
        showToast('ইমেইল অথবা মোবাইল নম্বর লিখুন', 'error');
        document.getElementById('loginEmailOrNumber')?.focus();
        return;
    }

    if (!password) {
        showToast('পাসওয়ার্ড লিখুন', 'error');
        document.getElementById('loginPassword')?.focus();
        return;
    }

    // ১. ব্যাকএন্ডের মাধ্যমে অথেনটিকেশন যাচাইকরণ
    let loggedInUser = null;
    const isStaticHost = window.location.host.includes('github.io') || window.location.protocol === 'file:';

    if (!isStaticHost) {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emailOrNumber, password })
            });

            if (response.status !== 404 && response.status !== 405) {
                const data = await response.json().catch(() => null);

                if (response.ok && data && data.success) {
                    loggedInUser = data.user;
                } else if (response.status === 400 || response.status === 401) {
                    const msg = (data && data.message) || 'ভুল ইমেইল/নম্বর অথবা পাসওয়ার্ড!';
                    showToast(msg, 'error');
                    return; // ভুল হলে লগইন বন্ধ!
                }
            }
        } catch (netErr) {}
    }

    // ২. ফলব্যাক চেক (GitHub Pages বা লোকাল স্টোরেজ একাউন্ট)
    if (!loggedInUser) {
        let accounts = [];
        try {
            accounts = JSON.parse(localStorage.getItem('ict_registered_accounts') || '[]');
        } catch (err) { accounts = []; }

        const matchedAccount = accounts.find(a => a.emailOrNumber === emailOrNumber);

        if (!matchedAccount) {
            showToast('এই ইমেইল বা নম্বর দিয়ে কোনো অ্যাকাউন্ট খুঁজে পাওয়া যায়নি! সঠিক তথ্য দিন অথবা Create Account করুন।', 'error');
            return;
        }

        if (matchedAccount.password !== password) {
            showToast('ভুল পাসওয়ার্ড! দয়া করে সঠিক পাসওয়ার্ড দিন অথবা Forgot Password ব্যবহার করুন।', 'error');
            return;
        }

        loggedInUser = {
            name: matchedAccount.name,
            emailOrNumber: matchedAccount.emailOrNumber,
            college: matchedAccount.college || 'এইচএসসি পরীক্ষার্থী',
            hscYear: matchedAccount.hscYear || 'HSC 2026',
            avatar: matchedAccount.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
            points: 25,
            testsCompleted: 0
        };
    }

    // ৩. সফল লগইন হলে প্রোফাইল সংরক্ষণ
    const profile = {
        name: loggedInUser.name,
        email: loggedInUser.emailOrNumber,
        college: loggedInUser.college,
        hsc_batch: loggedInUser.hscYear || 'HSC 2026',
        batch: loggedInUser.hscYear || 'HSC 2026',
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

    showToast(`স্বাগতম, ${profile.name}! সফলভাবে লগইন হয়েছে।`, 'success');

    // সরাসরি হোম পেজে রিডাইরেক্ট
    setTimeout(() => {
        redirectToHome();
    }, 600);
}
window.handleLogin = handleLogin;

/**
 * পাসওয়ার্ড রিসেট হ্যান্ডলার (Forgot Password)
 */
async function handleResetPassword(e) {
    if (e) e.preventDefault();

    const emailOrNumber = (document.getElementById('forgotEmailOrNumber')?.value || '').trim();
    const newPassword = (document.getElementById('forgotNewPassword')?.value || '').trim();
    const confirmPassword = (document.getElementById('forgotConfirmPassword')?.value || '').trim();

    if (!emailOrNumber) {
        showToast('দয়া করে নিবন্ধিত ইমেইল বা মোবাইল নম্বর দিন', 'error');
        document.getElementById('forgotEmailOrNumber')?.focus();
        return;
    }

    if (!newPassword) {
        showToast('নতুন পাসওয়ার্ড লিখুন', 'error');
        document.getElementById('forgotNewPassword')?.focus();
        return;
    }

    if (newPassword.length < 4) {
        showToast('নতুন পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে', 'error');
        document.getElementById('forgotNewPassword')?.focus();
        return;
    }

    if (newPassword !== confirmPassword) {
        showToast('নতুন পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মিলছে না!', 'error');
        document.getElementById('forgotConfirmPassword')?.focus();
        return;
    }

    // ১. ব্যাকএন্ডে রিসেট রিকোয়েস্ট পাঠানো
    let resetDone = false;
    const isStaticHost = window.location.host.includes('github.io') || window.location.protocol === 'file:';

    if (!isStaticHost) {
        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emailOrNumber, newPassword })
            });

            if (response.status !== 404 && response.status !== 405) {
                const data = await response.json().catch(() => null);

                if (response.ok && data && data.success) {
                    resetDone = true;
                } else if (response.status === 404 || response.status === 400) {
                    showToast((data && data.message) || 'কোনো অ্যাকাউন্ট পাওয়া যায়নি!', 'error');
                    return;
                }
            }
        } catch (err) {}
    }

    // ২. লোকাল অ্যাকাউন্ট আপডেট
    let accounts = [];
    try {
        accounts = JSON.parse(localStorage.getItem('ict_registered_accounts') || '[]');
    } catch (e) { accounts = []; }

    const targetAccount = accounts.find(a => a.emailOrNumber === emailOrNumber);

    if (!resetDone && !targetAccount) {
        showToast('এই ইমেইল বা নম্বর দিয়ে কোনো অ্যাকাউন্ট খুঁজে পাওয়া যায়নি!', 'error');
        return;
    }

    if (targetAccount) {
        targetAccount.password = newPassword;
        localStorage.setItem('ict_registered_accounts', JSON.stringify(accounts));
    }

    showToast('পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে! নতুন পাসওয়ার্ড দিয়ে লগইন করুন।', 'success');

    // লগইন ভিউতে ফেরত পাঠানো এবং ইমেইল প্রি-ফিল করা
    const loginEmailInput = document.getElementById('loginEmailOrNumber');
    if (loginEmailInput) loginEmailInput.value = emailOrNumber;
    const loginPassInput = document.getElementById('loginPassword');
    if (loginPassInput) {
        loginPassInput.value = '';
        loginPassInput.focus();
    }

    setTimeout(() => {
        switchAuthView('login');
    }, 800);
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
            college: 'সরকারি মুজিব কলেজ',
            hsc_batch: 'HSC 2026',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
            points: 25,
            isCurrentUser: true
        };
        localStorage.setItem('ict_student_profile', JSON.stringify(profile));
    }
    localStorage.setItem('ict_is_logged_in', 'true');
    showToast('গেস্ট হিসেবে প্রবেশ করা হচ্ছে...', 'info');
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
 * সাধারণ টোস্ট নোটিফিকেশন (যাতে স্ক্রিনের একদম উপরে অর্ধেক কেটে না যায়, সুন্দরভাবে নিচে ভেসে ওঠে)
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
