/* ============================================================
   ICanFix.ID — interactions
   Vanilla JS. No dependencies. Respects reduced motion.
   ============================================================ */
(function () {
  "use strict";

  var cfg = window.ICANFIX_CONFIG || {};
  var contact = cfg.contact || {};
  var messages = cfg.messages || {};
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- WhatsApp links ---------- */
  function waLink(message, numberOverride) {
    var number = (numberOverride || contact.whatsapp || "6281818862411").replace(/[^\d]/g, "");
    var base = "https://wa.me/" + number;
    var text = message || messages.default || "Halo ICanFix.ID, saya mau konsultasi servis laptop.";
    return base + "?text=" + encodeURIComponent(text);
  }

  document.querySelectorAll("[data-wa], [data-wa-default], [data-wa-alt]").forEach(function (el) {
    if (el.hasAttribute("data-wa-alt")) {
      el.href = waLink(messages.default, contact.whatsappAlt || contact.whatsapp);
      return;
    }
    if (el.hasAttribute("data-wa-default")) {
      el.href = waLink(messages.default);
      return;
    }
    var context = el.getAttribute("data-wa");
    var isPhone = el.closest('[data-device-panel="phone"]');
    var prefix = el.getAttribute("data-wa-type") === "symptom"
      ? (isPhone
        ? (messages.phoneSymptomPrefix || "Halo ICanFix.ID, HP saya mengalami: ")
        : (messages.symptomPrefix || "Halo ICanFix.ID, laptop saya mengalami: "))
      : (messages.servicePrefix || "Halo ICanFix.ID, saya mau tanya soal: ");
    var message = context
      ? (prefix + context.replace(/[.\s]+$/, "") + ".")
      : messages.default;
    el.href = waLink(message);
  });

  /* ---------- Business details from config ---------- */
  var siteValues = {
    whatsappDisplay: contact.whatsappDisplay,
    whatsappAltDisplay: contact.whatsappAltDisplay,
    instagramHandle: (cfg.brand || {}).instagramHandle,
    area: (cfg.location || {}).area,
    hours: (cfg.hours || {}).display
  };
  document.querySelectorAll("[data-site]").forEach(function (el) {
    var value = siteValues[el.getAttribute("data-site")];
    if (value) el.textContent = value;
  });

  var instagramUrl = (cfg.brand || {}).instagramUrl;
  document.querySelectorAll("[data-ig]").forEach(function (el) {
    if (instagramUrl) el.href = instagramUrl;
  });

  /* ---------- Sticky nav state ---------- */
  var nav = document.getElementById("site-nav");
  function onScroll() {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var toggle = document.getElementById("menu-toggle");
  var panel = document.getElementById("mobile-menu");
  var root = document.documentElement;
  var lastFocused = null;

  function setMenu(open) {
    if (!toggle || !panel) return;
    root.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    var label = toggle.querySelector(".sr-only");
    if (label) label.textContent = open ? "Tutup menu" : "Buka menu";
    document.body.style.overflow = open ? "hidden" : "";

    if (open) {
      lastFocused = document.activeElement;
      var first = panel.querySelector("a");
      if (first) {
        window.setTimeout(function () { first.focus(); }, 120);
      }
      document.addEventListener("keydown", onMenuKeydown);
    } else {
      document.removeEventListener("keydown", onMenuKeydown);
      if (lastFocused instanceof HTMLElement) lastFocused.focus();
    }
  }

  function onMenuKeydown(event) {
    if (event.key === "Escape") {
      setMenu(false);
      if (toggle) toggle.focus();
      return;
    }
    if (event.key !== "Tab" || !panel) return;
    var focusables = panel.querySelectorAll("a[href], button:not([disabled])");
    if (!focusables.length) return;
    var first = focusables[0];
    var last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });
  }

  if (panel) {
    panel.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { setMenu(false); });
    });
  }

  window.addEventListener("resize", function () {
    if (window.innerWidth > 900 && root.classList.contains("menu-open")) {
      setMenu(false);
    }
  });

  /* ---------- Before / after comparison ---------- */
  document.querySelectorAll("[data-compare]").forEach(function (compare) {
    var range = compare.querySelector(".compare__range");
    if (!range) return;

    function update() {
      compare.style.setProperty("--pos", range.value + "%");
    }

    range.addEventListener("input", update);
    update();
  });

  /* ---------- Device tabs (services + symptoms) ---------- */
  document.querySelectorAll("[data-device-tabs]").forEach(function (section) {
    var tabs = Array.prototype.slice.call(
      section.querySelectorAll('[role="tab"][data-device-tab]')
    );
    var panels = Array.prototype.slice.call(
      section.querySelectorAll("[data-device-panel]")
    );
    if (!tabs.length || !panels.length) return;

    function activate(device, moveFocus) {
      tabs.forEach(function (tab) {
        var on = tab.getAttribute("data-device-tab") === device;
        tab.setAttribute("aria-selected", on ? "true" : "false");
        tab.tabIndex = on ? 0 : -1;
        if (on && moveFocus) tab.focus();
      });
      panels.forEach(function (panel) {
        var show = panel.getAttribute("data-device-panel") === device;
        panel.hidden = !show;
        if (show) {
          panel.querySelectorAll("[data-reveal]").forEach(function (el) {
            el.classList.add("is-in");
          });
        }
      });
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () {
        activate(tab.getAttribute("data-device-tab"));
      });
      tab.addEventListener("keydown", function (event) {
        var dir = 0;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") dir = 1;
        else if (event.key === "ArrowLeft" || event.key === "ArrowUp") dir = -1;
        else if (event.key === "Home") {
          event.preventDefault();
          activate(tabs[0].getAttribute("data-device-tab"), true);
          return;
        } else if (event.key === "End") {
          event.preventDefault();
          activate(tabs[tabs.length - 1].getAttribute("data-device-tab"), true);
          return;
        } else return;
        event.preventDefault();
        var next = tabs[(index + dir + tabs.length) % tabs.length];
        activate(next.getAttribute("data-device-tab"), true);
      });
    });
  });

  /* ---------- Device jump links ---------- */
  document.querySelectorAll("[data-device-jump]").forEach(function (link) {
    link.addEventListener("click", function () {
      var device = link.getAttribute("data-device-jump");
      var target = document.getElementById("layanan");
      if (!target) return;
      var tab = target.querySelector('[data-device-tab="' + device + '"]');
      if (tab) tab.click();
    });
  });

  /* ---------- Service case filter ---------- */
  var caseSection = document.getElementById("service-notes");
  var filterButtons = caseSection
    ? Array.prototype.slice.call(caseSection.querySelectorAll("[data-case-filter]"))
    : [];
  if (caseSection && filterButtons.length) {
    var caseItems = Array.prototype.slice.call(caseSection.querySelectorAll("[data-device]"));
    var caseCount = caseSection.querySelector("[data-case-count]");

    function applyCaseFilter(filter) {
      var visible = 0;
      caseItems.forEach(function (item) {
        var match = filter === "all" || item.getAttribute("data-device") === filter;
        item.hidden = !match;
        if (match) {
          item.classList.add("is-in");
          visible += 1;
        }
      });
      filterButtons.forEach(function (btn) {
        var on = btn.getAttribute("data-case-filter") === filter;
        btn.classList.toggle("is-active", on);
        btn.setAttribute("aria-pressed", on ? "true" : "false");
      });
      if (caseCount) {
        caseCount.textContent = (visible < 10 ? "0" : "") + visible +
          " catatan";
      }
    }

    filterButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyCaseFilter(btn.getAttribute("data-case-filter"));
      });
    });
    applyCaseFilter("all");
  }

  /* ---------- Scroll reveal ---------- */
  var revealItems = document.querySelectorAll("[data-reveal]");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    revealItems.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
