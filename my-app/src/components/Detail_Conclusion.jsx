import React from 'react'
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "src/supabaseClient";
import { Text } from "@mantine/core";

function Detail_Conclusion() {
    const { id } = useParams();
    const [meetCon, setMeetCon] = useState("");

    const fetchCon = async () => {
      const { data, error } = await supabase
      .from("conclusion")
      .select("con")
      .eq("meetId", id)
      if (data) {
        setMeetCon(data)
        console.log(data);
      } else {console.log(error);}
    }

      useEffect(() => {
        fetchCon();
      }, [])

  return (
  <div style={{ padding:'20px',minHeight: '30vw', height:'auto'}}>
    <Text size="xl">
    {/* Meeting Name */}
    {meetCon[0]?.con || "ยังไม่มีงับ"}
    </Text>
  </div>
  )
}

export default Detail_Conclusion