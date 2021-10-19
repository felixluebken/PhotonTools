import React from "react";

import './panels.css'


/*
    index
    lastFour
    name
    cardType

    
    street
    zip
    state
    city
*/

function ProfilesPanel(props) {

    let iconColor;
    let iconIndex = props.index % 3;

    if(iconIndex === 0) {
        iconColor = "blue"
    }
    else if(iconIndex === 1) {
        iconColor = "red"
    }
    else {
        iconColor = "green"
    }


    return(
        <div className="profile_panel" style={{marginRight:"3%"}}>
            <div className="panel-header">
                <div className="button-container">
                    <div className={"profile-"+iconColor}>
                    </div>
                    <span className="panel-header_text">{props.profileName}</span>
                </div>
                
                <div className={"icon-"+props.cardType}></div>
            </div>

            <span className="panel-body_text" style={{width:"100%",marginBottom:"3px"}}>••••  ••••  ••••  {props.lastFour}</span>
            <span className="panel-body_text" style={{color:"#8B8B9E",width:"100%",marginBottom:"3px"}}>{props.name}</span>


            <div className="panel-body_footer">
                <span className="panel-body_text" style={{color:"#8B8B9E",width:"100%",marginLeft:"10px"}}>{props.street}, {props.zip}, {props.state}, {props.state}</span>
                <div className="button-container" style={{marginRight:"10px"}}>
                    <div className="edit-icon" onClick={() => props.editProfile(props.index)}></div>
                    <div className="delete-icon" onClick={() => props.deleteProfile(props.index)}></div>
                </div>

            </div>
        </div>

    )
}

export default ProfilesPanel;