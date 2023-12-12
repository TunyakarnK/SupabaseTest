import React from 'react'
import { useState } from 'react';
import { supabase } from '../supabaseClient';
import "src/components/MeetingCard.css"
import EditMeeting from 'src/pages/MyMeeting/EditMeeting';
import { Link,NavLink,useNavigate } from 'react-router-dom';

function MeetingCard(props) {
  const meeting = props.meeting;
  const navigate = useNavigate();

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

    async function deleteMeeting() {
        try {
            const { data, error } = await supabase
                .from("meeting")
                .delete()
                .eq("meetName", meeting.meetName)
            
            if (error) throw error;
            window.location.reload();
        } catch (error) {
            alert(error.message);
        }
    }


  return (
    <div className='myCard'>
      <div>
                 { editing == false ?
                    <>
                    <div className='myCard'>
                        <h3>{meeting.meetName}</h3>
                        <h3>{meeting.meetId}</h3>
                        <h3>{meeting.meetStartDate}</h3>
                        <button onClick={() => deleteMeeting()}>Delete Meeting</button>
                        <button onClick={() => setEditing(true)}>Edit Meeting</button>
                      </div>
                    </>
                :
                    // <>
                    // <Link to="/EditMeeting" props = {meetId}></Link>
                    //     {/* <NavLink to="/EditMeeting" props = {meetId}></NavLink> */}
                    //     {/* <EditMeeting props = {meetId} /> */}
                    // </>
                    navigate('/EditMeeting')
                    
                }
            
        </div></div>
  )
}

export default MeetingCard


