import React from 'react'
import { useEffect , useState} from 'react';
import userAvatar from '../images/user_avatar.svg';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState("");
  
  useEffect(() => {
    const callAboutPage = async () => {
      try {
        const res = await fetch("/api/about", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          }, 
          credentials: "include"
        });
        const data = await res.json();
        setUserData(data);
  
        if(res.status !== 200) {
          const error = new Error(res.error);
          throw error;
        } 
  
      } catch (error) {
        console.log(error);
        navigate("/signin");
      }
    };
    callAboutPage();
  }, [navigate]);
  
  return (
    <>
        <div className='page'>
          <form method='GET' className="box about-box">
              <div className='left-box about-left'>
                <img src={userAvatar} alt="User" className="signup-image"/>
              </div>
              <div className='right-box about-right'>
                <div className="container">
                  <h1 className='heading'>{userData.name} </h1>

                
                  <div className="user-details container">
                    {/* <div className='row'>
                      <div className='col'>
                        Email
                      </div>
                      <div className='col'>
                        {userData.email}
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col'>
                        Email
                      </div>
                      <div className='col'>
                        {userData.email}
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col'>
                        Email
                      </div>
                      <div className='col'>
                        {userData.email}
                      </div>
                    </div> */}
                    <div>Email : {userData.email}</div>
                    <div>Phone : {userData.phone} </div>
                    <div>Work  : {userData.work}</div>
                  </div>
                </div>
              </div>
            
          </form>
        </div>
    </>
  )
}

export default About