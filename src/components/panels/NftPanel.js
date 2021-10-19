import React, { useState, useEffect } from "react";

/*
    name
    owner
    thumbnail
    sales
    totalPrice
    decimalSpots


*/



function NftPanel(props) {
    let name;
    let owner;
    let totalPrice;


    if(!props.name) {
        name = "NO NAME"
    }
    else {
        name = props.name
    }



    if(props.salesHistory) {
        totalPrice = props.salesHistory["total_price"] / Math.pow(10,props.salesHistory["payment_token"]["decimals"])
    }
    else {
        totalPrice = "-"
    }


    if(!props.owner) owner = " - "
    else if(props.owner["username"] === "NullAddress") owner = " - "
    else owner = props.owner["username"]
    
    


    return(
        <div className="nft_panel" onClick={() => props.openURL(props.url)}>
            <p className="panel-header_text" style={{margin:"6px auto",textAlign:"center",width:"100%"}}>{name}</p>
            <div className="nft_panel-thumbnail" style={{backgroundImage:`url(${props.thumbnail})`}} />
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:"7px"}}>
                <p className="panel-body_text">Sales: {props.sales}</p>
                <p className="panel-body_text" style={{marginRight:"10px"}}>{totalPrice} ETH</p>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:"7px"}}>
                <p className="panel-body_text" style={{marginRight:"10px"}}>Owner: {owner}</p>
                <p className="panel-body_text" style={{marginRight:"10px",cursor:"pointer"}}>OPEN </p>
            </div>
            
        </div>
    )
}


export default NftPanel;


