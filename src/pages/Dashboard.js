import { useEffect, useState, useContext } from "react";
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";
import UserContext from "../UserContext";

import AddWorkout from "../components/AddWorkout";
import EditWorkout from "../components/EditWorkout";
import WorkoutList from "../components/WorkoutList";

export default function Dashboard() {
  const { token } = useContext(UserContext);
  const [workouts, setWorkouts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentWorkout, setCurrentWorkout] = useState(null);

  // 🧠 Fetch workouts from API
  const fetchWorkouts = async () => {
    try {
      const res = await fetch("https://fitnessapp-api-ln8u.onrender.com/workouts/getMyWorkouts", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Expected JSON but got:", contentType);
        return;
      }

      const data = await res.json();
      console.log("Workouts API response:", data);

      if (Array.isArray(data)) {
        setWorkouts(data);
      } else if (Array.isArray(data.workouts)) {
        setWorkouts(data.workouts);
      } else {
        console.error("Unexpected response format:", data);
        setWorkouts([]);
      }
    } catch (err) {
      console.error("Error fetching workouts:", err);
      setWorkouts([]);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  // ✅ Delete handler
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This workout will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      const res = await fetch(`https://fitnessapp-api-ln8u.onrender.com/workouts/deleteWorkout/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        fetchWorkouts();
        Swal.fire("Deleted!", "Workout removed.", "success");
      }
    }
  };

  // ✅ Complete handler
  const handleComplete = async (id) => {
  console.log("Completing workout ID:", id); // for debugging

  const result = await Swal.fire({
    title: "Mark as completed?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes",
  });

  if (result.isConfirmed) {
    const res = await fetch(`https://fitnessapp-api-ln8u.onrender.com/workouts/completeWorkoutStatus/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      // Optimistically update workout state without re-fetching
      setWorkouts((prev) =>
        prev.map((w) =>
          w._id === id ? { ...w, isCompleted: true } : w
        )
      );

      Swal.fire("Done!", "Workout marked as complete.", "success");
    } else {
      const err = await res.json();
      Swal.fire("Error", err.message || "Failed to complete workout", "error");
    }
  }
};


  return (
    <>
      <h2 className="mb-4">My Workouts</h2>
      <Button onClick={() => setShowAddModal(true)} className="mb-4">Add Workout</Button>

      {/* 💪 List of workouts */}
      <WorkoutList
        workouts={workouts}
        onDelete={handleDelete}
        onComplete={handleComplete}
        onEdit={(workout) => {
          setCurrentWorkout(workout);
          setShowEditModal(true);
        }}
      />

      {/* ➕ Add Modal */}
      <AddWorkout
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
        onAdd={fetchWorkouts}
        token={token}
      />

      {/* ✏️ Edit Modal */}
      <EditWorkout
        show={showEditModal}
        handleClose={() => setShowEditModal(false)}
        workout={currentWorkout}
        onSave={fetchWorkouts}
        token={token}
      />
    </>
  );
}
