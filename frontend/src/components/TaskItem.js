import React from 'react';

function statusClass(status) {
  switch (status) {
    case 'Completed':
      return 'badge badge-completed';
    case 'In Progress':
      return 'badge badge-progress';
    default:
      return 'badge badge-pending';
  }
}

function TaskItem({ task, onEdit, onDelete }) {
  return (
    <tr>
      <td data-label="Title" className="task-title">{task.title}</td>
      <td data-label="Description" className="task-description">
        {task.description || <span className="muted">No description</span>}
      </td>
      <td data-label="Status">
        <span className={statusClass(task.status)}>{task.status}</span>
      </td>
      <td data-label="Actions" className="actions">
        <button className="btn btn-small btn-edit" onClick={() => onEdit(task)}>
          Edit
        </button>
        <button className="btn btn-small btn-delete" onClick={() => onDelete(task.id)}>
          Delete
        </button>
      </td>
    </tr>
  );
}

export default TaskItem;
