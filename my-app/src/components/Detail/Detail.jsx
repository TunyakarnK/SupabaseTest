import React from "react";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "src/supabaseClient";
import { Text } from "@mantine/core";

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

  useEffect(() => {
    fetchMeeting();
    fetchAttendee();
    fetchCreator();
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
    <Text size="xl">Details:</Text>
      {userData.map((userData, index) => (
        <div key={index}>
          <p>
            {" "}
            Owner:{" "}
            {userData.user &&
            userData.user.full_name 
              ? `${userData.user.full_name}`
              : "Have no data"}
          </p>
        </div>
      ))}
      <p> Attendee:</p>
      {meetAtten.map((listAtten) => (
        <div key={listAtten.members}>{listAtten.members.full_name}</div>
      ))}
      {meetData.map((meetData, index) => (
        <div key={index}>
          <p> Meeting Name: {meetData?.meetName || "ยังไม่มีงับ"}</p>
          <p>Description:</p>
          <p>{meetData?.meetDes || "ยังไม่มีงับ"}</p>
        </div>
      ))}
      <div>
        <p> Objective </p>
        {meetObjData.map(({ objDes }, index) => (
          <div key={index}>
            <ul>
              <li>{objDes !== null ? objDes : "Have no objective"}</li>
            </ul>
          </div>
        ))}
      </div>

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