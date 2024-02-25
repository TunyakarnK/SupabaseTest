import React from 'react'
import { useState } from 'react';
import { supabase } from 'src/supabaseClient';
import 'src/components/MeetingCard.css';
import { Link,NavLink,useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Card, Table, Grid,Text,Button, ActionIcon,  Modal} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';



function SharedMeetingCard(props) {
  const meeting = props.meeting;
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
  }, []);


    function handleButtonClick (){
        navigate('/MeetingPage/${meeting.meetId}', { state: { user } });    
    }

  return (
    <div className='meetCard' 
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
    style={{ padding: '10px',borderBottom: '1px solid #202F34',backgroundColor: isHovered ? '#eddecf' : 'transparent', transition: 'background-color 0.3s ease',cursor: 'pointer' }}
    >                
        <Grid align="center" >
        <Grid.Col span={4} onClick={handleButtonClick} ><Text >{meeting.meetName}</Text></Grid.Col>
        <Grid.Col span={2}><Text c="#4f5b5f" >Status</Text></Grid.Col>
        <Grid.Col span={2} onClick={handleButtonClick} ><Text>{user.user_metadata.full_name}</Text></Grid.Col>
        <Grid.Col span={2} onClick={ handleButtonClick} >{meeting.meetStartDate}</Grid.Col>  
        </Grid>            
       
    </div>
  )
}

export default SharedMeetingCard


