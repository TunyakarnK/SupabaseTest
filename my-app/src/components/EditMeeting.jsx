import React from 'react'
import { Text, NativeSelect, rem, TextInput, TagsInput, Grid,Textarea,Button, Group,InputBase, Pill} from '@mantine/core';
import { useEffect, useState } from "react";
import { supabase } from '../supabaseClient.js';
import Navbar from './Navbar/Navbar.jsx'
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useSession } from '@supabase/auth-helpers-react';
import classes from '../components/Edit.module.css'


function EditMeeting(props) {
  const { state } = useLocation();
  const session = useSession();
    // const nameRef = props.nameRef
    const [user, setUser] = useState({});
    const navigate = useNavigate();
    const data = [
      { value: 1, label: 'Decision-Making' },
      { value: 2, label: 'Problem-Solving' },
      { value: 3, label: 'Info/Opinion-Sharing' },
    ];

    const [ meetData, setMeetData ] = useState([]);
    const [ meetName, setMeetName ] = useState (); //
    // const [ ownerId, setOwnerId]= useState (""); //
    const [ meetStartDate, setMeetStartDate] = useState ();
    const [ meetFolder, setMeetFolder]= useState ();
    const [ meetEndDate, setMeetEndDate]= useState ();
    const [ meetTagId, setMeetTagId]= useState ();
    const [ meetDes, setMeetDes]= useState ("");
    const [ meetStatus, setMeetStatus]= useState ();
    const [ meetCreate, setMeetCreate]= useState ();
    const [ meetStartTime, setMeetStartTime]= useState ();
    const [ meetEndTime, setMeetEndTime]= useState ();
    const [ meetObj, setMeetObj]= useState ();
    const [ meetParti, setMeetParti]= useState ([]);
    const [ userFolder, setUserFolder ] = useState([]);
    const [ selectedFolder, setSelectedFolder ] = useState();
    const [ meetObjData, setMeetObjData ] = useState([]);
    const [ newObj, setNewObj ] = useState([]);
    const [ meetAtten , setMeetAtten ] = useState([]);
    // console.log("meeting tag", data[1].value);
    console.log("meeting tag", meetTagId);
    useEffect(() =>{
      async function getUserData() {
        await supabase.auth.getUser().then((value) =>{
          // value.data.user
          if(value.data?.user){
            console.log(value.data.user)
            setUser(value.data.user)
          }
        })
      }
      const fetchMeeting = async () => {
        const { data, error } = await supabase
          .from("meeting")
          .select()
          .eq("meetId", state.meeting.meetId);
  
        if (data) {         
          setMeetData(data);
          console.log(data[0]);
        }
        
      };

      
      fetchMeeting();
      getUserData();
      getMeeting();
      fetchFolder();
      fetchObj();
      fetchAttendee();
      // getObj();
      console.log('from edit page')
      console.log(state.meeting.meetId)
      console.log("folderId", state.meeting.folderId)
    }, [])

    //ดึงข้อมูล Objective ของ meeting
    const fetchObj = async () => {
      const { data, error } = await supabase
        .from("meetObj")
        .select("objId, objDes, objStatus")
        .eq("meetId", state.meeting.meetId)
        .eq("folderId", state.meeting.folderId)
        .eq("objStatus", false);
      if (data) {
        console.log("fetchObj", data);
        setMeetObjData(data);
      }
    };

    
  // delete Objective
    async function deleteObj(obj) {
      supabase
        .from("meetObj")
        .delete()
        .eq('objId', obj.objId)
        .then(() => {
          console.log("Deleted Objective");
          fetchObj();
        });
    }

    //ดึงข้อมูล Folder ของ meeting
    const fetchFolder = async () => {
      const { data , error } = await supabase
        .from("user")
        .select(
         `
          userFolder(checkOwner,
          folders(
            folderId,
            folderName
          )
         )
         `
        )
        .eq("id", session.user.id)
        // .eq("userFolder.checkOwner", true)
      if ( data ){
        console.log("fetch user folder", data[0].userFolder);
        console.log(data);
        // setUserFolder(data[0].userFolder);
        const check = data[0].userFolder.filter(checks => checks.checkOwner == true);
        console.log(check);
        setUserFolder(check)
      }if ( error ){
        console.log(error);
      }
    }
        
    //   } catch (error) {
    //     alert(error.message);
    //   }
    // }

    //ดึงข้อมูล Participant ของ meeting
    const fetchAttendee = async () => {
      try {
        const { data, error } = await supabase
        .from("meeting")
        .select(
          `
          attendee(
            userId, attId,
            members:user(full_name)
            )
          `
        )
        .eq("meetId", state.meeting.meetId)
        .single();
        if (data) {
          console.log("fetching attendee", data.attendee);
          setMeetAtten(data.attendee)
        }if (error) {
          console.error("Error fetching attendee:", error);
        }
      } catch (error) {
        console.error("Error fetching attendee:", error);
      }
    };

    async function deleteAtt(att) {
      supabase
        .from("attendee")
        .delete()
        .eq('attId', att.attId)
        .select()
        .then((result) => {
          console.log("Deleted attendee", result);
          fetchAttendee();
          supabase
          .from("userFolder")
          .delete()
          .eq('userId', result.data[0].userId)
          .eq('folderId', state.meeting.folderId)
          .then((result) => {
            console.log("Deleted attendee userFolder", result);
          })
        });
    }

    async function getMeeting() {
      try {
        await supabase
          .from("meeting")
          .select()
          .eq("meetId", state.meeting.meetId)
          .then((result) => {
            console.log("Fetch meeting", result.data[0]);
            supabase
            .from("folders")
            .select("folderName")
            .eq("folderId", result.data[0].folderId)
            .then((result) => {
              console.log("folder Name", result.data[0].folderName);
              setMeetFolder(result.data[0].folderName);
            });
          });
          //ต้องๆต้องเอาแค่ meeting ที่พึ่งสร้างใหม่
        // if (error) throw error;
      } catch (error) {
        console.log("174", error.message);
      }
    }

    async function updateMeeting() {
      try {
          const { data, error } = await supabase
              .from("meeting")
              .update({
                  meetCreate: meetCreate,
                  meetDes: meetDes,
                  meetEndDate: meetEndDate,
                  meetEndTime: meetEndTime,
                  meetName: meetName,
                  meetStartDate: meetStartDate,
                  meetStartTime: meetStartTime,
                  meetStatus: meetStatus,
                  meetTagId: meetTagId,
                  folderId: selectedFolder
              })
              .eq("meetId", state.meeting.meetId)
              .select()
              console.log("update meeting", data);
          // if (error) throw error;
          // window.location.reload();
          for (var i = 0; i <= newObj.length; i++) {
            console.log(newObj[i]);
            supabase
            .from("meetObj")
            .insert({
              folderId: state.meeting.folderId,
              meetId: state.meeting.meetId,
              objDes: newObj[i],
            })
            .then((result) => {
              console.log("add new obj in edit page", result);
            });
          }
          // Insert attendee select id from where email
          for (var i = 0; i <= meetParti.length; i++) {
            console.log("ผู้เข้าร่วม", meetParti[i]);
            supabase
            .from("user")
            .select("id, email")
            .eq("email", meetParti[i])
            .then((result) => {
              console.log("Fetch user id where email", result.data)
              const user_id = result.data[0].id
              // insert attendee
              supabase
              .from("attendee")
              .insert({
                meetId: state.meeting.meetId,
                email: result.data[0].email,
                userId: result.data[0].id
              })
              .then((result) => {
                console.log("Insert attendee", result);
                supabase
                .from("userFolder")
                .select("userId, folderId")
                .eq("userId", user_id)
                .eq("folderId", state.meeting.folderId)
                .then((result) => {
                  console.log("Check exist userFolder", result.data[0])
                    if (result.data[0] == null){
                    supabase
                    .from("userFolder")
                    .insert({
                      userId: user_id,
                      folderId: state.meeting.folderId,
                      checkOwner: false
                    })
                    .then((result) => {
                      console.log("Insert userFolder", result);
                    });
                  } 
                });
              });
          });
          }
          navigate(-1);
      } catch (error) {
          console.log(meetStartTime)
          alert(error.message);
          
      }
  }

  return (
    <div className='App'>
        {Object.keys(user).length !== 0 ?
          <>
        <header>
        <Navbar props={user}/>
        </header>

          
       <div style={{margin:"20px"}}>
       <Grid align='center' style={{ marginLeft:rem(50), marginTop:rem(30) }}>
      <Grid.Col span={0.8}><Button variant='outline' color='#EE5D20' radius="xl" onClick={() => navigate(-1)} style={{width:'auto'}}>Back</Button></Grid.Col>
      <Grid.Col span={8}><Text size='30px' fw={'500'} style={{marginTop:'10px',marginLeft:'20px',marginBottom:'10px'}}>Edit Meeting</Text></Grid.Col>
      </Grid>
             <Grid style={{margin:"20px", backgroundColor: '#FDEFE9',padding:"20px"}}>
              <Grid.Col span={6}>

                {/* Meeting Name */}
                <TextInput
                    placeholder={state.meeting.meetName}
                    defaultValue={state.meeting.meetName}
                    label="Meeting Name"
                    onChange={(event) => setMeetName(event.currentTarget.value)}
                    styles={{
                      input: {
                        color:'#EE5D20',
                        borderColor:'#EE5D20',
                        // backgroundColor:'#FDEFE9',
                        width: rem(300),
                        marginRight: rem(-2),
                        
                      },
                    }}
                />

                {/* Meeting Type */}
                <div style={{width: "300px"}}>
                  <NativeSelect
                    mt="md"
                    // comboboxProps={{ withinPortal: true }}
                    data={data}
                    placeholder="meeting type"
                    label="Meeting Type"
                    onChange={(event) => setMeetTagId(event.currentTarget.value)}
                    styles={{
                      input: {
                        color:'#EE5D20',
                        borderColor:'#EE5D20',
                        // backgroundColor:'#FDEFE9',
                        fontWeight: 500,
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                        // width: rem(300),
                        marginRight: rem(-2),
                      },
                    }}
                  />
                </div>             

                  <div style={{marginTop:"15px"}}>
                <form>
                <label  >Meeting Start-Date
                  <input type="datetime-local" 
                      defaultValue={state.meeting.meetStartDate}
                      onChange={(e) => setMeetStartDate(e.target.value)} 
                      style={{margin:"15px"}}
                  />
                </label>

                {/* <label>Meeting Start-Time
                  <input type="time" 
                      defaultValue={state.meeting.meetStartTime}
                      onChange={(e) => setMeetStartTime(e.target.value)} 
                      style={{margin:"15px"}}
                    />
                </label> */}
                </form>
                </div>

                <form>
                <label>Meeting End-Time&nbsp;
                  
                  <input type="time" 
                      defaultValue={state.meeting.meetEndDate}
                      onChange={(e) => setMeetEndDate(e.target.value)} 
                      style={{margin:"15px"}}
                    />
                </label>                 

                {/* <label>Meeting End-Time&nbsp;
                  <input type="time" 
                      defaultValue={state.meeting.meetEndTime}
                      onChange={(e) => setMeetEndTime(e.target.value)} 
                      style={{margin:"15px" ,}}
                    />
                </label>  */}
                </form>
                
                <div style={{marginTop:"15px"}}>
                  <Textarea
                    placeholder={state.meeting.meetDes}
                    defaultValue={state.meeting.meetDes}
                    label="Meeting Description"
                    onChange={(event) => setMeetDes(event.currentTarget.value)}
                    styles={{
                      input: {
                        color:'#EE5D20',
                        borderColor:'#EE5D20',
                        // backgroundColor:'#FDEFE9',
                        width: "85%",
                        height: rem(150),
                        marginRight: rem(-2),  
                      },
                    }}
                  />
                  </div>
              </Grid.Col>            
              
 
              <Grid.Col span={6} styles={{
                      input: {
                        marginRight: rem(20),
                      },
                    }}>

                {/* Folder */}
                <div style={{width: "300px",}}>
                  <NativeSelect
                    mt="md"
                    // comboboxProps={{ withinPortal: true }}
                    // data={folderId}
                    
                    // placeholder={meetFolder}
                    label="Folder"
                    onChange={(e) => {
                      const c = userFolder?.find((x) => x.folders.folderId == e.target.value);
                      setSelectedFolder(e.target.value);
                      console.log(e.target.value);
                    }}
                    styles={{
                      input: {
                        color:'#EE5D20',
                        borderColor:'#EE5D20',
                        backgroundColor:'#FDEFE9',
                        fontWeight: 500,
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                        // width: rem(300),
                        marginRight: rem(-2),
                      },
                    }}
                  >
                    {/* <option>{meetFolder}</option> */}
                    {/* <option >default: {userFolder.folders.folderName}</option> */}
                    <option>Choose Your Folder</option>
                  {userFolder.map( folders => {
                    return(
                        <option key={folders.folders.folderId} value={folders.folders.folderId}>{folders.folders.folderName}</option>
                      )})}
                  </NativeSelect>
                </div>

              {/* Objective */}
              <div style={{marginTop:"15px"}}>
         
{/*     
              {newObj.map((listNewObj) => (
          <div>
            {listNewObj}
            <button value={listNewObj}>
              x
            </button>
          </div>
        ))}
          {meetObjData.map((meetObjData) => (
          <div key={meetObjData.objId}>
            {meetObjData.objDes}<button onClick={() => deleteObj(meetObjData)}>x</button>
          </div>
        ))} */}
        {/* </Box> */}

        <InputBase
        label="Meeting Objective"
        placeholder='No Objective'
        component="div" multiline
        classNames={classes}
        style={{
          width: "90%",
          minHeight: rem(100),
          marginRight: rem(-2),
          marginBottom: rem(30),
          color:'#EE5D20',
          borderColor:'#EE5D20',
          backgroundColor:'#FDEFE9',
        }}
        >
          <div style={{ height: rem(10) }}></div>
          <Pill.Group>

          {meetObjData.map((meetObjData) => ( 
            <Pill 
            key={meetObjData.objId}
            classNames={{root:classes.root}}
            // onClick={()=>console.log(meetObjData)}
            onRemove={()=>deleteObj(meetObjData)}
            withRemoveButton 
            clearable
            >
            {meetObjData.objDes}
            {/* <button onClick={() => deleteObj(meetObjData)}>x</button> */}
          </Pill>
        ))}
          </Pill.Group>
          
          <div style={{ height: rem(20) }}></div>
          
          <TagsInput
          label="Add New Objective"
                placeholder="Press Enter to submit Objective"
                classNames={{pill:classes.pill}}
                // defaultValue={newObjList}
                value={newObj}
                onChange={setNewObj}
                // omRemove={deleteObj}
                clearable 
                styles={{
                  input: {
                    color:'#EE5D20',
                    borderColor:'#EE5D20',
                    // backgroundColor:'#FDEFE9',
                    // marginTop:"1rem"
                  },
                }}
              />
          </InputBase>
              
              {/* {newObj} */}      
              </div>

              <div style={{marginTop:"15px"}}>
              {/* {meetParti.map((listNewObj) => (
          <div>
            {listNewObj}
            <button value={listNewObj}>
              x
            </button>
          </div>
        ))}
        {meetAtten.map((listAtten) => (
          <div key={listAtten.members}>
            {listAtten.members.full_name}<button onClick={() => deleteAtt(listAtten)}>x</button>
          </div>
        ))} */}
              {/* <div style={{marginTop:"15px"}}> */}
        <InputBase
        label="Meeting Attendee"
        placeholder='No Objective'
        component="div" multiline
        classNames={classes}
        style={{
          width: "90%",
          minHeight: rem(100),
          marginRight: rem(-2),
          marginBottom: rem(30),
          color:'#EE5D20',
          borderColor:'#EE5D20',
          backgroundColor:'#FDEFE9',
        }}
        ><div style={{ height: rem(10) }}></div>
        <Pill.Group>       
        {meetAtten.map((listAtten) => (
          <Pill 
          classNames={{root:classes.root}}
          // onClick={()=>console.log(meetObjData)}
          onRemove={()=>deleteAtt(listAtten)}
          withRemoveButton 
          clearable 
          key={listAtten.members}>
            {listAtten.members.full_name}
            {/* <button onClick={() => deleteAtt(listAtten)}>x</button> */}
          </Pill>
        ))}
        </Pill.Group>
        <div style={{ height: rem(20) }}></div>
              <TagsInput
              classNames={{pill:classes.pill}}
              label='Add New Attendee By Email'
                placeholder="Press Enter to submit attendee"
                value={meetParti}
                onChange={setMeetParti}
                clearable
                styles={{
                  input: {
                    color:'#EE5D20',
                    borderColor:'#EE5D20',
                    // backgroundColor:'#FDEFE9',
                    // marginTop:"1rem"
                  },
                }}
              /></InputBase>
              </div>
              {/* <div style={{width: "90%",marginTop:"30px", justifyItems:'end'}}> */}
              <Group justify="flex-end" mt="md" style={{ marginRight:'10%' , marginTop:"30%" }}>
              <Button color='#EE5D20' radius="xl" style={{ marginTop:"10%" }} 
              onClick={()=>updateMeeting()}
              // onClick={addObj}
              >Update Meeting</Button>
            </Group>
                
              {/* </div> */}
              </Grid.Col>
             </Grid>
              
        </div>
       
       </>
       :
       <></>
       }
       
      </div>
    
  )
}

export default EditMeeting