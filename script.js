document.addEventListener("DOMContentLoaded", function () {
    const pages = [
        { url: "/", title: "Home" },
        { url: "/news.html", title: "News" },
        { url: "/replacement.html", title: "Card Replacement" },
        { url: "/retirement.html", title: "Retirement Planning" },
        { url: "/medicare.html", title: "Medicare Basics" },
        { url: "/disability.html", title: "Disability Guide" },
        { url: "/survivor.html", title: "Survivor Benefits Guide" },
        { url: "/tax.html", title: "Tax Basics" },
        { url: "/medicaid.html", title: "Medicaid Info" },
        { url: "/housing.html", title: "Housing Assistance" },
        { url: "/faq.html", title: "FAQ" },
        { url: "/fraud.html", title: "Fraud Protection" },
        { url: "/ssi.html", title: "Supplemental Security Income" },
        { url: "/shelter.html", title: "Shelter" },
        { url: "/shelter-locations.html", title: "Shelter Locations" },
        { url: "/about.html", title: "About Us" },
        { url: "/calculator.html", title: "Benefits Calculator" }
    ];

    // Navigation Toggle
    const toggleBtn = document.querySelector('.nav-toggle');
    const navList = document.querySelector('.nav-list');
    if (toggleBtn && navList) {
        toggleBtn.addEventListener('click', () => {
            navList.classList.toggle('open');
            toggleBtn.innerHTML = navList.classList.contains('open') ? '<i class="fas fa-times"></i> Close' : '<i class="fas fa-bars"></i> Menu';
        });
    }

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navGrid = document.querySelector('.nav-grid');
    if (menuToggle && navGrid) {
        menuToggle.addEventListener('click', () => {
            navGrid.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }

    // Site Search
    const siteSearch = document.getElementById("site-search");
    if (siteSearch) {
        siteSearch.addEventListener("keypress", function (e) {
            if (e.key === "Enter") {
                const searchTerm = this.value.toLowerCase();
                let results = pages.filter(page => page.title.toLowerCase().includes(searchTerm))
                    .map(page => `<p><a href="${page.url}">${page.title}</a></p>`).join('');
                alert(results ? "Found:\n" + results.replace(/<[^>]+>/g, "") : "No matches found.");
            }
        });
    }

    // Dark Mode Toggle
    const darkModeToggle = document.getElementById("dark-mode-toggle");
    if (darkModeToggle) {
        darkModeToggle.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");
            localStorage.setItem("darkMode", document.body.classList.contains("dark-mode") ? "enabled" : "disabled");
        });
        if (localStorage.getItem("darkMode") === "enabled") document.body.classList.add("dark-mode");
    }

    // Chatbot Functionality
    const chatbotToggle = document.getElementById("chatbot-toggle");
    const chatbotContainer = document.getElementById("chatbot");
    const chatbotClose = document.getElementById("chatbot-close");
    const chatbotInput = document.getElementById("chatbot-input");
    const chatbotSend = document.getElementById("chatbot-send");
    const chatbotSave = document.getElementById("chatbot-save");
    const chatbotReset = document.getElementById("chatbot-reset");
    const chatbotMessages = document.getElementById("chatbot-messages");
    const suggestedQuestions = document.getElementById("suggested-questions");

    if (chatbotToggle && chatbotContainer && chatbotClose && chatbotInput && chatbotSend && chatbotMessages && suggestedQuestions) {
        showWelcomeMessage();
        loadChatHistory();

        chatbotToggle.addEventListener("click", () => {
            chatbotContainer.classList.add("active");
            chatbotToggle.style.display = "none";
        });

        chatbotClose.addEventListener("click", () => {
            chatbotContainer.classList.remove("active");
            setTimeout(() => chatbotToggle.style.display = "block", 300);
        });

        chatbotSend.addEventListener("click", sendMessage);
        chatbotInput.addEventListener("keypress", (e) => { if (e.key === "Enter") sendMessage(); });
        chatbotSave.addEventListener("click", saveChatHistory);
        chatbotReset.addEventListener("click", resetChatHistory);
        suggestedQuestions.addEventListener("change", function () {
            if (this.value) {
                chatbotInput.value = this.value;
                sendMessage();
                this.value = "";
            }
        });

        function showWelcomeMessage() {
            if (!localStorage.getItem("chatHistory")) {
                chatbotMessages.innerHTML = "<p>Bot: Hi! I’m here to help with Social Security questions—retirement, disability, SSI, and more. Ask me anything!</p>";
            }
        }

        function sendMessage() {
            const userMessage = chatbotInput.value.trim();
            if (!userMessage) return;

            chatbotMessages.innerHTML += `<p>You: ${userMessage}</p>`;
            chatbotMessages.innerHTML += `<p>Bot is typing...</p>`;
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

            setTimeout(() => {
                chatbotMessages.lastChild.remove();
                chatbotMessages.innerHTML += `<p>Bot: ${getBotResponse(userMessage.toLowerCase())}</p>`;
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            }, 1000);

            chatbotInput.value = "";
        }

        function getBotResponse(message) {
            if (message.includes("replace") || message.includes("card")) return "Use My SSA online if 18+ with a U.S. address, or mail Form SS-5 with ID. <a href='https://www.ssa.gov/ssnumber/' target='_blank'>Start here</a>.";
            if (message.includes("retirement") && message.includes("start")) return "Start at 62 (reduced), FRA (66-67) for full, or 70 for max benefits. <a href='https://www.ssa.gov/benefits/retirement/planner/ageincrease.html' target='_blank'>Learn more</a>.";
            if (message.includes("ssdi") || message.includes("ssi") || message.includes("difference")) return "SSDI is for workers with credits (avg $1,500/month). SSI is for low-income, up to $943/month (2025). <a href='https://www.ssa.gov/benefits/disability/' target='_blank'>More info</a>.";
            if (message.includes("fraud") || message.includes("report")) return "Report to SSA OIG at 1-800-269-0271 or online. <a href='https://oig.ssa.gov/report' target='_blank'>Report here</a>.";
            if (message.includes("full retirement age") || message.includes("fra")) return "FRA is 66-67 based on birth year. <a href='https://www.ssa.gov/benefits/retirement/planner/ageincrease.html' target='_blank'>Details</a>.";
            return "I’m not sure! Try a specific question or visit <a href='https://www.ssa.gov' target='_blank'>SSA.gov</a>.";
        }

        function saveChatHistory() {
            localStorage.setItem("chatHistory", chatbotMessages.innerHTML);
            alert("Chat saved!");
        }

        function loadChatHistory() {
            const savedChat = localStorage.getItem("chatHistory");
            if (savedChat) chatbotMessages.innerHTML = savedChat;
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }

        function resetChatHistory() {
            localStorage.removeItem("chatHistory");
            chatbotMessages.innerHTML = "";
            showWelcomeMessage();
        }
    }

    // Support Us Toggle
    const supportUsToggle = document.getElementById("support-us-toggle");
    const supportUsContainer = document.getElementById("support-us");
    const supportUsClose = document.getElementById("support-us-close");
    if (supportUsToggle && supportUsContainer && supportUsClose) {
        supportUsToggle.addEventListener("click", () => {
            supportUsContainer.classList.add("active");
            supportUsToggle.style.display = "none";
        });
        supportUsClose.addEventListener("click", () => {
            supportUsContainer.classList.remove("active");
            setTimeout(() => supportUsToggle.style.display = "block", 300);
        });
    }

    // Back to Top Button
    const backToTop = document.getElementById("back-to-top");
    if (backToTop) {
        window.addEventListener("scroll", () => {
            backToTop.classList.toggle("show", window.scrollY > 200);
        });
        backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    }

    // Promo Banner Close
    const promoClose = document.getElementById("promo-close");
    const promoBanner = document.querySelector(".promo-banner");
    if (promoClose && promoBanner) {
        promoClose.addEventListener("click", () => promoBanner.style.display = "none");
    }

    // Social Share URLs
    const shareButtons = document.querySelectorAll('.share-btn');
    if (shareButtons) {
        const currentUrl = encodeURIComponent(window.location.href);
        shareButtons.forEach(btn => {
            const baseHref = btn.getAttribute('href');
            if (!baseHref.includes('youtube.com') && !baseHref.includes('instagram.com')) {
                btn.setAttribute('href', baseHref + currentUrl);
            }
        });
    }

    // Calculator Function (only if on calculator.html)
    if (window.location.pathname === '/calculator.html') {
        async function calculateBenefits() {
            const inputs = {
                age: parseInt(document.getElementById('age').value) || 0,
                earnedIncome: parseInt(document.getElementById('earned-income').value) || 0,
                unearnedIncome: parseInt(document.getElementById('unearned-income').value) || 0,
                resources: parseInt(document.getElementById('resources').value) || 0,
                workYears: parseInt(document.getElementById('work-years').value) || 0,
                disability: document.getElementById('disability').value,
                marital: document.getElementById('marital').value,
                visa: document.getElementById('visa').value,
                parents: document.getElementById('parents').value,
                parentEarned: parseInt(document.getElementById('parent-earned').value) || 0,
                parentUnearned: parseInt(document.getElementById('parent-unearned').value) || 0,
                siblings: parseInt(document.getElementById('siblings').value) || 0
            };

            try {
                const response = await fetch('/.netlify/functions/calculate-benefits', {
                    method: 'POST',
                    body: JSON.stringify(inputs),
                    headers: { 'Content-Type': 'application/json' }
                });
                const result = await response.json();

                // Update Results
                document.getElementById('ssi-result').textContent = result.ssi.eligible ? `$${result.ssi.amount}/month` : 'Not eligible';
                document.getElementById('ssdi-result').textContent = result.ssdi.eligible ? `$${result.ssdi.amount}/month` : 'Not eligible';
                document.getElementById('retirement-result').textContent = result.retirement.amount ? `$${result.retirement.amount}/month` : 'Not eligible';
                document.getElementById('medicare-result').textContent = result.medicare;

                // Update Chart
                const maxHeight = 4018;
                document.getElementById('ssi-bar').style.height = `${(result.ssi.amount || 0) / maxHeight * 100}%`;
                document.getElementById('ssi-bar').textContent = `SSI: $${result.ssi.amount || 0}`;
                document.getElementById('ssdi-bar').style.height = `${(result.ssdi.amount || 0) / maxHeight * 100}%`;
                document.getElementById('ssdi-bar').textContent = `SSDI: $${result.ssdi.amount || 0}`;
                document.getElementById('retirement-bar').style.height = `${(result.retirement.amount || 0) / maxHeight * 100}%`;
                document.getElementById('retirement-bar').textContent = `Retirement: $${result.retirement.amount || 0}`;

                // Update Timeline
                const timeline = document.getElementById('timeline');
                const fra = inputs.age < 67 ? 67 : inputs.age;
                timeline.innerHTML = `
                    <div class="timeline-point"><span>Age 62: $${Math.round(inputs.workYears * 100 * 0.7)}</span></div>
                    <div class="timeline-point"><span>Age ${fra}: $${Math.round(inputs.workYears * 100)}</span></div>
                    <div class="timeline-point"><span>Age 70: $${Math.round(inputs.workYears * 100 * 1.24)}</span></div>
                `;
            } catch (error) {
                console.error('Calculation error:', error);
                document.getElementById('ssi-result').textContent = 'Error';
            }
        }

        // Attach calculateBenefits to global scope for inline event handlers
        window.calculateBenefits = calculateBenefits;
    }
});
