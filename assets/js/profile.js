/**
 * PROFILE & SETTINGS SCRIPT
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initial profile setup
});

function openEditProfileModal() {
    document.getElementById('editProfileModal').classList.add('open');
}

function closeEditProfileModal() {
    document.getElementById('editProfileModal').classList.remove('open');
}

function saveProfile(event) {
    event.preventDefault();
    const nameInput = document.getElementById('editNameInput').value;
    const collegeInput = document.getElementById('editCollegeInput').value;

    if (nameInput) {
        document.getElementById('profileDisplayName').innerText = nameInput;
    }
    if (collegeInput) {
        document.getElementById('profileDisplayCollege').innerText = collegeInput;
    }

    closeEditProfileModal();
    window.showToast("প্রোফাইল তথ্য সফলভাবে আপডেট করা হয়েছে!", "success");
}

function confirmLogout() {
    if (confirm("আপনি কি নিশ্চিতভাবে লগ আউট করতে চান?")) {
        window.showToast("লগ আউট সম্পন্ন হয়েছে", "info");
        setTimeout(() => {
            window.location.href = "../index.html";
        }, 1000);
    }
}
