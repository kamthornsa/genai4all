// Main application JavaScript
class CourseApp {
    constructor() {
        this.currentSection = 'intro';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadContent('intro');
        this.updateTitle('หน้าแรก');
    }

    setupEventListeners() {
        // Mobile menu toggle
        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');

        if (menuToggle && sidebar) {
            menuToggle.addEventListener('click', () => {
                sidebar.classList.toggle('sidebar-active');
                overlay.classList.toggle('hidden');
            });
        }

        // Close sidebar when clicking overlay
        if (overlay) {
            overlay.addEventListener('click', () => {
                sidebar.classList.remove('sidebar-active');
                overlay.classList.add('hidden');
            });
        }

        // Menu item click handlers
        document.querySelectorAll('.menu-item[data-content]').forEach(menuItem => {
            menuItem.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionId = menuItem.getAttribute('data-content');
                this.loadContent(sectionId);
                this.updateTitle(this.getTitleForSection(sectionId));
            });
        });
    }

    async loadContent(sectionId) {
        try {
            const contentContainer = document.getElementById('content-container');
            const fileName = this.getSectionFileName(sectionId);

            // Show loading state
            contentContainer.innerHTML = '<div class="flex justify-center items-center py-20"><i class="fas fa-spinner fa-spin text-3xl text-gray-400"></i></div>';

            const response = await fetch(`pages/${fileName}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const content = await response.text();

            // Update content with fade effect
            contentContainer.classList.remove('fade-in');
            contentContainer.innerHTML = content;

            // Trigger fade in animation
            setTimeout(() => {
                contentContainer.classList.add('fade-in');
            }, 10);

            // Update current section
            this.currentSection = sectionId;

            // Update menu active state
            this.updateMenuActiveState(sectionId);

            // Close mobile menu
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('overlay');
            sidebar.classList.remove('sidebar-active');
            overlay.classList.add('hidden');

        } catch (error) {
            console.error('Error loading content:', error);
            document.getElementById('content-container').innerHTML = `
                <div class="text-center py-20">
                    <i class="fas fa-exclamation-triangle text-4xl text-red-400 mb-4"></i>
                    <h3 class="text-xl font-semibold text-gray-800 mb-2">เกิดข้อผิดพลาด</h3>
                    <p class="text-gray-600">ไม่สามารถโหลดเนื้อหาได้ กรุณาลองใหม่อีกครั้ง</p>
                    <button onclick="window.courseApp.loadContent('${sectionId}')" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        ลองใหม่
                    </button>
                </div>
            `;
        }
    }

    getSectionFileName(sectionId) {
        const fileMap = {
            'intro': 'intro.html',
            'ai-basics': 'ai-basics.html',
            'ai-tools': 'ai-tools.html',
            'prompt-engineering': 'prompt-engineering.html',
            'personal-development': 'personal-development.html',
            'personal-finance': 'personal-finance.html',
            'government': 'government.html',
            'marketing': 'marketing.html',
            'email-communication': 'email-communication.html',
            'data-analysis': 'data-analysis.html',
            'media-creation': 'media-creation.html',
            'canva-ai': 'canva-ai.html'
        };

        return fileMap[sectionId] || 'intro.html';
    }

    updateMenuActiveState(activeId) {
        // Reset all menu items
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('bg-gradient-to-r', 'from-blue-500', 'to-purple-600', 'text-white', 'active-menu');
            item.classList.add('hover:bg-gray-100');
        });

        // Set active menu item
        const activeMenuItem = document.querySelector(`[data-content="${activeId}"]`);
        if (activeMenuItem) {
            activeMenuItem.classList.add('bg-gradient-to-r', 'from-blue-500', 'to-purple-600', 'text-white', 'active-menu');
            activeMenuItem.classList.remove('hover:bg-gray-100');
        }
    }

    getTitleForSection(sectionId) {
        const titleMap = {
            'intro': 'หน้าแรก',
            'ai-basics': 'รู้จัก AI เบื้องต้น',
            'ai-tools': 'เครื่องมือ Generative AI',
            'prompt-engineering': 'Prompt Engineering',
            'personal-development': 'Prompt สำหรับพัฒนาตนเอง',
            'personal-finance': 'Prompt สำหรับการเงินส่วนบุคคล',
            'government': 'Prompt สำหรับภาครัฐ',
            'marketing': 'Prompt สำหรับการตลาด',
            'email-communication': 'Prompt สำหรับอีเมล์',
            'data-analysis': 'Prompt สำหรับวิเคราะห์ข้อมูล',
            'media-creation': 'Prompt สำหรับสร้างรูปภาพ',
            'canva-ai': 'Canva AI สำหรับสื่อ'
        };

        return titleMap[sectionId] || 'หน้าแรก';
    }

    updateTitle(title) {
        const mobileTitle = document.getElementById('currentTitle');
        const desktopTitle = document.getElementById('currentTitleDesktop');

        if (mobileTitle) mobileTitle.textContent = title;
        if (desktopTitle) desktopTitle.textContent = title;
    }
}

// Global copy prompt function
function copyPrompt(promptId, event) {
    console.log('Copy function called for:', promptId);

    const promptElement = document.getElementById(promptId);
    if (!promptElement) {
        console.error('Element not found:', promptId);
        alert('ไม่พบ Prompt ที่ต้องการคัดลอก');
        return;
    }

    const promptText = promptElement.textContent || promptElement.innerText;
    console.log('Text to copy:', promptText.substring(0, 50) + '...');

    // Get button reference from event
    let button = undefined;
    if (event && event.target) {
        button = event.target.closest('button');
    }
    console.log('Button found:', !!button);

    // Method 1: Simple textarea approach (most reliable)
    const textarea = document.createElement('textarea');
    textarea.value = promptText;

    // Position off-screen but visible (some browsers need this)
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    textarea.style.top = '0';

    document.body.appendChild(textarea);

    try {
        // Select the text
        textarea.select();
        textarea.setSelectionRange(0, 99999); // For mobile devices

        // Try to copy
        const successful = document.execCommand('copy');
        console.log('Copy successful:', successful);

        if (successful) {
            showCopySuccess(button);
        } else {
            console.log('execCommand failed, trying clipboard API');
            tryClipboardAPI(promptText, button);
        }
    } catch (err) {
        console.error('execCommand error:', err);
        tryClipboardAPI(promptText, button);
    } finally {
        // Always clean up
        document.body.removeChild(textarea);
    }
}

// Try modern clipboard API
async function tryClipboardAPI(text, button) {
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
            console.log('Clipboard API successful');
            showCopySuccess(button);
            return;
        }
    } catch (err) {
        console.error('Clipboard API failed:', err);
    }

    // If all else fails, show manual copy
    console.log('All methods failed, showing manual dialog');
    showManualCopy(text);
}

// Show success feedback
function showCopySuccess(button) {
    if (!button) {
        console.log('No button for feedback, but copy was successful');
        return;
    }

    const originalHTML = button.innerHTML;
    const originalClasses = Array.from(button.classList);

    // Change to success state
    button.innerHTML = '<i class="fas fa-check mr-2"></i>คัดลอกแล้ว!';
    button.classList.remove('bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-orange-600', 'bg-pink-600', 'bg-teal-600');
    button.classList.remove('hover:bg-blue-700', 'hover:bg-green-700', 'hover:bg-purple-700', 'hover:bg-orange-700', 'hover:bg-pink-700', 'hover:bg-teal-700');
    button.classList.add('bg-green-600', 'hover:bg-green-700');

    // Restore after 2 seconds
    setTimeout(() => {
        button.innerHTML = originalHTML;
        button.className = originalClasses.join(' ');
    }, 2000);
}

// Simple manual copy dialog
function showManualCopy(text) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    `;

    modal.innerHTML = `
        <div style="background: white; padding: 20px; border-radius: 10px; max-width: 90%; max-height: 80%; overflow: auto;">
            <h3 style="margin: 0 0 15px 0; color: #333;">คัดลอก Prompt ด้วยตนเอง</h3>
            <p style="margin: 0 0 15px 0; color: #666; font-size: 14px;">
                1. คลิกในกล่องข้อความด้านล่าง<br>
                2. กด Ctrl+A เลือกทั้งหมด (หรือ Cmd+A บน Mac)<br>
                3. กด Ctrl+C คัดลอก (หรือ Cmd+C บน Mac)
            </p>
            <textarea readonly style="width: 100%; height: 200px; padding: 10px; border: 1px solid #ccc; border-radius: 5px; font-family: monospace; font-size: 12px;" onclick="this.select()">${text}</textarea>
            <div style="margin-top: 15px; text-align: right;">
                <button onclick="this.closest('div[style*=\"position: fixed\"]').remove()" style="padding: 8px 16px; background: #666; color: white; border: none; border-radius: 5px; cursor: pointer;">ปิด</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Auto-select after a moment
    setTimeout(() => {
        const textarea = modal.querySelector('textarea');
        if (textarea) {
            textarea.focus();
            textarea.select();
        }
    }, 100);

    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.courseApp = new CourseApp();
});

// Handle responsive sidebar
window.addEventListener('resize', function() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    if (window.innerWidth >= 1024) {
        sidebar.classList.remove('sidebar-active');
        overlay.classList.add('hidden');
    }
});
