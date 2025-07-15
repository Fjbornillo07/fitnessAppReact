import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export default function AddWorkout({ show, handleClose, onAdd, token }) {
  const [workout, setWorkout] = useState({ name: "", duration: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("https://fitnessapp-api-ln8u.onrender.com/workouts/addWorkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(workout),
    });

    const data = await res.json();

    if (res.ok) {
      onAdd(); // callback to refresh workout list
      setWorkout({ name: "", duration: "" });
      handleClose();
    } else {
      alert(data.message || "Failed to add workout");
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Workout</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Workout Name</Form.Label>
            <Form.Control
              type="text"
              required
              value={workout.name}
              onChange={(e) => setWorkout({ ...workout, name: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>Duration</Form.Label>
            <Form.Control
              type="text"
              required
              value={workout.duration}
              onChange={(e) => setWorkout({ ...workout, duration: e.target.value })}
            />
          </Form.Group>
          <div className="mt-4 d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Add
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
