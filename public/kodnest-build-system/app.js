/**
 * Job Notification Tracker — Routes, data & rendering
 * Hash-based routing. Local dataset + basic filters + saved jobs.
 */

(function () {
  var ROUTES = ["", "dashboard", "saved", "digest", "settings", "proof", "jt"];
  var DEFAULT_ROUTE = "";
  var STORAGE_KEY = "jnt_saved_jobs_v1";
  var STATUS_KEY = "jobTrackerStatus";
  var STATUS_HISTORY_KEY = "jobTrackerStatusHistory";

  var PAGE_TITLES = {
    "": "Job Notification Tracker",
    dashboard: "Dashboard",
    saved: "Saved",
    digest: "Digest",
    settings: "Settings",
    proof: "Proof",
    "jt/07-test": "Test Checklist",
    "jt/08-ship": "Ship Confirmation",
    "jt/proof": "Final Proof",
  };

  var ARTIFACTS_KEY = "jnt_artifacts_v1";

  var PROJECT_STEPS = [
    { id: "prefs", label: "Preferences Configured", check: function () { return state.preferences !== null; } },
    { id: "dashboard", label: "Dashboard Interaction", check: function () { return Object.values(state.filters).some(function (v) { return v !== "" && v !== "latest"; }); } },
    { id: "save", label: "Job Saved", check: function () { return state.saved.size > 0; } },
    { id: "status", label: "Status Tracking Used", check: function () { return Object.keys(state.statusMap).length > 0; } },
    { id: "filters", label: "Filter/Sort Applied", check: function () { return state.filters.sort !== "latest" || state.filters.keyword !== ""; } },
    { id: "digest", label: "Daily Digest Generated", check: function () { return !!loadTodayDigestIds(); } },
    { id: "checklist", label: "Test Checklist Passed", check: function () { return isChecklistComplete(); } },
    { id: "links", label: "All Artifact Links Provided", check: function () { return isArtifactsComplete(); } }
  ];

  var CHECKLIST_ITEMS = [
    { id: "refresh", label: "Preferences persist after refresh", tip: "Change a setting, refresh, and verify it remains." },
    { id: "match", label: "Match score calculates correctly", tip: "Verify score changes when you update role/skills." },
    { id: "toggle", label: "Show only matches toggle works", tip: "Toggle ON and verify lower scores are hidden." },
    { id: "save", label: "Save job persists after refresh", tip: "Save a job, refresh, and check the Saved page." },
    { id: "tab", label: "Apply opens in new tab", tip: "Click Apply and verify a new tab opens." },
    { id: "status_persist", label: "Status update persists after refresh", tip: "Change status to 'Applied', refresh, and verify." },
    { id: "status_filter", label: "Status filter works correctly", tip: "Filter by 'Applied' and verify results." },
    { id: "digest_top10", label: "Digest generates top 10 by score", tip: "Check if digest sorted by match score." },
    { id: "digest_persist", label: "Digest persists for the day", tip: "Generate digest, refresh, and verify it's the same." },
    { id: "console", label: "No console errors on main pages", tip: "Open DevTools (F12) and check for red errors." }
  ];

  var CHECKLIST_STORAGE_KEY = "jnt_test_checklist_v1";

  // ---------- Local dataset (60 realistic Indian tech jobs) ----------

  var BASE_JOBS = [
    {
      title: "SDE Intern",
      company: "Infosys",
      location: "Bengaluru, Karnataka",
      mode: "Hybrid",
      experience: "Fresher",
      skills: ["Java", "Data Structures", "OOP", "Git"],
      salaryRange: "₹15k–₹40k/month Internship",
      applyUrl: "https://careers.infosys.com/jobs/sde-intern",
    },
    {
      title: "Graduate Engineer Trainee",
      company: "TCS",
      location: "Hyderabad, Telangana",
      mode: "Onsite",
      experience: "0-1",
      skills: ["Java", "Spring Boot", "SQL"],
      salaryRange: "3–5 LPA",
      applyUrl: "https://nextstep.tcs.com/campus/gt",
    },
    {
      title: "Frontend Intern",
      company: "Wipro",
      location: "Pune, Maharashtra",
      mode: "Hybrid",
      experience: "Fresher",
      skills: ["HTML", "CSS", "JavaScript", "React"],
      salaryRange: "₹15k–₹40k/month Internship",
      applyUrl: "https://careers.wipro.com/frontend-intern",
    },
    {
      title: "Junior Backend Developer",
      company: "Accenture",
      location: "Bengaluru, Karnataka",
      mode: "Hybrid",
      experience: "1-3",
      skills: ["Node.js", "Express", "SQL", "REST APIs"],
      salaryRange: "6–10 LPA",
      applyUrl: "https://www.accenture.com/in-en/careers/backend",
    },
    {
      title: "QA Intern",
      company: "Capgemini",
      location: "Mumbai, Maharashtra",
      mode: "Onsite",
      experience: "Fresher",
      skills: ["Manual Testing", "JIRA", "API Testing"],
      salaryRange: "₹15k–₹40k/month Internship",
      applyUrl: "https://www.capgemini.com/in-en/careers/qa-intern",
    },
    {
      title: "Data Analyst Intern",
      company: "Cognizant",
      location: "Chennai, Tamil Nadu",
      mode: "Hybrid",
      experience: "Fresher",
      skills: ["SQL", "Excel", "Power BI", "Python"],
      salaryRange: "₹15k–₹40k/month Internship",
      applyUrl: "https://careers.cognizant.com/data-analyst-intern",
    },
    {
      title: "Java Developer",
      company: "IBM",
      location: "Noida, Uttar Pradesh",
      mode: "Onsite",
      experience: "0-1",
      skills: ["Core Java", "Spring", "REST APIs"],
      salaryRange: "3–5 LPA",
      applyUrl: "https://ibm.com/careers/java-developer",
    },
    {
      title: "Python Developer",
      company: "Oracle",
      location: "Bengaluru, Karnataka",
      mode: "Hybrid",
      experience: "Fresher",
      skills: ["Python", "Flask", "SQL"],
      salaryRange: "3–5 LPA",
      applyUrl: "https://oracle.com/in/careers/python-dev",
    },
    {
      title: "React Developer",
      company: "SAP Labs India",
      location: "Bengaluru, Karnataka",
      mode: "Hybrid",
      experience: "1-3",
      skills: ["React", "TypeScript", "REST APIs"],
      salaryRange: "6–10 LPA",
      applyUrl: "https://jobs.sap.com/react-developer",
    },
    {
      title: "SDE Intern",
      company: "Amazon India",
      location: "Hyderabad, Telangana",
      mode: "Onsite",
      experience: "Fresher",
      skills: ["Java", "Data Structures", "Algorithms"],
      salaryRange: "₹15k–₹40k/month Internship",
      applyUrl: "https://www.amazon.jobs/en/jobs/intern-sde",
    },
    {
      title: "Frontend Intern",
      company: "Flipkart",
      location: "Bengaluru, Karnataka",
      mode: "Hybrid",
      experience: "Fresher",
      skills: ["HTML", "CSS", "JavaScript", "React"],
      salaryRange: "₹15k–₹40k/month Internship",
      applyUrl: "https://www.flipkartcareers.com/frontend-intern",
    },
    {
      title: "Junior Backend Developer",
      company: "Swiggy",
      location: "Bengaluru, Karnataka",
      mode: "Remote",
      experience: "1-3",
      skills: ["Go", "Microservices", "Kafka"],
      salaryRange: "10–18 LPA",
      applyUrl: "https://careers.swiggy.com/backend-developer",
    },
    {
      title: "React Developer",
      company: "Razorpay",
      location: "Bengaluru, Karnataka",
      mode: "Hybrid",
      experience: "1-3",
      skills: ["React", "TypeScript", "Design Systems"],
      salaryRange: "10–18 LPA",
      applyUrl: "https://razorpay.com/careers/react-dev",
    },
    {
      title: "Graduate Engineer Trainee",
      company: "PhonePe",
      location: "Bengaluru, Karnataka",
      mode: "Onsite",
      experience: "0-1",
      skills: ["Java", "Spring Boot", "MySQL"],
      salaryRange: "6–10 LPA",
      applyUrl: "https://phonepe.com/careers/get",
    },
    {
      title: "Data Analyst Intern",
      company: "Paytm",
      location: "Noida, Uttar Pradesh",
      mode: "Hybrid",
      experience: "Fresher",
      skills: ["SQL", "Tableau", "Excel"],
      salaryRange: "₹15k–₹40k/month Internship",
      applyUrl: "https://paytm.com/careers/data-analyst-intern",
    },
    {
      title: "Java Developer",
      company: "Zoho",
      location: "Chennai, Tamil Nadu",
      mode: "Onsite",
      experience: "1-3",
      skills: ["Java", "REST APIs", "MySQL"],
      salaryRange: "6–10 LPA",
      applyUrl: "https://www.zoho.com/careers/java-dev",
    },
    {
      title: "SDE Intern",
      company: "Freshworks",
      location: "Chennai, Tamil Nadu",
      mode: "Hybrid",
      experience: "Fresher",
      skills: ["JavaScript", "Node.js", "SQL"],
      salaryRange: "₹15k–₹40k/month Internship",
      applyUrl: "https://www.freshworks.com/company/careers/sde-intern",
    },
    {
      title: "Frontend Intern",
      company: "Juspay",
      location: "Bengaluru, Karnataka",
      mode: "Remote",
      experience: "Fresher",
      skills: ["React", "TypeScript", "CSS"],
      salaryRange: "₹15k–₹40k/month Internship",
      applyUrl: "https://juspay.in/careers/frontend-intern",
    },
    {
      title: "Python Developer",
      company: "CRED",
      location: "Bengaluru, Karnataka",
      mode: "Hybrid",
      experience: "1-3",
      skills: ["Python", "Django", "PostgreSQL"],
      salaryRange: "10–18 LPA",
      applyUrl: "https://careers.cred.club/python-developer",
    },
    {
      title: "Junior Backend Developer",
      company: "StackRoute Labs",
      location: "Bengaluru, Karnataka",
      mode: "Remote",
      experience: "0-1",
      skills: ["Node.js", "MongoDB", "REST APIs"],
      salaryRange: "3–5 LPA",
      applyUrl: "https://careers.stackroutelabs.com/backend",
    },
    {
      title: "SDE Intern",
      company: "BluePeak Systems",
      location: "Hyderabad, Telangana",
      mode: "Remote",
      experience: "Fresher",
      skills: ["Java", "Spring Boot", "Git"],
      salaryRange: "₹15k–₹40k/month Internship",
      applyUrl: "https://bluepeaksystems.in/careers/sde-intern",
    },
    {
      title: "Graduate Engineer Trainee",
      company: "NovaTech Digital",
      location: "Gurugram, Haryana",
      mode: "Onsite",
      experience: "0-1",
      skills: ["C#", ".NET", "SQL Server"],
      salaryRange: "3–5 LPA",
      applyUrl: "https://careers.novatechdigital.com/get",
    },
    {
      title: "Data Analyst Intern",
      company: "BrightLeaf Analytics",
      location: "Pune, Maharashtra",
      mode: "Hybrid",
      experience: "Fresher",
      skills: ["Python", "Pandas", "Power BI"],
      salaryRange: "₹15k–₹40k/month Internship",
      applyUrl: "https://brightleafanalytics.in/internships/data-analyst",
    },
    {
      title: "React Developer",
      company: "PixelCraft Studios",
      location: "Bengaluru, Karnataka",
      mode: "Remote",
      experience: "1-3",
      skills: ["React", "Redux", "TypeScript"],
      salaryRange: "6–10 LPA",
      applyUrl: "https://pixelcraftstudios.io/careers/react-dev",
    },
  ];

  var JOBS = (function () {
    var sources = ["LinkedIn", "Naukri", "Indeed"];
    var out = [];

    function makeDescription(base, source) {
      var lines = [
        base.title + " role in the " + base.company + " India technology team.",
        "Work with mentors on real product features and production-quality code.",
        "Collaborate with engineers, designers and product to deliver reliable releases.",
        "Ideal for " + base.experience + " candidates who want structured learning and clear growth.",
        "This opportunity is listed via " + source + " for early-career talent in India.",
      ];
      return lines.join("\n");
    }

    BASE_JOBS.forEach(function (base, idx) {
      for (var i = 0; i < 4; i++) {
        if (out.length >= 60) break;
        var id = out.length + 1;
        var source = sources[(idx + i) % sources.length];
        var postedDaysAgo = (idx * 2 + i) % 11;
        out.push({
          id: id,
          title: base.title,
          company: base.company,
          location: base.location,
          mode: base.mode,
          experience: base.experience,
          skills: base.skills.slice(),
          source: source,
          postedDaysAgo: postedDaysAgo,
          salaryRange: base.salaryRange,
          applyUrl: base.applyUrl + "?ref=jnt-" + id,
          description: makeDescription(base, source),
        });
      }
    });

    return out.slice(0, 60);
  })();

  // ---------- Helpers ----------

  function getDefaultPreferences() {
    return {
      roleKeywords: "",
      preferredLocations: [],
      preferredMode: [],
      experienceLevel: "",
      skills: "",
      minMatchScore: 40,
    };
  }

  function loadPreferences() {
    try {
      if (!window.localStorage) return null;
      var raw = window.localStorage.getItem("jobTrackerPreferences");
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return null;
      var prefs = getDefaultPreferences();
      prefs.roleKeywords = parsed.roleKeywords || "";
      prefs.preferredLocations = Array.isArray(parsed.preferredLocations)
        ? parsed.preferredLocations
        : [];
      prefs.preferredMode = Array.isArray(parsed.preferredMode)
        ? parsed.preferredMode
        : [];
      prefs.experienceLevel = parsed.experienceLevel || "";
      prefs.skills = parsed.skills || "";
      var ms =
        typeof parsed.minMatchScore === "number" ? parsed.minMatchScore : 40;
      prefs.minMatchScore = Math.min(100, Math.max(0, ms));
      return prefs;
    } catch {
      return null;
    }
  }

  function persistPreferences(prefs) {
    try {
      if (!window.localStorage) return;
      window.localStorage.setItem(
        "jobTrackerPreferences",
        JSON.stringify(prefs)
      );
    } catch {
      // ignore
    }
  }

  // ---------- State ----------

  var state = {
    route: DEFAULT_ROUTE,
    filters: {
      keyword: "",
      location: "",
      mode: "",
      experience: "",
      source: "",
      status: "",
      sort: "latest",
    },
    saved: new Set(loadSaved()),
    modalJobId: null,
    preferences: loadPreferences(),
    showOnlyMatches: false,
    digestJobs: null,
    statusMap: loadStatusMap(),
    statusHistory: loadStatusHistory(),
  };

  // ---------- Helpers ----------

  function getRoute() {
    var rawHash = (window.location.hash || "#/").slice(2);
    var parts = rawHash.split("/");
    var base = parts[0];

    if (base === "jt") {
      return rawHash; // return the full sub-route string like "jt/07-test"
    }

    return ROUTES.indexOf(base) >= 0 ? base : DEFAULT_ROUTE;
  }

  function setHash(route) {
    window.location.hash = route === "" ? "#/" : "#/" + route;
  }

  function escapeHtml(s) {
    var div = document.createElement("div");
    div.textContent = s;
    return div.innerHTML;
  }

  function loadSaved() {
    try {
      var raw = window.localStorage ? window.localStorage.getItem(STORAGE_KEY) : null;
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function persistSaved() {
    try {
      if (!window.localStorage) return;
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(state.saved)));
    } catch {
      // ignore
    }
  }

  function loadStatusMap() {
    try {
      if (!window.localStorage) return {};
      var raw = window.localStorage.getItem(STATUS_KEY);
      if (!raw) return {};
      var parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  }

  function persistStatusMap(map) {
    try {
      if (!window.localStorage) return;
      window.localStorage.setItem(STATUS_KEY, JSON.stringify(map || {}));
    } catch {
      // ignore
    }
  }

  function loadStatusHistory() {
    try {
      if (!window.localStorage) return [];
      var raw = window.localStorage.getItem(STATUS_HISTORY_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function persistStatusHistory(list) {
    try {
      if (!window.localStorage) return;
      window.localStorage.setItem(
        STATUS_HISTORY_KEY,
        JSON.stringify(list || [])
      );
    } catch {
      // ignore
    }
  }

  function loadChecklist() {
    try {
      if (!window.localStorage) return {};
      var raw = window.localStorage.getItem(CHECKLIST_STORAGE_KEY);
      if (!raw) return {};
      return JSON.parse(raw) || {};
    } catch {
      return {};
    }
  }

  function persistChecklist(data) {
    try {
      if (!window.localStorage) return;
      window.localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(data));
    } catch {
      // ignore
    }
  }

  function isChecklistComplete() {
    var data = loadChecklist();
    var count = 0;
    CHECKLIST_ITEMS.forEach(function (item) {
      if (data[item.id]) count++;
    });
    return count === CHECKLIST_ITEMS.length;
  }

  function loadArtifacts() {
    try {
      if (!window.localStorage) return {};
      var raw = window.localStorage.getItem(ARTIFACTS_KEY);
      if (!raw) return {};
      return JSON.parse(raw) || {};
    } catch {
      return {};
    }
  }

  function persistArtifacts(data) {
    try {
      if (!window.localStorage) return;
      window.localStorage.setItem(ARTIFACTS_KEY, JSON.stringify(data));
    } catch {
      // ignore
    }
  }

  function validateUrl(url) {
    if (!url) return false;
    try {
      var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
      return !!pattern.test(url);
    } catch (e) {
      return false;
    }
  }

  function isArtifactsComplete() {
    var a = loadArtifacts();
    return validateUrl(a.lovable) && validateUrl(a.github) && validateUrl(a.deployed);
  }

  function isProjectShippable() {
    return isChecklistComplete() && isArtifactsComplete();
  }

  function getProjectStatus() {
    if (isProjectShippable()) return "Shipped";
    var started = PROJECT_STEPS.some(function (s) { return s.check(); });
    return started ? "In Progress" : "Not Started";
  }

  function formatPosted(days) {
    if (days === 0) return "Today";
    if (days === 1) return "1 day ago";
    return days + " days ago";
  }

  function parseCsv(value) {
    if (!value) return [];
    return value
      .split(",")
      .map(function (item) {
        return item.trim();
      })
      .filter(function (item) {
        return item.length > 0;
      });
  }

  function parseSalary(range) {
    if (!range) return 0;
    var match = range.match(/(\d+)/);
    if (!match) return 0;
    var num = parseInt(match[1], 10);
    return isNaN(num) ? 0 : num;
  }

  function computeMatchScore(job, prefs) {
    if (!prefs) return 0;
    var score = 0;

    var roleKeywords = parseCsv(prefs.roleKeywords);
    var userSkills = parseCsv(prefs.skills);
    var preferredLocations = prefs.preferredLocations || [];
    var preferredMode = prefs.preferredMode || [];
    var experienceLevel = (prefs.experienceLevel || "").trim();

    var titleLower = job.title.toLowerCase();
    var descLower = job.description.toLowerCase();

    // +25 if any roleKeyword appears in job.title
    var anyRoleInTitle = roleKeywords.some(function (kw) {
      return kw && titleLower.indexOf(kw.toLowerCase()) !== -1;
    });
    if (anyRoleInTitle) score += 25;

    // +15 if any roleKeyword appears in job.description
    var anyRoleInDesc = roleKeywords.some(function (kw) {
      return kw && descLower.indexOf(kw.toLowerCase()) !== -1;
    });
    if (anyRoleInDesc) score += 15;

    // +15 if job.location matches preferredLocations
    if (preferredLocations.length) {
      var locLower = job.location.toLowerCase();
      var locMatch = preferredLocations.some(function (loc) {
        return loc && locLower.indexOf(loc.toLowerCase()) !== -1;
      });
      if (locMatch) score += 15;
    }

    // +10 if job.mode matches preferredMode
    if (preferredMode.length) {
      if (preferredMode.indexOf(job.mode) !== -1) {
        score += 10;
      }
    }

    // +10 if job.experience matches experienceLevel
    if (experienceLevel && job.experience === experienceLevel) {
      score += 10;
    }

    // +15 if overlap between job.skills and user.skills
    if (userSkills.length && job.skills && job.skills.length) {
      var jobSkillsLower = job.skills.map(function (s) {
        return s.toLowerCase();
      });
      var hasOverlap = userSkills.some(function (s) {
        return jobSkillsLower.indexOf(s.toLowerCase()) !== -1;
      });
      if (hasOverlap) score += 15;
    }

    // +5 if postedDaysAgo <= 2
    if (job.postedDaysAgo <= 2) {
      score += 5;
    }

    // +5 if source is LinkedIn
    if (job.source === "LinkedIn") {
      score += 5;
    }

    if (score > 100) score = 100;
    return score;
  }

  function getFilteredJobs() {
    var f = state.filters;
    var prefs = state.preferences;
    var keyword = f.keyword.trim().toLowerCase();

    var entries = JOBS.map(function (job) {
      return {
        job: job,
        matchScore: computeMatchScore(job, prefs),
      };
    });

    if (keyword) {
      entries = entries.filter(function (entry) {
        var job = entry.job;
        return (
          job.title.toLowerCase().includes(keyword) ||
          job.company.toLowerCase().includes(keyword)
        );
      });
    }

    if (f.location) {
      entries = entries.filter(function (entry) {
        return entry.job.location.indexOf(f.location) !== -1;
      });
    }

    if (f.mode) {
      entries = entries.filter(function (entry) {
        return entry.job.mode === f.mode;
      });
    }

    if (f.experience) {
      entries = entries.filter(function (entry) {
        return entry.job.experience === f.experience;
      });
    }

    if (f.source) {
      entries = entries.filter(function (entry) {
        return entry.job.source === f.source;
      });
    }

    if (f.status) {
      entries = entries.filter(function (entry) {
        var id = entry.job.id;
        var status = state.statusMap[id] || "Not Applied";
        return status === f.status;
      });
    }

    // Show only matches above threshold
    if (state.showOnlyMatches && prefs) {
      var threshold =
        typeof prefs.minMatchScore === "number" ? prefs.minMatchScore : 40;
      entries = entries.filter(function (entry) {
        return entry.matchScore >= threshold;
      });
    }

    // Sorting
    entries.sort(function (a, b) {
      if (f.sort === "match") {
        if (b.matchScore !== a.matchScore) {
          return b.matchScore - a.matchScore;
        }
        // tie-breaker: latest first
        return a.job.postedDaysAgo - b.job.postedDaysAgo;
      }

      if (f.sort === "salary") {
        var sa = parseSalary(a.job.salaryRange);
        var sb = parseSalary(b.job.salaryRange);
        if (sb !== sa) return sb - sa;
        return a.job.postedDaysAgo - b.job.postedDaysAgo;
      }

      // latest: smaller days value first
      return a.job.postedDaysAgo - b.job.postedDaysAgo;
    });

    // Assign matchScore back to job objects for rendering
    return entries.map(function (entry) {
      entry.job.matchScore = entry.matchScore;
      return entry.job;
    });
  }

  function findJobById(id) {
    for (var i = 0; i < JOBS.length; i++) {
      if (JOBS[i].id === id) return JOBS[i];
    }
    return null;
  }

  // ---------- View builders ----------

  function getLandingHtml() {
    return (
      '<div class="jnt-page jnt-landing is-active">' +
      '<h1 class="jnt-landing__headline">Stop Missing The Right Jobs.</h1>' +
      '<p class="jnt-landing__subtext">Precision-matched job discovery delivered daily at 9AM.</p>' +
      '<p class="jnt-landing__cta-wrap">' +
      '<a href="#/settings" class="kn-btn kn-btn--primary jnt-cta">Start Tracking</a>' +
      "</p>" +
      "</div>"
    );
  }

  function buildFilterBarHtml() {
    var f = state.filters;
    var prefs = state.preferences || getDefaultPreferences();
    return (
      '<div class="jnt-filters kn-card">' +
      '<div class="jnt-filters__row">' +
      '<div class="jnt-filters__field jnt-filters__field--wide">' +
      '<label class="jnt-field__label" for="jnt-filter-keyword">Keyword</label>' +
      '<input id="jnt-filter-keyword" type="text" class="kn-input" placeholder="Search title or company" value="' +
      escapeHtml(f.keyword) +
      '"/>' +
      "</div>" +
      '<div class="jnt-filters__field">' +
      '<label class="jnt-field__label" for="jnt-filter-location">Location</label>' +
      '<select id="jnt-filter-location" class="kn-input">' +
      '<option value="">Any</option>' +
      '<option value="Bengaluru">Bengaluru</option>' +
      '<option value="Hyderabad">Hyderabad</option>' +
      '<option value="Chennai">Chennai</option>' +
      '<option value="Pune">Pune</option>' +
      '<option value="Mumbai">Mumbai</option>' +
      '<option value="Noida">Noida</option>' +
      '<option value="Gurugram">Gurugram</option>' +
      "</select>" +
      "</div>" +
      '<div class="jnt-filters__field">' +
      '<label class="jnt-field__label" for="jnt-filter-mode">Mode</label>' +
      '<select id="jnt-filter-mode" class="kn-input">' +
      '<option value="">Any</option>' +
      '<option value="Remote">Remote</option>' +
      '<option value="Hybrid">Hybrid</option>' +
      '<option value="Onsite">Onsite</option>' +
      "</select>" +
      "</div>" +
      "</div>" +
      '<div class="jnt-filters__row">' +
      '<div class="jnt-filters__field">' +
      '<label class="jnt-field__label" for="jnt-filter-experience">Experience</label>' +
      '<select id="jnt-filter-experience" class="kn-input">' +
      '<option value="">Any</option>' +
      '<option value="Fresher">Fresher</option>' +
      '<option value="0-1">0-1</option>' +
      '<option value="1-3">1-3</option>' +
      '<option value="3-5">3-5</option>' +
      "</select>" +
      "</div>" +
      '<div class="jnt-filters__field">' +
      '<label class="jnt-field__label" for="jnt-filter-source">Source</label>' +
      '<select id="jnt-filter-source" class="kn-input">' +
      '<option value="">Any</option>' +
      '<option value="LinkedIn">LinkedIn</option>' +
      '<option value="Naukri">Naukri</option>' +
      '<option value="Indeed">Indeed</option>' +
      "</select>" +
      "</div>" +
      '<div class="jnt-filters__field">' +
      '<label class="jnt-field__label" for="jnt-filter-status">Status</label>' +
      '<select id="jnt-filter-status" class="kn-input">' +
      '<option value="">All</option>' +
      '<option value="Not Applied">Not Applied</option>' +
      '<option value="Applied">Applied</option>' +
      '<option value="Rejected">Rejected</option>' +
      '<option value="Selected">Selected</option>' +
      "</select>" +
      "</div>" +
      '<div class="jnt-filters__field">' +
      '<label class="jnt-field__label" for="jnt-filter-sort">Sort</label>' +
      '<select id="jnt-filter-sort" class="kn-input">' +
      '<option value="latest">Latest</option>' +
      '<option value="match">Match Score</option>' +
      '<option value="salary">Salary</option>' +
      "</select>" +
      "</div>" +
      "</div>" +
      '<div class="jnt-filters__row jnt-filters__row--bottom">' +
      '<label class="jnt-toggle" for="jnt-filter-only-matches">' +
      '<input type="checkbox" id="jnt-filter-only-matches"' +
      (state.showOnlyMatches ? " checked" : "") +
      ' />' +
      '<span class="jnt-toggle__label">Show only jobs above my threshold (' +
      prefs.minMatchScore +
      "%)</span>" +
      "</label>" +
      "</div>" +
      "</div>"
    );
  }

  function buildJobCardHtml(job) {
    var isSaved = state.saved.has(job.id);
    var score = typeof job.matchScore === "number" ? job.matchScore : 0;
    var bandClass = "jnt-job__match--low";
    if (score >= 80) {
      bandClass = "jnt-job__match--high";
    } else if (score >= 60) {
      bandClass = "jnt-job__match--medium";
    } else if (score >= 40) {
      bandClass = "jnt-job__match--neutral";
    }

    var status = state.statusMap[job.id] || "Not Applied";

    function statusBtn(label) {
      var active = status === label ? " jnt-status-btn--active" : "";
      var colorClass = "";
      if (label === "Applied") colorClass = " jnt-status-btn--applied";
      else if (label === "Rejected") colorClass = " jnt-status-btn--rejected";
      else if (label === "Selected") colorClass = " jnt-status-btn--selected";
      else colorClass = " jnt-status-btn--neutral";
      return (
        '<button type="button" class="jnt-status-btn' +
        active +
        colorClass +
        '" data-action="change-status" data-job-id="' +
        job.id +
        '" data-status="' +
        label +
        '">' +
        label +
        "</button>"
      );
    }

    return (
      '<article class="jnt-job kn-card" data-job-id="' +
      job.id +
      '">' +
      '<header class="jnt-job__header">' +
      '<div class="jnt-job__titles">' +
      '<h2 class="jnt-job__title">' +
      escapeHtml(job.title) +
      "</h2>" +
      '<p class="jnt-job__company">' +
      escapeHtml(job.company) +
      "</p>" +
      "</div>" +
      '<div class="jnt-job__header-right">' +
      '<span class="jnt-job__match ' +
      bandClass +
      '">' +
      escapeHtml((score || 0) + "% match") +
      "</span>" +
      '<span class="jnt-job__source">' +
      escapeHtml(job.source) +
      "</span>" +
      "</div>" +
      "</header>" +
      '<div class="jnt-job__status-row">' +
      '<span class="jnt-job__status-label">Status:</span>' +
      '<div class="jnt-job__status-group" role="group" aria-label="Job status">' +
      statusBtn("Not Applied") +
      statusBtn("Applied") +
      statusBtn("Rejected") +
      statusBtn("Selected") +
      "</div>" +
      "</div>" +
      '<p class="jnt-job__meta">' +
      escapeHtml(job.location) +
      " · " +
      escapeHtml(job.mode) +
      " · " +
      escapeHtml(job.experience) +
      " yrs · " +
      escapeHtml(job.salaryRange) +
      "</p>" +
      '<p class="jnt-job__posted">' +
      escapeHtml(formatPosted(job.postedDaysAgo)) +
      "</p>" +
      '<div class="jnt-job__actions">' +
      '<button type="button" class="kn-btn kn-btn--secondary" data-action="view" data-job-id="' +
      job.id +
      '">View</button>' +
      '<button type="button" class="kn-btn kn-btn--ghost" data-action="save" data-job-id="' +
      job.id +
      '">' +
      (isSaved ? "Saved" : "Save") +
      "</button>" +
      '<button type="button" class="kn-btn kn-btn--primary" data-action="apply" data-job-id="' +
      job.id +
      '">Apply</button>' +
      "</div>" +
      "</article>"
    );
  }

  function buildJobsListHtml(jobs) {
    if (!jobs.length) {
      return (
        '<div class="jnt-empty">' +
        '<p class="jnt-empty__title">No roles match your criteria.</p>' +
        '<p class="jnt-empty__subtext">Adjust filters or lower your threshold to see more roles.</p>' +
        "</div>"
      );
    }

    var items = jobs
      .map(function (job) {
        return buildJobCardHtml(job);
      })
      .join("");

    return '<div class="jnt-jobs">' + items + "</div>";
  }

  function buildModalHtml(job) {
    if (!job) return "";
    var skillsHtml = job.skills
      .map(function (s) {
        return '<span class="jnt-modal__skill">' + escapeHtml(s) + "</span>";
      })
      .join("");

    var descHtml = job.description
      .split("\n")
      .map(function (line) {
        return '<p class="jnt-modal__paragraph">' + escapeHtml(line) + "</p>";
      })
      .join("");

    return (
      '<div class="jnt-modal" data-job-id="' +
      job.id +
      '">' +
      '<div class="jnt-modal__backdrop" data-action="close-modal"></div>' +
      '<div class="jnt-modal__dialog kn-card">' +
      '<header class="jnt-modal__header">' +
      '<div class="jnt-modal__titles">' +
      '<h2 class="jnt-modal__title">' +
      escapeHtml(job.title) +
      "</h2>" +
      '<p class="jnt-modal__company">' +
      escapeHtml(job.company) +
      "</p>" +
      "</div>" +
      '<button type="button" class="kn-btn kn-btn--ghost jnt-modal__close" data-action="close-modal">Close</button>' +
      "</header>" +
      '<p class="jnt-modal__meta">' +
      escapeHtml(job.location) +
      " · " +
      escapeHtml(job.mode) +
      " · " +
      escapeHtml(job.experience) +
      " yrs · " +
      escapeHtml(job.salaryRange) +
      "</p>" +
      '<p class="jnt-modal__meta jnt-modal__meta--secondary">' +
      "Source: " +
      escapeHtml(job.source) +
      " · " +
      escapeHtml(formatPosted(job.postedDaysAgo)) +
      "</p>" +
      '<div class="jnt-modal__body">' +
      descHtml +
      "</div>" +
      '<div class="jnt-modal__skills">' +
      skillsHtml +
      "</div>" +
      "</div>" +
      "</div>"
    );
  }

  function getDashboardHtml() {
    var jobs = getFilteredJobs();
    var modal = state.modalJobId ? buildModalHtml(findJobById(state.modalJobId)) : "";
    var banner =
      state.preferences == null
        ? '<div class="jnt-banner"><p class="jnt-banner__text">Set your preferences to activate intelligent matching.</p></div>'
        : "";
    return (
      '<div class="jnt-page jnt-dashboard is-active">' +
      '<h1 class="jnt-page__title">Dashboard</h1>' +
      banner +
      buildFilterBarHtml() +
      buildJobsListHtml(jobs) +
      modal +
      "</div>"
    );
  }

  function getSettingsHtml() {
    var prefs = state.preferences || getDefaultPreferences();
    return (
      '<div class="jnt-page jnt-settings is-active">' +
      '<h1 class="jnt-page__title">Settings</h1>' +
      '<p class="jnt-page__subtext jnt-settings__intro">Configure your preferences. These settings drive deterministic match scores across the dashboard.</p>' +
      '<div class="jnt-settings__fields">' +
      '<div class="jnt-field">' +
      '<label class="jnt-field__label" for="jnt-prefs-role">Role keywords (comma separated)</label>' +
      '<input type="text" id="jnt-prefs-role" class="kn-input jnt-field__input" placeholder="e.g. SDE Intern, React, Data Analyst" aria-label="Role keywords" value="' +
      escapeHtml(prefs.roleKeywords) +
      '"/>' +
      "</div>" +
      '<div class="jnt-field">' +
      '<label class="jnt-field__label" for="jnt-prefs-locations">Preferred locations</label>' +
      '<select id="jnt-prefs-locations" class="kn-input jnt-field__input" multiple aria-label="Preferred locations">' +
      buildLocationOption("Bengaluru", prefs.preferredLocations) +
      buildLocationOption("Hyderabad", prefs.preferredLocations) +
      buildLocationOption("Chennai", prefs.preferredLocations) +
      buildLocationOption("Pune", prefs.preferredLocations) +
      buildLocationOption("Mumbai", prefs.preferredLocations) +
      buildLocationOption("Noida", prefs.preferredLocations) +
      buildLocationOption("Gurugram", prefs.preferredLocations) +
      "</select>" +
      "</div>" +
      '<div class="jnt-field">' +
      '<span class="jnt-field__label">Preferred mode</span>' +
      '<div class="jnt-field__options" role="group" aria-label="Work mode">' +
      buildModeCheckbox("Remote", prefs.preferredMode) +
      buildModeCheckbox("Hybrid", prefs.preferredMode) +
      buildModeCheckbox("Onsite", prefs.preferredMode) +
      "</div>" +
      "</div>" +
      '<div class="jnt-field">' +
      '<label class="jnt-field__label" for="jnt-prefs-experience">Experience level</label>' +
      '<select id="jnt-prefs-experience" class="kn-input jnt-field__input" aria-label="Experience level">' +
      '<option value="">Select level</option>' +
      buildExperienceOption("Fresher", prefs.experienceLevel) +
      buildExperienceOption("0-1", prefs.experienceLevel) +
      buildExperienceOption("1-3", prefs.experienceLevel) +
      buildExperienceOption("3-5", prefs.experienceLevel) +
      "</select>" +
      "</div>" +
      '<div class="jnt-field">' +
      '<label class="jnt-field__label" for="jnt-prefs-skills">Skills (comma separated)</label>' +
      '<input type="text" id="jnt-prefs-skills" class="kn-input jnt-field__input" placeholder="e.g. Java, React, SQL" aria-label="Skills" value="' +
      escapeHtml(prefs.skills) +
      '"/>' +
      "</div>" +
      '<div class="jnt-field">' +
      '<label class="jnt-field__label" for="jnt-prefs-min-score">Minimum match score</label>' +
      '<input type="range" id="jnt-prefs-min-score" min="0" max="100" step="5" value="' +
      prefs.minMatchScore +
      '" />' +
      '<span class="jnt-field__range-value">' +
      prefs.minMatchScore +
      "%</span>" +
      "</div>" +
      '<div class="jnt-settings__actions">' +
      '<button type="button" class="kn-btn kn-btn--primary" data-action="save-preferences">Save preferences</button>' +
      "</div>" +
      "</div>" +
      "</div>"
    );
  }

  function getSavedHtml() {
    var savedIds = Array.from(state.saved);
    var jobs = JOBS.filter(function (job) {
      return savedIds.indexOf(job.id) !== -1;
    });
    var modal = state.modalJobId ? buildModalHtml(findJobById(state.modalJobId)) : "";

    if (!jobs.length) {
      return (
        '<div class="jnt-page is-active">' +
        '<h1 class="jnt-page__title">Saved</h1>' +
        '<div class="jnt-empty">' +
        '<p class="jnt-empty__title">No saved jobs yet.</p>' +
        '<p class="jnt-empty__subtext">Save roles from the dashboard to track them from here.</p>' +
        "</div>" +
        "</div>"
      );
    }

    return (
      '<div class="jnt-page is-active">' +
      '<h1 class="jnt-page__title">Saved</h1>' +
      buildJobsListHtml(jobs) +
      modal +
      "</div>"
    );
  }

  function getDigestHtml() {
    var prefs = state.preferences;
    if (!prefs) {
      return (
        '<div class="jnt-page is-active jnt-digest">' +
        '<h1 class="jnt-page__title">Digest</h1>' +
        '<div class="jnt-empty">' +
        '<p class="jnt-empty__title">Set preferences to generate a personalized digest.</p>' +
        '<p class="jnt-empty__subtext">Configure your role, location, mode and skills on the Settings page first.</p>' +
        "</div>" +
        '<p class="jnt-digest__note">Demo Mode: Daily 9AM trigger simulated manually.</p>' +
        "</div>"
      );
    }

    ensureDigestJobsLoaded();

    var d = new Date();
    var dateLabel = d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    var jobs = state.digestJobs || [];
    var listHtml;
    if (!jobs.length) {
      listHtml =
        '<div class="jnt-empty">' +
        '<p class="jnt-empty__title">No matching roles today.</p>' +
        '<p class="jnt-empty__subtext">No roles match your criteria. Check again tomorrow.</p>' +
        "</div>";
    } else {
      listHtml =
        '<div class="jnt-digest-card kn-card">' +
        '<header class="jnt-digest-card__header">' +
        '<h2 class="jnt-digest-card__title">Top 10 Jobs For You — 9AM Digest</h2>' +
        '<p class="jnt-digest-card__subtext">' +
        escapeHtml(dateLabel) +
        "</p>" +
        "</header>" +
        '<ul class="jnt-digest-list" role="list">';

      listHtml += jobs
        .map(function (job) {
          var score =
            typeof job.matchScore === "number" ? job.matchScore : 0;
          return (
            '<li class="jnt-digest-item">' +
            '<div class="jnt-digest-item__main">' +
            '<div>' +
            '<p class="jnt-digest-item__title">' +
            escapeHtml(job.title) +
            "</p>" +
            '<p class="jnt-digest-item__meta">' +
            escapeHtml(job.company) +
            " · " +
            escapeHtml(job.location) +
            " · " +
            escapeHtml(job.experience) +
            " yrs" +
            "</p>" +
            "</div>" +
            '<span class="jnt-digest-item__score">' +
            escapeHtml(score + "% match") +
            "</span>" +
            "</div>" +
            '<div class="jnt-digest-item__actions">' +
            '<button type="button" class="kn-btn kn-btn--primary" data-action="apply" data-job-id="' +
            job.id +
            '">Apply</button>' +
            "</div>" +
            "</li>"
          );
        })
        .join("");

      listHtml +=
        "</ul>" +
        '<footer class="jnt-digest-card__footer">' +
        '<p class="jnt-digest-card__footer-text">This digest was generated based on your preferences.</p>' +
        '<p class="jnt-digest-card__footer-note">Demo Mode: Daily 9AM trigger simulated manually.</p>' +
        "</footer>" +
        "</div>";
    }

    var actionsHtml =
      '<div class="jnt-digest-actions">' +
      '<button type="button" class="kn-btn kn-btn--secondary" data-action="generate-digest">Generate Today\'s 9AM Digest (Simulated)</button>' +
      '<button type="button" class="kn-btn kn-btn--ghost" data-action="copy-digest">Copy Digest to Clipboard</button>' +
      '<button type="button" class="kn-btn kn-btn--ghost" data-action="email-digest">Create Email Draft</button>' +
      "</div>";

    return (
      '<div class="jnt-page is-active jnt-digest">' +
      '<h1 class="jnt-page__title">Digest</h1>' +
      actionsHtml +
      listHtml +
      "</div>"
    );
  }

  function getProofHtml() {
    var art = loadArtifacts();
    var status = getProjectStatus();
    var badgeClass = "jnt-status-badge--" + status.toLowerCase().replace(" ", "-");

    var stepsHtml = PROJECT_STEPS.map(function (step, idx) {
      var completed = step.check();
      var icon = completed ? "✅" : "⭕";
      var statusText = completed ? "Completed" : "Pending";
      return (
        '<div class="jnt-proof-step">' +
        '<span class="jnt-proof-step__icon">' + icon + '</span>' +
        '<span class="jnt-proof-step__label">Step ' + (idx + 1) + ": " + escapeHtml(step.label) + '</span>' +
        '<span class="jnt-proof-step__status ' + (completed ? "is-completed" : "is-pending") + '">' + statusText + '</span>' +
        "</div>"
      );
    }).join("");

    return (
      '<div class="jnt-page is-active jnt-proof-page">' +
      '<header class="jnt-proof-header">' +
      '<div>' +
      '<h1 class="jnt-page__title">Final Proof</h1>' +
      '<p class="jnt-page__subtext">Project 1 — Job Notification Tracker</p>' +
      '</div>' +
      '<span class="jnt-status-badge ' + badgeClass + '">' + status + '</span>' +
      "</header>" +

      '<section class="jnt-proof-section kn-card">' +
      '<h2 class="jnt-proof-section__title">A) Step Completion Summary</h2>' +
      '<div class="jnt-proof-steps">' +
      stepsHtml +
      "</div>" +
      "</section>" +

      '<section class="jnt-proof-section kn-card">' +
      '<h2 class="jnt-proof-section__title">B) Artifact Collection</h2>' +
      '<div class="jnt-proof-inputs">' +
      '<div class="jnt-field">' +
      '<label class="jnt-field__label">Lovable Project Link</label>' +
      '<input type="url" class="kn-input jnt-artifact-input" data-key="lovable" placeholder="https://lovable.dev/projects/..." value="' + (escapeHtml(art.lovable) || "") + '">' +
      "</div>" +
      '<div class="jnt-field">' +
      '<label class="jnt-field__label">GitHub Repository Link</label>' +
      '<input type="url" class="kn-input jnt-artifact-input" data-key="github" placeholder="https://github.com/user/repo" value="' + (escapeHtml(art.github) || "") + '">' +
      "</div>" +
      '<div class="jnt-field">' +
      '<label class="jnt-field__label">Deployed URL (Vercel or equivalent)</label>' +
      '<input type="url" class="kn-input jnt-artifact-input" data-key="deployed" placeholder="https://project.vercel.app" value="' + (escapeHtml(art.deployed) || "") + '">' +
      "</div>" +
      "</div>" +
      "</section>" +

      '<div class="jnt-proof-actions">' +
      '<button type="button" class="kn-btn kn-btn--secondary" data-action="copy-submission">Copy Final Submission</button>' +
      '<a href="#/jt/08-ship" class="kn-btn kn-btn--primary">Ship Project 1</a>' +
      "</div>" +
      "</div>"
    );
  }

  function getTestChecklistHtml() {
    var data = loadChecklist();
    var count = 0;
    CHECKLIST_ITEMS.forEach(function (item) {
      if (data[item.id]) count++;
    });

    var itemsHtml = CHECKLIST_ITEMS.map(function (item) {
      var checked = data[item.id] ? " checked" : "";
      return (
        '<div class="jnt-checklist-item">' +
        '<label class="jnt-checklist-label">' +
        '<input type="checkbox" class="jnt-checklist-checkbox" data-id="' +
        item.id +
        '"' +
        checked +
        "> " +
        '<span>' + escapeHtml(item.label) + '</span>' +
        "</label>" +
        '<div class="jnt-checklist-tooltip" title="' + escapeHtml(item.tip) + '">?</div>' +
        "</div>"
      );
    }).join("");

    var shipWarning = count < 10 ? '<p class="jnt-checklist-warning">Resolve all issues before shipping.</p>' : "";

    return (
      '<div class="jnt-page is-active jnt-checklist-page">' +
      '<h1 class="jnt-page__title">Test Checklist</h1>' +
      '<div class="jnt-checklist-summary kn-card">' +
      '<p class="jnt-checklist-count">Tests Passed: ' + count + " / 10</p>" +
      shipWarning +
      "</div>" +
      '<div class="jnt-checklist-items kn-card">' +
      itemsHtml +
      "</div>" +
      '<div class="jnt-checklist-actions">' +
      '<button type="button" class="kn-btn kn-btn--ghost" data-action="reset-tests">Reset Test Status</button>' +
      '<a href="#/jt/08-ship" class="kn-btn kn-btn--primary">Proceed to Ship</a>' +
      "</div>" +
      "</div>"
    );
  }

  function getShipHtml() {
    if (!isProjectShippable()) {
      return (
        '<div class="jnt-page is-active">' +
        '<h1 class="jnt-page__title">Ship Locked</h1>' +
        '<div class="jnt-empty">' +
        '<p class="jnt-empty__title">Requirements Incomplete</p>' +
        '<p class="jnt-empty__subtext">Project 1 requires all 10 checklist tests to pass and all 3 artifact links to be provided before shipping.</p>' +
        '<p class="jnt-landing__cta-wrap" style="margin-top: 20px; display: flex; gap: 10px;">' +
        '<a href="#/jt/07-test" class="kn-btn kn-btn--secondary">Checklist</a>' +
        '<a href="#/jt/proof" class="kn-btn kn-btn--primary">Go to Proof</a>' +
        "</p>" +
        "</div>" +
        "</div>"
      );
    }

    return (
      '<div class="jnt-page is-active jnt-ship-page">' +
      '<div class="jnt-ship-content">' +
      '<div class="jnt-ship-icon">🚢</div>' +
      '<h1 class="jnt-ship-title">Project 1 Shipped Successfully.</h1>' +
      '<p class="jnt-ship-subtitle">All validation criteria met. Submission package is finalized and stable.</p>' +
      '<div class="jnt-ship-actions">' +
      '<a href="#/dashboard" class="kn-btn kn-btn--ghost">Return to Dashboard</a>' +
      "</div>" +
      "</div>" +
      "</div>"
    );
  }

  function renderPage(route) {
    var container = document.getElementById("jnt-content");
    if (!container) return;
    var html = "";
    switch (route) {
      case "":
        html = getLandingHtml();
        break;
      case "dashboard":
        html = getDashboardHtml();
        break;
      case "settings":
        html = getSettingsHtml();
        break;
      case "saved":
        html = getSavedHtml();
        break;
      case "digest":
        html = getDigestHtml();
        break;
      case "proof":
        html = getProofHtml();
        break;
      case "jt/07-test":
        html = getTestChecklistHtml();
        break;
      case "jt/08-ship":
        html = getShipHtml();
        break;
      case "jt/proof":
        html = getProofHtml();
        break;
      default:
        html = getDashboardHtml();
    }
    container.innerHTML = html;

    // set filter values after re-render
    if (route === "dashboard") {
      var f = state.filters;
      var keywordEl = document.getElementById("jnt-filter-keyword");
      var locEl = document.getElementById("jnt-filter-location");
      var modeEl = document.getElementById("jnt-filter-mode");
      var expEl = document.getElementById("jnt-filter-experience");
      var srcEl = document.getElementById("jnt-filter-source");
      var statusEl = document.getElementById("jnt-filter-status");
      var sortEl = document.getElementById("jnt-filter-sort");
      if (keywordEl) keywordEl.value = f.keyword;
      if (locEl) locEl.value = f.location;
      if (modeEl) modeEl.value = f.mode;
      if (expEl) expEl.value = f.experience;
      if (srcEl) srcEl.value = f.source;
      if (statusEl) statusEl.value = f.status;
      if (sortEl) sortEl.value = f.sort;
    }
  }

  function setActiveLink(route) {
    var links = document.querySelectorAll(".jnt-nav__links a[data-route]");
    links.forEach(function (a) {
      var r = a.getAttribute("data-route");
      // Match base route or sub-route
      a.classList.toggle("is-active", r === route || (route && (route.startsWith(r + "/") || (r === "proof" && route === "jt/proof"))));
    });
  }

  function update(route) {
    // Route guard for /jt/08-ship
    if (route === "jt/08-ship" && !isProjectShippable()) {
      route = "jt/proof";
      setHash(route);
      return;
    }

    state.route = route;
    renderPage(route);
    setActiveLink(route);
    document.title =
      (PAGE_TITLES[route] || "Job Notification Tracker") + " — Job Notification Tracker";
  }

  // ---------- Event handlers ----------

  function handleNavClick(e) {
    var a = e.target.closest("a[data-route]");
    if (!a) return;
    e.preventDefault();
    var route = a.getAttribute("data-route");
    if (route === "proof") route = "jt/proof"; // Route redirect for proof
    state.modalJobId = null;
    setHash(route);
  }

  function handleToggle() {
    var nav = document.querySelector(".jnt-nav");
    if (nav) nav.classList.toggle("is-open");
  }

  function handleContentClick(e) {
    var actionEl = e.target.closest("[data-action]");

    // Handle checklist checkbox clicks specifically if not a data-action
    if (!actionEl && e.target.classList.contains("jnt-checklist-checkbox")) {
      var cb = e.target;
      var id = cb.getAttribute("data-id");
      var data = loadChecklist();
      data[id] = cb.checked;
      persistChecklist(data);
      update(state.route); // Re-render to update summary
      return;
    }

    if (!actionEl) return;

    var action = actionEl.getAttribute("data-action");
    var jobIdAttr = actionEl.getAttribute("data-job-id");
    var jobId = jobIdAttr ? parseInt(jobIdAttr, 10) : null;

    if (action === "reset-tests") {
      persistChecklist({});
      update(state.route);
      showToast("Test status reset.");
      return;
    }

    if (action === "copy-submission") {
      var art = loadArtifacts();
      var text =
        "Job Notification Tracker — Final Submission\n\n" +
        "Lovable Project:\n" + (art.lovable || "Not provided") + "\n\n" +
        "GitHub Repository:\n" + (art.github || "Not provided") + "\n\n" +
        "Live Deployment:\n" + (art.deployed || "Not provided") + "\n\n" +
        "Core Features:\n" +
        "- Intelligent match scoring\n" +
        "- Daily digest simulation\n" +
        "- Status tracking\n" +
        "- Test checklist enforced";

      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function () {
          showToast("Submission copied to clipboard.");
        });
      }
      return;
    }

    if (action === "apply" && jobId != null) {
      var job = findJobById(jobId);
      if (job && job.applyUrl) {
        window.open(job.applyUrl, "_blank");
      }
      return;
    }

    if (action === "view" && jobId != null) {
      state.modalJobId = jobId;
      update(state.route);
      return;
    }

    if (action === "save" && jobId != null) {
      if (state.saved.has(jobId)) {
        state.saved.delete(jobId);
      } else {
        state.saved.add(jobId);
      }
      persistSaved();
      update(state.route);
      return;
    }

    if (action === "close-modal") {
      state.modalJobId = null;
      update(state.route);
      return;
    }

    if (action === "save-preferences") {
      var prefs = collectPreferencesFromForm();
      state.preferences = prefs;
      persistPreferences(prefs);
      // Do not navigate away; updated preferences will be used next time dashboard loads
      return;
    }

    if (action === "change-status" && jobId != null) {
      var newStatus = actionEl.getAttribute("data-status") || "Not Applied";
      if (!state.statusMap) state.statusMap = {};
      state.statusMap[jobId] = newStatus;
      persistStatusMap(state.statusMap);

      var now = new Date().toISOString();
      var historyEntry = { jobId: jobId, status: newStatus, changedAt: now };
      state.statusHistory.push(historyEntry);
      // keep only recent 50
      if (state.statusHistory.length > 50) {
        state.statusHistory = state.statusHistory.slice(
          state.statusHistory.length - 50
        );
      }
      persistStatusHistory(state.statusHistory);

      if (newStatus === "Applied" || newStatus === "Rejected" || newStatus === "Selected") {
        showToast("Status updated: " + newStatus);
      }

      update(state.route);
      return;
    }

    if (action === "generate-digest") {
      if (!state.preferences) {
        return;
      }
      var existingIds = loadTodayDigestIds();
      if (existingIds && existingIds.length) {
        var jobs = existingIds
          .map(function (id) {
            return findJobById(id);
          })
          .filter(Boolean);
        state.digestJobs = jobs;
      } else {
        var digestJobs = computeTodayDigestJobs();
        state.digestJobs = digestJobs;
        var ids = digestJobs.map(function (job) {
          return job.id;
        });
        saveTodayDigestIds(ids);
      }
      update("digest");
      return;
    }

    if (action === "copy-digest") {
      if (!state.digestJobs || !state.digestJobs.length || !state.preferences) {
        return;
      }
      var d = new Date();
      var dateLabel = d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      var text = buildDigestText(dateLabel, state.digestJobs);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).catch(function () {
          // ignore
        });
      }
      return;
    }

    if (action === "email-digest") {
      if (!state.digestJobs || !state.digestJobs.length || !state.preferences) {
        return;
      }
      var d2 = new Date();
      var dateLabel2 = d2.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      var text2 = buildDigestText(dateLabel2, state.digestJobs);
      var subject = encodeURIComponent("My 9AM Job Digest");
      var body = encodeURIComponent(text2);
      window.location.href = "mailto:?subject=" + subject + "&body=" + body;
      return;
    }
  }

  function handleContentChange(e) {
    if (state.route === "dashboard") {
      var id = e.target.id;
      if (!id) return;
      switch (id) {
        case "jnt-filter-location":
          state.filters.location = e.target.value;
          break;
        case "jnt-filter-mode":
          state.filters.mode = e.target.value;
          break;
        case "jnt-filter-experience":
          state.filters.experience = e.target.value;
          break;
        case "jnt-filter-source":
          state.filters.source = e.target.value;
          break;
        case "jnt-filter-status":
          state.filters.status = e.target.value;
          break;
        case "jnt-filter-sort":
          state.filters.sort = e.target.value || "latest";
          break;
        case "jnt-filter-only-matches":
          state.showOnlyMatches = !!e.target.checked;
          break;
        default:
          return;
      }
      update("dashboard");
    }
  }

  function handleContentInput(e) {
    if (e.target.classList.contains("jnt-artifact-input")) {
      var key = e.target.getAttribute("data-key");
      var val = e.target.value;
      var data = loadArtifacts();
      data[key] = val;
      persistArtifacts(data);

      // Visual feedback for URL validation
      if (val && !validateUrl(val)) {
        e.target.style.borderColor = "var(--kn-danger)";
      } else {
        e.target.style.borderColor = "";
      }

      // Re-render only if status might change
      // (Debounce or just wait for finish?) 
      // For now, re-render to update Step 8 and Status Badge
      renderPage(state.route);
      return;
    }

    if (state.route !== "dashboard") return;
    if (e.target.id === "jnt-filter-keyword") {
      state.filters.keyword = e.target.value || "";
      update("dashboard");
    }
  }

  function buildLocationOption(value, selectedList) {
    var selected =
      selectedList && selectedList.indexOf(value) !== -1 ? " selected" : "";
    return (
      '<option value="' + value + '"' + selected + ">" + value + "</option>"
    );
  }

  function buildModeCheckbox(value, list) {
    var checked = list && list.indexOf(value) !== -1 ? " checked" : "";
    return (
      '<label class="jnt-option"><input type="checkbox" name="jnt-prefs-mode" value="' +
      value +
      '"' +
      checked +
      " /> " +
      value +
      "</label>"
    );
  }

  function buildExperienceOption(value, current) {
    var selected = current === value ? " selected" : "";
    return (
      '<option value="' + value + '"' + selected + ">" + value + "</option>"
    );
  }

  function collectPreferencesFromForm() {
    var prefs = getDefaultPreferences();
    var roleInput = document.getElementById("jnt-prefs-role");
    var locSelect = document.getElementById("jnt-prefs-locations");
    var expSelect = document.getElementById("jnt-prefs-experience");
    var skillsInput = document.getElementById("jnt-prefs-skills");
    var minScoreInput = document.getElementById("jnt-prefs-min-score");

    if (roleInput) {
      prefs.roleKeywords = roleInput.value || "";
    }

    if (locSelect) {
      var selected = [];
      for (var i = 0; i < locSelect.options.length; i++) {
        var opt = locSelect.options[i];
        if (opt.selected) selected.push(opt.value);
      }
      prefs.preferredLocations = selected;
    }

    var modeEls = document.querySelectorAll('input[name="jnt-prefs-mode"]');
    var modes = [];
    modeEls.forEach(function (el) {
      if (el.checked) modes.push(el.value);
    });
    prefs.preferredMode = modes;

    if (expSelect) {
      prefs.experienceLevel = expSelect.value || "";
    }

    if (skillsInput) {
      prefs.skills = skillsInput.value || "";
    }

    var minScore = minScoreInput ? parseInt(minScoreInput.value, 10) : 40;
    if (isNaN(minScore)) minScore = 40;
    prefs.minMatchScore = Math.min(100, Math.max(0, minScore));

    return prefs;
  }

  function getRecentStatusUpdates(limit) {
    var history = state.statusHistory || [];
    var sorted = history
      .slice()
      .sort(function (a, b) {
        return (b.changedAt || "").localeCompare(a.changedAt || "");
      })
      .slice(0, limit || 5);

    return sorted
      .map(function (entry) {
        var job = findJobById(entry.jobId);
        if (!job) return null;
        return {
          job: job,
          status: entry.status,
          changedAt: entry.changedAt,
        };
      })
      .filter(Boolean);
  }

  function showToast(message) {
    var existing = document.querySelector(".jnt-toast");
    if (existing) {
      existing.remove();
    }
    var div = document.createElement("div");
    div.className = "jnt-toast";
    div.textContent = message;
    document.body.appendChild(div);
    setTimeout(function () {
      div.classList.add("jnt-toast--visible");
    }, 10);
    setTimeout(function () {
      div.classList.remove("jnt-toast--visible");
      setTimeout(function () {
        if (div.parentNode) div.parentNode.removeChild(div);
      }, 200);
    }, 2500);
  }

  // ---------- Digest helpers ----------

  function getTodayKey() {
    var d = new Date();
    var yyyy = d.getFullYear();
    var mm = String(d.getMonth() + 1).padStart(2, "0");
    var dd = String(d.getDate()).padStart(2, "0");
    return "jobTrackerDigest_" + yyyy + "-" + mm + "-" + dd;
  }

  function loadTodayDigestIds() {
    try {
      if (!window.localStorage) return null;
      var raw = window.localStorage.getItem(getTodayKey());
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.jobIds)) {
        return parsed.jobIds;
      }
      return null;
    } catch {
      return null;
    }
  }

  function saveTodayDigestIds(jobIds) {
    try {
      if (!window.localStorage) return;
      window.localStorage.setItem(
        getTodayKey(),
        JSON.stringify({ jobIds: jobIds })
      );
    } catch {
      // ignore
    }
  }

  function ensureDigestJobsLoaded() {
    if (state.digestJobs && state.digestJobs.length) return;
    var ids = loadTodayDigestIds();
    if (!ids || !ids.length) return;
    var jobs = ids
      .map(function (id) {
        return findJobById(id);
      })
      .filter(Boolean);
    state.digestJobs = jobs;
  }

  function computeTodayDigestJobs() {
    if (!state.preferences) return [];
    var prefs = state.preferences;
    var entries = JOBS.map(function (job) {
      return {
        job: job,
        matchScore: computeMatchScore(job, prefs),
      };
    });

    entries.sort(function (a, b) {
      if (b.matchScore !== a.matchScore) {
        return b.matchScore - a.matchScore;
      }
      return a.job.postedDaysAgo - b.job.postedDaysAgo;
    });

    var top = entries.slice(0, 10);
    var jobs = top.map(function (e) {
      e.job.matchScore = e.matchScore;
      return e.job;
    });
    return jobs;
  }

  function buildDigestText(dateLabel, jobs) {
    var lines = [];
    lines.push("Top 10 Jobs For You — 9AM Digest");
    lines.push(dateLabel);
    lines.push("");

    jobs.forEach(function (job, idx) {
      var score = typeof job.matchScore === "number" ? job.matchScore : 0;
      lines.push(
        idx + 1 + ") " + job.title + " — " + job.company
      );
      lines.push(
        "   Location: " + job.location + " | Experience: " + job.experience
      );
      lines.push("   Match Score: " + score + "%");
      lines.push("   Apply: " + job.applyUrl);
      lines.push("");
    });

    lines.push(
      "This digest was generated based on your preferences."
    );
    lines.push("Demo Mode: Daily 9AM trigger simulated manually.");

    return lines.join("\n");
  }

  // ---------- Init ----------

  function init() {
    if (!document.getElementById("jnt-content")) return;

    window.addEventListener("hashchange", function () {
      update(getRoute());
    });

    var navLinks = document.querySelector(".jnt-nav__links");
    if (navLinks) {
      navLinks.addEventListener("click", handleNavClick);
    }

    var toggle = document.querySelector(".jnt-nav__toggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        handleToggle();
        toggle.setAttribute(
          "aria-expanded",
          document.querySelector(".jnt-nav")?.classList.contains("is-open") || false
        );
      });
    }

    var content = document.getElementById("jnt-content");
    if (content) {
      content.addEventListener("click", handleContentClick);
      content.addEventListener("change", handleContentChange);
      content.addEventListener("input", handleContentInput);
    }

    if (!window.location.hash || window.location.hash === "#") {
      setHash(DEFAULT_ROUTE);
    }
    update(getRoute());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
