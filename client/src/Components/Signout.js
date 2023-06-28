import React, {useEffect} from 'react'
import { useNavigate } from 'react-router-dom';

const Signout = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const callSignoutPage = async () => {
      try {
        const res = await fetch("/signout", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          }, 
          credentials: "include"
        });
        const data = await res.json();
        if(res.status !== 200) {
          const error = new Error(res.error);
          throw error;
        } 
        console.log(data);
        navigate("/signin");  
      } catch (error) {
        console.log(error);
        navigate("/signin");
      }
    };
    callSignoutPage();
  }, [navigate]);
  return (
    <>
      <div>Signout succesfully</div>
    </>
  )
}

export default Signout