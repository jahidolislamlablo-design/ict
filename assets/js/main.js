/**
 * ICT EASY LEARNING - MAIN SHARED SCRIPT
 * Handles global navigation, active link states, responsive helpers, and notifications.
 */

document.addEventListener('DOMContentLoaded', () => {
    initPreventPullToRefresh();
    initNavigation();
    initGlobalHelpers();
    initHeroSlider();
    checkWebsiteAuthentication();
    syncGlobalHeaderUserProfile();

    updateHeaderActualHeight();
    checkFileProtocolWarning();
});

function updateHeaderActualHeight() {
    const header = document.querySelector('.site-header');
    if (header) {
        const h = Math.round(header.getBoundingClientRect().height);
        if (h > 0) {
            document.documentElement.style.setProperty('--header-actual-height', h + 'px');
        }
    }
}
window.addEventListener('resize', updateHeaderActualHeight);
window.addEventListener('scroll', updateHeaderActualHeight, { passive: true });
updateHeaderActualHeight();

function checkFileProtocolWarning() {
    if (window.location.protocol === 'file:') {
        if (document.getElementById('file-protocol-warning')) return;
        const warningDiv = document.createElement('div');
        warningDiv.id = 'file-protocol-warning';
        warningDiv.style.cssText = 'position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: #1E293B; color: #FFFFFF; padding: 16px 22px; border-radius: 18px; box-shadow: 0 10px 30px rgba(0,0,0,0.4); border: 2px solid #6366F1; z-index: 999999; max-width: 92%; width: 580px; font-size: 0.92rem; line-height: 1.5; display: flex; align-items: center; justify-content: space-between; gap: 16px;';
        
        let rawPath = window.location.pathname || '';
        let match = rawPath.match(/(pages\/.*|index\.html.*)$/i);
        let subPath = match ? ('/' + match[1]) : '/index.html';
        if (!subPath.startsWith('/')) subPath = '/' + subPath;
        const localhostUrl = 'http://localhost:5000' + subPath;
        
        warningDiv.innerHTML = '<div style="display: flex; align-items: flex-start; gap: 12px;"><i class="fa-solid fa-triangle-exclamation" style="color: #F59E0B; font-size: 1.4rem; margin-top: 2px;"></i><div><strong style="display: block; font-size: 1rem; color: #F8FAFC; margin-bottom: 3px;">সরাসরি ফাইল থেকে ওপেন করা হয়েছে</strong><span style="color: #CBD5E1;">ব্রাউজার সিকিউরিটির (CORS) কারণে সরাসরি ফাইল মোডে ডাটাবেজের তথ্য আসে না। সম্পূর্ণ ডাটা দেখতে লোকাল সার্ভারে প্রবেশ করুন:</span></div></div><div style="display: flex; gap: 8px; flex-shrink: 0;"><a href="' + localhostUrl + '" style="background: linear-gradient(135deg, #4F46E5, #6366F1); color: #fff; text-decoration: none; padding: 8px 16px; border-radius: 9999px; font-weight: 700; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 6px; white-space: nowrap;"><i class="fa-solid fa-arrow-up-right-from-square"></i> চালু করুন</a><button type="button" onclick="this.closest(\'#file-protocol-warning\').remove()" style="background: transparent; border: none; color: #94A3B8; font-size: 1.2rem; cursor: pointer; padding: 4px;">&times;</button></div>';
        document.body.appendChild(warningDiv);
    }
}

/**
 * সক্রিয় নেভিগেশন লিংক সনাক্তকরণ
 */
function initNavigation() {
    const currentPath = window.location.pathname.toLowerCase();
    
    // Desktop Nav Items
    const desktopLinks = document.querySelectorAll('.desktop-nav a');
    desktopLinks.forEach(link => {
        const href = link.getAttribute('href').toLowerCase();
        if (isPathMatch(currentPath, href)) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Mobile Bottom Nav Items
    const mobileLinks = document.querySelectorAll('.bottom-nav .nav-item');
    mobileLinks.forEach(link => {
        const href = link.getAttribute('href').toLowerCase();
        if (isPathMatch(currentPath, href)) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // মোবাইল ও ট্যাবলেটে সক্রিয় মেনু আইটেমটি সহজে নজরে আসার জন্য অনুভূমিক অটো-স্ক্রল
    const desktopNav = document.querySelector('.desktop-nav');
    const activeDesktopLink = document.querySelector('.desktop-nav a.active');
    if (desktopNav && activeDesktopLink) {
        setTimeout(() => {
            const linkLeft = activeDesktopLink.offsetLeft;
            const linkWidth = activeDesktopLink.offsetWidth;
            const navWidth = desktopNav.clientWidth;
            desktopNav.scrollTo({
                left: linkLeft - (navWidth / 2) + (linkWidth / 2),
                behavior: 'smooth'
            });
        }, 120);
    }
}

function isPathMatch(currentPath, href) {
    if ((currentPath.endsWith('/') || currentPath.endsWith('index.html')) && (href === 'index.html' || href === './index.html' || href === '../index.html' || href === '/')) {
        return true;
    }
    const filename = href.split('/').pop().replace('.html', '');
    return filename && currentPath.includes(filename);
}

/**
 * গ্লোবাল হেল্পার ফাংশনসমূহ
 */
function initGlobalHelpers() {
    // স্মার্ট ব্যাক বাটন লজিক
    window.navigateBack = function(fallbackUrl = 'index.html') {
        if (window.history.length > 1 && document.referrer.includes(window.location.host)) {
            window.history.back();
        } else {
            window.location.href = fallbackUrl;
        }
    };

    // ইংরেজি সংখ্যাকে বাংলায় রূপান্তর
    window.toBanglaNum = function(num) {
        if (num === null || num === undefined) return '';
        const banglaDigits = {'0':'০','1':'১','2':'২','3':'৩','4':'৪','5':'৫','6':'৬','7':'৭','8':'৮','9':'৯'};
        return num.toString().replace(/\d/g, d => banglaDigits[d] || d);
    };

    // টোস্ট নোটিফিকেশন প্রদর্শন
    window.showToast = function(message, type = 'info') {
        let toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            toastContainer.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: 10px;
                pointer-events: none;
            `;
            document.body.appendChild(toastContainer);
        }

        const toast = document.createElement('div');
        toast.style.cssText = `
            background: #0F172A;
            color: #ffffff;
            padding: 12px 20px;
            border-radius: 10px;
            font-size: 0.9rem;
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideIn 0.3s ease;
            pointer-events: auto;
            border-left: 4px solid ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#4F46E5'};
        `;
        toast.innerHTML = `<span>${message}</span>`;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-10px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };
}

/**
 * হিরো ব্যানার অটোমেটিক ইমেজ স্লাইডার (Hero Slider with Auto-slide & Touch)
 */
function initHeroSlider() {
    const slider = document.getElementById('heroSlider');
    if (!slider) return;

    const slides = slider.querySelectorAll('.hero-slide');
    const dots = slider.querySelectorAll('.dot-btn');
    const prevBtn = document.getElementById('heroPrevBtn');
    const nextBtn = document.getElementById('heroNextBtn');
    
    if (slides.length <= 1) return;

    let currentIndex = 0;
    let timer = null;
    const intervalTime = 4500; // ৪.৫ সেকেন্ড পরপর ছবি ও স্লাইড স্বয়ংক্রিয় পরিবর্তন হবে

    function goToSlide(index) {
        slides[currentIndex].classList.remove('active');
        if (dots[currentIndex]) dots[currentIndex].classList.remove('active');

        currentIndex = (index + slides.length) % slides.length;

        slides[currentIndex].classList.add('active');
        if (dots[currentIndex]) dots[currentIndex].classList.add('active');
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    function startAutoSlide() {
        stopAutoSlide();
        timer = setInterval(nextSlide, intervalTime);
    }

    function stopAutoSlide() {
        if (timer) clearInterval(timer);
    }

    // বাটন ক্লিক
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            startAutoSlide(); // টাইমার রিসেট
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            startAutoSlide();
        });
    }

    // ডটস বাটন ক্লিক
    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            goToSlide(idx);
            startAutoSlide();
        });
    });

    // মাউস হোভার করলে অটো-স্লাইড সাময়িক পজ থাকবে
    slider.addEventListener('mouseenter', stopAutoSlide);
    slider.addEventListener('mouseleave', startAutoSlide);

    // মোবাইল ও ট্যাবলেট টাচ সোয়াইপ (Touch Swipe Support with Scroll Preservation)
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
        stopAutoSlide();
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
        startAutoSlide();
    }, { passive: true });

    function handleSwipe() {
        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;
        const threshold = 45;

        // কেবল অনুভূমিক সোয়াইপ হলেই স্লাইড পরিবর্তন হবে, যাতে উল্লম্ব পেইজ স্ক্রলিং ব্যাহত না হয়
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > threshold) {
            if (diffX < 0) {
                nextSlide(); // বামে সোয়াইপ -> পরবর্তী স্লাইড
            } else {
                prevSlide(); // ডানে সোয়াইপ -> পূর্ববর্তী স্লাইড
            }
        }
    }

    // স্বয়ংক্রিয় স্লাইডার চালু
    startAutoSlide();
}


/**
 * হোম পেজ ছাড়া অন্য কোনো পেইজে থাকলে ওপর থেকে টেনে রিলোড (Pull-to-refresh) বন্ধ করা
 */
function initPreventPullToRefresh() {
    const currentPath = (window.location.pathname || '').toLowerCase();
    const isHome = currentPath === '' || 
                   currentPath === '/' || 
                   currentPath.endsWith('/') || 
                   currentPath.endsWith('/index.html') || 
                   currentPath.endsWith('\\index.html') || 
                   (!currentPath.includes('/pages/') && !currentPath.includes('\\pages\\') && currentPath.includes('index.html'));

    if (!isHome) {
        document.documentElement.classList.add('no-pull-refresh');
        document.body.classList.add('no-pull-refresh');
        document.documentElement.style.overscrollBehaviorY = 'contain';
        document.body.style.overscrollBehaviorY = 'contain';

        let touchStartY = 0;
        let isTouching = false;

        window.addEventListener('touchstart', (e) => {
            if (e.touches && e.touches.length === 1) {
                touchStartY = e.touches[0].clientY;
                isTouching = true;
            }
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            if (!isTouching || !e.touches || e.touches.length !== 1) return;
            const currentY = e.touches[0].clientY;
            const deltaY = currentY - touchStartY;

            // যদি পেজের একদম উপরে থাকা অবস্থায় ওপর থেকে নিচে টানা হয় (Pull down)
            const scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
            if (scrollTop <= 0 && deltaY > 0) {
                if (e.cancelable) {
                    e.preventDefault();
                }
            }
        }, { passive: false });

        window.addEventListener('touchend', () => {
            isTouching = false;
        }, { passive: true });
    }
}


/**
 * ওয়েবসাইট প্রবেশ নিয়ন্ত্রণ ও অথেনটিকেশন চেক
 */
function checkWebsiteAuthentication() {
    const isLoginPage = window.location.pathname.toLowerCase().includes('login.html');
    if (isLoginPage) return;

    const isLoggedIn = localStorage.getItem('ict_is_logged_in') === 'true';
    if (!isLoggedIn) {
        const isPages = window.location.pathname.includes('/pages/');
        const targetLogin = isPages ? 'login.html' : 'login.html';
        window.location.href = targetLogin;
    }
}
window.checkWebsiteAuthentication = checkWebsiteAuthentication;

/**
 * গ্লোবাল হেডার প্রোফাইল ইনফো সিঙ্ক (সকল পেজের হেডারে নাম ও ছবি আপডেট)
 */
function syncGlobalHeaderUserProfile() {
    try {
        const cached = localStorage.getItem('ict_student_profile');
        if (!cached) return;
        const user = JSON.parse(cached);
        if (!user) return;

        if (user.name) {
            document.querySelectorAll('.header-user-name').forEach(el => {
                el.innerText = user.name;
            });
        }
        if (user.avatar) {
            document.querySelectorAll('.header-user-btn img').forEach(img => {
                img.src = user.avatar;
            });
        }
    } catch (e) {}
}
window.syncGlobalHeaderUserProfile = syncGlobalHeaderUserProfile;
