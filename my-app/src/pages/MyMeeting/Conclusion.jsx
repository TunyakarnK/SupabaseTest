import React, { useState } from "react";
import { supabase } from "src/supabaseClient";
import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./conclusion.css";

function Conclusion() {
  const { id } = useParams();
  const [con, setCon] = useState("");
  const [fol, setFol] = useState("");
  const [arrFol, setArrFol] = useState([]);
  const [meetObjData, setMeetObjData] = useState([]);

  useEffect(() => {
    const fetchObj = async () => {
      const { data, error } = await supabase
        .from("meetObj")
        .select("folderId, objDes")
        .eq("meetId", id);
      if (data) {
        console.log(data);
        setMeetObjData(data);
      }
    };
    fetchObj();
  }, []);

  function addFol(fol) {
    setArrFol((current) => [...current, fol]);
    console.log(arrFol.length);
    console.log(setArrFol);
    setFol("")
  }
  //

  function sendData() {
    console.log(arrFol);
    // send conclusion
    supabase
    .from("conclusion")
    .insert({
      meetId: id,
      // meetId: id,
      con: con,
    })
    .then((result) => {
      console.log(result);
    });

    // send follow up
    for (var i = 0; i <= arrFol.length + 1; i++) {
      console.log(arrFol[i]);
      supabase
      .from("meetObj")
      .insert({
        folderId: meetObjData[0]?.folderId,
        // meetId: id,
        objDes: arrFol[i],
      })
      .then((result) => {
        console.log(result);
      });
    }
  }

  const deltefol = (e) => {
    const name = e.target.value;
    console.log("jjjj", name);
    setArrFol(arrFol.filter((items) => items !== name));
  };
  return (
    <div>
      <Link to={'/MeetingPage/'+id}><button className="btn-con" onClick={() => sendData()}>End meeting</button></Link>
      <div className="flex-container">
        <div>
        <p className="p">Objective</p>
        </div>

        <div>
        <p className="p">Conclusion</p>
          <textarea className="text-con" rows="5" cols="45"
           placeholder="Add Conclusion"
           onChange={e => setCon(e.target.value)}></textarea>
          {con}
        <br />
        <p className="p">Follow-Up</p>
        {arrFol.map((listfol) => (
          <div>
            {listfol}
            <button value={listfol} onClick={deltefol}>
              x
            </button>
          </div>
        ))}
        <input
          class="form-control"
          type="text"
          value={fol}
          placeholder="follow-up"
          onChange={(e) => setFol(e.target.value)}
        ></input>
        <button class="btn btn-primary" onClick={() => addFol(fol)}>
          +
        </button>
        {fol}
        </div>
      </div>
    </div>
  );
}

export default Conclusion;
