/**
 * PROFILE & SETTINGS SCRIPT (profile.js)
 * ICT Easy Learning
 * Handles profile loading, full editing (Avatar Image, Name, College, HSC Year, Password/Reset),
 * local cache synchronization, and backend MongoDB persistence.
 */

let editUploadedAvatarDataUrl = '';

document.addEventListener('DOMContentLoaded', async () => {
    await initUserProfile();
    initProfileAvatarUpload();
});

/**
 * শিক্ষার্থী প্রোফাইল লোড করা
 */
async function initUserProfile() {
    try {
        let user = null;
        const cached = localStorage.getItem('ict_student_profile');
        if (cached) {
            try { user = JSON.parse(cached); } catch (e) {}
        }

        const emailOrNumber = (user && (user.emailOrNumber || user.email)) || '';

        // ব্যাকএন্ড থেকে তাজা ডেটা আনার চেষ্টা
        if (window.ApiService && typeof ApiService.getStudentProfile === 'function') {
            const freshUser = await ApiService.getStudentProfile(emailOrNumber);
            if (freshUser) user = freshUser;
        }

        if (user) {
            updateProfileUI(user);
        }

        // শিক্ষার্থীদের র‍্যাংকিং পজিশন আপডেট
        if (window.ApiService && typeof ApiService.getRankings === 'function') {
            const rankRes = await ApiService.getRankings();
            if (rankRes && rankRes.currentUser) {
                const posEl = document.getElementById('profileRankingPos');
                if (posEl) {
                    const toBn = (n) => (window.toBanglaNum ? window.toBanglaNum(n) : n);
                    posEl.innerText = `${toBn(rankRes.currentUser.position || 4)}র্থ স্থান`;
                }
            }
        }
    } catch (e) {
        console.warn('Profile load error:', e);
    }
}

/**
 * প্রোফাইল পেজের বিভিন্ন এলিমেন্টে ডেটা প্রদর্শন
 */
function updateProfileUI(user) {
    if (!user) return;
    const toBn = (n) => (window.toBanglaNum ? window.toBanglaNum(n) : n);

    if (user.name) {
        const nameEl = document.getElementById('profileDisplayName');
        if (nameEl) nameEl.innerText = user.name;
        const headerNames = document.querySelectorAll('.header-user-name');
        headerNames.forEach(el => { el.innerText = user.name; });
    }

    if (user.college) {
        const collegeEl = document.getElementById('profileDisplayCollege');
        if (collegeEl) collegeEl.innerText = user.college;
    }

    if (user.points !== undefined) {
        const pointsEl = document.getElementById('profileEarnedPoints');
        if (pointsEl) pointsEl.innerText = `${toBn(user.points)} পয়েন্ট`;
    }

    const defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80';
    const avatarSrc = user.avatar || defaultAvatar;

    const avatarImgs = document.querySelectorAll('.profile-avatar-img');
    avatarImgs.forEach(img => { img.src = avatarSrc; });
    const headerAvatars = document.querySelectorAll('.header-user-btn img');
    headerAvatars.forEach(img => { img.src = avatarSrc; });

    const batchText = user.hscYear || user.hsc_batch || user.batch;
    if (batchText) {
        const batchBadge = document.getElementById('profileHscBatchBadge');
        if (batchBadge) batchBadge.innerText = batchText;
    }
}

/**
 * মডালে ছবি নির্বাচন ও ক্রপিং
 */
function initProfileAvatarUpload() {
    const fileInput = document.getElementById('editAvatarInput');
    const previewImg = document.getElementById('editAvatarPreview');

    if (!fileInput) return;

    fileInput.addEventListener('change', function(e) {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            showProfileEditAlert('ছবির সাইজ সর্বোচ্চ ১০ মেগাবাইট হতে পারবে!', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(evt) {
            const rawDataUrl = evt.target.result;
            const img = new Image();
            img.onload = function() {
                try {
                    const canvas = document.createElement('canvas');
                    const targetSize = 240;
                    canvas.width = targetSize;
                    canvas.height = targetSize;
                    const ctx = canvas.getContext('2d');

                    const minSide = Math.min(img.width, img.height);
                    const startX = (img.width - minSide) / 2;
                    const startY = (img.height - minSide) / 2;

                    ctx.drawImage(img, startX, startY, minSide, minSide, 0, 0, targetSize, targetSize);
                    editUploadedAvatarDataUrl = canvas.toDataURL('image/jpeg', 0.88);
                } catch (canvasErr) {
                    editUploadedAvatarDataUrl = rawDataUrl;
                }

                if (previewImg) {
                    previewImg.src = editUploadedAvatarDataUrl;
                }
                showProfileEditAlert('ছবি নির্বাচিত হয়েছে! সংরক্ষণ করতে নিচের বাটনে ক্লিক করুন।', 'success');
            };
            img.onerror = function() {
                editUploadedAvatarDataUrl = rawDataUrl;
                if (previewImg) previewImg.src = editUploadedAvatarDataUrl;
            };
            img.src = rawDataUrl;
        };
        reader.readAsDataURL(file);
    });
}

/**
 * পাসওয়ার্ড ইনপুট লুকানো/দেখানো
 */
function toggleEditPassword(targetId, btn) {
    const input = document.getElementById(targetId);
    if (!input) return;

    const icon = btn.querySelector('i');
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
}
window.toggleEditPassword = toggleEditPassword;

/**
 * মডালে মেসেজ প্রদর্শন
 */
function showProfileEditAlert(message, type = 'error') {
    const alertBox = document.getElementById('profileEditAlert');
    if (!alertBox) return;

    if (!message) {
        alertBox.style.display = 'none';
        alertBox.innerHTML = '';
        return;
    }

    let icon = '<i class="fa-solid fa-circle-exclamation"></i>';
    if (type === 'success') icon = '<i class="fa-solid fa-circle-check"></i>';

    alertBox.className = `profile-inline-alert ${type}`;
    alertBox.innerHTML = `${icon}<span>${message}</span>`;
    alertBox.style.display = 'flex';
}

/**
 * প্রোফাইল এডিট মডাল ওপেন করা
 */
function openEditProfileModal() {
    const modal = document.getElementById('editProfileModal');
    if (!modal) return;

    // বর্তমান প্রোফাইল তথ্য আনা
    const profile = JSON.parse(localStorage.getItem('ict_student_profile') || '{}');

    const nameInput = document.getElementById('editNameInput');
    if (nameInput) nameInput.value = profile.name || '';

    const collegeInput = document.getElementById('editCollegeInput');
    if (collegeInput) collegeInput.value = profile.college || '';

    const hscYearInput = document.getElementById('editHscYearInput');
    if (hscYearInput) hscYearInput.value = profile.hscYear || profile.hsc_batch || profile.batch || 'HSC 2026';

    const defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80';
    const previewImg = document.getElementById('editAvatarPreview');
    if (previewImg) previewImg.src = profile.avatar || defaultAvatar;

    editUploadedAvatarDataUrl = '';

    const newPass = document.getElementById('editNewPasswordInput');
    if (newPass) newPass.value = '';
    const confirmPass = document.getElementById('editConfirmPasswordInput');
    if (confirmPass) confirmPass.value = '';

    showProfileEditAlert('');

    modal.classList.add('open');
}
window.openEditProfileModal = openEditProfileModal;

/**
 * প্রোফাইল এডিট মডাল বন্ধ করা
 */
function closeEditProfileModal() {
    const modal = document.getElementById('editProfileModal');
    if (modal) modal.classList.remove('open');
    showProfileEditAlert('');
}
window.closeEditProfileModal = closeEditProfileModal;

/**
 * প্রোফাইল পরিবর্তন সংরক্ষণ (Save Profile)
 */
async function saveProfile(event) {
    if (event) event.preventDefault();
    showProfileEditAlert('');

    const nameInput = (document.getElementById('editNameInput')?.value || '').trim();
    const collegeInput = (document.getElementById('editCollegeInput')?.value || '').trim();
    const hscYearInput = (document.getElementById('editHscYearInput')?.value || '').trim();
    const newPassword = (document.getElementById('editNewPasswordInput')?.value || '').trim();
    const confirmPassword = (document.getElementById('editConfirmPasswordInput')?.value || '').trim();

    if (!nameInput) {
        showProfileEditAlert('দয়া করে শিক্ষার্থীর সম্পূর্ণ নাম লিখুন!', 'error');
        document.getElementById('editNameInput')?.focus();
        return;
    }

    if (newPassword) {
        if (newPassword.length < 4) {
            showProfileEditAlert('নতুন পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে!', 'error');
            document.getElementById('editNewPasswordInput')?.focus();
            return;
        }
        if (newPassword !== confirmPassword) {
            showProfileEditAlert('নতুন পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মিলছে না!', 'error');
            document.getElementById('editConfirmPasswordInput')?.focus();
            return;
        }
    }

    const saveBtn = document.getElementById('btnSaveProfile');
    if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> সংরক্ষণ হচ্ছে...';
    }

    const profile = JSON.parse(localStorage.getItem('ict_student_profile') || '{}');
    const emailOrNumber = profile.emailOrNumber || profile.email || '';
    const finalAvatar = editUploadedAvatarDataUrl || profile.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80';

    // ১. লোকাল ক্যাশ আপডেট
    profile.name = nameInput;
    profile.college = collegeInput || 'এইচএসসি পরীক্ষার্থী';
    profile.hscYear = hscYearInput || 'HSC 2026';
    profile.hsc_batch = hscYearInput || 'HSC 2026';
    profile.batch = hscYearInput || 'HSC 2026';
    profile.avatar = finalAvatar;

    localStorage.setItem('ict_student_profile', JSON.stringify(profile));

    // ২. যদি পাসওয়ার্ড পরিবর্তন করা হয় তবে লোকাল অ্যাকাউন্টস তালিকায়ও পাসওয়ার্ড আপডেট
    if (newPassword && emailOrNumber) {
        try {
            let accounts = JSON.parse(localStorage.getItem('ict_registered_accounts') || '[]');
            const acct = accounts.find(a => a.emailOrNumber === emailOrNumber);
            if (acct) {
                acct.name = nameInput;
                acct.college = profile.college;
                acct.hscYear = profile.hscYear;
                acct.avatar = finalAvatar;
                acct.password = newPassword;
                localStorage.setItem('ict_registered_accounts', JSON.stringify(accounts));
            }
        } catch (e) {}
    }

    // ৩. ব্যাকএন্ডে প্রোফাইল তথ্য পাঠানো (MongoDB / students.json)
    const payload = {
        emailOrNumber: emailOrNumber,
        name: nameInput,
        college: profile.college,
        hscYear: profile.hscYear,
        avatar: finalAvatar
    };
    if (newPassword) {
        payload.password = newPassword;
    }

    try {
        if (window.ApiService && typeof ApiService.updateProfile === 'function') {
            await ApiService.updateProfile(payload);
        } else {
            const apiBase = (window.BACKEND_URL || (window.location.port === '5000' ? '' : 'http://localhost:5000'));
            await fetch(`${apiBase}/api/profile`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        }
    } catch (netErr) {
        console.warn('Backend updateProfile request failed:', netErr.message);
    }

    // ৪. পেজের UI সাথে সাথে আপডেট করা
    updateProfileUI(profile);
    if (typeof window.syncGlobalHeaderUserProfile === 'function') {
        window.syncGlobalHeaderUserProfile();
    }

    showProfileEditAlert('প্রোফাইল তথ্য সফলভাবে সংরক্ষণ করা হয়েছে!', 'success');

    if (saveBtn) {
        saveBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> সংরক্ষিত হয়েছে!';
    }

    setTimeout(() => {
        closeEditProfileModal();
        if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> সংরক্ষণ করুন';
        }
        if (window.showToast) {
            window.showToast('প্রোফাইল তথ্য সফলভাবে আপডেট করা হয়েছে!', 'success');
        }
    }, 800);
}
window.saveProfile = saveProfile;

/**
 * লগআউট নিশ্চিতকরণ
 */
function confirmLogout() {
    if (confirm('আপনি কি নিশ্চিতভাবে লগ আউট করতে চান?')) {
        if (window.showToast) {
            window.showToast('লগ আউট সম্পন্ন হয়েছে', 'info');
        }
        localStorage.removeItem('ict_is_logged_in');
        setTimeout(() => {
            const isPages = window.location.pathname.includes('/pages/');
            window.location.href = isPages ? '../login.html' : 'login.html';
        }, 600);
    }
}
window.confirmLogout = confirmLogout;
