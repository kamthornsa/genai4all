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

// Copy prompt function is now handled by individual pages

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
