import React, {useState, useEffect} from 'react'
import { NavLink } from 'react-router-dom'
import logo from '../images/todo_app_icon.svg'


const Navbar = ({onChildCategory}) => {
  const [input, setInput] = useState('');
  const [sidebarActive, setSidebarActive] = useState(false);
  const [newCategory, setCategory] = useState([]);

  const [activeItem, setActiveItem] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);

  const handleClick = (item) => {
    console.log(activeItem);
    setActiveItem(item);
    setActiveCategory(null);
  };


  useEffect(() => {
    const getCategories = async () => {
      try {
          const res = await fetch("/api/getcategories", {
              method: "GET",
              headers: {
                  "Content-Type": "application/json"
              }
          });

          // console.log("response from gettodo", res);
          const jsonResponse = await res.json();

          // console.log("converted to json", jsonResponse);
          var allCategories = jsonResponse;
          allCategories.reverse();

          // console.log("active todo", activeTodo);
          // console.log("completed todo", completedTodo);
          // console.log("array ", allTodo);
          setCategory([...allCategories]);
      } catch (error) {
          console.log("error occured", error);
      }
    }
    getCategories();
  },[]);

  useEffect(() => {
    const initialize = async () => {
      const data = "temp";
      try {
          const res = await fetch("/api/initializeuser", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              body : JSON.stringify({data})
          });

          // console.log("response from gettodo", res);
          const jsonResponse = await res.json();

          // console.log("converted to json", jsonResponse);
          console.log(jsonResponse);
      } catch (error) {
          console.log("error occured", error);
      }
    }
    initialize();
  },[]);

  const handleInput = (event) => {
    let data = event.target.value;
    setInput(data);
    onChildCategory(data);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/addcategory", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({input})
    });
    console.log("response", res);        
    // // save to db
    // // we have to todolist from the backend 
    const jsonResponse = await res.json();
    console.log("json response", jsonResponse);
    // console.log("collections added  ");
    let n = jsonResponse.categories.length;
    const { category, _id } = jsonResponse.categories[n - 1];
    // console.log("category ", category);
    setCategory([{category:category, key:_id}, ...newCategory]);
    console.log("new categories  ", newCategory);
    setInput('');
  }
  const handleKeyDown = (event) => {
    if(event.key === 'Enter') {
        handleSubmit(event);
    }
  }
  const handleSidebarToggle = () => {
      setSidebarActive(!sidebarActive);
  };

  const handleCategoryClick = (category) => {
    setActiveItem(null);
    setActiveCategory(category);
    onChildCategory(category);
  }

  useEffect(() => {
    const userHomePage = async () => {
      try {
        const res = await fetch("/api/getdata", {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });
        const data = await res.json();
        // setUserName(data.name);

        if(res.status !== 200) {
          const error = new Error(res.error);
          throw error;
        } 
      } catch (error) {
        console.log(error);
      }
    }
    userHomePage();
  }, []);

  return (
    <>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <img src={logo} alt="Logo"/>
            <NavLink className="navbar-brand" to="#">Todo</NavLink>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/signin">SignIn</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/signup">SignUp</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/signout">SignOut</NavLink>
                    </li>
                </ul>
            </div>
        </nav>
        <div className="wrapper">
              <div className='flex'>
              <nav id="sidebar" className={sidebarActive ? 'active' : ''}>
                  {/* <div className="sidebar-header">
                      <h3>{userName}</h3>
                  </div> */}
                  <ul className="list-unstyled components">
                        <li className="nav-item">
                            <NavLink className={`nav-link ${activeItem === 'Home' ? 'active' : ''}`} onClick={() => handleClick('Home')} to="/">Home</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className={`nav-link ${activeItem === 'About' ? 'active' : ''}`} onClick={() => handleClick('About')} to="/about">About</NavLink>
                        </li>
                        
                        <li className="active-item">
                            <a href="#homeSubmenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">Categories</a>
                            <input className='category-input' type='text' name='category-input' placeholder='Add Category' value={input} onChange={handleInput} onKeyDown={(e) => handleKeyDown(e)}autoComplete='off'/>
                            <ul className="collapse list-unstyled" id="homeSubmenu">                              
                              {
                                newCategory.map(catObject => (
                                  <li key={catObject._id}>
                                      <NavLink className={`nav-link ${ activeCategory === catObject.category ? 'active-category' : ''}`}to="/"onClick={() => handleCategoryClick(catObject.category)}>{catObject.category} </NavLink>
                                      {/* <img className='trash-icon' src={trash} alt="trash-icon"/> */}
                                  </li>
                                ))
                              }
                                
                            </ul>
                        </li>

                        <li className="nav-item">
                            <NavLink className={`nav-link ${activeItem === 'Contact' ? 'active' : ''}`} onClick={() => handleClick('Contact')} to="/contact">ContactMe</NavLink>
                        </li>
                      {/* <li>
                          <a href="#pageSubmenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">Pages</a>
                          <ul className="collapse list-unstyled" id="pageSubmenu">
                              <li>
                                  <a href="#">Page 1</a>
                              </li>
                              
                          </ul>
                      </li> */}

                  </ul>
              </nav>
              <div id="content">
                  <div className="container-fluid">
                      <button type="button" id="sidebarCollapse" className="btn btn-info" onClick={handleSidebarToggle}>
                          <i className="fa fa-align-left"></i>
                      </button>
                  </div>
              </div>
              </div>
          </div>
        
    </>
  )
}

export default Navbar