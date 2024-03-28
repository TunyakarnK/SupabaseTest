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

const CLIENT_ID = import.meta.env.VITE_CALENDAR_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

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

  const [gapiInited, setGapiInited] = useState(false);
  const [gisInited, setGisInited] = useState(false);
  const [tokenClient, setTokenClient] = useState(null);

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

    useEffect(() => {
      const script1 = document.createElement('script');
      script1.src = 'https://apis.google.com/js/api.js';
      script1.async = true;
      script1.defer = true;
      script1.onload = gapiLoaded;
      document.body.appendChild(script1);
  
      const script2 = document.createElement('script');
      script2.src = 'https://accounts.google.com/gsi/client';
      script2.async = true;
      script2.defer = true;
      script2.onload = gisLoaded;
      document.body.appendChild(script2);
  
      return () => {
        document.body.removeChild(script1);
        document.body.removeChild(script2);
      };
    }, []);
  
    const gapiLoaded = () => {
      window.gapi.load('client', initializeGapiClient);
    };
  
    const initializeGapiClient = async () => {
      await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
      });
      setGapiInited(true);
    };
  
    const gisLoaded = () => {
      const tempTokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', // defined later
      });
      console.log(tempTokenClient);
      setTokenClient(tempTokenClient);
      setGisInited(true);
    };
  
    const handleAuthClick = () => {
      if (!tokenClient) return;
  
      tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
          throw resp;
        }
        // document.getElementById('signout_button').style.visibility = 'visible';
        document.getElementById('authorize_button').innerText = 'Linked to Google Calendar';
        await listUpcomingEvents();
      };
  
      if (gapi.client.getToken() === null) {
        tokenClient.requestAccessToken({ prompt: 'consent' });
      } else {
        tokenClient.requestAccessToken({ prompt: '' });
      }
    };
  
    // const handleSignoutClick = () => {
    //   const token = gapi.client.getToken();
    //   if (token !== null) {
    //     google.accounts.oauth2.revoke(token.access_token);
    //     gapi.client.setToken('');
    //     document.getElementById('content').innerText = '';
    //     document.getElementById('authorize_button').innerText = 'Authorize';
    //     // document.getElementById('signout_button').style.visibility = 'hidden';
    //   }
    // };
  
    const listUpcomingEvents = async () => {
      let response;
      try {
        const request = {
          calendarId: 'primary',
          timeMin: new Date().toISOString(),
          showDeleted: false,
          singleEvents: true,
          maxResults: 10,
          orderBy: 'startTime',
        };
        response = await gapi.client.calendar.events.list(request);
        console.log("ข้อมูลที่ดึงมา", response);
        console.log("Meeting_name", response.result.items[1].summary);
        console.log("meetStartDate", response.result.items[1].start.dateTime);
        const datetimeString = response.result.items[1].end.dateTime;
        const dateTime = new Date(datetimeString);

        // Extracting time portion
        const timeString = dateTime.toLocaleTimeString('en-US', {
          hour12: false, // Use 24-hour format
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });

        // console.log(timeString);
        console.log("meetEndDate", timeString);
        console.log("meetDes", response.result.items[1].description);
        console.log("meetCreate", response.result.items[1].created);
        console.log("meetCreate", response.result.items[1].creator.email);
        console.log("cal_id", response.result.items[1].id);
        // insert meeting from calendar to meeting table and add attendee
        if (response.result.items.length != 0){
          for(var i = 0; i <= response.result.items.length; i++){
            supabase
            .from("meeting")
            .insert({
              meetName: response.result.items[i].summary,
              meetStartDate: response.result.items[i].start.dateTime,
              meetEndDate: timeString,
              meetDes: response.result.items[i].description,
              meetCreate: response.result.items[i].created,
              creatorId: session.user.id,
              cal_id: response.result.items[i].id
            })
            .select()
            .single()
              .then((result) => {
                console.log("fetch new meeting from google calendar", result);
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
              fetchNewMeeting();
            })
          }
      }
      } catch (err) {
        document.getElementById('content').innerText = err.message;
        return;
      }
    };

    

    return (
      <div className="App">
        {Object.keys(user).length !== 0 ?
    <>
        <header>
        <Navbar props={user}/>
        </header>

       <div style={{backgroundColor:'#FDEFE9', margin:"50px", padding:'20px'}}>
        <Grid align="center">
        <Grid.Col span={9}><Text size='30px' fw={'500'} style={{marginTop:'20px',marginBottom:'30px'}}>New Meeting</Text></Grid.Col>
        {/* <Grid.Col span={0}></Grid.Col> */}
        {/* <Grid.Col span={0.5}><Button id="signout_button" onClick={handleSignoutClick} style={{ visibility: 'hidden' }}>Sign Out</Button></Grid.Col> */}
        <Grid.Col span={1}><Button color='#EE5D20' radius={60} id="authorize_button" onClick={handleAuthClick} style={{ visibility: gapiInited && gisInited ? 'visible' : 'hidden' }}>Linked to Google Calendar</Button></Grid.Col>
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
          <Grid.Col span={10}><Text size='30px' fw={'500'} style={{marginTop:'50px',marginBottom:'30px'}}>My Meeting</Text></Grid.Col>
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
              <Button color='#EE5D20' onClick={close} style={{marginTop:'10px',marginRight:rem(10),marginLeft:rem(235)}}>Cancel</Button>
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
  
  export default MyMeeting;