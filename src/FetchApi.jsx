import React, {useEffect, useState} from 'react';
import './App.css';

export default function FetchApi(){
    const url = "https://66435c786c6a65658706c2f8.mockapi.io/todo/todoListData";
  const [text, setText] = useState('');
  const [taskdata, setTaskData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(()=>{
    setLoading(true);
    fetch(url).then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data);
      setTaskData(data);
      setLoading(false);
    });
  }, []);

  const handleAddTask = (event) =>{
    event.preventDefault();
    if (!text.trim()) { 
      setError("Task cannot be empty");
      return;
    }
    fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({task : text})
        
    }).then(response => response.json())
    .then(data =>{ 
      setTaskData([...taskdata, data]);
      setText("");
      setLoading(false);
      setError(null);
      console.log(data)})
      .catch(error => {
        alert("Error Adding Data", error);
        console.log(error)
      })
    console.log(text);
  };

  const onEditTask = (id, task) => {
    setEditingTaskId(id);
    setText(task);
  };

  const handleSaveEditTask = (event) => {
    event.preventDefault();
    setLoading(true);
    fetch(`${url}/${editingTaskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: text })
    })
      .then(response => response.json())
      .then(updatedTask => {
        const updatedTasks = taskdata.map(task => task.id === updatedTask.id ? updatedTask : task);
        setTaskData(updatedTasks);
        setEditingTaskId(null);
        setText('');
        setLoading(false);
      })
      .catch(error => {
        alert("Error Updating Data", error);
        console.log(error);
        setLoading(false);
      });
  };


  const onDeleteTask = (id) =>{
    fetch(`${url}/${id}`,{
      method : 'DELETE',
    })
    .then(response => response.json())
    .then(() => {
      const deletedtask = taskdata.filter(task => task.id !== id);
      setTaskData(deletedtask);
      setLoading(false);
    })
    .catch(error =>{
      console.log(error);
      alert("Error Deleting Data", error);
      setLoading(false)
  })
  }
    return(
<div className="container">
      <h1>To-Do List</h1>
      <form className="task-form" onSubmit={editingTaskId ? handleSaveEditTask : handleAddTask}>
      <input  className="task-input" type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder='Enter Task...'/>
      <button className="task-button" type="submit">{editingTaskId ? 'Save' : 'Add'}</button>
      </form>
      {error && <p className="error-message">{error}</p>}
      <div>
        {loading ? (
          <p className="loading-text">Loading....</p>
        ) : (taskdata.map((task) =>(
          <div className="task-list-item" key={task.id}>
          <p className="task-text">{task.task}</p>
           <div className="task-buttons">
            <button className="task-edit-button" onClick={() => onEditTask(task.id, task.task)}>Edit</button>
            <button className="task-delete-button" onClick={() => onDeleteTask(task.id)}>Delete</button>
          </div>
         </div>)
        ))}
      </div>
    </div>
    )
}