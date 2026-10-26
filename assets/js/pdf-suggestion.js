/**
 * PDF SUGGESTIONS & NOTES SCRIPT
 * Dynamically fetches uploaded PDFs from the backend.
 */

document.addEventListener('DOMContentLoaded', () => {
    initPdfFilters();
    initPdfSearch();
    loadLivePdfs();
});

let livePdfItems = [];

async function loadLivePdfs() {
    const grid = document.querySelector('.pdf-grid');
    if (!grid) return;

    try {
        let pdfs = [];
        if (typeof ApiService !== 'undefined' && ApiService.getAllPDFs) {
            pdfs = await ApiService.getAllPDFs();
        }

        if (pdfs && pdfs.length > 0) {
            livePdfItems = pdfs;
            renderPdfCards(pdfs);
        }
    } catch (e) {
        console.warn("Could not load backend PDFs, showing default resources:", e);
    }
}

function renderPdfCards(pdfs) {
    const grid = document.querySelector('.pdf-grid');
    if (!grid) return;

    const catMap = {
        suggestion: { name: 'বোর্ড সুপার সাজেশন', badge: 'badge-warning' },
        handnote: { name: 'অধ্যায়ভিত্তিক হ্যান্ডনোট', badge: 'badge-primary' },
        cheatsheet: { name: 'চিটশিট ও কোড বুকলেট', badge: 'badge-success' },
        board: { name: 'বোর্ড সমাধান', badge: 'badge-primary' },
        testpaper: { name: 'টেস্ট পেপার সমাধান', badge: 'badge-info' }
    };

    const backendUrl = (typeof BACKEND_URL !== 'undefined') ? BACKEND_URL : 'http://localhost:5000';

    let html = '';
    pdfs.forEach(pdf => {
        const catInfo = catMap[pdf.category] || { name: 'সাজেশন নোট', badge: 'badge-primary' };
        const isLocal = pdf.pdfUrl.startsWith('/uploads/');
        const fullUrl = isLocal ? (backendUrl + pdf.pdfUrl) : pdf.pdfUrl;

        html += `
            <div class="pdf-card" data-category="${pdf.category}">
                <div>
                    <div class="pdf-header">
                        <div class="pdf-icon-box">
                            <i class="fa-solid fa-file-pdf"></i>
                        </div>
                        <div class="pdf-info">
                            <span class="badge ${catInfo.badge}" style="margin-bottom: 6px;">${catInfo.name}</span>
                            <h3>${escapeHtml(pdf.title)}</h3>
                        </div>
                    </div>
                    <div class="pdf-meta">
                        <span><i class="fa-solid fa-layer-group"></i> ${escapeHtml(pdf.chapter || 'সকল অধ্যায়')}</span>
                        <span><i class="fa-solid fa-file-lines"></i> ${escapeHtml(pdf.pagesCount || '১০ পৃষ্ঠা')}</span>
                        <span><i class="fa-solid fa-hard-drive"></i> ${escapeHtml(pdf.fileSize || '১.৫ MB')}</span>
                        <span><i class="fa-solid fa-download"></i> ${pdf.downloadsCount || 0} বার</span>
                    </div>
                    ${pdf.description ? `<p style="font-size: 0.88rem; color: var(--text-secondary); margin-top: 8px; line-height: 1.5;">${escapeHtml(pdf.description)}</p>` : ''}
                </div>
                <div class="pdf-actions">
                    <a href="${fullUrl}" target="_blank" class="btn btn-outline btn-sm" style="text-decoration: none;">
                        <i class="fa-solid fa-eye"></i> পড়ুন
                    </a>
                    <a href="${fullUrl}" download="${escapeHtml(pdf.originalFileName || pdf.title + '.pdf')}" class="btn btn-primary btn-sm" onclick="triggerDownload('${pdf._id}', '${escapeHtml(pdf.title)}')" style="text-decoration: none;">
                        <i class="fa-solid fa-download"></i> ডাউনলোড
                    </a>
                </div>
            </div>
        `;
    });

    grid.innerHTML = html;
}

function triggerDownload(pdfId, title) {
    if (typeof ApiService !== 'undefined' && ApiService.recordPdfDownload) {
        ApiService.recordPdfDownload(pdfId);
    }
    if (typeof window.showToast === 'function') {
        window.showToast(`"${title}" ডাউনলোড শুরু হয়েছে...`, 'success');
    }
}

function escapeHtml(text) {
    if (!text) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function initPdfFilters() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const category = tab.getAttribute('data-category');
            filterPdfCards(category);
        });
    });
}

function filterPdfCards(category) {
    const cards = document.querySelectorAll('.pdf-card');
    cards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

function initPdfSearch() {
    const searchInput = document.getElementById('pdfSearchInput');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const cards = document.querySelectorAll('.pdf-card');

        cards.forEach(card => {
            const title = card.querySelector('h3').innerText.toLowerCase();
            const meta = card.querySelector('.pdf-meta').innerText.toLowerCase();

            if (title.includes(query) || meta.includes(query)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

function downloadPdf(pdfTitle) {
    window.showToast(`"${pdfTitle}" ডাউনলোড শুরু হয়েছে...`, 'success');
}

function openPdfPreview(pdfTitle, previewText) {
    document.getElementById('previewModalTitle').innerText = pdfTitle;
    document.getElementById('previewModalContent').innerText = previewText;
    document.getElementById('pdfPreviewModal').classList.add('open');
}

function closePdfPreview() {
    document.getElementById('pdfPreviewModal').classList.remove('open');
}
