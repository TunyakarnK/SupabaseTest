import React from 'react';
import '../../components/MeetingCard.css'
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from '../../supabaseClient.js';
import Navbar from '../../components/Navbar/Navbar.jsx'
import MeetingCard from 'src/components/MeetingCard';



function MyMeeting() {
  const navigate = useNavigate();
  
  const [user, setUser] = useState({});
  const [createFolder, setCreateFolder] = useState(false);
  const [folder, setFolder] = useState([]);
  const [folderName, setFolderName] = useState([]);
  const [newMeeting, setNewMeeting] = useState([]);
  const [newMeetName, setNewMeetName] = useState([]);
  
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
      getFolder();
      getNewMeeting();
    }, [])

    async function deletefolder() {
      try {
          const { data, error } = await supabase
              .from("folders")
              .delete()
              .eq("folderName", folder.folderName)
          
          if (error) throw error;
          window.location.reload();
      } catch (error) {
          alert(error.message);
      }
  }
  const delfol = ()=>{
    console.log(folder.folderName)
  }

    async function getNewMeeting() {
      try {
        const { data, error } = await supabase
          .from("meeting")
          .select("*")
          //จริงๆๆต้องเอาแค่ meeting ที่พึ่งสร้างใหม่
        if (error) throw error;
        if (data != null) {
          setNewMeeting(data); 
        }
      } catch (error) {
        alert(error.message);
      }
    }

    async function getFolder() {
      try {
        const { data, error } = await supabase
          .from("folders")
          .select("*")
        if (error) throw error;
        if (data != null) {
          setFolder(data); 
        }
      } catch (error) {
        alert(error.message);
      }
    }
  
    async function createNewFolder() {
      try {
        const { data, error } = await supabase
          .from("folders")
          .insert({
            folderName: folderName
          })
          .single()
          
        if (error) throw error;
        window.location.reload();
      } catch (error) {
        alert(error.message);
      }
    }
  
    console.log(folder);

    return (
      <div className="App">
        {Object.keys(user).length !== 0 ?
          <>
        <header>
        <Navbar props={user}/>
        </header>
       <div className='body-container'>
        <h1>My Meeting</h1>
        <div className=''>
            {newMeeting.map((newMeeting) => (
            <MeetingCard meeting = {newMeeting} user = {user} />
          ))}
            </div>
       <div>
       {/* <h1>My Meeting</h1> */}
       <button className="Button" onClick={() => setCreateFolder(true)}> + New Folder</button>
       { createFolder == false ?
        <>
          <div className="folders">
            {folder.map(folder => (
              <div className="folders">
              <Link to={String(folder.folderId)} key={folder.folderId} >
                <p>{folder.folderId}{folder.folderName}</p>
                {/* <button style={{display: "flex",}} 
                onClick={delfol}
                >Delete folder</button> */}
              </Link>  
              </div>
            ))}
            
          </div>

          {/* <div>
            {folder.map((folder) => (
            <li key = {folder.folderName}>
              {folder.folderName}
            
            </li>
          ))}
            </div> */}
            
        </>
          : 
        <>            
        <div>
             <h3>Create New Folder in Supabase Database</h3>
             <form>
              <label>Folder Name
              <input type="text" 
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)} />
             </label>
             </form>
             <br></br>
             <button className="Button" onClick={() => createNewFolder()}>Create Folder</button>
        </div>
        </>
       }
       </div>
       </div>
       
       </>
       :
       <></>
       }
      </div>
    );
  }
  
  export default MyMeeting;
