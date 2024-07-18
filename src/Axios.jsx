import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Modal from './Modal';

export default function Axios(){
  const url = "https://66435c786c6a65658706c2f8.mockapi.io/todo/todoListData";
  const [text, setText] = useState('');
  const [taskdata, setTaskData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [query, setQuery] = useState("");
  const [sortOrder, setSortOrder] = useState('asc');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [modalTask, setModalTask] = useState(null);

  useEffect(()=>{
    setLoading(true);
    axios.get(url)
    .then((response) => {
      setTaskData(response.data);
      setLoading(false);
    })
    .catch((error) => {
        toast.error('Error Fetching Tasks!');
        console.log(error);
        setLoading(false);
      });
  }, []);

  const handleTaskClick = (task) => {
    setModalTask(task);
  };

  const handleCloseModal = () => {
    setModalTask(null);
  };

  const handleSort = () => {
    const sortedData = [...taskdata].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.task.localeCompare(b.task);
      } else {
        return b.task.localeCompare(a.task);
      }
    });
    setTaskData(sortedData);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };
  const filteredData = taskdata.filter((task) => {
    return query && task.task && task.task.toLowerCase().includes(query.toLowerCase());
  });

  const displayData = query ? filteredData : taskdata;

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleAddTask = (event) =>{
    event.preventDefault();
    if (!text.trim()) { 
        toast.warning('Task cannot be Empty!');
      return;
    }
    setLoading(true);
    axios.post(url, {task : text})
    .then((response) =>{ 
      setTaskData([...taskdata, response.data]);
      setText("");
      setLoading(false);
     
      toast.success('Task Added Successfully!');
    //   console.log(data)
    })
      .catch(error => {
        toast.error('Error Adding Task!');
        alert("Error Adding Data", error);
        console.log(error);  
      })
    
  };

  const onEditTask = (id, newText) => {
    if (!newText.trim()) {
      toast.warning('Task cannot be Empty!');
      
      return;
    }
    setLoading(true);
    axios.put(`${url}/${id}`, { task: newText })
      .then((response) => {
        const updatedTaskData = taskdata.map(task => 
          task.id === id ? response.data : task
        );
        setTaskData(updatedTaskData);
        setText('');
        setEditingTaskId(null);
        setLoading(false);
        
        console.log(response.data);
        toast.success('Task Updated Successfully!');
      })
      .catch((error) => {
        toast.error('Error Updating Task!');
        alert("Error Updating Data", error);
        console.log(error);
        setLoading(false);
      });
  };

  const onDeleteTask = (id) =>{
   
    setLoading(true);
    axios.delete(`${url}/${id}`)
    .then(() => {
      const deletedtask = taskdata.filter(task => task.id !== id);
      setTaskData(deletedtask);
      toast.success('Task Deleted Successfully!');
      setLoading(false);
      setModalTask(null);
    })
    .catch(error =>{
      console.log(error);
      toast.error('Error Deleting Task!');
      alert("Error Deleting Data", error);
      setLoading(false)
  })
}
  
    return(
        <>
        <ToastContainer position="top-center"/>
        <div className={isDarkMode ? 'dark-mode' : 'light-mode'}>  
            <div className='header'>
                <button className="sort-button" onClick={handleSort}>
                    Sort {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                </button>

                <div className="input-wrapper"> 
                    <FaSearch id="search-icon"/>
                    <input type="text" placeholder='Search....' value={query} onChange={(e) => setQuery(e.target.value)}/>
                </div>
            
                <label className="theme-toggle-wrapper">
                    <input type="checkbox" checked={isDarkMode} onChange={toggleTheme} />
                    <span className="theme-toggle"></span>
                </label>
            </div>
            <div className="container">
                <h1>To-Do List</h1>
                <form className="task-form" onSubmit={editingTaskId ? (e) => { e.preventDefault(); onEditTask(editingTaskId, text); } : handleAddTask}>
                    <input  className="task-input" type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder='Enter Task...'/>
                    <button className="task-button" type="submit">{editingTaskId ? 'Save' : 'Add'}</button>
                </form>
            <div>
                {loading ? (
                    <p className="loading-text">Loading....</p>
                ) : 
                (displayData.map((task) =>(
                    <div className="task-list-item" key={task.id}onClick={() => handleTaskClick(task)}>
                    <p className="task-text">{task.task}</p>
                    <div className="task-buttons">
                    <button className="task-edit-button" onClick={(e) =>{ e.stopPropagation(); setText(task.task); setEditingTaskId(task.id); }}>Edit</button>
                    <button className="task-delete-button" onClick={() =>  handleTaskClick(task)}>Delete</button>
                    </div>
                    </div>) 
                ))}
                </div>
            </div>
        </div>
        <Modal isOpen={!!modalTask} task={modalTask} onClose={handleCloseModal} onDelete={onDeleteTask} />
    </>
    )
}