export const analyzeJobDescription = (jdText, company = '', role = '') => {
    if (!jdText) return null;

    // 1. Skill Extraction
    const skills = extractSkills(jdText);

    // 2. Readiness Score Calculation
    const baseScore = calculateScore(jdText, company, role, skills);

    // 3. Content Generation
    const plan = generatePlan(skills);
    const checklist = generateChecklist(skills);
    const questions = generateQuestions(skills);

    // 4. Company Intel & Round Mapping
    const companyIntel = getCompanyIntel(company, jdText);
    const roundFlow = generateRoundFlow(companyIntel.size, skills);

    return {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        company: company || "",
        role: role || "",
        jdText,
        extractedSkills: skills,
        roundMapping: roundFlow.map(r => ({
            roundTitle: r.title,
            focusAreas: [r.focus],
            whyItMatters: r.why
        })),
        checklist: Object.entries(checklist).map(([title, items]) => ({
            roundTitle: title,
            items: items
        })),
        plan7Days: plan.map(p => ({
            day: p.day,
            focus: p.focus,
            tasks: [p.details]
        })),
        questions,
        baseScore: baseScore,
        skillConfidenceMap: {},
        finalScore: baseScore,
        companyIntel // Kept for UI rendering
    };
};

const getCompanyIntel = (company, jdText) => {
    const name = (company || '').toLowerCase().trim();

    const enterpriseList = [
        'amazon', 'google', 'microsoft', 'meta', 'apple', 'tcs', 'infosys', 'wipro', 'hcl',
        'accenture', 'capgemini', 'oracle', 'ibm', 'cisco', 'intel', 'nvidia', 'adobe',
        'salesforce', 'jpmorgan', 'morgan stanley', 'goldman sachs'
    ];

    const midSizeList = ['zomato', 'swiggy', 'ola', 'paytm', 'cred', 'razorpay', 'hotstar', 'zepto'];

    let size = 'Startup';
    let sizeDesc = '< 200';
    let industry = 'Technology Services';
    let hiringFocus = 'Practical problem solving + stack depth';

    if (enterpriseList.some(e => name.includes(e))) {
        size = 'Enterprise';
        sizeDesc = '2000+';
        hiringFocus = 'Structured DSA + Core Fundamentals';
    } else if (midSizeList.some(m => name.includes(m))) {
        size = 'Mid-size';
        sizeDesc = '200 - 2000';
    }

    // Heuristic for Industry
    const lowerJd = (jdText || '').toLowerCase();
    if (lowerJd.includes('bank') || lowerJd.includes('finance') || lowerJd.includes('trading')) industry = 'FinTech / BFSI';
    else if (lowerJd.includes('health') || lowerJd.includes('medical')) industry = 'HealthTech';
    else if (lowerJd.includes('shop') || lowerJd.includes('commerce') || lowerJd.includes('retail')) industry = 'E-commerce';

    return { size, sizeDesc, industry, hiringFocus, isDemo: true };
};

const generateRoundFlow = (companySize, skills) => {
    const flatSkills = Object.values(skills).flat().map(s => s.toLowerCase());
    const hasDSA = flatSkills.includes('dsa');
    const hasPractical = flatSkills.some(s => ['react', 'node.js', 'express', 'next.js', 'javascript'].includes(s));

    if (companySize === 'Enterprise') {
        return [
            {
                title: 'Round 1: Online Assessment',
                focus: 'DSA + Aptitude',
                why: 'Filters candidates based on core logic and quantitative skills under time pressure.'
            },
            {
                title: 'Round 2: Technical Interview 1',
                focus: 'DSA + Core CS',
                why: 'Tests understanding of data structures, algorithms, and fundamental CS concepts like OS/DBMS.'
            },
            {
                title: 'Round 3: Technical Interview 2',
                focus: 'System Design + Projects',
                why: 'Explores your ability to build scalable systems and deep-dives into your past work.'
            },
            {
                title: 'Round 4: HR / Behavioral',
                focus: 'Cultural Fit + Salary',
                why: 'Ensures your values align with the company and handles final logistics.'
            }
        ];
    }

    // Default / Startup Flow
    return [
        {
            title: 'Round 1: Practical Coding / Assignment',
            focus: hasPractical ? 'Live Feature Building' : 'Problem Solving',
            why: 'Startups prioritize immediate contribution; they need to see you build something real.'
        },
        {
            title: 'Round 2: Technical Discussion',
            focus: 'Stack Depth + Systems',
            why: 'Checks if you actually understand the "how" and "why" behind the tools you use.'
        },
        {
            title: 'Round 3: Culture Fit / Founder Round',
            focus: 'Vision + Ownership',
            why: 'At small scales, every hire significantly impacts culture and product direction.'
        }
    ];
};

const extractSkills = (text) => {
    const lowerText = text.toLowerCase();

    const categories = {
        coreCS: ['DSA', 'OOP', 'DBMS', 'OS', 'Networks'],
        languages: ['Java', 'Python', 'JavaScript', 'TypeScript', 'C', 'C++', 'C#', 'Go'],
        web: ['React', 'Next.js', 'Node.js', 'Express', 'REST', 'GraphQL'],
        data: ['SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis'],
        cloud: ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Linux'],
        testing: ['Selenium', 'Cypress', 'Playwright', 'JUnit', 'PyTest']
    };

    const found = {
        coreCS: [],
        languages: [],
        web: [],
        data: [],
        cloud: [],
        testing: [],
        other: []
    };

    let hasAnySkill = false;

    Object.entries(categories).forEach(([category, keywords]) => {
        const matched = keywords.filter(keyword => {
            const lowerKeyword = keyword.toLowerCase();

            if (lowerKeyword === 'c++') return lowerText.includes('c++') || lowerText.includes('cpp');
            if (lowerKeyword === 'c#') return lowerText.includes('c#') || lowerText.includes('csharp');
            if (lowerKeyword === 'c') return /\bc\b/.test(lowerText) && !lowerText.includes('objective-c');
            if (lowerKeyword === 'go') return /\bgo\b/.test(lowerText) || lowerText.includes('golang');

            if (lowerKeyword.includes('.') || lowerKeyword.includes('/')) return lowerText.includes(lowerKeyword);

            const regex = new RegExp(`\\b${lowerKeyword}\\b`, 'i');
            return regex.test(lowerText);
        });

        if (matched.length > 0) {
            found[category] = [...new Set(matched)];
            hasAnySkill = true;
        }
    });

    if (!hasAnySkill) {
        found.other = ["Communication", "Problem solving", "Basic coding", "Projects"];
    }

    return found;
};

const calculateScore = (text, company, role, skills) => {
    let score = 35;

    const validCategories = Object.entries(skills).filter(([k, v]) => k !== 'other' && v.length > 0);
    score += Math.min(30, validCategories.length * 5);

    if (company && company.trim().length > 0) score += 10;
    if (role && role.trim().length > 0) score += 10;
    if (text.length > 800) score += 10;

    return Math.min(100, score);
};

const generatePlan = (skills) => {
    const flatSkills = Object.values(skills).flat().map(s => s.toLowerCase());

    // Day 1-2: Basics + Core CS
    let day12Details = 'Revise programming fundamentals and OOP concepts.';
    if (skills['Core CS']) {
        day12Details = `Deep dive into ${skills['Core CS'].join(', ')}. Focus on OS memory management and DBMS ACID properties.`;
    }

    // Day 3-4: DSA + Coding Practice
    let day34Details = 'Solve 10+ LeetCode problems (Arrays, Strings, Linked Lists).';
    if (flatSkills.includes('dsa')) {
        day34Details = 'Focus on Advanced DSA: Trees, Graphs, and Dynamic Programming as requested.';
    }
    if (flatSkills.includes('sql')) {
        day34Details += ' Practice complex SQL Joins and Query Optimization.';
    }

    // Day 5: Project + Resume Alignment
    let day5Details = 'Review your personal projects and prepare to explain your tech stack choice.';
    if (skills['Web']) {
        day5Details = `Polish your ${skills['Web'].join('/')} projects. Be ready to discuss state management and API integration.`;
    }

    // Day 6: Mock Interview Questions
    const day6Details = 'Practice behavioral questions using STAR method. Run a 60-min mock technical interview.';

    // Day 7: Revision + Weak Areas
    const categories = Object.keys(skills).filter(k => k !== 'General');
    const day7Details = `Final revision of ${categories.length > 0 ? categories.join(', ') : 'core concepts'}. Review common interview pitfalls.`;

    return [
        { day: 'Day 1–2', focus: 'Basics + Core CS', details: day12Details },
        { day: 'Day 3–4', focus: 'DSA + Coding Practice', details: day34Details },
        { day: 'Day 5', focus: 'Project + Resume Alignment', details: day5Details },
        { day: 'Day 6', focus: 'Mock Interview Questions', details: day6Details },
        { day: 'Day 7', focus: 'Revision + Weak Areas', details: day7Details }
    ];
};

const generateChecklist = (skills) => {
    const hasWeb = !!skills['Web'];
    const hasData = !!skills['Data'];
    const hasCloud = !!skills['Cloud/DevOps'];

    return {
        'Round 1: Aptitude / Basics': [
            'Revise Quants: Time/Work, Speed/Distance',
            'Logical Reasoning: Puzzles and Syllogisms',
            'Verbal Proficiency: Reading Comprehension',
            'Programming Basics: Dry run simple loops',
            'Understand Time & Space complexity notation',
            'Practice 20 mcqs on CS fundamentals'
        ],
        'Round 2: DSA + Core CS': [
            'Array/String: Two pointers and Sliding window',
            'Linked Lists: Reverse and Cycle detection',
            'Stack/Queue: Implementation and usage',
            'OOP: Inheritance, Polymorphism, Abstraction',
            'DBMS: Normalization and SQL vs NoSQL',
            'OS: Process vs Threads and Deadlocks',
            'Networks: OSI Model and TCP vs UDP'
        ],
        'Round 3: Tech Interview (Projects + Stack)': [
            'Deep walk-through of your best project',
            'Explain technical challenges and trade-offs',
            ...(hasWeb ? ['Web: Component lifecycle and state management'] : ['Language syntax and memory model']),
            ...(hasData ? ['Data: Database schema design and indexing'] : ['Code modularity and clean principles']),
            ...(hasCloud ? ['Cloud: Deployment strategies and Docker basics'] : ['System Design: Scalability and Caching']),
            'Unit testing and Debugging strategies',
            'Version Control (Git) best practices'
        ],
        'Round 4: Managerial / HR': [
            'Prepare STAR stories for conflict resolution',
            'Research company culture and values',
            'Prepare answers for "Why this company?"',
            'Walk through your career goals for next 2 years',
            'Prepare 3 meaningful questions for interviewer'
        ]
    };
};

const generateQuestions = (skills) => {
    const questions = [];
    const flatSkills = Object.values(skills).flat().map(s => s.toLowerCase());

    if (flatSkills.includes('sql')) {
        questions.push("Explain indexing and when it helps performance.");
    }
    if (flatSkills.includes('react')) {
        questions.push("Explain state management options (Context API vs Redux).");
    }
    if (flatSkills.includes('dsa')) {
        questions.push("How would you optimize search in sorted data?");
    }
    if (flatSkills.includes('javascript')) {
        questions.push("What is the difference between Closures and Prototypal Inheritance?");
    }
    if (flatSkills.includes('java')) {
        questions.push("Explain the difference between HashMap and ConcurrentHashMap.");
    }
    if (flatSkills.includes('docker')) {
        questions.push("How do Docker containers differ from Virtual Machines?");
    }
    if (flatSkills.includes('node.js')) {
        questions.push("How does the Node.js event loop handle asynchronous operations?");
    }
    if (skills['Core CS']) {
        questions.push("Explain the 4 pillars of OOP with real-world examples.");
        questions.push("What is the difference between a process and a thread?");
    }
    if (flatSkills.includes('python')) {
        questions.push("Difference between deep copy and shallow copy in Python?");
    }

    const generics = [
        "Tell me about a time you handled a technical challenge.",
        "How do you ensure code quality in your projects?",
        "Explain the SOLID principles of software design.",
        "What happens when you type a URL in your browser?",
        "How do you handle security in your applications?",
        "What is the most interesting project you've worked on?"
    ];

    while (questions.length < 10) {
        if (generics.length === 0) break;
        questions.push(generics.shift());
    }

    return questions.slice(0, 10);
};

