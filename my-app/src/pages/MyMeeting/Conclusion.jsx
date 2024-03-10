import React, { useState } from "react";
import { supabase } from "src/supabaseClient";
import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSession } from '@supabase/auth-helpers-react';
import { NavLink } from "react-router-dom";
import { Grid, Button,Text, Center,Container, Textarea, ActionIcon,rem, Checkbox,TextInput,SimpleGrid, Skeleton } from "@mantine/core";
import { IconCirclePlus } from '@tabler/icons-react';
import "./inmeetingpage.css"
import "./conclusion.css";

function Conclusion() {
  const { id } = useParams();
  const session = useSession();
  const [ meetData, setMeetData ] = useState([]);
  const [ con, setCon ] = useState("");
  const [ fol, setFol ] = useState("");
  const [ arrFol, setArrFol ] = useState([]);
  const [ meetObjData, setMeetObjData ] = useState([]);
  const [ nextMeet, setNextMeet ] = useState(null);

  useEffect(() => {
    // const fetchMeeting = async () => {
    //   const { data, error } = await supabase
    //     .from("meeting")
    //     .select()
    //     .eq("meetId", id);
    //   if (data) {
    //     console.log("lllll", data);
    //     setMeetData(data);
    //     console.log(data[0]);
    //   }
    // };
    
    fetchObj();
    // fetchObj();
    // fetchNextMeeting();
  }, [nextMeet]);

  // const fetchObj = async () => {
  //   const { data, error } = await supabase
  //     .from("meetObj")
  //     .select("folderId, objDes, objStatus")
  //     .eq("meetId", id)
  //     .eq("folderId", meetData[0]?.folderId)
  //     // .eq("objStatus", true);
  //   if (data) {
  //     console.log(data);
  //     setMeetObjData(data);
  //   }
  // };

  const fetchObj = async () => {
    await supabase
    .from("meeting")
    .select()
    .eq("meetId", id)
    .then((result) => {
      console.log("fetchO", result.data[0]);
      setMeetData(result.data[0])
        supabase
        .from("meetObj")
        .select("objId, objDes, objStatus")
        .eq("meetId", id)
        .eq("folderId", result.data[0].folderId) // .eq("objStatus", false)
        .then((result) => {
          console.log("fetchObjjjjjjjjjjjjjjj", result.data);
          setMeetObjData(result.data);
        })
    });
  }

  function addFol(fol) {
    setArrFol((current) => [...current, fol]);
    console.log(arrFol.length);
    setFol("")
  }
  //
  const meetEndTime = new Date();

  function sendData() {
    console.log(arrFol);
    // send conclusion
    if (con != "") {
      supabase
      .from("conclusion")
      .insert({
        meetId: id,
        con: con,
      })
      .then((result) => {
        console.log(result);
      });
    }
    // end time
    supabase
    .from("meeting")
    .update({
      meetEndTime: meetEndTime.toLocaleTimeString(),
      meetStatus: true
    })
    .eq('meetId', id)
    .then(result => {
      console.log(result);
    });
    // create next meeting
    supabase
    .from("meeting")
    .insert({
      folderId: meetData.folderId,
      creatorId: session.user.id,
      meetName: 'Untitled Meeting',
      meetCreate: new Date()
    })
    .select()
    .then((result) => {
      console.log("Create new meeting", result);
      supabase
      .from("attendee")
      .insert({
        meetId: result.data[0].meetId,
        email: session.user.email,
        userId: session.user.id
      })
      .then((result) => {
        console.log("insert Attendee******", result);
        // window.location.reload(); 
      })
  // send objective not yet
      for (var i = 0; i <= meetObjData.length-1; i++){
        if (meetObjData[i]?.objStatus === false) {
        supabase
        .from("meetObj")
        .insert({ 
          folderId: result.data[0].folderId,
          objDes: meetObjData[i]?.objDes,
          meetId: result.data[0].meetId
        })
        .then((result) => {
          console.log("insert meet objective not yet", result);
        });
        }
      }
// send follow up
      for (var i = 0; i <= arrFol.length; i++) {
        console.log(arrFol[i]);
        supabase
        .from("meetObj")
        .insert({
          folderId: result.data[0].folderId,
          meetId: result.data[0].meetId,
          objDes: arrFol[i],
        })
        .then((result) => {
          console.log("send follow up", result);
        });
      }
    });
  }

  // delete follo-up
  const deltefol = (e) => {
    const name = e.target.value;
    console.log("jjjj", name);
    setArrFol(arrFol.filter((items) => items !== name));
  };

  const fetchNextMeeting = async () => {
    const { data, error } = await supabase
    .from("meeting")
    .select(
      `
      meetId,
      folders(
        folderId
      )
      `
    )
    .eq("folderId", meetData[0]?.folderId)
    .order("meetId", { ascending: false })
    .limit(1);
    if (data) {
      console.log("fetch Next Meeting", data[0].meetId);
      // alert(data[0].meetId)
      console.log(data[0].meetId);
      setNextMeet(data[0].meetId);
      for (var i = 0; i <= meetObjData.length-1; i++){
      if (meetObjData[i]?.objStatus === false) {
      supabase
      .from("meetObj")
      .insert({ 
        folderId: meetObjData[0]?.folderId,
        objDes: meetObjData[i]?.objDes,
        meetId: data[0].meetId
      })
      .then((result) => {
        console.log("insert meet objective", result);
      });
      }
    }
      
    // send follow up
      for (var i = 0; i <= arrFol.length; i++) {
        console.log(arrFol[i]);
        supabase
        .from("meetObj")
        .insert({
          folderId: meetData[0]?.folderId,
          meetId: data[0].meetId,
          objDes: arrFol[i],
        })
        .then((result) => {
          console.log(result);
        });
      }
    }
  }


  for (var i = 0; i <= meetObjData.length-1; i++){
    if (meetObjData[i]?.objStatus === false) {
    console.log("1", meetObjData[i]?.objDes); }
  }
  // const addfol = () => 

  // }
  return (
    <div>
      <div className='Navbar'style={{height:"60px", boxShadow:'1px 1px 10px 5px #dfd9ca'}} >
        <div className="container">
        <NavLink to="/Profile" className="title">
        Logo
      </NavLink>
      <div className={'nav-elements  ${showNavbar && "active"}'}>
            <ul>
              <li/><li/>
              <li>
                <div>{session.user.user_metadata.name}</div>
              </li><div>
                <img className="avatar"
                    src={session.user.user_metadata.avatar_url}
                    />
                    </div>
            </ul></div></div>
    </div>

    <div style={{margin:"20px"}}>
      <Grid justify="center" align='center' style={{ marginLeft:'70px',marginRight:'80px' }}>
      
      <Grid.Col span={8}>
      <Text size='30px' fw={'500'} style={{marginTop:'20px',marginLeft:'20px',marginBottom:'10px'}}>Meeting: {meetData[0]?.meetName}</Text>
      </Grid.Col>
      <Grid.Col span={2.5} />
      <Grid.Col span={1} >
      <Link to={'/MeetingPage/'+id}><Button radius='xl' color="#EE5D20" onClick={ () => sendData() } style={{marginTop:'20px',marginLeft:'20px',marginBottom:'10px'}}>End meeting</Button>
        </Link>
      
      </Grid.Col>
      </Grid>

      
      <Grid  style={{marginTop:"20px", marginLeft:'70px',marginRight:'70px',borderColor:'#EE5D20' }}>
      <Grid.Col span={6} style={{backgroundColor: '#FDEFE9',height:"500px"}} >
      <div style={{marginLeft:'40px',}}><Text c="#EE5D20" size='xl' fw={500} style={{marginTop:'3%'}}>Objective</Text>

      {/* map obj */}
      {meetObjData.map((listobj) => (
        <div>{listobj.objDes}</div>
        ))}

      <Center>
      
      </Center></div>
      </Grid.Col>
      <Grid.Col span={0.5} style={{backgroundColor: '#FDEFE9',height:"500px", alignItems:'center'}}>
        <div style={{backgroundColor: '#EE5D20',width:'2%', height:"500px", alignItems:'center'}}></div>
      </Grid.Col>
      <Grid.Col span={5.5} style={{backgroundColor: '#FDEFE9',height:"500px", alignItems:'center',borderColor:'#EE5D20'}}>
      <div style={{borderColor:'#EE5D20'}}><Text c="#EE5D20" size='xl' fw={500} style={{marginTop:'3%'}}>Meeting Conclusion</Text>
      <Textarea
      radius="xs"
      autosize
        minRows={5}
        maxRows={5}
      placeholder="Conclusion..."
      style={{marginTop:'20px',
       width:'90%'}}
       value={con}
       onChange={(e) => setCon(e.target.value)}
    />
      </div>
      <div style={{borderColor:'#EE5D20'}}><Text c="#EE5D20" size='xl' fw={500} style={{marginTop:'3%'}}>Follow-Up</Text>
      {arrFol.map((listfol) => (
          <div>
            {listfol}
            <button value={listfol} onClick={deltefol}>
              x
            </button>
          </div>
        ))}
        
      <TextInput
      value={fol}
      onChange={(e) => setFol(e.target.value)}
      radius="sm"
      size="md"
      placeholder="Add Follow-up"
      style={{width:'90%'}}
      rightSectionWidth={42}
      rightSection={
        <ActionIcon variant="transparent" aria-label="x" color="#EE5D20"  onClick={() => addFol(fol)}>
          <IconCirclePlus style={{ width: '70%', height: '70%' }} stroke={1.5} />
        </ActionIcon>
      }
    />
      
      </div>
      </Grid.Col>
      </Grid>
      </div>

    {/* <div style={{margin:"20px"}}> */}
      {/* <Link to={'/MeetingPage/'+id}><button className="btn-con" onClick={() => sendData()}>End meeting</button></Link> */}

      {/* <div className="flex-container">
        <div> */}
        {/* <p className="p">Objective</p> */}
        {/* </div>
        <div>
        <p className="p">Conclusion</p>
        <textarea className="text-con" rows="5" cols="45"></textarea> */}
        /* <br />
        <p className="p">Follow-Up</p>
        {arrFol.map((listfol) => (
          <div>
            {listfol}
            <button value={listfol} onClick={deltefol}>
              x
            </button>
          </div>
        ))}
        <input
          class="form-control"
          type="text"
          value={fol}
          placeholder="follow-up"
          onChange={(e) => setFol(e.target.value)}
        ></input>
        <button class="btn btn-primary" onClick={() => addFol(fol)}>
          +
        </button>
        {/* {fol} */}
        <div style={{height:'10px', backgroundColor:'#EE5D20',position: 'fixed',bottom: '0', width: '100%'}}></div>
        </div>
    //   </div>
    // </div>
    // </div>
  );
}

export default Conclusion;
