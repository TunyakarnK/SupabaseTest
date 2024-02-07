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


  // const fetchMeeting = async () => {
  //   // try{
  //     const { data, error } = await supabase
  //     .from("meeting")
  //     .select()
  //     .eq("meetId", id);
  //     // .then(data => {
  //     //   console.log(data);
  //     //   setMeetData(data);
  //     //   fetchObj();
  //     // });
  //   if (data) {
  //     console.log(data);
  //     setMeetData(data);
  //     fetchObj();
  //   }
  //   // }catch(error){
  //   //   return;
  //   // }
  // };

  const fetchMeeting = async () => {
    try {
      const { data, error } = await supabase
        .from("meeting")
        .select()
        .eq("meetId", id);
      if (data) {
        console.log(data);
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
      console.log(data);
      setUserData(data);
      // console.log(data);
    }
  };

  // const fetchObj = async () => {
  //   // var a = meetData[0].folderId
  //   const { data, error } = await supabase
  //     .from("meetObj")
  //     .select("objDes")
  //     // .lte("meetId", id)
  //     .eq("folderId", userData[0].folderId)
  //     .eq("objStatus", false);
  //   if (data) {
  //     console.log(data);
  //     setMeetObjData(data);
  //   }
  // };
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
    fetchMeeting()

    fetchOwner();
  }, [])

  useEffect(() => {

    // fetchMeeting();

    // fetchOwner();
    
    fetchObj();
    
    // const fetchData = async () => {
    //   await fetchMeeting();
    //   fetchOwner();
    //   fetchObj();
    // };
    // fetchData();
    
  }, [meetData]);

  console.log(userData);
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
            {userData.users &&
            userData.users.firstName &&
            userData.users.lastName
              ? `${userData.users.firstName} ${userData.users.lastName}`
              : "Have no data"}
          </p>
        </div>
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
