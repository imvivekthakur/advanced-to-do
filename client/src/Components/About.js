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
            <div className="container">
              <div className='row profile-update-img'>
                <div className="col-3">
                  <img src={userAvatar} alt="User" className="profile-image"/>
                </div>
                <div className='col profile-img-text'>
                  Update your profile image
                  <button className='btn btn-default'>Update</button>
                </div>
              </div>
              <div className='row'>
                <div className="col">Change Profile Info</div>
              </div>
              <div className='row'>
                <div className="col-sm">
                  <p className='profile-text'>Full Name</p>
                  <input className="profile-input" type="text" placeholder='Enter your Name' value={userData.name}/>
                </div>
                <div className="col-sm">
                  <p className='profile-text'>Email</p>
                  <input className="profile-input" type="text" placeholder='Enter your email' value={userData.email}/>
                </div>
              </div>
              <div className='row'>
                <div className="col-lg">
                  <p className='profile-text'>Address</p>
                  <input className="profile-input" type="text" placeholder='Enter your Address' value={userData.address}/>
                </div>
              </div>
              <div className='row'>
                <div className="col-sm">
                  <p className='profile-text'>City</p>
                  <input className="profile-input" type="text" placeholder='Enter your City' value={userData.city}/>
                </div>
                <div className="col-sm">
                  <p className='profile-text'>State</p>
                  <input className="profile-input" type="text" placeholder='Enter your State' value={userData.state}/>
                </div>
              </div>
              <div className='row'>
                <div className="col-sm">
                  <p className='profile-text'>Mobile</p>
                  <input className="profile-input" type="text" placeholder='Enter your Mobile' value={userData.city}/>
                </div>
                <div className="col-sm">
                  <p className='profile-text'>Country</p>
                  <input className="profile-input" type="text" placeholder='Enter your Country' value={userData.country}/>
                </div>
              </div>
              <div className='row'>
                <div className="col update-btn">
                  <button className='btn btn-default'>Update</button>
                </div>
              </div>
            </div>
              {/* <div className='left-box about-left'>
                <img src={userAvatar} alt="User" className="signup-image"/>
              </div>
              <div className='right-box about-right'>
                <div className="container">
                  <h1 className='heading'>{userData.name} </h1>

                
                  <div className="user-details container">
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
                        Phone
                      </div>
                      <div className='col'>
                        {userData.phone}
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col'>
                        
                      </div>
                      <div className='col'>
                        {userData.email}
                      </div>
                    </div>
                    <div>Email : {userData.email}</div>
                    <div>Phone : {userData.phone} </div>
                    <div>Work  : {userData.work}</div>
                  </div>
                </div>
              </div> */}
            
          </form>
        </div>
    </>
  )
}

export default About