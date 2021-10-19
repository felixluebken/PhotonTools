import React from "react";

import './panels.css'


/*
    index
    proxy
    speed
*/

function ProxyPanel(props) {


    let speedColor;
    let speed;
    if(props.speed === "") {
        speedColor = "#F1F1F2"
        speed = "---"
    }
    else if(props.speed < 1000) {
        speedColor = "#1AE9B5"
        speed = props.speed + "ms"
    }
    else if(props.speed >= 1000 && props.speed < 2000) {
        speedColor = "#FF6C01"
        speed = props.speed + "ms"
    }
    else if(props.speed >= 3000) {
        speedColor = "#D85059"
        speed = props.speed + "ms"
    }
    else if(props.speed === "BAD") {
        speedColor = "#D85059"
        speed = props.speed
    }
    else {
        speedColor = "#F1F1F2"
        speed = "---"      
    }
    return(
        <div className="proxy_panel">
            <span className="panel-header_text" style={{maxWidth:"180px"}}>{props.proxy}</span>
            <span className="panel-header_text" style={{color:`${speedColor}`}}>{speed}</span>
            <div style={{marginRight:"10px",cursor:"pointer"}} onClick={() => props.deleteProxy(props.index)}>
            <svg width="11" height="14" viewBox="0 0 11 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M0.777784 12.4443C0.777784 13.2999 1.47778 13.9999 2.33334 13.9999H8.55555C9.41111 13.9999 10.1111 13.2999 10.1111 12.4443V4.66656C10.1111 3.81101 9.41111 3.11101 8.55555 3.11101H2.33334C1.47778 3.11101 0.777784 3.81101 0.777784 4.66656V12.4443ZM10.1111 0.777777H8.16666L7.61444 0.225555C7.47444 0.0855554 7.27221 0 7.06999 0H3.81888C3.61666 0 3.41444 0.0855554 3.27444 0.225555L2.72222 0.777777H0.777777C0.35 0.777777 0 1.12778 0 1.55555C0 1.98333 0.35 2.33333 0.777777 2.33333H10.1111C10.5389 2.33333 10.8889 1.98333 10.8889 1.55555C10.8889 1.12778 10.5389 0.777777 10.1111 0.777777Z" fill="#D85059"/>
            </svg>

            </div>
        </div>

    )
}

export default ProxyPanel;