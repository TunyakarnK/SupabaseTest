import React from 'react'
import { Link, useLoaderData } from "react-router-dom"
import "./MeetingCard.css"

function FolderCard() {
  async function deletefolder() {
    try {
        const { data, error } = await supabase
            .from("meeting")
            .delete()
            .eq("meetName", meeting.meetName)
        
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
        <Link to={career.id.toString()} key={career.id}>
          <p>{career.title}</p>
          <p>Based in {career.location}</p>
        </Link>
      ))}
    </div>
  )
}

export default FolderCard