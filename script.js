document.addEventListener("DOMContentLoaded", function () {
    const pages = [
        { url: "/", title: "Home" },
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
        { url: "/ssi.html", title: "Supplemental Security Income" }
    ];

    // Site Search
    const siteSearch = document.getElementById("site-search");
    if (siteSearch) {
        siteSearch.addEventListener("keypress", function (e) {
            if (e.key === "Enter") {
                const searchTerm = this.value.toLowerCase();
                let results = "";
                pages.forEach(page => {
                    if (page.title.toLowerCase().includes(searchTerm)) {
                        results += `<p><a href="${page.url}">${page.title}</a></p>`;
                    }
                });
                alert(results ? "Found:\n" + results.replace(/<[^>]+>/g, "") : "No matches found.");
            }
        });
    }

    // Dark Mode Toggle
    const darkModeToggle = document.getElementById("dark-mode-toggle");
    if (darkModeToggle) {
        darkModeToggle.addEventListener("click", function () {
            document.body.classList.toggle("dark-mode");
            localStorage.setItem("darkMode", document.body.classList.contains("dark-mode") ? "enabled" : "disabled");
        });
        if (localStorage.getItem("darkMode") === "enabled") {
            document.body.classList.add("dark-mode");
        }
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

        chatbotToggle.addEventListener("click", function () {
            chatbotContainer.classList.add("active");
            chatbotToggle.style.display = "none";
        });

        chatbotClose.addEventListener("click", function () {
            chatbotContainer.classList.remove("active");
            setTimeout(() => {
                chatbotToggle.style.display = "block";
            }, 300);
        });

        chatbotSend.addEventListener("click", sendMessage);
        chatbotInput.addEventListener("keypress", function (e) {
            if (e.key === "Enter") sendMessage();
        });

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
                const welcomeP = document.createElement("p");
                welcomeP.innerHTML = "Bot: Hi! I’m here to help with Social Security questions—retirement, disability, SSI, and more. Ask me anything or pick a suggested question!";
                chatbotMessages.appendChild(welcomeP);
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            }
        }

        function sendMessage() {
            const userMessage = chatbotInput.value.trim();
            if (!userMessage) return;

            const userP = document.createElement("p");
            userP.textContent = "You: " + userMessage;
            chatbotMessages.appendChild(userP);

            const typingP = document.createElement("p");
            typingP.textContent = "Bot is typing...";
            chatbotMessages.appendChild(typingP);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

            setTimeout(() => {
                chatbotMessages.removeChild(typingP);
                const botP = document.createElement("p");
                botP.innerHTML = "Bot: " + getBotResponse(userMessage.toLowerCase());
                chatbotMessages.appendChild(botP);
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            }, 1000);

            chatbotInput.value = "";
        }

        function getBotResponse(message) {
            if (message.includes("replace") || message.includes("card")) {
                return "Use My SSA online if 18+ with a U.S. address, or mail Form SS-5 with ID. Takes 10-14 days. <a href='https://www.ssa.gov/ssnumber/' target='_blank'>Start here</a>.";
            }
            if (message.includes("retirement") && message.includes("start")) {
                return "Start at 62 (reduced), FRA (66-67) for full, or 70 for max benefits. <a href='https://www.ssa.gov/benefits/retirement/planner/ageincrease.html' target='_blank'>Learn more</a>.";
            }
            if (message.includes("ssdi") || message.includes("ssi") || message.includes("difference")) {
                return "SSDI is for workers with credits (avg $1,500/month). SSI is for low-income, up to $943/month (2025). <a href='https://www.ssa.gov/benefits/disability/' target='_blank'>More info</a>.";
            }
            if (message.includes("fraud") || message.includes("scam") || message.includes("report")) {
                return "Report to SSA OIG at 1-800-269-0271 or online. Don’t share SSN with callers! <a href='https://oig.ssa.gov/report' target='_blank'>Report here</a>.";
            }
            if (message.includes("full retirement age") || message.includes("fra")) {
                return "FRA is 66-67, based on birth year (e.g., 67 for 1960+). Early at 62 reduces, delay to 70 increases. <a href='https://www.ssa.gov/benefits/retirement/planner/ageincrease.html' target='_blank'>Details</a>.";
            }
            if (message.includes("ssi") || message.includes("supplemental security income")) {
                return "SSI pays up to $943/month (individuals) or $1,450 (couples) in 2025 to people with low income who are disabled, blind, or 65+. Call 1-800-772-1213 or start online (65+ only) at <a href='https://secure.ssa.gov/iClaim/SSI' target='_blank'>SSA.gov</a>.";
            }
            return "I’m not sure about that! Try something specific like 'How do I apply for SSI?' or visit <a href='https://www.ssa.gov' target='_blank'>SSA.gov</a>.";
        }

        function saveChatHistory() {
            localStorage.setItem("chatHistory", chatbotMessages.innerHTML);
            alert("Chat history saved!");
        }

        function resetChatHistory() {
            localStorage.removeItem("chatHistory");
            chatbotMessages.innerHTML = "";
            showWelcomeMessage();
        }

        function loadChatHistory() {
            const savedHistory = localStorage.getItem("chatHistory");
            if (savedHistory) {
                chatbotMessages.innerHTML = savedHistory;
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            }
        }
    }

    // Support Us Functionality
    const supportUsToggle = document.getElementById("support-us-toggle");
    const supportUsContainer = document.getElementById("support-us");
    const supportUsClose = document.getElementById("support-us-close");

    if (supportUsToggle && supportUsContainer && supportUsClose) {
        supportUsToggle.addEventListener("click", function () {
            supportUsContainer.classList.add("active");
            supportUsToggle.style.display = "none";
        });

        supportUsClose.addEventListener("click", function () {
            supportUsContainer.classList.remove("active");
            setTimeout(() => {
                supportUsToggle.style.display = "block";
            }, 300);
        });
    }

    // Thank You Message
    const navLinks = document.querySelectorAll("nav ul li a");
    let isInternalNavigation = false;
    const thankYouDiv = document.getElementById("thank-you-message");

    if (thankYouDiv) {
        navLinks.forEach(link => {
            link.addEventListener("click", function () {
                const href = this.getAttribute("href");
                if (pages.some(page => page.url === href)) {
                    isInternalNavigation = true;
                }
            });
        });

        window.addEventListener("beforeunload", function (e) {
            if (!isInternalNavigation) {
                thankYouDiv.classList.add("show");
                setTimeout(() => {
                    thankYouDiv.classList.remove("show");
                }, 2000);
                e.preventDefault();
                e.returnValue = "";
            }
            isInternalNavigation = false;
        });
    }

    // Back to Top Button
    const backToTopBtn = document.getElementById("back-to-top");
    if (backToTopBtn) {
        window.addEventListener("scroll", function () {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add("show");
            } else {
                backToTopBtn.classList.remove("show");
            }
        });

        backToTopBtn.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // Social Sharing Buttons
    const currentUrl = encodeURIComponent(window.location.href);
    const shareText = encodeURIComponent('Check out this Social Security guide at ssaanswers.com!');
    const shareLinks = {
        twitter: `https://twitter.com/intent/tweet?url=${currentUrl}&text=${shareText}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`,
        linkedin: `https://www.linkedin.com/shareArticle?url=${currentUrl}&title=${shareText}`,
        pinterest: `https://pinterest.com/pin/create/button/?url=${currentUrl}&description=${shareText}`,
        reddit: `https://reddit.com/submit?url=${currentUrl}&title=${shareText}`,
        whatsapp: `https://api.whatsapp.com/send?text=${shareText}%20${currentUrl}`,
        instagram: 'https://www.instagram.com/', // Replace with your profile if available
        youtube: 'https://www.youtube.com/@socialsecurityadministration' // SSA channel
    };

    const twitterBtn = document.querySelector('.share-btn.twitter');
    const facebookBtn = document.querySelector('.share-btn.facebook');
    const linkedinBtn = document.querySelector('.share-btn.linkedin');
    const pinterestBtn = document.querySelector('.share-btn.pinterest');
    const redditBtn = document.querySelector('.share-btn.reddit');
    const whatsappBtn = document.querySelector('.share-btn.whatsapp');
    const instagramBtn = document.querySelector('.share-btn.instagram');
    const youtubeBtn = document.querySelector('.share-btn.youtube');

    if (twitterBtn) twitterBtn.href = shareLinks.twitter;
    if (facebookBtn) facebookBtn.href = shareLinks.facebook;
    if (linkedinBtn) linkedinBtn.href = shareLinks.linkedin;
    if (pinterestBtn) pinterestBtn.href = shareLinks.pinterest;
    if (redditBtn) redditBtn.href = shareLinks.reddit;
    if (whatsappBtn) whatsappBtn.href = shareLinks.whatsapp;
    if (instagramBtn) instagramBtn.href = shareLinks.instagram;
    if (youtubeBtn) youtubeBtn.href = shareLinks.youtube;
}, false);