import React, { useState } from "react";
import Form from "@rjsf/bootstrap-4";
import schema from "./lfrb-saq.json";
import lastYearData from "./last-year-data.json";
import CustomFieldTemplate from "./CustomFieldTemplate";
import "bootstrap/dist/css/bootstrap.min.css";

const users = ["User A", "User B", "User C"];

function App() {
  const [selectedUser, setSelectedUser] = useState("All");
  const [assignments, setAssignments] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);

  const onSubmit = ({ formData }) => {
    console.log("Data submitted: ", formData);
    console.log("Assignments: ", assignments);
    alert("Form data submitted to the console.");
  };

  const handleUserChange = (event) => {
    setSelectedUser(event.target.value);
  };

  const handleAssignmentChange = (id, user) => {
    setAssignments({ ...assignments, [id]: user });
  };

  const toggleAdminMode = () => {
    setIsAdmin(!isAdmin);
  };

  const filterSchema = (schema, user, assignments) => {
    if (user === "All") {
      return schema;
    }

    const newSchema = JSON.parse(JSON.stringify(schema));

    // Create a new properties object to avoid issues with deleting from the original
    const newProperties = {};

    for (const key in newSchema.properties.payload.properties) {
      // Check if the key exists in assignments and if it matches the selected user
      if (assignments.hasOwnProperty(key) && assignments[key] === user) {
        newProperties[key] = newSchema.properties.payload.properties[key];
      }
    }

    newSchema.properties.payload.properties = newProperties;

    return newSchema;
  };

  const filteredSchema = filterSchema(schema, selectedUser, assignments);

  const formContext = {
    lastYearData: lastYearData,
    users: users,
    assignments: assignments,
    onAssignmentChange: handleAssignmentChange,
    isAdmin: isAdmin,
  };

  return (
    <div className="container mt-5">
      <div className="form-group">
        <label htmlFor="user-filter">Filter by User</label>
        <select
          id="user-filter"
          className="form-control"
          onChange={handleUserChange}
          value={selectedUser}
        >
          <option>All</option>
          {users.map((user) => (
            <option key={user}>{user}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="admin-mode"
            checked={isAdmin}
            onChange={toggleAdminMode}
          />
          <label className="form-check-label" htmlFor="admin-mode">
            Admin Mode
          </label>
        </div>
      </div>
      <Form
        schema={filteredSchema}
        onSubmit={onSubmit}
        FieldTemplate={CustomFieldTemplate}
        formContext={formContext}
      />
    </div>
  );
}

export default App;
