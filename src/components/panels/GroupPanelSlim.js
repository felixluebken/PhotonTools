import React from "react";

import './panels.css'


/*
    name
    amount
    type
*/
function GroupPanelSlim(props) {

    let contentsIndicator;

    
    if(props.content === undefined) {
        contentsIndicator = 
            <span className="panel-body_text">No {props.type}</span>
    }
    else if(props.content.length === 0) {
        contentsIndicator = 
            <span className="panel-body_text">No {props.type}</span>
    }
    else if(props.content.length === 1) {
        if(props.type === "profiles") {
            contentsIndicator = 
            <span className="panel-body_text">{props.content[0]["profile_name"]}</span>
        }
        else {
            contentsIndicator = 
                <span className="panel-body_text">{props.content[0]}</span>
        }

    }
    else if(props.content.length === 2) {
        if(props.type === "profiles") {
            contentsIndicator = 
            <span className="panel-body_text">{props.content[0]["profile_name"] + ", " + props.content[1]["profile_name"]}</span>
        }
        else {
            contentsIndicator = 
                <span className="panel-body_text">{props.content[0] + ", " + props.content[1]}</span>
        }
    } 
    else {
        if(props.type === "profiles") {
            contentsIndicator = 
            <span className="panel-body_text-container">
                <span className="panel-body_text" style={{maxWidth:"45%"}}>{props.content[0]["profile_name"]}, {props.content[1]["profile_name"]}, </span>
                <span className="panel-body_text" style={{color:"#8B8B9E",marginLeft:"3px",maxWidth:"45%"}}> and {props.content.length - 2} more {props.type}</span>
            </span>
        }
        else {
            contentsIndicator =
            <span className="panel-body_text-container">
                <span className="panel-body_text" style={{maxWidth:"45%"}}>{props.content[0]}, {props.content[0]}, </span>
                <span className="panel-body_text" style={{color:"#8B8B9E",marginLeft:"3px",maxWidth:"45%"}}> and {props.content.length - 2} more {props.type}</span>
            </span>
        }

        
        
    }



    return(
        <div className="group_panel-slim" style={{cursor:"pointer"}} onClick={() => props.switchGroup(props.index)}>
            <div className="panel-header">
                <span className="panel-header_text">{props.name}</span>
                <span className="panel-header_text" style={{color:"#8B8B9E"}}>{props.content.length} {props.type}</span>
                
            </div>
            <div className="panel-body">
                {contentsIndicator}
                <div className="button-container" style={{marginRight:"10px"}}>
                    <div className="edit-icon" onClick={() => props.editGroup(props.index)}></div>
                    <div className="delete-icon" onClick={() => props.deleteGroup(props.index)}></div>
                </div>

            </div>

        </div>
    )
}

export default GroupPanelSlim;