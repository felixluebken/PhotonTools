import React from "react";

import './panels.css'


/*
    name
    type
    content
    index
    allowModify
*/

function combineProxy(ip,port,user,pass) {
    if(user === undefined) {
        return ip + ":" + port
    }
    else {
        return ip + ":" + port + ":" + user + ":" + pass
    }
}



function GroupPanel(props) {
    let contentsIndicator;
    let first;
    let second;
    
    let modifyButtons;


    if(props.content === undefined) {
        contentsIndicator = 
            <span className="panel-body_text" style={{color:"#8B8B9E"}}>No {props.type}</span>
    }
    else if(props.content.length === 0) {
        contentsIndicator = 
            <span className="panel-body_text" style={{color:"#8B8B9E"}}>No {props.type}</span>
    }
    else if(props.content.length === 1) {
        if(props.type === "proxies") {
            first = combineProxy(props.content[0]["ip"],props.content[0]["port"],props.content[0]["user"],props.content[0]["pass"])
            second = ""
        }
        else if(props.type === "accounts") {
            first = props.content[0]["email"] + ":" + props.content[0]["password"]
            second = ""
        }
        else if(props.type === "cards") {
            first = props.content[0]["name"]
            second = ""
        }
        else {
            first = props.content[0]
            second = ""
        }

        contentsIndicator = 
            <span className="panel-body_text"></span>
    }
    else if(props.content.length === 2) {
        if(props.type === "proxies") {
            first = combineProxy(props.content[0]["ip"],props.content[0]["port"],props.content[0]["user"],props.content[0]["pass"])
            second = combineProxy(props.content[1]["ip"],props.content[1]["port"],props.content[1]["user"],props.content[1]["pass"])
        }
        else if(props.type === "accounts") {
            first = props.content[0]["email"] + ":" + props.content[0]["password"]
            second = props.content[1]["email"] + ":" + props.content[1]["password"]
        }
        else if(props.type === "cards") {
            first = props.content[0]["name"]
            second = props.content[1]["name"]
        }
        else {
            first = props.content[0]
            second = props.content[1]
        }

        contentsIndicator = 
            <span className="panel-body_text"></span>
    } 
    else {
        if(props.type === "proxies") {
            first = combineProxy(props.content[0]["ip"],props.content[0]["port"],props.content[0]["user"],props.content[0]["pass"])
            second = combineProxy(props.content[1]["ip"],props.content[1]["port"],props.content[1]["user"],props.content[1]["pass"])
        }
        else if(props.type === "accounts") {
            first = props.content[0]["email"] + ":" + props.content[0]["password"]
            second = props.content[1]["email"] + ":" + props.content[1]["password"]
        }
        else if(props.type === "cards") {
            first = props.content[0]["name"]
            second = props.content[1]["name"]
        }
        else {
            first = props.content[0]
            second = props.content[1]
        }

        contentsIndicator = 
            <span className="panel-body_text" style={{color:"#8B8B9E",marginLeft:"10px",maxWidth:"70%"}}> and {props.content.length - 2} more {props.type}</span>
        
    }



    if(props.allowModify) {
        modifyButtons = <div className="button-container" style={{marginRight:"10px"}}>
            <div className="edit-icon" onClick={() => props.editGroup(props.index)}></div>
            <div className="delete-icon" onClick={() => props.deleteGroup(props.index)}></div>
        </div>
    }
    else {
        modifyButtons = <></>
    }


    return(
        <div className="group_panel" style={{cursor:"pointer"}} onClick={() => props.switchGroup(props.index)}>
            <div className="panel-header">
                <span className="panel-header_text">{props.name}</span>
                <span className="panel-header_text" style={{color:"#8B8B9E"}}>{props.content.length} {props.type}</span>
                
            </div>
            <div style={{width:"100%"}}>
                <p className="panel-body_text">{first}</p>
            </div>
            
            <p className="panel-body_text">{second}</p>
            <div className="panel-body">

                {contentsIndicator}



                {modifyButtons}
                {/*
                <div className="button-container" style={{marginRight:"10px"}}>
                    <div className="edit-icon" onClick={() => props.editGroup(props.index)}></div>
                    <div className="delete-icon" onClick={() => props.deleteGroup(props.index)}></div>
                </div>
                */}

            </div>

        </div>
    )
}

export default GroupPanel;