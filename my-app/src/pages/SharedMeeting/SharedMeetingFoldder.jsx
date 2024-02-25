import React from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../supabaseClient.js';
import Navbar from '../../components/Navbar/Navbar.jsx'
import '../../components/MeetingCard.css'
// import NewMeetingCard from 'src/components/NewMeetingCard';
import FolderCard from 'src/components/FolderCard';
import { Grid, ScrollArea, TextInput,Text,rem, Button,Modal ,Radio,Group} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from "react";
import MeetingCard from 'src/components/MeetingCard';
import { useSession } from '@supabase/auth-helpers-react';

function SharedMeetingFoldder() {
const { id } = useParams();
  const navigate = useNavigate();
  
  const [user, setUser] = useState({});
  const [createFolder, setCreateFolder] = useState(false);
  const [folder, setFolder] = useState([]);
  const [folderName, setFolderName] = useState([]);
  const [newMeeting, setNewMeeting] = useState([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [newMeetName, setNewMeetName] = useState([]);
  
    useEffect(() =>{
      async function getUserData() {
        await supabase.auth.getUser().then((value) =>{
          // value.data.user
          if(value.data?.user){
            console.log(value.data.user)
            setUser(value.data.user)
          }
        })
      }
      getUserData();
      fetchFolder();
      fetchNewMeeting();
      console.log('meet'+newMeeting)
    }, [])

    async function fetchNewMeeting() {
      try {
        const { data, error } = await supabase
          .from("meeting")
          .select("*")
          //จริงๆๆต้องเอาแค่ meeting ที่พึ่งสร้างใหม่
        if (error) throw error;
        if (data != null) {
          setNewMeeting(data); 
        }
      } catch (error) {
        alert(error.message);
      }
    }

    async function fetchFolder() {
      try {
        const { data, error } = await supabase
          .from("folders")
          .select("*")
        if (error) throw error;
        if (data != null) {
          setFolder(data); 
        }
      } catch (error) {
        alert(error.message);
      }
    }
  
    console.log(folder);
      
    return (
      <div className="App">
        {Object.keys(user).length !== 0 ?
    <>
        <header>
        <Navbar props={user}/>
        </header>

       <div style={{backgroundColor:'#FDEFE9', margin:"50px", padding:'20px',minHeight:'500px'}}>   
       <div>
        <Grid align="center">
          <Grid.Col span={10.4}><Text size='30px' fw={'500'} style={{marginTop:'50px',marginBottom:'30px'}}>Shared with me</Text></Grid.Col>
        </Grid>
        <div>
          <Grid align="center" style={{ borderBottom: '1px solid black',paddingBottom:'10px'}}>
          <Grid.Col span={5}><Text c="#4f5b5f" style={{marginLeft:'10px'}}>Folder Name</Text></Grid.Col>
          <Grid.Col span={5.5} ><Text c="#4f5b5f">Owner</Text></Grid.Col>
          </Grid>

          <div>
            {folder.map((folder) => (
              <FolderCard folder = {folder} user = {user} key={folder.folderId} />
            ))}
            
          </div>
        </div>
          
            </div>
            </div>
            <div style={{height:'10px', backgroundColor:'white'}}></div> 
           <div style={{height:'10px', backgroundColor:'#EE5D20',position: 'fixed',bottom: '0', width: '100%'}}></div> 
    </>
       :
       <></>
       }
      </div>
    );
  }

  // return (
    
  //   <div>
  //       <Link to="/SharedMeeting" ><Button color='#EE5D20' radius="xl">Back</Button></Link>
  //       <br />
  //       Folder
  //       <div className=''>
  //           {newMeeting.map((newMeeting) => (
  //           <MeetingCard meeting = {newMeeting} user = {user} />
  //         ))}
  //           </div>
  //   </div>
  // )


export default SharedMeetingFoldder;