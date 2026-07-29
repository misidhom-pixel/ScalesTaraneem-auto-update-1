// Service Worker - يخزن كل ملفات التطبيق محليًا عشان يشتغل بدون إنترنت خالص بعد أول فتح
const CACHE_NAME = "ecg-reports-cache-v4";

// عدّل القائمة دي لو غيرت أسماء الملفات أو ضفت/شلت مكتبة (زي lib/docx.js لو مش محتاجه على الموبايل)
const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./xlsx.full.min.js",
    "./manifest.json",
    "./icon-192.png",
    "./icon-512.png"
    // لو سيبت مكتبة الوورد موجودة ضيف السطرين دول:
    // ,"./lib/docx.js"
    // ,"./lib/FileSaver.min.js"
];

// عند التثبيت: يحمّل وينسخ كل الملفات دي في التخزين المحلي
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
    );
    self.skipWaiting();
});

// عند التفعيل: يمسح أي نسخ كاش قديمة من إصدارات سابقة
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
        )
    );
    self.clients.claim();
});

// عند كل طلب: يجيب من الكاش المحلي أولاً (يشتغل حتى بدون إنترنت)، ولو مش موجود يحاول ينزله من النت
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((cached) => cached || fetch(event.request))
    );
});
