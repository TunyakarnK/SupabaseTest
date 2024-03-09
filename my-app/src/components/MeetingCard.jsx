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
  const session = useSession();
  const meeting = props.meeting;
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  
  //fetch status ของ meeting

  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchUserData = async () => {
      if (session.user) {
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;
        setUser(data?.user);
      }
    };

    fetchUserData();
  }, [session]);

  async function deleteMeeting() {
    try {
      const { data, error } = await supabase
        .from("meeting")
        .delete()
        .eq("meetName", meeting.meetName);

      if (error) throw error;
      window.location.reload(); // Simpler approach for now
    } catch (error) {
      // Handle errors appropriately (e.g., display error message)
      console.error(error);
    }
  }

  function EditMeeting() {
    navigate('/EditMeeting', { state: { meeting } });
  }

  function handleButtonClick() {
    navigate(`/MeetingPage/${meeting.meetId}`, { state: { user } });
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
          <Grid.Col span={4} onClick={handleButtonClick}>
            <Text>{meeting.meetName}</Text>
          </Grid.Col>
          <Grid.Col span={2}><Text c="#4f5b5f">status</Text></Grid.Col>
          <Grid.Col span={2} onClick={handleButtonClick}>
            <Text>{user.user_metadata.full_name}</Text>
          </Grid.Col>
          <Grid.Col span={2} onClick={handleButtonClick}>
            {meeting.meetStartDate}
          </Grid.Col>
          <Grid.Col span={1.5}>
            <Button variant='outline' color='#EE5D20' onClick={EditMeeting}>
              Edit Meeting
            </Button>
          </Grid.Col>
          <Grid.Col span={0.5}>
            <ActionIcon onClick={open} variant="subtle" color="#EE5D20">
              <IconTrash />
            </ActionIcon>
          </Grid.Col>
        </Grid>

        <Modal opened={opened} onClose={close} title="Delete">
          <div style={{ padding: '10px' }}>Do you want to delete {meeting.meetName} ?</div>
       <div>
        <Button color='#EE5D20' onClick={close} style={{margin:'10px'}}>Cancle</Button>
        <Button variant='outline' color='#EE5D20' onClick={deleteMeeting}>Delete</Button>
       </div>
       
      </Modal> 
      
      </>
    )}
      </div>
        
  )
}

export default MeetingCard


