import React from 'react'
import "./MeetingCard.css"
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import "src/components/MeetingCard.css"
import { Link,NavLink,useNavigate } from 'react-router-dom';
import { rem, TextInput, Grid, Text, Button, ActionIcon, Modal, Popover} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconTrash,IconEdit } from '@tabler/icons-react';

function FolderCard(props) {
  const folder = props.folder;
  const user = props.user;
  const navigate = useNavigate();
  const [folderName, setFolderName] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [ checkOwner, setCheckOwner ] = useState(false);
  const [ folderOwner, setFolderOwner ] = useState("");

  function handleButtonClick (){
    navigate('Folder/' + folder.folders.folderId, { state: { user } });    
}
  console.log(user.id);

  useEffect(() => {
    fetchOwnerFolder();
    checkOwnerFolder();
  }, []);

  const fetchOwnerFolder = async () => {
    await supabase
      .from("userFolder")
      .select("userId, checkOwner")
      .eq("folderId", folder.folders.folderId)
      .eq("checkOwner", true)
      .then((result) => {
        console.log("fetch Creator", result.data[0].checkOwner);
        console.log("fetch id creator", result.data[0].userId);
        supabase
        .from("user")
        .select("full_name")
        .eq("id", result.data[0].userId)
        .then((result) => {
          console.log(result.data[0].full_name);
          setFolderOwner(result.data[0].full_name)
        })
      })
  };

  const checkOwnerFolder = async () => {
    const { data, error } = await supabase
      .from("userFolder")
      .select("checkOwner")
      .eq("folderId", folder.folders.folderId)
      .eq("userId", user.id)
      if (data) {
        console.log("checkOwnerFolder", data[0].checkOwner);
        setCheckOwner(data[0].checkOwner);
      }
  }

async function updateFolderName(){
  try {
            const { data, error } = await supabase
                .from("folders")
                .update({
                  folderName: folderName,
                })
                .eq("folderId", folder.folderId) 
            // if (error) throw error;
            window.location.reload();
        } catch (error) {
            // alert(error.message);
        }
}

async function deletefolder() {
  try {
      const { data, error } = await supabase
          .from("folders")
          .delete()
          .eq("folderId", folder.folders.folderId)
      // if (error) throw error;
      window.location.reload();
  } catch (error) {
      // alert(error.message);
  }
}

  return (
    // <div className=''>MyMeetingFolderCard</div>
    <>
    {checkOwner == true ? ( 
    <div className='meetCard' 
    // onClick={() => handleButtonClick()} 
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
    style={{ padding: '10px',borderBottom: '1px solid #202F34',backgroundColor: isHovered ? '#eddecf' : 'transparent', transition: 'background-color 0.3s ease',cursor: 'pointer' }}
    >                
        <Grid align="center" >
        <Grid.Col span={5} onClick={()=>handleButtonClick()} ><Text >{folder.folders.folderName}</Text></Grid.Col>
        <Grid.Col span={6} onClick={()=>handleButtonClick()} ><Text>{folderOwner}</Text></Grid.Col>

        <Grid.Col span={0.5} ><Popover width={300} trapFocus position="left" withArrow shadow="md"><Popover.Target>
          <ActionIcon variant="subtle" color="#EE5D20"><IconEdit/></ActionIcon>
          </Popover.Target>
          <Popover.Dropdown>
              <TextInput label="Rename Folder" defaultValue={folder.folderName} size="xs" onChange={(event) => setFolderName(event.currentTarget.value)} />
              <Button color='#EE5D20' onClick={close} style={{marginTop:'10px',marginRight:'10px',marginLeft:'90px'}}>Cancel</Button>
              <Button variant='outline' color='#EE5D20' style={{marginTop:'10px'}} onClick={()=>updateFolderName()}>Update</Button>
          </Popover.Dropdown></Popover>
        </Grid.Col>
        
        <Grid.Col span={0} ><ActionIcon onClick={open} variant="subtle" color="#EE5D20"><IconTrash/></ActionIcon></Grid.Col>  
        </Grid>   
        
        <Modal opened={opened} onClose={close} title="Delete" centered>
        <div style={{padding:'10px'}}>Do you want to delete {folder.folderName} ?</div>
       
       <div>
        <Button color='#EE5D20' onClick={close} style={{margin:'10px'}}>Cancel</Button>
        <Button variant='outline' color='#EE5D20' onClick={()=>deletefolder()}>Delete</Button>
       </div>
       </Modal>   

  </div> ):    <div className='meetCard' 
    // onClick={() => handleButtonClick()} 
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
    style={{ padding: '10px',borderBottom: '1px solid #202F34',backgroundColor: isHovered ? '#eddecf' : 'transparent', transition: 'background-color 0.3s ease',cursor: 'pointer' }}
    ><Grid align="center" >
    <Grid.Col span={5} onClick={()=>handleButtonClick()} ><Text >{folder.folders.folderName}</Text></Grid.Col>
    <Grid.Col span={6} onClick={()=>handleButtonClick()} ><Text>{folderOwner}</Text></Grid.Col></Grid> </div>}
  </>
  )
}

export default FolderCard