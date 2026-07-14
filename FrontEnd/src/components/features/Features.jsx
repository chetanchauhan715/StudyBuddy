import FeatureCard from "./FeatureCard"
import "./Features.css"
function Features(){
    const features = [
        {   
            id:1,
            icon: "📚",
            title: "Personalized Learning",
            description: "StudyBuddy adapts to your pace and style."
        },

        {   
            id:2,
            icon: "⏰",
            title: "Smart Reminders",
            description: "Stay on track with timely nudges."
          },

          { 
            id:3,
            icon: "🎯",
            title: "Goal Tracking",
            description: "Measure progress and celebrate milestones."
          }
    ];

    return(
        <section className="features">
    <h2>Why Choose StudyBuddy?</h2>

    <div className="feature-grid">
        {features.map((feature) => (
            <FeatureCard
                key={feature.id}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
            />
        ))}
    </div>
</section>
    );
}

export default Features;