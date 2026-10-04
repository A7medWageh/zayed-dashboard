/**
 * AZ Studio - API Client & Mock Persistence Layer
 * Provides REST-like CRUD operations backed by localStorage with realistic async responses
 */

const STORAGE_PREFIX = 'az_db_';

// Initial Mock Seed Data
const DEFAULT_SEED_DATA = {
  orders: [
    { id: '1001', code: '#AZ-1001', clientName: 'شركة الرواد للإنتاج', serviceName: 'إنتاج إعلاني مرئي', date: '2026-10-01', amount: 45000, status: 'in_progress', statusText: 'قيد التنفيذ', notes: 'تصوير فيديو سينمائي بدقة 4K' },
    { id: '1002', code: '#AZ-1002', clientName: 'مؤسسة الرياض الرقمية', serviceName: 'موشن جرافيك 3D', date: '2026-10-02', amount: 18000, status: 'completed', statusText: 'مكتمل', notes: 'فيديو توعوي 60 ثانية' },
    { id: '1003', code: '#AZ-1003', clientName: 'مجموعة الأفق العقارية', serviceName: 'تصوير معماري وجوي', date: '2026-10-03', amount: 32000, status: 'pending', statusText: 'في الانتظار', notes: 'تصوير بطائرات درون بدقة عالية' },
    { id: '1004', code: '#AZ-1004', clientName: 'متجر سلة الشرق', serviceName: 'ريلز وإعلانات سوشيال ميديا', date: '2026-10-04', amount: 12500, status: 'in_progress', statusText: 'قيد التنفيذ', notes: 'سلسلة 10 فيديوهات إنستغرام وتيك توك' }
  ],
  services: [
    { id: 'srv_1', title: 'موشن جرافيك', description: 'تصميم وتحريك رسومات احترافية ثنائية وثلاثية الأبعاد', category: 'الإنتاج الرقمي', price: 'تبدأ من 5,000 ر.س', isFeatured: true },
    { id: 'srv_2', title: 'الإنتاج السينمائي والإعلاني', description: 'تصوير وإخراج إعلانات تجارية وأفلام وثائقية بأحدث الكاميرات', category: 'الإنتاج المرئي', price: 'تبدأ من 25,000 ر.س', isFeatured: true },
    { id: 'srv_3', title: 'التصوير الفوتوغرافي والمعماري', description: 'جلسات تصوير احترافية للمنتجات والمشاريع والمؤتمرات', category: 'التصوير', price: 'تبدأ من 3,500 ر.س', isFeatured: false },
    { id: 'srv_4', title: 'الهندسة الصوتية والدوبلاج', description: 'تسجيل وتعليق صوتي احترافي مع مؤثرات صوتية استوديو', category: 'الصوتيات', price: 'تبدأ من 2,000 ر.س', isFeatured: false }
  ],
  packages: [
    { id: 'pkg_1', title: 'الباقة الأساسية', price: 15000, duration: 'شهر', features: ['فيديو إعلاني رئيسي 30 ثانية', '3 فيديوهات ريلز قصيرة', 'تصميم بوسترات ترويجية', 'تعديل مرتين مجاناً'], isPopular: false },
    { id: 'pkg_2', title: 'الباقة المتقدمة', price: 35000, duration: '3 أشهر', features: ['3 فيديوهات إعلانية سينمائية', '10 فيديوهات ريلز قصيرة', 'جلسة تصوير فوتوغرافي كاملة', 'إشراف ومونتاج شامل'], isPopular: true },
    { id: 'pkg_3', title: 'باقة الشركات الكبرى (Enterprise)', price: 75000, duration: '6 أشهر', features: ['تغطية كاملة للمؤتمرات والفعاليات', 'إنتاج وثائقي تعريفي', 'خطة إنتاج محتوى أسبوعية', 'فريق مخصص 24/7'], isPopular: false }
  ],
  supervisors: [
    { id: 'sup_1', code: '#601', name: 'محمد عبد الرحمن', phone: '01024200163', email: 'mohamed.abdelrahman@azstudio.com', nationalId: '1233444448', role: 'مشرف عام', status: 'active', statusText: 'نشط' },
    { id: 'sup_2', code: '#602', name: 'كريم الشرقاوي', phone: '01099887766', email: 'kareem.elsharkawy@azstudio.com', nationalId: '1233444449', role: 'مدير إنتاج', status: 'active', statusText: 'نشط' },
    { id: 'sup_3', code: '#603', name: 'سارة المنصور', phone: '0501234567', email: 'sara.almansour@azstudio.com', nationalId: '1233444450', role: 'مشرفة محتوى', status: 'active', statusText: 'نشط' }
  ],
  roles: [
    { id: 'role_1', name: 'مشرف عام (Admin)', description: 'صلاحيات وصول كاملة لكافة أقسام النظام والإعدادات والطلبات', usersCount: 3, permissions: ['ALL'] },
    { id: 'role_2', name: 'مدير إنتاج (Production Lead)', description: 'إدارة وتعيين الطلبات والخدمات ومتابعة حالة الإنجاز', usersCount: 5, permissions: ['ORDERS_READ', 'ORDERS_WRITE', 'SERVICES_READ', 'SERVICES_WRITE'] },
    { id: 'role_3', name: 'مشرف محتوى (Content Editor)', description: 'تعديل محتوى الموقع والصفحات والمقالات والأسئلة الشائعة', usersCount: 2, permissions: ['SETTINGS_READ', 'SETTINGS_WRITE'] }
  ],
  settings: {
    siteName: 'استوديو زايد للإنتاج الفني والمرئي',
    siteEmail: 'contact@azstudio.com',
    sitePhone: '+966 50 123 4567',
    siteAddress: 'الرياض - طريق الملك فهد - برج الابتكار',
    metaTitle: 'AZ Studio | استوديو زايد للإنتاج الفني والمرئي',
    metaDescription: 'الاستوديو الرائد في المملكة العربية السعودية للإنتاج المرئي والسينمائي والموشن جرافيك بأعلى معايير الجودة العالمية.',
    facebook: 'https://facebook.com/azstudio',
    instagram: 'https://instagram.com/azstudio',
    twitter: 'https://x.com/azstudio',
    linkedin: 'https://linkedin.com/company/azstudio'
  }
};

/**
 * Initialize mock tables if not already present
 */
function initializeStore(resource) {
  const key = STORAGE_PREFIX + resource;
  if (!localStorage.getItem(key)) {
    const data = DEFAULT_SEED_DATA[resource] || [];
    localStorage.setItem(key, JSON.stringify(data));
    return data;
  }
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return DEFAULT_SEED_DATA[resource] || [];
  }
}

export const ApiClient = {
  /**
   * Fetch all records of a given resource
   */
  async getAll(resource) {
    await new Promise(r => setTimeout(r, 200));
    return initializeStore(resource);
  },

  /**
   * Fetch a single record by ID
   */
  async getById(resource, id) {
    await new Promise(r => setTimeout(r, 150));
    const items = initializeStore(resource);
    const item = items.find(i => String(i.id) === String(id));
    if (!item) throw new Error(`العنصر غير موجود: ${id}`);
    return item;
  },

  /**
   * Create a new record
   */
  async create(resource, data) {
    await new Promise(r => setTimeout(r, 350));
    const items = initializeStore(resource);
    const newItem = {
      id: 'id_' + Date.now(),
      createdAt: new Date().toISOString(),
      ...data
    };
    items.unshift(newItem);
    localStorage.setItem(STORAGE_PREFIX + resource, JSON.stringify(items));
    return newItem;
  },

  /**
   * Update an existing record
   */
  async update(resource, id, data) {
    await new Promise(r => setTimeout(r, 350));
    const items = initializeStore(resource);
    const index = items.findIndex(i => String(i.id) === String(id));
    if (index === -1) throw new Error(`العنصر المطلوب تعديله غير موجود: ${id}`);
    
    items[index] = { ...items[index], ...data, updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_PREFIX + resource, JSON.stringify(items));
    return items[index];
  },

  /**
   * Delete a record
   */
  async delete(resource, id) {
    await new Promise(r => setTimeout(r, 300));
    const items = initializeStore(resource);
    const filtered = items.filter(i => String(i.id) !== String(id));
    localStorage.setItem(STORAGE_PREFIX + resource, JSON.stringify(filtered));
    return { success: true, id };
  },

  /**
   * Get Settings Key-Value object
   */
  async getSettings() {
    await new Promise(r => setTimeout(r, 150));
    return initializeStore('settings');
  },

  /**
   * Save Settings
   */
  async saveSettings(data) {
    await new Promise(r => setTimeout(r, 400));
    const current = initializeStore('settings');
    const updated = { ...current, ...data };
    localStorage.setItem(STORAGE_PREFIX + 'settings', JSON.stringify(updated));
    return updated;
  }
};
