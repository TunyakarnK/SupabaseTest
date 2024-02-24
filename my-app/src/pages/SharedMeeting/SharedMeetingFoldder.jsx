import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { Grid, GridCol, SegmentedControl, Text, rem, Button } from '@mantine/core';
import { supabase } from '../../supabaseClient.js';
import { useEffect, useState } from "react";
import MeetingCard from 'src/components/MeetingCard';
import { useSession } from '@supabase/auth-helpers-react';

function SharedMeetingFoldder() {
const { id } = useParams();
const session = useSession();
const [user, setUser] = useState({});
const [newMeeting, setNewMeeting] = useState([]);

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
    getUserData();
    getNewMeeting();
  }, [])

  async function getNewMeeting() {
    try {
      const { data, error } = await supabase
        .from("meeting")
        .select("*")
        .eq("folderId", id)
        //จริงๆๆต้องเอาแค่ meeting ที่พึ่งสร้างใหม่
      if (error) throw error;
      if (data != null) {
        console.log("get New Meeting", data);
        setNewMeeting(data); 
      }
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    
    <div>
        <Link to="/SharedMeeting" ><Button color='#EE5D20' radius="xl">Back</Button></Link>
        <br />
        Folder
        <div className=''>
            {newMeeting.map((newMeeting) => (
            <MeetingCard meeting = {newMeeting} user = {user} />
          ))}
            </div>
    </div>
  )
}

export default SharedMeetingFoldder;