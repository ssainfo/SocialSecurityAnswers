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

    // Video Box Animation (for news.html or any page with .video-box)
    const videoBoxes = document.querySelectorAll('.video-box');
    videoBoxes.forEach((box, index) => {
        setTimeout(() => box.classList.add('slide-in'), index * 200);
    });

    // News Button Pulse (for index.html or any page with .news-cta-button)
    const newsButton = document.querySelector('.news-cta-button');
    if (newsButton) {
        setTimeout(() => newsButton.classList.add('pulse'), 1000);
    }

    // Retirement Popup (for pages with #retirement-popup)
    const retirementPopup = document.getElementById("retirement-popup");
    const retirementClose = document.getElementById("popup-close");
    if (retirementPopup && retirementClose) {
        if (!sessionStorage.getItem("retirementPopupShown")) {
            setTimeout(() => {
                retirementPopup.style.display = "flex";
                sessionStorage.setItem("retirementPopupShown", "true");
                setTimeout(() => retirementPopup.style.display = "none", 10000);
            }, 1000);
        }
        retirementClose.addEventListener("click", () => retirementPopup.style.display = "none");
        retirementPopup.addEventListener("click", (e) => {
            if (e.target === retirementPopup) retirementPopup.style.display = "none";
        });
    }

    // Replacement Popup (for pages with #replacement-popup)
    const replacementPopup = document.getElementById('replacement-popup');
    const replacementClose = document.getElementById('popup-close-replacement');
    let replacementTimeout;

    if (replacementPopup && replacementClose) {
        function showReplacementPopup() {
            console.log('Showing replacement popup');
            replacementPopup.style.display = 'flex';
            replacementTimeout = setTimeout(() => {
                console.log('Auto-closing replacement popup');
                replacementPopup.style.display = 'none';
            }, 10000);
        }

        function closeReplacementPopup() {
            console.log('Closing replacement popup manually');
            clearTimeout(replacementTimeout);
            replacementPopup.style.display = 'none';
        }

        replacementClose.addEventListener('click', closeReplacementPopup);
        replacementPopup.addEventListener('click', (e) => {
            if (e.target === replacementPopup) closeReplacementPopup();
        });

        if (window.location.pathname.includes('replacement.html')) {
            showReplacementPopup();
        } else if (window.location.pathname === '/' || window.location.pathname.includes('index.html')) {
            const topicsSection = document.querySelector('.topic-grid');
            if (topicsSection) {
                let hasShown = false;
                window.addEventListener('scroll', () => {
                    const rect = topicsSection.getBoundingClientRect();
                    if (rect.top < window.innerHeight && !hasShown) {
                        showReplacementPopup();
                        hasShown = true;
                    }
                });
            }
        }
    }

    // Site Search (for pages with #site-search)
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

    // Dark Mode Toggle (for all pages with #dark-mode-toggle)
    const darkModeToggle = document.getElementById("dark-mode-toggle");
    if (darkModeToggle) {
        darkModeToggle.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");
            localStorage.setItem("darkMode", document.body.classList.contains("dark-mode") ? "enabled" : "disabled");
        });
        if (localStorage.getItem("darkMode") === "enabled") document.body.classList.add("dark-mode");
    }

    // Flowchart Interactivity (for pages with .flow-step)
    const flowSteps = document.querySelectorAll('.flow-step');
    flowSteps.forEach(step => {
        step.addEventListener('click', () => {
            flowSteps.forEach(s => s.classList.remove('active'));
            step.classList.add('active');
        });
        step.addEventListener('mouseover', () => {
            step.querySelector('.step-details').style.display = 'block';
        });
        step.addEventListener('mouseout', () => {
            if (!step.classList.contains('active')) {
                step.querySelector('.step-details').style.display = 'none';
            }
        });
    });

    // Chatbot Functionality (for pages with chatbot elements)
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
            console.log("Dropdown changed to:", this.value);
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

    // Support Us Toggle (for pages with support-us elements)
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

    // Back to Top Button (for pages with #back-to-top)
    const backToTop = document.getElementById("back-to-top");
    if (backToTop) {
        window.addEventListener("scroll", () => {
            backToTop.classList.toggle("show", window.scrollY > 200);
        });
        backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    }

    // Promo Banner Close (for pages with .promo-banner)
    const promoClose = document.getElementById("promo-close");
    const promoBanner = document.querySelector(".promo-banner");
    if (promoClose && promoBanner) {
        promoClose.addEventListener("click", () => promoBanner.style.display = "none");
    }

    // Social Share URLs (for pages with .share-btn)
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
});
