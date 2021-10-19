

import './list.css'






/*
state = str (SUCCESS,MESSAGE,ERROR)
title = str
description = str
position - str (top,mid,bottom)
*/





function DashboardStatusItem(props) {
    let title_color;
    
    if(props.state === "SUCCESS") {
        title_color = "#19C070"
    } else if(props.state === "ERROR") {
        title_color = "#D85059"
    } else {
        title_color = "#F1F1F2"
    }

    return(
        <div className="status_panel">
            <div className={"list_marker list_marker-"+props.position}></div>
            <div className="list_panel-main">
                <div className="list_panel-main-header">
                    <h6 className="list_title" style={{color:`${title_color}`}}>{props.state}</h6>
                    <h6 className="list_title" style={{color:"#8B8B9E"}}>{props.title}</h6>
                    
                </div>

                <p className="list_description">{props.description}</p>
            </div>
        </div>
    )
}


export default DashboardStatusItem;