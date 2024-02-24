import React from 'react'
import { useEffect, useState } from 'react'
import { supabase } from 'src/supabaseClient';
import { useParams, Link } from 'react-router-dom'
import "./meetingpage.css"
import Feedback from '../../components/Feedback/Feedback'
import Detail from 'src/components/Detail/Detail';
import Note from 'src/components/Note';
import Detail_Conclusion from 'src/components/Detail_Conclusion';
import Navbar from 'src/components/Navbar/Navbar';
import InmeetingPage from './InmeetingPage';
import { useNavigate } from "react-router-dom";
import { Grid, GridCol, SegmentedControl, Text, rem, Button } from '@mantine/core';
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
  Feedback: [
    {  label: 'Feedback', value: <Feedback />},
  ],
};

function MeetingPage() {
const [thisUser, setThisUser] = useState({});  
const navigate = useNavigate();
const { id } = useParams();
// const {user} = useParams();
const [ meetData, setMeetData ] = useState ([]);
const [ isRunning, setIsRunning ] = useState(false);
// const [ meetStartTime, setMeetStartTime ] = useState('');
const [ meetStopTime, setMeetEndTime ] = useState('');
const [ toggle, setToggle ] = useState(1)
const [isEnded, setIsEnded ] = useState(false);
const [section, setSection] = useState('Details');
const [active, setActive] = useState('Billing');
const session = useSession();



// useEffect(() =>{
//   // fetchMeeting();
//   console.log(data);
//   console.log(meetData);
// }, [])

function updateToggle(id) {
  setToggle(id)
}



const fetchCreator = async () => {
  try {
    const { data, error } = await supabase
      .from("meeting")
      .select("creatorId")
      .eq("meetId", id)
      .eq("creatorId", session.user.id);
    if (data) {
      console.log(",,,", data[0].creatorId);
      setMeetData(data[0].creatorId);
    }
  } catch (error) {
    console.error("creatorId not equal current user!", error);
  }
};

useEffect(() => {
  fetchCreator()
}, []);

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

  const links = tabs[section].map((item) => (  
    <text
      // className={classes.link}
      data-active={item.label === active || undefined}
      // href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
      }}
    >
      <span>{item.value}</span>
    </text>
  ));


  return (
<><div style={{ }}>
<Navbar props={session.user} />
<div style={{margin:"20px", }}>
{/* <Navbar></Navbar> */}
<Grid>
  <Grid.Col span={{ base: 12, xs: 4 }}>
    {meetData !== session.user.id ? (
      <Link to="/SharedMeeting"><Button color='#EE5D20' radius="xl">Back</Button></Link>)
        :
      (<Link to="/MyMeeting" style={{marginLeft:"20px", }}><Button color='#EE5D20' radius="xl">Back</Button></Link>)}

  </Grid.Col>
  <Grid.Col span={{ base: 12, xs: 6 }}>  
  </Grid.Col>
  <Grid.Col span={{ base: 12, xs: 2 }} justify="flex-end">
    
  </Grid.Col></Grid>
<div>      
      
</div>
<div>
<Grid>
  <Grid.Col span={{ base: 12, xs: 4 }}>
  <Text size='xl' style={{marginLeft:'20px'}}>My Meeting
   {/* {meetData.map((meetData, index) => (
        <div key={index}>
          <p> My Meeting {meetData?.meetName || "ยังไม่มีงับ"}</p> 
        </div>
      ))} */}
      </Text>
  </Grid.Col>
  <Grid.Col span={{ base: 12, xs: 5 }}></Grid.Col>
  <Grid.Col span={{ base: 12, xs: 1 }}></Grid.Col>
  <Grid.Col span={{ base: 12, xs: 2 }} justify="flex-end">
  {meetData === session.user.id && (
        <Link to={"/Inmeeting/"+id}><button className="btn-con" onClick={() => handleButtonClick()}>Start Meeting</button></Link>  
  )}
        </Grid.Col></Grid>
  
</div>
    {/* <div>user:{state.user.user_metadata.full_name}</div> */}
    <nav className={classes.navbar}>
      <div>      
        <SegmentedControl
          value={section}
          onChange={(value) => setSection(value)}
          transitionTimingFunction="ease"
          color='#EE5D20'
          style={{ width: rem(700) , 
            backgroundColor:'#FDEFE9',
          }}
          data={[
            { label: 'Details', value: 'Details' },
            { label: 'Note', value: 'Note' },
            { label: 'Conclusion', value: 'Conclusion' },
            { label: 'Feedback', value: 'Feedback' },
          ]}
        />
      </div>

      <div className={classes.navbarMain}>
        {links}
      </div>

      {/* <div className={classes.footer}>

        <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
          <span>Logout</span>
        </a>
      </div> */}
    </nav>


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
    </div></div>
</>
  )
}

export default MeetingPage