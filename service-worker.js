const CACHE_NAME = "ceddo-tanfleks-v1";

const APP_FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png"
];

// تخزين ملفات التطبيق عند التثبيت
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_FILES);
    })
  );

  self.skipWaiting();
});

// حذف ملفات التخزين القديمة عند التحديث
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key.startsWith("ceddo-tanfleks-") && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );

  self.clients.claim();
});

// تشغيل ملفات الواجهة من الإنترنت أو التخزين عند انقطاع الاتصال
self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // لا نخزن طلبات Supabase أو المواقع الخارجية
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});