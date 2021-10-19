

import './titles.css'
/*
color
amount
title

*/



function DotTitle(props) {
    return(
        <div className="dot_title-container">
            <div className="dot_marker" style={{backgroundColor:`${props.color}`}}></div>
            <span className="small_title">{props.amount}</span>
            <span className="small_title">{props.title}</span>
        </div>
    )

}



export default DotTitle;

