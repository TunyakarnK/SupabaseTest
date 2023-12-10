import React from 'react';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from '../../supabaseClient.js';
import Navbar from '../../components/Navbar/Navbar.jsx'

function MyMeeting() {
  const navigate = useNavigate();

    const [user, setUser] = useState({});

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
      <div className="App">
        {Object.keys(user).length !== 0 ?
          <>
        <header>
        <Navbar props={user}/>
        </header>
        <div className='App'>
        <botton className="Button" onClick={() => navigate("/EditMeeting")}> Edit Meeting</botton>
        <botton className="Button" onClick={() => navigate("/EditMeeting")}> + New Folder</botton>
        </div>
       
       <h1>This is MyMeeting Page</h1>
       </>
       :
       <></>
       }
      </div>
    );
  }
  
  export default MyMeeting;

