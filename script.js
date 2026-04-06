// Populate site data from global 'siteData' variable (from data.js)
function loadSiteData() {
  if (typeof siteData === "undefined") {
    console.error("Critical: 'siteData' variable is missing. Ensure data.js is loaded.");
    return;
  }
  console.log("Site data loaded from data.js:", siteData);
  populateSite(siteData);
}

function populateSite(data) {
  const p = data.profile;

  // Header & Footer
  document.getElementById("logo-main").textContent = p.logo;
  document.querySelectorAll(".info-email").forEach(el => el.href = `mailto:${p.email}`);
  document.querySelectorAll(".info-name-footer").forEach(el => el.textContent = `${p.name} ${p.surname}`);
  document.querySelectorAll(".info-location-footer").forEach(el => el.textContent = p.location);

  // Hero
  document.getElementById("hero-firstname").textContent = p.name;
  document.getElementById("hero-surname").textContent = p.surname;
  document.getElementById("hero-title").textContent = p.fullTitle;
  document.getElementById("hero-desc").innerHTML = p.bio;
  document.getElementById("stat-age").textContent = p.age;
  document.getElementById("stat-projects").textContent = p.projectsCount;
  document.getElementById("stat-timezone").textContent = p.timezone;

  // About
  const aboutText = document.getElementById("about-text");
  if (aboutText) {
    aboutText.innerHTML = p.bio.split(". ").map(s => `<p>${s}.</p>`).join("");
  }
  document.querySelectorAll(".info-location").forEach(el => el.textContent = p.location);
  document.querySelectorAll(".info-timezone").forEach(el => el.textContent = p.timezone);
  document.querySelectorAll(".info-specialization").forEach(el => el.textContent = p.specialization);
  document.querySelectorAll(".info-markets").forEach(el => el.textContent = p.markets);
  document.querySelectorAll(".info-ops").forEach(el => el.textContent = p.ops);
  document.getElementById("info-status").textContent = p.hireable ? "Open to Hire ✓" : "Busy ✓";

  // Skills
  const skillsGrid = document.getElementById("skills-grid");
  if (skillsGrid) {
    skillsGrid.innerHTML = data.skills.map(s => `
      <div class="skill-block reveal">
        <div class="skill-icon">${s.icon}</div>
        <div class="skill-name">${s.name}</div>
        <div class="skill-desc">${s.desc}</div>
      </div>
    `).join("");
  }

  const tagsRow = document.getElementById("tags-row");
  if (tagsRow) {
    tagsRow.innerHTML = data.tags.map(t => `<span class="tag">${t}</span>`).join("");
  }

  // Experience
  const timeline = document.getElementById("timeline");
  if (timeline) {
    timeline.innerHTML = data.experience.map((exp, i) => `
      <div class="timeline-item reveal">
        <div class="timeline-dot ${i === 0 ? "current" : ""}"></div>
        <div class="timeline-content">
          <div class="timeline-header">
            <span class="timeline-role">${exp.role}</span>
            <span class="timeline-period">${exp.period}</span>
          </div>
          <div class="timeline-company">${exp.company}</div>
          <ul class="timeline-points">
            ${exp.points.map(point => `<li>${point}</li>`).join("")}
          </ul>
        </div>
      </div>
    `).join("");
  }

  // Work
  const workGrid = document.getElementById("work-grid");
  if (workGrid) {
    workGrid.innerHTML = data.work.map(w => `
      <div class="work-card ${w.featured ? "featured" : ""} reveal">
        <div>
          <div class="work-card-tag">${w.tag}</div>
          <h3 class="work-card-title">${w.title}</h3>
          <p class="work-card-desc">${w.desc}</p>
          ${w.metrics ? `
            <div class="work-metrics">
              ${w.metrics.map(m => `
                <div class="metric">
                  <div class="metric-num">${m.num}</div>
                  <div class="metric-label">${m.label}</div>
                </div>
              `).join("")}
            </div>
          ` : ""}
        </div>
        ${w.featured ? `
          <div class="work-visual" aria-hidden="true">
            <div class="hex-grid">
              ${Array(20).fill('<div class="hex"></div>').join("")}
            </div>
          </div>
        ` : ""}
      </div>
    `).join("");
  }

  // Contact
  document.getElementById("contact-email").textContent = p.email;
  document.getElementById("contact-github").textContent = p.github;
  document.getElementById("contact-github-link").href = `https://github.com/${p.github}`;
  document.getElementById("contact-linkedin").textContent = p.linkedin;
  document.getElementById("contact-linkedin-link").href = `https://linkedin.com/in/${p.linkedin}`;
  document.getElementById("contact-hire-status").textContent = p.hireable ? "✓ Open to Opportunities" : "✓ Currently Busy";

  // Re-run scroll reveal for new elements
  initScrollReveal();
}

// Global UI Elements
const cursor = document.getElementById("cursor");
const ring = document.getElementById("cursorRing");
const year = document.getElementById("year");
const navToggle = document.querySelector(".nav-toggle");
const mobileNav = document.getElementById("mobileNav");
const navEl = document.querySelector("nav");

if (year) year.textContent = String(new Date().getFullYear());

const isCoarsePointer = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
const prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (isCoarsePointer) document.body.classList.add("cursor-disabled");
else document.body.classList.add("cursor-enabled");

function syncNavHeight() {
  if (!navEl) return;
  document.documentElement.style.setProperty("--nav-h", `${navEl.offsetHeight}px`);
}
syncNavHeight();
window.addEventListener("resize", syncNavHeight);

window.addEventListener("scroll", () => {
  if (navEl) {
    if (window.scrollY > 20) navEl.classList.add("is-scrolled");
    else navEl.classList.remove("is-scrolled");
  }
});

function closeMobileNav() {
  if (!navToggle || !mobileNav) return;
  navToggle.setAttribute("aria-expanded", "false");
  mobileNav.hidden = true;
}

function openMobileNav() {
  if (!navToggle || !mobileNav) return;
  navToggle.setAttribute("aria-expanded", "true");
  mobileNav.hidden = false;
}

if (navToggle && mobileNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    if (isOpen) closeMobileNav();
    else openMobileNav();
  });
  mobileNav.addEventListener("click", (e) => {
    if (e.target instanceof HTMLAnchorElement) closeMobileNav();
  });
}

// Active nav link highlight
function initNavHighlight() {
  const navLinks = Array.from(document.querySelectorAll(".nav-links a"));
  const sections = navLinks.map(a => document.querySelector(a.getAttribute("href"))).filter(el => el);

  const observer = new IntersectionObserver(entries => {
    const visible = entries.find(e => e.isIntersecting);
    if (visible) {
      navLinks.forEach(a => a.classList.toggle("is-active", a.getAttribute("href") === `#${visible.target.id}`));
    }
  }, { rootMargin: "-40% 0px -40% 0px" });

  sections.forEach(s => observer.observe(s));
}

// Scroll reveal
function initScrollReveal() {
  if (prefersReducedMotion) {
    document.querySelectorAll(".reveal, .timeline-item").forEach(el => el.classList.add("visible"));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(".reveal, .timeline-item").forEach(el => observer.observe(el));
}

// Cursor movement
if (cursor && ring && !isCoarsePointer) {
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener("mousemove", e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = `${mx}px`; cursor.style.top = `${my}px`;
  });
  const animate = () => {
    rx += (mx - rx) * 0.15; ry += (my - ry) * 0.15;
    ring.style.left = `${rx}px`; ring.style.top = `${ry}px`;
    requestAnimationFrame(animate);
  };
  animate();

  document.body.addEventListener("mouseover", e => {
    if (e.target.closest("a, button")) {
      cursor.style.transform = 'translate(-50%, -50%) scale(2)';
      ring.style.transform = 'translate(-50%, -50%) scale(1.5)';
      ring.style.borderColor = "var(--gold)";
    }
  });
  document.body.addEventListener("mouseout", e => {
    if (e.target.closest("a, button")) {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      ring.style.transform = 'translate(-50%, -50%) scale(1)';
      ring.style.borderColor = "rgba(232, 184, 75, 0.5)";
    }
  });
}

// Initial Load
window.addEventListener("DOMContentLoaded", () => {
  loadSiteData();
  initNavHighlight();
});
