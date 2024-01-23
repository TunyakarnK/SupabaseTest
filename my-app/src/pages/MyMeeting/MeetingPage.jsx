import React from 'react'
import { useEffect, useState } from 'react'
import { supabase } from 'src/supabaseClient';
import { useParams, Link } from 'react-router-dom'
import "./meetingpage.css"
import Feedback from '../../components/Feedback/Feedback'
import Detail from 'src/components/Detail/Detail';
import InmeetingPage from './InmeetingPage';

function MeetingPage() {

const { id } = useParams();
const [ meetData, setMeetData ] = useState ([]);
const [ isRunning, setIsRunning ] = useState(false);
const [ meetStartTime, setMeetStartTime ] = useState('');
const [ meetStopTime, setMeetEndTime ] = useState('');
const [ toggle, setToggle ] = useState(1)
const [isEnded, setIsEnded ] = useState(false);


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




  return (
<>
<Link to="/MyMeeting"><button variant="contained">Go to update</button></Link>
    <div className='tabside'>
      <ul>
        <li onClick={() => updateToggle(1)}><button>Detail</button></li>
        <li onClick={() => updateToggle(2)}><button>FeedBack</button></li>
        <li><Link to={"/Inmeeting/"+id}><button className="btn-con">Start Meeting</button></Link></li>

         {/* li onClick={() => updateToggle(3)}>{isEnded ? (<p>Ended</p>): */}
          {/* // (<Link><button onClick={handleButtonClick}>{isRunning ? 'STOP' : 'START'}</button></Link>)}</li> */}
    
      </ul>
    </div>


    {/* ปุ่ม START/ STOP เหลือ assign เพื่มใน database ว่าประชุมเสร็จแล้ว*/}
    {/* {isEnded ? (<p>Ended</p>):
    (<button onClick={handleButtonClick()}>{isRunning ? 'STOP' : 'START'}</button>)} */}
    
    {/* บอกเวลา */}
    {/* {meetStartTime1 && <p>Start Time: {meetStartTime1.toLocaleTimeString()}</p>}
    {meetEndTime1 && <p>Stop Time: {meetEndTime1.toLocaleTimeString()}</p>} */}

<div className={toggle === 1 ? "show-content" : "content"}>
      <h1>Detail</h1>
      <Detail />
  
    </div>
    <div className={toggle === 2 ? "show-content" : "content"}>
      <h1>FeedBack</h1>
      <Feedback />
    </div>
{/* 
    <div className={toggle === 3 ? "show-content" : "content"}>
      <h1>กำลังประชุม</h1>
      <InmeetingPage />
    </div> */}
</>
  )
}

export default MeetingPage