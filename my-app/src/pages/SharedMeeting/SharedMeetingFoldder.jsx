import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from '../../supabaseClient.js';

function SharedMeeting() {
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
          <button onClick={()=>{navigate("/Profile")}}>Profile Page</button>
            <button onClick={()=>{navigate("/MyMeeting")}}>MyMeetingPage</button>
            <button onClick={()=>{navigate("/SharedMeeting")}}>SharedMeeting Page</button>
          </header>
       <h1>This is SharedMeeting Page</h1>
       </>
       :
       <></>
       }
      </div>
    );
  }
  
  export default SharedMeeting;