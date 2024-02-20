import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { useLocation } from "react-router-dom";

function FolderStatisticPage(props) {
    const { folderid } = useParams();
    const { state } = useLocation();
    const thisid = props.folderid

    useEffect(() =>{
        console.log('state'+state)
        console.log('thisid'+thisid)
        console.log('folderid'+folderid)
      }, [])

  return (
    <div>Folder Statistic Page 
      <div>Folder Id : {folderid} </div>  
    </div>
    
  )
}

export default FolderStatisticPage