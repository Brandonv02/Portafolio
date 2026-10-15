/*==================== PRELOADER ====================*/
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  if (preloader) {
    setTimeout(() => preloader.classList.add("hidden"), 600);
  }
});

/*==================== MENÚ MÓVIL ====================*/
const navMenu = document.getElementById("nav-menu");
const navToggle = document.getElementById("nav-toggle");
const navClose = document.getElementById("nav-close");
const navLinks = document.querySelectorAll(".nav__link");

const openMenu = () => navMenu.classList.add("show");
const closeMenu = () => navMenu.classList.remove("show");

if (navToggle) navToggle.addEventListener("click", openMenu);
if (navClose) navClose.addEventListener("click", closeMenu);
navLinks.forEach((n) => n.addEventListener("click", closeMenu));

/*==================== HEADER SCROLLED ====================*/
const header = document.getElementById("header");
const scrollTopBtn = document.getElementById("scroll-top");
const scrollProgress = document.getElementById("scroll-progress");

const onScroll = () => {
  const scrollY = window.scrollY;

  // Header con fondo
  header.classList.toggle("scrolled", scrollY > 40);

  // Botón volver arriba
  scrollTopBtn.classList.toggle("show", scrollY > 400);

  // Barra de progreso
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
  scrollProgress.style.width = progress + "%";

  scrollActive(scrollY);
};
window.addEventListener("scroll", onScroll);

/*==================== LINK ACTIVO SEGÚN SECCIÓN ====================*/
const sections = document.querySelectorAll("section[id]");
const scrollActive = (scrollY) => {
  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - 80;
    const sectionId = current.getAttribute("id");
    const link = document.querySelector(
      ".nav__menu a[href*=" + sectionId + "]"
    );
    if (!link) return;
    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      link.classList.add("active-link");
    } else {
      link.classList.remove("active-link");
    }
  });
};

/*==================== EFECTO DE ESCRITURA ====================*/
const typedEl = document.getElementById("typed");
const roles = [
  "Senior Software Developer",
  "Desarrollador Mobile",
  "Desarrollador iOS y Android",
  "Desarrollador Web y APIs",
];
let roleIndex = 0;
let charIndex = 0;
let deleting = false;

const type = () => {
  if (!typedEl) return;
  const current = roles[roleIndex];

  if (deleting) {
    charIndex--;
  } else {
    charIndex++;
  }
  typedEl.textContent = current.substring(0, charIndex);

  let delay = deleting ? 45 : 90;

  if (!deleting && charIndex === current.length) {
    delay = 1800; // pausa al final
    deleting = true;
  } else if (deleting && charIndex === 0) {
    deleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    delay = 400;
  }
  setTimeout(type, delay);
};
type();

/*==================== REVEAL ON SCROLL (IntersectionObserver) ====================*/
const revealEls = document.querySelectorAll("[data-reveal]");
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // pequeño stagger dentro del mismo grupo visible
        entry.target.style.transitionDelay = Math.min(i * 60, 240) + "ms";
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
);
revealEls.forEach((el) => revealObserver.observe(el));

/*==================== CONTADORES ANIMADOS ====================*/
const counters = document.querySelectorAll(".stat__number");
const countObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.getAttribute("data-count");
      const duration = 1600;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        el.textContent = Math.floor(eased * target);
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = target;
        }
      };
      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  },
  { threshold: 0.6 }
);
counters.forEach((c) => countObserver.observe(c));

/*==================== TEMA CLARO / OSCURO ====================*/
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = themeToggle ? themeToggle.querySelector("i") : null;
const savedTheme = localStorage.getItem("theme");

const applyTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  if (themeIcon) {
    themeIcon.className = theme === "light" ? "bx bx-sun" : "bx bx-moon";
  }
  localStorage.setItem("theme", theme);
};

if (savedTheme) applyTheme(savedTheme);

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const current =
      document.documentElement.getAttribute("data-theme") === "light"
        ? "dark"
        : "light";
    applyTheme(current);
  });
}

/*==================== EFECTO GLOW EN PROJECT CARDS ====================*/
document.querySelectorAll(".project-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mx", e.clientX - rect.left + "px");
    card.style.setProperty("--my", e.clientY - rect.top + "px");
  });
});

/*==================== CURSOR PERSONALIZADO ====================*/
const cursorDot = document.getElementById("cursor-dot");
const cursorRing = document.getElementById("cursor-ring");
const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;

if (cursorDot && cursorRing && !isTouch) {
  let mouseX = 0,
    mouseY = 0,
    ringX = 0,
    ringY = 0;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  const animateRing = () => {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateRing);
  };
  animateRing();

  const hoverables = document.querySelectorAll(
    "a, button, .skill-card, .project-card, .stat, .theme-toggle, input, textarea"
  );
  hoverables.forEach((el) => {
    el.addEventListener("mouseenter", () =>
      cursorRing.classList.add("is-hover")
    );
    el.addEventListener("mouseleave", () =>
      cursorRing.classList.remove("is-hover")
    );
  });
}
