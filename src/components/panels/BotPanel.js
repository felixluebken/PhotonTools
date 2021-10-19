import React from "react";

import './panels.css'

/*
PROPS:


id
type
start
end
license
asdasd
*/

const BOT_PROPS = {
    "akari": {
        label:"Akari AIO",
        color:"D463A1"
    },
    "balko": {
        label:"Balko Bot",
        color:"2a2d3e"
    },
    "bnb": {
        label:"Better Nike Bot",
        color:"B7DB84"
    },
    "candypreme": {
        label:"CandyPreme",
        color:"BFC1FF"
    },
    "cyber": {
        label:"Cybersole",
        color:"52ff81"
    },
    "dashe": {
        label:"Dashe",
        color:"497dd2"
    },
    "estock": {
        label:"Estock",
        color:"FD347A"
    },
    "eve": {
        label:"Eve AIO",
        color:"4C60C4"
    },
    "ganesh": {
        label:"Ganesh Bot",
        color:"FF333A"
    },
    "ghost": {
        label:"Ghost AIO",
        color:"FFD500"
    },
    "kodai": {
        label:"Kodai AIO",
        color:"00ACA0"
    },
    "ksr": {
        label:"KSR",
        color:"0F66FF"
    },
    "mekpreme": {
        label:"MEKPreme",
        color:"B03E48"
    },
    "nova": {
        label:"Nova",
        color:"FFFFFF"
    },
    "nsb": {
        label:"Nike Shoe Bot",
        color:"FF9F9F0"
    },
    "nyte": {
        label:"Nyte AIO",
        color:"151724"
    },
    "phantom": {
        label:"Phantom AIO",
        color:"5347B7"
    },
    "polaris": {
        label:"Polaris AIO",
        color:"C2B1F5"
    },
    "prism": {
        label:"Prism",
        color:"9A69E9"
    },
    "pd": {
        label:"Project Destroyer",
        color:"9255A2"
    },
    "splashforce": {
        label:"Splashforce",
        color:"09090F"
    },
    "stellar": {
        label:"Stellar AIO",
        color:"1A4FC5"
    },
    "storme": {
        label:"Storme IO",
        color:"F47E4B"
    },
    "tks": {
        label:"TheKickStation",
        color:"6A53A3"
    },
    "tohru": {
        label:"Tohru AIO",
        color:"DB4F57"
    },
    "torpedo": {
        label:"Torpedo AIO",
        color:"28AECF"
    },
    "tsb": {
        label:"The Shit Bot",
        color:"5F3C17"
    },
    "valor": {
        label:"Valor AIO",
        color:"191A32"
    },
    "velox": {
        label:"Velox AIO",
        color:"1F5095"
    },
    "vite": {
        label:"Vite Bot",
        color:"FBA72A"
    },
    "wrath": {
        label:"Wrath",
        color:"58a9c5"
    }
}

function BotPanel(props) {
    let endDate = props.endDate.split("-");
    let license = " - ";

    let expiryElement = <></>

    if(props.license) {
        license = props.license
    }
    else {
        license = " - "
    }

    if(props.lifetime) {
        expiryElement = <p className="panel-body_text" style={{color:"#8B8B9E",marginTop:"3px",display:"block"}}><span style={{color:"#FFF"}}>Lifetime</span></p>

    }
    else {
        expiryElement = <p className="panel-body_text" style={{color:"#8B8B9E",marginTop:"3px",display:"block"}}>Expiry: <span style={{color:"#FFF"}}>{endDate[1].substring(0,2)+"/"+endDate[2].substring(0,2)+"/"+endDate[0].substring(0,4)}</span></p>
    }



    return(
        <div className="bot_panel">
            <div className={`bot_panel-icon bot-${props.type}`} />

            <div className="bot_panel-text">
                <p className="panel-header_text">{BOT_PROPS[props.type]["label"]}</p>
                {expiryElement}
                <p className="panel-body_text" style={{color:"#8B8B9E",cursor:"pointer",marginTop:"4px"}} onClick={() => props.clicked(license)}>License Key: <span style={{color:"#FFF"}}>{license}</span></p>
            </div>

            <div className="delete-icon" onClick={() => props.delete(props.id)} />

        </div>

    )
}

export default BotPanel;