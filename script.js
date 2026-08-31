/* ==========================================================================
   Wasil Academy — script.js
   Vanilla JS only. No dependencies.
   ========================================================================== */
(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Sticky header compact state ---------------- */
  var header = document.getElementById("site-header");
  function onScroll() {
    if (window.scrollY > 24) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------------- Mobile navigation ---------------- */
  var hamburger = document.getElementById("hamburger");
  var mobileNav = document.getElementById("mobile-nav");

  function closeMobileNav() {
    mobileNav.classList.remove("is-open");
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.setAttribute("aria-label", "Open menu");
  }

  function toggleMobileNav() {
    var isOpen = mobileNav.classList.toggle("is-open");
    hamburger.setAttribute("aria-expanded", String(isOpen));
    hamburger.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  }

  hamburger.addEventListener("click", toggleMobileNav);

  mobileNav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeMobileNav);
  });

  /* ---------------- FAQ accordion ---------------- */
  var accordionItems = document.querySelectorAll(".accordion-item");

  accordionItems.forEach(function (item) {
    var trigger = item.querySelector(".accordion-trigger");
    var panel = item.querySelector(".accordion-panel");

    trigger.addEventListener("click", function () {
      var isOpen = trigger.getAttribute("aria-expanded") === "true";

      // Close all other panels (single-open accordion)
      accordionItems.forEach(function (other) {
        var otherTrigger = other.querySelector(".accordion-trigger");
        var otherPanel = other.querySelector(".accordion-panel");
        otherTrigger.setAttribute("aria-expanded", "false");
        otherPanel.style.maxHeight = null;
      });

      if (!isOpen) {
        trigger.setAttribute("aria-expanded", "true");
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });

  /* ---------------- Course detail modal ---------------- */
  var courseData = {
    qaida: {
      no: "01",
      title: "Noorani Qaida",
      who: "Complete beginners, including young children, who are starting with Arabic letters for the first time.",
      learn: "Letter recognition, correct sounds, joining letters, and the foundations needed before reading full Quran text.",
      parents: "[ADD DETAILS — e.g. how progress through the Qaida is tracked]"
    },
    nazra: {
      no: "02",
      title: "Nazra Quran",
      who: "Students who can already read Arabic script and are ready to read directly from the Quran.",
      learn: "Fluent, accurate Quran reading with steady correction of pronunciation.",
      parents: "[ADD DETAILS — e.g. how much is read per lesson]"
    },
    tajweed: {
      no: "03",
      title: "Tajweed",
      who: "Students who can already read Quran and want to refine their recitation.",
      learn: "Correct articulation points (makharij), Tajweed rules, and applying them consistently while reciting.",
      parents: "[ADD DETAILS — e.g. which Tajweed level is expected before starting]"
    },
    hifz: {
      no: "04",
      title: "Hifz",
      who: "Students who want to memorize the Quran, at a pace suited to the individual.",
      learn: "New memorization paired with structured revision to retain what has already been memorized.",
      parents: "[ADD DETAILS — e.g. daily practice expectations at home]"
    },
    "islamic-studies": {
      no: "05",
      title: "Islamic Studies",
      who: "Children, teenagers and adults wanting age-appropriate Islamic knowledge.",
      learn: "Core beliefs, essential worship practices, and everyday Islamic manners and knowledge.",
      parents: "[ADD DETAILS — e.g. topics covered by age group]"
    }
  };

  var modal = document.getElementById("course-modal");
  var modalNo = document.getElementById("modal-no");
  var modalTitle = document.getElementById("modal-title");
  var modalWho = document.getElementById("modal-who");
  var modalLearn = document.getElementById("modal-learn");
  var modalParents = document.getElementById("modal-parents");
  var modalClose = document.getElementById("modal-close");
  var lastFocusedElement = null;

  function openModal(courseKey) {
    var data = courseData[courseKey];
    if (!data) return;

    modalNo.textContent = data.no;
    modalTitle.textContent = data.title;
    modalWho.textContent = data.who;
    modalLearn.textContent = data.learn;
    modalParents.textContent = data.parents;

    lastFocusedElement = document.activeElement;
    modal.hidden = false;
    modalClose.focus();
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
    if (lastFocusedElement) lastFocusedElement.focus();
  }

  document.querySelectorAll("[data-open]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      openModal(btn.getAttribute("data-open"));
    });
  });

  modalClose.addEventListener("click", closeModal);
  modal.addEventListener("click", function (e) {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.hidden) closeModal();
  });

  /* ---------------- Contact form submission ---------------- */
  var form = document.getElementById("contact-form");
  var status = document.getElementById("form-status");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Basic client-side checks (server re-validates everything).
    var name = form.name.value.trim();
    var email = form.email.value.trim();
    var course = form.course.value.trim();

    if (!name || !email || !course) {
      status.textContent = "Please fill in the required fields.";
      status.className = "form-status error";
      return;
    }

    var submitButton = form.querySelector(".form-submit");
    submitButton.disabled = true;
    status.textContent = "Sending…";
    status.className = "form-status";

    var payload = {
      name: name,
      email: email,
      phone: form.phone.value.trim(),
      age: form.age.value.trim(),
      course: course,
      schedule: form.schedule.value.trim(),
      message: form.message.value.trim(),
      company: form.company.value // honeypot — should stay empty
    };

    fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        return res.json().then(function (data) {
          return { ok: res.ok, data: data };
        });
      })
      .then(function (result) {
        submitButton.disabled = false;
        if (result.ok) {
          status.textContent = "Thank you! Your inquiry has been received. We'll get back to you soon.";
          status.className = "form-status success";
          form.reset();
        } else {
          status.textContent = (result.data && result.data.message) || "Something went wrong. Please try again.";
          status.className = "form-status error";
        }
      })
      .catch(function () {
        submitButton.disabled = false;
        status.textContent = "Something went wrong. Please try again.";
        status.className = "form-status error";
      });
  });

  /* ---------------- Footer year ---------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------------- Single deliberate hero entrance ---------------- */
  if (!prefersReducedMotion) {
    var heroCopy = document.querySelector(".hero-copy");
    var heroVisual = document.querySelector(".hero-visual");
    if (heroCopy && heroVisual) {
      heroCopy.style.opacity = "0";
      heroVisual.style.opacity = "0";
      heroCopy.style.transform = "translateY(14px)";
      heroVisual.style.transform = "translateY(14px)";
      heroCopy.style.transition = "opacity 620ms ease, transform 620ms ease";
      heroVisual.style.transition = "opacity 620ms ease 120ms, transform 620ms ease 120ms";
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          heroCopy.style.opacity = "1";
          heroVisual.style.opacity = "1";
          heroCopy.style.transform = "none";
          heroVisual.style.transform = "none";
        });
      });
    }
  }
})();
