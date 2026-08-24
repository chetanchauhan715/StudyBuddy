import { useState } from "react";
import {
    createOrder,
    verifyPayment
} from "../../services/paymentService";

import { useUser } from "../../context/UserContext";

import toast from "react-hot-toast";


function UpgradeButton({
    plan,
    label = "Upgrade to premium",
    className = "",
    onSuccess
}) {

    const [loading, setLoading] = useState(false);

    const { refreshUser } = useUser();


    async function handleClick() {

        setLoading(true);

        try {

            
            // CREATE RAZORPAY ORDER

            const order = await createOrder(plan);

            // RAZORPAY CHECKOUT

            const options = {

                key:
                    import.meta.env.VITE_RAZORPAY_KEY_ID,

                amount:
                    order.amount,

                currency:
                    order.currency,

                order_id:
                    order.orderId,


                // PAYMENT SUCCESS

                handler: async function (response) {

                    try {

                        await verifyPayment(response);


                        // Get fresh subscription from backend
                        await refreshUser();


                        toast.success(
                            "Welcome to StudyBuddy Premium!"
                        );


                        if (onSuccess) {
                            onSuccess();
                        }


                    } catch (error) {

                        console.error(
                            "Payment verification failed",
                            error
                        );

                        toast.error(
                            "Payment verification failed"
                        );

                    } finally {

                        setLoading(false);
                    }

                },


                // CHECKOUT CLOSED

                modal: {

                    ondismiss: function () {

                        console.log(
                            "Payment cancelled by user"
                        );

                        setLoading(false);

                    }

                }

            };


            const checkout =
                new window.Razorpay(options);

            checkout.open();


        } catch (error) {

            console.error(error);

            toast.error(
                "Unable to start payment"
            );

            setLoading(false);
        }
    }


    return (

        <button
            type="button"
            onClick={handleClick}
            disabled={loading}
            className={className}
        >

            {loading
                ? "Processing..."
                : label
            }

        </button>

    );
}


export default UpgradeButton;