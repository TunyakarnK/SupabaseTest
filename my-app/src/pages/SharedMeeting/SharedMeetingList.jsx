import React from 'react'
import SharedMeetingCard from './SharedMeetingCard';
import { useParams } from 'react-router-dom'
import { useSession } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react';
import Navbar from 'src/components/Navbar/Navbar';
import { supabase } from 'src/supabaseClient';
import { Grid,Text, Button,Modal } from '@mantine/core';
import { useNavigate } from 'react-router-dom';


function SharedMeetingList(props) { 
  const { folderid } = useParams();
  const { id } = useParams();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState([]);
  const [folder, setFolder] = useState([]);
  const [folderName, setFolderName] = useState([]);
  const session = useSession();


  // ตอน fetch folderName แล้วมัน Error
  useEffect(() =>{
    async function fetchFolder() {
    try {
      const { data, error } = await supabase
          .from("folders")
          .select()
          .eq("folderId",sharedfolderid)
          if (error) throw error;
          if (data != null) {
            setFolder(data);
            console.log('data='+data)
          }
        } catch (error) {
          // alert(error.message);
        }
      }

    fetchFolder();
    fetchMeeting();
    console.log(folder)
    // console.log(folder[0].folderName)
  }, [])

  async function fetchMeeting() {
    try {
      const { data, error } = await supabase
          .from("meeting")
          .select("*")
          .eq("folderId", id)
            //จริงๆๆต้องเอาแค่ meeting ที่พึ่งสร้างใหม่
          if (error) throw error;
          if (data != null) {
          setMeeting(data); 
          }
        } catch (error) {
          // alert(error.message);
        }
      }

      // function statisticButton(){
      //   navigate('/Folder/'+folder.folderid+'/statistic', { state: { folder } } );    
      // }
  
  
  return (
    <div>
    <div className="App">
        {Object.keys(session.user).length !== 0 ?
          <>
        <header>
        {/* <Navbar props={session.user} /> */}
        </header>

        <div style={{backgroundColor:'#FDEFE9', margin:"40px", padding:'20px'}}>
     
        
        <Grid align="center">
          <Grid.Col span={0.8}><Button variant='outline' color='#EE5D20' radius="xl" onClick={() => navigate(-1)} style={{width:'auto'}}>Back</Button></Grid.Col>
        {/* <Grid.Col span={10.4}><Text size='30px' fw={'500'} style={{marginTop:'20px',marginBottom:'30px'}}>My Meeting ❯ {folder[0].folderName}</Text></Grid.Col> */}
          <Grid.Col span={9}><Text size='30px' fw={'500'} style={{marginTop:'20px',marginBottom:'30px'}}>Shared with me ❯ {folderid}</Text></Grid.Col>
          {/* <Grid.Col span={1.3}><Button color='#EE5D20' variant='outline' radius={60} onClick={()=>statisticButton()} fullWidth style={{marginTop:'10px'}}>Statistic</Button></Grid.Col> */}
        </Grid>
      
        <Grid align="center" style={{ borderBottom: '1px solid black',paddingBottom:'10px'}}>
        <Grid.Col span={4}><Text c="#4f5b5f" style={{marginLeft:'10px'}}>Meeting Name</Text></Grid.Col>
        <Grid.Col span={2} ><Text c="#4f5b5f">Status</Text></Grid.Col>
        <Grid.Col span={2} ><Text c="#4f5b5f">Owner</Text></Grid.Col>
        <Grid.Col span={2} ><Text c="#4f5b5f">Meeting Date</Text></Grid.Col>
        </Grid>

        <div>
            {meeting.map((meeting) => (
            <SharedMeetingCard meeting = {meeting} user={session.user} key={meeting.meetId}/>
          ))}
          {/* <SharedMeetingCard /> */}
            </div>
        </div>
           <div style={{height:'10px', backgroundColor:'#EE5D20',position: 'fixed',bottom: '0', width: '100%'}}></div> 
        </>:<></>
     } 
    </div></div>
    
  )
}

export default SharedMeetingList