import React, { useState, useEffect } from "react";
import axios from "axios";
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
} from "reactstrap";

const TaskTable = () => {
  const [tasks, setTasks] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const taskResponse = await axios.get(`http://localhost:3000/tasks`);
        setTasks(taskResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
            <Card>
              {/*className="card-plain"*/}
              <CardHeader>
                <CardTitle tag="h4">Tasks</CardTitle>
              </CardHeader>
              <CardBody>
                <Table className="tablesorter" responsive>
                  <thead className="text-primary">
                    <tr>
                      <th>Code</th>
                      <th>Title</th>
                      <th>Task Group</th>
                      <th>Budget Hrs</th>
                      <th>Budget Qty</th>
                      <th>Total Labour Cost</th>
                      <th>Unit</th>
                      <th className="text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks ? (
                      tasks.map((task) => (
                        <tr key={task.id}>
                          <td>{task.code}</td>
                          <td>{task.title}</td>
                          <td>{task.taskGroup}</td>
                          <td>{task.totalBudgetHrs}</td>
                          <td>{task.totalBudgetQty}</td>
                          <td>{Math.round(task.totalLabourCost)}</td>
                          <td>{task.unit}</td>
                          <td className="text-center">{task.taskStatus}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8">Loading tasks...</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
          {/* ... Otros componentes */}
        </Row>
      </div>
    </>
  );
};

export default TaskTable;
