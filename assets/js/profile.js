/**
 * PROFILE & SETTINGS SCRIPT (profile.js)
 * ICT Easy Learning
 */

document.addEventListener('DOMContentLoaded', async () => {
    await initUserProfile();
});

async function initUserProfile() {
    try {
        let user = null;
        const cached = localStorage.getItem('ict_student_profile');
        if (cached) {
            try { user = JSON.parse(cached); } catch (e) {}
        }
        if (!user && window.ApiService && typeof ApiService.getStudentProfile === 'function') {
            user = await ApiService.getStudentProfile();
        }

        if (user) {
            updateProfileUI(user);
        }

        // Fetch rankings to determine current position
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

function updateProfileUI(user) {
    const toBn = (n) => (window.toBanglaNum ? window.toBanglaNum(n) : n);

    if (user.name) {
        const nameEl = document.getElementById('profileDisplayName');
        if (nameEl) nameEl.innerText = user.name;
        const inputName = document.getElementById('editNameInput');
        if (inputName) inputName.value = user.name;
        const headerNames = document.querySelectorAll('.header-user-name');
        headerNames.forEach(el => { el.innerText = user.name; });
    }

    if (user.college) {
        const collegeEl = document.getElementById('profileDisplayCollege');
        if (collegeEl) collegeEl.innerText = user.college;
        const inputCollege = document.getElementById('editCollegeInput');
        if (inputCollege) inputCollege.value = user.college;
    }

    if (user.points !== undefined) {
        const pointsEl = document.getElementById('profileEarnedPoints');
        if (pointsEl) pointsEl.innerText = `${toBn(user.points)} পয়েন্ট`;
    }

    if (user.avatar) {
        const avatarImgs = document.querySelectorAll('.profile-avatar-img');
        avatarImgs.forEach(img => { img.src = user.avatar; });
        const headerAvatars = document.querySelectorAll('.header-user-btn img');
        headerAvatars.forEach(img => { img.src = user.avatar; });
    }

    if (user.hsc_batch || user.batch) {
        const batchBadge = document.getElementById('profileHscBatchBadge');
        if (batchBadge) batchBadge.innerText = user.hsc_batch || user.batch;
    }
}

function openEditProfileModal() {
    const modal = document.getElementById('editProfileModal');
    if (modal) modal.classList.add('open');
}

function closeEditProfileModal() {
    const modal = document.getElementById('editProfileModal');
    if (modal) modal.classList.remove('open');
}

async function saveProfile(event) {
    if (event) event.preventDefault();
    const nameInput = document.getElementById('editNameInput').value.trim();
    const collegeInput = document.getElementById('editCollegeInput').value.trim();

    const profile = JSON.parse(localStorage.getItem('ict_student_profile') || '{}');
    if (nameInput) profile.name = nameInput;
    if (collegeInput) profile.college = collegeInput;

    localStorage.setItem('ict_student_profile', JSON.stringify(profile));
    updateProfileUI(profile);

    // Call backend API if available
    try {
        if (window.ApiService && typeof ApiService.updateProfile === 'function') {
            await ApiService.updateProfile(profile);
        } else {
            fetch('/api/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profile)
            }).catch(() => {});
        }
    } catch (e) {}

    closeEditProfileModal();
    if (window.showToast) {
        window.showToast("প্রোফাইল তথ্য সফলভাবে আপডেট করা হয়েছে!", "success");
    }
}

function confirmLogout() {
    if (confirm("আপনি কি নিশ্চিতভাবে লগ আউট করতে চান?")) {
        if (window.showToast) {
            window.showToast("লগ আউট সম্পন্ন হয়েছে", "info");
        }
        setTimeout(() => {
            localStorage.removeItem('ict_is_logged_in');
            window.location.href = "login.html";
        }, 1000);
    }
}
