# لوحة تحكم استوديو زايد | AZ Studio Admin Dashboard

لوحة تحكم إدارية احترافية وشاملة خاصة بشركة **AZ Studio للإنتاج الفني والمرئي** لإدارة الخدمات، الطلبات، المشرفين، الأدوار والصلاحيات، إعدادات الموقع، ورسائل التواصل.

---

## 🌟 مميزات لوحة التحكم (Key Features)

- **لوحة معلومات تفاعلية (Interactive Dashboard):**
  - 4 كروت إحصائية متقدمة (KPI Cards) لمتابعة أداء العملاء والطلبات والمشاريع وعروض الأسعار.
  - رسوم بيانية تفاعلية (Stacked & Donut Charts) لمتابعة معدل إنجاز المشاريع ونسب الحالات.
  - جداول بيانات تفاعلية مع فرز وتصفية وتصدير (Excel, PDF, CSV, Print).

- **إدارة العمليات والخدمات (Operations & Services):**
  - إدارة الطلبات (`orders.html`) مع فلاتر متعددة ونظام تغيير حالة الطلب المباشر.
  - إدارة الخدمات والباقات (`services.html`, `add-service.html`, `edit-service.html`, `packages.html`).
  - إدارة المشرفين والصلاحيات (`supervisors.html`, `roles.html`) مع نافذة تخصيص الصلاحيات الدقيقة.

- **إعدادات الموقع وتخصيص المحتوى (`settings.html`):**
  - إدارة معلومات التواصل والروابط الاجتماعية ومواعيد العمل.
  - رفع وإدارة الشعار (Logo) والأيقونة المفضلة (Favicon).
  - إدارة صفحات الموقع (الرئيسية، عنا، الخدمات، الأعمال، القطاعات، منهجية العمل).

- **نظام مصادقة متكامل (Authentication):**
  - تسجيل الدخول (`login.html`)
  - استعادة كلمة المرور (`enter-email.html`, `otp.html`, `reset-password.html`, `new-password.html`)

- **تجربة مستخدم راقية (UI / UX):**
  - دعم كامل للوضع الليلي / النهاري (Dark / Light Mode) مع حفظ الاختيار.
  - تصميم متجاوب 100% مع الهواتف الذكية والأجهزة اللوحية (Responsive Design).
  - دعم السكرول بالتاتش (Smooth Touch Scrolling) للهواتف.
  - نوافذ منبثقة تفاعلية (Modals) لعرض وتعديل الملف الشخصي، وإضافة وتعديل العناصر، وتأكيد الحذف وتسجيل الخروج.
  - خطوط عربية حديثة (`IBM Plex Sans Arabic`, `Cairo`).

---

## 📁 هيكل المجلدات (Project Structure)

```text
zayed-dashboard/
├── index.html              # الصفحة الرئيسية للوحة التحكم
├── orders.html             # إدارة الطلبات وعروض الأسعار
├── services.html           # إدارة الخدمات
├── add-service.html        # إضافة خدمة جديدة
├── edit-service.html       # تعديل خدمة قائمة
├── packages.html           # إدارة الباقات والاشتراكات
├── supervisors.html        # إدارة المشرفين وفريق العمل
├── roles.html              # إدارة الأدوار والصلاحيات
├── settings.html           # إعدادات الموقع الإلكتروني
├── contact.html            # رسائل تواصل معنا
├── login.html              # تسجيل الدخول
├── enter-email.html        # نسيت كلمة المرور
├── otp.html                # تأكيد رمز التحقق OTP
├── reset-password.html     # إعادة تعيين كلمة المرور
├── new-password.html       # كلمة مرور جديدة
├── css/
│   ├── dashboard.css       # التنسيقات الرئيسية للوحة التحكم والوضع الليلي
│   ├── auth.css            # تنسيقات صفحات تسجيل الدخول والمصادقة
│   └── responsive.css      # تنسيقات التجاوب للأجهزة الذكية
├── js/
│   └── dashboard.js        # منطق التفاعل، المودالات، الثيم، والفلاتر
└── assets/
    ├── images/             # الصور والصور الرمزية
    ├── icons/              # الأيقونات
    └── logos/              # شعارات الاستوديو
```

---

## 🚀 طريقة التشغيل (Getting Started)

المشروع مبني بتقنيات الويب القياسية (Pure HTML5, CSS3, JavaScript Vanilla):
1. قم بفتح ملف `index.html` أو `login.html` في أي متصفح حديث (Chrome, Edge, Safari, Firefox).
2. لا يتطلب أي خوادم أو تثبيت مكتبات خارجية.

---

## 🎨 التقنيات المستخدمة (Tech Stack)

- **HTML5** دلالي كامل مع دعم RTL للغة العربية.
- **CSS3** (CSS Variables, Flexbox, CSS Grid, Custom Keyframe Animations, Glassmorphism, Luxury Dark Palette).
- **JavaScript (ES6+)** لإدارة الحالة، النوافذ، الثيم، والتصدير.
