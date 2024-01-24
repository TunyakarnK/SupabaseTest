import React from 'react'
import MeetingCard from 'src/components/MeetingCard';
import { useParams } from 'react-router-dom'

function MeetingList({folders}) {
  const { folderId } = useParams();
  // const folder = folders.find((folder) => folder.id.toString() === id);
  return (
    // <div>My Meeting ❯ {folder.folderName}</div>
    <div>My Meeting ❯ {folderId}</div>
    
  )
}

export default MeetingList