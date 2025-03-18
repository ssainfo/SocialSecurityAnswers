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
        // Initialize API usage tracking
        initializeApiUsage();

        // Start fetching videos
        fetchYouTubeVideos(); // Initial fetch
        const refreshInterval = setInterval(() => {
            if (canMakeApiRequest()) {
                fetchYouTubeVideos();
            } else {
                clearInterval(refreshInterval); // Stop refreshing when limit is reached
                videoSection.innerHTML = '<p>API usage limit reached for this month. Video updates will resume next month.</p>';
            }
        }, 43200000); // Refresh every 12 hours (43,200,000 milliseconds)
    }

    // API Usage Tracking Functions
    function initializeApiUsage() {
        const currentMonth = new Date().getMonth() + 1; // 1-12
        const storedMonth = localStorage.getItem("apiUsageMonth");
        const storedUnits = localStorage.getItem("apiUsageUnits");

        // Reset usage if the month has changed
        if (storedMonth !== currentMonth.toString()) {
            localStorage.setItem("apiUsageMonth", currentMonth.toString());
            localStorage.setItem("apiUsageUnits", "0");
        } else if (!storedUnits) {
            localStorage.setItem("apiUsageUnits", "0");
        }
    }

    function canMakeApiRequest() {
        const unitsUsed = parseInt(localStorage.getItem("apiUsageUnits")) || 0;
        const unitsPerRefresh = 700; // Worst case: 6 channels + 1 fallback
        return unitsUsed + unitsPerRefresh <= 10000; // Free tier limit
    }

    function incrementApiUsage(units) {
        const currentUnits = parseInt(localStorage.getItem("apiUsageUnits")) || 0;
        localStorage.setItem("apiUsageUnits", (currentUnits + units).toString());
    }

    async function fetchYouTubeVideos() {
        const videoSection = document.getElementById("video-section");
        if (!videoSection) return; // Exit if video section not found
        videoSection.innerHTML = '<p>Loading latest videos...</p>';

        // Check if we can make the request
        if (!canMakeApiRequest()) {
            videoSection.innerHTML = '<p>API usage limit reached for this month. Video updates will resume next month.</p>';
            return;
        }

        // List of news channel IDs
        const newsChannelIds = [
            'UCupvZG-5ko_eiXAupbDfxWw', // CNN
            'UCvJJ_dzjViJCoLf5uKUTwoA', // CNBC
            'UCaXkIU1QidjPwiAYu6GcHjg', // MSNBC
            'UCXIJgqnII2ZOINSWNOGFThA', // Fox News
            'UCBi2mrWuNuyYy4gbM6fU18Q', // ABC News
            'UCeY0bbntWtlXynqpMrKpHTg'  // NBC News
        ];

        const apiKey = 'AIzaSyAABDh2g2x_ufrfmij3tVQJ1J5yAnHvvoo'; // Your provided API key
        const searchQuery = encodeURIComponent('"social security 2025" OR ssi OR ssdi OR medicare OR medicaid news');
        let videosFound = false;
        let allVideos = [];

        try {
            // Step 1: Search within specified news channels
            for (const channelId of newsChannelIds) {
                const youtubeUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&type=video&maxResults=2&order=date&channelId=${channelId}&key=${apiKey}`;
                const response = await fetch(youtubeUrl);
                const data = await response.json();
                incrementApiUsage(100); // Each search costs 100 units

                if (data.items && data.items.length > 0) {
                    videosFound = true;
                    allVideos.push(...data.items);
                }
            }

            // Step 2: If no videos found from news channels, fall back to general search
            if (!videosFound) {
                const fallbackUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&type=video&maxResults=2&order=date&key=${apiKey}`;
                const fallbackResponse = await fetch(fallbackUrl);
                const fallbackData = await fallbackResponse.json();
                incrementApiUsage(100); // Fallback search costs 100 units

                if (fallbackData.items && fallbackData.items.length > 0) {
                    allVideos.push(...fallbackData.items);
                }
            }

            // Step 3: Display videos (limit to 2)
            if (allVideos.length > 0) {
                videoSection.innerHTML = ''; // Clear loading message
                allVideos.slice(0, 2).forEach(item => {
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
                videoSection.innerHTML = '<p>No Social Security or Medicare news videos available at this time.</p>';
            }
        } catch (error) {
            videoSection.innerHTML = '<p>Sorry, video updates are unavailable right now. Check back later or <a href="https://www.youtube.com/results?search_query=social+security+2025+news" target="_blank">search YouTube</a>.</p>';
        }
    }
});