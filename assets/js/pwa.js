/**
 * ICT Easy Learning - PWA Manager
 * Registers the Service Worker, manages install prompts, update notifications,
 * and offline/online status feedback.
 */
(function () {
    'use strict';

    if (window.location.protocol === 'file:') return;

    const DISMISS_KEY = 'ict_pwa_install_dismissed_at';
    const DISMISS_DAYS = 7;
    let deferredInstallPrompt = null;

    function isStandalone() {
        return window.matchMedia('(display-mode: standalone)').matches ||
            window.navigator.standalone === true;
    }

    function isDismissedRecently() {
        try {
            const raw = localStorage.getItem(DISMISS_KEY);
            if (!raw) return false;
            const elapsed = Date.now() - Number(raw);
            return elapsed < DISMISS_DAYS * 24 * 60 * 60 * 1000;
        } catch (e) {
            return false;
        }
    }

    function markDismissed() {
        try {
            localStorage.setItem(DISMISS_KEY, String(Date.now()));
        } catch (e) {}
    }

    function isIosSafari() {
        const ua = window.navigator.userAgent || '';
        const isIos = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
        const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
        return isIos && isSafari;
    }

    function ensureStyles() {
        if (document.getElementById('ict-pwa-styles')) return;
        const style = document.createElement('style');
        style.id = 'ict-pwa-styles';
        style.textContent = `
            .ict-pwa-banner {
                position: fixed;
                left: 50%;
                bottom: 20px;
                transform: translateX(-50%);
                z-index: 99990;
                width: min(94vw, 460px);
                background: #0F172A;
                color: #F8FAFC;
                border: 1px solid rgba(99, 102, 241, 0.45);
                border-radius: 16px;
                padding: 12px 14px;
                box-shadow: 0 16px 35px rgba(15, 23, 42, 0.32);
                display: flex;
                align-items: center;
                gap: 12px;
                font-family: 'Hind Siliguri', 'Inter', system-ui, sans-serif;
                animation: ictPwaSlideUp 0.28s ease-out;
            }
            @media (max-width: 768px) {
                .ict-pwa-banner {
                    bottom: 78px;
                }
            }
            .ict-pwa-banner img {
                width: 44px;
                height: 44px;
                border-radius: 10px;
                background: #FFFFFF;
                flex-shrink: 0;
                object-fit: contain;
            }
            .ict-pwa-banner-text {
                flex: 1;
                min-width: 0;
            }
            .ict-pwa-banner-title {
                font-size: 0.94rem;
                font-weight: 700;
                color: #FFFFFF;
                line-height: 1.25;
            }
            .ict-pwa-banner-sub {
                font-size: 0.78rem;
                color: #CBD5E1;
                line-height: 1.35;
                margin-top: 2px;
            }
            .ict-pwa-banner-actions {
                display: flex;
                align-items: center;
                gap: 6px;
                flex-shrink: 0;
            }
            .ict-pwa-install-btn {
                background: linear-gradient(135deg, #4F46E5, #6366F1);
                color: #FFFFFF;
                border: none;
                border-radius: 10px;
                padding: 8px 14px;
                font-size: 0.82rem;
                font-weight: 700;
                cursor: pointer;
                white-space: nowrap;
            }
            .ict-pwa-close-btn {
                background: transparent;
                color: #94A3B8;
                border: none;
                font-size: 1.25rem;
                line-height: 1;
                padding: 4px 6px;
                cursor: pointer;
            }
            .ict-pwa-toast {
                position: fixed;
                top: 18px;
                left: 50%;
                transform: translateX(-50%);
                z-index: 99995;
                background: #1E293B;
                color: #F8FAFC;
                padding: 10px 18px;
                border-radius: 9999px;
                font-size: 0.84rem;
                font-weight: 600;
                box-shadow: 0 10px 25px rgba(15, 23, 42, 0.25);
                display: flex;
                align-items: center;
                gap: 10px;
                font-family: 'Hind Siliguri', 'Inter', system-ui, sans-serif;
            }
            @keyframes ictPwaSlideUp {
                from { opacity: 0; transform: translate(-50%, 16px); }
                to { opacity: 1; transform: translate(-50%, 0); }
            }
        `;
        document.head.appendChild(style);
    }

    function removeInstallBanner() {
        const existing = document.getElementById('ict-pwa-install-banner');
        if (existing) existing.remove();
    }

    function showToast(message, actionLabel, onAction) {
        ensureStyles();
        const existing = document.getElementById('ict-pwa-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.id = 'ict-pwa-toast';
        toast.className = 'ict-pwa-toast';

        const textSpan = document.createElement('span');
        textSpan.textContent = message;
        toast.appendChild(textSpan);

        if (actionLabel && typeof onAction === 'function') {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'ict-pwa-install-btn';
            btn.style.padding = '5px 10px';
            btn.textContent = actionLabel;
            btn.addEventListener('click', () => {
                toast.remove();
                onAction();
            });
            toast.appendChild(btn);
        } else {
            setTimeout(() => {
                if (toast.parentNode) toast.remove();
            }, 3500);
        }

        document.body.appendChild(toast);
    }

    function showInstallBanner(isIosMode) {
        if (isStandalone() || isDismissedRecently()) return;
        if (document.getElementById('ict-pwa-install-banner')) return;

        ensureStyles();

        const banner = document.createElement('div');
        banner.id = 'ict-pwa-install-banner';
        banner.className = 'ict-pwa-banner';
        banner.setAttribute('role', 'region');
        banner.setAttribute('aria-label', 'অ্যাপ ইন্সটল');

        const subtitle = isIosMode
            ? 'Safari-এর Share বাটনে ট্যাপ করে "Add to Home Screen" দিন'
            : 'দ্রুত ও অফলাইন সুবিধাসহ মোবাইল অ্যাপ হিসেবে ব্যবহার করুন';

        banner.innerHTML = `
            <img src="/assets/icons/icon-192.png" alt="ICT Easy Learning">
            <div class="ict-pwa-banner-text">
                <div class="ict-pwa-banner-title">ICT Learning অ্যাপ ইন্সটল করুন</div>
                <div class="ict-pwa-banner-sub">${subtitle}</div>
            </div>
            <div class="ict-pwa-banner-actions">
                ${isIosMode ? '' : '<button type="button" class="ict-pwa-install-btn" id="ict-pwa-install-trigger">ইন্সটল</button>'}
                <button type="button" class="ict-pwa-close-btn" id="ict-pwa-dismiss-btn" aria-label="বন্ধ করুন">&times;</button>
            </div>
        `;

        document.body.appendChild(banner);

        const dismissBtn = document.getElementById('ict-pwa-dismiss-btn');
        if (dismissBtn) {
            dismissBtn.addEventListener('click', () => {
                markDismissed();
                removeInstallBanner();
            });
        }

        const installBtn = document.getElementById('ict-pwa-install-trigger');
        if (installBtn) {
            installBtn.addEventListener('click', async () => {
                if (!deferredInstallPrompt) return;
                deferredInstallPrompt.prompt();
                const choice = await deferredInstallPrompt.userChoice;
                deferredInstallPrompt = null;
                if (choice && choice.outcome === 'accepted') {
                    removeInstallBanner();
                } else {
                    markDismissed();
                    removeInstallBanner();
                }
            });
        }
    }

    function registerServiceWorker() {
        if (!('serviceWorker' in navigator)) return;

        window.addEventListener('load', async () => {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });

                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    if (!newWorker) return;

                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            showToast('অ্যাপের নতুন ভার্সন পাওয়া গেছে', 'আপডেট করুন', () => {
                                newWorker.postMessage({ type: 'SKIP_WAITING' });
                            });
                        }
                    });
                });

                let refreshing = false;
                navigator.serviceWorker.addEventListener('controllerchange', () => {
                    if (refreshing) return;
                    refreshing = true;
                    window.location.reload();
                });
            } catch (err) {
                console.warn('Service Worker registration failed:', err);
            }
        });
    }

    window.addEventListener('beforeinstallprompt', (event) => {
        event.preventDefault();
        deferredInstallPrompt = event;
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => showInstallBanner(false), { once: true });
        } else {
            showInstallBanner(false);
        }
    });

    window.addEventListener('appinstalled', () => {
        deferredInstallPrompt = null;
        removeInstallBanner();
        showToast('অ্যাপ সফলভাবে ইন্সটল হয়েছে!');
    });

    window.addEventListener('offline', () => {
        showToast('ইন্টারনেট সংযোগ বিচ্ছিন্ন (অফলাইন মোড)');
    });

    window.addEventListener('online', () => {
        showToast('ইন্টারনেট সংযোগ ফিরে এসেছে');
    });

    document.addEventListener('DOMContentLoaded', () => {
        if (isIosSafari() && !isStandalone()) {
            setTimeout(() => showInstallBanner(true), 2500);
        }
    });

    registerServiceWorker();
})();
