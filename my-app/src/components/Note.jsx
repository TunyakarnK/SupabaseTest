import React from 'react'
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "src/supabaseClient";
import { Text } from "@mantine/core";

function Note() {
    const { id } = useParams();
    const [meetData, setMeetData] = useState([]);
    const [userData, setUserData] = useState([]);
    const [meetObjData, setMeetObjData] = useState([]);

    const fetchMeeting = async () => {
        try {
          const { data, error } = await supabase
            .from("meeting")
            .select()
            .eq("meetId", id);
          if (data) {
            console.log('MeetingData',data);
            setMeetData(data);
            fetchObj()
          }
        } catch (error) {
          console.error("Error fetching meeting:", error);
        }
      };
      
      const fetchOwner = async () => {
        const { data, error } = await supabase
          .from("meeting")
          .select(
            `
            folderId,
            ownerId,
            meetId,
            users(
              userId,
              firstName,
              lastName
            )
          `
          )
          .eq("meetId", id);
        if (data) {
          console.log('Userdata:',data);
          setUserData(data);
          // console.log(data);
        }
      };
      const fetchObj = async () => {
        try {
            const { data, error } = await supabase
              .from("meetObj")
              .select("objDes")
              .lte("meetId", id)
              .eq("folderId", userData[0].folderId)
              .eq("objStatus", false);
            if (data) {
              console.log(data);
              setMeetObjData(data);
            }
        } catch (error) {
          console.error("Error fetching meetObj:", error);
        }
      };

      useEffect(() => {
        fetchMeeting();
        fetchOwner();
      }, [])
    
      useEffect(() => {
        fetchObj(); 
      }, [meetData]);

  return (
  <>
    <Text size="xl">
    {/* Meeting Name */}
      {meetData.map((meetData, index) => (
        <div key={index}>
          <p>Note from {meetData?.meetName || "ยังไม่มีงับ"}</p>     
        </div>       
      ))}
    </Text>
      </>
  )
}

export default Note