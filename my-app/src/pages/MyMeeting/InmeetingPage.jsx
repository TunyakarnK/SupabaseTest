import React, { useState } from "react";
import { supabase } from "src/supabaseClient";
import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Grid, Button,Text, Center,Container, Textarea, ActionIcon,rem, Checkbox,TextInput } from "@mantine/core";
import { IconCircleXFilled } from '@tabler/icons-react';
import { IconCirclePlus } from '@tabler/icons-react';
import "./inmeetingpage.css"
import { NavLink } from "react-router-dom";
import { useSession } from '@supabase/auth-helpers-react';
import Navbar from "src/components/Navbar/Navbar";

function InmeetingPage() {
  const { id } = useParams();
  const session = useSession(); 
  const [meetData, setMeetData] = useState([]);
  const [meetObjData, setMeetObjData] = useState([]);
  const [newObj, setNewObj] = useState("");
  const [newNote, setNewNote] = useState();
  const [isChecked, setChecked] = useState(false);

  useEffect(() => {
    const fetchMeeting = async () => {
      const { data, error } = await supabase
        .from("meeting")
        .select()
        .eq("meetId", id);
      if (data) {
        console.log("lllll", data);
        setMeetData(data[0]);
        console.log(data[0]);
      }
    };
    fetchMeeting();
    console.log(session);
    fetchObj();
  }, []);
  console.log("1",meetData[0]?.folderId);
  console.log("meetData",meetData);

  const fetchObj = async () => {
    const { data, error } = await supabase
      .from("meetObj")
      .select("objId, objDes, objStatus")
      .lte("meetId", id)
      .eq("folderId", meetData.folderId)
      .eq("objStatus", false);
    if (data) {
      console.log("fetchObj", data);
      setMeetObjData(data);
    }
  };

  function addObj(e) {
    e.preventDefault();
    supabase
      .from("meetObj")
      .insert({
        folderId: meetData[0]?.folderId,
        meetId: id,
        objDes: newObj,
      })
      .then((result) => {
        console.log(result);
        fetchObj(); 
        setNewObj("");
      });
  }

  async function checkObj(objId) {
    supabase
      .from("meetObj")
      .update({
        objStatus: !objId.objStatus
      })
      .eq('objId', objId.objId)
      .then((result) => {
        console.log(result);
        console.log(objId.objStatus);
      });
  }

  async function deleteObj(objId) {
    supabase
      .from("meetObj")
      .delete()
      .eq('objId', objId.objId)
      .then(() => {
        console.log("Deleted");
        fetchObj();
      });
  }

  function addNote(){
    // set Note value
    // setNewNote(event.target.value)
    supabase
    .from("notes")
    .insert({
      meetId: id,
      noteDes: newNote
    })
    .then((result) => {
      console.log(result);
    })
}

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
      <Grid align='center' style={{ marginLeft:'70px' }}>
      
      <Grid.Col span={8}>
        <Text size="xl">Meeting: {meetData[0]?.meetName}</Text>
      </Grid.Col>
      <Grid.Col span={1.5} />
      <Grid.Col span={1} >
        <Link to={"/Conclusion/"+id}><Button radius='xl' color="#EE5D20" onClick={addNote}>Conclusion</Button></Link> 
      </Grid.Col>
      </Grid>
      
      <Grid  style={{marginTop:"20px", marginLeft:'70px',borderColor:'#EE5D20' }}>
      <Grid.Col span={{ base: 12, xs: 3 }} style={{backgroundColor: '#EE5D20',height:"500px"}} >
      <Center radius="sm" style={{ backgroundColor:'#FDEFE9'}}><Text c="#EE5D20" size='xl' fw={500} style={{ marginTop:'5%',marginBottom:'5%'}}>Objective</Text></Center>
      {/* <Center > */}
        <div style={{marginTop:"20px" ,marginBottom:"20px", height:'70%' }}>
            {meetObjData.map( meetObj  => (
              <div style={{}}>
              <Grid align="center" size={"xs"}> 
              <Grid.Col span={1}></Grid.Col> 
              <Grid.Col span={8}>     
                  <div key={meetObj.objId} style={{width:'50%' }} ></div>
                  <Text c="#FDEFE9" size="lg">{meetObj.objDes !== null ? meetObj.objDes : "Have no objective"}</Text>    
              </Grid.Col>             
              <Grid.Col span={1} align='right'>
                {/* <Container align="center"> */}
                <Checkbox 
                  labelPosition="left"    
                  size="xs"          
                  color="#FDEFE9"
                  variant="outline"
                  onClick={() => checkObj(meetObj)}
                  style={{widght:'100%'}}
                  />
                  {/* <input className="check-obj"type="checkbox" onClick={() => checkObj(meetObj)}
                  style={{backgroundColor:'#FDEFE9', borderBlockColor:'#EE5D20'}}></input> */}
              </Grid.Col>
               <Grid.Col span={1}>
                  <ActionIcon variant="transparent" aria-label="x" color="#FDEFE9" onClick={() => deleteObj(meetObj)}>
                  <IconCircleXFilled style={{ width: '70%', height: '70%' }} stroke={1.5} />
                  </ActionIcon>
                </Grid.Col>
                  {/* <button className="button-obj" onClick={() => deleteObj(meetObj)} >Del</button>                       */}
                {/* </Container> */}
              
                </Grid>            
              </div>
            ))}</div>
      {/* </Center> */}
      <Center>
      <TextInput
      value={newObj}
      onChange={(e) => setNewObj(e.target.value)}
      radius="sm"
      size="md"
      placeholder="Add Objective"
      style={{width:'100%'}}
      rightSectionWidth={42}
      rightSection={
        <ActionIcon variant="transparent" aria-label="x" color="#EE5D20" onClick={addObj}>
          <IconCirclePlus style={{ width: '70%', height: '70%' }} stroke={1.5} />
        </ActionIcon>
      }
    />
    
            {/* <form onSubmit={addObj}>
              <input
                class="form-control"
                type="text"
                value={newObj}
                placeholder="Add Todo"
                onChange={(e) => setNewObj(e.target.value)}
              ></input>
              <button class="btn btn-primary">+</button>
              // {meetData[0]?.folderId}
              {newObj}
              {meetObjData[0]?.objId} //
            </form>    */}
      </Center>
      </Grid.Col>
      <Grid.Col borderColor='#EE5D20' span={{ base: 12, xs: 8 }} style={{backgroundColor: '#FDEFE9',height:"500px", alignItems:'center',borderColor:'#EE5D20'}}>
      <div style={{borderColor:'#EE5D20'}}><Text c="#EE5D20" size='xl' fw={500} style={{marginTop:'3%'}}>Meeting Note</Text>
      <Textarea
      radius="xs"
      autosize
        minRows={18}
        maxRows={20}
      placeholder="Write your note here..."
      value={newNote}
      style={{marginTop:'20px',
      height:rem(300)}}
      onChange={(e) => setNewNote(e.target.value)}
    /></div>
      </Grid.Col>
      </Grid>
      
   
      {/* {true ? (<form></form> :)} */}
      </div>
      {newNote}
    </div>
    
  );
}

export default InmeetingPage;
