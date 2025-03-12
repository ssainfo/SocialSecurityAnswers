document.addEventListener("DOMContentLoaded", function () {
    // Page list for site search and navigation tracking
    const pages = [
        { url: "index.html", title: "Home" },
        { url: "replacement.html", title: "Card Replacement" },
        { url: "retirement.html", title: "Retirement Planning" },
        { url: "medicare.html", title: "Medicare Basics" },
        { url: "disability.html", title: "Disability Guide" },
        { url: "survivor.html", title: "Survivor Benefits Guide" },
        { url: "tax.html", title: "Tax Basics" },
        { url: "medicaid.html", title: "Medicaid Info" },
        { url: "housing.html", title: "Housing Assistance" },
        { url: "faq.html", title: "FAQ" },
        { url: "fraud.html", title: "Fraud Protection" },
        { url: "ssi.html", title: "Supplemental Security Income" }
    ];

    // FAQ Toggle
    const questions = document.querySelectorAll(".faq-question");
    if (questions.length) {
        console.log("FAQ questions found:", questions.length);
        questions.forEach(question => {
            question.addEventListener("click", function () {
                const answer = this.nextElementSibling;
                answer.style.display = answer.style.display === "block" ? "none" : "block";
            });
        });
    }

    // FAQ Search
    const faqSearch = document.getElementById("faq-search");
    if (faqSearch) {
        const faqItems = document.querySelectorAll(".faq-item");
        console.log("FAQ search initialized, items:", faqItems.length);
        faqSearch.addEventListener("input", function () {
            const searchTerm = this.value.toLowerCase();
            faqItems.forEach(item => {
                const questionText = item.querySelector(".faq-question").textContent.toLowerCase();
                const answerText = item.querySelector(".faq-answer").textContent.toLowerCase();
                item.style.display = (questionText.includes(searchTerm) || answerText.includes(searchTerm)) ? "block" : "none";
            });
        });
    }

    // Site Search
    const siteSearch = document.getElementById("site-search");
    if (siteSearch) {
        console.log("Site search initialized");
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
        console.log("Dark mode toggle found");
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

    console.log("Chatbot elements:", {
        toggle: chatbotToggle,
        container: chatbotContainer,
        close: chatbotClose,
        input: chatbotInput,
        send: chatbotSend,
        save: chatbotSave,
        reset: chatbotReset,
        messages: chatbotMessages,
        suggested: suggestedQuestions
    });

    if (chatbotToggle && chatbotContainer && chatbotClose && chatbotInput && chatbotSend && chatbotMessages && suggestedQuestions) {
        showWelcomeMessage();
        loadChatHistory();

        chatbotToggle.addEventListener("click", function () {
            console.log("Chatbot toggle clicked");
            chatbotContainer.classList.add("active");
            chatbotToggle.style.display = "none";
        });

        chatbotClose.addEventListener("click", function () {
            console.log("Chatbot close clicked");
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
                console.log("Suggested question selected:", this.value);
                chatbotInput.value = this.value;
                sendMessage();
                this.value = "";
            }
        });

        function showWelcomeMessage() {
            if (!localStorage.getItem("chatHistory")) {
                const welcomeP = document.createElement("p");
                welcomeP.innerHTML = "Bot: Hi! I’m here to help with Social Security questions—retirement, disability, fraud, and more. Ask me anything or pick a suggested question!";
                chatbotMessages.appendChild(welcomeP);
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            }
        }

        function sendMessage() {
            console.log("Send message triggered");
            const userMessage = chatbotInput.value.trim();
            if (!userMessage) return;

            const userP = document.createElement("p");
            userP.textContent = "You: " + userMessage;
            chatbotMessages.appendChild(userP);

            const typingP = document.createElement("p");
            typingP.className = "chatbot-typing";
            typingP.textContent = "Bot is typing...";
            chatbotMessages.appendChild(typingP);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

            setTimeout(() => {
                chatbotMessages.removeChild(typingP);
                const botP = document.createElement("p");
                botP.innerHTML = "Bot: " + getBotResponse(userMessage.toLowerCase());
                chatbotMessages.appendChild(botP);

                const feedbackDiv = document.createElement("div");
                feedbackDiv.className = "chatbot-feedback";
                feedbackDiv.innerHTML = 'Was this helpful? <button class="feedback-btn" data-value="yes">Yes</button><button class="feedback-btn" data-value="no">No</button>';
                chatbotMessages.appendChild(feedbackDiv);

                feedbackDiv.querySelectorAll(".feedback-btn").forEach(btn => {
                    btn.addEventListener("click", function () {
                        const value = this.getAttribute("data-value");
                        console.log("Feedback received:", value);
                        feedbackDiv.textContent = value === "yes" ? "Thanks for the feedback!" : "Sorry, try asking again!";
                    });
                });

                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            }, 1000);

            chatbotInput.value = "";
        }

        function getBotResponse(message) {
            console.log("Processing response for:", message);

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
            return "I’m not sure about that! Try something specific like 'How do I apply for Medicaid?' or visit <a href='https://www.ssa.gov' target='_blank'>SSA.gov</a>.";
        }

        function saveChatHistory() {
            console.log("Saving chat history");
            localStorage.setItem("chatHistory", chatbotMessages.innerHTML);
            alert("Chat history saved!");
        }

        function resetChatHistory() {
            console.log("Resetting chat history");
            localStorage.removeItem("chatHistory");
            chatbotMessages.innerHTML = "";
            showWelcomeMessage();
        }

        function loadChatHistory() {
            const savedHistory = localStorage.getItem("chatHistory");
            if (savedHistory) {
                console.log("Loading chat history");
                chatbotMessages.innerHTML = savedHistory;
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            }
        }
    } else {
        console.error("Chatbot initialization failed: Missing required elements");
    }

    // Support Us Functionality
    const supportUsToggle = document.getElementById("support-us-toggle");
    const supportUsContainer = document.getElementById("support-us");
    const supportUsClose = document.getElementById("support-us-close");

    console.log("Support Us elements:", {
        toggle: supportUsToggle,
        container: supportUsContainer,
        close: supportUsClose
    });

    if (supportUsToggle && supportUsContainer && supportUsClose) {
        supportUsToggle.addEventListener("click", function () {
            console.log("Support Us toggle clicked");
            supportUsContainer.classList.add("active");
            supportUsToggle.style.display = "none";
        });

        supportUsClose.addEventListener("click", function () {
            console.log("Support Us close clicked");
            supportUsContainer.classList.remove("active");
            setTimeout(() => {
                supportUsToggle.style.display = "block";
            }, 300);
        });
    } else {
        console.error("Support Us initialization failed: Missing required elements");
    }

    // Thank You Message
    const navLinks = document.querySelectorAll("nav ul li a");
    let isInternalNavigation = false;
    const thankYouDiv = document.getElementById("thank-you-message");

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
}, false);