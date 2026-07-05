document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const primaryInput = document.getElementById('primary-input');
    const secondaryInput = document.getElementById('secondary-input');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultElement = document.getElementById('result');
    const primaryError = document.getElementById('primary-error');
    const secondaryError = document.getElementById('secondary-error');
    
    const pageDots = document.querySelectorAll('.page-dot');
    
    const nextBtn1 = document.getElementById('next-btn1');
    const nextBtn2 = document.getElementById('next-btn2');
    const nextBtn3 = document.getElementById('next-btn3');
    const nextBtn4 = document.getElementById('next-btn4');
    const nextBtn5 = document.getElementById('next-btn5');
    const prevBtn1 = document.getElementById('prev-btn1');
    const prevBtn2 = document.getElementById('prev-btn2');
    const prevBtn3 = document.getElementById('prev-btn3');
    const prevBtn4 = document.getElementById('prev-btn4');
    const prevBtn5 = document.getElementById('prev-btn5');
    
    const sendBtn = document.getElementById('send-btn');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    
    let currentPage = 1;
    const totalPages = 5;
    
    // Grade to marks mapping
    const gradeMarks = { 0: 0, 2: 2, 4: 4, 6: 6, 8: 8, 10: 10, 12: 12, 14: 14, 16: 16, 18: 18 };
    
    // ========== PAGE NAVIGATION ==========
    function goToPage(pageNumber) {
        if (pageNumber === currentPage) return;
        if (pageNumber < 1 || pageNumber > totalPages) return;
        
        const currentPageElement = document.getElementById(`page${currentPage}`);
        if (currentPageElement) currentPageElement.classList.remove('active');
        
        pageDots.forEach(dot => {
            if (parseInt(dot.dataset.page) === currentPage) {
                dot.classList.remove('active');
            }
        });
        
        currentPage = pageNumber;
        
        setTimeout(() => {
            const newPageElement = document.getElementById(`page${currentPage}`);
            if (newPageElement) newPageElement.classList.add('active');
            
            pageDots.forEach(dot => {
                if (parseInt(dot.dataset.page) === currentPage) {
                    dot.classList.add('active');
                }
            });
        }, 50);
    }
    
    // Setup navigation buttons
    if (nextBtn1) nextBtn1.addEventListener('click', () => goToPage(2));
    if (nextBtn2) nextBtn2.addEventListener('click', () => goToPage(3));
    if (nextBtn3) nextBtn3.addEventListener('click', () => goToPage(4));
    if (nextBtn4) nextBtn4.addEventListener('click', () => goToPage(5));
    if (nextBtn5) nextBtn5.addEventListener('click', () => goToPage(1));
    
    if (prevBtn1) prevBtn1.addEventListener('click', () => goToPage(1));
    if (prevBtn2) prevBtn2.addEventListener('click', () => goToPage(1));
    if (prevBtn3) prevBtn3.addEventListener('click', () => goToPage(2));
    if (prevBtn4) prevBtn4.addEventListener('click', () => goToPage(3));
    if (prevBtn5) prevBtn5.addEventListener('click', () => goToPage(4));
    
    pageDots.forEach(dot => {
        dot.addEventListener('click', function() {
            goToPage(parseInt(this.dataset.page));
        });
    });
    
    window.goToPage = goToPage;
    
    // ========== KEYBOARD NAVIGATION ==========
    document.addEventListener('keydown', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            let nextPage = currentPage + 1;
            if (nextPage > totalPages) nextPage = 1;
            goToPage(nextPage);
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            let prevPage = currentPage - 1;
            if (prevPage < 1) prevPage = totalPages;
            goToPage(prevPage);
        }
    });
    
    // ========== FUNCTION 1: MERIT CALCULATOR (Page 2) ==========
    function calculateMerit() {
        if (!primaryInput || !secondaryInput || !resultElement) return;
        
        const primaryValue = parseFloat(primaryInput.value);
        const secondaryValue = parseFloat(secondaryInput.value);
        let isValid = true;
        
        if (primaryError) primaryError.classList.remove('show');
        if (secondaryError) secondaryError.classList.remove('show');
        if (primaryInput) primaryInput.classList.remove('error');
        if (secondaryInput) secondaryInput.classList.remove('error');
        
        if (isNaN(primaryValue) || primaryValue < 0 || primaryValue > 90) {
            if (primaryInput) primaryInput.classList.add('error');
            if (primaryError) {
                primaryError.textContent = primaryValue > 90 ? "Academic marks cannot exceed 90%" : "Please enter a number between 0 and 90";
                primaryError.classList.add('show');
            }
            isValid = false;
        }
        
        if (isNaN(secondaryValue) || secondaryValue < 0 || secondaryValue > 10) {
            if (secondaryInput) secondaryInput.classList.add('error');
            if (secondaryError) {
                secondaryError.textContent = secondaryValue > 10 ? "Co-curricular marks cannot exceed 10%" : "Please enter a number between 0 and 10";
                secondaryError.classList.add('show');
            }
            isValid = false;
        }
        
        if (isValid) {
            const meritPercentage = primaryValue + secondaryValue;
            resultElement.textContent = meritPercentage.toFixed(2);
            
            const resultContainer = document.querySelector('.result-container');
            if (resultContainer) {
                if (meritPercentage >= 90) {
                    resultContainer.style.borderColor = '#2ecc71';
                    resultContainer.style.background = 'linear-gradient(to right, #f8f9fa, #e8f6ef)';
                } else if (meritPercentage >= 70) {
                    resultContainer.style.borderColor = '#f39c12';
                    resultContainer.style.background = 'linear-gradient(to right, #f8f9fa, #fef9e7)';
                } else {
                    resultContainer.style.borderColor = '#e74c3c';
                    resultContainer.style.background = 'linear-gradient(to right, #f8f9fa, #fdedec)';
                }
            }
            
            resultElement.style.transform = 'scale(1.1)';
            setTimeout(() => { if (resultElement) resultElement.style.transform = 'scale(1)'; }, 200);
        } else {
            resultElement.textContent = "0";
        }
    }
    
    if (calculateBtn) calculateBtn.addEventListener('click', calculateMerit);
    if (primaryInput && secondaryInput) {
        primaryInput.addEventListener('input', calculateMerit);
        secondaryInput.addEventListener('input', calculateMerit);
    }
    
    // ========== FUNCTION 2: SPM MULTI-CALCULATOR (Page 1) ==========
    function calculateSPMMerit() {
        let universalTotal = 0;
        ['bm-grade', 'bi-grade', 'math-grade', 'sejarah-grade'].forEach(id => {
            const select = document.getElementById(id);
            if (select) universalTotal += gradeMarks[parseInt(select.value)] || 0;
        });
        const universalMerit = ((universalTotal / 72) * 40).toFixed(2);
        
        const universalTotalEl = document.getElementById('universal-total');
        const universalMeritEl = document.getElementById('universal-merit');
        if (universalTotalEl) universalTotalEl.textContent = universalTotal;
        if (universalMeritEl) universalMeritEl.textContent = universalMerit;
        
        const packageType = document.querySelector('input[name="package-type"]:checked');
        let pakejTotal = 0;
        let pakejMerit = 0;
        
        if (packageType) {
            const select1 = document.getElementById('pakej1-grade');
            const select2 = document.getElementById('pakej2-grade');
            const score1 = select1 ? gradeMarks[parseInt(select1.value)] || 0 : 0;
            const score2 = select2 ? gradeMarks[parseInt(select2.value)] || 0 : 0;
            
            if (packageType.value === 'stem-ab') {
                pakejTotal = score1 + score2;
                pakejMerit = ((pakejTotal / 36) * 30).toFixed(2);
            } else if (packageType.value === 'stem-c') {
                pakejTotal = Math.max(score1, score2);
                pakejMerit = ((pakejTotal / 18) * 30).toFixed(2);
            }
        }
        
        const pakejMarkahEl = document.getElementById('pakej-markah');
        const pakejMeritEl = document.getElementById('pakej-merit');
        if (pakejMarkahEl) pakejMarkahEl.textContent = pakejTotal;
        if (pakejMeritEl) pakejMeritEl.textContent = pakejMerit;
        
        let bestTotal = 0;
        ['best1-grade', 'best2-grade'].forEach(id => {
            const select = document.getElementById(id);
            if (select) bestTotal += gradeMarks[parseInt(select.value)] || 0;
        });
        const bestMerit = ((bestTotal / 36) * 20).toFixed(2);
        
        const bestMarkahEl = document.getElementById('best-markah');
        const bestMeritEl = document.getElementById('best-merit');
        if (bestMarkahEl) bestMarkahEl.textContent = bestTotal;
        if (bestMeritEl) bestMeritEl.textContent = bestMerit;
        
        const totalAcademicMerit = (parseFloat(universalMerit) + parseFloat(pakejMerit) + parseFloat(bestMerit)).toFixed(2);
        
        const finalUniversalEl = document.getElementById('final-universal');
        const finalPakejEl = document.getElementById('final-pakej');
        const finalBestEl = document.getElementById('final-best');
        const totalMeritEl = document.getElementById('total-merit');
        
        if (finalUniversalEl) finalUniversalEl.textContent = universalMerit;
        if (finalPakejEl) finalPakejEl.textContent = pakejMerit;
        if (finalBestEl) finalBestEl.textContent = bestMerit;
        if (totalMeritEl) totalMeritEl.textContent = totalAcademicMerit;
        
        if (primaryInput) primaryInput.value = totalAcademicMerit;
        
        if (totalMeritEl) {
            const total = parseFloat(totalAcademicMerit);
            if (total >= 72) totalMeritEl.style.color = '#2ecc71';
            else if (total >= 54) totalMeritEl.style.color = '#f39c12';
            else totalMeritEl.style.color = '#e74c3c';
        }
        
        document.querySelectorAll('.package-option').forEach(option => {
            const radio = option.querySelector('input[type="radio"]');
            if (radio && radio.checked) option.classList.add('selected');
            else option.classList.remove('selected');
        });
        
        const formulaElement = document.getElementById('formula-breakdown');
        if (formulaElement) {
            let packageFormula = '';
            if (packageType) {
                if (packageType.value === 'stem-ab') packageFormula = `(${pakejTotal} / 36) × 30% = ${pakejMerit}%`;
                else packageFormula = `(${pakejTotal} / 18) × 30% = ${pakejMerit}%`;
            }
            
            formulaElement.innerHTML = `
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 10px; border: 2px solid #e0e6ed;">
                    <h4 style="margin: 0 0 10px 0; color: #2c3e50; text-align: center;">
                        <i class="fas fa-calculator"></i> Calculation Formula (90% Academic)
                    </h4>
                    <div style="display: grid; grid-template-columns: 1fr; gap: 8px;">
                        <div style="display: flex; justify-content: space-between; padding: 8px; background: #f0f8ff; border-radius: 6px;">
                            <span><strong>Universal (40%):</strong></span>
                            <span>(${universalTotal} / 72) × 40% = ${universalMerit}%</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 8px; background: #f0f8ff; border-radius: 6px;">
                            <span><strong>Package (30%):</strong></span>
                            <span>${packageFormula || '(0 / 36) × 30% = 0%'}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 8px; background: #f0f8ff; border-radius: 6px;">
                            <span><strong>Best (20%):</strong></span>
                            <span>(${bestTotal} / 36) × 20% = ${bestMerit}%</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 12px; background: #e8f6ef; border-radius: 6px; margin-top: 5px; border: 1px solid #2ecc71;">
                            <span style="font-weight: bold;">Total Academic Merit:</span>
                            <span style="font-weight: bold;">${universalMerit}% + ${pakejMerit}% + ${bestMerit}% = ${totalAcademicMerit}%</span>
                        </div>
                    </div>
                </div>
            `;
        }
        
        if (calculateBtn) calculateMerit();
    }
    
    const allSelects = ['bm-grade', 'bi-grade', 'math-grade', 'sejarah-grade', 'pakej1-grade', 'pakej2-grade', 'best1-grade', 'best2-grade'];
    allSelects.forEach(id => {
        const select = document.getElementById(id);
        if (select) select.addEventListener('change', calculateSPMMerit);
    });
    
    document.querySelectorAll('input[name="package-type"]').forEach(radio => {
        radio.addEventListener('change', calculateSPMMerit);
    });
    
    document.querySelectorAll('.package-option').forEach(option => {
        option.addEventListener('click', function() {
            const radio = this.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
                calculateSPMMerit();
            }
        });
    });
    
    // ========== FUNCTION 3: AI CAREER ADVISOR (WITH CLICKABLE BUTTONS) ==========
    const analyzeBtn = document.getElementById('analyze-btn');
    const fieldInterest = document.getElementById('field-interest');
    const totalMeritInput = document.getElementById('total-merit-input');
    const aiResults = document.getElementById('ai-results');
    
    // Function to calculate match percentage
    function calculateMatchPercentage(meritScore, minRequirement, maxRequirement) {
        if (meritScore >= maxRequirement) return 95 + Math.floor(Math.random() * 5);
        if (meritScore >= minRequirement) {
            const range = maxRequirement - minRequirement;
            const position = meritScore - minRequirement;
            return Math.floor(60 + (position / range) * 34);
        }
        if (meritScore >= minRequirement - 10) {
            return Math.floor(40 + ((meritScore - (minRequirement - 10)) / 10) * 19);
        }
        return Math.floor(10 + (meritScore / (minRequirement - 10)) * 29);
    }
    
    // University website URLs (official links)
    const universityWebsites = {
        "University of Malaya (UM)": "https://www.um.edu.my",
        "Universiti Sains Malaysia (USM)": "https://www.usm.my",
        "Universiti Kebangsaan Malaysia (UKM)": "https://www.ukm.my",
        "Universiti Putra Malaysia (UPM)": "https://www.upm.edu.my",
        "Universiti Teknologi Malaysia (UTM)": "https://www.utm.my",
        "Universiti Utara Malaysia (UUM)": "https://www.uum.edu.my",
        "Universiti Malaysia Sabah (UMS)": "https://www.ums.edu.my",
        "Universiti Malaysia Sarawak (UNIMAS)": "https://www.unimas.my",
        "International Islamic University Malaysia (IIUM)": "https://www.iium.edu.my",
        "Taylor's University": "https://www.taylors.edu.my",
        "Sunway University": "https://www.sunway.edu.my",
        "Monash University Malaysia": "https://www.monash.edu.my",
        "University of Nottingham Malaysia": "https://www.nottingham.edu.my",
        "Heriot-Watt University Malaysia": "https://www.hw.edu.my",
        "Universiti Teknologi PETRONAS (UTP)": "https://www.utp.edu.my",
        "Universiti Tenaga Nasional (UNITEN)": "https://www.uniten.edu.my",
        "Universiti Pendidikan Sultan Idris (UPSI)": "https://www.upsi.edu.my",
        "SEGi University": "https://www.segi.edu.my",
        "HELP University": "https://www.help.edu.my",
        "Universiti Malaysia Kelantan (UMK)": "https://www.umk.edu.my",
        "Universiti Sultan Zainal Abidin (UniSZA)": "https://www.unisza.edu.my",
        "Universiti Teknologi MARA (UiTM)": "https://www.uitm.edu.my",
        "INTI International University": "https://www.inti.edu.my",
        "Asia Pacific University (APU)": "https://www.apu.edu.my",
        "Multimedia University (MMU)": "https://www.mmu.edu.my",
        "Universiti Teknikal Malaysia Melaka (UTeM)": "https://www.utem.edu.my",
        "Universiti Malaysia Pahang (UMP)": "https://www.ump.edu.my",
        "IMU University": "https://www.imu.edu.my",
        "MAHSA University": "https://www.mahsa.edu.my",
        "Quest International University (QIU)": "https://www.qiu.edu.my"
    };
    
    // Career resource URLs
    const careerResources = {
        "Medical Doctor": "https://www.mma.org.my",
        "Pharmacist": "https://www.mps.org.my",
        "Research Scientist": "https://www.akademisains.gov.my",
        "Biotechnologist": "https://www.biotek.gov.my",
        "Environmental Scientist": "https://www.doe.gov.my",
        "Food Technologist": "https://www.mafoodtech.org",
        "Chemist": "https://www.ikm.org.my",
        "Microbiologist": "https://www.msam.org.my",
        "Teacher/Lecturer": "https://www.moe.gov.my",
        "Psychologist": "https://www.psysa.org",
        "Journalist": "https://www.mpi.com.my",
        "Content Writer": "https://www.mcc.org.my",
        "Graphic Designer": "https://www.reka.org.my",
        "Event Manager": "https://www.mace.org.my",
        "Accountant": "https://www.mia.org.my",
        "Financial Analyst": "https://www.mfpc.org.my",
        "Marketing Manager": "https://www.mma.org.my",
        "Business Consultant": "https://www.mcc.org.my",
        "Banking Officer": "https://www.abm.org.my",
        "Entrepreneur": "https://www.sme.com.my",
        "Civil Engineer": "https://www.myiem.org.my",
        "Electrical Engineer": "https://www.myaee.org",
        "Mechanical Engineer": "https://www.myiem.org.my",
        "Chemical Engineer": "https://www.icheme.org",
        "Petroleum Engineer": "https://www.mogsc.org",
        "Aerospace Engineer": "https://www.myaero.org",
        "Software Developer": "https://www.msia.org.my",
        "Cybersecurity Analyst": "https://www.cybersecurity.my",
        "AI/Machine Learning Engineer": "https://www.mydigital.org",
        "Data Scientist": "https://www.mydata.org",
        "Cloud Architect": "https://www.mycert.org.my",
        "DevOps Engineer": "https://www.msia.org.my",
        "Dentist": "https://www.mda.org.my",
        "Nurse": "https://www.mma.org.my",
        "Physiotherapist": "https://www.mpa.net.my",
        "Medical Lab Technologist": "https://www.mymedlab.org"
    };
    
    // EXPANDED UNIVERSITY DATABASE
    const recommendations = {
        science: {
            universities: [
                { name: "University of Malaya (UM)", location: "Kuala Lumpur", minMerit: 88, maxMerit: 100, budget: "Medium-High", rating: 5, type: "Public Research", ranking: "#1 Malaysia" },
                { name: "Universiti Sains Malaysia (USM)", location: "Penang", minMerit: 82, maxMerit: 95, budget: "Medium", rating: 5, type: "APEX University", ranking: "#2 Malaysia" },
                { name: "Universiti Kebangsaan Malaysia (UKM)", location: "Selangor", minMerit: 80, maxMerit: 93, budget: "Medium", rating: 5, type: "Research University", ranking: "#3 Malaysia" },
                { name: "Universiti Putra Malaysia (UPM)", location: "Selangor", minMerit: 75, maxMerit: 90, budget: "Medium", rating: 4, type: "Research University", ranking: "#4 Malaysia" },
                { name: "Universiti Teknologi Malaysia (UTM)", location: "Johor", minMerit: 78, maxMerit: 92, budget: "Medium", rating: 4, type: "Technical University", ranking: "#5 Malaysia" },
                { name: "Monash University Malaysia", location: "Selangor", minMerit: 85, maxMerit: 100, budget: "Very High", rating: 5, type: "International Branch", ranking: "Top 50 World" },
                { name: "University of Nottingham Malaysia", location: "Selangor", minMerit: 80, maxMerit: 96, budget: "High", rating: 5, type: "International Branch", ranking: "Top 100 World" },
                { name: "Taylor's University", location: "Selangor", minMerit: 70, maxMerit: 88, budget: "High", rating: 4, type: "Private", ranking: "Top Private University" }
            ],
            careers: [
                { name: "Medical Doctor", demand: "High", salary: "RM 8,000-20,000", education: "Degree in Medicine (5-6 years)", minMerit: 90 },
                { name: "Pharmacist", demand: "Medium", salary: "RM 5,000-10,000", education: "Pharmacy Degree (4 years)", minMerit: 85 },
                { name: "Research Scientist", demand: "Medium", salary: "RM 5,000-12,000", education: "Master's/PhD", minMerit: 75 },
                { name: "Biotechnologist", demand: "Growing", salary: "RM 4,000-9,000", education: "Biotechnology Degree", minMerit: 70 }
            ],
            courses: ["Medicine & Surgery", "Pharmacy", "Biotechnology", "Biomedical Science", "Nutrition", "Chemistry"]
        },
        arts: {
            universities: [
                { name: "University of Malaya (UM)", location: "Kuala Lumpur", minMerit: 75, maxMerit: 92, budget: "Medium", rating: 5, type: "Public Research", ranking: "#1 Malaysia" },
                { name: "Universiti Sains Malaysia (USM)", location: "Penang", minMerit: 70, maxMerit: 88, budget: "Medium", rating: 4, type: "APEX University", ranking: "#2 Malaysia" },
                { name: "Universiti Pendidikan Sultan Idris (UPSI)", location: "Perak", minMerit: 62, maxMerit: 80, budget: "Low", rating: 4, type: "Education University", ranking: "Top Education Specialist" },
                { name: "Taylor's University", location: "Selangor", minMerit: 65, maxMerit: 85, budget: "High", rating: 4, type: "Private", ranking: "Top Private University" }
            ],
            careers: [
                { name: "Teacher/Lecturer", demand: "High", salary: "RM 3,000-8,000", education: "Education Degree", minMerit: 65 },
                { name: "Psychologist", demand: "Medium", salary: "RM 4,000-10,000", education: "Psychology Degree + Master's", minMerit: 75 },
                { name: "Journalist", demand: "Medium", salary: "RM 3,000-7,000", education: "Mass Communication", minMerit: 68 }
            ],
            courses: ["Education", "Mass Communication", "Psychology", "Linguistics", "Graphic Design", "History"]
        },
        commerce: {
            universities: [
                { name: "University of Malaya (UM)", location: "Kuala Lumpur", minMerit: 82, maxMerit: 96, budget: "Medium-High", rating: 5, type: "Public Research", ranking: "#1 Malaysia" },
                { name: "Universiti Utara Malaysia (UUM)", location: "Kedah", minMerit: 72, maxMerit: 88, budget: "Medium", rating: 5, type: "Management University", ranking: "#1 Business School" },
                { name: "Universiti Teknologi MARA (UiTM)", location: "Various", minMerit: 65, maxMerit: 82, budget: "Low", rating: 4, type: "Public University", ranking: "Largest University" },
                { name: "Taylor's University", location: "Selangor", minMerit: 70, maxMerit: 88, budget: "High", rating: 4, type: "Private", ranking: "Top Private Business School" }
            ],
            careers: [
                { name: "Accountant", demand: "High", salary: "RM 4,000-12,000", education: "Accounting Degree + Professional Cert", minMerit: 75 },
                { name: "Financial Analyst", demand: "High", salary: "RM 5,000-15,000", education: "Finance/Economics Degree", minMerit: 78 },
                { name: "Marketing Manager", demand: "Medium", salary: "RM 4,000-10,000", education: "Marketing/Business Degree", minMerit: 70 }
            ],
            courses: ["Accounting", "Finance", "Business Administration", "Marketing", "Economics", "Banking"]
        },
        engineering: {
            universities: [
                { name: "Universiti Teknologi Malaysia (UTM)", location: "Johor", minMerit: 78, maxMerit: 94, budget: "Medium", rating: 5, type: "Technical University", ranking: "#1 Engineering" },
                { name: "University of Malaya (UM)", location: "Kuala Lumpur", minMerit: 82, maxMerit: 98, budget: "Medium-High", rating: 5, type: "Research University", ranking: "#1 Malaysia" },
                { name: "Universiti Sains Malaysia (USM)", location: "Penang", minMerit: 76, maxMerit: 92, budget: "Medium", rating: 4, type: "APEX University", ranking: "#2 Malaysia" },
                { name: "Monash University Malaysia", location: "Selangor", minMerit: 82, maxMerit: 98, budget: "Very High", rating: 5, type: "International Branch", ranking: "Top 50 World" }
            ],
            careers: [
                { name: "Civil Engineer", demand: "High", salary: "RM 4,000-12,000", education: "Civil Engineering Degree", minMerit: 72 },
                { name: "Electrical Engineer", demand: "High", salary: "RM 4,000-12,000", education: "Electrical Engineering", minMerit: 72 },
                { name: "Mechanical Engineer", demand: "High", salary: "RM 4,000-12,000", education: "Mechanical Engineering", minMerit: 72 }
            ],
            courses: ["Civil Engineering", "Electrical Engineering", "Mechanical Engineering", "Chemical Engineering", "Aerospace Engineering"]
        },
        it: {
            universities: [
                { name: "University of Malaya (UM)", location: "Kuala Lumpur", minMerit: 78, maxMerit: 95, budget: "Medium", rating: 5, type: "Public Research", ranking: "#1 Malaysia" },
                { name: "Universiti Teknologi Malaysia (UTM)", location: "Johor", minMerit: 76, maxMerit: 92, budget: "Medium", rating: 5, type: "Technical University", ranking: "#1 Engineering/IT" },
                { name: "Multimedia University (MMU)", location: "Cyberjaya", minMerit: 68, maxMerit: 86, budget: "Medium-High", rating: 4, type: "Private", ranking: "#1 Private for IT" },
                { name: "Asia Pacific University (APU)", location: "Kuala Lumpur", minMerit: 70, maxMerit: 88, budget: "High", rating: 4, type: "Private", ranking: "Digital Tech Specialist" }
            ],
            careers: [
                { name: "Software Developer", demand: "Very High", salary: "RM 4,000-15,000", education: "Computer Science/SE", minMerit: 70 },
                { name: "Cybersecurity Analyst", demand: "Very High", salary: "RM 5,000-18,000", education: "Cybersecurity/IT Security", minMerit: 75 },
                { name: "AI/Machine Learning Engineer", demand: "Very High", salary: "RM 6,000-20,000", education: "AI/ML/Data Science", minMerit: 78 }
            ],
            courses: ["Computer Science", "Software Engineering", "Information Technology", "Cybersecurity", "Data Science"]
        },
        health: {
            universities: [
                { name: "University of Malaya (UM)", location: "Kuala Lumpur", minMerit: 90, maxMerit: 100, budget: "Medium-High", rating: 5, type: "Public Research", ranking: "#1 Malaysia" },
                { name: "Universiti Kebangsaan Malaysia (UKM)", location: "Selangor", minMerit: 85, maxMerit: 98, budget: "Medium", rating: 5, type: "Medical University", ranking: "#1 Medical School" },
                { name: "Universiti Sains Malaysia (USM)", location: "Penang", minMerit: 85, maxMerit: 98, budget: "Medium", rating: 5, type: "APEX University", ranking: "#2 Malaysia" },
                { name: "IMU University", location: "Kuala Lumpur", minMerit: 82, maxMerit: 95, budget: "High", rating: 4, type: "Private Medical", ranking: "#1 Private Medical" }
            ],
            careers: [
                { name: "Medical Doctor", demand: "High", salary: "RM 8,000-20,000", education: "Medicine Degree (5 years + housemanship)", minMerit: 90 },
                { name: "Dentist", demand: "Medium", salary: "RM 6,000-15,000", education: "Dentistry (5 years)", minMerit: 85 },
                { name: "Pharmacist", demand: "Medium", salary: "RM 5,000-10,000", education: "Pharmacy Degree (4 years)", minMerit: 82 },
                { name: "Nurse", demand: "High", salary: "RM 3,000-8,000", education: "Nursing Degree/Diploma", minMerit: 65 }
            ],
            courses: ["Medicine", "Dentistry", "Pharmacy", "Nursing", "Biomedical Science", "Nutrition"]
        }
    };
    
    // Helper function to open website in new tab
    function openWebsite(url, name) {
        if (url) {
            window.open(url, '_blank');
        } else {
            // Fallback search if no specific URL
            window.open(`https://www.google.com/search?q=${encodeURIComponent(name + " Malaysia official website")}`, '_blank');
        }
    }
    
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', function() {
            const field = fieldInterest ? fieldInterest.value : '';
            const merit = totalMeritInput ? parseFloat(totalMeritInput.value) : NaN;
            
            if (!field) { alert('Please select your field of interest'); return; }
            if (isNaN(merit) || merit < 0 || merit > 100) { alert('Please enter a valid merit score between 0 and 100'); return; }
            
            const fieldData = recommendations[field] || recommendations.science;
            const fieldNames = { science: "Science", arts: "Arts", commerce: "Commerce", engineering: "Engineering", it: "IT", health: "Health Sciences" };
            
            const profileTypeEl = document.getElementById('profile-type');
            const displayMeritEl = document.getElementById('display-merit');
            const careerMatchEl = document.getElementById('career-match');
            
            if (profileTypeEl) profileTypeEl.textContent = (fieldNames[field] || field) + ' Stream';
            if (displayMeritEl) displayMeritEl.textContent = merit.toFixed(1);
            
            let careerMatch = 'Low';
            if (merit >= 85) careerMatch = 'Excellent ⭐⭐⭐';
            else if (merit >= 75) careerMatch = 'High ⭐⭐';
            else if (merit >= 65) careerMatch = 'Medium ⭐';
            if (careerMatchEl) careerMatchEl.textContent = careerMatch;
            
            // Display universities with buttons
            const uniList = document.getElementById('university-list');
            if (uniList) {
                uniList.innerHTML = '';
                const universitiesWithMatch = fieldData.universities.map(uni => {
                    const matchPercent = calculateMatchPercentage(merit, uni.minMerit, uni.maxMerit);
                    return { ...uni, matchPercent };
                }).sort((a, b) => b.matchPercent - a.matchPercent);
                
                universitiesWithMatch.forEach(uni => {
                    const stars = '★'.repeat(uni.rating) + '☆'.repeat(5 - uni.rating);
                    let matchColor = '#e74c3c';
                    if (uni.matchPercent >= 80) matchColor = '#2ecc71';
                    else if (uni.matchPercent >= 60) matchColor = '#f39c12';
                    else if (uni.matchPercent >= 40) matchColor = '#3498db';
                    
                    uniList.innerHTML += `
                        <div style="background: white; padding: 18px; margin: 12px 0; border-radius: 12px; border-left: 4px solid ${matchColor}; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
                                <h4 style="margin: 0 0 5px 0; color: #2c3e50;">${uni.name}</h4>
                                <div style="background: ${matchColor}; color: white; padding: 4px 12px; border-radius: 20px; font-weight: bold; font-size: 14px;">
                                    ${uni.matchPercent}% Match
                                </div>
                            </div>
                            <p style="margin: 8px 0; color: #555; font-size: 0.9rem;">
                                <i class="fas fa-map-marker-alt"></i> ${uni.location} | 
                                <i class="fas fa-star" style="color: gold;"></i> ${stars} |
                                <span style="background: #e8f6ef; padding: 2px 8px; border-radius: 20px; font-size: 0.8rem;">Requires: ${uni.minMerit}-${uni.maxMerit}%</span> |
                                💰 ${uni.budget}
                            </p>
                            <p style="margin: 5px 0; color: #666; font-size: 0.85rem;">
                                <i class="fas fa-tag"></i> ${uni.type} | 
                                <i class="fas fa-trophy"></i> ${uni.ranking}
                            </p>
                            <div class="match-bar" style="margin-top: 10px;">
                                <div class="match-fill" style="width: ${uni.matchPercent}%; background: linear-gradient(90deg, ${matchColor}, ${matchColor}); height: 8px; border-radius: 4px;"></div>
                            </div>
                            <button onclick="openUniversityWebsite('${uni.name}')" style="margin-top: 12px; background: #3498db; color: white; border: none; padding: 8px 16px; border-radius: 20px; cursor: pointer; font-size: 13px; transition: all 0.3s;">
                                <i class="fas fa-external-link-alt"></i> Visit Official Website
                            </button>
                        </div>
                    `;
                });
            }
            
            // Display careers with buttons
            const careerList = document.getElementById('career-list');
            if (careerList) {
                careerList.innerHTML = '';
                const careersWithMatch = fieldData.careers.map(career => {
                    const matchPercent = calculateMatchPercentage(merit, career.minMerit || 60, 100);
                    return { ...career, matchPercent };
                }).sort((a, b) => b.matchPercent - a.matchPercent);
                
                careersWithMatch.forEach(career => {
                    let demandColor = '#2ecc71';
                    if (career.demand === 'Very High') demandColor = '#e74c3c';
                    else if (career.demand === 'High') demandColor = '#f39c12';
                    else if (career.demand === 'Growing') demandColor = '#3498db';
                    
                    let matchColor = '#e74c3c';
                    if (career.matchPercent >= 80) matchColor = '#2ecc71';
                    else if (career.matchPercent >= 60) matchColor = '#f39c12';
                    else if (career.matchPercent >= 40) matchColor = '#3498db';
                    
                    careerList.innerHTML += `
                        <div style="background: white; padding: 15px; margin: 10px 0; border-radius: 10px; border-left: 4px solid ${matchColor}; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
                            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
                                <h4 style="margin: 0 0 5px 0; color: #2c3e50;">${career.name}</h4>
                                <span style="background: ${matchColor}; color: white; padding: 2px 10px; border-radius: 20px; font-size: 12px; font-weight: bold;">${career.matchPercent}% Match</span>
                            </div>
                            <p style="margin: 8px 0; color: #555; font-size: 0.9rem;">
                                <strong>📈 Demand:</strong> <span style="color: ${demandColor}; font-weight: 600;">${career.demand}</span> |
                                <strong>💰 Salary:</strong> ${career.salary} |
                                <strong>🎓 Education:</strong> ${career.education}
                            </p>
                            <div class="match-bar" style="margin-top: 8px;">
                                <div class="match-fill" style="width: ${career.matchPercent}%; background: linear-gradient(90deg, ${matchColor}, ${matchColor}); height: 6px; border-radius: 3px;"></div>
                            </div>
                            <button onclick="openCareerWebsite('${career.name}')" style="margin-top: 12px; background: #2ecc71; color: white; border: none; padding: 8px 16px; border-radius: 20px; cursor: pointer; font-size: 13px; transition: all 0.3s;">
                                <i class="fas fa-briefcase"></i> Learn More About This Career
                            </button>
                        </div>
                    `;
                });
            }
            
            // Display courses
            const courseList = document.getElementById('course-list');
            if (courseList) {
                courseList.innerHTML = '';
                fieldData.courses.forEach(course => {
                    courseList.innerHTML += `
                        <div style="background: #f8f9fa; padding: 10px 15px; margin: 8px 0; border-radius: 8px; border: 1px solid #e0e6ed; display: flex; align-items: center; justify-content: space-between;">
                            <div><i class="fas fa-book" style="color: #3498db; margin-right: 12px;"></i> <span>${course}</span></div>
                            <button onclick="searchCourse('${course}')" style="background: transparent; border: none; color: #3498db; cursor: pointer;">
                                <i class="fas fa-search"></i>
                            </button>
                        </div>
                    `;
                });
            }
            
            if (aiResults) {
                aiResults.style.display = 'block';
                aiResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }
    
    // Global functions for buttons
    window.openUniversityWebsite = function(universityName) {
        const url = universityWebsites[universityName];
        if (url) {
            window.open(url, '_blank');
        } else {
            window.open(`https://www.google.com/search?q=${encodeURIComponent(universityName + " Malaysia admission")}`, '_blank');
        }
    };
    
    window.openCareerWebsite = function(careerName) {
        const url = careerResources[careerName];
        if (url) {
            window.open(url, '_blank');
        } else {
            window.open(`https://www.google.com/search?q=${encodeURIComponent(careerName + " career Malaysia salary job outlook")}`, '_blank');
        }
    };
    
    window.searchCourse = function(courseName) {
        window.open(`https://www.google.com/search?q=${encodeURIComponent(courseName + " course Malaysia university")}`, '_blank');
    };
    
    // ========== CONTACT FORM HANDLER ==========
    if (sendBtn) {
        sendBtn.addEventListener('click', function() {
            const name = nameInput ? nameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const message = messageInput ? messageInput.value.trim() : '';
            let isValid = true;
            
            [nameInput, emailInput, messageInput].forEach(input => {
                if (input) input.classList.remove('error');
            });
            
            if (!name) { if (nameInput) nameInput.classList.add('error'); isValid = false; }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email || !emailRegex.test(email)) { if (emailInput) emailInput.classList.add('error'); isValid = false; }
            if (!message) { if (messageInput) messageInput.classList.add('error'); isValid = false; }
            
            if (isValid) {
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                this.style.background = 'linear-gradient(to right, #2ecc71, #27ae60)';
                
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.style.background = '';
                    if (nameInput) nameInput.value = '';
                    if (emailInput) emailInput.value = '';
                    if (messageInput) messageInput.value = '';
                    [nameInput, emailInput, messageInput].forEach(input => {
                        if (input) input.classList.remove('error');
                    });
                }, 3000);
            }
        });
    }
    
    // ========== INITIAL CALCULATIONS ==========
    calculateSPMMerit();
    if (primaryInput && secondaryInput && calculateBtn) calculateMerit();
    
    setTimeout(() => {
        const activePage = document.getElementById(`page${currentPage}`);
        if (activePage) {
            const elements = activePage.querySelectorAll('.page-header, .description');
            elements.forEach(el => { el.style.opacity = '1'; });
        }
    }, 100);
});