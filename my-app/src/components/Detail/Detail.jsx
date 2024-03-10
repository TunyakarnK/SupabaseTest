import React from "react";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "src/supabaseClient";
import { Text,Grid,rem } from "@mantine/core";

function Detail() {
  const { id } = useParams();
  const [meetData, setMeetData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [meetObjData, setMeetObjData] = useState([]);
  const [ meetAtten , setMeetAtten ] = useState([]);

  const fetchMeeting = async () => {
    try {
      const { data, error } = await supabase
        .from("meeting")
        .select()
        .eq("meetId", id);
      if (data) {
        console.log("fetch Meeting", data);
        setMeetData(data);
        
        fetchObj();
      }
    } catch (error) {
      console.error("Error fetching meeting:", error);
    }
  };

  const fetchCreator = async () => {
    const { data, error } = await supabase
      .from("meeting")
      .select(
        `
        folderId,
        creatorId,
        meetId,
        user(
          id,
          full_name
        )
      `
      )
      .eq("meetId", id);
    if (data) {
      console.log("fetch Creator", data);
      setUserData(data);
      // console.log(data);
    }
  };
  const fetchObj = async () => {
    try {
      const { data, error } = await supabase
        .from("meetObj")
        .select("objDes")
        .eq("meetId", id)
        .eq("folderId", meetData[0].folderId)
      if (data) {
        console.log("fetching meetObj:", data);
        setMeetObjData(data);
      }
    } catch (error) {
      console.error("Error fetching meetObj:", error);
    }
  };


  const fetchAttendee = async () => {
    try {
      const { data, error } = await supabase
      .from("meeting")
      .select(
        `
        attendee(
          userId,
          members:user(full_name)
          )
        `
      )
      .eq("meetId", id)
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

      function formatDateToText(textDate) {
        try {
          const dateObject = new Date(textDate);
          if (isNaN(dateObject.getTime())) {
            throw new Error("Invalid date-time text provided");
          }
      
          // Adjust the date object to UTC+7 timezone
          const localDateObject = new Date(dateObject.getTime() - (7 * 60 * 60 * 1000));
      
          // Extract day, month (0-indexed), year, hours, and minutes in local time
          const day = localDateObject.toLocaleDateString("en-US", { day: '2-digit' });
          const month = localDateObject.toLocaleDateString("en-US", { month: 'long' }); 
          const year = localDateObject.getFullYear();
          const hours = String(localDateObject.getHours()).padStart(2, '0');
          const minutes = String(localDateObject.getMinutes()).padStart(2, '0'); 
          const formattedDate = `${day} ${month} ${year}, ${hours}:${minutes}`;
      
          return formattedDate;
        } catch (error) {
          console.warn("Error parsing date:", error.message);
          return null; 
        }
      }
      
      function extractTimeFromDateTime(dateTimeText) {
        try {
          const timeParts = dateTimeText.split(":");
          const hours = String(timeParts[0]).padStart(2, '0'); 
          const minutes = String(timeParts[1]).padStart(2, '0'); 
          const timeString = `${hours}:${minutes}`;
      
          return timeString;
        } catch (error) {
          console.warn("Error extracting time:", error.message);
          return null; 
        }
      }
      
  useEffect(() => {
    fetchMeeting();
    fetchAttendee();
    fetchCreator();
    console.log('meetData ='+meetData);
  }, []);


  useEffect(() => {
    fetchObj();
  }, [meetData]);

  // useEffect(() => {
    
  // }, [meetAtten]);

  return (
    <><div 
    // style={{ backgroundColor:'#FDEFE9' }}
    >
    <Grid>
      <Grid.Col span={6}>
        {meetData.map((meetData, index) => (
        <div key={index}>
          <Text size="xl">Meeting Name</Text>
          <Text size="md"> {meetData?.meetName || "No Data"}</Text>
          <div style={{height:rem(10)}}></div>
          <Text size="xl">Meeting Schedule</Text>
          {/* <Text size="md"> {meetData?.meetStartDate || "No Data"}</Text> */}
          <Text size="md"> {formatDateToText(meetData?.meetStartDate) || "No Data"} - {extractTimeFromDateTime(meetData?.meetEndDate)}</Text>
          <div style={{height:rem(20)}}></div>
        </div>
      ))}

       {userData.map((userData, index) => (
        <div key={index}>
           <Text size="lg">Owner</Text>
            <Text size="md">
            {userData.user &&
            userData.user.full_name 
              ? `${userData.user.full_name}`
              : "Have no data"}
          </Text>
          <div style={{height:rem(20)}}></div>
        </div>
      ))}

      <Text size="lg"> Attendee</Text>
      {meetAtten.map((listAtten) => (
        <div key={listAtten.members}><Text size="md">{listAtten.members.full_name}</Text></div>
      ))}
      </Grid.Col>
      <Grid.Col span={6}>
      {meetData.map((meetData, index) => (
        <div key={index}>
          <Text size="xl">Meeting Type</Text>
          <Text size="md"> {meetData?.meetTagId || "No Data"}</Text>
          <div style={{height:rem(10)}}></div>
          <Text size="xl">Description</Text>
          <Text size="md"> {meetData?.meetDes || "No Data"}</Text>
          <div style={{height:rem(10)}}></div>
        </div>
      ))} 
      <div>
        <Text size="xl"> Objective </Text>
        {meetObjData.map(({ objDes }, index) => (
          <div key={index}>
            <ul>
              <li><Text size="md">{objDes !== null ? objDes : "No objective"}</Text></li>
            </ul>
          </div>
        ))}
      </div>
      </Grid.Col>
    </Grid>    

      {/* <div>
        {mapMeeting.ownerId}
      </div>
      {filterOwner.map((filterOwner, index) => (
        <div>
          <p> Owner: {filterOwner.firstName}</p>
        </div>
      ))} */}</div>
    </>
  );
}

export default Detail;