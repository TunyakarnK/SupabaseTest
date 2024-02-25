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
import { Grid, GridCol, SegmentedControl, Text, rem, Button,Radio,Group } from '@mantine/core';
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
  function feedBack(){
    navigate('/MeetingPage/feedback/' + id, { state: { id } });
  }


  return (
<><div style={{
  // backgroundColor:'#FDEFE9' 
  }}>
<Navbar props={session.user} />
<div style={{ margin:"40px", padding:'20px'}}>
  
<Grid align="center">
<Grid.Col span={1}><Button variant='outline' color='#EE5D20' radius="xl" onClick={() => navigate(-1)} style={{width:'auto',marginBottom:'10px'}}>Back</Button></Grid.Col>
  <Grid.Col span={8}><Text size='30px' fw={'500'} style={{marginTop:'10px',marginLeft:'20px',marginBottom:'30px'}}>My Meeting ❯ </Text></Grid.Col>
  {/* <Grid.Col span={2}><Button color='#EE5D20' variant='outline' radius={60} onClick={()=>statisticButton()} fullWidth style={{marginTop:'10px'}}>Statistic</Button></Grid.Col> */}
  <Grid.Col span={1.5}><Button color='#EE5D20' radius="xl" onClick={()=>feedBack()}>Feedback</Button></Grid.Col>
  <Grid.Col span={1}>
  {meetData === session.user.id && (
        <Link to={"/Inmeeting/"+id}><button className="btn-con" onClick={() => handleButtonClick()}>Start Meeting</button></Link>  
  )}
    
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
    <div style={{ backgroundColor:'#FDEFE9', borderStyle:'solid',borderWidth:'1px',borderColor:'#EE5D20',padding:'10px',borderRadius: '10px' }}>      
        <SegmentedControl
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
        />

      <div style={{ padding:'20px',minHeight: '30vw', height:'auto'}}>
        {links}
      </div>
        
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
    </div></div>
    <div style={{height:'10px', backgroundColor:'#EE5D20',position: 'fixed',bottom: '0', width: '100%'}}></div>
</>
  )
}

export default MeetingPage