import React from 'react'
import "../../App.css"
import { useEffect, useState } from "react";
import { supabase } from '../../supabaseClient.js';
import Navbar from '../../components/Navbar/Navbar.jsx'
import { useNavigate } from "react-router-dom";

function EditMeeting(props) {
    const nameRef = props.nameRef
    const [user, setUser] = useState({});
    const navigate = useNavigate();

    const [ meeting, setMeeting ]= useState ([]);
    const [ meetId, setMeetId ]= useState ([]);
    const [ meetName, setMeetName ] = useState ([]);
    const [ ownerId, setOwnerId]= useState ([]);
    const [ meetStartDate, setMeetStartDate] = useState ([]);
    const [ folderId, setFolderId]= useState ([]);
    const [ meetEndDate, setMeetEndDate]= useState ([]);
    const [ meetTagId, setMeetTagId]= useState ([]);
    const [ meetDes, setMeetDes]= useState ([]);
    const [ meetStatus, setMeetStatus]= useState ([]);
    const [ meetCreate, setMeetCreate]= useState ([]);
    const [ meetStartTime, setMeetStartTime]= useState ([]);
    const [ meetEndTime, setMeetEndTime]= useState ([]);


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
      getMeeting();
    }, [])

    async function getMeeting() {
      try {
        const { data, error } = await supabase
          .from("meeting")
          .select()
          .eq('meetName',nameRef)
          //ต้องๆต้องเอาแค่ meeting ที่พึ่งสร้างใหม่
        if (error) throw error;
        if (data != null) {
          setMeeting(data); 
        }
      } catch (error) {
        alert(error.message);
      }
    }

    async function updateMeeting() {
      try {
          const { data, error } = await supabase
              .from("meeting")
              .update({
                  name: meetName,
                  meetStartDate: meetStartDate
              })
              .eq("id", meeting.id)
          
          if (error) throw error;
          window.location.reload();
      } catch (error) {
          alert(error.message);
      }
  }


  return (
    <div className='App'>
        {Object.keys(user).length !== 0 ?
          <>
        <header>
        <Navbar props={user}/>
        </header>
       <h1>EditMeeting</h1>
       {/* <botton className="Button" onClick={() => navigate("/MyMeeting")}> Edit Meeting</botton> */}
       <div>
        {meeting}
        {/* {meetId} */}
        {meetName}
        {ownerId}
        {meetStartDate}
        {folderId}
        {meetEndDate}
        {meetTagId}
        {meetDes}
        {meetStatus}
        {meetCreate}
        {meetStartTime}
        {meetEndTime}
       </div>
       <div>
             <h3>Edit Meeting</h3>
             <form>
              <label>Meeting Name
              <input type="text" 
                  value={meetName}
                  onChange={(e) => setMeetName(e.target.value)} />
             </label>

             <label>setMeetStartDate
              <input type="text" 
                  value={meetStartDate}
                  onChange={(e) => setMeetStartDate(e.target.value)} />
             </label>

             <label>setFolderId
              <input type="text" 
                  value={folderId}
                  onChange={(e) => setFolderId(e.target.value)} />
             </label>

             <label>setMeetEndDate
              <input type="text" 
                  value={meetEndDate}
                  onChange={(e) => setMeetEndDate(e.target.value)} />
             </label>

             <label>setMeetTagId
              <input type="text" 
                  value={meetTagId}
                  onChange={(e) => setMeetTagId(e.target.value)} />
             </label>

             <label>setMeetDes
              <input type="text" 
                  value={meetDes}
                  onChange={(e) => setMeetDes(e.target.value)} />
             </label>

             <label>setMeetStartTime
              <input type="text" 
                  value={meetStartTime}
                  onChange={(e) => setMeetStartTime(e.target.value)} />
             </label>

             <label>setMeetEndTime
              <input type="text" 
                  value={meetEndTime}
                  onChange={(e) => setMeetEndTime(e.target.value)} />
             </label>

             </form>
             <br></br>
             <button className="Button" onClick={() => updateMeeting()}>update meeting</button>
        </div>
       
       </>
       :
       <></>
       }
       
      </div>
    
  )
}

export default EditMeeting