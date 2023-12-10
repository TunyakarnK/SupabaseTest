import React from 'react'
import "../../App.css"
import { useEffect, useState } from "react";
import { supabase } from '../../supabaseClient.js';
import Navbar from '../../components/Navbar/Navbar.jsx'
import { useNavigate } from "react-router-dom";

function EditMeeting() {
    const [user, setUser] = useState({});
    const navigate = useNavigate();

    useEffect(() =>{
      async function getUserData() {
        await supabase.auth.getUser().then((value) =>{
          // value.data.user
          if(value.data?.user){
            console.log(value.data.user)
            setUser(value.data.user)
          }
        })
      }
      getUserData();
    }, [])
  return (
    <div className='App'>
        {Object.keys(user).length !== 0 ?
          <>
        <header>
        <Navbar props={user}/>
        </header>
       <h1>EditMeeting</h1>
       <botton onClick={() => navigate("/MyMeeting")}> Edit Meeting</botton>
       </>
       :
       <></>
       }
       
      </div>
    
  )
}

export default EditMeeting