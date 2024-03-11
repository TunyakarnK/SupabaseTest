import React from 'react'
import { useEffect, useState } from 'react'
import { supabase } from 'src/supabaseClient';
import { useParams, Link } from 'react-router-dom'
import "./meetingpage.css"
import Feedback from '../../components/Feedback/Feedback'
import { useLocation } from 'react-router-dom';
import Detail from 'src/components/Detail/Detail';
import Note from 'src/components/Note';
import Detail_Conclusion from 'src/components/Detail_Conclusion';
import Navbar from 'src/components/Navbar/Navbar';
import InmeetingPage from './InmeetingPage';
import { useNavigate } from "react-router-dom";
import { Grid, GridCol, SegmentedControl, Text, rem, Button,Radio,Group,Tabs,Badge  } from '@mantine/core';
import classes from 'src/components/Detail/NavbarSegmented.module.css';
import { useSession } from '@supabase/auth-helpers-react';


const tabs = {
  Details: [
    { label: 'Details', value: <Detail /> },
  ],
  Note: [
    { label: 'Note', value: <Note />},
  ],
  Conclusion: [
    { label: 'Conclusion', value: <Detail_Conclusion /> },
  ],
  // Feedback: [
  //   {  label: 'Feedback', value: <Feedback />},
  // ],
};

function MeetingPage(props) {
const [thisUser, setThisUser] = useState({});  
const navigate = useNavigate();
const { id } = useParams();
const {user} = useParams();
const [ meetData, setMeetData ] = useState ([]);
const [ isRunning, setIsRunning ] = useState(false);
// const [ meetStartTime, setMeetStartTime ] = useState('');
const [ meetStopTime, setMeetEndTime ] = useState('');
const [ toggle, setToggle ] = useState(1)
const [isEnded, setIsEnded ] = useState(false);
const [section, setSection] = useState('Details');
const [active, setActive] = useState('');
const session = useSession();


useEffect(() =>{
  // fetchMeeting();
  // console.log(data);
  console.log(meetData);
  fetchCreator()
  console.log(meetData);
}, [session])

function updateToggle(id) {
  setToggle(id)
}

const fetchCreator = async () => {
  try {
    const { data, error } = await supabase
      .from("meeting")
      .select("creatorId, meetStatus, folderId")
      .eq("meetId", id)
    if (data) {
      console.log(",,,", data[0].creatorId);
      console.log(",,,", data[0].meetStatus);
      console.log(",,,", data[0].folderId);
      setMeetData(data[0]);
    }
  } 
  catch (error) {
    console.error("creatorId not equal current user!", error);
  }
};

// useEffect(() => {
  
// }, []);

const meetStartTime = new Date();
const handleButtonClick = () => {
  supabase
  .from("meeting")
  .update({
    meetStartTime: meetStartTime.toLocaleTimeString()
  })
  .eq('meetId', id)
  .then(result => {
    console.log(result);
  });
  };

  // const links = tabs[section].map((item) => (  
  //   <text
  //     // className={classes.link}
  //     data-active={item.label === active || undefined}
  //     // href={item.link}
  //     key={item.label}
  //     onClick={(event) => {
  //       event.preventDefault();
  //       setActive(item.label);
  //     }}
  //   >
  //     <span>{item.value}</span>
  //   </text>
  // ));
  function feedBack(){
    navigate('/MeetingPage/feedback/' + id, { state: { id } });
  }


  return (

    <div style={{
  // backgroundColor:'#FDEFE9' 
  }}>
    {Object.keys(session.user).length !== 0 ?
    <>
<Navbar props={session.user} />
<div style={{ margin:"40px", padding:'20px'}}>
  
<Grid align="center">
<Grid.Col span={1}>
  { meetData.creatorId === session.user.id ? 
  (<Link to={"/MyMeeting/Folder/" + meetData.folderId }><Button variant='outline' color='#EE5D20' radius="xl" style={{width:'auto',marginBottom:'10px'}}>Back</Button></Link>)
  :
  (<Link to={"/SharedMeeting/Folder/" + meetData.folderId }><Button variant='outline' color='#EE5D20' radius="xl" style={{width:'auto',marginBottom:'10px'}}>Back</Button></Link>)  }
  
  
  </Grid.Col>
  <Grid.Col span={7.5}><Text size='30px' fw={'500'} style={{marginTop:'10px',marginLeft:'20px',marginBottom:'30px'}}>My Meeting ❯ </Text></Grid.Col>
  <Grid.Col span={1.3}><Badge variant="outline" color="#EE5D20" size="xl">{meetData.meetStatus ? "Ended" : "Incoming"}</Badge></Grid.Col>
  <Grid.Col span={1}><Button color='#EE5D20' radius="xl" onClick={()=>feedBack()}>Feedback</Button></Grid.Col>
  <Grid.Col span={1}>
  {( meetData.creatorId === session.user.id && meetData.meetStatus === false) && (
        <Link to={"/Inmeeting/"+id}><Button color='#EE5D20' radius="xl" onClick={() => handleButtonClick()}>Start Meeting</Button></Link>  
  )}
  {/* :{
  (<Button color='' disabled style={{marginLeft:'20px',marginBottom:'30px', borderColor: '#EE5D20',  backgroundColor: "white"}} radius="xl" onClick={() => handleButtonClick()}>Start Meeting</Button>)} */}
    
    </Grid.Col>
  <Grid.Col span={1}></Grid.Col>
</Grid>

  {/* {meetData.map((meetData, index) => (
        <div key={index}>
          <p> My Meeting {meetData?.meetName || "ยังไม่มีงับ"}</p> 
        </div>
      ))} */}

    {/* <div>user:{state.user.user_metadata.full_name}</div> */}
    {/* <nav className={classes.navbar}> */}
    <div style={{ backgroundColor:'white', borderStyle:'solid',borderWidth:'1px',borderColor:'#EE5D20',padding:'10px',borderRadius: '10px' }}>      
        {/* <SegmentedControl
        classNames='classes'
          fullWidth withItemsBorders={false} 
          size='lg'
          value={section}
          onChange={(value) => setSection(value)}
          transitionTimingFunction="ease"

          color='#EE5D20'
          style={{ 
            backgroundColor:'#FDEFE9',borderBottom: '1px solid #EE5D20', paddingBottom:'10px'
          }}
          data={[
            { label: 'Details', value: 'Details' },
            { label: 'Note', value: 'Note' },
            { label: 'Conclusion', value: 'Conclusion' },
            // { label: 'Feedback', value: 'Feedback' },
          ]}
        /> */}
      <Tabs color="orange" defaultValue="Detail" >
      <Tabs.List >
        <Tabs.Tab value="Detail">Detail</Tabs.Tab>
        <Tabs.Tab value="Note">Meeting Note</Tabs.Tab>
        <Tabs.Tab value="Conclusion">Conclusion</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="Detail">
      <Detail />
      </Tabs.Panel>

      <Tabs.Panel value="Note">
      <Note />
      </Tabs.Panel>

      <Tabs.Panel value="Conclusion">
      <Detail_Conclusion />
      </Tabs.Panel>
    </Tabs>

      {/* <div style={{ padding:'20px',minHeight: '30vw', height:'auto'}}>
        {links}
      </div> */}
        
      </div>

      {/* <div className={classes.footer}>

        <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
          <span>Logout</span>
        </a>
      </div> */}
    {/* </nav> */}


    {/* ปุ่ม START/ STOP เหลือ assign เพื่มใน database ว่าประชุมเสร็จแล้ว*/}
    {/* {isEnded ? (<p>Ended</p>):
    (<button onClick={handleButtonClick()}>{isRunning ? 'STOP' : 'START'}</button>)} */}
    
    {/* บอกเวลา */}
    {/* {meetStartTime1 && <p>Start Time: {meetStartTime1.toLocaleTimeString()}</p>}
    {meetEndTime1 && <p>Stop Time: {meetEndTime1.toLocaleTimeString()}</p>} */}

{/* <div className={toggle === 1 ? "show-content" : "content"}>
      <h1>Detail</h1>
      <Detail />
  
    </div>
    <div className={toggle === 2 ? "show-content" : "content"}>
      <h1>FeedBack</h1>
      <Feedback />
    </div> */}
{/* 
    <div className={toggle === 3 ? "show-content" : "content"}>
      <h1>กำลังประชุม</h1>
      <InmeetingPage />
    </div> */}
    </div>
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
  )
}

export default MeetingPage