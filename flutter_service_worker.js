'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "42d080ad8cdef555941beb8a1adf300a",
"assets/assets/images/background.jpg": "d467ac7fa79cacd71fba3c35495e4a99",
"assets/assets/images/bestsell0.jpg": "d6dc4ff4252728dbf587d2567d849ffa",
"assets/assets/images/bestsell1.jpg": "80ca70d22ddbded631b70d2060a09d2f",
"assets/assets/images/bestsell2.jpg": "8291e6a8e777d852539b019c56f8ba8a",
"assets/assets/images/bestsell3.jpg": "57027210eb72c9958f2641b585219460",
"assets/assets/images/bestsell4.jpg": "faee40864b5dd71d846cd01b4eaafac4",
"assets/assets/images/bestsell5.jpg": "1109aad32a28cceab287c81b07fa42e6",
"assets/assets/images/category0.jpg": "7928c2b514e67a922c2e865c7bfa9acd",
"assets/assets/images/category1.jpg": "c8be4e46617536a1ccd80f290f929bdf",
"assets/assets/images/category2.jpg": "3c63e9de6189aae7f6b56be6bb7baae4",
"assets/assets/images/category3.jpg": "9d6e927d6fb6a9bc7413e6d03145737f",
"assets/assets/images/category4.jpg": "d4209d66ebd03ecb384895863d4d4382",
"assets/assets/images/cc.jpg": "cddbc4ebd2358ef5cb3da30ffa9ed238",
"assets/assets/images/ccategory0.jpg": "038a0be360a910abc85297f7508c7b32",
"assets/assets/images/dd.jpg": "97f1a0d69f0950fb21c11fe311f9873e",
"assets/assets/images/gmail.png": "e79bcec8e3b333c4b242080a6dd40b48",
"assets/assets/images/instagram.png": "26631a4043b14dff84180bdf51c3cacb",
"assets/assets/images/iptv.jpeg": "42cd367d98d707b9e9574554a4bdf235",
"assets/assets/images/lolo.jpg": "23b5f5ac0e90c7f44b04055c839cc377",
"assets/assets/images/marius.jpg": "4756b901b6620f2dfbe945ddb3e7c19b",
"assets/assets/images/mariuss.jpg": "e977cca70a26cf330ff7fc8b1d6915af",
"assets/assets/images/porto.png": "393fdc500e64516bd02a90f4bbe9ae92",
"assets/assets/images/qw.jpg": "e9f7e913543cfda51fc60856d8546277",
"assets/assets/images/subscribe.jpg": "651716d030861eae0cfa991807ad4b10",
"assets/assets/images/telegram.png": "eb1fa44bd3e279f3f0b7c05df3bee9b9",
"assets/assets/images/whatsapp.png": "fc601ba58f923366416bd69b8be6cca4",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "e7069dfd19b331be16bed984668fe080",
"assets/NOTICES": "208df9ff14b8465a17981796b6059d33",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/shaders/ink_sparkle.frag": "2ad5fabd6a36a6deff087b8edfd0c1f8",
"canvaskit/canvaskit.js": "b404b2ef26a75253c3c322c586112449",
"canvaskit/canvaskit.wasm": "2abf88817938cca7761a56861f3cfd1a",
"canvaskit/profiling/canvaskit.js": "79bb5d744b0bec63ab46eddfd6b52546",
"canvaskit/profiling/canvaskit.wasm": "5886b7db0562bf9d812900ab17ad2b1e",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"flutter.js": "195f32f4217e034162a6697208586f44",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "61f634e64ce9d88d381cabd687af4c67",
"/": "61f634e64ce9d88d381cabd687af4c67",
"main.dart.js": "5d06259389cf66738ce1998d6250d6ec",
"manifest.json": "5ebe97d0a14d799977b2d38509cbc390",
"version.json": "d78f5551c6ab7d116c8aad74114b9ba9"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
