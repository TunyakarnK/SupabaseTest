import React from "react";
import { useEffect, useState } from "react";
import { supabase } from '../supabaseClient';
import { useNavigate } from "react-router-dom";
import MyMeeting from "./MyMeeting/MeetingFolder"
import SharedMeeting from "./SharedMeeting/SharedMeetingFoldder";

function Profile() {
    const navigate = useNavigate();

    const [user, setUser] = useState({});
    const [countries, setCountries] = useState([]);
    const [meeting, setMeeting] = useState([])
  
    useEffect(() =>{
      async function getUserData() {
        await supabase.auth.getUser().then((value) =>{
          // value.data.user
          if(value.data?.user){
            console.log(value.data.user)
            setUser(value.data.user)
          }
        })
      }
      getUserData();
    }, [])

  
    // async function isRegister(user) {     
    //   const { data,error } = await supabase
    //   .from('Profile')
    //   .select(`username, website, avatar_url`)
    //   .eq('id', user.id)
    //   .single()
    //     if (error) {
    //     console.log(error);
    //     alert('cannot add email', error);
    //   }
    //   if (data){
    //     alert("Welcome! ", session.user.email );
    //   }
    // }
    
    async function signOut() {
      await supabase.auth.signOut();
      navigate("/");
    }
  
    async function getCountries() {
      const { data } = await supabase.from("countries").select();
        setCountries(data);
    }

    async function getMeeting() {
      const { data,error } = await supabase.from("meeting").select();
        setMeeting(data);
        if (error) {
          console.log(error);
          alert('cannot add Meeting', error);
        }
    }
  
  const addThai = async () =>{
    const { data,error } = await supabase
    .from('countries')
    .insert({ name: 'Thailand' })
    .select()
    if (error) {
      console.log(error);
      alert('cannot add', error);
    }
    if (data){
      alert("Thailand's added");
      window.location.reload(false);
    }
  }
  const delThai = async () =>{
  const { error } = await supabase
    .from('countries')
    .delete()
    .eq('name', 'Thailand')
    alert("Thailand's deleted");
      window.location.reload(false);
    if (error) {
      console.log(error)
      alert('cannot delete', error)
  }
  }

    useEffect(() => {  
      // getUserData();
      getCountries();
      getMeeting();

    },[]);

    return (
      
      <div className="App">
        
          {Object.keys(user).length !== 0 ?
          <>
          <header>
          <button onClick={()=>{navigate("/Profile")}}>Profile Page</button>
            <button onClick={()=>{navigate("/MyMeeting")}}>MyMeetingPage</button>
            <button onClick={()=>{navigate("/SharedMeeting")}}>SharedMeeting Page</button>
          </header>
            <h2>Hey there {user.email}</h2>
            <button onClick={addThai}>Add Thailand</button>
            <button onClick={delThai}>Delete Thailand</button>
            <h1>Supabase Doc React JSX App template</h1>

            <p>countries</p>
            {countries.map((country) => (
              <li key={country.name}>{country.name}</li>
            ))}

            <p>Meeting Name</p>
            {meeting.map((meeting) => (
            <li key={meeting.meetName}>{meeting.meetName}</li>
            ))}

            <button onClick={() => signOut()}>Sign Out</button>

          </>
          :
          <>
            {/* if error,do something */}
          </>
          } 
        </div>
        
      );
}
export default Profile;