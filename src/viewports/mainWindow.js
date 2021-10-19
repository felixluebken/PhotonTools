
import './mainWindow.css';
import './popups.css'

import Dashboard from '../pages/Dashboard';
import Captcha from '../pages/Captcha';
import Profiles from '../pages/Profiles';
import Proxies from '../pages/Proxies'
import BotManager from '../pages/BotManager'
import NftMonitor from '../pages/NftMonitor'

import AccountGen from '../pages/AccountGen';
import CardGen from '../pages/CardGen'
import EmailGen from '../pages/EmailGen'

import {HashRouter,Link,Route,Switch} from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

import Snackbar from '@material-ui/core/Snackbar';
import {Alert, AlertTitle} from '@material-ui/lab';


const { ipcRenderer } = window.require('electron/renderer')

let notifications;
let discordAvatar;
let photonMuted = false;
let muteButton = <svg className="nav_icon" id="nav_icon-notifications" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path id="nav_icon" fillRule="evenodd" clipRule="evenodd" d="M10.9999 20.1667C12.0083 20.1667 12.8333 19.3417 12.8333 18.3334H9.16659C9.16659 19.3417 9.98242 20.1667 10.9999 20.1667ZM16.4999 14.6667V10.0834C16.4999 7.26919 14.9966 4.91335 12.3749 4.29002V3.66669C12.3749 2.90585 11.7608 2.29169 10.9999 2.29169C10.2391 2.29169 9.62493 2.90585 9.62493 3.66669V4.29002C6.99409 4.91335 5.49993 7.26002 5.49993 10.0834V14.6667L4.31743 15.8492C3.73993 16.4267 4.14326 17.4167 4.95909 17.4167H17.0316C17.8474 17.4167 18.2599 16.4267 17.6824 15.8492L16.4999 14.6667Z"/>
</svg>


//<rect transform="rotate(45 11 11)" stroke-width="0" id="svg_3" height="3" width="26" y="9.5" x="-2" stroke="#000" fill="#d85059"/>

let avatarElement = <div className="user_avatar-small"></div>



const useStyles = makeStyles((theme) => ({
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
  },
}));

function useForceUpdate(){
    const [value, setValue] = React.useState(0); // integer state
    return () => setValue(value => value + 1); // update the state to force render
}


const remote = window.require('electron').remote;

const DashboardPage = () => {

    return(
        <Dashboard notifications={notifications} muted={photonMuted} />
    )



}
const CaptchaPage = () => {
    return(
        <Captcha muted={photonMuted}/>
    )
}
const ProfilesPage = () => {
    return(
        <Profiles muted={photonMuted}/>
    )
}
const ProxiesPage = () => {
    return(
        <Proxies muted={photonMuted}/>
    )
}
const AccountGenPage = () => {
    return(
        <AccountGen muted={photonMuted}/>
    )
}
const CardGenPage = () => {
    return(
        <CardGen muted={photonMuted}/>
    )
}
const EmailGenPage = () => {
    return(
        <EmailGen muted={photonMuted}/>
    )
}
const BotManagerPage = () => {
    return(
        <BotManager muted={photonMuted}/>
    )
}
const NftMonitorpage = () => {
    return(
        <NftMonitor muted={photonMuted}/>
    )
}




const App = (props) => {

    const classes = useStyles();
    const [openSettings, setOpenSettings] = React.useState(false);
    const forceUpdate = useForceUpdate()

    ipcRenderer.send('getDashboardData')
    ipcRenderer.on('returnDashboardData', (event,arg) => {
        ipcRenderer.removeAllListeners('returnDashboardData');  
        discordAvatar = arg.user.discord.avatar_url
        //forceUpdate()
    })
  
    const handleOpenSettings = () => {
        setOpenSettings(true);
    };
  
    const handleCloseSettings = () => {
        setOpenSettings(false);
    };


    window.onload = (event) => {
        togglePage(0);
    };


    
    function closeWindow() {
        try {
            var window = remote.getCurrentWindow();
            window.close(); 
        }
        catch(err) {
            console.log(err)
        }

    }
    function minimizeWindow() {
        var window = remote.getCurrentWindow();
        window.minimize(); 
    }

    function togglePage(page) {
        let menuItems = document.querySelectorAll('.menu_item')
        let menuIcons = document.querySelectorAll('.nav_icon_path')
        let menuText = document.querySelectorAll('.menu_title')

        for(var i = 0; i < menuItems.length; i++) {
            menuItems[i].removeAttribute('style')
            menuIcons[i].removeAttribute('style')
            menuText[i].removeAttribute('style')
        }

        menuItems[page].setAttribute('style','background-color:#15BABE')
        menuIcons[page].setAttribute('style','fill:white;')
        menuText[page].setAttribute('style','color:white;')


        
    }


    const [seconds, setSeconds] = useState(0);
    useEffect(() => {
        const interval = setTimeout(() => {
            setSeconds(seconds => seconds + 1);
        }, 600);
    }, []);



    const [muted,setMuted] = React.useState(false)
    const toggleMuted = () => {
        if(muted) {
            photonMuted = false;

            muteButton = <svg className="nav_icon" id="nav_icon-notifications" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path id="nav_icon" fillRule="evenodd" clipRule="evenodd" d="M10.9999 20.1667C12.0083 20.1667 12.8333 19.3417 12.8333 18.3334H9.16659C9.16659 19.3417 9.98242 20.1667 10.9999 20.1667ZM16.4999 14.6667V10.0834C16.4999 7.26919 14.9966 4.91335 12.3749 4.29002V3.66669C12.3749 2.90585 11.7608 2.29169 10.9999 2.29169C10.2391 2.29169 9.62493 2.90585 9.62493 3.66669V4.29002C6.99409 4.91335 5.49993 7.26002 5.49993 10.0834V14.6667L4.31743 15.8492C3.73993 16.4267 4.14326 17.4167 4.95909 17.4167H17.0316C17.8474 17.4167 18.2599 16.4267 17.6824 15.8492L16.4999 14.6667Z"/>
            </svg>
        
            setMuted(false)
            handleOpenSnackbar("Notifications turned on.","info")
        }
        else {
            photonMuted = true;

            muteButton = <svg className="nav_icon" id="nav_icon-notifications" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path id="nav_icon" fillRule="evenodd" clipRule="evenodd" d="M10.9999 20.1667C12.0083 20.1667 12.8333 19.3417 12.8333 18.3334H9.16659C9.16659 19.3417 9.98242 20.1667 10.9999 20.1667ZM16.4999 14.6667V10.0834C16.4999 7.26919 14.9966 4.91335 12.3749 4.29002V3.66669C12.3749 2.90585 11.7608 2.29169 10.9999 2.29169C10.2391 2.29169 9.62493 2.90585 9.62493 3.66669V4.29002C6.99409 4.91335 5.49993 7.26002 5.49993 10.0834V14.6667L4.31743 15.8492C3.73993 16.4267 4.14326 17.4167 4.95909 17.4167H17.0316C17.8474 17.4167 18.2599 16.4267 17.6824 15.8492L16.4999 14.6667Z"/>
                <rect transform="rotate(45 11 11)" stroke-width="0" id="svg_3" height="3" width="26" y="9.5" x="-2" stroke="#000" fill="#d85059"/>
            </svg>

            setMuted(true)
            
            handleOpenSnackbar("Notifications muted.","info")
        }
    }

    const [snackBarOpen, setOpenSnackBar] = React.useState(false);
    const [snackBarText,setSnackBarText] = React.useState('Success!');
    const [snackBarSeverity,setSnackBarSeverity] = React.useState('error');

    const handleOpenSnackbar = (text,severity) => {
        ipcRenderer.send('addNotification', {
            type:severity.toUpperCase(),
            title:"PHOTON",
            message:text
        })



        setSnackBarSeverity(severity);
        setSnackBarText(text);
        setOpenSnackBar(true);
        };
    const handleCloseSnackBar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackBar(false);
    };



    if(discordAvatar === "") avatarElement = <div className="user_avatar-small"></div>
    else avatarElement = <div className="user_avatar-small" style={{backgroundImage:`url(${discordAvatar})`}}></div>



  return (
    <HashRouter>
    <body>
        <div className="nav">
            <div className="heading">
                <div className="logo"></div>
                <h4>PHOTON</h4>
            </div>


            <div className="body">
                <p>GENERAL</p>
                <Link to="/" style={{textDecoration:"none"}} >
                <div className="menu_item" onClick={() => togglePage(0)}>
                    <svg className="nav_icon" id="nav_icon-dashboard" width="20" height="17" viewBox="0 0 20 17">
                        <path id="nav_icon_path-dashboard" className="nav_icon_path" fillRule="evenodd" clipRule="evenodd" d="M8.0001 16V11H12.0001V16C12.0001 16.55 12.4501 17 13.0001 17H16.0001C16.5501 17 17.0001 16.55 17.0001 16V8.99997H18.7001C19.1601 8.99997 19.3801 8.42997 19.0301 8.12997L10.6701 0.599971C10.2901 0.259971 9.7101 0.259971 9.3301 0.599971L0.970098 8.12997C0.630098 8.42997 0.840098 8.99997 1.3001 8.99997H3.0001V16C3.0001 16.55 3.4501 17 4.0001 17H7.0001C7.5501 17 8.0001 16.55 8.0001 16Z"/>
                    </svg>
                    <p id="nav_text-dashboard" className="menu_title">Dashboard</p>
                </div>
                </Link>

                <Link to="/captcha" style={{textDecoration:"none"}}>
                <div className="menu_item" onClick={() => togglePage(1)}>
                    <svg className="nav_icon" id="nav_icon-captcha"  width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path id="nav_icon_path-captcha" className="nav_icon_path"  fillRule="evenodd" clipRule="evenodd" d="M16 11.2V1.6C16 0.719999 15.28 0 14.4 0H4.80001C3.92001 0 3.20001 0.719999 3.20001 1.6V11.2C3.20001 12.08 3.92001 12.8 4.80001 12.8H14.4C15.28 12.8 16 12.08 16 11.2ZM7.52 8.42418L8.824 10.1682L10.888 7.59218C11.048 7.39218 11.352 7.39218 11.512 7.59218L13.88 10.5522C14.088 10.8162 13.904 11.2002 13.568 11.2002H5.6C5.272 11.2002 5.08 10.8242 5.28 10.5602L6.88 8.42418C7.04 8.21618 7.36 8.21618 7.52 8.42418ZM0 4.00026V14.4002C0 15.2802 0.719999 16.0002 1.6 16.0002H12C12.44 16.0002 12.8 15.6402 12.8 15.2002C12.8 14.7602 12.44 14.4002 12 14.4002H2.4C1.96 14.4002 1.6 14.0402 1.6 13.6003V4.00026C1.6 3.56026 1.24 3.20026 0.799999 3.20026C0.36 3.20026 0 3.56026 0 4.00026Z"/>
                    </svg>

                    <p id="nav_text-captcha" className="menu_title">Captcha</p>
                </div>
                </Link>

                <Link to="/profiles" style={{textDecoration:"none"}}>
                <div className="menu_item" onClick={() => togglePage(2)}>
                    <svg className="nav_icon" id="nav_icon-profiles"  width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path id="nav_icon_path-profiles" className="nav_icon_path" fillRule="evenodd" clipRule="evenodd" d="M11.3333 0H2C1.63333 0 1.33333 0.3 1.33333 0.666667C1.33333 1.03333 1.63333 1.33333 2 1.33333H11.3333C11.7 1.33333 12 1.03333 12 0.666667C12 0.3 11.7 0 11.3333 0ZM2 16H11.3333C11.7 16 12 15.7 12 15.3333C12 14.9667 11.7 14.6667 11.3333 14.6667H2C1.63333 14.6667 1.33333 14.9667 1.33333 15.3333C1.33333 15.7 1.63333 16 2 16ZM12 2.66667H1.33333C0.6 2.66667 0 3.26667 0 4V12C0 12.7333 0.6 13.3333 1.33333 13.3333H12C12.7333 13.3333 13.3333 12.7333 13.3333 12V4C13.3333 3.26667 12.7333 2.66667 12 2.66667ZM6.66667 4.5C7.49333 4.5 8.16667 5.17333 8.16667 6C8.16667 6.82667 7.49333 7.5 6.66667 7.5C5.84 7.5 5.16667 6.82667 5.16667 6C5.16667 5.17333 5.84 4.5 6.66667 4.5ZM10 11.3333H3.33333V10.3333C3.33333 9.22 5.55333 8.66667 6.66667 8.66667C7.78 8.66667 10 9.22 10 10.3333V11.3333Z"/>
                    </svg>

                    <p id="nav_text-profiles" className="menu_title">Profiles</p>
                </div>
                </Link>
                <Link to="/proxies" style={{textDecoration:"none"}} >
                <div className="menu_item" style={{textDecoration:"none"}} onClick={() => togglePage(3)}>
                    <svg className="nav_icon" id="nav_icon-proxies" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path id="nav_icon_path-proxies" className="nav_icon_path" fillRule="evenodd" clipRule="evenodd" d="M13.0327 8C13.0618 8.24 13.0909 8.48 13.0909 8.72727C13.0909 10.24 12.5091 11.6145 11.5636 12.6473C11.3745 12.0582 10.8364 11.6364 10.1818 11.6364H9.45455V9.45455C9.45455 9.05455 9.12727 8.72727 8.72727 8.72727H4.36364V7.27273H5.81818C6.21818 7.27273 6.54545 6.94545 6.54545 6.54545V5.09091H8C8.8 5.09091 9.45455 4.43636 9.45455 3.63636V1.78909C8.76364 1.57091 8.03636 1.45455 7.27273 1.45455C3.25818 1.45455 0 4.71273 0 8.72727C0 12.7418 3.25818 16 7.27273 16C11.2873 16 14.5455 12.7418 14.5455 8.72727C14.5455 8.48 14.5309 8.24 14.5091 8H13.0327ZM6.54545 14.4945C3.67273 14.1382 1.45455 11.6945 1.45455 8.72724C1.45455 8.27633 1.51273 7.84724 1.60727 7.42543L5.09091 10.9091V11.6363C5.09091 12.4363 5.74545 13.0909 6.54545 13.0909V14.4945ZM15.2727 2.18182V1.81818C15.2727 0.814545 14.4582 0 13.4545 0C12.4509 0 11.6364 0.814545 11.6364 1.81818V2.18182C11.2364 2.18182 10.9091 2.50909 10.9091 2.90909V5.81818C10.9091 6.21818 11.2364 6.54545 11.6364 6.54545H15.2727C15.6727 6.54545 16 6.21818 16 5.81818V2.90909C16 2.50909 15.6727 2.18182 15.2727 2.18182ZM14.5455 2.18182H12.3636V1.81818C12.3636 1.21455 12.8509 0.727273 13.4545 0.727273C14.0582 0.727273 14.5455 1.21455 14.5455 1.81818V2.18182Z"/>
                    </svg>

                    <p id="nav_text-proxies" className="menu_title">Proxies</p>
                </div>
                </Link>

            </div>

            <div className="body">
                <p>GENERATOR</p>
                <Link to="/accountgen" style={{textDecoration:"none"}} >
                <div className="menu_item" onClick={() => togglePage(4)}>
                    <svg className="nav_icon" id="nav_icon-account_gen" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path id="nav_icon_path-account_gen" className="nav_icon_path" fillRule="evenodd" clipRule="evenodd" d="M12 14.4H2.4C1.96 14.4 1.6 14.04 1.6 13.6V4C1.6 3.56 1.24 3.2 0.8 3.2C0.36 3.2 0 3.56 0 4V14.4C0 15.28 0.72 16 1.6 16H12C12.44 16 12.8 15.64 12.8 15.2C12.8 14.76 12.44 14.4 12 14.4ZM14.4 0H4.8C3.92 0 3.2 0.72 3.2 1.6V11.2C3.2 12.08 3.92 12.8 4.8 12.8H14.4C15.28 12.8 16 12.08 16 11.2V1.6C16 0.72 15.28 0 14.4 0ZM14.4 8L12.4 6.8L10.4 8V1.6H14.4V8Z"/>
                    </svg>
                    <p id="nav_text-account_gen" className="menu_title">Account Gen</p>
                </div>
                </Link>

                <Link to="/cardgen" style={{textDecoration:"none"}} >
                <div className="menu_item" onClick={() => togglePage(5)}>
                    <svg className="nav_icon" id="nav_icon-card_gen" width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path id="nav_icon_path-card_gen" className="nav_icon_path" fillRule="evenodd" clipRule="evenodd" d="M17.7778 0H1.77778C0.8 0 0 0.8 0 1.77778V14.2222C0 15.2 0.8 16 1.77778 16H17.7778C18.7556 16 19.5556 15.2 19.5556 14.2222V1.77778C19.5556 0.8 18.7556 0 17.7778 0ZM8.88889 8H2.66667C2.17778 8 1.77778 7.6 1.77778 7.11111V2.66667C1.77778 2.17778 2.17778 1.77778 2.66667 1.77778H8.88889C9.37778 1.77778 9.77778 2.17778 9.77778 2.66667V7.11111C9.77778 7.6 9.37778 8 8.88889 8Z"/>
                    </svg>

                    <p id="nav_text-card_gen" className="menu_title">Card Gen</p>
                </div>
                </Link>

                {
                    // NO DISPLAY
                }
                <Link to="/" style={{textDecoration:"none",display:"none"}} >
                    <div className="menu_item" onClick={() => togglePage(6)}>
                        <svg className="nav_icon" id="nav_icon-email_gen" width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path id="nav_icon_path-email_gen" className="nav_icon_path" fillRule="evenodd" clipRule="evenodd" d="M18 0H2C0.9 0 0 0.9 0 2V14C0 15.1 0.9 16 2 16H18C19.1 16 20 15.1 20 14V2C20 0.9 19.1 0 18 0ZM17.6 4.25L11.06 8.34C10.41 8.75 9.59 8.75 8.94 8.34L2.4 4.25C2.15 4.09 2 3.82 2 3.53C2 2.86 2.73 2.46 3.3 2.81L10 7L16.7 2.81C17.27 2.46 18 2.86 18 3.53C18 3.82 17.85 4.09 17.6 4.25Z"/>
                        </svg>

                        <p id="nav_text-email_gen" className="menu_title">Email Gen</p>
                    </div>
                </Link>
                


            </div>

            <div className="body">
                <p>ORGANIZATION</p>

                <Link to="/botmanager" style={{textDecoration:"none"}} >
                <div className="menu_item" onClick={() => togglePage(7)}>
                    <svg className="nav_icon" id="nav_icon-bot_manager" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path id="nav_icon_path-bot_gen" className="nav_icon_path" fillRule="evenodd" clipRule="evenodd" d="M19.6667 5H4.66667C3.75 5 3 5.75 3 6.66667V16.6667C3 17.5833 3.75 18.3333 4.66667 18.3333H8.83333V19.1667C8.83333 19.625 9.20833 20 9.66667 20H14.6667C15.125 20 15.5 19.625 15.5 19.1667V18.3333H19.6667C20.5833 18.3333 21.3333 17.5833 21.3333 16.6667V6.66667C21.3333 5.75 20.5833 5 19.6667 5ZM18.8333 16.6667H5.5C5.04167 16.6667 4.66667 16.2917 4.66667 15.8333V7.5C4.66667 7.04167 5.04167 6.66667 5.5 6.66667H18.8333C19.2917 6.66667 19.6667 7.04167 19.6667 7.5V15.8333C19.6667 16.2917 19.2917 16.6667 18.8333 16.6667ZM17.1667 9.16667H9.66667C9.20833 9.16667 8.83333 9.54167 8.83333 10C8.83333 10.4583 9.20833 10.8333 9.66667 10.8333H17.1667C17.625 10.8333 18 10.4583 18 10C18 9.54167 17.625 9.16667 17.1667 9.16667ZM17.1667 12.5H9.66667C9.20833 12.5 8.83333 12.875 8.83333 13.3333C8.83333 13.7917 9.20833 14.1667 9.66667 14.1667H17.1667C17.625 14.1667 18 13.7917 18 13.3333C18 12.875 17.625 12.5 17.1667 12.5ZM8 9.16667H6.33333V10.8333H8V9.16667ZM8 12.5H6.33333V14.1667H8V12.5Z"/>
                    </svg>

                    <p id="nav_text-bot_manager" className="menu_title">Bot Manager</p>
                </div>
                </Link>
                

                <Link to="/nftmonitor" style={{textDecoration:"none"}} >
                <div className="menu_item" onClick={() => togglePage(8)}>
                    <svg className="nav_icon" id="nav_icon-nft_monitor" width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill="none">
                        <path id="nav_icon_path-bot_gen" className="nav_icon_path"  stroke="null" id="svg_10" d="m12,3.42418c-4.73634,0 -8.57581,3.83943 -8.57581,8.57581c0,4.7363 3.83947,8.57583 8.57581,8.57583c4.7364,0 8.57581,-3.83954 8.57581,-8.57583c0,-4.7364 -3.83943,-8.57581 -8.57581,-8.57581zm0.74053,13.22533l0,1.20794l-1.15532,0l0,-1.19432c-1.89586,-0.25964 -2.72664,-1.81736 -2.72664,-1.81736l1.18131,-0.98713c0,0 0.75293,1.31169 2.11594,1.31169c0.75287,0 1.32406,-0.403 1.32406,-1.09111c0,-1.61015 -4.3363,-1.41491 -4.3363,-4.40112c0,-1.2982 1.0255,-2.23344 2.44101,-2.45402l0,-1.20781l1.15536,0l0,1.20713c0.98656,0.12988 2.15488,0.64915 2.15488,1.76603l0,0.85678l-1.53184,0l0,-0.41539c0,-0.42834 -0.54577,-0.71399 -1.15586,-0.71399c-0.77885,0 -1.35007,0.3894 -1.35007,0.93467c0,1.64855 4.3363,1.24621 4.3363,4.37527c0.00062,1.28569 -0.96,2.40214 -2.45284,2.62272l0,0l0,0.00002l0.00001,0.00001z" fill="#8B8B9E"/>
                    </svg>
                    <p id="nav_text-nft_monitor" className="menu_title">NFT Monitor</p>
                </div>
                </Link>
            </div>


        
            <div className="user_section">
                <div className="menu_minor-buttons" onClick={handleOpenSettings}>
                    <svg className="nav_icon" id="nav_icon-settings" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path id="nav_icon" fillRule="evenodd" clipRule="evenodd" d="M17.8109 11.8983C17.8476 11.605 17.8751 11.3117 17.8751 11C17.8751 10.6883 17.8476 10.395 17.8109 10.1017L19.7451 8.58917C19.9193 8.45167 19.9651 8.20417 19.8551 8.0025L18.0218 4.83083C17.9118 4.62917 17.6643 4.55583 17.4626 4.62917L15.1801 5.54583C14.7034 5.17917 14.1901 4.87667 13.6309 4.6475L13.2826 2.21833C13.2551 1.99833 13.0626 1.83333 12.8334 1.83333H9.16676C8.9376 1.83333 8.7451 1.99833 8.7176 2.21833L8.36926 4.6475C7.8101 4.87667 7.29676 5.18833 6.8201 5.54583L4.5376 4.62917C4.32676 4.54667 4.08843 4.62917 3.97843 4.83083L2.1451 8.0025C2.02593 8.20417 2.08093 8.45167 2.2551 8.58917L4.18926 10.1017C4.1526 10.395 4.1251 10.6975 4.1251 11C4.1251 11.3025 4.1526 11.605 4.18926 11.8983L2.2551 13.4108C2.08093 13.5483 2.0351 13.7958 2.1451 13.9975L3.97843 17.1692C4.08843 17.3708 4.33593 17.4442 4.5376 17.3708L6.8201 16.4542C7.29676 16.8208 7.8101 17.1233 8.36926 17.3525L8.7176 19.7817C8.7451 20.0017 8.9376 20.1667 9.16676 20.1667H12.8334C13.0626 20.1667 13.2551 20.0017 13.2826 19.7817L13.6309 17.3525C14.1901 17.1233 14.7034 16.8117 15.1801 16.4542L17.4626 17.3708C17.6734 17.4533 17.9118 17.3708 18.0218 17.1692L19.8551 13.9975C19.9651 13.7958 19.9193 13.5483 19.7451 13.4108L17.8109 11.8983ZM11.0001 14.2083C9.23092 14.2083 7.79175 12.7692 7.79175 11C7.79175 9.23083 9.23092 7.79167 11.0001 7.79167C12.7692 7.79167 14.2084 9.23083 14.2084 11C14.2084 12.7692 12.7692 14.2083 11.0001 14.2083Z"/>
                    </svg>
                </div>
                {avatarElement}

                <div className="menu_minor-buttons" style={{cursor:"pointer"}} onClick={toggleMuted}>
                {muteButton}
                </div>
            </div>




        </div>
        
        <div className="main_wrapper">
            <div className="head">
                <svg className="window_icon" width="15" height="15" viewBox="0 0 13 13"  onClick={closeWindow}>
                    <path d="M0.271972 0.271972C0.634602 -0.0906574 1.22254 -0.0906574 1.58517 0.271972L6.5 5.1868L11.4148 0.271972C11.7775 -0.0906574 12.3654 -0.0906574 12.728 0.271972C13.0907 0.634602 13.0907 1.22254 12.728 1.58517L7.8132 6.5L12.728 11.4148C13.0907 11.7775 13.0907 12.3654 12.728 12.728C12.3654 13.0907 11.7775 13.0907 11.4148 12.728L6.5 7.8132L1.58517 12.728C1.22254 13.0907 0.634602 13.0907 0.271972 12.728C-0.0906574 12.3654 -0.0906574 11.7775 0.271972 11.4148L5.1868 6.5L0.271972 1.58517C-0.0906574 1.22254 -0.0906574 0.634602 0.271972 0.271972Z"/>
                </svg>
                <svg className="window_icon" width="15" height="15" viewBox="0 0 15 2" onClick={minimizeWindow}>
                    <path d="M0 1C0 0.447715 0.419733 0 0.9375 0H14.0625C14.5803 0 15 0.447715 15 1C15 1.55228 14.5803 2 14.0625 2H0.9375C0.419733 2 0 1.55228 0 1Z" />
                </svg>


            </div>
            <div className="main_body">
                <Switch>
                <Route exact path="/" component={DashboardPage}/>
                <Route exact path="/captcha" component={CaptchaPage}/>
                <Route exact path="/profiles" component={ProfilesPage}/>
                <Route exact path="/proxies" component={ProxiesPage}/>
                <Route exact path="/accountgen" component={AccountGenPage}/>
                <Route exact path="/cardgen" component={CardGenPage}/>
                <Route exact path="/emailgen" component={EmailGenPage}/>
                <Route exact path="/botmanager" component={BotManagerPage}/>
                <Route exact path="/nftmonitor" component={NftMonitor}/>
                </Switch>  
            </div>
        </div>
        


        <Modal
            className={classes.modal}
            open={openSettings}
            onClose={handleCloseSettings}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
            timeout: 500,
            }}
        >
            <Fade in={openSettings}>
            <div className={classes.paper}>
                <div className="popup-header">
                <svg className="window_icon" width="15" height="15" viewBox="0 0 13 13" onClick={handleCloseSettings}>
                    <path d="M0.271972 0.271972C0.634602 -0.0906574 1.22254 -0.0906574 1.58517 0.271972L6.5 5.1868L11.4148 0.271972C11.7775 -0.0906574 12.3654 -0.0906574 12.728 0.271972C13.0907 0.634602 13.0907 1.22254 12.728 1.58517L7.8132 6.5L12.728 11.4148C13.0907 11.7775 13.0907 12.3654 12.728 12.728C12.3654 13.0907 11.7775 13.0907 11.4148 12.728L6.5 7.8132L1.58517 12.728C1.22254 13.0907 0.634602 13.0907 0.271972 12.728C-0.0906574 12.3654 -0.0906574 11.7775 0.271972 11.4148L5.1868 6.5L0.271972 1.58517C-0.0906574 1.22254 -0.0906574 0.634602 0.271972 0.271972Z"/>
                </svg>
                </div>

            </div>
            </Fade>
      </Modal>
    </body>
    <Snackbar 
        className={classes.snackBar} 
        open={snackBarOpen} 
        autoHideDuration={4000} 
        onClose={handleCloseSnackBar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
        
        <Alert 
            variant="filled" 
            onClose={handleCloseSnackBar} 
            severity={snackBarSeverity}
        >
            <AlertTitle>{snackBarSeverity.toUpperCase()}</AlertTitle>
            {snackBarText}
        </Alert>
    </Snackbar>
    </HashRouter>

  );
}

export default App;
