import { Modal, Button, Form } from "react-bootstrap";
import { useState, useEffect } from "react";

export default function EditWorkout({ show, handleClose, workout, token, onSave }) {
  const [editedWorkout, setEditedWorkout] = useState({ name: "", duration: "" });

  useEffect(() => {
    if (workout) {
      setEditedWorkout({ name: workout.name, duration: workout.duration });
    }
  }, [workout]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(
      `https://fitnessapp-api-ln8u.onrender.com/workouts/updateWorkout/${workout._id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editedWorkout),
      }
    );

    const data = await res.json();

    if (res.ok) {
      onSave(); // refresh list
      handleClose();
    } else {
      alert(data.message || "Update failed");
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Workout</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Workout Name</Form.Label>
            <Form.Control
              type="text"
              value={editedWorkout.name}
              onChange={(e) => setEditedWorkout({ ...editedWorkout, name: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>Duration</Form.Label>
            <Form.Control
              type="text"
              value={editedWorkout.duration}
              onChange={(e) => setEditedWorkout({ ...editedWorkout, duration: e.target.value })}
              required
            />
          </Form.Group>
          <div className="mt-4 d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="primary">Save Changes</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
