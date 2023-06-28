import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'

const Contact = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({name:"", email:"", message:""});

  useEffect(() => {
    const getUserData = async () => {
      try {
        const res = await fetch("/getdata", {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });
        const data = await res.json();
        setUserData({...userData, name: data.name, email: data.email, message: data.message });

        if(res.status !== 200) {
          const error = new Error(res.error);
          throw error;
        } 
      } catch (error) {
        console.log(error);
        navigate("/signin");
      }
    }
    getUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputs = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setUserData({...userData, [name]:value});
  }

  const handleSubmit = async (e) =>  {
    e.preventDefault();

    const res = await fetch("/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({userData})
    });

    const data = await res.json();

    if(!data) {
      console.log("message not sent");
    } else {
      console.log("message send properly!!");
      setUserData({...userData, message:""});
    }
  }
  
  return (
    <>
      <div className='page'>
          <form method="POST" className='contact-page box'>
              <h1 className='contact-heading'>Contact Me</h1>
              <div className="data">
                  <input className='signup-input contact-input' type='text' name='name' onChange={handleInputs} value={userData.name} placeholder='Enter your name' autoComplete='off'/>
                  <input className='signup-input contact-input' type='email' name='email' onChange={handleInputs} value={userData.email} placeholder='Enter your email' autoComplete='off'/>
              </div>
              <p>What do you wanna say?</p>
              <textarea name="message" onChange={handleInputs} value={userData.message} className='message' placeholder='Message'></textarea>
              <div className='submit'>
                  <button className='submit-btn' type='submit' onClick={handleSubmit}>Send Message</button>
              </div>
          </form>
      </div>
    </>
  )
}

export default Contact