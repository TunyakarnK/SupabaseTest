import React from 'react';
import '../../components/MeetingCard.css'
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from '../../supabaseClient.js';
import Navbar from '../../components/Navbar/Navbar.jsx'
import MeetingCard from 'src/components/NewMeetingCard';
import FolderCard from 'src/components/FolderCard';
import { Grid, ScrollArea, TextInput,Text,rem, Button,Modal ,Radio,Group} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useSession } from '@supabase/auth-helpers-react';

function MyMeeting() {
  const navigate = useNavigate();
  const session = useSession()
  const [user, setUser] = useState([]);
  const [createFolder, setCreateFolder] = useState(false);
  const [folder, setFolder] = useState([]);
  const [folderName, setFolderName] = useState([]);
  const [newMeeting, setNewMeeting] = useState([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [newMeetName, setNewMeetName] = useState([]);
  const [ folderOwner, setFolderOwner ] = useState(null);

  useEffect(() =>{
    getUserData();
    fetchFolder();
    fetchNewMeeting();
    console.log('meet'+newMeeting)   
  }, [session])

  async function getUserData() {
    await supabase.auth.getUser().then((value) =>{
      // value.data.user
      if(value.data?.user){
        setUser(value.data.user);
        console.log(user);
      }
    })
  }


    async function signOut() {
      await supabase.auth.signOut();
      navigate("/");
    }

    async function fetchNewMeeting() {
      try {
        const { data, error } = await supabase
          .from("meeting")
          .select('*')
          .is('folderId', null)
          .eq("creatorId", session.user.id);
        // if (error) throw error;
        if (data != null) {
          setNewMeeting(data); 
        }
      } catch (error) {
        // alert(error.message);
      }
    }

    async function fetchFolder() {
      try {
        const { data, error } = await supabase
          .from("userFolder")
          .select(
            `
            userId,
            folders(folderName, folderId)
            `
          )
          .eq("checkOwner", true)
          .eq("userId", session.user.id)
        // if (error) throw error;
        if (data != null) {
          console.log("fetch folder", data);
          setFolder(data); 
        }
      } catch (error) {
        // alert(error.message);
      }
    }
  
    async function createNewFolder() {
      if(folderName !== ''){
       try {
        const { data, error } = await supabase
          .from("folders")
          .insert({
            folderName: folderName,
          })
          .select("folderId")
          .single()
          .then((result) => {
            console.log("create New Folder", result);
            supabase
            .from("userFolder")
            .insert({
              userId: user.id,
              folderId: result.data.folderId,
              checkOwner: true
            })
            .then((result) => {
              console.log("user Folder", result);
              setFolderOwner(result);
              window.location.reload(); 
            });
          });
        if (result){
          console.log("create New Folder", result);
        }
      } catch (error) {
        // alert(error.message);
      }
    }
  }
  
    console.log(folder);

    async function createNewMeeting(){
      try {
        const { data, error } = await supabase
          .from("meeting")
          .insert({
            meetName: 'Untitled Meeting',
            creatorId: session.user.id,
            meetCreate: new Date()
          })
          .select()
          .single()
          .then((result) => {
            console.log("create new meeting", result);
            supabase
            .from("attendee")
            .insert({
              meetId: result.data.meetId,
              email: session.user.email,
              userId: session.user.id
            })
            .then((result) => {
              console.log("insert Attendee", result);
              window.location.reload(); 
            })
            // fetchNewMeeting();
          })
        // if (error) throw error;

      } catch (error) {
        // alert(error.message);
      }
    }

    

    return (
      <div className="App">
        {Object.keys(user).length !== 0 ?
    <>
        <header>
        <Navbar props={user}/>
        </header>

       <div style={{backgroundColor:'#FDEFE9', margin:"50px", padding:'20px'}}>
        <Grid align="center">
        <Grid.Col span={10.4}><Text size='30px' fw={'500'} style={{marginTop:'20px',marginBottom:'30px'}}>New Meeting</Text></Grid.Col>
        <Grid.Col span={1}><Button color='#EE5D20' radius={60} onClick={()=>createNewMeeting()} style={{marginTop:'30px'}}> + New Meeting</Button></Grid.Col>
        </Grid>
        <Grid align="center" style={{ borderBottom: '1px solid black',paddingBottom:'10px'}}>
        <Grid.Col span={5}><Text c="#4f5b5f" style={{marginLeft:'10px'}}>Meeting Name</Text></Grid.Col>
        </Grid>
        <div >
            {newMeeting.map((newMeeting) => (
            <MeetingCard meeting = {newMeeting} user = {user} key={newMeeting.MeetId}/>
          ))}
            </div>
       <div>
        <Grid align="center">
          <Grid.Col span={10.4}><Text size='30px' fw={'500'} style={{marginTop:'50px',marginBottom:'30px'}}>My Meeting</Text></Grid.Col>
          <Grid.Col span={1}><Button color='#EE5D20' radius={60} onClick={open} style={{marginTop:'30px'}}> + New Folder</Button></Grid.Col>
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
          
        <Modal opened={opened} onClose={close} title="New Folder" centered>
       <TextInput withAsterisk label="Create Folder"  size="xs" onChange={(event) => setFolderName(event.currentTarget.value)} />
              <Button color='#EE5D20' onClick={close} style={{marginTop:'10px',marginRight:rem(10),marginLeft:rem(235)}}>Cancle</Button>
              <Button variant='outline' color='#EE5D20' style={{marginTop:'10px'}} onClick={() => createNewFolder()}>Create</Button>
      </Modal>   
            </div>
            </div>
            <div style={{height:'10px', backgroundColor:'white'}}></div> 
           <div style={{height:'10px', backgroundColor:'#EE5D20',position: 'fixed',bottom: '0', width: '100%'}}></div> 
    </>
       :
       <>
       {/* {signOut}
       {navigate('/')} */}
       loading
       </>
       }
      </div>
    );
  }
  
  export default MyMeeting