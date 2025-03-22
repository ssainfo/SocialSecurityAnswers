document.addEventListener("DOMContentLoaded", function () {
    const pages = [
        { url: "/", title: "Home" },
        { url: "/news.html", title: "News" },
        { url: "/community.html", title: "Community" }, // Added Community
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

    // Chatbot Functionality (unchanged)
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

    // Support Us Toggle (unchanged)
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

    // Back to Top Button (unchanged)
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

    // Community Section Toggle (for index.html)
    const navLinks = document.querySelectorAll('.nav-list a');
    const communitySection = document.getElementById('community-section');
    const heroSection = document.querySelector('.hero');
    const contentSection = document.querySelector('.content-section');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            if (this.getAttribute('href') === '/community.html') {
                e.preventDefault();
                communitySection.style.display = 'block';
                heroSection.style.display = 'none';
                contentSection.style.display = 'none';
                loadCommunityPosts();
            } else if (this.getAttribute('href') === '/') {
                communitySection.style.display = 'none';
                heroSection.style.display = 'block';
                contentSection.style.display = 'block';
            }
        });
    });

    // Community Post Form Submission
    const postForm = document.getElementById('community-post-form');
    if (postForm) {
        postForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const content = document.getElementById('post-content').value.trim();
            if (!content) return;

            const response = await fetch('/.netlify/functions/submit-post', {
                method: 'POST',
                body: JSON.stringify({ content, timestamp: new Date().toISOString() }),
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                document.getElementById('post-content').value = '';
                loadCommunityPosts();
            } else {
                alert('Error submitting post. Try again later.');
            }
        });
    }

    // Load Community Posts
    async function loadCommunityPosts() {
        const postsContainer = document.getElementById('community-posts');
        if (!postsContainer) return;
        postsContainer.innerHTML = '<p>Loading posts...</p>';

        const response = await fetch('/.netlify/functions/get-posts');
        const posts = await response.json();

        postsContainer.innerHTML = '';
        posts.forEach((post, index) => {
            const postElement = document.createElement('div');
            postElement.className = 'post';
            postElement.innerHTML = `
                <div class="post-header">
                    <span>Anonymous</span>
                    <span class="post-meta">${new Date(post.timestamp).toLocaleString()}</span>
                </div>
                <p class="post-content">${post.content}</p>
                <div class="post-actions">
                    <button class="vote-btn upvote" data-id="${index}"><i class="fas fa-arrow-up"></i> <span>${post.upvotes || 0}</span></button>
                    <button class="vote-btn downvote" data-id="${index}"><i class="fas fa-arrow-down"></i> <span>${post.downvotes || 0}</span></button>
                    <button class="comment-btn">Comments (${post.comments ? post.comments.length : 0})</button>
                </div>
                <div class="comments">
                    ${post.comments ? post.comments.map(c => `<div class="comment">${c}</div>`).join('') : ''}
                    <form class="comment-form">
                        <input type="text" class="comment-input" placeholder="Add a comment..." />
                        <button type="submit" class="cta-button">Comment</button>
                    </form>
                </div>
            `;
            postsContainer.appendChild(postElement);
        });

        // Voting
        document.querySelectorAll('.vote-btn').forEach(btn => {
            btn.addEventListener('click', async function () {
                const id = this.dataset.id;
                const type = this.classList.contains('upvote') ? 'upvote' : 'downvote';
                const response = await fetch('/.netlify/functions/vote-post', {
                    method: 'POST',
                    body: JSON.stringify({ id: parseInt(id), type }),
                    headers: { 'Content-Type': 'application/json' }
                });
                if (response.ok) {
                    loadCommunityPosts();
                }
            });
        });

        // Comment Toggle and Submission
        document.querySelectorAll('.comment-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const comments = this.parentElement.nextElementSibling;
                comments.classList.toggle('active');
            });
        });

        document.querySelectorAll('.comment-form').forEach(form => {
            form.addEventListener('submit', async function (e) {
                e.preventDefault();
                const input = this.querySelector('.comment-input');
                const comment = input.value.trim();
                const postId = this.closest('.post').querySelector('.vote-btn').dataset.id;
                if (!comment) return;

                const response = await fetch('/.netlify/functions/add-comment', {
                    method: 'POST',
                    body: JSON.stringify({ postId: parseInt(postId), comment }),
                    headers: { 'Content-Type': 'application/json' }
                });

                if (response.ok) {
                    input.value = '';
                    loadCommunityPosts();
                }
            });
        });
    }

    // Initial Load (if on community page)
    if (window.location.pathname === '/community.html') {
        loadCommunityPosts();
    }
});
