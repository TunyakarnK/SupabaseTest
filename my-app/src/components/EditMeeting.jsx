import React from 'react'
import { Select, NativeSelect, rem, TextInput, TagsInput, Grid,Textarea,Button, Group } from '@mantine/core';
import { useEffect, useState } from "react";
import { supabase } from '../supabaseClient.js';
import Navbar from './Navbar/Navbar.jsx'
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

function EditMeeting(props) {
  const { state } = useLocation();
    // const nameRef = props.nameRef
    const [user, setUser] = useState({});
    const navigate = useNavigate();
    const data = [
      { value: 1, label: 'Decision-Making' },
      { value: 2, label: 'Problem-Solving' },
      { value: 3, label: 'Info/Opinion-Sharing' },
    ];

    const [meetData, setMeetData] = useState([]);
    const [meetObjData, setMeetObjData] = useState([]);
    const [newObj, setNewObj] = useState("");
    const [ meetName, setMeetName ] = useState (""); //
    // const [ ownerId, setOwnerId]= useState (""); //
    const [ meetStartDate, setMeetStartDate] = useState ();
    const [ folderId, setFolderId]= useState ();
    const [ meetEndDate, setMeetEndDate]= useState ();
    const [ meetTagId, setMeetTagId]= useState ();
    const [ meetDes, setMeetDes]= useState ("");
    const [ meetStatus, setMeetStatus]= useState ();
    const [ meetCreate, setMeetCreate]= useState ();
    const [ meetStartTime, setMeetStartTime]= useState ();
    const [ meetEndTime, setMeetEndTime]= useState ();
    const [ meetParti, setMeetParti]= useState ();

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
          console.log( data);
          setMeetData(data);
          console.log(data[0]);
        }
      };
      fetchMeeting();
      getUserData();
      getMeeting();
      fetchObj();
      // getObj();
      console.log('from edit page')
      console.log(state.meeting.meetId)
      console.log(state.meeting)
    }, [])

    const fetchObj = async () => {
      const { data, error } = await supabase
        .from("meetObj")
        .select("objId, objDes, objStatus")
        .eq("meetId", state.meeting.meetId)
        .eq("objStatus", false);
      if (data) {
        console.log(data);
        setMeetObjData(data);
      }
    };

    function addObj(e) {
      e.preventDefault();
      supabase
        .from("meetObj")
        .insert({
          folderId: meetData[0]?.folderId,
          meetId: state.meeting.meetId,
          objDes: newObj,
        })
        .then((result) => {
          console.log(result);
          fetchObj(); 
          setNewObj("");
        });
        updateMeeting();
    }

    //ดึงข้อมูล Folder ของ meeting
    // async function getFolder() {
    //   try {
        
    //   } catch (error) {
    //     alert(error.message);
    //   }
    // }

    //ดึงข้อมูล Participant ของ meeting
    // async function getParti() {
    //   try {
        
    //   } catch (error) {
    //     alert(error.message);
    //   }
    // }

    async function getMeeting() {
      try {
        const { data, error } = await supabase
          .from("meeting")
          .select()
          .eq("meetId", state.meeting.meetId)
          //ต้องๆต้องเอาแค่ meeting ที่พึ่งสร้างใหม่
        if (error) throw error;
        if (data != null) {
          setMeetData(data)
          setMeetName(data.meetName); 
          setMeetDes(data.meetDes)
          console.log('meet',data)
        }
      } catch (error) {
        alert(error.message);
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
              })
              .eq("meetId", state.meeting.meetId)
          
          if (error) throw error;
          // window.location.reload();
          addObj();
          navigate("/MyMeeting");
      } catch (error) {
          console.log(meetStartTime )
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
             <h1 style={{color: "#EE5D20", marginTop: '2%', marginLeft:"20px"}}>Edit Meeting</h1>
             <Grid style={{margin:"20px", backgroundColor: '#FDEFE9',padding:"20px"}}>
              <Grid.Col span={6}>
                <TextInput
                    placeholder={state.meeting.meetName}
                    defaultValue={state.meeting.meetName}
                    label="Meeting Name"
                    onChange={(event) => setMeetName(event.currentTarget.value)}
                    styles={{
                      input: {
                        color:'#EE5D20',
                        borderColor:'#EE5D20',
                        backgroundColor:'#FDEFE9',
                        width: rem(300),
                        marginRight: rem(-2),
                      },
                    }}
                />

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
                        backgroundColor:'#FDEFE9',
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
                  {/* <DatePickerInput
                    placeholder={state.meeting.meetDes}
                    label="Meeting Description"
                    onChange={(event) => setMeetDes(event.currentTarget.value)}
                    styles={{
                      input: {
                        borderBottom: rem(5),
                        width: rem(300),
                        marginRight: rem(-2),  
                      },
                    }}
                  /> */}

                  {/* <DatePickerInput
                    label="Pick date"
                    placeholder="Pick date"
                    value={state.meeting.meetStartDate}
                    onChange={setMeetStartDate}
                  /> */}
                  </div>

                  <div style={{marginTop:"15px"}}>
                <form>
                <label  >Meeting Start-Date
                  <input type="date" 
                      defaultValue={state.meeting.meetStartDate}
                      onChange={(e) => setMeetStartDate(e.target.value)} 
                      style={{margin:"15px"}}
                  />
                </label>

                <label>Meeting Start-Time
                  <input type="time" 
                      defaultValue={state.meeting.meetStartTime}
                      onChange={(e) => setMeetStartTime(e.target.value)} 
                      style={{margin:"15px"}}
                    />
                </label>
                </form>
                </div>

                <form>
                <label>Meeting End-Date&nbsp;
                  
                  <input type="date" 
                      defaultValue={state.meeting.meetEndDate}
                      onChange={(e) => setMeetEndDate(e.target.value)} 
                      style={{margin:"15px"}}
                    />
                </label>                 

                <label>Meeting End-Time&nbsp;
                  <input type="time" 
                      defaultValue={state.meeting.meetEndTime}
                      onChange={(e) => setMeetEndTime(e.target.value)} 
                      style={{margin:"15px" ,}}
                    />
                </label> 
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
                        backgroundColor:'#FDEFE9',
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
                    data={folderId}
                    placeholder="Select Folder"
                    label="Folder"
                    onChange={(event) => setMeetTagId(event.currentTarget.value)}
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
                  />
                </div>

              {/* Objective */}
              <div style={{marginTop:"15px"}}>
              <TagsInput
                label="Meeting Objective"
                placeholder="Press Enter to submit Objective"
                defaultValue={meetObjData}
                clearable
                // value={newObj} 
                onChange={(event) => setNewObj(event.currentTarget.value)}
              //   onKeyDown={(event) => {
              //     if (event.key === 'Enter') {
              //         addObj(event);
              //     }
              // }}
                styles={{
                  input: {
                    color:'#EE5D20',
                    borderColor:'#EE5D20',
                    backgroundColor:'#FDEFE9',
                    width: "90%",
                    height: rem(100),
                    marginRight: rem(-2),
                  },
                }}
              />
              </div>

              <div style={{marginTop:"15px"}}>
              <TagsInput
                label="Participant"
                placeholder="Press Enter to submit Participant"
                defaultValue={meetParti}
                clearable
                styles={{
                  input: {
                    color:'#EE5D20',
                    borderColor:'#EE5D20',
                    backgroundColor:'#FDEFE9',
                    width: "90%",
                    height: rem(100),
                    marginRight: rem(-2),
                  },
                }}
              />
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

 