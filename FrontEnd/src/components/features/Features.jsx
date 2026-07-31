import FeatureCard from "./FeatureCard";
import "./Features.css";

function Features() {
  const features = [
    {
      id: 1,
      icon: "📚",
      title: "Personalized Learning",
      description: "StudyBuddy adapts to your learning pace and helps you stay consistent.",
    },
    {
      id: 2,
      icon: "⏰",
      title: "Smart Reminders",
      description: "Never miss a study session with intelligent reminders and schedules.",
    },
    {
      id: 3,
      icon: "🎯",
      title: "Goal Tracking",
      description: "Track your daily goals and visualize your learning progress over time.",
    },
  ];

  return (
    <section className="features">
      <h2 className="section-title">Why Choose StudyBuddy?</h2>

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