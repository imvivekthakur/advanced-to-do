import React, {useState, useEffect, useRef} from 'react'
import trash from '../images/trash-icon.svg'
import update from '../images/update_icon.svg'

const Todo = ( {currentCategory} ) => {
    const activeButtonRef = useRef(null);
    const [input, setInput] = useState('');
    const [newTask, setTask] = useState([]);
    const [currState, setCurrState] = useState("all");

    useEffect(() => {
        // Set second button as default active button
        activeButtonRef.current = document.querySelectorAll('.state-btn')[0];
        activeButtonRef.current.classList.add("active-btn");
    }, []);

    useEffect(() => {
      const getTodos = async () => {
        try {
            const res = await fetch("/api/gettodo", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            // console.log("response from gettodo", res);
            const jsonResponse = await res.json();

            // console.log("converted to json", jsonResponse);
            let allTodo = jsonResponse.todos;
            allTodo.reverse();

            // console.log("active todo", activeTodo);
            // console.log("completed todo", completedTodo);
            // console.log("array ", allTodo);
            setTask([...allTodo]);
        } catch (error) {
            console.log("error occured", error);
        }
      }
      getTodos();
    }, [])

    const handleInput = (event) => {
        setInput(event.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log("current active category", currentCategory);
        // string jayegi server pe = todo string
        const res = await fetch("/api/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({input, currentCategory})
        });
        // console.log("response", res);        
        // save to db
        // we have to todolist from the backend 
        const jsonResponse = await res.json();
        // console.log("response from handle submit in todo", jsonResponse);
        // show the todo list
        let n = jsonResponse.todos.length;
        const {todo, _id, state, category} = jsonResponse.todos[n - 1];
        setTask([{todo, _id, state, category},...newTask]);
        setInput('');
        // console.log("new Task array", newTask);
    }
    const handleUpdate = async (id) => {
        const res = await fetch("/api/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({id})
        })

        const jsonResponse = await res.json();
        console.log(jsonResponse);
        setInput(jsonResponse.todoData);
        let array = jsonResponse.todos;
        setTask([...array]);
    }
    const handleDelete = async (id) => {
        const res = await fetch("/api/delete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({id})
        })

        const jsonResponse = await res.json();
        let array = jsonResponse.todos;
        array.reverse();
        setTask([...array]);
    }

    const handleKeyDown = (event) => {
        if(event.key === 'Enter') {
            handleSubmit(event);
        }
    }

    const changeState = async (event, state) => {
        setCurrState(state);
        if (activeButtonRef.current) {
            activeButtonRef.current.classList.remove("active-btn");
        }
        // Add "active" class to clicked button
        event.target.classList.add("active-btn");
        // Update reference to active button element
        activeButtonRef.current = event.target;
    }

    const strikethrough = async (e, id) => {
        // console.log("taskObject id", id);
        e.currentTarget.classList.toggle('strikethrough');
        const res = await fetch("/api/change", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({id})
        })

        const jsonResponse = await res.json();
        let array = jsonResponse.todos;
        array.reverse();
        setTask([...array]);
    }

    return (
        <>
            <div className="todo-container">
                <form method="POST" className="todo-box">
                    <input className='todo-input' type='text' name='todo-input' placeholder='Enter todo' value={input} onChange={handleInput} onKeyDown={(e) => handleKeyDown(e)} autoComplete='off'/>
                    <button className="btn todo-submit" onClick={(e) => handleSubmit(e)}> Add </button>
                </form>
                <div className='row'>
                    <button className="btn submit-btn state-btn" onClick={(e) => changeState(e, "all")}> All </button>
                    <button className="btn submit-btn state-btn" onClick={(e) => changeState(e, "active")}> Active </button>
                    <button className="btn submit-btn state-btn" onClick={(e) => changeState(e, "completed")}> Completed </button>
                </div>
                

                <ul>
                {   // if else
                    
                    (currState === "active") 
                    ?
                    newTask.filter((taskObj) => taskObj.state === "active" && taskObj.category === currentCategory).map((taskObj) => (
                        <div className='todo-list' key={taskObj._id}>
                            <div className='todo-justified'>
                                <li>{taskObj.todo}</li>
                                <div className="btns">
                                    <button className="update" ><img className='update-icon' src={update} alt="update todo"/></button>
                                    <button className="delete" onClick={() => handleDelete(taskObj._id)}><img className='trash-icon' src={trash} alt="trash-icon"/></button>
                                </div>
                            </div>
                        </div>
                    ))
                    : 
                    (currState === "completed") 
                    ? 
                    newTask.filter((taskObj) => taskObj.state === "completed"  && taskObj.category === currentCategory).map((taskObj) => (
                        <div className='todo-list' key={taskObj._id}>
                            <div className='todo-justified'>
                                <li>{taskObj.todo}</li>
                                <div className="btns">
                                    <button className="update" ><img className='update-icon' src={update} alt="update todo"/></button>
                                    <button className="delete" onClick={() => handleDelete(taskObj._id)}><img className='trash-icon' src={trash} alt="trash-icon"/></button>
                                </div>
                            </div>
                        </div>
                    ))
                    :
                    newTask.map((taskObj) => {
                        // console.log("taskObj", taskObj);
                        if(taskObj.state === "active" && taskObj.category === currentCategory) {
                            return (
                                <div className='todo-list' key={taskObj._id}>
                                    <div className='todo-justified'>
                                        <li onClick={(e) => strikethrough(e, taskObj._id)}>{taskObj.todo}</li>
                                        <div className="btns">
                                            <button className="update" onClick={() => handleUpdate(taskObj._id)}><img className='update-icon' src={update} alt="update todo"/></button>
                                            <button className="delete" onClick={() => handleDelete(taskObj._id)}><img className='trash-icon' src={trash} alt="trash-icon"/></button>
                                        </div>
                                    </div>
                                </div>
                            );
                        } else if(taskObj.category === currentCategory) {
                            return (
                                <div className='todo-list' key={taskObj._id}>
                                    <div className='todo-justified'>
                                        <li className='strikethrough' onClick={(e) => strikethrough(e, taskObj._id)}>{taskObj.todo}</li>
                                        <div className="btns">
                                            <button className="update" onClick={() => handleUpdate(taskObj._id)}><img className='update-icon' src={update} alt="update todo"/></button>
                                            <button className="delete" onClick={() => handleDelete(taskObj._id)}><img className='trash-icon' src={trash} alt="trash-icon"/></button>
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                        
                    })
                }
                </ul>
            </div>
        </>
    )
}
export default Todo
