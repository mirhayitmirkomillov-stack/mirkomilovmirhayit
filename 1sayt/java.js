// ==================== UZSHOP - MAIN JS ====================
const LANGS = {
  uz: {
    search: "Mahsulot qidirish...", categories: "Kategoriyalar", all_products: "Barcha mahsulotlar",
    electronics: "Elektronika", clothing: "Kiyim-kechak", home: "Uy buyumlari", beauty: "Go'zallik",
    sports: "Sport", kids: "Bolalar", books: "Kitoblar", food: "Oziq-ovqat",
    price_range: "Narx oralig'i", sort_by: "Saralash", admin_panel: "Admin panel",
    my_cart: "Mening savatim", my_favorites: "Sevimlilarim",
    login: "Kirish", register: "Ro'yxatdan o'tish", email: "Email", password: "Parol",
    full_name: "To'liq ism", phone: "Telefon",
    login_btn: "Kirish", register_btn: "Ro'yxatdan o'tish",
    orders: "Buyurtmalar", points: "Ballar", spent: "Sarflangan",
    order_history: "Buyurtmalar tarixi", logout: "Chiqish",
    checkout: "Buyurtma berish", delivery_address: "Yetkazish manzili",
    payment_method: "To'lov usuli", cash: "Naqd pul", card: "Plastik karta",
    use_points: "Ballardan foydalanish", points_available: "ball mavjud",
    confirm_order: "Buyurtmani tasdiqlash",
    manage_products: "Mahsulotlar", manage_orders: "Buyurtmalar",
    add_product: "+ Yangi mahsulot qo'shish",
    product_name: "Nomi", product_price: "Narxi (so'm)",
    product_category: "Kategoriya", product_discount: "Chegirma %",
    product_image: "Rasm URL", product_desc: "Tavsif", add_product_btn: "Qo'shish",
    order_success: "Buyurtma muvaffaqiyatli qabul qilindi!",
    order_success_desc: "Tez orada siz bilan bog'lanamiz.",
    continue_shopping: "Xaridni davom ettirish",
    add_cart: "Savatga qo'shish", in_cart: "Savatda ✓", buy_now: "Hozir sotib olish",
    description: "Tavsif", reviews: "Sharhlar", write_review: "Sharh yozing...",
    submit: "Yuborish", no_favorites: "Sevimlilar hali yo'q",
    empty_cart: "Savat bo'sh", no_results: "Hech narsa topilmadi",
    no_orders: "Buyurtmalar yo'q", admin_password: "Admin paroli",
    banner_title: "UzShop ga xush kelibsiz!",
    banner_desc: "Eng yaxshi mahsulotlarni eng arzon narxlarda toping",
    banner_btn: "Xaridni boshlash",
    delete: "O'chirish", edit: "Tahrirlash", cancel: "Bekor qilish", save: "Saqlash",
    new_price: "Yangi narx", points_earned: "ball olindi", min_1000: "Min. 1000 so'm"
  },
  ru: {
    search: "Поиск товаров...", categories: "Категории", all_products: "Все товары",
    electronics: "Электроника", clothing: "Одежда", home: "Для дома", beauty: "Красота",
    sports: "Спорт", kids: "Детские", books: "Книги", food: "Продукты",
    price_range: "Ценовой диапазон", sort_by: "Сортировка", admin_panel: "Админ панель",
    my_cart: "Моя корзина", my_favorites: "Избранное",
    login: "Войти", register: "Регистрация", email: "Электронная почта", password: "Пароль",
    full_name: "Полное имя", phone: "Телефон",
    login_btn: "Войти", register_btn: "Зарегистрироваться",
    orders: "Заказы", points: "Баллы", spent: "Потрачено",
    order_history: "История заказов", logout: "Выйти",
    checkout: "Оформить заказ", delivery_address: "Адрес доставки",
    payment_method: "Способ оплаты", cash: "Наличные", card: "Банковская карта",
    use_points: "Использовать баллы", points_available: "баллов доступно",
    confirm_order: "Подтвердить заказ",
    manage_products: "Товары", manage_orders: "Заказы",
    add_product: "+ Добавить товар",
    product_name: "Название", product_price: "Цена (сум)",
    product_category: "Категория", product_discount: "Скидка %",
    product_image: "URL изображения", product_desc: "Описание", add_product_btn: "Добавить",
    order_success: "Заказ успешно принят!", order_success_desc: "Мы скоро свяжемся с вами.",
    continue_shopping: "Продолжить покупки",
    add_cart: "В корзину", in_cart: "В корзине ✓", buy_now: "Купить сейчас",
    description: "Описание", reviews: "Отзывы", write_review: "Напишите отзыв...",
    submit: "Отправить", no_favorites: "Избранное пока пусто",
    empty_cart: "Корзина пуста", no_results: "Ничего не найдено",
    no_orders: "Заказов нет", admin_password: "Пароль админа",
    banner_title: "Добро пожаловать в UzShop!",
    banner_desc: "Лучшие товары по лучшим ценам",
    banner_btn: "Начать покупки",
    delete: "Удалить", edit: "Редактировать", cancel: "Отмена", save: "Сохранить",
    new_price: "Новая цена", points_earned: "баллов получено", min_1000: "Мин. 1000 сум"
  },
  en: {
    search: "Search products...", categories: "Categories", all_products: "All Products",
    electronics: "Electronics", clothing: "Clothing", home: "Home", beauty: "Beauty",
    sports: "Sports", kids: "Kids", books: "Books", food: "Food",
    price_range: "Price Range", sort_by: "Sort By", admin_panel: "Admin Panel",
    my_cart: "My Cart", my_favorites: "Favorites",
    login: "Login", register: "Register", email: "Email", password: "Password",
    full_name: "Full Name", phone: "Phone",
    login_btn: "Login", register_btn: "Register",
    orders: "Orders", points: "Points", spent: "Spent",
    order_history: "Order History", logout: "Logout",
    checkout: "Checkout", delivery_address: "Delivery Address",
    payment_method: "Payment Method", cash: "Cash", card: "Credit Card",
    use_points: "Use points", points_available: "points available",
    confirm_order: "Confirm Order",
    manage_products: "Products", manage_orders: "Orders",
    add_product: "+ Add Product",
    product_name: "Name", product_price: "Price (UZS)",
    product_category: "Category", product_discount: "Discount %",
    product_image: "Image URL", product_desc: "Description", add_product_btn: "Add",
    order_success: "Order placed successfully!", order_success_desc: "We will contact you soon.",
    continue_shopping: "Continue Shopping",
    add_cart: "Add to Cart", in_cart: "In Cart ✓", buy_now: "Buy Now",
    description: "Description", reviews: "Reviews", write_review: "Write a review...",
    submit: "Submit", no_favorites: "No favorites yet",
    empty_cart: "Cart is empty", no_results: "No results found",
    no_orders: "No orders yet", admin_password: "Admin Password",
    banner_title: "Welcome to UzShop!",
    banner_desc: "Find the best products at the best prices",
    banner_btn: "Start Shopping",
    delete: "Delete", edit: "Edit", cancel: "Cancel", save: "Save",
    new_price: "New Price", points_earned: "points earned", min_1000: "Min. 1000 UZS"
  }
};const DEFAULT_PRODUCTS = [
  {id:1,name:"iPhone 15 Pro Max 256GB",category:"electronics",price:15999000,oldPrice:18999000,discount:16,image:"📱",rating:4.8,reviews:234,sold:1520,desc:"Apple iPhone 15 Pro Max, Titanium dizayn, A17 Pro chip, 48MP kamera.",date:"2026-01-15"},
  {id:2,name:"Samsung Galaxy S24 Ultra",category:"electronics",price:12999000,oldPrice:14999000,discount:13,image:"📱",rating:4.7,reviews:189,sold:1230,desc:"Samsung Galaxy S24 Ultra, S Pen, 200MP kamera, Galaxy AI.",date:"2026-01-20"},
  {id:3,name:"MacBook Air M3 15-inch",category:"electronics",price:18500000,oldPrice:20999000,discount:12,image:"💻",rating:4.9,reviews:156,sold:890,desc:"Apple MacBook Air M3, 15.3 Retina, 18hr batareya, 8GB RAM.",date:"2026-02-01"},
  {id:4,name:"AirPods Pro 2 USB-C",category:"electronics",price:2899000,oldPrice:3499000,discount:17,image:"🎧",rating:4.7,reviews:312,sold:2100,desc:"Apple AirPods Pro 2, Active Noise Cancellation, USB-C.",date:"2026-02-10"},
  {id:5,name:"Nike Air Max 270",category:"clothing",price:1899000,oldPrice:2499000,discount:24,image:"👟",rating:4.5,reviews:98,sold:670,desc:"Nike Air Max 270 erkaklar krossovkasi, Air Max yastig'i.",date:"2026-02-15"},
  {id:6,name:"Dyson V15 Detect",category:"home",price:8999000,oldPrice:10999000,discount:18,image:"🧹",rating:4.8,reviews:87,sold:450,desc:"Dyson V15 changyutgich, laser detektor, 60 daqiqa.",date:"2026-03-01"},
  {id:7,name:"LEGO Technic Porsche 911",category:"kids",price:4599000,oldPrice:5299000,discount:13,image:"🧱",rating:4.9,reviews:67,sold:320,desc:"LEGO Technic Porsche 911 GT3 RS, 3291 dona.",date:"2026-03-05"},
  {id:8,name:"The Alchemist (Uzbek)",category:"books",price:89000,oldPrice:120000,discount:26,image:"📖",rating:4.6,reviews:234,sold:1800,desc:"Paulo Coelho romani. Sarguzasht va orzular haqida.",date:"2026-01-01"},
  {id:9,name:"Nike Dri-FIT Sport Forma",category:"sports",price:1299000,oldPrice:1599000,discount:19,image:"⚽",rating:4.4,reviews:76,sold:540,desc:"Nike Dri-FIT sport formasi, namlilikni tortadi.",date:"2026-02-20"},
  {id:10,name:"La Prairie Skin Caviar",category:"beauty",price:5999000,oldPrice:7299000,discount:18,image:"✨",rating:4.8,reviews:45,sold:230,desc:"La Prairie Skin Caviar terini qarishga qarshi krem.",date:"2026-03-10"},
  {id:11,name:"Xiaomi Redmi Note 13 Pro",category:"electronics",price:3299000,oldPrice:3999000,discount:18,image:"📱",rating:4.5,reviews:456,sold:3200,desc:"Xiaomi Redmi Note 13 Pro, 200MP kamera, 5100mAh.",date:"2026-03-15"},
  {id:12,name:"Uniqlo Heattech Termal",category:"clothing",price:299000,oldPrice:399000,discount:25,image:"👕",rating:4.3,reviews:198,sold:2800,desc:"Uniqlo Heattech issiqlik saqlovchi termal ko'ylak.",date:"2026-02-25"},
  {id:13,name:"IKEA KALLAX Taxtali",category:"home",price:1599000,oldPrice:1999000,discount:20,image:"🪑",rating:4.4,reviews:123,sold:780,desc:"IKEA KALLAX 4-bo'limli taxtali, oq rang.",date:"2026-01-10"},
  {id:14,name:"Oral-B iO Series 9",category:"beauty",price:3499000,oldPrice:4299000,discount:19,image:"🪥",rating:4.7,reviews:89,sold:560,desc:"Oral-B iO Series 9 elektr tish cho'tkasi, AI.",date:"2026-03-08"},
  {id:15,name:"Barbie O'yingohi 150d",category:"kids",price:899000,oldPrice:1199000,discount:25,image:"🏰",rating:4.6,reviews:134,sold:920,desc:"Barbie o'yingohi, 150 dona, 3 qavat, mebel bilan.",date:"2026-02-14"},
  {id:16,name:"Atomic Habits (Uzbek)",category:"books",price:99000,oldPrice:140000,discount:29,image:"📚",rating:4.9,reviews:312,sold:2400,desc:"James Clear - odatlar haqida mashhur kitob.",date:"2026-01-20"},
  {id:17,name:"Adidas Predator FG",category:"sports",price:2199000,oldPrice:2799000,discount:21,image:"👟",rating:4.6,reviews:87,sold:430,desc:"Adidas Predator futbol poyafzali.",date:"2026-03-12"},
  {id:18,name:"O'zbekiston Milliy Libos",category:"clothing",price:499000,oldPrice:649000,discount:23,image:"🇺🇿",rating:4.7,reviews:256,sold:1800,desc:"O'zbekiston milliy liboslar to'plami.",date:"2026-02-01"},
  {id:19,name:"JBL Charge 5",category:"electronics",price:1899000,oldPrice:2299000,discount:17,image:"🔊",rating:4.7,reviews:198,sold:1340,desc:"JBL Charge 5 portativ dynamics, suv o'tkazmas.",date:"2026-02-05"},
  {id:20,name:"Kurigou Premium Qahva 1kg",category:"food",price:189000,oldPrice:249000,discount:24,image:"☕",rating:4.5,reviews:167,sold:2100,desc:"Kurigou premium qahva, 100% arabika.",date:"2026-03-01"},
  {id:21,name:"iPhone 14 128GB",category:"electronics",price:8999000,oldPrice:10999000,discount:18,image:"📱",rating:4.6,reviews:345,sold:2800,desc:"iPhone 14, A15 Bionic, 12MP kamera, 6.1 dyuym.",date:"2025-12-01"},
  {id:22,name:"IKEA MALM Yotoq",category:"home",price:3299000,oldPrice:4199000,discount:21,image:"🛏️",rating:4.5,reviews:98,sold:340,desc:"IKEA MALM yotoq ramkasi, 160x200, oq.",date:"2026-01-15"},
  {id:23,name:"LEGO Star Wars Falcon",category:"kids",price:7999000,oldPrice:9299000,discount:14,image:"🚀",rating:4.9,reviews:56,sold:180,desc:"LEGO Star Wars Millennium Falcon, 7541 dona.",date:"2026-03-20"},
  {id:24,name:"Bioderma Sensibio H2O",category:"beauty",price:459000,oldPrice:549000,discount:16,image:"💧",rating:4.8,reviews:213,sold:1600,desc:"Bioderma Sensibio micellar suv, sezgir teri uchun.",date:"2026-02-10"},
  {id:25,name:"Dunyo Bo'ylab Sayohat",category:"books",price:120000,oldPrice:160000,discount:25,image:"🌍",rating:4.4,reviews:89,sold:670,desc:"Dunyo mamlakatlari haqida sayohat kitobi.",date:"2026-02-20"},
  {id:26,name:"Yoga Mat Premium 6mm",category:"sports",price:399000,oldPrice:549000,discount:27,image:"🧘",rating:4.5,reviews:145,sold:1200,desc:"Premium yoga mat, kvchli yuzasi, ekologik.",date:"2026-03-05"},
  {id:27,name:"Fitbit Charge 6",category:"electronics",price:2499000,oldPrice:2999000,discount:17,image:"⌚",rating:4.4,reviews:123,sold:890,desc:"Fitbit Charge 6 fitness treker, GPS, uyqu.",date:"2026-02-15"},
  {id:28,name:"Oshxona Asboblari 12d",category:"home",price:599000,oldPrice:799000,discount:25,image:"🍳",rating:4.3,reviews:78,sold:450,desc:"12 qismli oshxona asboblari, zanglamaydigan po'lat.",date:"2026-03-01"},
  {id:29,name:"Organik Asal 500ml",category:"food",price:129000,oldPrice:169000,discount:24,image:"🍯",rating:4.7,reviews:234,sold:3200,desc:"Tabiiy organik asal, Qashqadaryo.",date:"2026-01-01"},
  {id:30,name:"Puma RS-X Effekt",category:"clothing",price:1499000,oldPrice:1999000,discount:25,image:"👟",rating:4.4,reviews:67,sold:380,desc:"Puma RS-X Effekt retro krossovka.",date:"2026-03-10"},
  {id:31,name:"Oppo Find X7 Ultra",category:"electronics",price:11499000,oldPrice:13499000,discount:15,image:"📱",rating:4.6,reviews:98,sold:560,desc:"Oppo Find X7 Ultra, 50MP Hasselblad.",date:"2026-03-18"},
  {id:32,name:"H&M Zamonaviy Palto",category:"clothing",price:899000,oldPrice:1199000,discount:25,image:"🧥",rating:4.3,reviews:54,sold:290,desc:"H&M zamonaviy palto, issiq, shahar uslubida.",date:"2026-02-28"},
  {id:33,name:"Philips Hue Starter Kit",category:"home",price:2799000,oldPrice:3299000,discount:15,image:"💡",rating:4.6,reviews:87,sold:420,desc:"Philips Hue aqlli yorug'lik to'plami, 3 dona.",date:"2026-03-15"},
  {id:34,name:"Garnier SkinActive",category:"beauty",price:149000,oldPrice:199000,discount:25,image:"🧴",rating:4.3,reviews:189,sold:1900,desc:"Garnier SkinActive nemlendirici krem.",date:"2026-01-10"},
  {id:35,name:"Decathlon Yoga Blok 2d",category:"sports",price:179000,oldPrice:249000,discount:28,image:"🧱",rating:4.2,reviews:67,sold:560,desc:"Decathlon yoga bloklari, EVA material.",date:"2026-02-15"},
  {id:36,name:"Hot Wheels Mega Garage",category:"kids",price:1199000,oldPrice:1599000,discount:25,image:"🏎️",rating:4.7,reviews:178,sold:890,desc:"Hot Wheels Mega Garage, 6+ qavat, lift.",date:"2026-03-01"},
  {id:37,name:"Sherlock Holmes To'plam",category:"books",price:159000,oldPrice:210000,discount:24,image:"🔍",rating:4.8,reviews:167,sold:1200,desc:"Sherlock Holmes hikoyalari, Arthur Conan Doyle.",date:"2026-02-01"},
  {id:38,name:"Organik Choy 6 xil",category:"food",price:219000,oldPrice:299000,discount:27,image:"🍵",rating:4.6,reviews:123,sold:1800,desc:"6 xil organik choy to'plami.",date:"2026-01-15"},
  {id:39,name:"Razer DeathAdder V3",category:"electronics",price:1199000,oldPrice:1499000,discount:20,image:"🖱️",rating:4.7,reviews:134,sold:780,desc:"Razer DeathAdder V3 gaming mouse, 30000 DPI.",date:"2026-03-20"},
  {id:40,name:"Zara Ayollar Krossovka",category:"clothing",price:799000,oldPrice:999000,discount:20,image:"👠",rating:4.2,reviews:89,sold:450,desc:"Zara ayollar krossovkasi, oq, zamonaviy.",date:"2026-02-10"},
  {id:41,name:"Roborock S8 Pro Ultra",category:"home",price:12999000,oldPrice:15999000,discount:19,image:"🤖",rating:4.8,reviews:45,sold:120,desc:"Roborock S8 Pro Ultra avtomatik changyutgich.",date:"2026-03-25"},
  {id:42,name:"Maybelline Lash Sens.",category:"beauty",price:99000,oldPrice:139000,discount:29,image:"👁️",rating:4.4,reviews:267,sold:2400,desc:"Maybelline Lash Sensational maskara.",date:"2026-01-05"},
  {id:43,name:"Wilson Tennis Racket",category:"sports",price:999000,oldPrice:1299000,discount:23,image:"🎾",rating:4.5,reviews:56,sold:230,desc:"Wilson US Open tennisi raketa, 270g.",date:"2026-03-08"},
  {id:44,name:"Crayola 120 Rangli Qalam",category:"kids",price:349000,oldPrice:449000,discount:22,image:"🖍️",rating:4.6,reviews:98,sold:780,desc:"Crayola 120 rangli qalam, yorqin ranglar.",date:"2026-02-20"},
  {id:45,name:"Qishloq Xo'jalik Kalendari",category:"books",price:75000,oldPrice:100000,discount:25,image:"🌱",rating:4.1,reviews:34,sold:290,desc:"O'zbekiston qishloq xo'jaligi kalendari.",date:"2026-01-01"},
  {id:46,name:"Kungaboqar Moyi 1L",category:"food",price:42000,oldPrice:55000,discount:24,image:"🫒",rating:4.3,reviews:456,sold:5600,desc:"100% toza kungaboqar moyi, 1 litr.",date:"2026-03-01"},
  {id:47,name:"ASUS ROG Strix G16",category:"electronics",price:22999000,oldPrice:26999000,discount:15,image:"🖥️",rating:4.8,reviews:67,sold:230,desc:"ASUS ROG Strix G16, RTX 4070, i7-14700HX.",date:"2026-03-22"},
  {id:48,name:"Massimo Dutti Kostyum",category:"clothing",price:2999000,oldPrice:3999000,discount:25,image:"👔",rating:4.6,reviews:45,sold:180,desc:"Massimo Dutti erkaklar kostyum, tikilgan.",date:"2026-03-10"},
  {id:49,name:"Lego Friends Heartlake",category:"kids",price:2499000,oldPrice:2999000,discount:17,image:"🏠",rating:4.7,reviews:89,sold:340,desc:"Lego Friends Heartlake City, 1845 dona.",date:"2026-02-14"},
  {id:50,name:"Samsung 55 QLED 4K TV",category:"electronics",price:9999000,oldPrice:12999000,discount:23,image:"📺",rating:4.7,reviews:134,sold:560,desc:"Samsung 55 QLED 4K Smart TV, Quantum Dot.",date:"2026-01-20"},
  // === KIYIM-KECHAK ===
  {id:51,name:"Adidas Originals Hoodie",category:"clothing",price:699000,oldPrice:899000,discount:22,image:"🧥",rating:4.4,reviews:89,sold:430,desc:"Adidas Originals erkaklar hoodie, paxta, zamonaviy.",date:"2026-04-01"},
  {id:52,name:"Zara Skinny Jeans",category:"clothing",price:499000,oldPrice:649000,discount:23,image:"👖",rating:4.3,reviews:134,sold:870,desc:"Zara erkaklar skinny jeans, elastan, qulay.",date:"2026-04-05"},
  {id:53,name:"Nike Sportswear Futura",category:"clothing",price:899000,oldPrice:1199000,discount:25,image:"🎽",rating:4.5,reviews:67,sold:340,desc:"Nike Sportswear Futura erkaklar futbolkasi.",date:"2026-04-10"},
  {id:54,name:"Gucci Flora Ayollar Parfyumi",category:"clothing",price:4999000,oldPrice:6299000,discount:21,image:"🌸",rating:4.8,reviews:45,sold:180,desc:"Gucci Flora ayollar parfyumi, gul hidli.",date:"2026-03-25"},
  {id:55,name:"Calvin Klein Trunks 3d",category:"clothing",price:349000,oldPrice:449000,discount:22,image:"🩲",rating:4.2,reviews:198,sold:1200,desc:"Calvin Klein erkaklar trunks, 3 dona, paxta.",date:"2026-03-30"},
  // === UY BUYUMLARI ===
  {id:56,name:"Xiaomi Mi Robot Vacuum",category:"home",price:4599000,oldPrice:5599000,discount:18,image:"🤖",rating:4.6,reviews:78,sold:340,desc:"Xiaomi Mi Robot changyutgich, LDS, 2500Pa.",date:"2026-04-01"},
  {id:57,name:"IKEA BILLY Kitob taxtasi",category:"home",price:2199000,oldPrice:2799000,discount:21,image:"📚",rating:4.4,reviews:156,sold:670,desc:"IKEA BILLY kitob taxtasi, 80x28x202 sm.",date:"2026-03-15"},
  {id:58,name:"Tefal Ingenio 14d Tovoq",category:"home",price:2499000,oldPrice:3199000,discount:22,image:"🍳",rating:4.6,reviews:89,sold:450,desc:"Tefal Ingenio 14 qismli tovoq to'plami.",date:"2026-04-05"},
  {id:59,name:"Bosch Idish Yuvish Mashinasi",category:"home",price:8999000,oldPrice:10999000,discount:18,image:"🧼",rating:4.7,reviews:56,sold:190,desc:"Bosch Series 4 idish yuvish mashinasi, 60 sm.",date:"2026-03-20"},
  // === GO'ZALLIK ===
  {id:60,name:"L'Oréal Paris Revitalift",category:"beauty",price:269000,oldPrice:349000,discount:23,image:"🧴",rating:4.5,reviews:234,sold:1800,desc:"L'Oréal Paris Revitalift yuz kremi, qarishga qarshi.",date:"2026-04-01"},
  {id:61,name:"Dior Sauvage Parfyum",category:"beauty",price:4599000,oldPrice:5699000,discount:19,image:"🧪",rating:4.9,reviews:167,sold:890,desc:"Dior Sauvage erkaklar parfyumi, 100ml.",date:"2026-03-28"},
  {id:62,name:"NYX Professional Makeup",category:"beauty",price:189000,oldPrice:249000,discount:24,image:"💄",rating:4.3,reviews:312,sold:2300,desc:"NYX Professional Makeup palitrasi, 16 rang.",date:"2026-04-05"},
  {id:63,name:"Vichy Mineral 89 Probiotic",category:"beauty",price:399000,oldPrice:499000,discount:20,image:"💧",rating:4.6,reviews:145,sold:980,desc:"Vichy Mineral 89 probiotik nemlendiruvchi, 50ml.",date:"2026-03-15"},
  {id:64,name:"Philips Series 9000 Soqol",category:"beauty",price:4299000,oldPrice:5299000,discount:19,image:"🪒",rating:4.7,reviews:98,sold:430,desc:"Philips Series 9000 soqol olish moslamasi.",date:"2026-04-10"},
  // === SPORT ===
  {id:65,name:"Puma Goal L Sport Forma",category:"sports",price:799000,oldPrice:999000,discount:20,image:"⚽",rating:4.4,reviews:89,sold:560,desc:"Puma Goal L futbol formasi, Dri-FIT.",date:"2026-04-01"},
  {id:66,name:"Spalding Basketbol Topi",category:"sports",price:349000,oldPrice:449000,discount:22,image:"🏀",rating:4.6,reviews:67,sold:340,desc:"Spalding basketbol topi, o'lcham 7, kauchuk.",date:"2026-03-25"},
  {id:67,name:"JBL Endurance Peak 3",category:"sports",price:1199000,oldPrice:1499000,discount:20,image:"🎧",rating:4.5,reviews:134,sold:780,desc:"JBL Endurance Peak 3 sport quloqchinlari.",date:"2026-04-05"},
  {id:68,name:"NordicTrack Treadmill",category:"sports",price:15999000,oldPrice:19999000,discount:20,image:"🏃",rating:4.8,reviews:34,sold:120,desc:"NordicTrack T6.5 S yugurish yo'lakchasi.",date:"2026-03-20"},
  {id:69,name:"Gym Pro Dumbbell 20kg",category:"sports",price:899000,oldPrice:1199000,discount:25,image:"🏋️",rating:4.4,reviews:98,sold:560,desc:"Gym Pro dumbbell to'plami, 2x10kg, vinil.",date:"2026-04-10"},
  // === BOLALAR ===
  {id:70,name:"LEGO City Police Station",category:"kids",price:1899000,oldPrice:2399000,discount:21,image:"🚔",rating:4.8,reviews:78,sold:340,desc:"LEGO City Police Station, 1040 dona.",date:"2026-04-01"},
  {id:71,name:"Nerf Elite 2.0 Blaster",category:"kids",price:459000,oldPrice:599000,discount:23,image:"🔫",rating:4.5,reviews:167,sold:1200,desc:"Nerf Elite 2.0 blaster, 15 o'qli, yuqori tezlik.",date:"2026-03-25"},
  {id:72,name:"Fisher-Price Smart Phone",category:"kids",price:299000,oldPrice:399000,discount:25,image:"📱",rating:4.3,reviews:234,sold:2100,desc:"Fisher-Price o'quv telefoni, 1-3 yosh.",date:"2026-04-05"},
  {id:73,name:"Hasbro Monopoly Classic",category:"kids",price:349000,oldPrice:449000,discount:22,image:"🎲",rating:4.6,reviews:189,sold:980,desc:"Hasbro Monopoly Classic stol o'yini.",date:"2026-03-30"},
  // === KITOBLAR ===
  {id:74,name:"Ikki Eshik Orasi - O'tkir Hoshimov",category:"books",price:89000,oldPrice:120000,discount:26,image:"📖",rating:4.7,reviews:345,sold:3200,desc:"O'tkir Hoshimovning mashhur romani, 416 bet.",date:"2026-04-01"},
  {id:75,name:"Rich Dad Poor Dad (Uzbek)",category:"books",price:119000,oldPrice:159000,discount:25,image:"📚",rating:4.8,reviews:267,sold:2500,desc:"Robert Kiyosaki - moliyaviy mustaqillik haqida.",date:"2026-03-20"},
  {id:76,name:"Python Dasturlash Asoslari",category:"books",price:149000,oldPrice:199000,discount:25,image:"🐍",rating:4.6,reviews:98,sold:780,desc:"Python dasturlash tili bo'yicha o'zbek tilidagi qo'llanma.",date:"2026-04-05"},
  {id:77,name:"Sariq Devni Minib - Xudoyberdi To'xtaboyev",category:"books",price:75000,oldPrice:100000,discount:25,image:"📘",rating:4.9,reviews:412,sold:4500,desc:"Xudoyberdi To'xtaboyevning bolalar uchun qiziqarli asari.",date:"2026-03-15"},
  {id:78,name:"O'tkan Kunlar - Abdulla Qodiriy",category:"books",price:99000,oldPrice:130000,discount:24,image:"📕",rating:4.8,reviews:567,sold:6000,desc:"Abdulla Qodiriyning o'zbek adabiyotining durdonasi.",date:"2026-01-10"},
  // === OZIQ-OVQAT ===
  {id:79,name:"Coca-Cola 2L",category:"food",price:18000,oldPrice:24000,discount:25,image:"🥤",rating:4.2,reviews:890,sold:12000,desc:"Coca-Cola 2 litr, shisha.",date:"2026-04-01"},
  {id:80,name:"Milka Shokolad 200g",category:"food",price:45000,oldPrice:59000,discount:24,image:"🍫",rating:4.6,reviews:456,sold:5600,desc:"Milka shokolad, sutli, 200 gramm.",date:"2026-03-25"},
  {id:81,name:"Lays Pringles 150g",category:"food",price:32000,oldPrice:42000,discount:24,image:"🥨",rating:4.3,reviews:678,sold:8900,desc:"Lays Pringles chipslari, 150 gramm.",date:"2026-04-05"},
  {id:82,name:"Bon Aqua 1.5L",category:"food",price:14000,oldPrice:18000,discount:22,image:"💧",rating:4.1,reviews:1234,sold:15000,desc:"Bon Aqua gazsiz suv, 1.5 litr.",date:"2026-03-30"},
  {id:83,name:"Nestle Zboj 700g",category:"food",price:89000,oldPrice:119000,discount:25,image:"🥣",rating:4.4,reviews:234,sold:3400,desc:"Nestle Zboj nonushta donasi, 700 gramm.",date:"2026-04-01"},
  {id:84,name:"Mivelo 900ml Yog'",category:"food",price:26000,oldPrice:34000,discount:24,image:"🫒",rating:4.3,reviews:567,sold:7800,desc:"Mivelo kungaboqar yog'i, 900ml.",date:"2026-03-20"}
];let state = {
  products: [], cart: [], favorites: [], currentUser: null, orders: [],
  currentLang: 'uz', currentCategory: 'all', currentSort: 'default',
  priceMin: 0, priceMax: Infinity, searchQuery: '',
  adminLoggedIn: false, editingProduct: null, commentRating: 5
};

function init() {
  loadState();
  // Always use latest DEFAULT_PRODUCTS (merge with existing)
  var existingIds = {};
  state.products.forEach(function(p){ existingIds[p.id]=true; });
  DEFAULT_PRODUCTS.forEach(function(dp){
    if (!existingIds[dp.id]) {
      state.products.push(JSON.parse(JSON.stringify(dp)));
    }
  });
  // Sort by id
  state.products.sort(function(a,b){return a.id-b.id;});
  saveState();
  renderBanner(); renderQuickCategories(); renderProducts();
  updateBadges(); updateProfileUI(); applyLang();
}

function loadState() {
  try {
    const saved = localStorage.getItem('uzshop_state');
    if (saved) { const p = JSON.parse(saved); state = {...state, ...p}; }
  } catch(e) {}
}

function saveState() {
  try { localStorage.setItem('uzshop_state', JSON.stringify(state)); } catch(e) {}
}

function renderBanner() {
  const b = document.getElementById('banner');
  if (!b) return;
  const t = LANGS[state.currentLang];
  b.innerHTML = '<h1>'+t.banner_title+'</h1><p>'+t.banner_desc+'</p><button class="banner-btn" onclick="document.getElementById(\'productsGrid\').scrollIntoView({behavior:\'smooth\'})">'+t.banner_btn+'</button>';
}

function renderQuickCategories() {
  const el = document.getElementById('quickCategories');
  if (!el) return;
  const cats = [
    {id:'electronics',icon:'📱',uz:'Elektronika'},{id:'clothing',icon:'👕',uz:'Kiyim'},
    {id:'home',icon:'🏠',uz:'Uy'},{id:'beauty',icon:'💄',uz:"Go'zallik"},
    {id:'sports',icon:'⚽',uz:'Sport'},{id:'kids',icon:'👶',uz:'Bolalar'},
    {id:'books',icon:'📚',uz:'Kitoblar'},{id:'food',icon:'🍎',uz:'Oziq-ovqat'}
  ];
  el.innerHTML = cats.map(c =>
    '<div class="quick-cat '+(state.currentCategory===c.id?'active':'')+'" onclick="filterByCategory(\''+c.id+'\')"><span class="quick-cat-icon">'+c.icon+'</span><span class="quick-cat-name">'+c.uz+'</span></div>'
  ).join('');
}

var PRODUCT_IMAGES = {
  1:'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-15-pro-max-1.jpg',
  3:'https://fdn2.gsmarena.com/vv/pics/apple/apple-macbook-air-m3-1.jpg',
  4:'https://fdn2.gsmarena.com/vv/pics/apple/apple-airpods-pro-2-usbc-1.jpg',
  5:'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/skwgyqrbfzhu6uyeh0gg/air-max-270-mens-shoes.png',
  8:'https://upload.wikimedia.org/wikipedia/en/thumb/f/f3/TheAlchemistCover.jpg/440px-TheAlchemistCover.jpg',
  9:'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/skwgyqrbfzhu6uyeh0gg/dri-fit-football-top.png',
  10:'https://www.laprairie.com/cdn/shop/files/95790-01379-45_SC_LuxeCream_50ml_packshot_C.png',
  11:'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note-13-pro.jpg',
  17:'https://assets.adidas.com/images/w_800,f_auto,q_auto/8ed8700dd4404d45a899a22a25c7db84_9366/predator-elite-fold-over-tongue-firm-ground-cleats.jpg',
  18:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Uzbek_national_costume.jpg/640px-Uzbek_national_costume.jpg',
  19:'https://www.jbl.com/dw/image/v2/AAUJ_PRD/on/demandware.static/-/Sites-masterCatalog_Harman/default/dw5c400a94/JBL_CHARGE5_HERO_GREY_0014_x1.png',
  21:'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-14.jpg',
  31:'https://fdn2.gsmarena.com/vv/pics/oppo/oppo-find-x7-ultra-1.jpg',
  33:'https://www.philips-hue.com/dw/image/v2/ABAH_PRD/on/demandware.static/-/Sites-master-catalog/default/dw123456/hue-white-color-ambiance-starter-kit.png',
  39:'https://dl.razerzone.com/src2/6128/6128-1-en-v2.png',
  44:'https://www.crayola.com/-/media/Crayola/Products/Product%20Images/52/523280.jpg',
  47:'https://dlcdnwebimgs.asus.com/gain/EXVJVPBQW1CKHKL8',
  53:'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/skwgyqrbfzhu6uyeh0gg/nike-sportswear-futura-t-shirt.png',
  56:'https://i01.appmifile.com/webfile/globalimg/products/pc/mi-robot-vacuum/spec-vacuum01.png',
  67:'https://www.jbl.com/dw/image/v2/BFND_PRD/on/demandware.static/-/Sites-masterCatalog_Harman/default/dw71954db1/1.JBL_ENDURANCE_PEAK_3_Product%20Image_Hero_Black.png',
  75:'https://m.media-amazon.com/images/I/91VokXkn8hL._SL1500_.jpg'
};

function getProductImageUrl(p) {
  return PRODUCT_IMAGES[p.id] || 'https://picsum.photos/seed/'+p.id+'/400/400';
}

function formatPrice(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' so\'m';
}

function renderStars(rating) {
  let s = '';
  for (let i = 1; i <= 5; i++) {
    s += i <= Math.round(rating) ? '★' : '☆';
  }
  return s;
}

function getCategoryName(cat) {
  const t = LANGS[state.currentLang];
  const map = {electronics:t.electronics,clothing:t.clothing,home:t.home,beauty:t.beauty,sports:t.sports,kids:t.kids,books:t.books,food:t.food};
  return map[cat] || cat;
}

function renderProducts() {
  const grid = document.getElementById('productsGrid');
  const countEl = document.getElementById('productCount');
  if (!grid) return;
  let filtered = getFilteredProducts();
  if (filtered.length === 0) {
    const t = LANGS[state.currentLang];
    grid.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🔍</div><div class="empty-state-text">'+t.no_results+'</div></div>';
    countEl.textContent = '';
    return;
  }
  countEl.textContent = filtered.length + ' ta mahsulot';
  grid.innerHTML = filtered.map(function(p) {
    var inCart = state.cart.some(function(c){return c.id===p.id;});
    var inFav = state.favorites.indexOf(p.id) >= 0;
    var stars = renderStars(p.rating);
    var dp = p.discount > 0 ? Math.round(p.price*(1-p.discount/100)) : p.price;
    var points = Math.floor(dp / 1000);
    var t = LANGS[state.currentLang];
    return '<div class="product-card" onclick="openProduct('+p.id+')">'
      +(p.discount>0?'<span class="price-discount" style="position:absolute;top:10px;left:10px;z-index:5">-'+p.discount+'%</span>':'')
      +'<img class="product-card-img" src="'+getProductImageUrl(p)+'" alt="'+p.name+'" loading="lazy" onerror="this.src=\'https://via.placeholder.com/400x400?text='+encodeURIComponent(p.name)+'\'">'
      +'<div class="product-card-body">'
      +'<div class="product-card-category">'+getCategoryName(p.category)+'</div>'
      +'<div class="product-card-name">'+p.name+'</div>'
      +'<div class="product-card-rating"><span class="stars">'+stars+'</span><span class="rating-count">('+p.reviews+')</span></div>'
      +'<div class="product-card-price"><span class="price-current">'+formatPrice(dp)+'</span>'
      +(p.oldPrice?'<span class="price-old">'+formatPrice(p.oldPrice)+'</span>':'')+'</div>'
      +'<div class="product-card-points">⭐ '+points+' '+t.points+'</div>'
      +'<div class="product-card-actions">'
      +'<button class="btn-add-cart '+(inCart?'in-cart':'')+'" onclick="event.stopPropagation();toggleCart('+p.id+')">'+(inCart?t.in_cart:t.add_cart)+'</button>'
    +'<button class="btn-fav '+(inFav?'active':'')+'" onclick="event.stopPropagation();toggleFavorite('+p.id+')">'+(inFav?'❤️':'🤍')+'</button>'
    +'</div></div></div>';
  }).join('');
  // Force animation reset
  grid.style.animation = 'none';
  void grid.offsetHeight;
  grid.style.animation = '';
}

function getFilteredProducts() {
  var products = state.products.slice();
  if (state.currentCategory !== 'all') {
    products = products.filter(function(p){return p.category===state.currentCategory;});
  }
  if (state.priceMin > 0) {
    products = products.filter(function(p){
      var dp = p.discount>0?Math.round(p.price*(1-p.discount/100)):p.price;
      return dp >= state.priceMin;
    });
  }
  if (state.priceMax < Infinity) {
    products = products.filter(function(p){
      var dp = p.discount>0?Math.round(p.price*(1-p.discount/100)):p.price;
      return dp <= state.priceMax;
    });
  }
  if (state.searchQuery) {
    var q = state.searchQuery.toLowerCase();
    products = products.filter(function(p){
      return p.name.toLowerCase().indexOf(q)>=0 || p.category.toLowerCase().indexOf(q)>=0;
    });
  }
  switch(state.currentSort) {
    case 'price-asc': products.sort(function(a,b){var da=a.discount>0?Math.round(a.price*(1-a.discount/100)):a.price,db=b.discount>0?Math.round(b.price*(1-b.discount/100)):b.price;return da-db;}); break;
    case 'price-desc': products.sort(function(a,b){var da=a.discount>0?Math.round(a.price*(1-a.discount/100)):a.price,db=b.discount>0?Math.round(b.price*(1-b.discount/100)):b.price;return db-da;}); break;
    case 'rating': products.sort(function(a,b){return b.rating-a.rating;}); break;
    case 'newest': products.sort(function(a,b){return new Date(b.date)-new Date(a.date);}); break;
    case 'popular': products.sort(function(a,b){return b.sold-a.sold;}); break;
  }
  return products;
}

function filterByCategory(cat) {
  state.currentCategory = cat;
  state.searchQuery = '';
  state.priceMin = 0;
  state.priceMax = Infinity;
  state.currentSort = 'default';
  saveState();
  // Clear search input
  var si = document.getElementById('searchInput');
  if (si) si.value = '';
  // Reset sort select
  var ss = document.getElementById('sortSelect');
  if (ss) ss.value = 'default';
  // Reset price inputs
  var pMin = document.getElementById('priceMin');
  var pMax = document.getElementById('priceMax');
  if (pMin) pMin.value = '';
  if (pMax) pMax.value = '';
  document.querySelectorAll('.cat-btn').forEach(function(btn){
    btn.classList.toggle('active', btn.dataset.category===cat);
  });
  renderQuickCategories();
  renderProducts();
  if (window.innerWidth <= 1024) toggleSidebar();
  // Update section title
  var titleEl = document.getElementById('sectionTitle');
  if (titleEl) {
    var catNames = {all:LANGS[state.currentLang].all_products, electronics:LANGS[state.currentLang].electronics, clothing:LANGS[state.currentLang].clothing, home:LANGS[state.currentLang].home, beauty:LANGS[state.currentLang].beauty, sports:LANGS[state.currentLang].sports, kids:LANGS[state.currentLang].kids, books:LANGS[state.currentLang].books, food:LANGS[state.currentLang].food};
    titleEl.textContent = catNames[cat] || cat;
  }
}

function sortProducts(val) {
  state.currentSort = val;
  saveState();
  renderProducts();
}

function applyPriceFilter() {
  var min = parseInt(document.getElementById('priceMin').value) || 0;
  var max = parseInt(document.getElementById('priceMax').value) || Infinity;
  state.priceMin = min;
  state.priceMax = max;
  saveState();
  renderProducts();
}

function searchProducts() {
  state.searchQuery = document.getElementById('searchInput').value.trim();
  renderProducts();
}

function openProduct(id) {
  var p = state.products.find(function(pr){return pr.id===id;});
  if (!p) return;
  var t = LANGS[state.currentLang];
  var dp = p.discount>0?Math.round(p.price*(1-p.discount/100)):p.price;
  var stars = renderStars(p.rating);
  var inCart = state.cart.some(function(c){return c.id===p.id;});
  var inFav = state.favorites.indexOf(p.id)>=0;
  var points = Math.floor(dp/1000);
  var comments = getComments(id);
  var detail = document.getElementById('productDetail');
  detail.innerHTML = '<div><img class="pd-image" src="'+getProductImageUrl(p)+'" alt="'+p.name+'"></div>'
    +'<div class="pd-info"><div class="pd-category">'+getCategoryName(p.category)+'</div>'
    +'<h1>'+p.name+'</h1>'
    +'<div class="pd-rating"><span class="stars">'+stars+'</span><span>'+p.rating+' ('+p.reviews+' '+t.reviews+')</span>'
    +'<span style="margin-left:auto;font-size:13px;color:var(--text-secondary)">'+p.sold+' sotilgan</span></div>'
    +'<div class="pd-price-block"><span class="pd-price">'+formatPrice(dp)+'</span>'
    +(p.oldPrice?'<span class="pd-price-old">'+formatPrice(p.oldPrice)+'</span>':'')
    +(p.discount>0?'<span class="pd-discount-badge">-'+p.discount+'%</span>':'')
    +'<div class="pd-points">⭐ '+points+' '+t.points+'</div></div>'
    +'<p class="pd-desc">'+p.desc+'</p>'
    +'<div class="pd-actions">'
    +'<button class="btn-primary" onclick="toggleCart('+p.id+');openProduct('+p.id+');">'+(inCart?t.in_cart:t.add_cart)+'</button>'
    +'<button class="btn-fav-large" onclick="toggleFavorite('+p.id+');openProduct('+p.id+');">'+(inFav?'❤️':'🤍')+'</button>'
    +'</div></div>'
    +'<div class="pd-comments"><h3>'+t.reviews+' ('+comments.length+')</h3>'
    +'<div class="comment-form"><div><div class="comment-stars">'
    +[1,2,3,4,5].map(function(s){return '<span id="cs'+s+'" onclick="setCommentRating('+s+')">'+(s<=state.commentRating?'⭐':'☆')+'</span>';}).join('')
    +'</div><textarea id="commentText" placeholder="'+t.write_review+'" rows="3"></textarea></div>'
    +'<button class="comment-submit" onclick="addComment('+p.id+')">'+t.submit+'</button></div>'
    +'<ul class="comment-list">'
    +(comments.length===0?'<li class="comment-item" style="text-align:center;color:var(--text-secondary)">'+t.no_results+'</li>':'')
    +comments.map(function(c){
      return '<li class="comment-item"><div class="comment-header"><div class="comment-avatar">'+c.author.charAt(0).toUpperCase()+'</div>'
        +'<span class="comment-author">'+c.author+'</span><span class="comment-stars-display">'+renderStars(c.rating)+'</span>'
        +'<span class="comment-date">'+c.date+'</span></div><p class="comment-text">'+c.text+'</p></li>';
    }).join('')
    +'</ul></div>';
  openModal('productModal');
  // Set comment stars after render
  setTimeout(function(){
    [1,2,3,4,5].forEach(function(s){
      var el = document.getElementById('cs'+s);
      if (el) el.textContent = s <= state.commentRating ? '⭐' : '☆';
    });
  }, 100);
}

function getComments(pid) {
  try { var all=JSON.parse(localStorage.getItem('uzshop_comments')||'{}'); return all[pid]||[]; } catch(e){ return []; }
}

function setCommentRating(r) {
  state.commentRating=r;
  [1,2,3,4,5].forEach(function(s){
    var el=document.getElementById('cs'+s);
    if(el) el.textContent = s <= r ? '⭐' : '☆';
  });
}

function addComment(pid) {
  if (!state.currentUser) {
    showToast('Iltimos, avval kiring!');
    openModal('authModal');
    return;
  }
  var text = document.getElementById('commentText');
  if (!text || !text.value.trim()) return;
  var comments = getComments(pid);
  comments.unshift({author:state.currentUser.name, text:text.value.trim(), rating:state.commentRating, date:new Date().toLocaleDateString()});
  try {
    var all=JSON.parse(localStorage.getItem('uzshop_comments')||'{}');
    all[pid]=comments;
    localStorage.setItem('uzshop_comments',JSON.stringify(all));
  } catch(e){}
  state.commentRating=5;
  openProduct(pid);
  showToast("Sharh qo'shildi!");
}

function toggleCart(pid) {
  var idx = -1;
  state.cart.forEach(function(c,i){ if(c.id===pid) idx=i; });
  if (idx >= 0) { state.cart.splice(idx,1); } else { state.cart.push({id:pid,qty:1}); }
  saveState(); updateBadges(); renderProducts();
  showToast(idx>=0 ? "Savatdan o'chirildi" : "Savatga qo'shildi!");
}

function renderCart() {
  var container = document.getElementById('cartItems');
  var footer = document.getElementById('cartFooter');
  if (!container||!footer) return;
  if (state.cart.length===0) {
    var t=LANGS[state.currentLang];
    container.innerHTML='<div class="cart-empty"><div class="cart-empty-icon">🛒</div><p>'+t.empty_cart+'</p></div>';
    footer.innerHTML='';
    return;
  }
  var total=0;
  container.innerHTML = state.cart.map(function(item){
    var p=state.products.find(function(pr){return pr.id===item.id;});
    if(!p) return '';
    var dp=p.discount>0?Math.round(p.price*(1-p.discount/100)):p.price;
    total+=dp*item.qty;
    return '<div class="cart-item"><img class="cart-item-img" src="'+getProductImageUrl(p)+'" alt="'+p.name+'">'
      +'<div class="cart-item-info"><div class="cart-item-name">'+p.name+'</div><div class="cart-item-price">'+formatPrice(dp)+'</div></div>'
      +'<div class="cart-item-controls"><button class="cart-qty-btn" onclick="changeQty('+p.id+',-1)">−</button>'
      +'<span class="cart-qty">'+item.qty+'</span>'
      +'<button class="cart-qty-btn" onclick="changeQty('+p.id+',1)">+</button></div>'
      +'<button class="cart-item-remove" onclick="removeFromCart('+p.id+')">🗑️</button></div>';
  }).join('');
  var t=LANGS[state.currentLang];
  footer.innerHTML='<div class="cart-total"><span>'+t.my_cart+':</span><span class="cart-total-price">'+formatPrice(total)+'</span></div>'
    +'<button class="cart-checkout-btn" onclick="closeModal(\'cartModal\');openOrderModal()">'+t.checkout+'</button>';
}

function changeQty(pid, delta) {
  var item=state.cart.find(function(c){return c.id===pid;});
  if(!item) return;
  item.qty+=delta;
  if(item.qty<=0) state.cart=state.cart.filter(function(c){return c.id!==pid;});
  saveState(); updateBadges(); renderCart();
}

function removeFromCart(pid) {
  state.cart=state.cart.filter(function(c){return c.id!==pid;});
  saveState(); updateBadges(); renderCart(); renderProducts();
}

function toggleFavorite(pid) {
  var idx=state.favorites.indexOf(pid);
  if(idx>=0) state.favorites.splice(idx,1); else state.favorites.push(pid);
  saveState(); updateBadges(); renderProducts();
}

function renderFavorites() {
  var container=document.getElementById('favoritesItems');
  if(!container) return;
  if(state.favorites.length===0) {
    var t=LANGS[state.currentLang];
    container.innerHTML='<div class="cart-empty" style="grid-column:1/-1"><div class="cart-empty-icon">❤️</div><p>'+t.no_favorites+'</p></div>';
    return;
  }
  container.innerHTML = state.favorites.map(function(id){
    var p=state.products.find(function(pr){return pr.id===id;});
    if(!p) return '';
    var dp=p.discount>0?Math.round(p.price*(1-p.discount/100)):p.price;
    return '<div class="product-card" onclick="closeModal(\'favoritesModal\');openProduct('+p.id+')">'
      +'<img class="product-card-img" src="'+getProductImageUrl(p)+'" alt="'+p.name+'" style="height:120px">'
      +'<div class="product-card-body"><div class="product-card-name" style="font-size:12px">'+p.name+'</div>'
      +'<div class="product-card-price"><span class="price-current" style="font-size:14px">'+formatPrice(dp)+'</span></div></div></div>';
  }).join('');
}

function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(function(t,i){
    t.classList.toggle('active',(tab==='login'&&i===0)||(tab==='register'&&i===1));
  });
  document.getElementById('loginForm').classList.toggle('hidden',tab!=='login');
  document.getElementById('registerForm').classList.toggle('hidden',tab!=='register');
  document.getElementById('userProfile').classList.toggle('hidden',tab!=='profile');
}

function handleRegister(e) {
  e.preventDefault();
  var name=document.getElementById('regName').value.trim();
  var email=document.getElementById('regEmail').value.trim();
  var phone=document.getElementById('regPhone').value.trim();
  var password=document.getElementById('regPassword').value;
  if(!name||!email||!password) return false;
  try {
    var users=JSON.parse(localStorage.getItem('uzshop_users')||'[]');
    if(users.find(function(u){return u.email===email;})){
      showToast("Bu email allaqachon ro'yxatdan o'tgan!"); return false;
    }
    var user={name:name,email:email,phone:phone,password:password,points:0,spent:0,orders:0};
    users.push(user);
    localStorage.setItem('uzshop_users',JSON.stringify(users));
    state.currentUser=user; saveState(); updateProfileUI();
    switchAuthTab('profile');
    showToast("Muvaffaqiyatli ro'yxatdan o'tingiz! 🎉");
  } catch(e){}
  return false;
}

function handleLogin(e) {
  e.preventDefault();
  var email=document.getElementById('loginEmail').value.trim();
  var password=document.getElementById('loginPassword').value;
  try {
    var users=JSON.parse(localStorage.getItem('uzshop_users')||'[]');
    var user=users.find(function(u){return u.email===email&&u.password===password;});
    if(!user){showToast('Email yoki parol xato!');return false;}
    state.currentUser=user; saveState(); updateProfileUI();
    switchAuthTab('profile');
    showToast("Xush kelibsiz, "+user.name+"! 👋");
  } catch(e){}
  return false;
}

function handleLogout() {
  state.currentUser=null; saveState(); updateProfileUI();
  closeModal('authModal');
  showToast("Tizimdan chiqdingiz");
}

function updateProfileUI() {
  var un=document.getElementById('userName');
  if(un) un.textContent=state.currentUser?state.currentUser.name.split(' ')[0]:'';
  if(state.currentUser) {
    try {
      var users=JSON.parse(localStorage.getItem('uzshop_users')||'[]');
      var fresh=users.find(function(u){return u.email===state.currentUser.email;});
      if(fresh) state.currentUser=fresh;
    } catch(e){}
    document.getElementById('profileName').textContent=state.currentUser.name;
    document.getElementById('profileEmail').textContent=state.currentUser.email;
    document.getElementById('profileOrders').textContent=state.currentUser.orders||0;
    document.getElementById('profilePoints').textContent=state.currentUser.points||0;
    document.getElementById('profileSpent').textContent=formatPrice(state.currentUser.spent||0);
    document.getElementById('userProfile').classList.remove('hidden');
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.add('hidden');
  } else {
    document.getElementById('userProfile').classList.add('hidden');
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('registerForm').classList.add('hidden');
  }
}

function openOrderModal() {
  if(!state.currentUser){showToast("Buyurtma berish uchun kiring!");openModal('authModal');return;}
  var summary=document.getElementById('orderSummary');
  var total=0;
  summary.innerHTML=state.cart.map(function(item){
    var p=state.products.find(function(pr){return pr.id===item.id;});
    if(!p) return '';
    var dp=p.discount>0?Math.round(p.price*(1-p.discount/100)):p.price;
    total+=dp*item.qty;
    return '<div class="order-summary-item"><span>'+p.name+' x'+item.qty+'</span><span>'+formatPrice(dp*item.qty)+'</span></div>';
  }).join('');

  var pointsDiscount=0;
  var pts=state.currentUser.points||0;
  if(pts>0){
    document.getElementById('usePointsGroup').style.display='block';
    document.getElementById('availablePoints').textContent=pts;
  } else {
    document.getElementById('usePointsGroup').style.display='none';
  }

  document.getElementById('orderTotal').innerHTML='<span>Total:</span><span class="order-total-price">'+formatPrice(total)+'</span>';
  document.getElementById('orderTotal').dataset.total=total;
  openModal('orderModal');
}

function handleOrder(e) {
  e.preventDefault();
  var address=document.getElementById('orderAddress').value;
  var phone=document.getElementById('orderPhone').value;
  var payment=document.getElementById('orderPayment').value;
  var total=parseInt(document.getElementById('orderTotal').dataset.total)||0;

  // Apply points
  var usePts=document.getElementById('usePoints').checked;
  if(usePts && state.currentUser) {
    var pts=state.currentUser.points;
    var maxDiscount=Math.floor(total*0.1);
    var ptsDiscount=Math.min(pts, maxDiscount);
    total-=ptsDiscount;
    state.currentUser.points-=ptsDiscount;
  }

  // Calculate earned points
  var earnedPoints=Math.floor(total/1000);

  // Update user
  if(state.currentUser) {
    state.currentUser.orders=(state.currentUser.orders||0)+1;
    state.currentUser.spent=(state.currentUser.spent||0)+total;
    state.currentUser.points=(state.currentUser.points||0)+earnedPoints;
    // Save user to localStorage
    try {
      var users=JSON.parse(localStorage.getItem('uzshop_users')||'[]');
      var idx=users.findIndex(function(u){return u.email===state.currentUser.email;});
      if(idx>=0) users[idx]=state.currentUser;
      localStorage.setItem('uzshop_users',JSON.stringify(users));
    } catch(e){}
  }

  // Save order
  var order={
    id:'ORD-'+Date.now(),
    items:state.cart.slice(),
    total:total,
    address:address,
    phone:phone,
    payment:payment,
    date:new Date().toLocaleDateString(),
    status:'Yangi',
    earnedPoints:earnedPoints
  };
  state.orders.push(order);
  try { localStorage.setItem('uzshop_orders',JSON.stringify(state.orders)); } catch(e){}

  // Send to Telegram
  sendToTelegram(order, state.currentUser);

  // Clear cart
  state.cart=[];
  saveState(); updateBadges(); updateProfileUI();

  closeModal('orderModal');
  openModal('successModal');
  showToast("Buyurtma qabul qilindi! "+earnedPoints+" ball olindingiz ⭐");
  return false;
}

function renderOrderHistory() {
  var container=document.getElementById('orderHistoryList');
  if(!container) return;
  if(state.orders.length===0) {
    var t=LANGS[state.currentLang];
    container.innerHTML='<div class="cart-empty"><div class="cart-empty-icon">📦</div><p>'+t.no_orders+'</p></div>';
    return;
  }
  container.innerHTML=state.orders.slice().reverse().map(function(o){
    var itemNames=o.items.map(function(item){
      var p=state.products.find(function(pr){return pr.id===item.id;});
      return p?p.name+' x'+item.qty:'';
    }).join(', ');
    return '<div class="order-history-item">'
      +'<div class="order-history-header"><span class="order-history-id">'+o.id+'</span>'
      +'<span class="order-history-status">'+o.status+'</span></div>'
      +'<div class="order-history-date">'+o.date+' | '+o.payment+'</div>'
      +'<div class="order-history-items">'+itemNames+'</div>'
      +'<div class="order-history-total">'+formatPrice(o.total)+' ('+o.earnedPoints+' ball)</div></div>';
  }).join('');
}

var ADMIN_PW = 'UzShop@2026Admin!';

function adminLogin() {
  var pw=document.getElementById('adminPassword').value;
  if(pw===ADMIN_PW) {
    state.adminLoggedIn=true;
    document.getElementById('adminLogin').classList.add('hidden');
    document.getElementById('adminContent').classList.remove('hidden');
    renderAdminProducts();
    renderAdminOrders();
    showToast("Admin panelga xush kelibsiz!");
  } else {
    showToast("Noto'g'ri parol!");
  }
}

function switchAdminTab(tab, el) {
  document.querySelectorAll('.admin-tab').forEach(function(t){t.classList.remove('active');});
  document.getElementById('adminProducts').classList.toggle('hidden',tab!=='products');
  document.getElementById('adminOrders').classList.toggle('hidden',tab!=='orders');
  if(el) el.classList.add('active');
  if(tab==='orders') renderAdminOrders();
}

function renderAdminProducts() {
  var list=document.getElementById('adminProductList');
  if(!list) return;
  list.innerHTML=state.products.map(function(p){
    var dp=p.discount>0?Math.round(p.price*(1-p.discount/100)):p.price;
    return '<div class="admin-product-item">'
      +'<img src="'+getProductImageUrl(p)+'" style="width:36px;height:36px;border-radius:6px;object-fit:cover">'
      +'<span>'+p.name+'</span>'
      +'<span class="price-col">'+formatPrice(dp)+'</span>'
      +'<button class="admin-edit-btn" onclick="editProduct('+p.id+')">✏️</button>'
      +'<button class="admin-del-btn" onclick="deleteProduct('+p.id+')">🗑️</button></div>';
  }).join('');
}

function addProduct(e) {
  e.preventDefault();
  var name=document.getElementById('pName').value.trim();
  var price=parseInt(document.getElementById('pPrice').value)||0;
  var category=document.getElementById('pCategory').value;
  var discount=parseInt(document.getElementById('pDiscount').value)||0;
  var image=document.getElementById('pImage').value.trim()||'📦';
  var desc=document.getElementById('pDesc').value.trim();
  if(!name||!price) return false;

  if(state.editingProduct) {
    // Update existing
    var p=state.products.find(function(pr){return pr.id===state.editingProduct;});
    if(p){p.name=name;p.price=price;p.category=category;p.discount=discount;p.image=image;p.desc=desc;}
    state.editingProduct=null;
    showToast("Mahsulot yangilandi!");
  } else {
    // Add new
    var newId = Math.max.apply(null, state.products.map(function(p){return p.id;})) + 1;
    state.products.push({
      id:newId,name:name,category:category,price:price,
      oldPrice:Math.round(price*1.3),discount:discount,
      image:image,rating:4.5,reviews:0,sold:0,desc:desc,
      date:new Date().toISOString().split('T')[0]
    });
    showToast("Mahsulot qo'shildi!");
  }
  saveState(); renderProducts(); renderAdminProducts();
  // Clear form & reset button
  e.target.reset();
  document.querySelector('.admin-product-form .btn-primary').textContent=LANGS[state.currentLang].add_product_btn;
  state.editingProduct=null;
  return false;
}

function editProduct(id) {
  var p=state.products.find(function(pr){return pr.id===id;});
  if(!p) return;
  state.editingProduct=id;
  document.getElementById('pName').value=p.name;
  document.getElementById('pPrice').value=p.price;
  document.getElementById('pCategory').value=p.category;
  document.getElementById('pDiscount').value=p.discount||0;
  document.getElementById('pImage').value=p.image;
  document.getElementById('pDesc').value=p.desc||'';
  document.querySelector('.admin-product-form .btn-primary').textContent=LANGS[state.currentLang].save;
  window.scrollTo({top:document.querySelector('.admin-product-form').offsetTop-100,behavior:'smooth'});
}

function deleteProduct(id) {
  if(!confirm("O'chirishni xohlaysizmi?")) return;
  state.products=state.products.filter(function(p){return p.id!==id;});
  saveState(); renderProducts(); renderAdminProducts();
  showToast("Mahsulot o'chirildi!");
}

function renderAdminOrders() {
  var list=document.getElementById('adminOrdersList');
  if(!list) return;
  if(state.orders.length===0) {
    list.innerHTML='<div class="cart-empty"><div class="cart-empty-icon">📦</div><p>Buyurtmalar yo\'q</p></div>';
    return;
  }
  list.innerHTML=state.orders.slice().reverse().map(function(o){
    return '<div class="order-history-item">'
      +'<div class="order-history-header"><span class="order-history-id">'+o.id+'</span>'
      +'<span class="order-history-status">'+o.status+'</span></div>'
      +'<div class="order-history-date">'+o.date+' | '+o.phone+' | '+o.address+'</div>'
      +'<div class="order-history-items">'+o.payment+'</div>'
      +'<div class="order-history-total">'+formatPrice(o.total)+'</div></div>';
  }).join('');
}

// ===== LANGUAGE =====
function setLang(lang) {
  state.currentLang=lang;
  saveState();
  document.querySelectorAll('.lang-btn').forEach(function(b){
    b.classList.toggle('active',b.dataset.lang===lang);
  });
  applyLang(); renderBanner(); renderQuickCategories(); renderProducts();
  // Update section title
  var titleEl=document.getElementById('sectionTitle');
  if(titleEl) {
    var catNames={all:LANGS[state.currentLang].all_products, electronics:LANGS[state.currentLang].electronics, clothing:LANGS[state.currentLang].clothing, home:LANGS[state.currentLang].home, beauty:LANGS[state.currentLang].beauty, sports:LANGS[state.currentLang].sports, kids:LANGS[state.currentLang].kids, books:LANGS[state.currentLang].books, food:LANGS[state.currentLang].food};
    titleEl.textContent=catNames[state.currentCategory]||state.currentCategory;
  }
}

function applyLang() {
  document.querySelectorAll('[data-i18n]').forEach(function(el){
    var key=el.getAttribute('data-i18n');
    if(LANGS[state.currentLang]&&LANGS[state.currentLang][key]) el.textContent=LANGS[state.currentLang][key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el){
    var key=el.getAttribute('data-i18n-placeholder');
    if(LANGS[state.currentLang]&&LANGS[state.currentLang][key]) el.placeholder=LANGS[state.currentLang][key];
  });
}

// ===== MODALS =====
function openModal(id) {
  var m=document.getElementById(id);
  if(m) {
    m.classList.add('active');
    if(id==='cartModal') renderCart();
    if(id==='favoritesModal') renderFavorites();
    if(id==='authModal') {
      if(state.currentUser) switchAuthTab('profile');
      else switchAuthTab('login');
    }
    if(id==='orderHistoryModal') renderOrderHistory();
  }
}

function closeModal(id) {
  var m=document.getElementById(id);
  if(m) m.classList.remove('active');
}

// Close modals on overlay click
document.querySelectorAll('.modal-overlay').forEach(function(overlay){
  overlay.addEventListener('click',function(e){
    if(e.target===overlay) overlay.classList.remove('active');
  });
});

// ===== SIDEBAR =====
function toggleSidebar() {
  var s=document.getElementById('sidebar');
  var o=document.getElementById('sidebarOverlay');
  s.classList.toggle('open');
  o.classList.toggle('active');
}

// ===== TOAST =====
function showToast(msg) {
  var t=document.getElementById('toast');
  if(!t) return;
  t.textContent=msg;
  t.classList.add('show');
  setTimeout(function(){t.classList.remove('show');},2500);
}

// ===== BADGES =====
function updateBadges() {
  var cc=document.getElementById('cartCount');
  var fc=document.getElementById('favCount');
  if(cc) cc.textContent=state.cart.length;
  if(fc) fc.textContent=state.favorites.length;
  if(cc) cc.style.display=state.cart.length>0?'flex':'none';
  if(fc) fc.style.display=state.favorites.length>0?'flex':'none';
}

// ===== GO HOME =====
function goHome() {
  state.currentCategory='all';
  state.searchQuery='';
  state.priceMin=0;
  state.priceMax=Infinity;
  state.currentSort='default';
  var si=document.getElementById('searchInput');
  if(si) si.value='';
  document.querySelectorAll('.cat-btn').forEach(function(b){
    b.classList.toggle('active',b.dataset.category==='all');
  });
  var titleEl=document.getElementById('sectionTitle');
  if(titleEl) titleEl.textContent=LANGS[state.currentLang].all_products;
  renderQuickCategories(); renderProducts();
  window.scrollTo({top:0,behavior:'smooth'});
}

// ===== TELEGRAM BOT =====
var BOT_TOKEN = '8855638971:AAFZNVBMnH1W4JfJEuOaiFu-tMVAeejtFWY';
var CHAT_ID = '7117191839';

function sendToTelegram(order, user) {
  if (BOT_TOKEN.indexOf('TELEGRAM') >= 0) return;
  var items = order.items.map(function(i){
    var p = state.products.find(function(pr){return pr.id===i.id;});
    return (p?p.name:'Mahsulot')+' x'+i.qty;
  }).join('\n');
  var msg = '🛍 *YANGI BUYURTMA!*\n'
    +'┌─────────────────\n'
    +'📦 *Buyurtma:* '+order.id+'\n'
    +'👤 *Mijoz:* '+(user?user.name:'Anonim')+'\n'
    +'📞 *Telefon:* '+order.phone+'\n'
    +'📍 *Manzil:* '+order.address+'\n'
    +'💳 *To\'lov:* '+order.payment+'\n'
    +'📋 *Mahsulotlar:*\n'+items+'\n'
    +'💰 *Jami:* '+formatPrice(order.total)+'\n'
    +'└─────────────────';
  fetch('https://api.telegram.org/bot'+BOT_TOKEN+'/sendMessage', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body:JSON.stringify({chat_id:CHAT_ID, text:msg, parse_mode:'Markdown'})
  }).catch(function(){});
}

// ===== SCROLL TOP =====
window.addEventListener('scroll',function(){
  var btn=document.getElementById('scrollTop');
  if(btn) btn.classList.toggle('visible', window.scrollY > 400);
});

// ===== SEARCH =====
document.addEventListener('DOMContentLoaded',function(){
  var si=document.getElementById('searchInput');
  if(si) {
    si.addEventListener('keyup',function(e){if(e.key==='Enter')searchProducts();});
    si.addEventListener('input',function(){state.searchQuery=this.value.trim();renderProducts();});
  }
});

// ===== INIT =====
init();