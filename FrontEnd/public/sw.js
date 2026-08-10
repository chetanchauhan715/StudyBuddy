const CACHE_NAME = "studybuddy-v3";

const API_ORIGINS = [
    "http://localhost:3000",
    "https://api.studybuddypro.site",
];

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


// --------------------
// INSTALL
// --------------------

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


// --------------------
// ACTIVATE
// --------------------

self.addEventListener("activate", (event) => {
    console.log("Service Worker: activated");

    event.waitUntil(
        self.clients.claim()
    );
});


// --------------------
// FETCH
// --------------------

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

    const isApiRequest = API_ORIGINS.includes(requestUrl.origin);

    if (isApiRequest) {

        event.respondWith(

            caches.match(request)
                .then((cachedResponse) => {

                    // ----------------------------------
                    // CACHE HIT
                    // ----------------------------------

                    if (cachedResponse) {

                        console.log(
                            "SW: API cache hit:",
                            requestUrl.pathname + requestUrl.search
                        );

                        // Update cache in background
                        fetchWithTimeout(request, 5000)
                            .then((networkResponse) => {

                                return cacheResponse(
                                    request,
                                    networkResponse
                                );

                            })
                            .catch(() => {

                                console.log(
                                    "SW: API network unavailable, using cache"
                                );

                            });

                        // IMPORTANT:
                        // return cache immediately
                        return cachedResponse;
                    }


                    // ----------------------------------
                    // CACHE MISS
                    // ----------------------------------

                    console.log(
                        "SW: API cache miss:",
                        requestUrl.pathname + requestUrl.search
                    );

                    return fetchWithTimeout(request, 5000)
                        .then((networkResponse) => {

                            return cacheResponse(
                                request,
                                networkResponse
                            );

                        })
                        .catch(() => {

                            return new Response(
                                JSON.stringify({
                                    message: "Offline and no cached data available"
                                }),
                                {
                                    status: 503,
                                    headers: {
                                        "Content-Type": "application/json"
                                    }
                                }
                            );

                        });

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

                    return fetchWithTimeout(request, 5000)
                        .then((networkResponse) => {

                            return cacheResponse(
                                request,
                                networkResponse
                            );

                        });

                })

        );

        return;
    }

});