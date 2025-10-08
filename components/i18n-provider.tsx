"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"

type Lang = "ru" | "uz"

type Messages = Record<string, string>

const ru: Messages = {
  "nav.products": "Продукция",
  "nav.about": "О нас",
  "nav.reviews": "Отзывы",
  "nav.faq": "FAQ",
  "nav.menu": "Меню",
  "nav.menuDesc": "Навигация по сайту",
  "action.order": "Заказать",
  "auth.login": "Вход в аккаунт",
  "auth.register": "Регистрация",
  "auth.loginDesc": "Войдите в свой аккаунт для оформления заказов",
  "auth.registerDesc": "Создайте аккаунт для быстрого оформления заказов",
  "auth.email": "Email",
  "auth.password": "Пароль",
  "auth.passwordConfirm": "Подтвердите пароль",
  "auth.loginBtn": "Войти",
  "auth.registerBtn": "Зарегистрироваться",
  "auth.toRegister": "Нет аккаунта? Зарегистрироваться",
  "auth.toLogin": "Есть аккаунт? Войти",
  "order.loginToOrder": "Войдите в свой аккаунт для оформления заказа",
  "order.loginAndBuy": "Войти и заказать",

  // Home - Hero
  "hero.badge": "Премиум качество • Невидимая интеграция",
  "hero.title1": "Ревизионные люки,",
  "hero.title2": "которых не видно",
  "hero.subtitle":
    "Инженерное совершенство для идеальной интеграции в любой интерьер. Минимальные зазоры, скрытые петли, магнитные замки.",
  "hero.configurator": "Конфигуратор",
  "hero.viewModels": "Смотреть модели",

  // Home - Products
  "products.title": "Модельный ряд",
  "products.subtitle": "Четыре модели для любых задач — от стандартных до премиальных решений",
  "products.configure": "Настроить",
  "products.transformer.name": "Transformer",
  "products.transformer.desc": "Универсальная модель с возможностью открывания в любую сторону",
  "products.transformer.f1": "Скрытые петли",
  "products.transformer.f2": "Магнитный замок",
  "products.transformer.f3": "Зазор 1-2мм",
  "products.universal.name": "Universal",
  "products.universal.desc": "Классическая модель для стандартных задач",
  "products.universal.f1": "Надежная конструкция",
  "products.universal.f2": "Простой монтаж",
  "products.universal.f3": "Доступная цена",
  "products.floor.name": "Floor",
  "products.floor.desc": "Напольная модель повышенной прочности",
  "products.floor.f1": "Усиленная рама",
  "products.floor.f2": "Нагрузка до 200кг",
  "products.floor.f3": "Влагозащита",
  "products.anodos.name": "Anodos",
  "products.anodos.desc": "Премиум-модель с анодированным покрытием",
  "products.anodos.f1": "Анодирование",
  "products.anodos.f2": "Коррозионная стойкость",
  "products.anodos.f3": "Элитный дизайн",

  // Home - Statistics
  "stats.years": "Лет на рынке",
  "stats.installed": "Установленных люков",
  "stats.clients": "Довольных клиентов",
  "stats.support": "Поддержка",

  // Home - Reviews
  "reviews.title": "Отзывы клиентов",
  "reviews.subtitle": "Более 5000 довольных клиентов по всей России",
  "reviews.cards.alexey.name": "Алексей М.",
  "reviews.cards.alexey.role": "Дизайнер интерьеров",
  "reviews.cards.alexey.content": "Использую люки Revizor во всех своих проектах. Качество на высшем уровне, клиенты всегда довольны.",
  "reviews.cards.maria.name": "Мария К.",
  "reviews.cards.maria.role": "Владелец квартиры",
  "reviews.cards.maria.content": "Установили модель Transformer в ванной. Действительно незаметен, зазоры минимальные. Рекомендую!",
  "reviews.cards.dmitry.name": "Дмитрий П.",
  "reviews.cards.dmitry.role": "Строительная компания",
  "reviews.cards.dmitry.content": "Работаем с Revizor уже 3 года. Надежный поставщик, качественная продукция, быстрая доставка.",

  // About page
  "about.hero.title": "О компании Revizor",
  "about.hero.subtitle": "Мы создаем премиальные невидимые ревизионные люки для идеальной интеграции в интерьер — с минимальными зазорами, скрытыми петлями и надежными замками.",
  "about.hero.valuesBtn": "Наши ценности",
  "about.hero.configuratorBtn": "Конфигуратор",
  "about.values.title": "Наши ценности",
  "about.values.subtitle": "Точность, надежность и эстетика — принципы, на которых строится каждый продукт Revizor.",
  "about.values.card1.title": "Премиальные материалы",
  "about.values.card1.desc": "Используем алюминий и нержавеющую сталь высшего качества.",
  "about.values.card2.title": "Инженерная точность",
  "about.values.card2.desc": "Микро-зазоры, скрытая фурнитура и долговечные механизмы.",
  "about.values.card3.title": "Эстетичная интеграция",
  "about.values.card3.desc": "Люки, которые гармонично растворяются в пространстве.",
  "about.map.title": "Карта: рынок Куйлюк, магазин 36-А (Яндекс гибрид)",
  "about.contact.address": "г. Ташкент, Бектемирский район, рынок “Куйлюк”, магазин 36-А",
  "about.contact.hours.title": "Режим работы",
  "about.contact.hours.weekdays": "Пн – Чт: с 8:00 до 18:00",
  "about.contact.hours.friday": "Пт: с 10:00 до 16:00",
  "about.contact.phone.title": "Телефон",
  "about.contact.callBtn": "Позвонить",

  // Footer
  "footer.products": "Продукция",
  "footer.company": "Компания",
  "footer.contacts": "Контакты",
  "footer.about": "О нас",
  "footer.tagline": "Премиальные ревизионные люки для идеальной интеграции в интерьер",
  "footer.copyright": "© 2025 Revizor. Все права защищены.",
  "footer.address": "г. Ташкент, Бектемирский район, рынок \"Куйлюк\", магазин 36-А",

  // FAQ
  "faq.title": "Частые вопросы",
  "faq.subtitle": "Ответы на самые популярные вопросы о наших люках",
  "faq.q1.q": "Какой размер люка мне нужен?",
  "faq.q1.a": "Размер люка зависит от размера ревизионного отверстия. Мы рекомендуем добавить 50-100мм к размеру отверстия для удобного монтажа. В нашем конфигураторе вы можете указать точные размеры.",
  "faq.q2.q": "Как происходит монтаж?",
  "faq.q2.a": "Монтаж люка занимает 30-60 минут. В комплекте идет подробная инструкция и все необходимые крепежные элементы. Также мы предлагаем услуги профессионального монтажа.",
  "faq.q3.q": "Какое покрытие выбрать?",
  "faq.q3.a": "Для влажных помещений рекомендуем порошковое покрытие или анодирование. Для сухих помещений подойдет любой вариант. Все покрытия долговечны и легко моются.",
  "faq.q4.q": "Какие сроки изготовления?",
  "faq.q4.a": "Стандартные размеры — 3-5 рабочих дней. Нестандартные размеры — 7-10 рабочих дней. Доставка по Москве — 1-2 дня, по России — 3-7 дней.",
  "faq.q5.q": "Есть ли гарантия?",
  "faq.q5.a": "Да, на все наши изделия предоставляется гарантия 5 лет. Гарантия покрывает производственные дефекты и проблемы с механизмами.",

  "cfg.chooseModel": "Выбор модели",
  "cfg.sizes": "Размеры",
  "cfg.sizesDesc": "Укажите размеры в миллиметрах",
  "cfg.width": "Ширина (мм)",
  "cfg.height": "Высота (мм)",
  "cfg.finish": "Тип покрытия",
  "cfg.quantity": "Количество",
  "cfg.total": "Итоговая стоимость",
  "cfg.totalLabel": "Итого:",
  "cfg.checkout": "Оформить заказ",
  "cfg.pcs": "шт.",
  "cfg.page.title": "Конфигуратор люков",
  "cfg.page.subtitle": "Настройте люк под ваши требования",
  "cfg.sizes.minmax": "Минимум: 300мм, Максимум: 1500мм",
  "cfg.finishBase": "Базовая цена",
  "cfg.summary": "Итоговая стоимость",
  "cfg.summary.model": "Модель:",
  "cfg.summary.size": "Размер:",
  "cfg.summary.cover": "Покрытие:",
  "cfg.summary.count": "Количество:",
  "cfg.summary.total": "Итого:",
  "cfg.priceFrom": "от",

  "checkout.title": "Оформление заказа",
  "cfg.finish.powder": "Порошковое покрытие",
  "cfg.finish.anodized": "Анодирование",
  "cfg.finish.stainless": "Нержавеющая сталь",
  "checkout.subtitle": "Заполните контактные данные для завершения заказа",
  "checkout.contact": "Контактные данные",
  "checkout.contactDesc": "Укажите ваши контактные данные для связи",
  "checkout.name": "Имя",
  "checkout.phone": "Телефон",
  "checkout.email": "Email",
  "checkout.address": "Адрес доставки",
  "checkout.addressDesc": "Укажите адрес для доставки заказа",
  "checkout.fullAddress": "Полный адрес",
  "checkout.comment": "Комментарий к заказу",
  "checkout.submit": "Подтвердить заказ",
  "checkout.yourOrder": "Ваш заказ",
  "checkout.model": "Модель:",
  "checkout.size": "Размер:",
  "checkout.cover": "Покрытие:",
  "checkout.count": "Количество:",
  "checkout.placeholder.name": "Имя Фамилия",
  "checkout.placeholder.phone": "+99891 234 56 78",
  "checkout.placeholder.email": "example@gmail.com",
  "checkout.placeholder.fullAddress": "Город, улица, дом, квартира",
  "checkout.placeholder.comment": "Дополнительная информация, пожелания по доставке",
  "checkout.submitting": "Оформление...",
  "checkout.success.title": "Заказ успешно оформлен!",
  "checkout.success.desc": "Мы получили ваш заказ и свяжемся с вами в ближайшее время для подтверждения деталей.",
  "checkout.success.toHome": "На главную",
  "checkout.success.newOrder": "Новый заказ",
  "checkout.notice": "Окончательная стоимость будет рассчитана после подтверждения заказа менеджером",

  // Address Map
  "map.searchPlaceholder": "Начните вводить адрес...",
  "map.pickAddress": "Выберите адрес доставки",
  "map.startTyping": "Начните вводить адрес в поле поиска выше",
  "map.hint": "Введите адрес в поле поиска и выберите подходящий вариант из списка",
}

const uz: Messages = {
  "nav.products": "Mahsulotlar",
  "nav.about": "Biz haqimizda",
  "nav.reviews": "Sharhlar",
  "nav.faq": "Savol-javob",
  "nav.menu": "Menyu",
  "nav.menuDesc": "Saytda navigatsiya",
  "action.order": "Buyurtma berish",
  "auth.login": "Shaxsiy kabinetga kirish",
  "auth.register": "Ro‘yxatdan o‘tish",
  "auth.loginDesc": "Buyurtma berish uchun profilingizga kiring",
  "auth.registerDesc": "Tezkor buyurtma uchun profil yarating",
  "auth.email": "Email",
  "auth.password": "Parol",
  "auth.passwordConfirm": "Parolni tasdiqlang",
  "auth.loginBtn": "Kirish",
  "auth.registerBtn": "Ro‘yxatdan o‘tish",
  "auth.toRegister": "Profil yo‘qmi? Ro‘yxatdan o‘ting",
  "auth.toLogin": "Profil bormi? Kiring",
  "order.loginToOrder": "Buyurtma berish uchun profilingizga kiring",
  "order.loginAndBuy": "Kirish va buyurtma berish",

  // Home - Hero
  "hero.badge": "Premium sifat • Ko‘rinmas integratsiya",
  "hero.title1": "Revizion lyuklar,",
  "hero.title2": "ko‘rinmaydi",
  "hero.subtitle":
    "Har qanday interyerga mukammal integratsiya uchun muhandislik yechimi. Minimal tirqishlar, yashirin ilgaklar, magnit qulflar.",
  "hero.configurator": "Konfigurator",
  "hero.viewModels": "Modellarni ko‘rish",

  // Home - Products
  "products.title": "Model qatori",
  "products.subtitle": "Har qanday vazifa uchun to‘rtta model — standartdan premiumgacha",
  "products.configure": "Sozlash",
  "products.transformer.name": "Transformer",
  "products.transformer.desc": "Har tomonga ochiladigan universal model",
  "products.transformer.f1": "Yashirin ilmoqlar",
  "products.transformer.f2": "Magnit qulf",
  "products.transformer.f3": "1–2 mm tirqish",
  "products.universal.name": "Universal",
  "products.universal.desc": "Standart vazifalar uchun klassik model",
  "products.universal.f1": "Ishonchli konstruksiya",
  "products.universal.f2": "Oson o‘rnatish",
  "products.universal.f3": "Qulay narx",
  "products.floor.name": "Floor",
  "products.floor.desc": "Yuqori mustahkamlikdagi polga mo‘ljallangan model",
  "products.floor.f1": "Kuchaytirilgan ramka",
  "products.floor.f2": "200 kg gacha yuklama",
  "products.floor.f3": "Namlikdan himoya",
  "products.anodos.name": "Anodos",
  "products.anodos.desc": "Anodlangan qoplamali premium model",
  "products.anodos.f1": "Anodlash",
  "products.anodos.f2": "Korroziyaga chidamli",
  "products.anodos.f3": "Elita dizayn",

  // Home - Statistics
  "stats.years": "Yillik tajriba",
  "stats.installed": "O‘rnatilgan lyuklar",
  "stats.clients": "Mamnun mijozlar",
  "stats.support": "Qo‘llab-quvvatlash",

  // Home - Reviews
  "reviews.title": "Mijozlar fikri",
  "reviews.subtitle": "Butun O‘zbekistonda minglab mamnun mijozlar",
  "reviews.cards.alexey.name": "Aleksey M.",
  "reviews.cards.alexey.role": "Interyer dizayneri",
  "reviews.cards.alexey.content": "Loyihalarimning barchasida Revizor lyuklaridan foydalanaman. Sifat yuqori, mijozlar har doim mamnun.",
  "reviews.cards.maria.name": "Mariya K.",
  "reviews.cards.maria.role": "Kvartira egasi",
  "reviews.cards.maria.content": "Hammomga Transformer modelini o‘rnatdik. Haqiqatan ham ko‘rinmaydi, tirqishlar minimal. Tavsiya qilaman!",
  "reviews.cards.dmitry.name": "Dmitriy P.",
  "reviews.cards.dmitry.role": "Qurilish kompaniyasi",
  "reviews.cards.dmitry.content": "Revizor bilan 3 yildan beri ishlaymiz. Ishonchli yetkazib beruvchi, sifatli mahsulot, tezkor yetkazib berish.",

  // About page
  "about.hero.title": "Revizor kompaniyasi haqida",
  "about.hero.subtitle": "Interyorga ideal moslashadigan ko‘rinmas premium revizion lyuklarni yaratamiz — minimal tirqishlar, yashirin ilmoqlar va ishonchli qulflar bilan.",
  "about.hero.valuesBtn": "Qadriyatlarimiz",
  "about.hero.configuratorBtn": "Konfigurator",
  "about.values.title": "Qadriyatlarimiz",
  "about.values.subtitle": "Har bir Revizor mahsuloti aniqlik, ishonchlilik va estetika tamoyillariga asoslanadi.",
  "about.values.card1.title": "Premium materiallar",
  "about.values.card1.desc": "Yuqori sifatli alyuminiy va zanglamaydigan po‘latdan foydalanamiz.",
  "about.values.card2.title": "Muhandislik aniqligi",
  "about.values.card2.desc": "Mikro-tirqishlar, yashirin furnitura va bardoshli mexanizmlar.",
  "about.values.card3.title": "Estetik integratsiya",
  "about.values.card3.desc": "Makonda uyg‘un erishib ketadigan lyuklar.",
  "about.map.title": "Xarita: Qo'yliq bozori, 36-A do‘kon (Yandex gibrid)",
  "about.contact.address": "Toshkent shahri, Bektemir tumani, ‘Qo'yliq’ bozori, 36-A do‘kon",
  "about.contact.hours.title": "Ish vaqti",
  "about.contact.hours.weekdays": "Dushanba – Payshanba: 8:00–18:00",
  "about.contact.hours.friday": "Juma: 10:00–16:00",
  "about.contact.phone.title": "Telefon",
  "about.contact.callBtn": "Qo‘ng‘iroq qilish",

  // Footer
  "footer.products": "Mahsulotlar",
  "footer.company": "Kompaniya",
  "footer.contacts": "Kontaktlar",
  "footer.about": "Biz haqimizda",
  "footer.tagline": "Interyerga mukammal moslashadigan premium revizion lyuklar",
  "footer.copyright": "© 2025 Revizor. Barcha huquqlar himoyalangan.",
  "footer.address": "Toshkent shahri, Bektemir tumani, ‘Qo'yliq’ bozori, 36-A do‘kon",

  // FAQ
  "faq.title": "Ko‘p beriladigan savollar",
  "faq.subtitle": "Lyuklarimiz haqidagi eng mashhur savollarga javoblar",
  "faq.q1.q": "Qaysi o‘lchamdagi lyuk kerak?",
  "faq.q1.a": "Lyuk o‘lchami revizion teshik o‘lchamiga bog‘liq. O‘rnatish qulay bo‘lishi uchun teshik o‘lchamiga 50–100 mm qo‘shishni tavsiya qilamiz. Konfiguratorda aniq o‘lchamlarni belgilashingiz mumkin.",
  "faq.q2.q": "Montaj qanday amalga oshiriladi?",
  "faq.q2.a": "Lyukni o‘rnatish 30–60 daqiqa davom etadi. To‘plamda batafsil yo‘riqnoma va barcha kerakli mahkamlagichlar bor. Shuningdek, professional montaj xizmatini ham taklif qilamiz.",
  "faq.q3.q": "Qaysi qoplamani tanlash kerak?",
  "faq.q3.a": "Nam xonalar uchun kukunli qoplama yoki anodlashni tavsiya qilamiz. Quruq xonalar uchun har qanday variant mos. Barcha qoplamalar chidamli va oson tozalanadi.",
  "faq.q4.q": "Ishlab chiqarish muddatlari qanday?",
  "faq.q4.a": "Standart o‘lchamlar — 3–5 ish kuni. Nostal o‘lchamlar — 7–10 ish kuni. Toshkent bo‘yicha yetkazib berish — 1–2 kun.",
  "faq.q5.q": "Kafolat bormi?",
  "faq.q5.a": "Ha, barcha mahsulotlarimizga 5 yil kafolat beriladi. Kafolat ishlab chiqarishdagi nuqsonlar va mexanizmlardagi muammolarni qamrab oladi.",

  "cfg.chooseModel": "Model tanlash",
  "cfg.sizes": "O‘lchamlar",
  "cfg.sizesDesc": "O‘lchamlarni millimetrda kiriting",
  "cfg.width": "Kenglik (mm)",
  "cfg.height": "Balandlik (mm)",
  "cfg.finish": "Qoplama turi",
  "cfg.quantity": "Soni",
  "cfg.total": "Yakuniy narx",
  "cfg.totalLabel": "Jami:",
  "cfg.checkout": "Buyurtma qilish",
  "cfg.pcs": "dona",
  "cfg.page.title": "Lyuk konfiguratori",
  "cfg.page.subtitle": "Lyukni talablaringizga moslab sozlang",
  "cfg.sizes.minmax": "Minimal: 300 mm, Maksimal: 1500 mm",
  "cfg.finishBase": "Asosiy narx",
  "cfg.summary": "Yakuniy narx",
  "cfg.summary.model": "Model:",
  "cfg.summary.size": "O‘lcham:",
  "cfg.summary.cover": "Qoplama:",
  "cfg.summary.count": "Soni:",
  "cfg.summary.total": "Jami:",
  "cfg.priceFrom": "dan",
  "cfg.finish.powder": "Kukunli qoplama",
  "cfg.finish.anodized": "Anodlash",
  "cfg.finish.stainless": "Zanglamaydigan po'lat",
  

  "checkout.title": "Buyurtma rasmiylashtirish",
  "checkout.subtitle": "Tasdiqlash uchun aloqa ma’lumotlarini kiriting",
  "checkout.contact": "Aloqa ma’lumotlari",
  "checkout.contactDesc": "Aloqa uchun ma’lumotlaringizni kiriting",
  "checkout.name": "Ism",
  "checkout.phone": "Telefon",
  "checkout.email": "Email",
  "checkout.address": "Yetkazib berish manzili",
  "checkout.addressDesc": "Buyurtma uchun manzilni kiriting",
  "checkout.fullAddress": "To‘liq manzil",
  "checkout.comment": "Izoh",
  "checkout.submit": "Buyurtmani tasdiqlash",
  "checkout.yourOrder": "Sizning buyurtmangiz",
  "checkout.model": "Model:",
  "checkout.size": "O‘lcham:",
  "checkout.cover": "Qoplama:",
  "checkout.count": "Soni:",
  "checkout.placeholder.name": "Ism Familiya",
  "checkout.placeholder.phone": "+99891 234 56 78",
  "checkout.placeholder.email": "example@gmail.com",
  "checkout.placeholder.fullAddress": "Shahar, ko‘cha, uy, xonadon",
  "checkout.placeholder.comment": "Qo‘shimcha ma’lumot, yetkazib berish bo‘yicha istaklar",
  "checkout.submitting": "Rasmiylashtirilmoqda...",
  "checkout.success.title": "Buyurtma muvaffaqiyatli rasmiylashtirildi!",
  "checkout.success.desc": "Buyurtmangiz qabul qilindi, tafsilotlarni tasdiqlash uchun tez orada bog‘lanamiz.",
  "checkout.success.toHome": "Bosh sahifa",
  "checkout.success.newOrder": "Yangi buyurtma",
  "checkout.notice": "Yakuniy narx menejer tasdiqlagandan so‘ng hisoblanadi",

  // Address Map
  "map.searchPlaceholder": "Manzilni yozishni boshlang...",
  "map.pickAddress": "Yetkazib berish manzilini tanlang",
  "map.startTyping": "Qidiruv maydonida manzilni yozishni boshlang",
  "map.hint": "Qidiruvga manzilni kiriting va mos variantni tanlang",
}

const dictionaries: Record<Lang, Messages> = { ru, uz }

type I18nContextType = {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | null>(null)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ru")

  useEffect(() => {
    const stored = (typeof window !== "undefined" && localStorage.getItem("lang")) as Lang | null
    if (stored === "ru" || stored === "uz") {
      setLangState(stored)
    }
  }, [])

  const setLang = (l: Lang) => {
    setLangState(l)
    if (typeof window !== "undefined") localStorage.setItem("lang", l)
  }

  const t = useMemo(() => {
    const dict = dictionaries[lang] || ru
    return (key: string) => dict[key] ?? key
  }, [lang])

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error("useI18n must be used within I18nProvider")
  return ctx
}


