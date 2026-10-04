# استوديو زايد - لوحة التحكم الاحترافية (AZ Studio Dashboard)

> لوحة تحكم إدارية وموقع متكامل لشركة **AZ Studio** للإنتاج الفني والمرئي، مبنية وفق أحدث معايير هندسة وتطوير واجهات المستخدم (Enterprise Front-End Architecture).

[![CI Code Quality](https://github.com/A7medWageh/zayed-dashboard/actions/workflows/ci.yml/badge.svg)](https://github.com/A7medWageh/zayed-dashboard/actions/workflows/ci.yml)
[![Node.js](https://img.shields.io/badge/node->=20.0.0-brightgreen.svg)](https://nodejs.org/)
[![Vite](https://img.shields.io/badge/vite-5.x-purple.svg)](https://vitejs.dev/)
[![ESLint](https://img.shields.io/badge/eslint-passing-blue.svg)](https://eslint.org/)
[![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io/)
[![Vitest](https://img.shields.io/badge/vitest-unit_tests-green.svg)](https://vitest.dev/)

---

## 🏛️ معمارية المشروع (Architecture Overview)

تمت إعادة هيكلة المشروع بالكامل وفقًا لأعلى معايير الـ Front-End الهندسية للتحول من مجرد نموذج تصميم تجريبي (Static Prototype) إلى نظام لوحة تحكم حقيقي متكامل جاهز للإنتاج (Production-Ready Architecture):

```
zayed-dashboard/
├── .github/workflows/
│   └── ci.yml                 # خط تدقيق الجودة الآلي المستمر (CI: Lint, Format, Tests, HTML audit)
├── assets/                    # الأيقونات والشعارات والوسائط
├── assets-design/             # التصاميم المساعدة
├── css/
│   ├── tokens.css             # متغيرات التصميم (Design Tokens, Palette, Shadows, Dark/Light Theme)
│   ├── components.css         # كلاسات المكونات العامة (Modals, Toasts, Pagination, Buttons)
│   ├── dashboard.css          # استايلات لوحة التحكم النظيفة
│   ├── auth.css               # استايلات صفحات تسجيل الدخول والمصادقة
│   └── responsive.css         # التجاوب مع مختلف الشاشات والأجهزة المحمولة
├── js/
│   ├── components/
│   │   ├── AppShell.js        # إدارة السايدبار، الهيدر، والقوائم المنسدلة
│   │   ├── ModalManager.js    # إدارة النوافذ المنبثقة (Focus Trap, Esc, ARIA Dialog, Accessibility)
│   │   └── ToastManager.js    # نظام إشعارات آمن مضاد لثغرات XSS مع دعم قراء الشاشة
│   ├── services/
│   │   ├── apiClient.js       # محاكي واجهات برمجة التطبيقات والتخزين المستمر (Mock Persistence Store)
│   │   ├── authService.js     # خدمة المصادقة والجلسات والتحقق من الصلاحيات
│   │   ├── http.js            # طبقة اتصالات HTTP موحدة
│   │   ├── orders.api.js      # خدمة بيانات الطلبات
│   │   ├── services.api.js    # خدمة إدارة الخدمات
│   │   └── settings.api.js    # خدمة حفظ واسترجاع الإعدادات
│   ├── auth.js                # معالجة استمارات المصادقة (Login, OTP, Password Reset)
│   ├── authGuard.js           # حارس المسارات (Route Guard) لمنع الوصول غير المصرح به
│   ├── dashboard.js           # تفاعلات لوحة التحكم، تفويض الأحداث، الجداول، والترقيم
│   └── main.js                # ملف مهجور موثق (@deprecated) للتوافقية
├── tests/
│   ├── setup.js               # إعداد بيئة الاختبارات ومحاكاة التخزين
│   ├── api.test.js            # اختبارات طبقة البيانات والـ CRUD
│   └── auth.test.js           # اختبارات منطق المصادقة وحماية الجلسات
├── index.html                 # المدخل الرئيسي المعتمد للوحة التحكم
├── login.html                 # صفحة تسجيل الدخول
├── enter-email.html           # طلب استعادة كلمة المرور
├── otp.html                   # التحقق من رمز التحقق
├── new-password.html          # تعيين كلمة المرور الجديدة
├── reset-password.html        # إعادة تعيين كلمة المرور
├── orders.html                # إدارة الطلبات
├── services.html              # إدارة الخدمات
├── packages.html              # إدارة الباقات
├── supervisors.html           # إدارة المشرفين
├── roles.html                 # إدارة الأدوار والصلاحيات
├── settings.html              # إعدادات النظام والموقع
├── package.json               # حزم وتوجيهات المشروع
└── vite.config.js             # إعدادات Vite & Vitest
```

---

## ✅ جدول معالجة ملاحظات المراجعة الفنية (Code Review Compliance Matrix)

| البند في تقرير المراجعة             |  الأولوية  | الحل الهندسي المطبق في الـ Codebase                                                                                                                                             |
| :---------------------------------- | :--------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **1. Auth Flow**                    | `CRITICAL` | استبدال التنقل الشكلي بـ `authService.js` مع جلسات تخزين (`Tokens`)، والتحقق الفعلي، وتفعيل `authGuard.js` لإعادة توجيه غير المسجلين لصفحة الدخول تلقائيًا.                     |
| **2. Dead Code (main.js)**          | `CRITICAL` | توثيق `main.js` رسمياً بـ `@deprecated` وتوجيهه لـ `js/auth.js` عبر تحذيرات المطورين، وتوحيد المعرفات (`IDs`) واستخدام الـ ES Modules.                                          |
| **3. Page Duplication**             | `CRITICAL` | توحيد صفحات `home.html` و `dashboard.html` كإعادة توجيه قانونية (`Canonical Redirects`) لـ `index.html`، وتخصيص حقلي `new-password.html` و `reset-password.html` بمعرفات فريدة. |
| **4. CRUD Persistence**             | `CRITICAL` | بناء `apiClient.js` و `http.js` لإجراء كافة عمليات الإضافة والحفظ والتعديل والحذف وحفظها في التخزين، مع مؤشرات التحميل والتعطيل التلقائي للأزرار أثناء الحفظ.                   |
| **5. God File (settings.html)**     |   `HIGH`   | إزالة كافة الـ 42 inline handlers، حذف الاستدعاءات العشوائية، وربط البطاقات بـ Event Delegation ديناميكي.                                                                       |
| **6. CSS Specificity & !important** |   `HIGH`   | إنشاء ملف `tokens.css` بنظام متغيرات CSS حديث، وتنظيم الطبقات المعمارية في `components.css`.                                                                                    |
| **7. Inline Styles**                |   `HIGH`   | استخراج كلاسات موحدة للمسافات، الجداول، الأزرار، والبطاقات في نظام التصميم (`components.css`).                                                                                  |
| **8. Inline Event Handlers**        |   `HIGH`   | القضاء التام (0 Inline Handlers) على `onclick` و `onsubmit` في كافة ملفات المشروع بنسبة 100% واعتماد `data-*` attributes مع Event Delegation.                                   |
| **9. document.write Elimination**   |   `HIGH`   | حذف أي استخدام لـ `document.write()` نهائياً وبناء الجداول عبر دوال DOM نظيفة وآمنة.                                                                                            |
| **10. XSS Prevention & innerHTML**  |   `HIGH`   | استخدام `textContent` في الإشعارات والرسائل لمنع هجمات الحقن، مع ضبط سمات `role="status"` و `aria-live="polite"`.                                                               |
| **11. Modal Accessibility**         |  `MEDIUM`  | تطبيق `ModalManager.js` كامل المواصفات: `role="dialog"`، `aria-modal="true"`، حبس التركيز داخل المودال (Focus Trap)، الإغلاق بمفتاح `Esc`، واستعادة التركيز للعنصر المشغل.      |
| **12. Accessible Accordions**       |  `MEDIUM`  | دعم كامل للوحة المفاتيح بالـ `Enter` و `Space`، وتحديث `aria-expanded` تلقائياً لكل البطاقات.                                                                                   |
| **13. Form Labels & Inputs**        |  `MEDIUM`  | ربط كافة التسميات بحقول الإدخال عبر `for` و `id`، وتوفير نصوص مساعدة لمطالعي الشاشات.                                                                                           |
| **14. Semantic Pagination**         |  `MEDIUM`  | استبدال روابط `href="#"` الشكلية بـ 56 زراً حقيقياً `<button type="button" class="page-btn">` مربوط بنظام تنقل تفاعلي في الـ JavaScript.                                        |
| **15. Tooling, Tests & CI**         |   `HIGH`   | بناء بنية تطوير متكاملة: Vite + ESLint + Prettier + Vitest + GitHub Actions CI تعمل تلقائياً مع كل Pull Request و Push.                                                         |

---

## 🚀 التشغيل والأوامر البرمجية (Scripts & Tooling)

### المتطلبات الأساسية

- Node.js (الإصدار 20 فما فوق)
- npm

### تشغيل خادم التطوير المحلي

```bash
npm run dev
```

### فحص وتدقيق الكود (Linting)

```bash
npm run lint
```

### فحص ومطابقة التنسيق القياسي (Formatting Check)

```bash
npm run format:check
```

### التنسيق الآلي للملفات (Auto Format)

```bash
npm run format
```

### تشغيل حزمة الاختبارات الآلية (Unit & Integration Tests)

```bash
npm test
```

### بناء حزمة الإنتاج (Production Build)

```bash
npm run build
```

---

## 🧪 نتائج الاختبارات وجودة الكود

- **الاختبارات الآلية (Vitest)**: نجاح بنسبة 100% لكافة اختبارات طبقة البيانات والمصادقة (11/11 Passed).
- **التدقيق البرمجي (ESLint)**: 0 أخطاء و 0 تحذيرات.
- **التنسيق (Prettier)**: كافة الملفات مطابقة لمعايير التنسيق العالمية.
- **بناء الإنتاج (Vite Build)**: بناء فوري بدون أي أخطاء تجميع أو عناصر ناقصة.
