import "./PremiumPoster.css";
import UpgradeButton from "../payment/UpgradeButton";

function PremiumPoster({
    isOpen,
    onClose
}) {

    if (!isOpen) {
        return null;
    }

    return (
        <div className="premium-poster-overlay">

            <div className="premium-poster">

                <button
                    className="premium-poster-close"
                    onClick={onClose}
                    type="button"
                    aria-label="Close premium plans"
                >
                    ×
                </button>


                <div className="premium-poster-header">

                    <span className="premium-poster-badge">
                        ✨ StudyBuddy Premium
                    </span>

                    <h2>
                        Unlock more from your study time
                    </h2>

                    <p>
                        Get deeper insights, unlimited reminders
                        and more tools to improve your study routine.
                    </p>

                </div>


                <div className="premium-benefits">

                    <div className="premium-benefit">
                        <span>🔔</span>

                        <div>
                            <strong>Unlimited Reminders</strong>

                            <p>
                                Create as many study reminders as you need.
                            </p>
                        </div>
                    </div>


                    <div className="premium-benefit">
                        <span>📊</span>

                        <div>
                            <strong>
                                Advanced Dashboard Insights
                            </strong>

                            <p>
                                See more detailed information about your progress.
                            </p>
                        </div>
                    </div>


                    <div className="premium-benefit">
                        <span>📈</span>

                        <div>
                            <strong>Advanced Analytics</strong>

                            <p>
                                Understand your study patterns with deeper statistics.
                            </p>
                        </div>
                    </div>


                    <div className="premium-benefit">
                        <span>🚀</span>

                        <div>
                            <strong>
                                Future Premium Features
                            </strong>

                            <p>
                                Get access to upcoming premium productivity tools.
                            </p>
                        </div>
                    </div>

                </div>


                <div className="premium-plans">

                    {/* MONTHLY */}

                    <div className="premium-plan-card">

                        <h3>Monthly</h3>

                        <div className="premium-price">
                            ₹49
                            <span>/month</span>
                        </div>

                        <p>
                            Flexible access with monthly billing.
                        </p>

                        <UpgradeButton
                            plan="monthly"
                            label="Choose Monthly"
                            className="secondary-btn premium-plan-btn"
                            onSuccess={onClose}
                        />

                    </div>


                    {/* YEARLY */}

                    <div className="premium-plan-card recommended">

                        <span className="recommended-badge">
                            BEST VALUE
                        </span>

                        <h3>Yearly</h3>

                        <div className="premium-price">
                            ₹399
                            <span>/year</span>
                        </div>

                        <p>
                            About ₹33/month — save ₹189 yearly.
                        </p>

                        <UpgradeButton
                            plan="yearly"
                            label="Choose Yearly"
                            className="primary-btn premium-plan-btn"
                            onSuccess={onClose}
                        />

                    </div>

                </div>

            </div>

        </div>
    );
}

export default PremiumPoster;