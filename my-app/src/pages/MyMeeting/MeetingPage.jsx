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
import { SegmentedControl, Text, rem } from '@mantine/core';
import classes from 'src/components/Detail/NavbarSegmented.module.css';



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

function MeetingPage(props) {
const [thisUser, setThisUser] = useState({});  
const [user, setUser] = useState();
const navigate = useNavigate();
const { id } = useParams();
// const {user} = useParams();
const [ meetData, setMeetData ] = useState ([]);
const [ isRunning, setIsRunning ] = useState(false);
const [ meetStartTime, setMeetStartTime ] = useState('');
const [ meetStopTime, setMeetEndTime ] = useState('');
const [ toggle, setToggle ] = useState(1)
const [isEnded, setIsEnded ] = useState(false);
const [section, setSection] = useState('Details');
const [active, setActive] = useState('Billing');



  async function getUserData() {
    await supabase.auth.getUser().then((value) => {
      if (value.data?.user) {
        setThisUser(value.data.user);
        // console.log(value)
      }
    });
  }
  console.log("isLoad");
  getUserData();
  console.log(thisUser);

function updateToggle(id) {
  setToggle(id)
}
const meetEndTime1 = new Date();
const meetStartTime1 = new Date();

const handleButtonClick = () => {
    if (isRunning) {
      setMeetEndTime(new Date());
      
      console.log(meetEndTime1.toLocaleTimeString("th-TH"));

      supabase.from("meeting").update({
        meetEndTime: meetEndTime1.toLocaleTimeString(),
      })
      .eq('meetId', id)
      .then(result => {
        console.log(result);
      });
    } else {
      setMeetStartTime(new Date());
      console.log(meetStartTime1.toLocaleTimeString("th-TH"));
      supabase.from("meeting").update({
        meetStartTime: meetStartTime1.toLocaleTimeString(),
      })
      .eq('meetId', id)
      .then(result => {
        console.log(result);
      });
    }
    setIsRunning(!isRunning);
    if (isRunning) {
      setIsEnded(true);
    }
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
<>
{/* <Navbar props={user} /> */}
<div style={{margin:"20px"}}>
{/* <Navbar></Navbar> */}
<Link to="/MyMeeting"><button variant="contained">Back</button></Link>
    <div className='tabside'>
      <ul>
        <li onClick={() => updateToggle(1)}><button>Detail</button></li>
        <li onClick={() => updateToggle(2)}><button>FeedBack</button></li>
        <li><Link to={"/Inmeeting/"+id}><button className="btn-con">Start Meeting</button></Link></li>

         {/* li onClick={() => updateToggle(3)}>{isEnded ? (<p>Ended</p>): */}
          {/* // (<Link><button onClick={handleButtonClick}>{isRunning ? 'STOP' : 'START'}</button></Link>)}</li> */}
    
      </ul>
    </div>
    {/* <div>user:{state.user.user_metadata.full_name}</div> */}
    <nav className={classes.navbar}>
      <div>      
        <SegmentedControl
          value={section}
          onChange={(value) => setSection(value)}
          transitionTimingFunction="ease"
          style={{ width: rem(700) }}
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
    </div>
</>
  )
}

export default MeetingPage
