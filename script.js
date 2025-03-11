document.addEventListener("DOMContentLoaded", function () {
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
        { url: "fraud.html", title: "Fraud Protection" }
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
                const response = getBotResponse(userMessage.toLowerCase());
                botP.innerHTML = "Bot: " + response;
                chatbotMessages.appendChild(botP);

                // Add feedback buttons
                const feedbackDiv = document.createElement("div");
                feedbackDiv.className = "chatbot-feedback";
                feedbackDiv.innerHTML = 'Was this helpful? <button class="feedback-btn" data-value="yes">Yes</button><button class="feedback-btn" data-value="no">No</button>';
                chatbotMessages.appendChild(feedbackDiv);

                feedbackDiv.querySelectorAll(".feedback-btn").forEach(btn => {
                    btn.addEventListener("click", function () {
                        const value = this.getAttribute("data-value");
                        console.log("Feedback received:", value, "for response:", response);
                        feedbackDiv.textContent = value === "yes" ? "Thanks for the feedback!" : "Sorry, try asking again!";
                    });
                });

                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            }, 1000);

            chatbotInput.value = "";
        }

        function getBotResponse(message) {
            console.log("Processing response for:", message);

            // Edge Cases
            if (message === "help me" || message === "help") {
                return "I can assist with Social Security topics like retirement, disability, or housing. What do you need help with? Try 'How do I apply for Medicare?' or check our <a href='faq.html'>FAQ</a>.";
            }
            if (message.includes("retirment") || message.includes("retiremnet")) { // Common typos
                return "Did you mean 'retirement'? You can start at 62 (reduced), FRA (66-67) for full, or 70 for max benefits. <a href='retirement.html'>Learn more</a>.";
            }
            if (message.includes("medicad") || message.includes("medicaide")) { // Typos for Medicaid
                return "Did you mean 'Medicaid'? It’s for low-income folks and covers long-term care. <a href='medicaid.html'>Details here</a>.";
            }

            // Social Security (General)
            if (message.includes("apply") && message.includes("social security")) {
                return "Apply online at SSA.gov, call 1-800-772-1213, or visit an office. Start 4 months before you want benefits. <a href='https://www.ssa.gov/benefits/retirement/apply.html' target='_blank'>Apply now</a>.";
            }
            if (message.includes("full retirement age") || message.includes("fra")) {
                return "FRA is 66-67, based on birth year (e.g., 67 for 1960+). Early at 62 reduces, delay to 70 increases. <a href='https://www.ssa.gov/benefits/retirement/planner/ageincrease.html' target='_blank'>Details</a>.";
            }
            if (message.includes("work") && message.includes("collect")) {
                return "Before FRA, earnings over $22,320 (2025) reduce benefits ($1 per $2 over). No limit after FRA. <a href='https://www.ssa.gov/benefits/retirement/planner/whileworking.html' target='_blank'>More info</a>.";
            }
            if (message.includes("replace") || message.includes("card")) {
                return "Use My SSA online if 18+ with a U.S. address, or mail Form SS-5 with ID. Takes 10-14 days. <a href='https://www.ssa.gov/ssnumber/' target='_blank'>Start here</a>.";
            }

            // Retirement
            if (message.includes("retirement") && message.includes("start")) {
                return "Start at 62 (reduced), FRA (66-67) for full, or 70 for max benefits. <a href='https://www.ssa.gov/benefits/retirement/planner/ageincrease.html' target='_blank'>Learn more</a>.";
            }
            if (message.includes("how much") && message.includes("retirement")) {
                return "Based on 35 highest-earning years, max $3,822/month at FRA in 2025. Use <a href='https://www.ssa.gov/estimator/' target='_blank'>SSA’s calculator</a>.";
            }
            if (message.includes("spousal benefits")) {
                return "Up to 50% of your spouse’s FRA benefit if higher than yours. <a href='https://www.ssa.gov/benefits/retirement/planner/applying7.html' target='_blank'>Details</a>.";
            }

            // Medicare
            if (message.includes("sign up") && message.includes("medicare")) {
                return "Sign up 3 months before to 3 months after your 65th birthday to avoid penalties. <a href='https://www.ssa.gov/medicare/sign-up' target='_blank'>Medicare.gov</a>.";
            }
            if (message.includes("part a") && message.includes("cover")) {
                return "Part A covers hospital stays, skilled nursing, hospice, some home health. Free if you worked 10+ years. <a href='https://www.medicare.gov/what-medicare-covers/what-part-a-covers' target='_blank'>Details</a>.";
            }
            if (message.includes("part b") && message.includes("working")) {
                return "Not needed if you have employer coverage (20+ employees). Enroll later with a Special Enrollment Period. <a href='https://www.ssa.gov/medicare/sign-up' target='_blank'>More info</a>.";
            }
            if (message.includes("extra help")) {
                return "Extra Help lowers Part D drug costs for low-income folks. Apply at <a href='https://www.ssa.gov/medicare/prescriptionhelp/' target='_blank'>SSA.gov</a>.";
            }
            if (message.includes("medicare advantage") || message.includes("part c")) {
                return "Medicare Advantage (Part C) combines A, B, often D, with extras like vision. Compare at <a href='https://www.medicare.gov/plan-compare' target='_blank'>Plan Finder</a>.";
            }

            // Disability
            if (message.includes("ssdi") || message.includes("ssi") || message.includes("difference")) {
                return "SSDI is for workers with credits (avg $1,500/month). SSI is for low-income, up to $943/month (2025). <a href='https://www.ssa.gov/benefits/disability/' target='_blank'>More info</a>.";
            }
            if (message.includes("apply disability")) {
                return "Apply online at SSA.gov, call 1-800-772-1213, or visit an office. Takes 3-5 months. <a href='https://www.ssa.gov/benefits/disability/apply.html' target='_blank'>Apply now</a>.";
            }
            if (message.includes("trial work period")) {
                return "Test work for 9 months (over $1,110/month in 2025) without losing benefits. <a href='https://www.ssa.gov/work/' target='_blank'>Ticket to Work</a>.";
            }

            // Survivor
            if (message.includes("survivor") || message.includes("widow")) {
                return "Widow(er)s get up to 100% of deceased’s benefit at FRA, kids get 75% under 18. Call 1-800-772-1213. <a href='https://www.ssa.gov/benefits/survivors/' target='_blank'>Details</a>.";
            }

            // Tax
            if (message.includes("tax") && message.includes("benefits")) {
                return "50-85% of benefits may be taxed if income exceeds $25,000 (single) or $32,000 (joint). Report via SSA-1099. <a href='https://www.ssa.gov/benefits/retirement/planner/taxes.html' target='_blank'>Tax info</a>.";
            }

            // Medicaid
            if (message.includes("who qualifies") && message.includes("medicaid")) {
                return "Low-income individuals, families, elderly, disabled qualify. Rules vary by state. SSI often auto-qualifies. <a href='https://www.medicaid.gov/medicaid/eligibility/index.html' target='_blank'>Medicaid.gov</a>.";
            }
            if (message.includes("long-term care") && message.includes("medicaid")) {
                return "Yes, Medicaid covers nursing homes and home care if you qualify, unlike Medicare. Check state rules.";
            }
            if (message.includes("medicare") && message.includes("medicaid")) {
                return "You can have both! Medicaid may pay Medicare premiums and copays if eligible. <a href='https://www.medicaid.gov/medicaid/eligibility/index.html' target='_blank'>Details</a>.";
            }
            if (message.includes("apply") && message.includes("medicaid")) {
                return "Apply via your state’s Medicaid agency or HealthCare.gov. <a href='https://www.medicaid.gov/about-us/contact-us/index.html' target='_blank'>State contacts</a>.";
            }

            // Housing
            if (message.includes("hud") || message.includes("housing assistance")) {
                return "HUD offers vouchers, public housing, and subsidized apartments. <a href='https://www.hud.gov/topics/rental_assistance' target='_blank'>HUD.gov</a>.";
            }
            if (message.includes("section 8")) {
                return "Section 8 pays part of rent for income below 50% of area median. Apply via your PHA. <a href='https://www.hud.gov/topics/rental_assistance' target='_blank'>Learn more</a>.";
            }
            if (message.includes("find") && message.includes("housing")) {
                return "Contact your local PHA or use HUD’s locator. <a href='https://www.hud.gov/program_offices/public_indian_housing/pha/contacts' target='_blank'>PHA Contacts</a>.";
            }
            if (message.includes("home repairs") || message.includes("fix home")) {
                return "HUD’s Title I loans or local grants help. Check with your PHA or <a href='https://www.hud.gov/topics/home_improvements' target='_blank'>HUD.gov</a>.";
            }

            // Fraud
            if (message.includes("fraud") || message.includes("scam") || message.includes("report")) {
                return "Report to SSA OIG at 1-800-269-0271 or online. Don’t share SSN with callers! <a href='https://oig.ssa.gov/report' target='_blank'>Report here</a>.";
            }

            // General
            if (message.includes("contact ssa") || message.includes("phone")) {
                return "Call 1-800-772-1213 (7 AM–7 PM, Mon–Fri) or visit an office. <a href='https://www.ssa.gov/agency/contact/' target='_blank'>Contact SSA</a>.";
            }
            if (message.includes("my ssa") || message.includes("account")) {
                return "Create a My SSA account to manage benefits or check estimates. <a href='https://www.ssa.gov/myaccount/' target='_blank'>Sign up</a>.";
            }

            return "I’m not sure about that! Try something specific like 'How do I apply for Medicaid?' or visit our <a href='faq.html'>FAQ page</a> or <a href='https://www.ssa.gov' target='_blank'>SSA.gov</a>.";
        }
if (message.includes("documents") && message.includes("child")) {
    return "For a child’s replacement card, you need their birth certificate, a school ID or medical record, and your ID (driver’s license or passport). See <a href='replacement.html'>Replacement Guide</a>.";
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

    // Thank You Message
    const navLinks = document.querySelectorAll("nav ul li a");
    let isInternalNavigation = false;
    const thankYouDiv = document.createElement("div");
    thankYouDiv.id = "thank-you-message";
    thankYouDiv.textContent = "Thank you for visiting Social Security Answers!";
    document.body.appendChild(thankYouDiv);

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