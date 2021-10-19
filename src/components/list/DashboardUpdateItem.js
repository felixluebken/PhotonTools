import './list.css'






/*
version - str
description - str
position - str (top,mid,bottom)
newest - bool

*/





function DashboardUpdateItem(props) {
    let title;
    let version_color;
    let index = props.index




    if(props.position === "single" || props.position === "top") {
        version_color = "#19C070"
        title = "NEW UPDATE"
    } else {
        version_color = "#FF6C01"
        title = "UPDATE"
    }



    return(
        <div className="update_panel" onClick={() => props.clicked(props.index)}>
            <div className={"list_marker list_marker-"+props.position}></div>
            <div className="list_panel-main">
                <div className="list_panel-main-header">
                    <h6 className="list_title">{title}</h6>
                    <h6 className="list_title" style={{color:`${version_color}`}}>{props.version}</h6>
                </div>

                <p className="list_description">{props.description}</p>
            </div>
        </div>
    )
}


export default DashboardUpdateItem;