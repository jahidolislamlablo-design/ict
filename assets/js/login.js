/**
 * ICT EASY LEARNING - NEUMORPHIC AUTH SCRIPT (login.js)
 * Handles login, registration, avatar uploads, profile sync and transitions
 */

let uploadedAvatarDataUrl = '';

document.addEventListener('DOMContentLoaded', () => {
    initAuthTabs();
    initPasswordToggles();
    initAvatarUpload();
    checkExistingSession();
});

/**
 * ভিউ সুইচিং (Login <-> Create Account)
 */
function initAuthTabs() {
    const hash = window.location.hash.toLowerCase();
    if (hash === '#signup' || hash === '#register') {
        switchAuthView('signup');
    } else {
        switchAuthView('login');
    }

    window.addEventListener('hashchange', () => {
        const h = window.location.hash.toLowerCase();
        if (h === '#signup' || h === '#register') {
            switchAuthView('signup');
        } else {
            switchAuthView('login');
        }
    });
}

function switchAuthView(viewName) {
    const loginView = document.getElementById('loginView');
    const signupView = document.getElementById('signupView');
    if (!loginView || !signupView) return;

    if (viewName === 'signup') {
        loginView.classList.remove('active');
        signupView.classList.add('active');
        window.location.hash = 'signup';
    } else {
        signupView.classList.remove('active');
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
 * ছবি আপলোড ও প্রিভিউ
 */
function initAvatarUpload() {
    const avatarInput = document.getElementById('signupAvatarInput');
    const avatarSocket = document.getElementById('signupAvatarSocket');
    const avatarPreview = document.getElementById('signupAvatarPreview');
    const defaultIcon = document.getElementById('signupDefaultIcon');

    if (!avatarInput || !avatarSocket) return;

    avatarSocket.addEventListener('click', () => {
        avatarInput.click();
    });

    avatarInput.addEventListener('change', function(e) {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        // সাইজ লিমিট ৫ মেগাবাইট
        if (file.size > 5 * 1024 * 1024) {
            showToast('ছবির সাইজ সর্বোচ্চ ৫ মেগাবাইট হতে পারবে!', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(evt) {
            uploadedAvatarDataUrl = evt.target.result;
            if (avatarPreview && defaultIcon) {
                avatarPreview.src = uploadedAvatarDataUrl;
                avatarPreview.style.display = 'block';
                defaultIcon.style.display = 'none';
            }
            showToast('প্রোফাইল ছবি সফলভাবে নির্বাচন করা হয়েছে!', 'success');
        };
        reader.readAsDataURL(file);
    });
}

/**
 * রেজিস্টার / অ্যাকাউন্ট তৈরি হ্যান্ডলার
 */
async function handleCreateAccount(e) {
    if (e) e.preventDefault();

    const fullName = (document.getElementById('signupFullName')?.value || '').trim();
    const emailOrNumber = (document.getElementById('signupEmailOrNumber')?.value || '').trim();
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

    // প্রোফাইল অবজেক্ট তৈরি
    const profile = {
        name: fullName,
        email: emailOrNumber,
        college: 'এইচএসসি পরীক্ষার্থী',
        avatar: finalAvatar,
        points: 25,
        testsCompleted: 0,
        isCurrentUser: true,
        registeredAt: new Date().toISOString()
    };

    // লোকাল স্টোরেজে সংরক্ষণ
    localStorage.setItem('ict_student_profile', JSON.stringify(profile));
    localStorage.setItem('ict_is_logged_in', 'true');

    // নিবন্ধিত অ্যাকাউন্ট তালিকায় সংরক্ষণ
    try {
        let accounts = JSON.parse(localStorage.getItem('ict_registered_accounts') || '[]');
        // যদি পূর্বে একই ইমেইল/নম্বর থাকে তবে তা রিপ্লেস করা
        accounts = accounts.filter(a => a.emailOrNumber !== emailOrNumber);
        accounts.push({
            name: fullName,
            emailOrNumber: emailOrNumber,
            password: password,
            avatar: finalAvatar
        });
        localStorage.setItem('ict_registered_accounts', JSON.stringify(accounts));
    } catch (e) {}

    // ব্যাকএন্ডে প্রোফাইল সিঙ্ক
    try {
        fetch('/api/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: fullName,
                avatar: finalAvatar,
                college: profile.college
            })
        }).catch(() => {});
    } catch (e) {}

    showToast(`স্বাগতম, ${fullName}! অ্যাকাউন্ট তৈরি সম্পন্ন হয়েছে।`, 'success');

    setTimeout(() => {
        window.location.href = 'index.html';
    }, 800);
}
window.handleCreateAccount = handleCreateAccount;

/**
 * লগইন হ্যান্ডলার
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

    let accounts = [];
    try {
        accounts = JSON.parse(localStorage.getItem('ict_registered_accounts') || '[]');
    } catch (e) { accounts = []; }

    // মেলাবার চেষ্টা
    const matched = accounts.find(a => (a.emailOrNumber === emailOrNumber) && (a.password === password));

    let profile = JSON.parse(localStorage.getItem('ict_student_profile') || 'null');

    if (matched) {
        profile = {
            name: matched.name,
            email: matched.emailOrNumber,
            college: (profile && profile.college) ? profile.college : 'এইচএসসি পরীক্ষার্থী',
            avatar: matched.avatar || (profile && profile.avatar) || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
            points: (profile && profile.points !== undefined) ? profile.points : 25,
            isCurrentUser: true
        };
    } else {
        // যদি একাউন্ট পূর্বে সেইভ না থাকে কিন্তু লগইন করছে, নাম ডিফল্ট হিসেবে অথবা ইনপুট থেকে নেওয়া
        if (!profile) {
            profile = {
                name: 'শিক্ষার্থী',
                email: emailOrNumber,
                college: 'এইচএসসি পরীক্ষার্থী',
                avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
                points: 25,
                isCurrentUser: true
            };
        }
    }

    localStorage.setItem('ict_student_profile', JSON.stringify(profile));
    localStorage.setItem('ict_is_logged_in', 'true');

    if (rememberMe) {
        localStorage.setItem('ict_remember_login', 'true');
    }

    showToast(`স্বাগতম, ${profile.name || 'শিক্ষার্থী'}! সফলভাবে লগইন হয়েছে।`, 'success');

    setTimeout(() => {
        window.location.href = 'index.html';
    }, 700);
}
window.handleLogin = handleLogin;

/**
 * গেস্ট হিসেবে প্রবেশ
 */
function continueAsGuest() {
    let profile = JSON.parse(localStorage.getItem('ict_student_profile') || 'null');
    if (!profile) {
        profile = {
            name: 'তানভীর',
            college: 'সরকারি মুজিব কলেজ',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
            points: 25,
            isCurrentUser: true
        };
        localStorage.setItem('ict_student_profile', JSON.stringify(profile));
    }
    localStorage.setItem('ict_is_logged_in', 'true');
    showToast('গেস্ট হিসেবে প্রবেশ করা হচ্ছে...', 'info');
    setTimeout(() => {
        window.location.href = 'index.html';
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

    // যদি অলরেডি লগইন থাকে এবং জোরপূর্বক লগইন পেজে না আসে, সরাসরি হোমপেজে পাঠানো
    if (isLoggedIn && !forceShow) {
        // ছোট বাটন যোগ করা যে ইউজার চাইলে সরাসরি সাইটে যেতে পারেন
        const guestFooter = document.querySelector('.auth-guest-footer');
        if (guestFooter) {
            guestFooter.innerHTML = `
                <a href="index.html" class="guest-link-btn" style="color: #0066FF; font-weight: 700;">
                    <i class="fa-solid fa-house"></i> আপনি ইতিমধ্যে লগইন আছেন - ওয়েবসাইটে প্রবেশ করুন &rarr;
                </a>
            `;
        }
    }
}

/**
 * সাধারণ টোস্ট নোটিফিকেশন
 */
function showToast(message, type = 'info') {
    let toast = document.getElementById('auth-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'auth-toast';
        toast.style.cssText = `
            position: fixed;
            top: 24px;
            left: 50%;
            transform: translateX(-50%) translateY(-20px);
            background: #1E293B;
            color: #FFFFFF;
            padding: 12px 24px;
            border-radius: 9999px;
            font-size: 0.95rem;
            font-weight: 600;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
            z-index: 999999;
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            pointer-events: none;
            display: flex;
            align-items: center;
            gap: 8px;
        `;
        document.body.appendChild(toast);
    }

    let icon = '<i class="fa-solid fa-circle-info" style="color: #60A5FA;"></i>';
    if (type === 'success') icon = '<i class="fa-solid fa-circle-check" style="color: #4ADE80;"></i>';
    if (type === 'error') icon = '<i class="fa-solid fa-circle-exclamation" style="color: #F87171;"></i>';

    toast.innerHTML = `${icon} <span>${message}</span>`;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';

    clearTimeout(window.authToastTimeout);
    window.authToastTimeout = setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(-20px)';
    }, 2800);
}
