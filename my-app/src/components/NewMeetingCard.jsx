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

function NewMeetingCard(props) {
  
  const meeting = props.meeting;
  const user = props.user;
  const navigate = useNavigate();
  const session = useSession();
  const [isHovered, setIsHovered] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [folder, setFolder] = useState([]);
  const [newMeeting, setNewMeeting] = useState([]);
  const [thisUser, setThisUser] = useState({});
  const [ editing, setEditing ] = useState(false);
  const [ meetId, setMeetId ]= useState ([]);
  const [ meetName, setMeetName ] = useState ([]);
  // const [ ownerId, setOwnerId]= useState ([]);
  const [ meetStartDate, setMeetStartDate] = useState ([]);

  useEffect(() => {
    // fetchFolder();
    async function getUserData() {
      await supabase.auth.getUser().then((value) => {
        if (value.data?.user) {
          setThisUser(value.data.user);
          // console.log(value)
          console.log("new Meeting card ");
        }
      });
    }
    getUserData();
    // fetchNewMeeting();
  }, []);
  
  async function fetchFolder() {
    try {
      const { data, error } = await supabase
        .from("userFolder")
        .select(
          `
          userId,
          folders(folderName,folderId)
          `
        )
        .eq("checkOwner", true)
        .eq("userId", session.user.id)
      if (error) throw error;
      if (data != null) {
        console.log("getFolder", data);
        setFolder(data);
        
      }
    } catch (error) {
      // alert(error.message);
    }
  }

  async function fetchNewMeeting() {
    try {
      const { data, error } = await supabase
        .from("meeting")
        .select("*")
        .filter("folderId", 'is', null)
        .eq("creatorId", session.user.id)
        //จริงๆๆต้องเอาแค่ meeting ที่พึ่งสร้างใหม่
      if (error) throw error;
      if (data != null) {
        console.log("getNewMeeting",data);
        setNewMeeting(data); 
        console.log(newMeeting);
      }
    } catch (error) {
      // alert(error.message);
      console.log("getNewMeeting",error);
    }
  }


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
        <Grid.Col span={5.5} onClick={handleButtonClick} >{meeting.meetStartDate}</Grid.Col>
        <Grid.Col span={1} ><Button variant='outline' color='#EE5D20' onClick={EditMeeting}>Edit Meeting</Button></Grid.Col>
        <Grid.Col span={0.5} ><ActionIcon onClick={open} variant="subtle" color="#EE5D20"><IconTrash/></ActionIcon></Grid.Col>    
        </Grid>            
        <Modal opened={opened} onClose={close} title="Delete" centered>
        <div style={{padding:'10px'}}>Do you want to delete {meeting.meetName} ?</div>
       <div>
        <Button color='#EE5D20' onClick={close} style={{margin:'10px'}}>Cancel</Button>
        <Button variant='outline' color='#EE5D20' onClick={deleteMeeting}>Delete</Button>
       </div>
       
      </Modal>   
        </div>
  )
}

export default NewMeetingCard


