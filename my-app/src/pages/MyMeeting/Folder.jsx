import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { Grid, GridCol, SegmentedControl, Text, rem, Button } from '@mantine/core';
import { supabase } from '../../supabaseClient.js';
import { useEffect, useState } from "react";
import MeetingCard from 'src/components/MeetingCard';
import { useSession } from '@supabase/auth-helpers-react';
import Navbar from 'src/components/Navbar/Navbar';

function Folder() {
  const { id } = useParams();
  const session = useSession();
  const [user, setUser] = useState({});
  const [newMeeting, setNewMeeting] = useState([]);
  const [ checkOwnerFolder, setCheckOwnerFolder] = useState();
  const [folder, setFolder] = useState();

  useEffect(() =>{
    getUserData();
    getNewMeeting();
    fetchUserFolder();
  }, [session])

  async function getUserData() {
    await supabase.auth.getUser().then((value) =>{
      // value.data.user
      if(value.data?.user){
        console.log(value.data.user)
        setUser(value.data.user)
      }
    })
  }
  
  async function getNewMeeting() {
    try {
      const { data, error } = await supabase
        .from("meeting")
        .select("*")
        .eq("folderId", id)
        //จริงๆๆต้องเอาแค่ meeting ที่พึ่งสร้างใหม่
      if (error) throw error;
      if (data != null) {
        console.log("get New Meeting", data);
        console.log();
        setNewMeeting(data); 
        // setCheckOwnerMeeting(data[0].creatorId)
      }
    } catch (error) {
      console.log(error.message);
      // alert(error.message);
    }
  }

  const fetchUserFolder = async () => {
    const { data, error } = await supabase
      .from("userFolder")
      .select("checkOwner")
      .eq("folderId", id)
      .eq("userId", session.user.id)
      setFolder(data)
      .then((result) => {
        console.log("check owner folder", result.data[0].checkOwner);
        setCheckOwnerFolder(result.data[0].checkOwner)
      })
  }
return (

  <div>
        <div>
    <div className="App">
        {Object.keys(session.user).length !== 0 ?
          <>
        <header>
        <Navbar props={session.user} />
        </header>

        <div style={{backgroundColor:'#FDEFE9', margin:"40px", padding:'20px'}}>

        <Grid align="center">
        <Grid.Col span={10.4}><Text size='30px' fw={'500'} style={{marginTop:'20px',marginBottom:'30px'}}>My Meeting ❯ {folder[0].folderName}</Text></Grid.Col> /}
          <Grid.Col span={0.8}>
          { checkOwnerFolder === true ? 
  (<Link to={"/MyMeeting"}><Button variant='outline' color='#EE5D20' radius="xl" style={{width:'auto',marginBottom:'10px'}}>Back</Button></Link>)
  :
  (<Link to={"/SharedMeeting"}><Button variant='outline' color='#EE5D20' radius="xl" style={{width:'auto',marginBottom:'10px'}}>Back</Button></Link>)  }</Grid.Col>
          <Grid.Col span={9}><Text size='30px' fw={'500'} style={{marginTop:'20px',marginBottom:'25px'}}>My Meeting ❯ {id}</Text></Grid.Col>
          {/* {/ <Grid.Col span={1.3}><Button color='#EE5D20' variant='outline' radius={60} onClick={()=>statisticButton()} fullWidth style={{marginTop:'10px'}}>Statistic</Button></Grid.Col> */}
        </Grid>
        <Grid align="center" style={{ borderBottom: '1px solid black',paddingBottom:'10px'}}>
        <Grid.Col span={4}><Text c="#4f5b5f" style={{marginLeft:'10px'}}>Meeting Name</Text></Grid.Col>
        <Grid.Col span={2} ><Text c="#4f5b5f">Status</Text></Grid.Col>
        <Grid.Col span={2} ><Text c="#4f5b5f">Owner</Text></Grid.Col>
        <Grid.Col span={2} ><Text c="#4f5b5f">Meeting Date</Text></Grid.Col>
        </Grid>

        <div className=''>
            {newMeeting.map((newMeeting) => (
            <MeetingCard meeting = {newMeeting} user = {user} />
          ))}
           </div>
        </div>

           <div style={{height:'10px', backgroundColor:'#EE5D20',position: 'fixed',bottom: '0', width: '100%'}}></div> 

           </>:<></>} 
           </div>
        </div>
    </div>
  )

}

export default Folder