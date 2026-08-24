import { useEffect, useState } from "react";

function useInstallPWA() {

    const [canInstall, setCanInstall] =
        useState(
            !!window.deferredPWAInstallPrompt
        );


    useEffect(() => {

        function handleInstallReady() {
            setCanInstall(true);
        }


        function handleInstallComplete() {
            setCanInstall(false);
        }


        window.addEventListener(
            "pwa-install-ready",
            handleInstallReady
        );

        window.addEventListener(
            "pwa-install-complete",
            handleInstallComplete
        );


        // If Dashboard mounts after the browser
        // already fired beforeinstallprompt
        setCanInstall(
            !!window.deferredPWAInstallPrompt
        );


        return () => {

            window.removeEventListener(
                "pwa-install-ready",
                handleInstallReady
            );

            window.removeEventListener(
                "pwa-install-complete",
                handleInstallComplete
            );
        };

    }, []);


    async function install() {

        const deferredPrompt =
            window.deferredPWAInstallPrompt;


        if (!deferredPrompt) {
            return;
        }


        deferredPrompt.prompt();


        await deferredPrompt.userChoice;


        // The install prompt can only be used once
        window.deferredPWAInstallPrompt = null;

        setCanInstall(false);
    }


    return {
        install,
        canInstall
    };
}


export default useInstallPWA;



/*         

OLD

useInstallPWA
├── catches browser event
├── stores browser event
├── controls button
└── performs installation


NEW

main.jsx
├── catches browser event
└── stores browser event globally

useInstallPWA
├── watches whether installation is available
├── tells Dashboard canInstall true/false
└── performs installation

Dashboard
└── only renders the button





*/