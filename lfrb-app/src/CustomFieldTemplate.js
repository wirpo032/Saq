import React from "react";

const CustomFieldTemplate = (props) => {
  const { id, classNames, label, help, required, description, errors, children, formContext } = props;
  const { lastYearData, users, assignments, onAssignmentChange, isAdmin } = formContext;

  const getNestedData = (data, path) => {
    if (!data) {
      return null;
    }
    // The root object has no id, so we can't search for it.
    if (!path) {
        return null;
    }
    const pathArray = path.split("_");
    let current = data;
    for (let i = 0; i < pathArray.length; i++) {
      if (current[pathArray[i]] === undefined) {
        return null;
      }
      current = current[pathArray[i]];
    }
    return current;
  };

  const lastYearValue = getNestedData(lastYearData, id);

  return (
    <div className={classNames}>
      <div className="row">
        <div className="col-md-4">
          <label htmlFor={id}>
            {label}
            {required ? "*" : null}
          </label>
          {description}
          {children}
          {errors}
          {help}
        </div>
        <div className="col-md-4">
          <label>Last Year's Data</label>
          <p className="form-control-static">{lastYearValue || "N/A"}</p>
        </div>
        <div className="col-md-4">
          <label>Assigned User</label>
          <select
            className="form-control"
            value={assignments[id] || ""}
            onChange={(e) => onAssignmentChange(id, e.target.value)}
            disabled={!isAdmin}
          >
            <option value="">Unassigned</option>
            {users.map((user) => (
              <option key={user} value={user}>
                {user}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default CustomFieldTemplate;
