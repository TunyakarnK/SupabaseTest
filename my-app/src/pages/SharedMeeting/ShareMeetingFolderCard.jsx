import React from 'react'
import { useState } from 'react';
import 'src/components/MeetingCard.css';
import { Link,NavLink,useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { rem, TextInput, Grid, Text, Button, ActionIcon, Modal, Popover} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';



function ShareMeetingFolderCard(props) {
  const folder = props.folder;
  const user = props.user;
  const navigate = useNavigate();
  const [folderName, setFolderName] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);

  function handleButtonClick (){
    navigate('/SharedMeeting/' + folder.folderId, { state: { user } });    
}

  return (
    <div className='meetCard' 
    // onClick={() => handleButtonClick()} 
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
    style={{ padding: '10px',borderBottom: '1px solid #202F34',backgroundColor: isHovered ? '#eddecf' : 'transparent', transition: 'background-color 0.3s ease',cursor: 'pointer' }}
    >                
      
        <Grid align="center" >
        <Grid.Col span={5} onClick={()=>handleButtonClick()} ><Text >{folder.folderName}</Text></Grid.Col>
        {/* <Grid.Col span={6} onClick={()=>handleButtonClick()} ><Text>{user.user_metadata.full_name}</Text></Grid.Col> */}
        </Grid>        
        </div>
  )
}

export default ShareMeetingFolderCard











