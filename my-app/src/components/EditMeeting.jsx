import React from 'react'
import { Select, NativeSelect, rem, TextInput} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';

// import "../../App.css"
import { useEffect, useState } from "react";
import { supabase } from '../supabaseClient.js';
import Navbar from './Navbar/Navbar.jsx'
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

function EditMeeting(props) {
  const { state } = useLocation();
    // const nameRef = props.nameRef
    const [user, setUser] = useState({});
    const navigate = useNavigate();
    const data = [
      { value: 1, label: 'Decision-Making' },
      { value: 2, label: 'Problem-Solving' },
      { value: 3, label: 'Info/Opinion-Sharing' },
    ];

    // const [ meeting, setMeeting ]= useState ([]);
    // const [ meetId, setMeetId ]= useState ([]);
    const [ meetName, setMeetName ] = useState (""); //
    // const [ ownerId, setOwnerId]= useState (""); //
    const [ meetStartDate, setMeetStartDate] = useState ();
    const [ folderId, setFolderId]= useState ("");
    const [ meetEndDate, setMeetEndDate]= useState ();
    const [ meetTagId, setMeetTagId]= useState ();
    const [ meetDes, setMeetDes]= useState ("");
    const [ meetStatus, setMeetStatus]= useState ();
    const [ meetCreate, setMeetCreate]= useState ();
    const [ meetStartTime, setMeetStartTime]= useState ();
    const [ meetEndTime, setMeetEndTime]= useState ();


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
      // getMeeting();
      console.log('from edit page')
      console.log(state.meeting.meetId)
      console.log(state.meeting)
    }, [])

    async function getMeeting() {
      try {
        const { data, error } = await supabase
          .from("meeting")
          .select()
          .eq("meetId", state.meeting.meetId)
          //ต้องๆต้องเอาแค่ meeting ที่พึ่งสร้างใหม่
        if (error) throw error;
        if (data != null) {
          setMeetName(data.meetName); 
          setMeetDes(data.meetDes)
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
                  meetCreate: meetCreate,
                  meetDes: meetDes,
                  meetEndDate: meetEndDate,
                  meetEndTime: meetEndTime,
                  meetName: meetName,
                  meetStartDate: meetStartDate,
                  meetStartTime: meetStartTime,
                  meetStatus: meetStatus,
                  meetTagId: meetTagId,
              })
              .eq("meetId", state.meeting.meetId)
          
          if (error) throw error;
          // window.location.reload();
          navigate("/MyMeeting");
      } catch (error) {
          console.log(meetStartTime )
          alert(error.message);
          
      }
  }

  // const MeetTagId = (meetTag) =>{
  //   if (meetTag == 'Decision-Making'){
  //     setMeetTagId("1");
  //   }else if (meetTag == 'Problem-Solving'){
  //     setMeetTagId("2");
  //   }else if (meetTag == 'Info/Opinion-Sharing'){
  //     setMeetTagId("3");
  //   }
  //   console.log(meetTagId)
  // }




  return (
    <div className='App'>
        {Object.keys(user).length !== 0 ?
          <>
        <header>
        <Navbar props={user}/>
        </header>
       {/* <botton className="Button" onClick={() => navigate("/MyMeeting")}> Edit Meeting</botton> */}
       <div style={{margin:"20px"}}>
             <h1>Edit Meeting</h1>
             <TextInput
                placeholder={state.meeting.meetName}
                defaultValue={state.meeting.meetName}
                label="Meeting Name"
                onChange={(event) => setMeetName(event.currentTarget.value)}
                styles={{
                  input: {
                    width: rem(300),
                    marginRight: rem(-2),
                  },
                }}
              />

            <div style={{width: "300px"}}>
              <NativeSelect
                mt="md"
                // comboboxProps={{ withinPortal: true }}
                data={data}
                placeholder="meeting type"
                label="Meeting Type"
                onChange={(event) => setMeetTagId(event.currentTarget.value)}
                styles={{
                  input: {
                    fontWeight: 500,
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    // width: rem(300),
                    marginRight: rem(-2),
                  },
                }}
              />
            </div>
             
            <div style={{marginTop:"15px"}}>
              <TextInput
                placeholder={state.meeting.meetDes}
                defaultValue={state.meeting.meetDes}
                label="Meeting Description"
                onChange={(event) => setMeetDes(event.currentTarget.value)}
                styles={{
                  input: {
                    width: rem(300),
                    marginRight: rem(-2),  
                  },
                }}
              />
              </div>

              <div style={{marginTop:"15px"}}>
              {/* <DatePickerInput
                placeholder={state.meeting.meetDes}
                label="Meeting Description"
                onChange={(event) => setMeetDes(event.currentTarget.value)}
                styles={{
                  input: {
                    borderBottom: rem(5),
                    width: rem(300),
                    marginRight: rem(-2),  
                  },
                }}
              /> */}

              {/* <DatePickerInput
                label="Pick date"
                placeholder="Pick date"
                value={state.meeting.meetStartDate}
                onChange={setMeetStartDate}
              /> */}
              </div>

              <div style={{marginTop:"15px"}}>
             <form>
             <label  >Meeting Start-Date
              <input type="date" 
                  defaultValue={state.meeting.meetStartDate}
                  onChange={(e) => setMeetStartDate(e.target.value)} 
                  style={{margin:"15px"}}
              />
             </label>

             <label>Meeting Start-Time
              <input type="time" 
                  defaultValue={state.meeting.meetStartTime}
                  onChange={(e) => setMeetStartTime(e.target.value)} 
                  style={{margin:"15px"}}
                />
             </label>
             </form>
             </div>

             <form>
             <label>Meeting End-Date
              <input type="date" 
                  defaultValue={state.meeting.meetEndDate}
                  onChange={(e) => setMeetEndDate(e.target.value)} 
                  style={{margin:"15px"}}
                />
             </label>  

             

             <label>Meeting End-Time
              <input type="time" 
                  defaultValue={state.meeting.meetEndTime}
                  onChange={(e) => setMeetEndTime(e.target.value)} 
                  style={{margin:"15px"}}
                />
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

 