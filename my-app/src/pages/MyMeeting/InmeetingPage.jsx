import React, { useState } from "react";
import { supabase } from "src/supabaseClient";
import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./inmeetingpage.css"

function InmeetingPage() {
  const { id } = useParams();
  const [meetData, setMeetData] = useState([]);
  const [meetObjData, setMeetObjData] = useState([]);
  const [newObj, setNewObj] = useState("");
  const [isChecked, setChecked] = useState(false);

  useEffect(() => {
    const fetchMeeting = async () => {
      const { data, error } = await supabase
        .from("meeting")
        .select()
        .eq("meetId", id);
      if (data) {
        console.log("lllll", data);
        setMeetData(data);
        console.log(data[0]);
      }
    };
    fetchMeeting();

    fetchObj();
  }, []);
  console.log(meetData[0]?.folderId);

  const fetchObj = async () => {
    const { data, error } = await supabase
      .from("meetObj")
      .select("objId, objDes, objStatus")
      .eq("meetId", id)
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
        meetId: id,
        objDes: newObj,
      })
      .then((result) => {
        console.log(result);
        fetchObj(); 
        setNewObj("");
      });
  }

  async function checkObj(objId) {
    supabase
      .from("meetObj")
      .update({
        objStatus: !objId.objStatus
      })
      .eq('objId', objId.objId)
      .then((result) => {
        console.log(result);
        console.log(objId.objStatus);
      });
  }

  async function deleteObj(objId) {
    supabase
      .from("meetObj")
      .delete()
      .eq('objId', objId.objId)
      .then(() => {
        console.log("Deleted");
        fetchObj();
      });
  }

  return (
    <div style={{margin:"20px"}}>
      <Link to={"/Conclusion/"+id}><button className="btn-con">Conclusion</button></Link>
      <p className="p">Objective</p>
      {meetObjData.map( meetObj  => (
        <div key={meetObj.objId}>
          <ul className="ul-obj">
            <li className="li-obj">{meetObj.objDes !== null ? meetObj.objDes : "Have no objective"}<input className="check-obj"type="checkbox" onClick={() => checkObj(meetObj)}></input><button className="button-obj" onClick={() => deleteObj(meetObj)} >Delete</button></li>
          </ul>
        </div>
      ))}
      <form onSubmit={addObj}>
        <input
          class="form-control"
          type="text"
          value={newObj}
          placeholder="Add Todo"
          onChange={(e) => setNewObj(e.target.value)}
        ></input>
        <button class="btn btn-primary">+</button>
        {/* {meetData[0]?.folderId}
        {newObj}
        {meetObjData[0]?.objId} */}
      </form>
      {/* {true ? (<form></form> :)} */}
    </div>
  );
}

export default InmeetingPage;
