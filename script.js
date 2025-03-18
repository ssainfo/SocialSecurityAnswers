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
        { url: "/about.html", title: "About Us" }
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

        if (!sessionStorage.getItem("chatbotShown")) {
            setTimeout(() => {
                chatbotContainer.classList.add("active");
                chatbotToggle.style.display = "none";
                sessionStorage.setItem("chatbotShown", "true");
            }, 10000);
        }

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
                return "SSI pays up to $943/month (individuals) or $1,415 (couples) in 2025 to people with low income who are disabled, blind, or 65+. Call 1-800-772-1213 or start online (65+ only) at <a href='https://secure.ssa.gov/iClaim/SSI' target='_blank'>SSA.gov</a>.";
            }
            return "I’m not sure about that! Try something specific like 'How do I apply for SSI?' or visit <a href='https://www.ssa.gov' target='_blank'>SSA.gov</a>.";
        }

        function saveChatHistory() {
            localStorage.setItem("chatHistory", chatbotMessages.innerHTML);
            alert("Chat saved!");
        }

        function loadChatHistory() {
            const savedChat = localStorage.getItem("chatHistory");
            if (savedChat) {
                chatbotMessages.innerHTML = savedChat;
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            }
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

    // Back to Top Button
    const backToTop = document.getElementById("back-to-top");
    if (backToTop) {
        window.addEventListener("scroll", function () {
            if (window.scrollY > 200) {
                backToTop.classList.add("show");
            } else {
                backToTop.classList.remove("show");
            }
        });

        backToTop.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // Thank You Message on Exit
    const thankYouMessage = document.getElementById("thank-you-message");
    if (thankYouMessage) {
        window.addEventListener("beforeunload", function () {
            thankYouMessage.classList.add("show");
            setTimeout(() => {
                thankYouMessage.classList.add("fade-out");
                setTimeout(() => {
                    thankYouMessage.classList.remove("show", "fade-out");
                }, 500);
            }, 10000); // 10 seconds visibility
        });
    }

    // YouTube Video Automation (for news.html or pages with video-section)
    const videoSection = document.getElementById("video-section");
    if (videoSection) {
        fetchYouTubeVideos(); // Initial fetch
        setInterval(fetchYouTubeVideos, 36000000); // Refresh every 10 hours (36,000,000 milliseconds)
    }

    async function fetchYouTubeVideos() {
        const videoSection = document.getElementById("video-section");
        if (!videoSection) return; // Exit if video section not found
        videoSection.innerHTML = '<p>Loading latest videos...</p>';
        try {
            const apiKey = 'AIzaSyAABDh2g2x_ufrfmij3tVQJ1J5yAnHvvoo'; // Your provided API key
            const searchQuery = encodeURIComponent('"social security 2025" OR ssi OR ssdi OR medicare OR medicaid');
            const youtubeUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&type=video&maxResults=2&order=date&key=${apiKey}`;
            const response = await fetch(youtubeUrl);
            const data = await response.json();

            if (data.items && data.items.length > 0) {
                videoSection.innerHTML = ''; // Clear loading message
                data.items.forEach(item => {
                    const videoId = item.id.videoId;
                    const videoItem = document.createElement('div');
                    videoItem.className = 'video-item';
                    videoItem.innerHTML = `
                        <iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" title="${item.snippet.title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                        <p class="video-fallback">If the video doesn’t load, <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank">watch it on YouTube</a>.</p>
                    `;
                    videoSection.appendChild(videoItem);
                });
            } else {
                videoSection.innerHTML = '<p>No videos available at this time.</p>';
            }
        } catch (error) {
            videoSection.innerHTML = '<p>Sorry, video updates are unavailable right now. Check back later or <a href="https://www.youtube.com/results?search_query=social+security+2025" target="_blank">search YouTube</a>.</p>';
        }
    }
});