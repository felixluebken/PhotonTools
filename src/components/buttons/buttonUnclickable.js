import './button.css'


/*
    icon
    text
    color
    width
    height
    border
*/

function Button(props) {

    if(props.text === undefined) {
        return(
            <div className="button_container" style={{cursor:"auto",backgroundColor:`${props.color}`,width:`${props.width}`,height:`${props.height}`,border:`${props.border}`}}>
                <div className={"button_icon-"+props.icon}></div>
            </div>
        )
    }
    else if(props.icon === undefined) {
        return(
            <div className="button_container" style={{cursor:"auto",backgroundColor:`${props.color}`,width:`${props.width}`,height:`${props.height}`,border:`${props.border}`}} >
                <p className="button_text">{props.text}</p>
            </div>
        )
    } else {
        return(
            <div className="button_container" style={{cursor:"auto",backgroundColor:`${props.color}`,width:`${props.width}`,height:`${props.height}`,border:`${props.border}`}}>
                <div className={"button_icon-"+props.icon}></div>
                <p className="button_text">{props.text}</p>
            </div>
        )
    }


}


export default Button;