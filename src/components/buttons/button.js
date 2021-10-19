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
            <div className="button_container" style={{backgroundColor:`${props.color}`,width:`${props.width}`,height:`${props.height}`,border:`${props.border}`}} onClick={() => props.clicked()}>
                <div className={"button_icon-"+props.icon}></div>
            </div>
        )
    }
    else if(props.icon === undefined) {
        return(
            <div className="button_container" style={{backgroundColor:`${props.color}`,width:`${props.width}`,height:`${props.height}`,border:`${props.border}`}} onClick={() => props.clicked()}>
                <p className="button_text">{props.text}</p>
            </div>
        )
    } else {
        return(
            <div className="button_container" style={{backgroundColor:`${props.color}`,width:`${props.width}`,height:`${props.height}`,border:`${props.border}`}} onClick={() => props.clicked()}>
                <div className={"button_icon-"+props.icon}></div>
                <p className="button_text">{props.text}</p>
            </div>
        )
    }


}


export default Button;