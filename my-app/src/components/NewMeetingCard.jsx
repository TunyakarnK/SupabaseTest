import React from 'react'
import { useState } from 'react';
import { supabase } from '../supabaseClient';
import "src/components/MeetingCard.css"
import { Link,NavLink,useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Card, Table, Grid,Text,Button, ActionIcon,  Modal} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconTrash } from '@tabler/icons-react';
import { useSession } from '@supabase/auth-helpers-react';

function MeetingCard(props) {
  
  const meeting = props.meeting;
  // const user = props.user;
  const session = useSession();
  const user = session.user;
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
  }, [session]);

    async function deleteMeeting() {
        try {
            const { data, error } = await supabase
                .from("meeting")
                .delete()
                .eq("meetId", meeting.meetId)
            
            // if (error) throw error;
            window.location.reload();
        } catch (error) {
            // alert(error.message);
        }
    }
    function EditMeeting (){
      navigate('/EditMeeting', { state: { meeting } });
    } 

    function handleButtonClick (){
        navigate('/MeetingPage/${meeting.meetId}', { state: { user } });    
    }


  return (
    <div className='meetCard' 
    // onClick={() => handleButtonClick()} 
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
    style={{ padding: '10px',borderBottom: '1px solid #202F34',backgroundColor: isHovered ? '#eddecf' : 'transparent', transition: 'background-color 0.3s ease',cursor: 'pointer' }}
    >                
      
        <Grid align="center" >
        <Grid.Col span={5} onClick={handleButtonClick} ><Text >{meeting.meetName}</Text></Grid.Col>
        <Grid.Col span={4.5} onClick={handleButtonClick} >{meeting.meetStartDate}</Grid.Col>
        <Grid.Col span={1.5} ><Button variant='outline' color='#EE5D20' onClick={EditMeeting}>Edit Meeting</Button></Grid.Col>
        <Grid.Col span={0.5} ><ActionIcon onClick={open} variant="subtle" color="#EE5D20"><IconTrash/></ActionIcon></Grid.Col>    
        </Grid>            
        <Modal opened={opened} onClose={close} title="Delete" centered>
        <div style={{padding:'10px'}}>Do you want to delete {meeting.meetName} ?</div>
       <div>
        <Button color='#EE5D20' onClick={close} style={{margin:'10px'}}>Cancle</Button>
        <Button variant='outline' color='#EE5D20' onClick={deleteMeeting}>Delete</Button>
       </div>
       
      </Modal>   
        </div>
  )
}

export default MeetingCard


