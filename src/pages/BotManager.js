import React, { useState, useEffect } from "react";

import './pages.css'

import BotPanel from '../components/panels/BotPanel'
import EmptyPanel from '../components/panels/EmptyPanel'
import Button from '../components/buttons/button'
import TimelineWidget from '../components/timelines/timeline'


import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { makeStyles, withStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField'
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Snackbar from '@material-ui/core/Snackbar';
import {Alert, AlertTitle} from '@material-ui/lab';
import MenuItem from "@material-ui/core/MenuItem";
import Switch from '@material-ui/core/Switch';

import {BOT_TYPES} from '../components/timelines/constants'

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';


const { ipcRenderer } = window.require('electron/renderer')

function useForceUpdate(){
    const [value, setValue] = React.useState(0); // integer state
    return () => setValue(value => value + 1); // update the state to force render
}





const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    padding: {
        padding: theme.spacing(3),
    },
    tabViewer: {
        backgroundColor: "#0E0E14",
        height:"49px"
    },
    inputHalf: {
        width:"48%",
        backgroundColor:"#15151D"
    },
    inputFull: {
        width:"100%",
        backgroundColor:"#15151D"
    },
    select: {
        width:140,
        margin:0
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
    },
    snackBar: {
        width: '30%',
            '& > * + *': {
            marginTop: theme.spacing(2),
        },
    }
}));

const theme = createTheme({
    palette: {
        primary: {
            main: '#fff'
        },
        secondary: {
            main: '#15BABE'
        },
        main: {
            main: '#15BABE'
        },
        background: {
            paper:"#15151D",
            default: "#15151D"
        },
        text: {
            primary:"#fff"
        },
        type:"dark"

    }
})


let bots = {"bots":[]}
let botLength = 0;
let botElements = <></>;
let timelineWidget = <></>;

ipcRenderer.send('getBotManager')
ipcRenderer.on('getBotManager', (event,arg) => {
    ipcRenderer.removeAllListeners('getBotManager')
    bots = arg.bots
})



function BotManager(props) {
    const classes = useStyles();
    const forceUpdate = useForceUpdate();

    ipcRenderer.send('getBotManager')
    ipcRenderer.on('getBotManager', (event,arg) => {
        ipcRenderer.removeAllListeners('getBotManager')
        bots = arg.bots
    })



    // ADD BOT
    const [openAddBot, setOpenAddBot] = React.useState(false)
    const [botType, setBotType] = React.useState("akari")
    const [botStartDate, setBotStartDate] = React.useState(new Date());
    const [botEndDate, setBotEndDate] = React.useState(new Date());
    const [botLicenseKey, setBotLicenseKey] = React.useState("");
    const [botLifetime,setBotLifetime] = React.useState(false);

    const handleChangeBotType = (event) => {setBotType(event.target.value);};
    const handleChangeBotLicenseKey = (event) => {setBotLicenseKey(event.target.value)}
    const handleChangeStartDate = (date) => {setBotStartDate(date);};
    const handleChangeEndDate = (date) => {setBotEndDate(date);};
    const handleChangeLifetime = (event) => {setBotLifetime(event.target.checked);};
    
    
    const handleOpenAddBot = () => {
        setBotLicenseKey("")
        setBotStartDate(new Date())
        setBotEndDate(new Date())
        setOpenAddBot(true)
    }
    const handleCloseAddBot = () => {setOpenAddBot(false)}
    const confirmAddBot = () => {
        var startDate = botStartDate.getFullYear() + "-" + String(botStartDate.getMonth()+1).padStart(2, '0') + "-" + String(botStartDate.getDate()).padStart(2, '0');
        var endDate = botEndDate.getFullYear() + "-" + String(botEndDate.getMonth()+1).padStart(2, '0') + "-" + String(botEndDate.getDate()).padStart(2, '0');

        ipcRenderer.send('addBotManager', {
            type:botType,
            start:startDate,
            end:endDate,
            license:botLicenseKey,
            lifetime:botLifetime
        })
        ipcRenderer.on('addBotManager', (event,arg) => {
            ipcRenderer.removeAllListeners('addBotManager')
            bots = arg.bots
            handleCloseAddBot()
            handleOpenSnackbar("Bot added to calendar.","success")
            forceUpdate()
        })
    }
    const confirmDeleteBot = (index) => {
        ipcRenderer.send('removeBotManager', {
            i:index
        })
        ipcRenderer.on('removeBotManager', (event,arg) => {
            console.log("REMOVING")
            ipcRenderer.removeAllListeners('removeBotManager')
            bots = arg.bots
            forceUpdate()
        })
    }








    const [snackBarOpen, setOpenSnackBar] = React.useState(false);
    const [snackBarText,setSnackBarText] = React.useState('Success!');
    const [snackBarSeverity,setSnackBarSeverity] = React.useState('success');

    const handleOpenSnackbar = (text,severity) => {
        ipcRenderer.send('addNotification', {
            type:severity.toUpperCase(),
            title:"BOT MANAGER",
            message:text
        })
        if(!props.muted) {
            setSnackBarSeverity(severity);
            setSnackBarText(text);
            setOpenSnackBar(true);
        }
      };
    const handleCloseSnackBar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackBar(false);
    };



    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
        handleOpenSnackbar("Copied to clipboard","info")
    }



    try {
        if(bots["bots"].length === 0) {
            botElements = <EmptyPanel 
                type="bots"
                text="Add some bots to get started."
            /> 
        }
        else {
            botElements = bots["bots"].map((bot,index) =>  
                <BotPanel type={bot["type"]} license={bot["license"]} lifetime={bot["lifetime"]} endDate={bot["end"]} id={index} delete={id => confirmDeleteBot(id)} clicked={license => copyToClipboard(license)} /> 
            )
        }


        

        botLength = bots["bots"].length
        timelineWidget = <TimelineWidget bots={bots}/>
    }
    catch(err) {

    }



    return(
        <ThemeProvider theme={theme}>
            <div className="page">
                <div className="page_header">
                    <div className="page_header-section">
                        <h6 className="page_title">Profiles</h6>
                        <div className="page_subtitle-container">
                            <span className="page_subtitle">You have </span>
                            <span className="page_subtitle" style={{color:"#F1F1F2"}}>{botLength} bots</span>
                            <span className="page_subtitle"> available. </span>
                        </div>
                    </div>
                </div>
                <div className="page_body">
                    <div className="page_body-header">
                        <div className="button_group" style={{width:"170px"}}>
                        </div>
                        
                        <div>
                            <Button color="#15BABE" text="Add Bot" icon="add" clicked={() => handleOpenAddBot()} />
                        </div>
                        
                    </div>

                    <div className="page_main-body" style={{display:"inline"}}>
                        <div className="bot_flex-group">
                            {botElements}
                        </div>
                        <div className="timeline_container">
                            {timelineWidget}
                        </div>
                        
                    </div>
                </div>
            </div>

            <Modal
                className={classes.modal}
                open={openAddBot}
                onClose={handleCloseAddBot}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                timeout: 500,
                }}
            >
            <Fade in={openAddBot}>
                <div className={classes.paper}>

                    <div className="popup-container" style={{width:"300px",height:"348px"}}>
                        <div className="popup-header" style={{marginBottom:"20px"}}>
                            <span className="popup-section_title">Add Bot to Calendar</span>
                            <svg className="window_icon" width="15" height="15" viewBox="0 0 13 13" onClick={handleCloseAddBot}>
                                <path d="M0.271972 0.271972C0.634602 -0.0906574 1.22254 -0.0906574 1.58517 0.271972L6.5 5.1868L11.4148 0.271972C11.7775 -0.0906574 12.3654 -0.0906574 12.728 0.271972C13.0907 0.634602 13.0907 1.22254 12.728 1.58517L7.8132 6.5L12.728 11.4148C13.0907 11.7775 13.0907 12.3654 12.728 12.728C12.3654 13.0907 11.7775 13.0907 11.4148 12.728L6.5 7.8132L1.58517 12.728C1.22254 13.0907 0.634602 13.0907 0.271972 12.728C-0.0906574 12.3654 -0.0906574 11.7775 0.271972 11.4148L5.1868 6.5L0.271972 1.58517C-0.0906574 1.22254 -0.0906574 0.634602 0.271972 0.271972Z"/>
                            </svg>
                        </div>
                            <TextField
                                select
                                className={classes.inputFull}
                                label="Select Bot Type"
                                value={botType}
                                onChange={handleChangeBotType}
                                variant="outlined"
                                margin="dense"
                            >

                                {BOT_TYPES.map((bot,index) => (
                                    <MenuItem key={index} value={bot["value"]}>
                                        {bot["label"]}
                                    </MenuItem>
                                    ))}
                            </TextField>

                            <TextField
                                className={classes.inputFull}
                                label="Enter License Key"
                                value={botLicenseKey}
                                onChange={handleChangeBotLicenseKey}
                                variant="outlined"
                                margin="dense"
                            />

                            <div style={{height:"10px"}} />

                            <div className="checkbox_container" style={{width:"131px"}}>
                                <Switch 
                                    checked={botLifetime} 
                                    value={botLifetime}
                                    onChange={handleChangeLifetime} 
                                    name="botlifetime" 
                                    color="secondary"
                                />
                                <span className="checkbox_container-text" style={{fontSize:"12pt"}}>Lifetime Key</span>
                            </div>
                      

                            <div style={{height:"10px"}} />

                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                    disabled={botLifetime}
                                    disableToolbar
                                    inputVariant="outlined"
                                    margin="dense"
                                    className={classes.inputFull}

                                    format="MM/dd/yyyy"
                                    
                                    id="startDate"
                                    label="Start Date"
                                    value={botStartDate}
                                    onChange={handleChangeStartDate}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                                <KeyboardDatePicker
                                    disabled={botLifetime}
                                    disableToolbar
                                    inputVariant="outlined"
                                    margin="dense"
                                    className={classes.inputFull}

                                    format="MM/dd/yyyy"
                                    
                                    id="endDate"
                                    label="End Date"
                                    value={botEndDate}
                                    onChange={handleChangeEndDate}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </MuiPickersUtilsProvider>

                        <div style={{height:"8px"}} />

                        <div className="button_group" style={{width:"100%",justifyContent:"flex-end",marginTop:"10px"}}>
                            <Button color="#15BABE" text="Add" icon="add" width="98px" clicked={confirmAddBot} />

                        </div>
                    </div>

                </div>
            </Fade>
            </Modal>

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
        </ThemeProvider>
        
    )
}


export default BotManager;