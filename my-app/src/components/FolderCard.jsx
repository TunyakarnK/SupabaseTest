import React from 'react'
import { Link, useLoaderData } from "react-router-dom"
import "./MeetingCard.css"

function FolderCard() {
  async function deletefolder() {
    try {
        const { data, error } = await supabase
            .from("meeting")
            .delete()
            .eq("meetId", meeting.meetId)
        
        if (error) throw error;
        window.location.reload();
    } catch (error) {
        alert(error.message);
    }
}
  return (
    // <div className=''>MyMeetingFolderCard</div>
    <div className="folders">
      {folder.map(career => (
        <Link to={'/Folder/' + career.id.toString()}>{career.title}</Link>
        
      ))}
    </div>
  )
}

export default FolderCard