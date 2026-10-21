/**
 * PDF SUGGESTIONS & NOTES SCRIPT
 */

document.addEventListener('DOMContentLoaded', () => {
    initPdfFilters();
    initPdfSearch();
});

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
