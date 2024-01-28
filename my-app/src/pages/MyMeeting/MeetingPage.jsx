import React from 'react'
import { useEffect, useState } from 'react'
import { supabase } from 'src/supabaseClient';
import { useParams, Link } from 'react-router-dom'
import "./meetingpage.css"
import Feedback from '../../components/Feedback/Feedback'
import Detail from 'src/components/Detail/Detail';
import { useSession } from '@supabase/auth-helpers-react';

function MeetingPage() {

const { id } = useParams();
const [ meetData, setMeetData ] = useState (null);
const [ isRunning, setIsRunning ] = useState(false);
const [ meetStartTime, setMeetStartTime ] = useState('');
const [ meetStopTime, setMeetEndTime ] = useState('');
const [ toggle, setToggle ] = useState(1)
const [isEnded, setIsEnded ] = useState(false);
const session = useSession();

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
