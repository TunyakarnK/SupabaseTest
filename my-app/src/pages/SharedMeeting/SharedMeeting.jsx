// import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from '../../supabaseClient.js';
import Navbar from '../../components/Navbar/Navbar.jsx'
import { useSession } from '@supabase/auth-helpers-react';
import MeetingCard from 'src/components/MeetingCard';
import '../../components/MeetingCard.css'
import { useNavigate, Link } from "react-router-dom";

function SharedMeeting() {
  // const navigate = useNavigate();
  const session = useSession();
  const [user, setUser] = useState({});
  const [createFolder, setCreateFolder] = useState(false);
  const [folder, setFolder] = useState([]);
  const [folderName, setFolderName] = useState([]);
  const [newMeeting, setNewMeeting] = useState([]);

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
      
    async function getNewMeeting() {
      try {
        const { data, error } = await supabase
          .from("attendee")
          .select(`
            meeting(*
            )
          `)
          // .filter("folderId", 'is', null)
          .eq("email", session.user.email)
          //จริงๆๆต้องเอาแค่ meeting ที่พึ่งสร้างใหม่
        if (error) throw error;
        if (data != null) {
          console.log("get New Meeting",data);
          setNewMeeting(data); 
        }
      } catch (error) {
        // alert(error.message);
        console.log("error get New Meeting",error);
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
          .eq("checkOwner", false)
          .eq("userId", session.user.id)
        if (error) {console.log(error);}
        if (data != null) {
          console.log("getFolder", data);
          setFolder(data); 
        }
      } catch (error) {
        // alert(error.message);
      }
    }

    return (
      <div className="App">
        {Object.keys(user).length !== 0 ?
          <>
        <header>
        <Navbar props={user}/>
        </header>
       <h1>This is SharedMeeting Page</h1>
          <div className="folders">
            {folder.map(folder => (
              <div className="folders">
              <Link to={'/SharedMeeting/Folder/' + String(folder.folders.folderId)} key={folder.folders.folderId} >
                <p>{folder.folders.folderName}</p>
                {/* <button style={{display: "flex",}} 
                onClick={delfol}
                >Delete folder</button> */}
              </Link>  
              </div>
            ))}
          </div>
       </>
       :
       <></>
       }
      </div>
    );
  }
  
  export default SharedMeeting;