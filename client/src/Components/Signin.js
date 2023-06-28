import React, {useState} from 'react'
import signin_image from '../images/signup_image.svg'
import { NavLink , useNavigate } from 'react-router-dom'


const Signin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async (e) => {
    e.preventDefault();

    const res = await fetch("/signin", {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({email, password})
    })

    // console.log("response ", res);

    const data = await res.json();
    // console.log("hi", data, data.status);
    if(data.status === 400 || data.status === 422 || !data) {
      console.log("Invalid Credentials");
    } else {
      console.log("Login Successful");
      navigate("/");
    }
  }
  return (
    <>
        <div className='page'>
          <div className="box">
            <div className='left-box'>
              <h1 className='heading'>Sign In</h1>
              <form method='POST' className="input-form">
                <input className='signup-input' type='email' name='email' placeholder='Enter your email' value={email} onChange={(e)=>setEmail(e.target.value)} autoComplete='off'/>
                <input className='signup-input' type='password' name='password' placeholder='Enter password' value={password} onChange={(e)=>setPassword(e.target.value)} autoComplete='off'/>
                <div className='submit'>
                    <button className='submit-btn' type='submit' onClick={loginUser}>SignIn</button>
                    <br/>
                    <NavLink to="/signup"> New Here? Register!! </NavLink>
                </div>
              </form>
            </div>
            <div className='right-box'>
              <img className='signup-image' src={signin_image} alt='Person Avatar'/>
            </div>
            
          </div>
        </div>
    </>
  )
}

export default Signin