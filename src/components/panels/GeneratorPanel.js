import React from "react";

import './panels.css'


/*
    email
    password
    state
    type
*/

function CaptchaPanel(props) {

    let statusTitle
    let statusText;

    let statusWidth;
    let statusColor;
    

    if(props.state === "queued") {
        statusTitle = "Queued - ";
        statusText = "Waiting for generator"
        statusWidth = "50%";
        statusColor = "#FF6C01";
    }
    else if(props.state === "generating") {
        statusTitle = "Generating";
        statusText = "Signing up to " + props.type
        statusWidth = "75%";
        statusColor = "#15BABE";
    }
    else if(props.state === "error_generating") {
        statusTitle = "Error - ";
        statusText = "Error generating " + props.type
        statusWidth = "20%";
        statusColor = "#D85059";
    }
    else if(props.state === "error_signingin") {
        statusTitle = "Error - ";
        statusText = "Error signing into " + props.type
        statusWidth = "20%";
        statusColor = "#D85059";
    }
    else if(props.state === "good") {
        statusTitle = "Completed";
        statusText = ""
        statusWidth = "100%";
        statusColor = "#1AE9B5";
    }
    else if(props.state === "testing") {
        statusTitle = "Testing - ";
        statusText = "Checking account"
        statusWidth = "80%";
        statusColor = "#15BABE";
    }

    return(
        <div className="captcha_panel" style={{height:"121px"}}>
            <div className="panel-header">
                <span className="panel-header_text"  style={{maxWidth:"160px"}}>{props.email}</span>
                <span className="panel-header_text">{props.type.toUpperCase()}</span>
            </div>

            <div style={{width:"100%"}}>
                <span className="panel-body_text">Password - </span>
                <span className="panel-body_text" style={{color:"#8B8B9E"}}>{props.password}</span>
            </div>

            <div style={{width:"100%"}}>
                <span className="panel-body_text">{statusTitle}</span>
                <span className="panel-body_text" style={{color:"#8B8B9E"}}>{statusText}</span>
            </div>

            <div className="captcha_panel-score">
                <div className="captcha_panel-bar">
                    <div className="captcha_panel-progress" style={{width:`${statusWidth}`,backgroundColor:`${statusColor}`}}></div>
                </div>
                <div className="button-container">
                    <div className="start-icon" onClick={() => props.test(props.id)}></div>
                    <div className="delete-icon" onClick={() => props.delete(props.id)}></div>
                </div>

            </div>
        </div>

    )
}

export default CaptchaPanel;