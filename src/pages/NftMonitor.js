import React, { useState, useEffect } from "react";


import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { makeStyles } from "@material-ui/core/styles";
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';

import Pagination from '@material-ui/lab/Pagination';

import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import FilterListIcon from '@material-ui/icons/FilterList';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';

import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField'

import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import Skeleton from '@material-ui/lab/Skeleton';

import './pages.css'

import NftPanel from '../components/panels/NftPanel'


const { ipcRenderer } = window.require('electron/renderer')


const priceLimits = [
    {
        label:"< 0.1 ETH",
        value:0.1
    },
    {
        label:"< 1 ETH",
        value:1
    },
    {
        label:"< 10 ETH",
        value:10
    },
    {
        label:"< 20 ETH",
        value:20
    },
    {
        label:"< 30 ETH",
        value:30
    },
    {
        label:"< 40 ETH",
        value:40
    },
    {
        label:"< 50 ETH",
        value:50
    }
]
const filterItems = [
    {
        label:"🡡 Sale Date",
        value:1
    },
    {
        label:"🡣 Sale Date",
        value:2
    },
    {
        label:"🡡 Sale Count",
        value:3
    },
    {
        label:"🡣 Sale Count",
        value:4
    }
]
const filterValues = [
    "/",
    "sale_date/asc",
    "sale_date/desc",
    "sale_count/asc",
    "sale_count/desc",
    "sale_price/asc",
    "sale_price/desc"
]


const theme = createTheme({
    palette: {
        primary: {
            main: '#15BABE'
        },
        secondary: {
            main: '#8B8B9E'
        },
        background: {
            paper:"#15151D",
            default: "#fafafa"
        },
        text: {
            primary:"#fff"
        },
        type:"dark",

    }
})
const useStyles = makeStyles((theme) => ({
    pagination: {
        '& > *': {
            marginTop: theme.spacing(2),
          },
        display:"flex",
        justifyContent:"center"
    },
    searchBar: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        marginTop:"6px",
        width: "100%",
        height: 36,
    },
    searchInput: {
        marginLeft: theme.spacing(1),
        flex: 1,
        width:"80%"
    },
    iconButton: {
        padding: 10,
    },
    select: {
        width:120
    },
    divider: {
        height: 28,
        margin: 4,
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: "#0E0E14",
        border: '1px solid #343444',
        outline: 'none',
        borderRadius: '3px',
        boxShadow: theme.shadows[5],
        padding: "8px 8px 8px 8px",
    }
}));

function useForceUpdate(){
    const [value, setValue] = React.useState(0); // integer state
    return () => setValue(value => value + 1); // update the state to force render
}







let nftItems = null;

let pageCount = 0;
let nftElements = <></>;

let initialLoad = true;





function NftMonitor(props) {
    const classes = useStyles();
    const forceUpdate = useForceUpdate()


    const requestNfts = () => {
        console.log("REQUESTING DATA")
        var filterParts = filterValues[filter].split("/")
        ipcRenderer.send('getNftData', {
            order_by: filterParts[0],
            order_direction: filterParts[1]
        })

        ipcRenderer.on('getNftData', (event,arg) => {
            ipcRenderer.removeAllListeners('getNftData')
            nftItems = arg.nftData
            console.log(nftItems)
            forceUpdate()
        })

    }




    const [filter,setFilter] = React.useState(2)
    const [openFilter, setOpenFilter] = React.useState(null);
    const handleOpenFilter = (event) => {
        setOpenFilter(event.currentTarget);
    };
    const handleCloseFilter = (event) => {
        console.log(event.target.value)
        if(event.target.value) {
            console.log(event.target.value)
            nftItems = null;
            setFilter(event.target.value)
        }
        
        setOpenFilter(null);
    };


    const [page, setPage] = React.useState(1);
    const handlePageChange = (event, value) => {
      setPage(value);
    };




    if(initialLoad || nftItems === null) {
        initialLoad = false;
        requestNfts()
    }


    console.log("updating")



    if(nftItems === null) {
        console.log("EMPTY LISTINGS")
        pageCount=0
        nftElements = Array(12).fill(<div style={{margin:"5px"}}>
            <Skeleton variant="rect" width={260} height={170} />
            <Skeleton variant="text" />
            <Skeleton variant="text" width={110} />
        </div>)
    }
    else {
        console.log("CREATING LISTINGS")
        pageCount=10
        nftElements = nftItems["assets"].map((listing,index) => 
            <NftPanel 
                name={listing["name"]} 
                thumbnail={listing["image_thumbnail_url"]} 
                sales={listing["num_sales"]} 

                salesHistory={listing["last_sale"]}
                url={listing["permalink"]}
                owner={listing["owner"]["user"]}

                openURL={(link) => ipcRenderer.send('openLink', {url:link})}

            />
        )
    }







    return(
        <ThemeProvider theme={theme}>
            <div className="page">
                <div className="page_header">
                    <div className="page_header-section">
                        <h6 className="page_title">NFT Monitor</h6>
                        <p className="page_subtitle">Manage your NFTs</p>
                    </div>                    
                </div>
                <div className="page_body" style={{display:"block"}}>
                    <div className="page_body-header" style={{alignItems:"top"}}>
                        <Paper component="form" className={classes.searchBar}>
                            <IconButton type="submit" onClick={handleOpenFilter} className={classes.iconButton} aria-label="search">
                                <FilterListIcon />
                            </IconButton>
                            <Menu
                                id="filterMenu"
                                anchorEl={openFilter}
                                keepMounted
                                open={Boolean(openFilter)}
                                onClose={handleCloseFilter}
                            >

                            {filterItems.map((option) => (
                                <MenuItem onClick={handleCloseFilter} key={option.value} value={option.value} name={option.value}>
                                {option.label}
                                </MenuItem>
                            ))}
                            </Menu>

                            <Divider className={classes.divider} orientation="vertical" />

                            <InputBase
                                className={classes.searchInput}
                                placeholder="Search NFT Marketplace..."
                            />
                            
                            <IconButton type="submit" onClick={() => console.log("CLICKED")} className={classes.iconButton} aria-label="search">
                                <SearchIcon />
                            </IconButton>


                        </Paper>   
                    </div>


                    <div className="nft_container">
                        {nftElements}
                    </div>

                </div>
            </div>

        </ThemeProvider>
    )
}


export default NftMonitor;