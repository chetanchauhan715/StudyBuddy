import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { updateWeeklyGoal } from "../../services/profileService";
import { useUser } from "../../context/UserContext";

import PremiumGate from "../premium/PremiumGate";
import PremiumPoster from "../premium/PremiumPoster";

import "./WeeklyGoalCard.css";


function WeeklyGoalCard({
  weeklyGoal: currentWeeklyGoal,
  onGoalUpdated
}) {

  const { user, refreshUser } = useUser();

  const [weeklyGoal, setWeeklyGoal] = useState(
    currentWeeklyGoal || 0
  );

  const [saving, setSaving] = useState(false);

  const [
    isPremiumPosterOpen,
    setIsPremiumPosterOpen
  ] = useState(false);


  const now = new Date();

  const isPremium =
    user?.subscription?.plan === "premium" &&
    user?.subscription?.startDate &&
    user?.subscription?.endDate &&
    new Date(user.subscription.startDate) <= now &&
    new Date(user.subscription.endDate) > now;


  useEffect(() => {

    setWeeklyGoal(
      currentWeeklyGoal || 0
    );

  }, [currentWeeklyGoal]);


  async function handleSave() {

    const goal = Number(weeklyGoal);

    if (
      !goal ||
      goal < 1 ||
      goal > 100
    ) {

      toast.error(
        "Weekly goal must be between 1 and 100 hours."
      );

      return;
    }


    try {

      setSaving(true);

      await updateWeeklyGoal(goal);


      // Update ProfilePage immediately
      if (onGoalUpdated) {
        onGoalUpdated(goal);
      }


      // Update global user context too
      await refreshUser();


      toast.success(
        "Weekly study goal updated successfully!"
      );


    } catch (error) {

      console.error(error);

      toast.error(
        error.response?.data?.message ||
        "Failed to update weekly goal."
      );

    } finally {

      setSaving(false);
    }
  }


  return (
    <>

      <PremiumGate
        isPremium={isPremium}
        onUpgrade={() =>
          setIsPremiumPosterOpen(true)
        }
      >

        <section className="weekly-goal-card">

          <div className="weekly-goal-header">

            <div>

              <h3>
                Weekly Study Goal
              </h3>

              <p>
                Set a target for how many hours
                you want to study each week.
              </p>

            </div>


            <span className="weekly-goal-premium-label">
              ✨ Premium
            </span>

          </div>


          <div className="weekly-goal-form">

            <div className="weekly-goal-input-wrapper">

              <input
                type="number"
                min="1"
                max="100"
                value={weeklyGoal}
                onChange={(e) =>
                  setWeeklyGoal(
                    e.target.value
                  )
                }
              />

              <span>
                hours / week
              </span>

            </div>


            <button
              type="button"
              className="primary-btn weekly-goal-save-btn"
              onClick={handleSave}
              disabled={saving}
            >

              {saving
                ? "Saving..."
                : currentWeeklyGoal > 0
                  ? "Update Goal"
                  : "Set Weekly Goal"
              }

            </button>

          </div>

        </section>

      </PremiumGate>


      <PremiumPoster
        isOpen={isPremiumPosterOpen}
        onClose={() =>
          setIsPremiumPosterOpen(false)
        }
      />

    </>
  );
}


export default WeeklyGoalCard;