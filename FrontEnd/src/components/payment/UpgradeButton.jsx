import { useState } from "react";
import { createOrder , verifyPayment } from "../../services/paymentService";



function UpgradeButton( {plan}){


    const [loading , setLoading] = useState(false);

async function handleClick(){
    setLoading(true);

    try{

    const order = await createOrder(plan);

    console.log(order);
    console.log(typeof window.Razorpay);

    const options = {
        key:import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount:order.amount,
        currency:order.currency,
        order_id:order.orderId,

        handler: async function (response) {
            try{
                const result = await verifyPayment(response);

        console.log("Payment verification result:", result);

        setLoading(false);
            } catch(error){
                console.error("Payment verification failed", error);

                setLoading(false);
            }
    }, 

    modal:{
        ondismiss:function (){
            console.log("Payment cancelled by user");

            setLoading(false);
            }
        }
    };

    const checkout = new window.Razorpay(options);
    checkout.open();

} catch(error){
    console.error(error);
    setLoading(false);
}
}

return(
    <section>
        <button 
        type="button"
        onClick={handleClick}
        disabled={loading}
        >
            {loading ? "processing..." : "Upgrade Your Plan"}
        </button>
    </section>
)

}

export default UpgradeButton;