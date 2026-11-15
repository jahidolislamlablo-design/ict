const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

console.log('--- STARTING COMPLETE APPLICATION OF FIXES ---');

// =========================================================================
// 1. UPDATE pages/chapter-prep.html
// =========================================================================
const cpPath = path.join(root, 'pages', 'chapter-prep.html');
let cpHtml = fs.readFileSync(cpPath, 'utf8');

const newChaptersGridHtml = `
                <div class="chapters-grid">
                    <!-- ১ম অধ্যায় -->
                    <div class="chapter-prep-card" data-chapter-key="1" onclick="openChapterModal('১ম অধ্যায়: তথ্য ও যোগাযোগ প্রযুক্তি: বিশ্ব ও বাংলাদেশ প্রেক্ষিত', 1)">
                        <div class="card-left-info">
                            <div class="chapter-badge-icon" style="background: #EEF2FF; color: #4F46E5;">
                                <i class="fa-solid fa-earth-americas"></i>
                            </div>
                            <div class="card-text-group">
                                <span class="card-ch-num">১ম অধ্যায়</span>
                                <h3 class="card-main-title">তথ্য ও যোগাযোগ প্রযুক্তি</h3>
                                <span class="card-counts-badge" id="ch-stat-1"><i class="fa-regular fa-circle-question"></i> ৩৫২ MCQ | ৪৪ CQ</span>
                            </div>
                        </div>
                        <div class="card-right-progress" id="chapter-ring-1">
                            <div class="card-ring-box">
                                <svg class="card-ring-svg" viewBox="0 0 44 44">
                                    <circle class="card-ring-bg" cx="22" cy="22" r="18"></circle>
                                    <circle class="card-ring-fill" id="ring-fill-ch-1" cx="22" cy="22" r="18" stroke-dasharray="113.1" stroke-dashoffset="113.1"></circle>
                                </svg>
                                <span class="card-ring-ratio" id="ring-ratio-ch-1">0/352</span>
                            </div>
                            <span class="card-ring-pct" id="ring-pct-ch-1">0.00% প্রশ্ন পড়া হয়েছে</span>
                        </div>
                    </div>

                    <!-- ২য় অধ্যায় -->
                    <div class="chapter-prep-card" data-chapter-key="2" onclick="openChapterModal('২য় অধ্যায়: কমিউনিকেশন সিস্টেমস ও নেটওয়ার্কিং', 2)">
                        <div class="card-left-info">
                            <div class="chapter-badge-icon" style="background: #ECFEFF; color: #06B6D4;">
                                <i class="fa-solid fa-network-wired"></i>
                            </div>
                            <div class="card-text-group">
                                <span class="card-ch-num">২য় অধ্যায়</span>
                                <h3 class="card-main-title">কমিউনিকেশন সিস্টেমস ও নেটওয়ার্কিং</h3>
                                <span class="card-counts-badge" id="ch-stat-2"><i class="fa-regular fa-circle-question"></i> ২৪৩ MCQ | ১৭ CQ</span>
                            </div>
                        </div>
                        <div class="card-right-progress" id="chapter-ring-2">
                            <div class="card-ring-box">
                                <svg class="card-ring-svg" viewBox="0 0 44 44">
                                    <circle class="card-ring-bg" cx="22" cy="22" r="18"></circle>
                                    <circle class="card-ring-fill" id="ring-fill-ch-2" cx="22" cy="22" r="18" stroke-dasharray="113.1" stroke-dashoffset="113.1"></circle>
                                </svg>
                                <span class="card-ring-ratio" id="ring-ratio-ch-2">0/243</span>
                            </div>
                            <span class="card-ring-pct" id="ring-pct-ch-2">0.00% প্রশ্ন পড়া হয়েছে</span>
                        </div>
                    </div>

                    <!-- ৩য় অধ্যায় ১ম অংশ -->
                    <div class="chapter-prep-card" data-chapter-key="3.1" onclick="openChapterModal('৩য় অধ্যায় (১ম অংশ): সংখ্যা পদ্ধতি (Number Systems)', '3.1')">
                        <div class="card-left-info">
                            <div class="chapter-badge-icon" style="background: #FAF5FF; color: #8B5CF6;">
                                <i class="fa-solid fa-calculator"></i>
                            </div>
                            <div class="card-text-group">
                                <span class="card-ch-num">৩য় অধ্যায় (১ম অংশ)</span>
                                <h3 class="card-main-title">সংখ্যা পদ্ধতি</h3>
                                <span class="card-counts-badge" id="ch-stat-3-1"><i class="fa-regular fa-circle-question"></i> ২১৯ MCQ | ৩০ CQ</span>
                            </div>
                        </div>
                        <div class="card-right-progress" id="chapter-ring-3-1">
                            <div class="card-ring-box">
                                <svg class="card-ring-svg" viewBox="0 0 44 44">
                                    <circle class="card-ring-bg" cx="22" cy="22" r="18"></circle>
                                    <circle class="card-ring-fill" id="ring-fill-ch-3-1" cx="22" cy="22" r="18" stroke-dasharray="113.1" stroke-dashoffset="113.1"></circle>
                                </svg>
                                <span class="card-ring-ratio" id="ring-ratio-ch-3-1">0/219</span>
                            </div>
                            <span class="card-ring-pct" id="ring-pct-ch-3-1">0.00% প্রশ্ন পড়া হয়েছে</span>
                        </div>
                    </div>

                    <!-- ৩য় অধ্যায় ২য় অংশ -->
                    <div class="chapter-prep-card" data-chapter-key="3.2" onclick="openChapterModal('৩য় অধ্যায় (২য় অংশ): ডিজিটাল ডিভাইস ও লজিক গেট', '3.2')">
                        <div class="card-left-info">
                            <div class="chapter-badge-icon" style="background: #FFFBEB; color: #D97706;">
                                <i class="fa-solid fa-microchip"></i>
                            </div>
                            <div class="card-text-group">
                                <span class="card-ch-num">৩য় অধ্যায় (২য় অংশ)</span>
                                <h3 class="card-main-title">ডিজিটাল ডিভাইস</h3>
                                <span class="card-counts-badge" id="ch-stat-3-2"><i class="fa-regular fa-circle-question"></i> ২৮৩ MCQ | ৩৭ CQ</span>
                            </div>
                        </div>
                        <div class="card-right-progress" id="chapter-ring-3-2">
                            <div class="card-ring-box">
                                <svg class="card-ring-svg" viewBox="0 0 44 44">
                                    <circle class="card-ring-bg" cx="22" cy="22" r="18"></circle>
                                    <circle class="card-ring-fill" id="ring-fill-ch-3-2" cx="22" cy="22" r="18" stroke-dasharray="113.1" stroke-dashoffset="113.1"></circle>
                                </svg>
                                <span class="card-ring-ratio" id="ring-ratio-ch-3-2">0/283</span>
                            </div>
                            <span class="card-ring-pct" id="ring-pct-ch-3-2">0.00% প্রশ্ন পড়া হয়েছে</span>
                        </div>
                    </div>

                    <!-- ৪র্থ অধ্যায় -->
                    <div class="chapter-prep-card" data-chapter-key="4" onclick="openChapterModal('৪র্থ অধ্যায়: ওয়েব ডিজাইন পরিচিতি এবং এইচটিএমএল (HTML)', 4)">
                        <div class="card-left-info">
                            <div class="chapter-badge-icon" style="background: #ECFDF5; color: #10B981;">
                                <i class="fa-solid fa-code"></i>
                            </div>
                            <div class="card-text-group">
                                <span class="card-ch-num">৪র্থ অধ্যায়</span>
                                <h3 class="card-main-title">ওয়েব ডিজাইন ও HTML</h3>
                                <span class="card-counts-badge" id="ch-stat-4"><i class="fa-regular fa-circle-question"></i> ২০৪ MCQ</span>
                            </div>
                        </div>
                        <div class="card-right-progress" id="chapter-ring-4">
                            <div class="card-ring-box">
                                <svg class="card-ring-svg" viewBox="0 0 44 44">
                                    <circle class="card-ring-bg" cx="22" cy="22" r="18"></circle>
                                    <circle class="card-ring-fill" id="ring-fill-ch-4" cx="22" cy="22" r="18" stroke-dasharray="113.1" stroke-dashoffset="113.1"></circle>
                                </svg>
                                <span class="card-ring-ratio" id="ring-ratio-ch-4">0/204</span>
                            </div>
                            <span class="card-ring-pct" id="ring-pct-ch-4">0.00% প্রশ্ন পড়া হয়েছে</span>
                        </div>
                    </div>

                    <!-- ৫ম অধ্যায় -->
                    <div class="chapter-prep-card" data-chapter-key="5" onclick="openChapterModal('৫ম অধ্যায়: প্রোগ্রামিং ভাষা (C Programming)', 5)">
                        <div class="card-left-info">
                            <div class="chapter-badge-icon" style="background: #FEF2F2; color: #EF4444;">
                                <i class="fa-solid fa-laptop-code"></i>
                            </div>
                            <div class="card-text-group">
                                <span class="card-ch-num">৫ম অধ্যায়</span>
                                <h3 class="card-main-title">প্রোগ্রামিং ভাষা (C)</h3>
                                <span class="card-counts-badge" id="ch-stat-5"><i class="fa-regular fa-circle-question"></i> ৪০২ MCQ</span>
                            </div>
                        </div>
                        <div class="card-right-progress" id="chapter-ring-5">
                            <div class="card-ring-box">
                                <svg class="card-ring-svg" viewBox="0 0 44 44">
                                    <circle class="card-ring-bg" cx="22" cy="22" r="18"></circle>
                                    <circle class="card-ring-fill" id="ring-fill-ch-5" cx="22" cy="22" r="18" stroke-dasharray="113.1" stroke-dashoffset="113.1"></circle>
                                </svg>
                                <span class="card-ring-ratio" id="ring-ratio-ch-5">0/402</span>
                            </div>
                            <span class="card-ring-pct" id="ring-pct-ch-5">0.00% প্রশ্ন পড়া হয়েছে</span>
                        </div>
                    </div>

                    <!-- ৬ষ্ঠ অধ্যায় -->
                    <div class="chapter-prep-card" data-chapter-key="6" onclick="openChapterModal('৬ষ্ঠ অধ্যায়: ডেটাবেজ ম্যানেজমেন্ট সিস্টেম (DBMS)', 6)">
                        <div class="card-left-info">
                            <div class="chapter-badge-icon" style="background: #FDF2F8; color: #DB2777;">
                                <i class="fa-solid fa-database"></i>
                            </div>
                            <div class="card-text-group">
                                <span class="card-ch-num">৬ষ্ঠ অধ্যায়</span>
                                <h3 class="card-main-title">ডাটাবেজ ম্যানেজমেন্ট সিস্টেম</h3>
                                <span class="card-counts-badge" id="ch-stat-6"><i class="fa-regular fa-circle-question"></i> ১৮৭ MCQ</span>
                            </div>
                        </div>
                        <div class="card-right-progress" id="chapter-ring-6">
                            <div class="card-ring-box">
                                <svg class="card-ring-svg" viewBox="0 0 44 44">
                                    <circle class="card-ring-bg" cx="22" cy="22" r="18"></circle>
                                    <circle class="card-ring-fill" id="ring-fill-ch-6" cx="22" cy="22" r="18" stroke-dasharray="113.1" stroke-dashoffset="113.1"></circle>
                                </svg>
                                <span class="card-ring-ratio" id="ring-ratio-ch-6">0/187</span>
                            </div>
                            <span class="card-ring-pct" id="ring-pct-ch-6">0.00% প্রশ্ন পড়া হয়েছে</span>
                        </div>
                    </div>
                </div>`;

cpHtml = cpHtml.replace(/<div class="chapters-grid">[\s\S]*?<\/div>\s*<\/section>/, newChaptersGridHtml + '\n            </section>');
fs.writeFileSync(cpPath, cpHtml, 'utf8');
console.log('✓ Successfully updated pages/chapter-prep.html with right-side circular progress cards!');

// =========================================================================
// 2. UPDATE pages/board-question.html
// =========================================================================
const bqPath = path.join(root, 'pages', 'board-question.html');
let bqHtml = fs.readFileSync(bqPath, 'utf8');

const newBoardsGridHtml = `
                <div class="boards-grid">
                    <!-- ঢাকা বোর্ড -->
                    <div class="board-card" data-board-key="dhaka" onclick="openTypeModal('ঢাকা বোর্ড (DHAKA BOARD)')">
                        <div class="card-left-info">
                            <div class="board-icon"><i class="fa-solid fa-building-columns"></i></div>
                            <div>
                                <div class="board-name">ঢাকা বোর্ড</div>
                                <div class="board-code">DHAKA BOARD</div>
                                <div class="card-counts-badge" id="board-stat-dhaka"><i class="fa-regular fa-circle-question"></i> ৯৭ MCQ</div>
                            </div>
                        </div>
                        <div class="card-right-progress" id="board-ring-dhaka">
                            <div class="card-ring-box">
                                <svg class="card-ring-svg" viewBox="0 0 44 44">
                                    <circle class="card-ring-bg" cx="22" cy="22" r="18"></circle>
                                    <circle class="card-ring-fill" id="ring-fill-board-dhaka" cx="22" cy="22" r="18" stroke-dasharray="113.1" stroke-dashoffset="113.1"></circle>
                                </svg>
                                <span class="card-ring-ratio" id="ring-ratio-board-dhaka">0/97</span>
                            </div>
                            <span class="card-ring-pct" id="ring-pct-board-dhaka">0.00% প্রশ্ন পড়া হয়েছে</span>
                        </div>
                    </div>

                    <!-- রাজশাহী বোর্ড -->
                    <div class="board-card" data-board-key="rajshahi" onclick="openTypeModal('রাজশাহী বোর্ড (RAJSHAHI BOARD)')">
                        <div class="card-left-info">
                            <div class="board-icon"><i class="fa-solid fa-building-columns"></i></div>
                            <div>
                                <div class="board-name">রাজশাহী বোর্ড</div>
                                <div class="board-code">RAJSHAHI BOARD</div>
                                <div class="card-counts-badge" id="board-stat-rajshahi"><i class="fa-regular fa-circle-question"></i> ৬১ MCQ</div>
                            </div>
                        </div>
                        <div class="card-right-progress" id="board-ring-rajshahi">
                            <div class="card-ring-box">
                                <svg class="card-ring-svg" viewBox="0 0 44 44">
                                    <circle class="card-ring-bg" cx="22" cy="22" r="18"></circle>
                                    <circle class="card-ring-fill" id="ring-fill-board-rajshahi" cx="22" cy="22" r="18" stroke-dasharray="113.1" stroke-dashoffset="113.1"></circle>
                                </svg>
                                <span class="card-ring-ratio" id="ring-ratio-board-rajshahi">0/61</span>
                            </div>
                            <span class="card-ring-pct" id="ring-pct-board-rajshahi">0.00% প্রশ্ন পড়া হয়েছে</span>
                        </div>
                    </div>

                    <!-- চট্টগ্রাম বোর্ড -->
                    <div class="board-card" data-board-key="chattogram" onclick="openTypeModal('চট্টগ্রাম বোর্ড (CHATTOGRAM BOARD)')">
                        <div class="card-left-info">
                            <div class="board-icon"><i class="fa-solid fa-building-columns"></i></div>
                            <div>
                                <div class="board-name">চট্টগ্রাম বোর্ড</div>
                                <div class="board-code">CHATTOGRAM BOARD</div>
                                <div class="card-counts-badge" id="board-stat-chattogram"><i class="fa-regular fa-circle-question"></i> ৬৪ MCQ</div>
                            </div>
                        </div>
                        <div class="card-right-progress" id="board-ring-chattogram">
                            <div class="card-ring-box">
                                <svg class="card-ring-svg" viewBox="0 0 44 44">
                                    <circle class="card-ring-bg" cx="22" cy="22" r="18"></circle>
                                    <circle class="card-ring-fill" id="ring-fill-board-chattogram" cx="22" cy="22" r="18" stroke-dasharray="113.1" stroke-dashoffset="113.1"></circle>
                                </svg>
                                <span class="card-ring-ratio" id="ring-ratio-board-chattogram">0/64</span>
                            </div>
                            <span class="card-ring-pct" id="ring-pct-board-chattogram">0.00% প্রশ্ন পড়া হয়েছে</span>
                        </div>
                    </div>

                    <!-- যশোর বোর্ড -->
                    <div class="board-card" data-board-key="jashore" onclick="openTypeModal('যশোর বোর্ড (JASHORE BOARD)')">
                        <div class="card-left-info">
                            <div class="board-icon"><i class="fa-solid fa-building-columns"></i></div>
                            <div>
                                <div class="board-name">যশোর বোর্ড</div>
                                <div class="board-code">JASHORE BOARD</div>
                                <div class="card-counts-badge" id="board-stat-jashore"><i class="fa-regular fa-circle-question"></i> ৬৮ MCQ</div>
                            </div>
                        </div>
                        <div class="card-right-progress" id="board-ring-jashore">
                            <div class="card-ring-box">
                                <svg class="card-ring-svg" viewBox="0 0 44 44">
                                    <circle class="card-ring-bg" cx="22" cy="22" r="18"></circle>
                                    <circle class="card-ring-fill" id="ring-fill-board-jashore" cx="22" cy="22" r="18" stroke-dasharray="113.1" stroke-dashoffset="113.1"></circle>
                                </svg>
                                <span class="card-ring-ratio" id="ring-ratio-board-jashore">0/68</span>
                            </div>
                            <span class="card-ring-pct" id="ring-pct-board-jashore">0.00% প্রশ্ন পড়া হয়েছে</span>
                        </div>
                    </div>

                    <!-- কুমিল্লা বোর্ড -->
                    <div class="board-card" data-board-key="comilla" onclick="openTypeModal('কুমিল্লা বোর্ড (COMILLA BOARD)')">
                        <div class="card-left-info">
                            <div class="board-icon"><i class="fa-solid fa-building-columns"></i></div>
                            <div>
                                <div class="board-name">কুমিল্লা বোর্ড</div>
                                <div class="board-code">COMILLA BOARD</div>
                                <div class="card-counts-badge" id="board-stat-comilla"><i class="fa-regular fa-circle-question"></i> ৬২ MCQ</div>
                            </div>
                        </div>
                        <div class="card-right-progress" id="board-ring-comilla">
                            <div class="card-ring-box">
                                <svg class="card-ring-svg" viewBox="0 0 44 44">
                                    <circle class="card-ring-bg" cx="22" cy="22" r="18"></circle>
                                    <circle class="card-ring-fill" id="ring-fill-board-comilla" cx="22" cy="22" r="18" stroke-dasharray="113.1" stroke-dashoffset="113.1"></circle>
                                </svg>
                                <span class="card-ring-ratio" id="ring-ratio-board-comilla">0/62</span>
                            </div>
                            <span class="card-ring-pct" id="ring-pct-board-comilla">0.00% প্রশ্ন পড়া হয়েছে</span>
                        </div>
                    </div>

                    <!-- সিলেট বোর্ড -->
                    <div class="board-card" data-board-key="sylhet" onclick="openTypeModal('সিলেট বোর্ড (SYLHET BOARD)')">
                        <div class="card-left-info">
                            <div class="board-icon"><i class="fa-solid fa-building-columns"></i></div>
                            <div>
                                <div class="board-name">সিলেট বোর্ড</div>
                                <div class="board-code">SYLHET BOARD</div>
                                <div class="card-counts-badge" id="board-stat-sylhet"><i class="fa-regular fa-circle-question"></i> ৫৫ MCQ</div>
                            </div>
                        </div>
                        <div class="card-right-progress" id="board-ring-sylhet">
                            <div class="card-ring-box">
                                <svg class="card-ring-svg" viewBox="0 0 44 44">
                                    <circle class="card-ring-bg" cx="22" cy="22" r="18"></circle>
                                    <circle class="card-ring-fill" id="ring-fill-board-sylhet" cx="22" cy="22" r="18" stroke-dasharray="113.1" stroke-dashoffset="113.1"></circle>
                                </svg>
                                <span class="card-ring-ratio" id="ring-ratio-board-sylhet">0/55</span>
                            </div>
                            <span class="card-ring-pct" id="ring-pct-board-sylhet">0.00% প্রশ্ন পড়া হয়েছে</span>
                        </div>
                    </div>

                    <!-- বরিশাল বোর্ড -->
                    <div class="board-card" data-board-key="barishal" onclick="openTypeModal('বরিশাল বোর্ড (BARISHAL BOARD)')">
                        <div class="card-left-info">
                            <div class="board-icon"><i class="fa-solid fa-building-columns"></i></div>
                            <div>
                                <div class="board-name">বরিশাল বোর্ড</div>
                                <div class="board-code">BARISHAL BOARD</div>
                                <div class="card-counts-badge" id="board-stat-barishal"><i class="fa-regular fa-circle-question"></i> ৬৩ MCQ</div>
                            </div>
                        </div>
                        <div class="card-right-progress" id="board-ring-barishal">
                            <div class="card-ring-box">
                                <svg class="card-ring-svg" viewBox="0 0 44 44">
                                    <circle class="card-ring-bg" cx="22" cy="22" r="18"></circle>
                                    <circle class="card-ring-fill" id="ring-fill-board-barishal" cx="22" cy="22" r="18" stroke-dasharray="113.1" stroke-dashoffset="113.1"></circle>
                                </svg>
                                <span class="card-ring-ratio" id="ring-ratio-board-barishal">0/63</span>
                            </div>
                            <span class="card-ring-pct" id="ring-pct-board-barishal">0.00% প্রশ্ন পড়া হয়েছে</span>
                        </div>
                    </div>

                    <!-- দিনাজপুর বোর্ড -->
                    <div class="board-card" data-board-key="dinajpur" onclick="openTypeModal('দিনাজপুর বোর্ড (DINAJPUR BOARD)')">
                        <div class="card-left-info">
                            <div class="board-icon"><i class="fa-solid fa-building-columns"></i></div>
                            <div>
                                <div class="board-name">দিনাজপুর বোর্ড</div>
                                <div class="board-code">DINAJPUR BOARD</div>
                                <div class="card-counts-badge" id="board-stat-dinajpur"><i class="fa-regular fa-circle-question"></i> ৫৯ MCQ</div>
                            </div>
                        </div>
                        <div class="card-right-progress" id="board-ring-dinajpur">
                            <div class="card-ring-box">
                                <svg class="card-ring-svg" viewBox="0 0 44 44">
                                    <circle class="card-ring-bg" cx="22" cy="22" r="18"></circle>
                                    <circle class="card-ring-fill" id="ring-fill-board-dinajpur" cx="22" cy="22" r="18" stroke-dasharray="113.1" stroke-dashoffset="113.1"></circle>
                                </svg>
                                <span class="card-ring-ratio" id="ring-ratio-board-dinajpur">0/59</span>
                            </div>
                            <span class="card-ring-pct" id="ring-pct-board-dinajpur">0.00% প্রশ্ন পড়া হয়েছে</span>
                        </div>
                    </div>

                    <!-- ময়মনসিংহ বোর্ড -->
                    <div class="board-card" data-board-key="mymensingh" onclick="openTypeModal('ময়মনসিংহ বোর্ড (MYMENSINGH BOARD)')">
                        <div class="card-left-info">
                            <div class="board-icon"><i class="fa-solid fa-building-columns"></i></div>
                            <div>
                                <div class="board-name">ময়মনসিংহ বোর্ড</div>
                                <div class="board-code">MYMENSINGH BOARD</div>
                                <div class="card-counts-badge" id="board-stat-mymensingh"><i class="fa-regular fa-circle-question"></i> ২৭ MCQ</div>
                            </div>
                        </div>
                        <div class="card-right-progress" id="board-ring-mymensingh">
                            <div class="card-ring-box">
                                <svg class="card-ring-svg" viewBox="0 0 44 44">
                                    <circle class="card-ring-bg" cx="22" cy="22" r="18"></circle>
                                    <circle class="card-ring-fill" id="ring-fill-board-mymensingh" cx="22" cy="22" r="18" stroke-dasharray="113.1" stroke-dashoffset="113.1"></circle>
                                </svg>
                                <span class="card-ring-ratio" id="ring-ratio-board-mymensingh">0/27</span>
                            </div>
                            <span class="card-ring-pct" id="ring-pct-board-mymensingh">0.00% প্রশ্ন পড়া হয়েছে</span>
                        </div>
                    </div>

                    <!-- মাদ্রাসা বোর্ড -->
                    <div class="board-card" data-board-key="madrasah" onclick="openTypeModal('মাদ্রাসা বোর্ড (MADRASAH BOARD)')">
                        <div class="card-left-info">
                            <div class="board-icon"><i class="fa-solid fa-mosque"></i></div>
                            <div>
                                <div class="board-name">মাদ্রাসা বোর্ড</div>
                                <div class="board-code">MADRASAH BOARD</div>
                                <div class="card-counts-badge" id="board-stat-madrasah"><i class="fa-regular fa-circle-question"></i> ১৫ MCQ</div>
                            </div>
                        </div>
                        <div class="card-right-progress" id="board-ring-madrasah">
                            <div class="card-ring-box">
                                <svg class="card-ring-svg" viewBox="0 0 44 44">
                                    <circle class="card-ring-bg" cx="22" cy="22" r="18"></circle>
                                    <circle class="card-ring-fill" id="ring-fill-board-madrasah" cx="22" cy="22" r="18" stroke-dasharray="113.1" stroke-dashoffset="113.1"></circle>
                                </svg>
                                <span class="card-ring-ratio" id="ring-ratio-board-madrasah">0/15</span>
                            </div>
                            <span class="card-ring-pct" id="ring-pct-board-madrasah">0.00% প্রশ্ন পড়া হয়েছে</span>
                        </div>
                    </div>
                </div>`;

bqHtml = bqHtml.replace(/<div class="boards-grid">[\s\S]*?<\/div>\s*<\/section>/, newBoardsGridHtml + '\n            </section>');
fs.writeFileSync(bqPath, bqHtml, 'utf8');
console.log('✓ Successfully updated pages/board-question.html with right-side circular progress cards!');

// =========================================================================
// 3. UPDATE pages/test-paper.html
// =========================================================================
const tpPath = path.join(root, 'pages', 'test-paper.html');
let tpHtml = fs.readFileSync(tpPath, 'utf8');

const newCollegesGridHtml = `
                <div class="colleges-grid">
                    <!-- নটর ডেম কলেজ, ঢাকা -->
                    <div class="college-card" data-college-key="ndc" onclick="openCollegeModal('নটর ডেম কলেজ, ঢাকা')">
                        <div class="card-left-info">
                            <div class="college-icon"><i class="fa-solid fa-landmark"></i></div>
                            <div>
                                <div class="college-title">নটর ডেম কলেজ, ঢাকা</div>
                                <div class="college-location"><i class="fa-solid fa-location-dot"></i> মতিঝিল, ঢাকা</div>
                                <div class="card-counts-badge" id="college-stat-ndc"><i class="fa-regular fa-circle-question"></i> ৩১ MCQ</div>
                            </div>
                        </div>
                        <div class="card-right-progress" id="college-ring-ndc">
                            <div class="card-ring-box">
                                <svg class="card-ring-svg" viewBox="0 0 44 44">
                                    <circle class="card-ring-bg" cx="22" cy="22" r="18"></circle>
                                    <circle class="card-ring-fill" id="ring-fill-college-ndc" cx="22" cy="22" r="18" stroke-dasharray="113.1" stroke-dashoffset="113.1"></circle>
                                </svg>
                                <span class="card-ring-ratio" id="ring-ratio-college-ndc">0/31</span>
                            </div>
                            <span class="card-ring-pct" id="ring-pct-college-ndc">0.00% প্রশ্ন পড়া হয়েছে</span>
                        </div>
                    </div>

                    <!-- ভিকারুননিসা নূন স্কুল অ্যান্ড কলেজ -->
                    <div class="college-card" data-college-key="vnsc" onclick="openCollegeModal('ভিকারুননিসা নূন স্কুল অ্যান্ড কলেজ')">
                        <div class="card-left-info">
                            <div class="college-icon"><i class="fa-solid fa-landmark"></i></div>
                            <div>
                                <div class="college-title">ভিকারুননিসা নূন স্কুল অ্যান্ড কলেজ</div>
                                <div class="college-location"><i class="fa-solid fa-location-dot"></i> বেইলি রোড, ঢাকা</div>
                                <div class="card-counts-badge" id="college-stat-vnsc"><i class="fa-regular fa-circle-question"></i> ২৪ MCQ</div>
                            </div>
                        </div>
                        <div class="card-right-progress" id="college-ring-vnsc">
                            <div class="card-ring-box">
                                <svg class="card-ring-svg" viewBox="0 0 44 44">
                                    <circle class="card-ring-bg" cx="22" cy="22" r="18"></circle>
                                    <circle class="card-ring-fill" id="ring-fill-college-vnsc" cx="22" cy="22" r="18" stroke-dasharray="113.1" stroke-dashoffset="113.1"></circle>
                                </svg>
                                <span class="card-ring-ratio" id="ring-ratio-college-vnsc">0/24</span>
                            </div>
                            <span class="card-ring-pct" id="ring-pct-college-vnsc">0.00% প্রশ্ন পড়া হয়েছে</span>
                        </div>
                    </div>

                    <!-- রাজউক উত্তরা মডেল কলেজ -->
                    <div class="college-card" data-college-key="rajuk" onclick="openCollegeModal('রাজউক উত্তরা মডেল কলেজ')">
                        <div class="card-left-info">
                            <div class="college-icon"><i class="fa-solid fa-landmark"></i></div>
                            <div>
                                <div class="college-title">রাজউক উত্তরা মডেল কলেজ</div>
                                <div class="college-location"><i class="fa-solid fa-location-dot"></i> উত্তরা, ঢাকা</div>
                                <div class="card-counts-badge" id="college-stat-rajuk"><i class="fa-regular fa-circle-question"></i> ২৮ MCQ</div>
                            </div>
                        </div>
                        <div class="card-right-progress" id="college-ring-rajuk">
                            <div class="card-ring-box">
                                <svg class="card-ring-svg" viewBox="0 0 44 44">
                                    <circle class="card-ring-bg" cx="22" cy="22" r="18"></circle>
                                    <circle class="card-ring-fill" id="ring-fill-college-rajuk" cx="22" cy="22" r="18" stroke-dasharray="113.1" stroke-dashoffset="113.1"></circle>
                                </svg>
                                <span class="card-ring-ratio" id="ring-ratio-college-rajuk">0/28</span>
                            </div>
                            <span class="card-ring-pct" id="ring-pct-college-rajuk">0.00% প্রশ্ন পড়া হয়েছে</span>
                        </div>
                    </div>

                    <!-- ঢাকা রেসিডেনসিয়াল মডেল কলেজ -->
                    <div class="college-card" data-college-key="drmc" onclick="openCollegeModal('ঢাকা রেসিডেনসিয়াল মডেল কলেজ')">
                        <div class="card-left-info">
                            <div class="college-icon"><i class="fa-solid fa-landmark"></i></div>
                            <div>
                                <div class="college-title">ঢাকা রেসিডেনসিয়াল মডেল কলেজ</div>
                                <div class="college-location"><i class="fa-solid fa-location-dot"></i> মোহাম্মদপুর, ঢাকা</div>
                                <div class="card-counts-badge" id="college-stat-drmc"><i class="fa-regular fa-circle-question"></i> ২০ MCQ</div>
                            </div>
                        </div>
                        <div class="card-right-progress" id="college-ring-drmc">
                            <div class="card-ring-box">
                                <svg class="card-ring-svg" viewBox="0 0 44 44">
                                    <circle class="card-ring-bg" cx="22" cy="22" r="18"></circle>
                                    <circle class="card-ring-fill" id="ring-fill-college-drmc" cx="22" cy="22" r="18" stroke-dasharray="113.1" stroke-dashoffset="113.1"></circle>
                                </svg>
                                <span class="card-ring-ratio" id="ring-ratio-college-drmc">0/20</span>
                            </div>
                            <span class="card-ring-pct" id="ring-pct-college-drmc">0.00% প্রশ্ন পড়া হয়েছে</span>
                        </div>
                    </div>

                    <!-- ঢাকা সিটি কলেজ -->
                    <div class="college-card" data-college-key="dcc" onclick="openCollegeModal('ঢাকা সিটি কলেজ')">
                        <div class="card-left-info">
                            <div class="college-icon"><i class="fa-solid fa-landmark"></i></div>
                            <div>
                                <div class="college-title">ঢাকা সিটি কলেজ</div>
                                <div class="college-location"><i class="fa-solid fa-location-dot"></i> ধানমন্ডি, ঢাকা</div>
                                <div class="card-counts-badge" id="college-stat-dcc"><i class="fa-regular fa-circle-question"></i> ১৮ MCQ</div>
                            </div>
                        </div>
                        <div class="card-right-progress" id="college-ring-dcc">
                            <div class="card-ring-box">
                                <svg class="card-ring-svg" viewBox="0 0 44 44">
                                    <circle class="card-ring-bg" cx="22" cy="22" r="18"></circle>
                                    <circle class="card-ring-fill" id="ring-fill-college-dcc" cx="22" cy="22" r="18" stroke-dasharray="113.1" stroke-dashoffset="113.1"></circle>
                                </svg>
                                <span class="card-ring-ratio" id="ring-ratio-college-dcc">0/18</span>
                            </div>
                            <span class="card-ring-pct" id="ring-pct-college-dcc">0.00% প্রশ্ন পড়া হয়েছে</span>
                        </div>
                    </div>

                    <!-- চট্টগ্রাম কলেজ, চট্টগ্রাম -->
                    <div class="college-card" data-college-key="ctg" onclick="openCollegeModal('চট্টগ্রাম কলেজ, চট্টগ্রাম')">
                        <div class="card-left-info">
                            <div class="college-icon"><i class="fa-solid fa-landmark"></i></div>
                            <div>
                                <div class="college-title">চট্টগ্রাম কলেজ, চট্টগ্রাম</div>
                                <div class="college-location"><i class="fa-solid fa-location-dot"></i> চকবাজার, চট্টগ্রাম</div>
                                <div class="card-counts-badge" id="college-stat-ctg"><i class="fa-regular fa-circle-question"></i> ১৮ MCQ</div>
                            </div>
                        </div>
                        <div class="card-right-progress" id="college-ring-ctg">
                            <div class="card-ring-box">
                                <svg class="card-ring-svg" viewBox="0 0 44 44">
                                    <circle class="card-ring-bg" cx="22" cy="22" r="18"></circle>
                                    <circle class="card-ring-fill" id="ring-fill-college-ctg" cx="22" cy="22" r="18" stroke-dasharray="113.1" stroke-dashoffset="113.1"></circle>
                                </svg>
                                <span class="card-ring-ratio" id="ring-ratio-college-ctg">0/18</span>
                            </div>
                            <span class="card-ring-pct" id="ring-pct-college-ctg">0.00% প্রশ্ন পড়া হয়েছে</span>
                        </div>
                    </div>

                    <!-- রাজশাহী কলেজ, রাজশাহী -->
                    <div class="college-card" data-college-key="rajshahi" onclick="openCollegeModal('রাজশাহী কলেজ, রাজশাহী')">
                        <div class="card-left-info">
                            <div class="college-icon"><i class="fa-solid fa-landmark"></i></div>
                            <div>
                                <div class="college-title">রাজশাহী কলেজ, রাজশাহী</div>
                                <div class="college-location"><i class="fa-solid fa-location-dot"></i> বোয়ালিয়া, রাজশাহী</div>
                                <div class="card-counts-badge" id="college-stat-rajshahi"><i class="fa-regular fa-circle-question"></i> ১৬ MCQ</div>
                            </div>
                        </div>
                        <div class="card-right-progress" id="college-ring-rajshahi">
                            <div class="card-ring-box">
                                <svg class="card-ring-svg" viewBox="0 0 44 44">
                                    <circle class="card-ring-bg" cx="22" cy="22" r="18"></circle>
                                    <circle class="card-ring-fill" id="ring-fill-college-rajshahi" cx="22" cy="22" r="18" stroke-dasharray="113.1" stroke-dashoffset="113.1"></circle>
                                </svg>
                                <span class="card-ring-ratio" id="ring-ratio-college-rajshahi">0/16</span>
                            </div>
                            <span class="card-ring-pct" id="ring-pct-college-rajshahi">0.00% প্রশ্ন পড়া হয়েছে</span>
                        </div>
                    </div>

                    <!-- ক্যান্টনমেন্ট পাবলিক স্কুল অ্যান্ড কলেজ -->
                    <div class="college-card" data-college-key="cpsc" onclick="openCollegeModal('ক্যান্টনমেন্ট পাবলিক স্কুল অ্যান্ড কলেজ')">
                        <div class="card-left-info">
                            <div class="college-icon"><i class="fa-solid fa-landmark"></i></div>
                            <div>
                                <div class="college-title">ক্যান্টনমেন্ট পাবলিক স্কুল অ্যান্ড কলেজ</div>
                                <div class="college-location"><i class="fa-solid fa-location-dot"></i> রংপুর</div>
                                <div class="card-counts-badge" id="college-stat-cpsc"><i class="fa-regular fa-circle-question"></i> ২২ MCQ</div>
                            </div>
                        </div>
                        <div class="card-right-progress" id="college-ring-cpsc">
                            <div class="card-ring-box">
                                <svg class="card-ring-svg" viewBox="0 0 44 44">
                                    <circle class="card-ring-bg" cx="22" cy="22" r="18"></circle>
                                    <circle class="card-ring-fill" id="ring-fill-college-cpsc" cx="22" cy="22" r="18" stroke-dasharray="113.1" stroke-dashoffset="113.1"></circle>
                                </svg>
                                <span class="card-ring-ratio" id="ring-ratio-college-cpsc">0/22</span>
                            </div>
                            <span class="card-ring-pct" id="ring-pct-college-cpsc">0.00% প্রশ্ন পড়া হয়েছে</span>
                        </div>
                    </div>
                </div>`;

tpHtml = tpHtml.replace(/<div class="colleges-grid">[\s\S]*?<\/div>\s*<\/section>/, newCollegesGridHtml + '\n            </section>');
fs.writeFileSync(tpPath, tpHtml, 'utf8');
console.log('✓ Successfully updated pages/test-paper.html with right-side circular progress cards!');

// =========================================================================
// 4. UPDATE assets/js/api.js with updateAllCardProgressRings
// =========================================================================
const apiJsPath = path.join(root, 'assets', 'js', 'api.js');
let apiJs = fs.readFileSync(apiJsPath, 'utf8');

const progressUpdaterCode = `
// =========================================================================
// DYNAMIC CIRCULAR PROGRESS RING UPDATER FOR CHAPTER, BOARD & COLLEGE CARDS
// =========================================================================
async function updateAllCardProgressRings() {
    try {
        const readSet = getReadQuestionsSet();
        let allMcqs = [];

        if (window._cachedMCQs && Array.isArray(window._cachedMCQs) && window._cachedMCQs.length > 0) {
            allMcqs = window._cachedMCQs;
        } else if (typeof ApiService !== 'undefined' && ApiService.getMCQs) {
            try {
                allMcqs = await ApiService.getMCQs() || [];
                window._cachedMCQs = allMcqs;
            } catch(e){}
        }

        const updateRingUI = (ratioId, pctId, fillId, readCount, totalCount) => {
            const total = Math.max(1, totalCount);
            const read = Math.min(total, readCount);
            const pct = ((read / total) * 100).toFixed(2);

            const ratioEl = document.getElementById(ratioId);
            if (ratioEl) ratioEl.textContent = \`\${read}/\${total}\`;

            const pctEl = document.getElementById(pctId);
            if (pctEl) pctEl.textContent = \`\${pct}% প্রশ্ন পড়া হয়েছে\`;

            const fillEl = document.getElementById(fillId);
            if (fillEl) {
                const circumference = 113.1;
                const offset = circumference * (1 - (read / total));
                fillEl.style.strokeDashoffset = offset;
            }
        };

        // 1. Chapter Rings
        const chapterRings = [
            { id: 1, ratio: 'ring-ratio-ch-1', pct: 'ring-pct-ch-1', fill: 'ring-fill-ch-1', fallbackTotal: 352, match: m => m.chapter && (m.chapter.includes('Chapter 1') || m.chapter.includes('১ম') || m.chapter.includes('তথ্য ও যোগাযোগ')) },
            { id: 2, ratio: 'ring-ratio-ch-2', pct: 'ring-pct-ch-2', fill: 'ring-fill-ch-2', fallbackTotal: 243, match: m => m.chapter && (m.chapter.includes('Chapter 2') || m.chapter.includes('২য়') || m.chapter.includes('কমিউনিকেশন')) },
            { id: '3.1', ratio: 'ring-ratio-ch-3-1', pct: 'ring-pct-ch-3-1', fill: 'ring-fill-ch-3-1', fallbackTotal: 219, match: m => m.chapter && (m.chapter.includes('Chapter 3 (১ম') || m.chapter.includes('সংখ্যা পদ্ধতি')) },
            { id: '3.2', ratio: 'ring-ratio-ch-3-2', pct: 'ring-pct-ch-3-2', fill: 'ring-fill-ch-3-2', fallbackTotal: 283, match: m => m.chapter && (m.chapter.includes('Chapter 3 (২য়') || m.chapter.includes('ডিজিটাল ডিভাইস')) },
            { id: 4, ratio: 'ring-ratio-ch-4', pct: 'ring-pct-ch-4', fill: 'ring-fill-ch-4', fallbackTotal: 204, match: m => m.chapter && (m.chapter.includes('Chapter 4') || m.chapter.includes('৪র্থ') || m.chapter.includes('HTML') || m.chapter.includes('ওয়েব')) },
            { id: 5, ratio: 'ring-ratio-ch-5', pct: 'ring-pct-ch-5', fill: 'ring-fill-ch-5', fallbackTotal: 402, match: m => m.chapter && (m.chapter.includes('Chapter 5') || m.chapter.includes('৫ম') || m.chapter.includes('প্রোগ্রামিং')) },
            { id: 6, ratio: 'ring-ratio-ch-6', pct: 'ring-pct-ch-6', fill: 'ring-fill-ch-6', fallbackTotal: 187, match: m => m.chapter && (m.chapter.includes('Chapter 6') || m.chapter.includes('৬ষ্ঠ') || m.chapter.includes('ডেটাবেজ')) }
        ];

        chapterRings.forEach(ch => {
            const matching = allMcqs.filter(ch.match);
            const total = matching.length > 0 ? matching.length : ch.fallbackTotal;
            const read = matching.filter(m => readSet.has(String(m._id))).length;
            updateRingUI(ch.ratio, ch.pct, ch.fill, read, total);
        });

        // 2. Board Rings
        const boardRings = [
            { key: 'dhaka', ratio: 'ring-ratio-board-dhaka', pct: 'ring-pct-board-dhaka', fill: 'ring-fill-board-dhaka', fallbackTotal: 97 },
            { key: 'rajshahi', ratio: 'ring-ratio-board-rajshahi', pct: 'ring-pct-board-rajshahi', fill: 'ring-fill-board-rajshahi', fallbackTotal: 61 },
            { key: 'chattogram', ratio: 'ring-ratio-board-chattogram', pct: 'ring-pct-board-chattogram', fill: 'ring-fill-board-chattogram', fallbackTotal: 64 },
            { key: 'jashore', ratio: 'ring-ratio-board-jashore', pct: 'ring-pct-board-jashore', fill: 'ring-fill-board-jashore', fallbackTotal: 68 },
            { key: 'comilla', ratio: 'ring-ratio-board-comilla', pct: 'ring-pct-board-comilla', fill: 'ring-fill-board-comilla', fallbackTotal: 62 },
            { key: 'sylhet', ratio: 'ring-ratio-board-sylhet', pct: 'ring-pct-board-sylhet', fill: 'ring-fill-board-sylhet', fallbackTotal: 55 },
            { key: 'barishal', ratio: 'ring-ratio-board-barishal', pct: 'ring-pct-board-barishal', fill: 'ring-fill-board-barishal', fallbackTotal: 63 },
            { key: 'dinajpur', ratio: 'ring-ratio-board-dinajpur', pct: 'ring-pct-board-dinajpur', fill: 'ring-fill-board-dinajpur', fallbackTotal: 59 },
            { key: 'mymensingh', ratio: 'ring-ratio-board-mymensingh', pct: 'ring-pct-board-mymensingh', fill: 'ring-fill-board-mymensingh', fallbackTotal: 27 },
            { key: 'madrasah', ratio: 'ring-ratio-board-madrasah', pct: 'ring-pct-board-madrasah', fill: 'ring-fill-board-madrasah', fallbackTotal: 15 }
        ];

        boardRings.forEach(br => {
            const matching = allMcqs.filter(m => matchBoardName(m.boardName, br.key));
            const total = matching.length > 0 ? matching.length : br.fallbackTotal;
            const read = matching.filter(m => readSet.has(String(m._id))).length;
            updateRingUI(br.ratio, br.pct, br.fill, read, total);
        });

        // 3. College Rings
        const collegeRings = [
            { key: 'ndc', name: 'নটর ডেম', ratio: 'ring-ratio-college-ndc', pct: 'ring-pct-college-ndc', fill: 'ring-fill-college-ndc', fallbackTotal: 31 },
            { key: 'vnsc', name: 'ভিকারুননিসা', ratio: 'ring-ratio-college-vnsc', pct: 'ring-pct-college-vnsc', fill: 'ring-fill-college-vnsc', fallbackTotal: 24 },
            { key: 'rajuk', name: 'রাজউক', ratio: 'ring-ratio-college-rajuk', pct: 'ring-pct-college-rajuk', fill: 'ring-fill-college-rajuk', fallbackTotal: 28 },
            { key: 'drmc', name: 'রেসিডেনসিয়াল', ratio: 'ring-ratio-college-drmc', pct: 'ring-pct-college-drmc', fill: 'ring-fill-college-drmc', fallbackTotal: 20 },
            { key: 'dcc', name: 'সিটি কলেজ', ratio: 'ring-ratio-college-dcc', pct: 'ring-pct-college-dcc', fill: 'ring-fill-college-dcc', fallbackTotal: 18 },
            { key: 'ctg', name: 'চট্টগ্রাম কলেজ', ratio: 'ring-ratio-college-ctg', pct: 'ring-pct-college-ctg', fill: 'ring-fill-college-ctg', fallbackTotal: 18 },
            { key: 'rajshahi', name: 'রাজশাহী কলেজ', ratio: 'ring-ratio-college-rajshahi', pct: 'ring-pct-college-rajshahi', fill: 'ring-fill-college-rajshahi', fallbackTotal: 16 },
            { key: 'cpsc', name: 'ক্যান্টনমেন্ট', ratio: 'ring-ratio-college-cpsc', pct: 'ring-pct-college-cpsc', fill: 'ring-fill-college-cpsc', fallbackTotal: 22 }
        ];

        collegeRings.forEach(cr => {
            const matching = allMcqs.filter(m => matchCollegeName(m.collegeName, cr.name));
            const total = matching.length > 0 ? matching.length : cr.fallbackTotal;
            const read = matching.filter(m => readSet.has(String(m._id))).length;
            updateRingUI(cr.ratio, cr.pct, cr.fill, read, total);
        });

    } catch(err) {
        console.warn('updateAllCardProgressRings error:', err);
    }
}
window.updateAllCardProgressRings = updateAllCardProgressRings;

// Trigger updates on DOMContentLoaded & load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateAllCardProgressRings);
} else {
    setTimeout(updateAllCardProgressRings, 100);
}
`;

if (!apiJs.includes('function updateAllCardProgressRings')) {
    apiJs += '\n' + progressUpdaterCode;
}

// Make sure toggleQuestionRead calls updateAllCardProgressRings()
if (!apiJs.includes('updateAllCardProgressRings();')) {
    apiJs = apiJs.replace(
        'updateActiveCircularChart();',
        'updateActiveCircularChart();\n    updateAllCardProgressRings();'
    );
}

// Ensure label inside MCQ card is strictly static 'পড়া হয়েছে'
apiJs = apiJs.replace(
    /\$\{isRead \? 'পড়া সম্পন্ন' : 'পড়া হয়েছে'\}/g,
    'পড়া হয়েছে'
);

fs.writeFileSync(apiJsPath, apiJs, 'utf8');
console.log('✓ Successfully enhanced assets/js/api.js with dynamic circular progress rings & static label!');

console.log('--- ALL CODE EDITS COMPLETE ---');
