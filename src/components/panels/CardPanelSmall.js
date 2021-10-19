import React from "react";

import './panels.css'


function CardPanel(props) {


    let name;
    if(props.name === "" || props.name === undefined) {
        name = "No Name"
    }
    else {
        name = props.name
    }




    let expMonth;
    if(props.month === "" || props.month === undefined) {
        expMonth = "--";
    }
    else{
        expMonth = props.month;
    }

    
    let expYear;
    if(props.year === "" || props.year === undefined) {
        expYear = "--";
    }
    else{
        expYear = props.year;
    }



    let lastFour;
    if(props.cardNumber === "" || props.cardNumber === undefined) {
        lastFour = "••••"
    }
    else {

        switch(props.cardNumber.length) {
            case 13:
                lastFour = props.cardNumber.substring(12,13)+"•••";
                break;
            case 14:
                lastFour = props.cardNumber.substring(12,14)+"••";
                break;
            case 15:
                lastFour = props.cardNumber.substring(12,15)+"•";
                break;
            case 16:
                lastFour = props.cardNumber.substring(12,16);
                break;
        }
        if(props.cardNumber.length < 13) {
            lastFour = "••••";
        }

    }



    


    return(
        <div className="card_panel" style={{width:"300px",height:"180px",margin:"10px",cursor:"pointer"}} onClick={() => props.viewCard(props.index)}>


            <div className="card_panel-background" style={{width:"300px",height:"180px"}}>
                <h6 className="card_panel-title" style={{marginBottom:"10px"}}>{name}</h6>
                
                <p className="card_panel-number" style={{marginBottom:"10px"}}>•••• •••• •••• {lastFour}</p>
                <div className="card_panel-container" style={{width:"260px"}}>
                    <div className={"card_icon-"+props.cardType}></div>
                    <span className="card_panel-expiry">{expMonth}/{expYear}</span>
                </div>

            </div>
        </div>
    )
}

export default CardPanel;