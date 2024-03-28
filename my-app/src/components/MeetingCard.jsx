import React from 'react'
import { useState } from 'react';
import { supabase } from '../supabaseClient';
import "src/components/MeetingCard.css"
import { Link,NavLink,useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { Card, Table, Grid,Text,Button, ActionIcon,  Modal} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconTrash } from '@tabler/icons-react';
import { useSession } from '@supabase/auth-helpers-react';

function MeetingCard(props) {
  const { id } = useParams();
  const meeting = props.meeting;
  const session = useSession;
  const user = props.user;
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [thisUser, setThisUser] = useState({});
  const [ editing, setEditing ] = useState(false);
  const [ meetId, setMeetId ]= useState ([]);
  const [ meetName, setMeetName ] = useState ([]);
  // const [ ownerId, setOwnerId]= useState ([]);
  const [ meetStartDate, setMeetStartDate] = useState ([]);
  const [ creatorName, setcreatorName ] = useState();
  const [ checkCreator, setCheckCreator ] = useState();

  useEffect(() => {
    async function getUserData() {
      await supabase.auth.getUser().then((value) => {
        if (value.data?.user) {
          setThisUser(value.data.user);
          // console.log(value)
        }
      });
    }checkCreatorMeeting();
    console.log("test", meeting.meetStatus);
    getUserData();
  }, []);

    async function deleteMeeting() {
        try {
            const { data, error } = await supabase
                .from("meeting")
                .delete()
                .eq("meetId", meeting.meetId)
                // window.location.reload();
          getUserData()
          fetchFolder();
          fetchNewMeeting();
        } catch (error) {
            // alert(error.message);
        }
    }
    function EditMeeting (){
      navigate('/EditMeeting', { state: { meeting } });
    } 

    function handleButtonClick (){
        navigate('/MeetingPage/' + meeting.meetId, { state: { user } });    
    }
  

  function EditMeeting() {
    navigate('/EditMeeting', { state: { meeting } });
  }

  function handleButtonClick() {
    navigate(`/MeetingPage/${meeting.meetId}`, { state: { user } });
  }

  const checkCreatorMeeting = async () => {
    await supabase
    .from("meeting")
    .select("meetStatus, creatorId")
    .eq("folderId", id)
    .then((result) => {
      console.log("who create this meeting", result);
      setCheckCreator(result.data[0].creatorId)
      supabase
      .from("user")
      .select("full_name")
      .eq("id", result.data[0].creatorId)
      .then((result) => {
        console.log("Name", result);
        setcreatorName(result.data[0].full_name);
      })
    })
  }

    function formatDateToText(textDate) {
      try {
        const dateObject = new Date(textDate);
        if (isNaN(dateObject.getTime())) {
          throw new Error("Invalid date-time text provided");
        }
    
        // Adjust the date object to UTC+7 timezone
        const localDateObject = new Date(dateObject.getTime() - (7 * 60 * 60 * 1000));
    
        // Extract day, month (0-indexed), year, hours, and minutes in local time
        const day = localDateObject.toLocaleDateString("en-US", { day: '2-digit' });
        const month = localDateObject.toLocaleDateString("en-US", { month: 'long' }); 
        const year = localDateObject.getFullYear();
        const hours = String(localDateObject.getHours()).padStart(2, '0');
        const minutes = String(localDateObject.getMinutes()).padStart(2, '0'); 
        const formattedDate = `${day} ${month} ${year} ${hours}:${minutes}`;
    
        return formattedDate;
      } catch (error) {
        console.warn("Error parsing date:", error.message);
        return null; 
      }
    }
    

  return (
    <div
    className='meetCard'
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
    style={{
      padding: '10px',
      borderBottom: '1px solid #202F34',
      backgroundColor: isHovered ? '#eddecf' : 'transparent',
      transition: 'background-color 0.3s ease',
      cursor: 'pointer',
    }}
  >

    {/* Conditionally render content based on user availability */}
    {user && (
      <>
        <Grid align="center">
          <Grid.Col span={4} onClick={handleButtonClick}><Text>{meeting.meetName}</Text></Grid.Col>
          <Grid.Col span={2}><Text c="#4f5b5f">{meeting.meetStatus === false ?(<Text>Incoming</Text>):(<Text>Ended</Text>)}</Text></Grid.Col>
          <Grid.Col span={2} onClick={handleButtonClick}><Text>{user.user_metadata.full_name}</Text></Grid.Col>
          <Grid.Col span={2} onClick={handleButtonClick}>{formatDateToText(meeting.meetStartDate)}</Grid.Col> 
          <Grid.Col span={1.5}>{/* <Button variant='outline' color='#EE5D20' onClick={EditMeeting}>Edit Meeting</Button></Grid.Col><Grid.Col span={0.5}> */}
            { meeting.meetStatus == false && (<Button variant='outline' color='#EE5D20' onClick={EditMeeting}>Edit Meeting</Button>)}</Grid.Col>
          <Grid.Col span={0.5}><ActionIcon onClick={open} variant="subtle" color="#EE5D20"><IconTrash /></ActionIcon></Grid.Col>
        </Grid>

        <Modal opened={opened} onClose={close} title="Delete">
          <div style={{ padding: '10px' }}>Do you want to delete {meeting.meetName} ?</div>
       <div>
        <Button color='#EE5D20' onClick={close} style={{margin:'10px'}}>Cancel</Button>
        <Button variant='outline' color='#EE5D20' onClick={deleteMeeting}>Delete</Button>
       </div>
       
      </Modal>       

      </>
    )}
      </div>
  )

    }

export default MeetingCard