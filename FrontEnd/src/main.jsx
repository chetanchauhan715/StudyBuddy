import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import "@fontsource/inter";
import { UserProvider } from "./context/UserContext.jsx";

import api from "./api/axios.js";

import "./styles/global.css";



// VAPID PUBLIC KEY → UINT8 ARRAY

function urlBase64ToUint8Array(base64String) {

    const padding = "=".repeat(
        (4 - (base64String.length % 4)) % 4
    );

    const base64 = (base64String + padding)
        .replace(/-/g, "+")
        .replace(/_/g, "/");

    const rawData = window.atob(base64);

    return Uint8Array.from(
        [...rawData].map((char) => char.charCodeAt(0))
    );
}


// PUSH NOTIFICATION SETUP

if ("serviceWorker" in navigator) {

    window.addEventListener("load", async () => {

        try {

            // 1. REGISTER SERVICE WORKER

            const registration =
                await navigator.serviceWorker.register("/sw.js");

           


            // 2. ASK NOTIFICATION PERMISSION

            const permission =
                await Notification.requestPermission();

            if (permission !== "granted") {

                return;
            }


            // 3. GET VAPID PUBLIC KEY

            const response =
                await api.get("/push/public-key");

            const publicKey =
                response.data.publicKey;

            // 4. CONVERT PUBLIC KEY

            const convertedPublicKey =
                urlBase64ToUint8Array(publicKey);


            // 5. CREATE PUSH SUBSCRIPTION

            const subscription =
                await registration.pushManager.subscribe({

                    userVisibleOnly: true,

                    applicationServerKey:
                        convertedPublicKey

                });


            

            // 6. SEND SUBSCRIPTION TO BACKEND

            const subscriptionData =
                subscription.toJSON();

            


            await api.post(
                "/push/subscribe",
                subscriptionData
            );



        } catch (error) {

            console.error(
                "Push setup failed:",
                error
            );

        }

    });

}


// --------------- global handeling - CTA button - download 

// PWA INSTALL PROMPT SETUP

window.deferredPWAInstallPrompt = null;

window.addEventListener(
    "beforeinstallprompt",
    (event) => {

        event.preventDefault();

        window.deferredPWAInstallPrompt =
            event;

        window.dispatchEvent(
            new Event("pwa-install-ready")
        );
    }
);


window.addEventListener(
    "appinstalled",
    () => {

        window.deferredPWAInstallPrompt =
            null;

        window.dispatchEvent(
            new Event("pwa-install-complete")
        );
    }
);

// REACT app 

createRoot(
    document.getElementById("root")
).render(

    <StrictMode>

        <BrowserRouter>

            <UserProvider>

                <App />

            </UserProvider>

        </BrowserRouter>

    </StrictMode>

);