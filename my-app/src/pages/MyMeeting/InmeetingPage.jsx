import React, { useState } from 'react'
import { supabase } from 'src/supabaseClient';
import { useEffect } from 'react';

function InmeetingPage() {
  const [ meetData, setMeetData ] = useState([]);
  useEffect(() => {
    const fetchMeeting = async () => {
      const { data, error } = await supabase
        .from("meeting")
        .select()
        .eq("meetId", id);
  
      if (data) {
        console.log(data);
        setMeetData(data);
        console.log(meetData[0]?.folderId);
      }
    };
    fetchMeeting();
  }, []);
  
  function addObj(){
      supabase.from("meetObj").insert(
          {
              folderId: meetData[0]?.folderId,
              meetId: id,
              objDes: 1
          }
      )
  }

  return (
    <div>
        <p>Objective</p>
        <input class="form-control" type='text' placeholder='Add Todo'></input>
        <button class="btn btn-primary">+</button>
    </div>
  )
}

export default InmeetingPage