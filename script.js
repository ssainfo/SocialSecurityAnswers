document.addEventListener("DOMContentLoaded", function () {
    // Pages to search
    const pages = [
        { url: "index.html", title: "Home" },
        { url: "retirement.html", title: "Retirement Planning" },
        { url: "medicare.html", title: "Medicare Basics" },
        { url: "disability.html", title: "Disability Guide" },
        { url: "survivor.html", title: "Survivor Benefits Guide" },
        { url: "tax.html", title: "Tax Basics" },
        { url: "medicaid.html", title: "Medicaid Info" },
        { url: "housing.html", title: "Housing Assistance" },
        { url: "faq.html", title: "FAQ" }
    ];

    // FAQ Collapsible
    const questions = document.querySelectorAll(".faq-question");
    questions.forEach(question => {
        question.addEventListener("click", function () {
            const answer = this.nextElementSibling;
            answer.style.display = answer.style.display === "block" ? "none" : "block";
        });
    });

    // FAQ Search
    const faqSearch = document.getElementById("faq-search");
    if (faqSearch) {
        const faqItems = document.querySelectorAll(".faq-item");
        faqSearch.addEventListener("input", function () {
            const searchTerm = this.value.toLowerCase();
            faqItems.forEach(item => {
                const questionText = item.querySelector(".faq-question").textContent.toLowerCase();
                const answerText = item.querySelector(".faq-answer").textContent.toLowerCase();
                item.style.display = (questionText.includes(searchTerm) || answerText.includes(searchTerm)) ? "block" : "none";
            });
        });
    }

    // Site-wide Search
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

             // Chatbot section (replace this in your script.js)
    const chatbotToggle = document.getElementById("chatbot-toggle");
    const chatbotContainer = document.getElementById("chatbot");
    const chatbotClose = document.getElementById("chatbot-close");
    const chatbotInput = document.getElementById("chatbot-input");
    const chatbotSend = document.getElementById("chatbot-send");
    const chatbotSave = document.getElementById("chatbot-save");
    const chatbotReset = document.getElementById("chatbot-reset");
    const chatbotMessages = document.getElementById("chatbot-messages");
    const suggestedQuestions = document.getElementById("suggested-questions");

    if (chatbotToggle) {
        showWelcomeMessage();
        loadChatHistory();

        chatbotToggle.addEventListener("click", function () {
            chatbotContainer.style.display = "block";
            setTimeout(() => chatbotContainer.classList.add("active"), 10);
            chatbotToggle.style.display = "none";
        });

        if (chatbotClose) {
            chatbotClose.addEventListener("click", function () {
                chatbotContainer.classList.remove("active");
                setTimeout(() => {
                    chatbotContainer.style.display = "none";
                    chatbotToggle.style.display = "block";
                }, 300);
            });
        }

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
                welcomeP.innerHTML = "Bot: Hi! I’m here to help with Social Security, Medicare, Medicaid, housing, and more. Ask anything—like 'How do I replace my card?' or 'When can I start collecting?'!";
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
            typingP.className = "chatbot-typing";
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
            // Retirement Benefits (expanded)
            if (message.includes("when can i start") || message.includes("collecting")) return "Start at 62 (reduced, e.g., 70% if FRA is 67), full at FRA (66-67), or delay to 70 (8% more/year). Ex: $2,000 at 67 becomes $1,400 at 62 or $2,480 at 70. <a href='https://www.ssa.gov/benefits/retirement/planner/ageincrease.html' target='_blank'>Learn more</a>.";
            if (message.includes("work and collect") || message.includes("working")) return "Before FRA, 2025 limit is $22,320—$1 cut per $2 over. No limit after FRA. Ex: Earning $30,000 at 63 cuts $320/month until FRA. <a href='https://www.ssa.gov/benefits/retirement/planner/whileworking.html' target='_blank'>Details</a>.";
            if (message.includes("how do i apply") || message.includes("application")) return "Apply online 4 months early at My SSA, call 1-800-772-1213, or visit an office. Takes time, so start 3 months ahead! <a href='https://www.ssa.gov/benefits/retirement/apply.html' target='_blank'>Apply now</a>.";
            if (message.includes("maximum benefit") || message.includes("how much")) return "2025 max at FRA is $3,822/month, based on 35 top years. Ex: $50,000/year avg might get $1,800. <a href='https://www.ssa.gov/oact/cola/latestCOLA.html' target='_blank'>Updates</a>.";
            if (message.includes("delay") || message.includes("wait")) return "Delay to 70 boosts 8%/year past FRA (e.g., $2,000 at 67 becomes $2,480 at 70). <a href='https://www.ssa.gov/benefits/retirement/planner/delayret.html' target='_blank'>More</a>.";
            if (message.includes("retirement age") || message.includes("full retirement")) return "FRA is 66-67 (e.g., 67 for 1960+). 62 reduces, 70 increases. <a href='https://www.ssa.gov/benefits/retirement/planner/ageincrease.html' target='_blank'>Details</a>.";
            if (message.includes("spousal benefits") || message.includes("spouse")) return "Up to 50% of spouse’s FRA benefit if higher. Ex: Spouse gets $2,200, you get $1,100. <a href='https://www.ssa.gov/benefits/retirement/planner/applying7.html' target='_blank'>More</a>.";
            if (message.includes("divorced") || message.includes("ex spouse")) return "Married 10+ years, unmarried now? Get up to 50% of ex’s at 62+. <a href='https://www.ssa.gov/benefits/retirement/planner/divspouse.html' target='_blank'>Details</a>.";
            if (message.includes("survivor benefits") || message.includes("widow")) return "Widow(er)s get up to 100% at FRA, 71.5% at 60. Kids get 75%. <a href='https://www.ssa.gov/benefits/survivors/' target='_blank'>Survivor info</a>.";
            if (message.includes("child benefits") || message.includes("kids")) return "Kids under 18 (or 19 in school) get 50% (retired/disabled) or 75% (deceased). <a href='https://www.ssa.gov/benefits/retirement/planner/applying8.html' target='_blank'>Details</a>.";
            if (message.includes("early retirement") || message.includes("62")) return "At 62, benefits drop (e.g., $2,000 at 67 becomes $1,400). Earnings limit until FRA. <a href='https://www.ssa.gov/benefits/retirement/planner/1943.html' target='_blank'>Early retirement</a>.";
            if (message.includes("benefit estimate") || message.includes("how much will i get")) return "Based on 35 top years. Ex: $50,000/year avg might get $1,800 at FRA. Use My SSA. <a href='https://www.ssa.gov/estimator/' target='_blank'>Estimate tool</a>.";

            // Disability Benefits (expanded)
            if (message.includes("ssdi") || message.includes("disability insurance")) return "SSDI for workers with credits (e.g., 40 total, 20 in last 10 years) unable to work 12+ months. Avg $1,500/month, 5-month wait. Ex: John gets $1,700 after a crash. <a href='https://www.ssa.gov/benefits/disability/qualify.html' target='_blank'>Qualify info</a>.";
            if (message.includes("ssi") || message.includes("supplemental security")) return "SSI for low-income (under $2,000 resources) with disability, blind, or 65+. Up to $943/month in 2025. Ex: Maria gets $943 with no work history. <a href='https://www.ssa.gov/ssi/text-eligibility-ussi.htm' target='_blank'>Eligibility</a>.";
            if (message.includes("disability definition") || message.includes("disabled")) return "Can’t work due to a severe condition lasting 12+ months or fatal. <a href='https://www.ssa.gov/disability/professionals/bluebook/general-info.htm' target='_blank'>Criteria</a>.";
            if (message.includes("disability apply") || message.includes("how apply disability")) return "Apply online, call 1-800-772-1213, or visit. Takes 3-5 months—need medical records, work history. <a href='https://www.ssa.gov/benefits/disability/apply.html' target='_blank'>Apply</a>.";
            if (message.includes("disability waiting") || message.includes("how long")) return "SSDI: 5-month wait post-approval, back payments possible. Takes 3-5 months to process. <a href='https://www.ssa.gov/disabilityfacts/facts.html' target='_blank'>Facts</a>.";
            if (message.includes("disability work") || message.includes("work disabled")) return "Trial Work: 9 months over $1,110/month in 2025, benefits stay. Ex: Sarah earns $1,500/month part-time, keeps $1,200 SSDI. <a href='https://www.ssa.gov/disability/disability_planner3.htm' target='_blank'>Work rules</a>.";
            if (message.includes("ticket to work") || message.includes("vocational")) return "Free program to help return to work while on SSDI/SSI. <a href='https://www.ssa.gov/work/' target='_blank'>Ticket info</a>.";
            if (message.includes("disability appeal") || message.includes("denied")) return "Appeal within 60 days if denied (2/3 are). Steps: reconsideration, hearing, etc. Ex: Mike wins after 8 months with new proof. <a href='https://www.ssa.gov/benefits/disability/appeal.html' target='_blank'>Process</a>.";

            // Medicare
            if (message.includes("medicare start") || message.includes("when medicare")) return "Sign up 3 months before 65, or after 24 months of disability benefits. <a href='https://www.ssa.gov/medicare/sign-up' target='_blank'>Sign-up info</a>.";
            if (message.includes("cms-40b") || message.includes("part b apply")) return "CMS-40B enrolls you in Part B during special periods or with Part A. <a href='https://www.cms.gov/medicare/cms-forms/cms-forms/downloads/cms40b-e.pdf' target='_blank'>Download</a>.";
            if (message.includes("cms-l564") || message.includes("employment information")) return "CMS-L564 proves employer coverage for Part B special enrollment. <a href='https://www.cms.gov/medicare/cms-forms/cms-forms/downloads/cms-l564e.pdf' target='_blank'>Download</a>.";
            if (message.includes("ssa-44") || message.includes("income adjustment")) return "SSA-44 lowers Part B/D premiums if income drops. <a href='https://www.ssa.gov/forms/ssa-44.pdf' target='_blank'>Download</a>.";
            if (message.includes("medicare cost") || message.includes("premiums")) return "2025 Part B: $185/month (more if income > $103,000). Part A free with 10 years work. Part C/D vary. <a href='https://www.medicare.gov/basics/costs' target='_blank'>Costs</a>.";
            if (message.includes("part d") || message.includes("prescription")) return "Part D covers drugs. Add it to Original Medicare or get it with Part C. ~$40/month avg in 2025. <a href='https://www.medicare.gov/drug-coverage-part-d' target='_blank'>Part D info</a>.";
            if (message.includes("medicare advantage") || message.includes("part c")) return "Part C is a private plan bundling A, B, often D. May add extras like dental. Stick to network doctors. <a href='https://www.medicare.gov/what-medicare-covers/medicare-advantage-plans' target='_blank'>Advantage info</a>.";
            if (message.includes("medigap") || message.includes("supplemental")) return "Medigap helps pay costs Original Medicare doesn’t, like copays. Private plans, costs vary. <a href='https://www.medicare.gov/supplements-other-insurance' target='_blank'>Medigap info</a>.";
            if (message.includes("how medicare works") || message.includes("medicare plans")) return "Medicare has two paths: Original (A & B) = government-run, any doctor, add D or Medigap. Advantage (C) = private, bundles A/B/D, network doctors, often extras. <a href='https://www.medicare.gov/basics/get-started-with-medicare' target='_blank'>Learn more</a>.";
            if (message.includes("original medicare")) return "Original Medicare (A & B) is government-run. Part A for hospitals, B for doctors. Any Medicare doctor, but you pay deductibles + 20%. Add D or Medigap if needed. <a href='https://www.medicare.gov/what-medicare-covers/original-medicare' target='_blank'>Details</a>.";

            // Medicaid
            if (message.includes("medicaid qualify") || message.includes("who qualifies for medicaid")) return "Low-income, disabled, elderly, kids, and pregnant women may qualify—varies by state. <a href='https://www.medicaid.gov/medicaid/eligibility/index.html' target='_blank'>Eligibility</a>.";
            if (message.includes("medicaid apply") || message.includes("how apply medicaid")) return "Apply via your state’s Medicaid office or HealthCare.gov. <a href='https://www.medicaid.gov/medicaid/how-apply/index.html' target='_blank'>Apply info</a>.";
            if (message.includes("medicaid coverage") || message.includes("what does medicaid cover")) return "Covers doctor visits, hospital stays, prescriptions—details vary by state. <a href='https://www.medicaid.gov/medicaid/benefits/index.html' target='_blank'>Coverage</a>.";
            if (message.includes("medicaid medicare") || message.includes("dual eligible")) return "If eligible for both, Medicare pays first, Medicaid covers extras (e.g., premiums, long-term care). <a href='https://www.medicaid.gov/medicaid/eligibility/medicaid-medicare-dual-eligibility/index.html' target='_blank'>Dual eligibility</a>.";
            if (message.includes("snap") || message.includes("food stamps")) return "SNAP helps low-income households buy food if income ≤ 130% poverty line (e.g., $2,694/month for 3 in 2025). Apply via your state. <a href='https://www.usa.gov/food-stamps' target='_blank'>SNAP info</a>.";
            if (message.includes("qmb") || message.includes("qualified medicare beneficiary")) return "QMB pays Medicare A/B premiums, deductibles, copays for low-income (≤ $1,275/month individual, 2025). <a href='https://www.cms.gov/medicare/medicaid-coordination/medicare-medicaid-coordination-office/qmb' target='_blank'>QMB details</a>.";

            // Housing Assistance
            if (message.includes("housing assistance") || message.includes("section 8")) return "Section 8 vouchers and public housing help low-income families (income ≤ 50% area median). Apply via local PHA. <a href='https://www.hud.gov/topics/rental_assistance' target='_blank'>HUD Rental Assistance</a>.";
            if (message.includes("housing apply") || message.includes("how apply housing")) return "Contact your local Public Housing Agency (PHA). Waitlists common. <a href='https://apps.hud.gov/apps/section8/' target='_blank'>Find your PHA</a>.";
            if (message.includes("housing eligibility") || message.includes("who qualifies housing")) return "Income ≤ 50% area median (e.g., $36,750 for 4 in 2025, varies). Priority for ≤ 30%. <a href='https://www.hud.gov/program_offices/public_indian_housing/programs/hcv/about' target='_blank'>Eligibility</a>.";

            // General SSA Policy
            if (message.includes("payment dates") || message.includes("when paid")) return "Birth date: 1st-10th (2nd Wed), 11th-20th (3rd Wed), 21st-31st (4th Wed). <a href='https://www.ssa.gov/pubs/EN-05-10031-2025.pdf' target='_blank'>2025 Schedule</a>.";
            if (message.includes("appeal") || message.includes("denied")) return "Appeal within 60 days: reconsideration, hearing, Appeals Council, court. Ex: Mike wins after 8 months with new proof. <a href='https://www.ssa.gov/benefits/disability/appeal.html' target='_blank'>Process</a>.";
            if (message.includes("work credits") || message.includes("credits")) return "40 credits (10 years) for retirement, less for SSDI (e.g., 20 in 10 years). $1,730/credit in 2025. <a href='https://www.ssa.gov/oact/cola/QC.html' target='_blank'>Credit info</a>.";
            if (message.includes("overpayment") || message.includes("owe money")) return "Repay or request waiver if not your fault and can’t afford. <a href='https://www.ssa.gov/overpayments/' target='_blank'>Overpayment</a>.";
            if (message.includes("cola") || message.includes("cost of living")) return "2025 COLA: 2.5%, ~$48/month more. <a href='https://www.ssa.gov/cola/' target='_blank'>Details</a>.";
            if (message.includes("tax") || message.includes("taxed")) return "50-85% taxable if income > $25,000 (single) or $32,000 (joint). <a href='https://www.ssa.gov/benefits/retirement/planner/taxes.html' target='_blank'>Tax info</a>.";
            if (message.includes("replace") || message.includes("card") || message.includes("new card")) return "Replace or get a new card online with My SSA (18+, U.S. address) or mail Form SS-5. Kids need birth certificate + parent ID. Adults need birth certificate + ID. Name change needs marriage doc + ID. Might need an appointment—call 1-800-772-1213 or book at <a href='https://www.ssa.gov/agency/contact/' target='_blank'>SSA Contact</a>. <a href='https://www.ssa.gov/myaccount/replacement-card.html' target='_blank'>Start here</a>.";
            if (message.includes("my ssa") || message.includes("account")) return "My SSA for benefits, statements, card replacement. <a href='https://www.ssa.gov/myaccount/' target='_blank'>Sign up</a>.";
            if (message.includes("fra") || message.includes("full retirement age")) return "FRA: 66-67 (e.g., 67 for 1960+). Early reduces, delay increases. <a href='https://www.ssa.gov/benefits/retirement/planner/ageincrease.html' target='_blank'>Chart</a>.";
            if (message.includes("dependent benefits") || message.includes("dependents")) return "Spouse/kids get 50% of your benefit; family max 150-180%. <a href='https://www.ssa.gov/benefits/retirement/planner/applying8.html' target='_blank'>Details</a>.";
            if (message.includes("move") || message.includes("address change")) return "Update via My SSA, 1-800-772-1213, or office. <a href='https://www.ssa.gov/myaccount/change-address.html' target='_blank'>Change address</a>.";
            if (message.includes("direct deposit") || message.includes("payment method")) return "Set up via My SSA or 1-800-772-1213. <a href='https://www.ssa.gov/deposit/' target='_blank'>Direct deposit</a>.";
            if (message.includes("fraud") || message.includes("scam")) return "Report to 1-800-269-0271 or online. Don’t share SSN with callers. <a href='https://www.ssa.gov/fraud/' target='_blank'>Fraud info</a>.";
            if (message.includes("contact ssa") || message.includes("phone")) return "1-800-772-1213 (7am-7pm, M-F) or local office. <a href='https://www.ssa.gov/agency/contact/' target='_blank'>Contact</a>.";
            if (message.includes("benefit verification") || message.includes("proof")) return "Get letter via My SSA for income proof. <a href='https://www.ssa.gov/myaccount/proof-of-benefits.html' target='_blank'>Get letter</a>.";
            if (message.includes("foreign work") || message.includes("work abroad")) return "Foreign work may count if from a country with an SSA agreement. <a href='https://www.ssa.gov/international/' target='_blank'>International</a>.";
            if (message.includes("self employed") || message.includes("self-employment")) return "Self-employed pay 12.4% SS tax, earn credits like employees. <a href='https://www.ssa.gov/oact/cola/self.html' target='_blank'>Self-employment</a>.";
            if (message.includes("military") || message.includes("veteran")) return "Military service may boost credits (e.g., $300/quarter pre-1978). <a href='https://www.ssa.gov/people/veterans/' target='_blank'>Veterans</a>.";
            return "I’m not sure! Ask something specific or visit <a href='https://www.ssa.gov' target='_blank'>SSA.gov</a>.";
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

    // Back to Top Button
    const backToTop = document.getElementById("back-to-top");
    if (backToTop) {
        window.addEventListener("scroll", function () {
            backToTop.style.display = window.scrollY > 200 ? "block" : "none";
        });
        backToTop.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // Quiz
    const quizForm = document.getElementById("quiz-form");
    if (quizForm) {
        quizForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const finance = document.querySelector("input[name='finance']:checked")?.value;
            const job = document.querySelector("input[name='job']:checked")?.value;
            const age = parseInt(document.getElementById("quiz-age").value);
            const resultP = document.getElementById("quiz-result");

            if (!finance || !job || !age) {
                resultP.textContent = "Please answer all questions!";
                return;
            }

            let advice = "Consider retiring ";
            if (finance === "yes" && job === "no" && age >= 62) advice += "now—you’re ready!";
            else if (finance === "no") advice += "later—build your savings.";
            else if (job === "yes") advice += "when ready to stop working.";
            else if (age < 62) advice += "at 62 or later.";
            else advice += "at FRA (66-67).";

            resultP.textContent = advice;
        });
    }

    // Submit a Question Form (simulated)
    const questionForm = document.getElementById("question-form");
    if (questionForm) {
        questionForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const question = document.getElementById("user-question").value;
            const email = document.getElementById("user-email").value;
            const responseP = document.getElementById("form-response");
            responseP.textContent = `Thanks for your question: "${question}"! We’ll reply to ${email} soon.`;
            questionForm.reset();
        });
    }

    // Comments Section
    const commentForm = document.getElementById("comment-form");
    const commentList = document.getElementById("comment-list");
    if (commentForm) {
        loadComments();
        commentForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const name = document.getElementById("comment-name").value;
            const text = document.getElementById("comment-text").value;
            const comment = { name, text, date: new Date().toLocaleString() };
            const comments = JSON.parse(localStorage.getItem("comments") || "[]");
            comments.push(comment);
            localStorage.setItem("comments", JSON.stringify(comments));
            displayComment(comment);
            commentForm.reset();
        });
    }

    function displayComment(comment) {
        const div = document.createElement("div");
        div.className = "comment";
        div.innerHTML = `<strong>${comment.name}</strong> (${comment.date}): ${comment.text}`;
        commentList.appendChild(div);
    }

    function loadComments() {
        const comments = JSON.parse(localStorage.getItem("comments") || "[]");
        comments.forEach(displayComment);
    }

    // Thank You Message on Page Exit (only for external exits or tab close)
    const thankYouDiv = document.createElement("div");
    thankYouDiv.id = "thank-you-message";
    thankYouDiv.textContent = "Thank you for visiting Social Security Answers!";
    document.body.appendChild(thankYouDiv);

    // Track navigation clicks to detect internal links
    const navLinks = document.querySelectorAll("nav ul li a");
    let isInternalNavigation = false;

    navLinks.forEach(link => {
        link.addEventListener("click", function (e) {
            const href = this.getAttribute("href");
            if (pages.some(page => page.url === href)) {
                isInternalNavigation = true; // Mark as internal navigation
            }
        });
    });

    window.addEventListener("beforeunload", function (e) {
        if (!isInternalNavigation) {
            thankYouDiv.classList.add("show");
            setTimeout(() => {
                thankYouDiv.classList.remove("show");
            }, 2000); // Fade out after 2 seconds
            e.preventDefault();
            e.returnValue = ""; // Trigger browser confirmation (though modern browsers may ignore custom text)
        }
        isInternalNavigation = false; // Reset flag
    });
});