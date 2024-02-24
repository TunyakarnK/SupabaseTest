import React from 'react';
import '../../components/MeetingCard.css'
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from '../../supabaseClient.js';
import Navbar from '../../components/Navbar/Navbar.jsx'
import MeetingCard from 'src/components/MeetingCard';
import { useSession } from '@supabase/auth-helpers-react';


function MyMeeting() {
  const navigate = useNavigate();
  const session = useSession();
  const [user, setUser] = useState({});
  const [createFolder, setCreateFolder] = useState(false);
  const [folder, setFolder] = useState([]);
  const [folderName, setFolderName] = useState([]);
  const [newMeeting, setNewMeeting] = useState([]);
  const [newMeetName, setNewMeetName] = useState([]);
  const [ folderOwner, setFolderOwner ] = useState(null);
  
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
          // .filter("folderId", 'is', null)
          .eq("creatorId", session.user.id)
          //จริงๆๆต้องเอาแค่ meeting ที่พึ่งสร้างใหม่
        if (error) throw error;
        if (data != null) {
          console.log("getNewMeeting",data);
          setNewMeeting(data); 
        }
      } catch (error) {
        // alert(error.message);
        console.log("getNewMeeting",error);
      }
    }

    async function getFolder() {
      try {
        const { data, error } = await supabase
          .from("userFolder")
          .select(
            `
            userId,
            folders(folderName,folderId)
            `
          )
          .eq("checkOwner", true)
          .eq("userId", session.user.id)
        if (error) throw error;
        if (data != null) {
          console.log("getFolder", data);
          setFolder(data); 
        }
      } catch (error) {
        // alert(error.message);
      }
    }
    async function createNewFolder() {
      try {
        const { data, error } = await supabase
          .from("folders")
          .insert({
            folderName: folderName
          })
          .select("folderId")
          .single()
          .then((result) => {
            console.log("create New Folder", result);
            supabase
            .from("userFolder")
            .insert({
              userId: session.user.id,
              folderId: result.data.folderId,
              checkOwner: true
            })
            .then((result) => {
              console.log("user Folder", result);
              setFolderOwner(result);
              // window.location.reload();
            });
          });
        if (result){
          console.log("create New Folder", result);
        }
      } catch (error) {
        // alert(error.message);
      }
    }
  
    console.log(folder);
    console.log(folderOwner);
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
              <Link to={'/Folder/' + String(folder.folders.folderId)} key={folder.folders.folderId} >
                <p>{folder.folders.folderName}</p>
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
