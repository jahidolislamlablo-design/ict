const fs = require('fs');
const path = require('path');

const compilerFile = path.join(__dirname, '..', 'pages', 'compiler.html');
const original = fs.readFileSync(compilerFile, 'utf8');

// Extract the JS functions from line 568 to end of script
const scriptStartIdx = original.indexOf('<script>');
const scriptEndIdx = original.lastIndexOf('</script>');
const originalScript = original.slice(scriptStartIdx + 8, scriptEndIdx);

const newCompilerHtml = `<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>এইচএসসি আইসিটি অনলাইন কম্পাইলার - ICT Easy Learning</title>
    <!-- FontAwesome & Fonts -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <!-- Stylesheets -->
    <link rel="stylesheet" href="../assets/css/style.css?v=3.0">
    <style>
        /* Unified Single-Screen Compiler Styles */
        .unified-compiler-card {
            background: #FFFFFF;
            border: 1.5px solid var(--border-color);
            border-radius: var(--radius-xl);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            box-shadow: var(--shadow-sm);
            margin-bottom: 40px;
            width: 100% !important;
            max-width: 100% !important;
        }

        .compiler-main-toolbar {
            background: #F8FAFC;
            border-bottom: 1.5px solid #E2E8F0;
            padding: 12px 18px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 12px;
        }

        .lang-pills {
            display: flex;
            background: #E2E8F0;
            padding: 3px;
            border-radius: 9999px;
            gap: 3px;
        }

        .lang-pill-btn {
            border: none;
            background: transparent;
            padding: 6px 14px;
            border-radius: 9999px;
            font-size: 0.82rem;
            font-weight: 700;
            color: #475569;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .lang-pill-btn.active {
            background: #FFFFFF;
            color: #4F46E5;
            box-shadow: 0 2px 6px rgba(0,0,0,0.08);
        }

        /* Screen Toggle Pills (Code / Output) */
        .screen-toggle-pills {
            display: flex;
            background: #E0E7FF;
            padding: 4px;
            border-radius: 9999px;
            gap: 4px;
            border: 1.5px solid #C7D2FE;
        }

        .screen-toggle-btn {
            border: none;
            background: transparent;
            padding: 6px 18px;
            border-radius: 9999px;
            font-size: 0.88rem;
            font-weight: 800;
            color: #4338CA;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .screen-toggle-btn.active {
            background: #4F46E5;
            color: #FFFFFF;
            box-shadow: 0 3px 10px rgba(79, 70, 229, 0.35);
        }

        .toolbar-actions {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;
        }

        .btn-run {
            background: linear-gradient(135deg, #10B981 0%, #059669 100%);
            color: #FFFFFF;
            border: none;
            padding: 8px 18px;
            border-radius: 9999px;
            font-size: 0.90rem;
            font-weight: 700;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
            transition: all 0.2s ease;
        }

        .btn-run:hover {
            transform: translateY(-1px);
            box-shadow: 0 6px 16px rgba(16, 185, 129, 0.35);
        }

        .btn-save-code {
            background: #EEF2FF;
            color: #4F46E5;
            border: 1.5px solid #C7D2FE;
            padding: 8px 14px;
            border-radius: 9999px;
            font-size: 0.85rem;
            font-weight: 700;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            transition: all 0.2s ease;
        }

        .btn-save-code:hover {
            background: #E0E7FF;
            border-color: #818CF8;
        }

        .btn-my-codes {
            background: #F1F5F9;
            color: #334155;
            border: 1.5px solid #CBD5E1;
            padding: 8px 14px;
            border-radius: 9999px;
            font-size: 0.85rem;
            font-weight: 700;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            transition: all 0.2s ease;
        }

        .btn-my-codes:hover {
            background: #E2E8F0;
        }

        .template-select {
            padding: 6px 12px;
            border-radius: 8px;
            border: 1.5px solid #CBD5E1;
            background: #FFFFFF;
            font-size: 0.82rem;
            font-weight: 600;
            color: #334155;
            cursor: pointer;
            outline: none;
        }

        /* Single Unified Screen Container */
        .compiler-screen-container {
            position: relative;
            width: 100%;
            min-height: 520px;
            background: #1E293B;
            display: flex;
            flex-direction: column;
        }

        .compiler-view-panel {
            width: 100%;
            min-height: 520px;
            display: flex;
            flex-direction: column;
            flex: 1;
        }

        .editor-wrapper {
            position: relative;
            flex: 1;
            display: flex;
            background: #1E293B;
            min-height: 460px;
        }

        .line-numbers {
            width: 48px;
            background: #0F172A;
            color: #64748B;
            padding: 16px 8px 16px 0;
            text-align: right;
            font-family: Consolas, 'Courier New', monospace;
            font-size: 0.92rem;
            line-height: 1.6;
            user-select: none;
            border-right: 1px solid #334155;
            overflow: hidden;
            box-sizing: border-box;
        }

        .code-textarea {
            flex: 1;
            background: #1E293B;
            color: #F8FAFC;
            border: none;
            padding: 16px 18px;
            font-family: Consolas, 'Courier New', monospace;
            font-size: 0.95rem;
            line-height: 1.6;
            resize: none;
            outline: none;
            white-space: pre;
            overflow-wrap: normal;
            overflow-x: auto;
            tab-size: 4;
            box-sizing: border-box;
            min-height: 460px;
        }

        .stdin-box-wrapper {
            background: #0F172A;
            border-top: 1px solid #334155;
            padding: 12px 18px;
        }

        .stdin-header {
            font-size: 0.80rem;
            font-weight: 700;
            color: #94A3B8;
            margin-bottom: 6px;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .stdin-input {
            width: 100%;
            background: #1E293B;
            border: 1px solid #334155;
            border-radius: 6px;
            color: #38BDF8;
            padding: 8px 12px;
            font-family: Consolas, monospace;
            font-size: 0.88rem;
            box-sizing: border-box;
            outline: none;
        }

        /* Output View Styles */
        .output-inner-toolbar {
            background: #0F172A;
            border-bottom: 1px solid #334155;
            padding: 10px 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .output-inner-tabs {
            display: flex;
            gap: 8px;
        }

        .out-tab-btn {
            border: none;
            background: transparent;
            font-size: 0.85rem;
            font-weight: 700;
            color: #94A3B8;
            padding: 6px 12px;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .out-tab-btn.active {
            background: #334155;
            color: #38BDF8;
        }

        .console-screen {
            flex: 1;
            background: #090D16;
            color: #F1F5F9;
            padding: 20px;
            font-family: Consolas, 'Courier New', monospace;
            font-size: 0.94rem;
            line-height: 1.6;
            overflow-y: auto;
            min-height: 450px;
            white-space: pre-wrap;
            word-break: break-word;
        }

        .preview-iframe {
            flex: 1;
            width: 100%;
            height: 100%;
            min-height: 480px;
            border: none;
            background: #FFFFFF;
        }

        .console-status-bar {
            background: #0F172A;
            border-top: 1px solid #334155;
            padding: 10px 18px;
            font-size: 0.80rem;
            font-weight: 600;
            color: #94A3B8;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        /* Saved Codes Modal */
        .saved-code-item {
            border: 1.5px solid #E2E8F0;
            border-radius: 12px;
            padding: 14px 16px;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            transition: all 0.2s ease;
            background: #FFFFFF;
        }

        .saved-code-item:hover {
            border-color: #4F46E5;
            box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        }

        .saved-code-info h4 {
            font-size: 1rem;
            font-weight: 700;
            margin-bottom: 4px;
            color: #1E293B;
        }

        .saved-code-info span {
            font-size: 0.78rem;
            color: #64748B;
        }

        .saved-code-actions {
            display: flex;
            gap: 8px;
        }

        @media (max-width: 768px) {
            .compiler-main-toolbar {
                padding: 10px 12px;
                gap: 8px;
            }
            .screen-toggle-btn {
                padding: 5px 12px;
                font-size: 0.80rem;
            }
            .lang-pill-btn {
                padding: 5px 10px;
                font-size: 0.78rem;
            }
            .editor-wrapper, .code-textarea, .console-screen, .preview-iframe {
                min-height: 380px;
            }
            .compiler-screen-container {
                min-height: 380px;
            }
        }
    </style>
</head>
<body>

    <!-- হেডার ও নেভিগেশন বার -->
    <header class="site-header">
        <div class="header-container">
            <div class="header-brand-group">
                <button class="nav-back-btn desktop-back-btn" onclick="window.location.href='../index.html'" title="ফিরে যান">
                    <i class="fa-solid fa-arrow-left"></i>
                    <span>হোমে ফিরে যান</span>
                </button>
                <a href="../index.html" class="brand-link">
                    <img src="../assets/images/icon.png" alt="ICT Easy Learning" class="brand-logo-img">
                    <div class="brand-icon">
                        <i class="fa-solid fa-graduation-cap"></i>
                    </div>
                    <div class="brand-text">
                        <span class="brand-title">ICT EASY LEARNING</span>
                        <span class="brand-subtitle">এইচএসসি আইসিটি প্রস্তুতি</span>
                    </div>
                </a>
            </div>

            <div class="header-nav-wrapper">
                <button class="nav-back-btn mobile-nav-back-btn" onclick="window.location.href='../index.html'" title="ফিরে যান">
                    <i class="fa-solid fa-arrow-left"></i>
                </button>
                <ul class="desktop-nav">
                    <li><a href="../index.html"><i class="fa-solid fa-house"></i> প্র্যাকটিস</a></li>
                    <li><a href="board-question.html"><i class="fa-solid fa-building-columns"></i> বোর্ড প্রশ্ন</a></li>
                    <li><a href="test-paper.html"><i class="fa-solid fa-book-open"></i> টেস্ট পেপার</a></li>
                    <li><a href="chapter-prep.html"><i class="fa-solid fa-layer-group"></i> অধ্যায়ভিত্তিক</a></li>
                    <li><a href="model-test.html"><i class="fa-solid fa-stopwatch"></i> মডেল টেস্ট</a></li>
                    <li><a href="pdf-suggestion.html"><i class="fa-solid fa-file-pdf"></i> সাজেশন</a></li>
                </ul>
            </div>

            <div class="header-actions">
                <a href="profile.html" class="header-user-btn" title="প্রোফাইল">
                    <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80" alt="ইউজার প্রোফাইল">
                    <span class="header-user-name">তানভীর</span>
                </a>
            </div>
        </div>
    </header>

    <!-- মূল কনটেন্ট -->
    <main class="main-content">
        <div class="container">

            <!-- ব্রেডক্রাম্ব বার -->
            <div class="breadcrumb-bar">
                <div class="breadcrumbs">
                    <a href="../index.html"><i class="fa-solid fa-house"></i> হোম</a>
                    <i class="fa-solid fa-chevron-right" style="font-size: 0.75rem;"></i>
                    <span class="current">অনলাইন কোড কম্পাইলার</span>
                </div>
            </div>

            <!-- ব্যানার -->
            <div class="page-header-banner" style="background: linear-gradient(135deg, #059669 0%, #10B981 100%);">
                <div class="page-header-text">
                    <h1>এইচএসসি আইসিটি অনলাইন কোড কম্পাইলার</h1>
                    <p>এইচটিএমএল (HTML), সিএসএস (CSS), জাভাস্ক্রিপ্ট (JavaScript), পাইথন (Python) এবং সি প্রোগ্রাম (C Program) লিখে সরাসরি রান করুন ও কোড সংরক্ষণ করুন।</p>
                </div>
            </div>

            <!-- মূল একক স্ক্রিন কম্পাইলার (Single-Screen Editor & Output Toggle) -->
            <div class="unified-compiler-card">

                <!-- মূল কম্পাইলার টুলবার -->
                <div class="compiler-main-toolbar">
                    <!-- ১. ল্যাঙ্গুয়েজ পিলস -->
                    <div class="lang-pills">
                        <button type="button" class="lang-pill-btn active" id="pill-c" onclick="switchLanguage('c')">
                            <i class="fa-solid fa-c"></i> C Program
                        </button>
                        <button type="button" class="lang-pill-btn" id="pill-python" onclick="switchLanguage('python')">
                            <i class="fa-brands fa-python"></i> Python
                        </button>
                        <button type="button" class="lang-pill-btn" id="pill-html" onclick="switchLanguage('html')">
                            <i class="fa-brands fa-html5"></i> HTML/CSS/JS
                        </button>
                    </div>

                    <!-- ২. Code ও Output স্ক্রিন টগল বাটন (User Specified) -->
                    <div class="screen-toggle-pills">
                        <button type="button" class="screen-toggle-btn active" id="btn-toggle-code" onclick="toggleCompilerScreen('code')">
                            <i class="fa-solid fa-code"></i> Code
                        </button>
                        <button type="button" class="screen-toggle-btn" id="btn-toggle-output" onclick="toggleCompilerScreen('output')">
                            <i class="fa-solid fa-terminal"></i> Output
                        </button>
                    </div>

                    <!-- ৩. অ্যাকশন বাটনস -->
                    <div class="toolbar-actions">
                        <select class="template-select" id="templateSelect" onchange="loadTemplate(this.value)">
                            <option value="">-- নমুনা কোড নির্বাচন --</option>
                        </select>

                        <button type="button" class="btn-run" onclick="runCode()">
                            <i class="fa-solid fa-play"></i> রান করুন
                        </button>

                        <button type="button" class="btn-save-code" onclick="openSaveModal()">
                            <i class="fa-solid fa-floppy-disk"></i> সংরক্ষণ
                        </button>

                        <button type="button" class="btn-my-codes" onclick="openSavedCodesModal()">
                            <i class="fa-solid fa-folder-open"></i> আমার কোড
                        </button>
                    </div>
                </div>

                <!-- একক স্ক্রিন এরিয়া (Single Screen Container) -->
                <div class="compiler-screen-container">

                    <!-- স্ক্রিন ১: কোড এডিটর ভিউ (Code Tab) -->
                    <div class="compiler-view-panel" id="view-code">
                        <div class="editor-wrapper">
                            <div class="line-numbers" id="lineNumbers">1</div>
                            <textarea class="code-textarea" id="codeEditor" spellcheck="false" autocorrect="off" autocapitalize="off"></textarea>
                        </div>

                        <!-- ইনপুট (STDIN) বক্স -->
                        <div class="stdin-box-wrapper" id="stdinWrapper">
                            <div class="stdin-header">
                                <i class="fa-solid fa-keyboard"></i> ইনপুট মান (STDIN - scanf / input এর জন্য, স্পেস বা নতুন লাইনে লিখুন):
                            </div>
                            <input type="text" class="stdin-input" id="stdinInput" placeholder="যেমন: 5 10 অথবা 25">
                        </div>
                    </div>

                    <!-- স্ক্রিন ২: আউটপুট ভিউ (Output Tab) -->
                    <div class="compiler-view-panel" id="view-output" style="display: none;">
                        <div class="output-inner-toolbar">
                            <div class="output-inner-tabs">
                                <button type="button" class="out-tab-btn active" id="tab-btn-console" onclick="switchOutputTab('console')">
                                    <i class="fa-solid fa-terminal"></i> কনসোল আউটপুট
                                </button>
                                <button type="button" class="out-tab-btn" id="tab-btn-preview" onclick="switchOutputTab('preview')" style="display: none;">
                                    <i class="fa-solid fa-globe"></i> লাইভ ওয়েব প্রিভিউ
                                </button>
                            </div>
                            <button type="button" class="btn btn-outline btn-sm" onclick="clearConsole()" style="padding: 4px 10px; font-size: 0.78rem; color: #E2E8F0; border-color: #475569;">
                                <i class="fa-solid fa-trash-can"></i> ক্লিয়ার
                            </button>
                        </div>

                        <!-- টার্মিনাল কনসোল স্ক্রিন -->
                        <div class="console-screen" id="consoleScreen">কম্পাইলার প্রস্তুত। কোড লিখে "রান করুন" বাটনে ক্লিক করুন...</div>

                        <!-- ওয়েব প্রিভিউ আইফ্রেম (HTML/CSS/JS এর জন্য) -->
                        <iframe class="preview-iframe" id="previewIframe" sandbox="allow-scripts" style="display: none;"></iframe>

                        <!-- স্ট্যাটাস বার -->
                        <div class="console-status-bar">
                            <span id="execStatus">স্ট্যাটাস: রেডি</span>
                            <span id="execTime">সময়: ০ ms</span>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    </main>

    <!-- সেভ প্রোগ্রাম মডাল -->
    <div id="saveCodeModal" class="modal-overlay" onclick="if(event.target === this) closeSaveModal()">
        <div class="bottom-sheet" style="max-width: 440px;">
            <div class="sheet-handle"></div>
            <h3 class="sheet-title">প্রোগ্রাম সংরক্ষণ করুন</h3>
            
            <div style="margin-bottom: 16px;">
                <label style="display: block; font-size: 0.88rem; font-weight: 700; color: #1E293B; margin-bottom: 6px;">প্রোগ্রামের শিরোনাম / নাম:</label>
                <input type="text" id="saveTitleInput" class="form-control" placeholder="যেমন: দুটি সংখ্যার যোগফল" style="width: 100%; padding: 10px 14px; border-radius: 8px; border: 1.5px solid #CBD5E1; box-sizing: border-box; font-size: 0.95rem;">
            </div>

            <div style="display: flex; gap: 10px; justify-content: flex-end;">
                <button type="button" class="btn btn-outline" onclick="closeSaveModal()">বাতিল</button>
                <button type="button" class="btn btn-primary" onclick="confirmSaveCode()">
                    <i class="fa-solid fa-floppy-disk"></i> সংরক্ষণ করুন
                </button>
            </div>
        </div>
    </div>

    <!-- আমার সংরক্ষিত কোডসমূহ মডাল -->
    <div id="myCodesModal" class="modal-overlay" onclick="if(event.target === this) closeSavedCodesModal()">
        <div class="bottom-sheet" style="max-width: 580px; max-height: 85vh; display: flex; flex-direction: column;">
            <div class="sheet-handle"></div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <h3 class="sheet-title" style="margin: 0;">আমার সংরক্ষিত প্রোগ্রামসমূহ</h3>
                <span class="badge badge-primary" id="savedCodesCountBadge">০টি</span>
            </div>
            
            <div id="savedCodesListContainer" style="flex: 1; overflow-y: auto; padding-right: 4px; min-height: 200px;">
                <!-- সংরক্ষিত কোডের তালিকা লোড হবে -->
            </div>

            <div style="margin-top: 16px; text-align: center;">
                <button class="btn btn-outline btn-sm" onclick="closeSavedCodesModal()">বন্ধ করুন</button>
            </div>
        </div>
    </div>

    <!-- প্ল্যাটফর্ম ফুটার -->
    <footer class="site-footer">
        <div class="footer-container">
            <div>
                <strong style="color: var(--primary);">ICT EASY LEARNING</strong> &copy; ২০২৬ । সর্বস্বত্ব সংরক্ষিত।
            </div>
            <div class="footer-links">
                <a href="board-question.html">বোর্ড প্রশ্ন</a>
                <a href="test-paper.html">টেস্ট পেপার</a>
                <a href="chapter-prep.html">অধ্যায়ভিত্তিক</a>
                <a href="model-test.html">মডেল টেস্ট</a>
                <a href="favorite-question.html">ফেভারিট প্রশ্ন</a>
                <a href="compiler.html">কোড কম্পাইলার</a>
            </div>
        </div>
    </footer>

    <!-- মোবাইল বটম নেভিগেশন বার -->
    <nav class="bottom-nav">
        <a href="../index.html" class="nav-item">
            <i class="fa-solid fa-house"></i>
            <span>প্র্যাকটিস</span>
        </a>
        <a href="model-test.html" class="nav-item">
            <i class="fa-solid fa-stopwatch"></i>
            <span>মডেল টেস্ট</span>
        </a>
        <a href="pdf-suggestion.html" class="nav-item">
            <i class="fa-solid fa-file-pdf"></i>
            <span>সাজেশন</span>
        </a>
        <a href="profile.html" class="nav-item">
            <i class="fa-solid fa-user"></i>
            <span>প্রোফাইল</span>
        </a>
    </nav>

    <!-- স্ক্রিপ্টস -->
    <script src="../assets/js/api.js?v=3.0"></script>
    <script src="../assets/js/main.js?v=3.0"></script>
    <script>
` + originalScript + `

        // Code / Output Screen Toggle Implementation
        function toggleCompilerScreen(view) {
            const codePanel = document.getElementById('view-code');
            const outputPanel = document.getElementById('view-output');
            const btnCode = document.getElementById('btn-toggle-code');
            const btnOutput = document.getElementById('btn-toggle-output');

            if (view === 'code') {
                if (codePanel) codePanel.style.display = 'flex';
                if (outputPanel) outputPanel.style.display = 'none';
                if (btnCode) btnCode.classList.add('active');
                if (btnOutput) btnOutput.classList.remove('active');
                updateLineNumbers();
                if (editor) editor.focus();
            } else {
                if (codePanel) codePanel.style.display = 'none';
                if (outputPanel) outputPanel.style.display = 'flex';
                if (btnCode) btnCode.classList.remove('active');
                if (btnOutput) btnOutput.classList.add('active');
            }
        }

        // Hook into runCode to automatically toggle to Output screen
        const _origRunCode = window.runCode;
        window.runCode = async function() {
            // First switch to output tab so user immediately sees execution
            toggleCompilerScreen('output');
            if (typeof _origRunCode === 'function') {
                await _origRunCode();
            }
        };
    </script>
</body>
</html>`;

fs.writeFileSync(compilerFile, newCompilerHtml, 'utf8');
console.log('Successfully redesigned compiler.html to unified single screen with Code & Output toggles!');
