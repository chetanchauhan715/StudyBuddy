const CACHE_NAME = "studybuddy-v3";

const API_ORIGINS = [
    "http://localhost:3000",
    "https://api.studybuddypro.site",
];


// ==================================================
// HELPERS
// ==================================================

function isViteDevRequest(url) {
    return (
        url.pathname.startsWith("/@vite/") ||
        url.pathname.startsWith("/@react-refresh") ||
        url.pathname.startsWith("/node_modules/") ||
        url.pathname.startsWith("/src/")
    );
}


async function cacheResponse(request, response) {
    if (!response || !response.ok) {
        return response;
    }

    const cache = await caches.open(CACHE_NAME);

    await cache.put(
        request,
        response.clone()
    );

    return response;
}


async function fetchWithTimeout(request, timeout = 5000) {
    const controller = new AbortController();

    const timeoutId = setTimeout(() => {
        controller.abort();
    }, timeout);

    try {
        return await fetch(request, {
            signal: controller.signal,
        });
    } finally {
        clearTimeout(timeoutId);
    }
}


// ==================================================
// INSTALL
// ==================================================

self.addEventListener("install", (event) => {
    console.log("Service Worker: installing");

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.add("/manifest.webmanifest");
            })
            .then(() => {
                return self.skipWaiting();
            })
    );
});


// ==================================================
// ACTIVATE
// ==================================================

self.addEventListener("activate", (event) => {

    event.waitUntil(

        caches.keys()

            .then((cacheNames) => {

                return Promise.all(

                    cacheNames

                        .filter(
                            (cacheName) =>
                                cacheName !== CACHE_NAME
                        )

                        .map(
                            (cacheName) =>
                                caches.delete(cacheName)
                        )

                );

            })

            .then(() => self.clients.claim())

    );
});


// ==================================================
// PUSH NOTIFICATION
// ==================================================

self.addEventListener("push", (event) => {

    console.log("SW: Push event received");

    if (!event.data) {
        return;
    }

    const data = event.data.json();

    console.log("SW: Push data:", data);

    event.waitUntil(

        self.registration.showNotification(
            data.title,
            {
                body: data.body,

                icon: "/icons/icon-192.png",

                badge: "/icons/icon-192.png"
            }
        )

    );
});


// ==================================================
// FETCH
// ==================================================

self.addEventListener("fetch", (event) => {

    const request = event.request;

    // Only GET requests
    if (request.method !== "GET") {
        return;
    }

    const requestUrl = new URL(request.url);


    // Ignore Vite development internals
    if (isViteDevRequest(requestUrl)) {
        return;
    }


    // ==================================================
    // API REQUEST
    // ==================================================

    const isApiRequest =
        API_ORIGINS.includes(requestUrl.origin);

    if (isApiRequest) {

        event.respondWith(

            // NETWORK FIRST
            fetchWithTimeout(request, 5000)

                .then(async (networkResponse) => {

                    console.log(
                        "SW: API network success:",
                        requestUrl.pathname +
                        requestUrl.search
                    );

                    // Save latest API response
                    await cacheResponse(
                        request,
                        networkResponse
                    );

                    // Give fresh response to React
                    return networkResponse;
                })

                .catch(async () => {

                    console.log(
                        "SW: API network failed, checking cache:",
                        requestUrl.pathname +
                        requestUrl.search
                    );

                    // Network failed → use cached response
                    const cachedResponse =
                        await caches.match(request);

                    if (cachedResponse) {

                        console.log(
                            "SW: API cache fallback:",
                            requestUrl.pathname +
                            requestUrl.search
                        );

                        return cachedResponse;
                    }


                    // Nothing in cache
                    console.log(
                        "SW: API no cached data:",
                        requestUrl.pathname +
                        requestUrl.search
                    );

                    return new Response(

                        JSON.stringify({
                            message:
                                "Offline and no cached data available"
                        }),

                        {
                            status: 503,

                            headers: {
                                "Content-Type":
                                    "application/json"
                            }
                        }
                    );

                })

        );

        return;
    }


    // ==================================================
    // SAME ORIGIN REQUEST
    // ==================================================

    if (requestUrl.origin === self.location.origin) {

        event.respondWith(

            caches.match(request)

                .then((cachedResponse) => {

                    // ----------------------------------
                    // CACHE HIT
                    // ----------------------------------

                    if (cachedResponse) {

                        console.log(
                            "SW: same-origin cache hit:",
                            requestUrl.pathname
                        );

                        return cachedResponse;
                    }


                    // ----------------------------------
                    // CACHE MISS
                    // ----------------------------------

                    console.log(
                        "SW: same-origin cache miss:",
                        requestUrl.pathname
                    );


                    return fetchWithTimeout(
                        request,
                        5000
                    )

                        .then(async (networkResponse) => {

                            await cacheResponse(
                                request,
                                networkResponse
                            );

                            return networkResponse;
                        })

                        .catch(async () => {

                            // If this is a page navigation
                            // and exact route isn't cached,
                            // fallback to cached root HTML.

                            if (
                                request.mode === "navigate"
                            ) {

                                const rootPage =
                                    await caches.match("/");

                                if (rootPage) {

                                    console.log(
                                        "SW: navigation fallback to /"
                                    );

                                    return rootPage;
                                }
                            }


                            throw new Error(
                                "Network unavailable and no cached response"
                            );

                        });

                })

        );

        return;
    }

});

// ----

self.addEventListener("push", (event) => {

    console.log("SW: Push received");

    const data = event.data
        ? event.data.json()
        : {};

    const title =
        data.title || "StudyBuddy";

    const options = {

        body:
            data.body || "You have a new reminder.",

        icon: "/icons/icon-192.png",

        badge: "/icons/icon-192.png",

        data: {
            reminderId: data.reminderId
        }

    };


    event.waitUntil(

        self.registration.showNotification(
            title,
            options
        )

    );

});