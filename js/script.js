document.addEventListener("DOMContentLoaded", () => {
  if (typeof lucide !== "undefined" && lucide.createIcons) {
    lucide.createIcons();
  }
  const menuButton = document.querySelector(".menu-button");
  const navLinks = document.querySelector(".nav-links");

  // Navbar: hide on scroll down, reveal on scroll up
  (function initNavbarScrollBehavior() {
    const header = document.querySelector(".site-header");
    if (!header) return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    function onScroll() {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;

      if (currentScrollY < 80) {
        header.classList.remove("nav-hidden");
        header.classList.add("nav-visible");
        lastScrollY = currentScrollY;
        return;
      }

      if (delta > 4) {
        header.classList.add("nav-hidden");
        header.classList.remove("nav-visible");
        if (navLinks) navLinks.classList.remove("is-open");
        if (menuButton) menuButton.setAttribute("aria-expanded", "false");
      } else if (delta < -4) {
        header.classList.remove("nav-hidden");
        header.classList.add("nav-visible");
      }

      lastScrollY = currentScrollY;
      ticking = false;
    }

    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(onScroll);
          ticking = true;
        }
      },
      { passive: true }
    );
  })();

  // ScrollSpy — home page only
  const isHomePage =
    document.getElementById("home") ||
    document.querySelector(".hero-section") ||
    window.location.pathname.endsWith("index.html") ||
    window.location.pathname === "/" ||
    window.location.pathname.endsWith("/");

  if (isHomePage) {
    const menuLinks = Array.from(
      document.querySelectorAll("#main-navigation .nav-links a.nav-link, #main-menu a.nav-link")
    );

    const sectionNavMapping = [
      { id: "home", text: "الرئيسية", href: "index.html" },
      { id: "about", text: "من نحن", href: "about.html" },
      { id: "services", text: "الخدمات", href: "services.html" },
      { id: "packages", text: "الباقات", href: "packages.html" },
      { id: "work", text: "المخرجات", href: "work.html" },
      { id: "sectors", text: "القطاعات", href: "sectors.html" },
      { id: "contact", text: "اتصل بنا", href: "contact.html" },
    ];

    const trackedSections = sectionNavMapping
      .map((item) => {
        const el = document.getElementById(item.id);
        const link = menuLinks.find((l) => {
          const href = l.getAttribute("href") || "";
          const txt = l.textContent.trim();
          return (
            href === item.href ||
            href === `#${item.id}` ||
            href.endsWith(item.href) ||
            txt === item.text
          );
        });
        return el && link ? { el, link, id: item.id } : null;
      })
      .filter(Boolean);

    const setActiveLink = (targetLink) => {
      if (!targetLink) return;
      menuLinks.forEach((link) => {
        link.classList.remove("active", "is-active");
        link.removeAttribute("aria-current");
      });
      targetLink.classList.add("active", "is-active");
      targetLink.setAttribute("aria-current", "page");
    };

    const updateActiveNav = () => {
      const scrollY = window.scrollY;
      const headerHeight = document.querySelector(".site-header")?.offsetHeight || 80;

      if (scrollY < 200) {
        setActiveLink(trackedSections[0]?.link);
        return;
      }

      if (window.innerHeight + scrollY >= document.documentElement.scrollHeight - 70) {
        setActiveLink(trackedSections[trackedSections.length - 1]?.link);
        return;
      }

      const triggerLine = scrollY + headerHeight + window.innerHeight * 0.25;
      let activeItem = trackedSections[0];

      trackedSections.forEach((item) => {
        if (item.el.offsetTop <= triggerLine) activeItem = item;
      });

      if (activeItem) setActiveLink(activeItem.link);
    };

    window.addEventListener("scroll", updateActiveNav, { passive: true });
    window.addEventListener("resize", updateActiveNav);
    updateActiveNav();
  }

  // Accordion
  const accordionHeaders = document.querySelectorAll(".accordion-header");

  function toggleAccordion(header) {
    const item = header.closest(".accordion-item");
    const isOpen = item.classList.contains("is-open");

    document.querySelectorAll(".accordion-item").forEach((entry) => {
      entry.classList.remove("is-open");
      entry.querySelector(".accordion-header")?.setAttribute("aria-expanded", "false");
    });

    if (!isOpen) {
      item.classList.add("is-open");
      header.setAttribute("aria-expanded", "true");
    }
  }

  accordionHeaders.forEach((header) => {
    header.addEventListener("click", () => toggleAccordion(header));
  });

  // Mobile menu
  function toggleMobileMenu() {
    const isOpen = navLinks.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  }

  function closeMobileMenu() {
    navLinks.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
  }

  if (menuButton && navLinks) {
    menuButton.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMobileMenu);
    });
    document.addEventListener("click", (e) => {
      if (!navLinks.contains(e.target) && !menuButton.contains(e.target)) {
        closeMobileMenu();
      }
    });
  }

  // Package cards — home page
  const packagesData = {
    studio: [
      {
        title: "نصف يوم",
        desc: "تجهيز استوديو متكامل لمدة 4 ساعات تصوير مع إضاءة احترافية وفني مرافق",
        price: "4500.00",
        save: "وفر حتى 15% شهرياً",
        features: [
          "4 ساعات تصوير استوديو",
          "طاقم إضاءة وصوت أساسي",
          "كروما خضراء وخلفيات متعددة",
          "إنترنت فايبر فائق السرعة",
          "غرفة استراحة وتجهيز VIP",
          "دعم فني طوال الجلسة",
        ],
      },
      {
        title: "يوم كامل",
        desc: "باقة اليوم الكامل (8 ساعات) مع تجهيزات سينمائية وعدسات احترافية وطاقم متكامل",
        price: "8500.00",
        save: "وفر حتى 20% شهرياً",
        featured: true,
        features: [
          "8 ساعات تصوير استوديو",
          "طاقم إضاءة سينمائية كامل",
          "كاميرات سينمائية 4K / 8K",
          "مهندس صوت وفني إضاءة",
          "مراجعة فورية للمواد المصورة",
          "تخزين سحابي فوري للملفات",
        ],
      },
      {
        title: "إنتاج شهري",
        desc: "اشتراك شهري مخصص للمؤسسات وصناع المحتوى بمعدل 4 أيام تصوير شهرياً",
        price: "18000.00",
        save: "وفر حتى 30% شهرياً",
        features: [
          "4 أيام استوديو كاملة شهرياً",
          "أولوية الحجز والجدولة",
          "طاقم إنتاج مفرغ",
          "تخزين وأرشفة دائمة",
          "معدات ومؤثرات بصرية خاصة",
          "خدمات مونتاج وتلوين أولية",
        ],
      },
    ],
    podcast: [
      {
        title: "حلقة فردية",
        desc: "تسجيل حلقة بودكاست حتى 60 دقيقة في استوديو معزول صوتياً بأحدث المايكات",
        price: "2500.00",
        save: "وفر حتى 10%",
        features: [
          "تسجيل حلقة حتى 60 دقيقة",
          "مايكات Shure SM7B الاحترافية",
          "تصوير متعدد الكاميرات 4K",
          "مكس وماسترينج صوتي",
          "تسليم ملفات الصوت والفيديو",
          "مقتطف ترويجي (ريلز) للحلقة",
        ],
      },
      {
        title: "موسم بودكاست",
        desc: "إنتاج موسم بودكاست متكامل مكون من 6 حلقات مع هوية صوتية وبصرية شاملة",
        price: "12000.00",
        save: "وفر حتى 25%",
        featured: true,
        features: [
          "6 حلقات كاملة (حتى 60 دقيقة)",
          "هوية بصرية وإنترو احترافي",
          "مونتاج وتلوين سينمائي",
          "3 مقتطفات ريلز لكل حلقة",
          "نشر وتوزيع على المنصات",
          "تقرير أداء واستماع شهري",
        ],
      },
      {
        title: "شبكة بودكاست",
        desc: "حل إنتاجي شامل للمؤسسات الكبرى يشمل 12 حلقة وإنتاج محتوى ترويجي متكامل",
        price: "24000.00",
        save: "وفر حتى 35%",
        features: [
          "12 حلقة على مدار 3 أشهر",
          "إدارة وتوزيع الحلقات على المنصات",
          "تصوير وإخراج VIP",
          "سلسلة ريلز وتيك توك موسعة",
          "جلسات استشارية لإعداد المحتوى",
          "فريق عمل مخصص بالكامل",
        ],
      },
    ],
    audio: [
      {
        title: "تعليق صوتي",
        desc: "تسجيل صوتي إعلاني أو وثائقي بأصوات معتمدة وخيارات لهجات متعددة",
        price: "1500.00",
        save: "تسليم سريع",
        features: [
          "تسجيل صوتي حتى دقيقتين",
          "أصوات معتمدة سعودية وعربية",
          "هندسة صوتية وماسترينج",
          "تعديلين مجانيين على الأداء",
          "تسليم بجودة WAV و MP3",
          "ترخيص استخدام إعلامي تجاري",
        ],
      },
      {
        title: "هوية صوتية",
        desc: "تصميم Sonic Branding وشعار صوتي متفرد يرسخ في ذهن المستمعين",
        price: "6000.00",
        save: "وفر حتى 20%",
        featured: true,
        features: [
          "شعار صوتي فريد (Audio Logo)",
          "موسيقى خاصة بالهوية المؤسسية",
          "نغمات انتظار وتطبيقات",
          "حقوق ملكية وتأليف حصرية",
          "دليل استخدام الهوية الصوتية",
          "تسليم كافة الطبقات الصوتية",
        ],
      },
      {
        title: "هندسة وماسترينج",
        desc: "معالجة وتحسين الملفات الصوتية وإزالة الضوضاء بجودة محطات البث الإذاعي",
        price: "3500.00",
        save: "دقة استثنائية",
        features: [
          "معالجة حتى 10 مسارات صوتية",
          "إزالة الضوضاء والترددات المزعجة",
          "موازنة ديناميكية واحترافية",
          "مطابقة معايير البث العالمية",
          "تسليم نسخ متعددة المنصات",
          "دعم ومراجعة دقيقة مع المهندس",
        ],
      },
    ],
  };

  function renderPackageCards(cards) {
    return (
      `<div class="pricing-grid">` +
      cards
        .map(
          (card) => `
      <article class="pricing-card ${card.featured ? "is-featured" : ""}">
        <div>
          <div class="pricing-card-top">
            <span class="save-badge">${card.save}</span>
            <h3>${card.title}</h3>
          </div>
          <p class="pricing-copy">${card.desc}</p>
          <div class="price-row">
            <span class="period">/ شهريا</span>
            <img src="./assets-design/icons/${card.featured ? "riyal-alt.svg" : "riyal.svg"}" alt="ر.س" />
            <span class="amount">${card.price}</span>
          </div>
        </div>
        <ul class="include-list">
          ${card.features.map((f) => `<li>${f}<span class="check-circle"><img src="./assets-design/icons/check-small.svg" alt="" /></span></li>`).join("")}
        </ul>
        <a class="gold-button w-100 text-center text-decoration-none" href="package-detail.html">اشترك الآن</a>
      </article>`
        )
        .join("") +
      `</div>`
    );
  }

  const studioPane = document.getElementById("packages-studio");
  if (studioPane) studioPane.innerHTML = renderPackageCards(packagesData.studio);

  const podcastPane = document.getElementById("packages-podcast");
  if (podcastPane) podcastPane.innerHTML = renderPackageCards(packagesData.podcast);

  const audioPane = document.getElementById("packages-audio");
  if (audioPane) audioPane.innerHTML = renderPackageCards(packagesData.audio);

  // Toast feedback for form submissions
  function showToast(message) {
    let toast = document.getElementById("prototype-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "prototype-toast";
      toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: #111;
        border: 1px solid #FDBA33;
        color: #fff;
        padding: 14px 28px;
        border-radius: 50px;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 10px 30px rgba(0,0,0,0.6), 0 0 20px rgba(253,186,51,0.25);
        z-index: 9999;
        transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease;
        opacity: 0;
        pointer-events: none;
        display: flex;
        align-items: center;
        gap: 10px;
        direction: rtl;
      `;
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span style="color:#FDBA33;font-size:18px;">✓</span> <span>${message}</span>`;
    toast.style.opacity = "1";
    toast.style.transform = "translateX(-50%) translateY(0)";

    window.clearTimeout(toast._timeout);
    toast._timeout = window.setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(-50%) translateY(100px)";
    }, 4000);
  }

  // Handle form submissions
  document.querySelectorAll("form").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const message = form.classList.contains("newsletter-form")
        ? "شكرًا لاشتراكك في النشرة البريدية لـ AZ Studio!"
        : "تم استلام طلبكم بنجاح! سيتواصل معكم فريقنا خلال 24 ساعة.";
      showToast(message);
      form.reset();
    });
  });
});
