import { useEffect, useState } from "react";

function useInstallPWA(){
    const [deferredPrompt  , setDefferedPrompt] = useState(null);

    useEffect( ()=>{
        function handleBeforeInstalllPrompt(event){
            event.preventDefault();

            setDefferedPrompt(event);
        }

        window.addEventListener(
            "beforeinstallprompt",
            handleBeforeInstalllPrompt
        );

        return () =>{
            window.removeEventListener(
                "beforeinstallprompt",
                handleBeforeInstalllPrompt
            );
        };
    }, []);

    async function install() {
        if(!deferredPrompt){
            return;
        }
    

    deferredPrompt.prompt();

    const {outcocme} = await deferredPrompt.userChoice;

    console.log("Install result:" , outcocme);

    setDefferedPrompt(null);

    }

    return{
        install,
        canInstall: !deferredPrompt,
    };
}

export default useInstallPWA;

/* useState
   ↓
holds the install event

useEffect
   ↓
listen for browser event

beforeinstallprompt fires
   ↓
prevent browser's automatic behavior
   ↓
save event in React state

component unmounts
   ↓
remove listener  */