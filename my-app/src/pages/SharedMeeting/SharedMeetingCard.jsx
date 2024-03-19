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
  const [ meetOwner, setMeetOwner ] = useState();
  
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
    fetchMeetCreator();
  }, []);

  const fetchMeetCreator = async () => {
    const { data, error } = await supabase
      .from("meeting")
      .select(
        `
        creatorId,
        user(full_name)
        `
      )
      .eq("meetId", meeting.meeting.meetId)
      if( data ){
        console.log("meet creator", data[0].user.full_name);
        setMeetOwner(data[0].user.full_name);
      }
  }

    function handleButtonClick (){
        navigate('/MeetingPage/' + meeting.meeting.meetId, { state: { user } });    
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
        if(formattedDate == '01 January 1970 00:00'){
          return null;
        }
        return formattedDate;
      } catch (error) {
        console.warn("Error parsing date:", error.message);
        return null; 
      }
    }

  return (
    <div className='meetCard' 
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
    style={{ padding: '10px',borderBottom: '1px solid #202F34',backgroundColor: isHovered ? '#eddecf' : 'transparent', transition: 'background-color 0.3s ease',cursor: 'pointer' }}
    >                
        <Grid align="center" >
        <Grid.Col span={4} onClick={handleButtonClick} ><Text >{meeting.meeting.meetName}</Text></Grid.Col>
        <Grid.Col span={2}><Text c="#4f5b5f" >{meeting.meeting.meetStatus === false ?(<Text>Incoming</Text>):(<Text>Ended</Text>)}</Text></Grid.Col>
        <Grid.Col span={2} onClick={handleButtonClick} ><Text>{meetOwner}</Text></Grid.Col>
        <Grid.Col span={2} onClick={ handleButtonClick} >{formatDateToText(meeting.meeting.meetStartDate)}</Grid.Col>  
        </Grid>            
       
    </div>
  )
}

export default SharedMeetingCard


