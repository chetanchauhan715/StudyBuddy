import "./PremiumGate.css";

function PremiumGate({
    isPremium,
    children,
    onUpgrade
}) {

    // Premium user → normal content
    if (isPremium) {
        return children;
    }


    // Free user → blurred content + lock
    return (
        <div className="premium-gate">

            <div className="premium-gate-content">
                {children}
            </div>


            <div className="premium-gate-overlay">

                <div className="premium-lock">
                    🔒
                </div>

                <h3>Premium Feature</h3>

                <p>
                    Unlock advanced insights with StudyBuddy Premium.
                </p>

                <button
                    className="primary-btn"
                    onClick={onUpgrade}
                >
                    Unlock Premium
                </button>

            </div>

        </div>
    );
}

export default PremiumGate;