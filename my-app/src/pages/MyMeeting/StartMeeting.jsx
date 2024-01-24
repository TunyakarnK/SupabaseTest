import React from 'react'
import { useEffect, useState } from "react";
import { supabase } from '../../supabaseClient.js';
import Navbar from '../../components/Navbar/Navbar.jsx'
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

function StartMeeting() {
    const { state } = useLocation();
    // const nameRef = props.nameRef
    const [user, setUser] = useState({});
    const navigate = useNavigate();

    const [ meeting, setMeeting ]= useState ([]);
    // const [ meetId, setMeetId ]= useState ([]);
    const [ isMeetingStart, setIsMeetingStart ] = useState (false);
    const [ isMeetingEnd, setIsMeetingEnd ] = useState (false);
    const [ startMeeting, setstartMeeting]= useState ([]);
    const date = new Date().toISOString();
    
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
      // getMeeting();
      // console.log('from edit page')
      // console.log(state.meeting.meetId)
    }, [])

    
  async function startTheMeeting() {
    try {
        const { error } = await supabase
            .from("meeting")
            .update({
                startMeetingTime: date,
            })
            .eq("meetId", state.meeting.meetId)
            setIsMeetingStart(true);
        console.log('start meeting update',date)
        if (error) throw error;
    } catch (error) {
        alert(error.message);
    }
}

async function endTheMeeting() {
  try {
      const { error } = await supabase
          .from("meeting")
          .update({
              endMeetingTime: date,
              meetStatus: "TRUE",
          })
          .eq("meetId", state.meeting.meetId)
          setIsMeetingEnd(true);
      console.log('end meeting update')    
      if (error) throw error;
  } catch (error) {
      alert(error.message);
  }
}



  return (
    <div>
         <div className='App'>
        {Object.keys(user).length !== 0 ?
          <>
        <header>
        <Navbar props={user}/>
        </header>
       <h1>Start Meeting</h1>
       {/* <botton className="Button" onClick={() => navigate("/MyMeeting")}> Edit Meeting</botton> */}

        {isMeetingStart == false? 
            <>
            <button className="Button" onClick={() => startTheMeeting()}>Start meeting</button>
            </> 
          :
            <>
            <button className="Button" onClick={() => endTheMeeting()}>End meeting</button>
            </>
              
        } 
       </>
       :
       <></>
       }
       
      </div>
    </div>
    
  )
}

export default StartMeeting




    

    // async function getMeeting() {
    //   try {
    //     const { data, error } = await supabase
    //       .from("meeting")
    //       .select()
    //       .eq('meetName',nameRef)
    //       //ต้องๆต้องเอาแค่ meeting ที่พึ่งสร้างใหม่
    //     if (error) throw error;
    //     if (data != null) {
    //       setMeeting(data); 
    //     }
    //   } catch (error) {
    //     alert(error.message);
    //   }
    // }

    

 