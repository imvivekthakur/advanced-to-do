import React, {useState, useEffect} from 'react'
import Todo from './Todo';

const Home = ({currentCategory}) => {
  const [userName, setUserName] = useState('');
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
        setUserName(data.name);

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
        <div className='home-page'>
          <div className='home-box'>
            <h4 className='home-text'>Welcome, <span className='username'>{userName}</span> </h4>
            <Todo currentCategory={currentCategory}/>
          </div>
        </div>
        
    </>
  )
}

export default Home