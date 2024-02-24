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
    const fetchMeeting = async () => {
      const { data, error } = await supabase
        .from("meeting")
        .select()
        .eq("meetId", id);
      if (data) {
        console.log("lllll", data);
        setMeetData(data);
        console.log(data[0]);
      }
    };
    
    const fetchObj = async () => {
      const { data, error } = await supabase
        .from("meetObj")
        .select("folderId, objDes")
        .eq("meetId", id);
      if (data) {
        console.log(data);
        setMeetObjData(data);
      }
    };
    fetchMeeting();
    fetchObj();
    // fetchNextMeeting();
  }, [nextMeet]);

  function addFol(fol) {
    setArrFol((current) => [...current, fol]);
    console.log(arrFol.length);
    console.log(setArrFol);
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
      meetEndTime: meetEndTime.toLocaleTimeString()
    })
    .eq('meetId', id)
    .then(result => {
      console.log(result);
    });

    // create next meeting
    supabase
    .from("meeting")
    .insert({
      folderId: meetData[0]?.folderId,
      creatorId: session.user.id
    })
    .then(result => {
      console.log("Test Create new meeting",result);
      fetchNextMeeting();
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
      supabase
      .from("meetObj")
      .update({ 
        meetId: data[0].meetId
      })
      .eq("meetId", meetData[0].meetId)
      .then((result) => {
        console.log("change meetId", result);
      })
      
    // send follow up
      for (var i = 0; i <= arrFol.length + 1; i++) {
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

  // const addfol = () => {

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
        <Text size="xl">Meeting: {meetData[0]?.meetName}</Text>
      </Grid.Col>
      <Grid.Col span={3} />
      <Grid.Col span={1} >
      {/* <Link to={'/MeetingPage/'+id}></Link> onClick={() => sendData()} */}
      <Link to={'/MeetingPage/'+id}>
        <Button radius='xl' color="#EE5D20" onClick={() => sendData()}>End meeting</Button>
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
        {con}
        </div>
    //   </div>
    // </div>
    // </div>
  );
}

export default Conclusion;
