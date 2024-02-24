import React from 'react'
import { useState } from 'react';
import { supabase } from '../supabaseClient';
import "src/components/MeetingCard.css"
import { Link,NavLink,useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function MeetingCard(props) {
  const meeting = props.meeting;
  const user = props.user;
  const navigate = useNavigate();
  const [thisUser, setThisUser] = useState({});
  const [ editing, setEditing ] = useState(false);
  const [ meetId, setMeetId ]= useState ([]);
  const [ meetName, setMeetName ] = useState ([]);
  // const [ ownerId, setOwnerId]= useState ([]);
  const [ meetStartDate, setMeetStartDate] = useState ([]);

  // const [ folderId, setFolderId]= useState ([]);
  // const [ meetEndDate, setMeetEndDate]= useState ([]);
  // const [ meetTagId, setMeetTagId]= useState ([]);
  // const [ meetDes, setMeetDes]= useState ([]);
  // const [ meetStatus, setMeetStatus]= useState ([]);
  // const [ meetCreate, setMeetCreate]= useState ([]);
  // const [ meetStartTime, setMeetStartTime]= useState ([]);
  // const [ meetEndTime, setMeetEndTime]= useState ([]);


  useEffect(() => {
    async function getUserData() {
      await supabase.auth.getUser().then((value) => {
        if (value.data?.user) {
          setThisUser(value.data.user);
          // console.log(value)
        }
      });
    }
    
    getUserData();
    console.log(user);
    console.log(thisUser);
  }, []);

    // async function updateMeeting() {
    //     try {
    //         const { data, error } = await supabase
    //             .from("meeting")
    //             .update({
    //                 name: meetName,
    //                 meetStartDate: meetStartDate
    //             })
    //             .eq("id", meeting.id)
            
    //         if (error) throw error;
    //         window.location.reload();
    //     } catch (error) {
    //         alert(error.message);
    //     }
    // }

    async function deleteMeeting() {
        try {
            const { data, error } = await supabase
                .from("meeting")
                .delete()
                .eq("meetId", meeting.meetId)
            
            if (error) throw error;
            window.location.reload();
        } catch (error) {
            alert(error.message);
        }
    }


  return (
    <div className='myCard'>
      
                 { editing == false ?
                    <>
                    <div className=''>
                    <h3><Link to={{ pathname: '/MeetingPage/' + meeting.meetId, state: { user: user } }}>{meeting.meetName}</Link></h3>
                        {/* <p>{meeting.meetId}</p> */}
                        <p>owner: {user.user_metadata.full_name}</p>
                        <p>meeting start time: </p>
                        <p>{meeting.meetStartDate}</p>
                        <button onClick={() => deleteMeeting()}>Delete Meeting</button>
                        {/* <button onClick={() => navigate('/StartMeeting', {state: {meeting}})}>Start Meeting</button> */}
                        <button onClick={() => setEditing(true)}>Edit Meeting</button>
                      </div>
                    </>
                :
                    // <>
                    // <Link to="/EditMeeting" props = {meetId}></Link>
                    //     {/* <NavLink to="/EditMeeting" props = {meetId}></NavLink> */}
                    //     {/* <EditMeeting props = {meetId} /> */}
                    // </>
                    navigate('/EditMeeting', {state: {meeting}})
                    // console.log({meeting})
                }
            
        </div>
  )
}

export default MeetingCard