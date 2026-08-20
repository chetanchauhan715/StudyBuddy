import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import "@fontsource/inter";

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

            console.log(
                "Service Worker registered:",
                registration
            );


            // 2. ASK NOTIFICATION PERMISSION

            const permission =
                await Notification.requestPermission();

            console.log(
                "Notification permission:",
                permission
            );


            if (permission !== "granted") {

                console.log(
                    "Notification permission not granted."
                );

                return;
            }


            // 3. GET VAPID PUBLIC KEY

            const response =
                await api.get("/push/public-key");

            const publicKey =
                response.data.publicKey;

            console.log(
                "VAPID public key received:",
                publicKey
            );


            // 4. CONVERT PUBLIC KEY

            const convertedPublicKey =
                urlBase64ToUint8Array(publicKey);

            console.log(
                "Converted public key:",
                convertedPublicKey,
                "Length:",
                convertedPublicKey.length
            );


            // 5. CREATE PUSH SUBSCRIPTION

            const subscription =
                await registration.pushManager.subscribe({

                    userVisibleOnly: true,

                    applicationServerKey:
                        convertedPublicKey

                });


            console.log(
                "Push subscription created:",
                subscription
            );


            // 6. SEND SUBSCRIPTION TO BACKEND

            const subscriptionData =
                subscription.toJSON();

            console.log(
                "Sending subscription to backend:",
                subscriptionData
            );


            await api.post(
                "/push/subscribe",
                subscriptionData
            );


            console.log(
                "Push subscription saved to backend"
            );


        } catch (error) {

            console.error(
                "Push setup failed:",
                error
            );

        }

    });

}


// REACT app 

createRoot(
    document.getElementById("root")
).render(

    <StrictMode>

        <BrowserRouter>

            <App />

        </BrowserRouter>

    </StrictMode>

);