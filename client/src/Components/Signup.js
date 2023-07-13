import React, {useState} from 'react'
import { NavLink , useNavigate} from 'react-router-dom'
import signup_image from '../images/signup_image.svg'

const Signup = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name:"", email:"", phone:"", password:"", cpassword:""
  });

  const handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setUser({...user, [name]: value});
  }

  const PostData = async (e) => {
    e.preventDefault();
    // using async await
    const res = await fetch("/api/signup", {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify(user)
    })
    
    const data = await res.json();
    if(data.status === 422 || !data) {
      console.log("Invalid Registration");
    } else {
      console.log("Registration Successfull");
      navigate("/signin");
    }

  }

  return (
    <>
        <div className='page'>
          <div className="box signup-box">
            <div className='left-box'>
              <div className="container">
                <h1 className='heading'>Sign Up</h1>
                <form method='POST' >
                  <input className='signup-input' type='text' name='name' placeholder='Enter your name' value={user.name} onChange={handleInput} autoComplete='off'/>
                  <input className='signup-input' type='email' name='email' placeholder='Enter your email' value={user.email} onChange={handleInput} autoComplete='off'/>
                  <input className='signup-input' type='text' name='phone' placeholder='Enter your phone number' value={user.phone} onChange={handleInput} autoComplete='off'/>
                  <input className='signup-input' type='password' name='password' placeholder='Enter password' value={user.password} onChange={handleInput} autoComplete='off'/>
                  <input className='signup-input' type='password' name='cpassword' placeholder='Confirm password' value={user.cpassword} onChange={handleInput} autoComplete='off'/>
                  <div className='submit'>
                    <button className='submit-btn' type='submit' onClick={PostData}>SignUp</button>
                    <br/>
                    <NavLink to="/signin"> Already Registered? </NavLink>
                  </div>
                </form>
              </div>
            </div>
            <div className='right-box'>
              <img className='signup-image' src={signup_image} alt='Person Avatar'/>
            </div>
            
          </div>
        </div>
    </>
  )
}

export default Signup