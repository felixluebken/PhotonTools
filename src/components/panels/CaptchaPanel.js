import React from "react";

import './panels.css'


/*
    email
    score
    proxy
    state
    status
*/

function CaptchaPanel(props) {

    let statusText;
    let scoreColor;
    let scorePercent;
    switch(props.score) {
        case "1":
            statusText = "✅ OneClick"
            scoreColor = "#1AE9B5"
            scorePercent = "100%"
            break;
        case "0.9":
            statusText = "✅ 0.9"
            scoreColor = "#1AE9B5"
            scorePercent = "90%"
            break
        case "0.8":
            statusText = "⚠️ 0.8"
            scoreColor = "#15BABE"
            scorePercent = "80%"
            break
        case "0.7":
            statusText = "⚠️ 0.7"
            scoreColor = "#15BABE"
            scorePercent = "70%"
            break
        case "0.6":
            statusText = "❌ 0.6"
            scoreColor = "#FF6C01"
            scorePercent = "60%"
            break
        case "0.5":
            statusText = "❌ 0.5"
            scoreColor = "#FF6C01"
            scorePercent = "50%"
            break
        case "0.4":
            statusText = "❌ 0.4"
            scoreColor = "#FF6C01"
            scorePercent = "40%"
            break
        case "0.3":
            statusText = "❌ 0.3"
            scoreColor = "#FF6C01"
            scorePercent = "30%"
            break
        case "0.2":
            statusText = "❌ 0.2"
            scoreColor = "#D85059"
            scorePercent = "20%"
            break
        case "0.1":
            statusText = "❌ 0.1"
            scoreColor = "#D85059"
            scorePercent = "10%"
            break
        case "0":
            statusText = "Not Tested"
            scoreColor = "#1AE9B5"
            scorePercent = "0%"
            break

        case 1:
            statusText = "✅ OneClick"
            scoreColor = "#1AE9B5"
            scorePercent = "100%"
            break;
        case 0.9:
            statusText = "✅ 0.9"
            scoreColor = "#1AE9B5"
            scorePercent = "90%"
            break
        case 0.8:
            statusText = "⚠️ 0.8"
            scoreColor = "#15BABE"
            scorePercent = "80%"
            break
        case 0.7:
            statusText = "⚠️ 0.7"
            scoreColor = "#15BABE"
            scorePercent = "70%"
            break
        case 0.6:
            statusText = "❌ 0.6"
            scoreColor = "#FF6C01"
            scorePercent = "60%"
            break
        case 0.5:
            statusText = "❌ 0.5"
            scoreColor = "#FF6C01"
            scorePercent = "50%"
            break
        case 0.4:
            statusText = "❌ 0.4"
            scoreColor = "#FF6C01"
            scorePercent = "40%"
            break
        case 0.3:
            statusText = "❌ 0.3"
            scoreColor = "#FF6C01"
            scorePercent = "30%"
            break
        case 0.2:
            statusText = "❌ 0.2"
            scoreColor = "#D85059"
            scorePercent = "20%"
            break
        case 0.1:
            statusText = "❌ 0.1"
            scoreColor = "#D85059"
            scorePercent = "10%"
            break
        case 0:
            statusText = "Not Tested"
            scoreColor = "#1AE9B5"
            scorePercent = "0%"
            break
    }



    let startIcon;
    if(props.state === "Sleeping" || props.state === "Active") {
        startIcon = <div className="stop-icon" onClick={() => props.start(props.id)}></div>
    } else {
        startIcon = <div className="start-icon" onClick={() => props.start(props.id)}></div>
    }


    return(
        <div className="captcha_panel">
            <div className="panel-header">
                <span className="panel-header_text" style={{maxWidth:"160px"}}>{props.email}</span>
                <span className="panel-header_text">{statusText}</span>
            </div>
            <div style={{width:"100%"}}>
                <span className="panel-body_text">Proxy - </span>
                <span className="panel-body_text" style={{color:"#8B8B9E"}}>{props.proxy}</span>
            </div>
            <div style={{width:"100%"}}>
                <span className="panel-body_text">{props.state} - </span>
                <span className="panel-body_text" style={{color:"#8B8B9E"}}>{props.status}</span>
            </div>

            <div className="captcha_panel-score">
                <div className="captcha_panel-bar">
                    <div className="captcha_panel-progress" style={{width:`${scorePercent}`}}></div>
                </div>
                <div className="button-container">
                    {startIcon}
                    <div className="view-icon" onClick={() => props.view(props.id)}></div>
                    <div className="edit-icon" onClick={() => props.edit(props.id)}></div>
                    <div className="delete-icon" onClick={() => props.delete(props.id)}></div>
                </div>

            </div>
        </div>

    )
}

export default CaptchaPanel;