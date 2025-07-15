import { Card, Col, Row, Button } from "react-bootstrap";

export default function WorkoutList({ workouts, onDelete, onEdit, onComplete }) {
  return (
    <Row>
      {workouts.map((workout) => (
        <Col key={workout._id} md={4} className="mb-4">
          <Card border={workout.isCompleted ? "success" : "secondary"}>
            <Card.Body>
              <Card.Title>{workout.name}</Card.Title>
              <Card.Text>
                Duration: {workout.duration} <br />
                Status: {workout.isCompleted ? "✅ Completed" : "⏳ Pending"}
              </Card.Text>
              <div className="d-flex flex-wrap gap-2">
				<Button
				  variant="success"
				  onClick={() => onComplete(workout._id)}
				  disabled={workout.isCompleted}
				>
				  Complete
				</Button>
                <Button
                  variant="primary"
                  onClick={() => onEdit(workout)}
                >
                  Edit
                </Button>
                <Button variant="danger" onClick={() => onDelete(workout._id)}>
                  Delete
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
