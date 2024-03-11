import React from 'react'
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "src/supabaseClient";
import { Text } from "@mantine/core";

function Note() {
    const { id } = useParams();
    const [meetNote, setMeetNote] = useState("");

    const fetchNote = async () => {
      const { data, error } = await supabase
      .from("notes")
      .select("noteDes")
      .eq("meetId", id)
      if (data) {
        setMeetNote(data)
        console.log(data);
      }else{console.log(error);}
      
    }
      useEffect(() => {
        fetchNote();
      }, [])

  return (
    <div style={{ padding:'20px',minHeight: '30vw', height:'auto'}}>
    <Text size="xl">
      {meetNote[0]?.noteDes || "ยังไม่มีงับ"}
    </Text>
    </div>
  )
}

export default Note