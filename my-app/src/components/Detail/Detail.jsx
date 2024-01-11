import React from "react";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "src/supabaseClient";

function Detail() {
  const { id } = useParams();
  const [meetData, setMeetData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [meetObjData, setMeetObjData] = useState([]);

  useEffect(() => {
    const fetchMeeting = async () => {
      const { data, error } = await supabase
        .from("meeting")
        .select()
        .eq("meetId", id);

      if (data) {
        console.log(data);
        setMeetData(data);
      }
    };
    fetchMeeting();
    //       .eq("userId", meetData?.ownerId)
    // .eq("meetId", id)
    // const dict = meetData.reduce((acc, ownerId) => {
    //   const { mId } = ownerId;
    //   acc[mId] = ownerId;
    //   return acc.ownerId;
    // });
    // console.log(dict);
    const fetchOwner = async () => {
      const { data, error } = await supabase
        .from("meeting")
        .select(
          `
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
    fetchOwner();

    const fetchObj = async () => {
      const { data, error } = await supabase
        .from("meetObj")
        .select("objDes")
        .eq("meetId", id);
      if (data) {
        console.log(data);
        setMeetObjData(data);
      }
    };
    fetchObj();
  }, []);

  console.log(userData);

  return (
    <>
      <div>Detaillllllllllllllllllllll</div>
      {meetData.map((meetData, index) => (
        <div key={index}>
          <p> Meeting Name: {meetData?.meetName || "ยังไม่มีจ้า"}</p>
          <p>Description</p>
          <p>{meetData?.meetDes || "ยังไม่มีจ้า"}</p>
        </div>
      ))}
      <div>
        <p> Objective </p>
        {meetObjData.map(({objDes}, index) => (
          <div key={index}>
            <ul>
              <li>{objDes !== null ? objDes : "Have no objective"}</li>
            </ul>
          </div>
        ))}
      </div>

      {userData.map((userData, index) => (
        <div key={index}>
          <p> Owner: {userData.users && userData.users.firstName && userData.users.lastName
              ? `${userData.users.firstName} ${userData.users.lastName}` : "Have no data"}
          </p>
        </div>
      ))}
      {/* <div>
        {mapMeeting.ownerId}
      </div>
      {filterOwner.map((filterOwner, index) => (
        <div>
          <p> Owner: {filterOwner.firstName}</p>
        </div>
      ))} */}
    </>
  );
}

export default Detail;
