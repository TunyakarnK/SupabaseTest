// import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from '../../supabaseClient.js';
import Navbar from '../../components/Navbar/Navbar.jsx'
import { useSession } from '@supabase/auth-helpers-react';
import MeetingCard from 'src/components/MeetingCard';
import '../../components/MeetingCard.css'
import { useNavigate, Link } from "react-router-dom";
// import SharedMeetingFoldderCard from "src/pages/SharedMeeting/ShareMeetingFolderCard.jsx"
import FolderCard from 'src/components/FolderCard';
import { Grid, ScrollArea, TextInput,Text,rem, Button,Modal ,Radio,Group} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';


function SharedMeeting() {
  // const navigate = useNavigate();
  const session = useSession();
  const [user, setUser] = useState({});
  const [createFolder, setCreateFolder] = useState(false);
  const [folder, setFolder] = useState([]);
  const [folderName, setFolderName] = useState([]);
  const [newMeeting, setNewMeeting] = useState([]);

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
      getFolder();
      getNewMeeting();
    }, [])
      
    async function getNewMeeting() {
      try {
        const { data, error } = await supabase
          .from("attendee")
          .select(`
            meeting(*
            )
          `)
          // .filter("folderId", 'is', null)
          .eq("email", session.user.email)
          //จริงๆๆต้องเอาแค่ meeting ที่พึ่งสร้างใหม่
        if (error) throw error;
        if (data != null) {
          console.log("get New Meeting",data);
          setNewMeeting(data); 
        }
      } catch (error) {
        // alert(error.message);
        console.log("error get New Meeting",error);
      }
    }

    async function getFolder() {
      try {
        const { data, error } = await supabase
          .from("userFolder")
          .select(
            `
            userId,
            folders(folderName,folderId)
            `
          )
          .eq("checkOwner", false)
          .eq("userId", session.user.id)
        // if (error) {console.log(error);}
        if (data != null) {
          console.log("getFolder", data);
          setFolder(data); 
        }
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
  
  export default SharedMeeting;