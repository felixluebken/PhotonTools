import React, { useState, useEffect } from "react";

import './pages.css'

import Button from '../components/buttons/button'
import DotTitle from '../components/titles/DotTitle'
import CaptchaPanel from '../components/panels/CaptchaPanel'
import CaptchaPanelWide from '../components/panels/CaptchaPanelWide'
import EmptyPanel from '../components/panels/EmptyPanel'


import { makeStyles, withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField'
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Snackbar from '@material-ui/core/Snackbar';
import {Alert, AlertTitle} from '@material-ui/lab';
import MenuItem from "@material-ui/core/MenuItem";

const { ipcRenderer } = window.require('electron/renderer')


function useForceUpdate(){
    const [value, setValue] = React.useState(0); // integer state
    return () => setValue(value => value + 1); // update the state to force render
}


const theme = createTheme({
    palette: {
        primary: {
            main: '#fff'
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
const AntTabs = withStyles({
    root: {
      borderBottom: '1px solid #8B8B9E',
      width:"140px",
      height:"49px"
    },
    indicator: {
      backgroundColor: '#F1F1F2',
    },
})(Tabs);
const AntTab = withStyles((theme) => ({
root: {
    textTransform: 'none',
    minWidth: 72,
    color:'#8B8B9E',
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing(0),
    fontFamily: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
    color: '#F1F1F2',
    opacity: 1,
    },
    '&$selected': {
    color: '#F1F1F2',
    fontWeight: theme.typography.fontWeightMedium,
    },
    '&:focus': {
    color: '#F1F1F2',
    },
},
selected: {},
}))((props) => <Tab disableRipple {...props} />);
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



let inactiveElements;
let sleepingElements;
let activeElements;


function getGmailIndexById(id) {
    for(var i = 0; i < captcha["groups"][0]["accounts"].length; i++) {
        if(captcha["groups"][0]["accounts"][i]["id"] === id) {
            return i
        }
    }
    return -1
}




let proxies;
let captcha;

let captchaLength = 0;


let exportText = "";

ipcRenderer.send('getProxies')
ipcRenderer.on('getProxies', (event,arg) => {
    ipcRenderer.removeAllListeners('getProxies')
    proxies = arg.proxies
})
ipcRenderer.send('getCaptcha')
ipcRenderer.on('getCaptcha', (event,arg) => {
    ipcRenderer.removeAllListeners('getCaptcha')
    captcha = arg.captcha
})







function Captcha(props) {
    const classes = useStyles();
    const [tabValue, setTabValue] = React.useState(0);
    const forceUpdate = useForceUpdate()

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    let colPageDisplay;
    let rowPageDisplay;
    if(tabValue === 0) {
        colPageDisplay = "flex"
        rowPageDisplay = "none"
    } else {
        colPageDisplay = "none"
        rowPageDisplay = "flex"
    }


    let group = 0;





    ipcRenderer.send('getProxies')
    ipcRenderer.on('getProxies', (event,arg) => {
        ipcRenderer.removeAllListeners('getProxies')
        proxies = arg.proxies
    })
    ipcRenderer.send('getCaptcha')
    ipcRenderer.on('getCaptcha', (event,arg) => {
        ipcRenderer.removeAllListeners('getCaptcha')
        captcha = arg.captcha
        console.log("SECONDARY RECEIVED")
    })



    const [seconds, setSeconds] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
          setSeconds(seconds => seconds + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);





    let inactiveAccounts = [];
    let sleepingAccounts = [];
    let activeAccounts = [];
    try{
        captchaLength = 0

        for(var i = 0; i < captcha["groups"][0]["accounts"].length; i++) {
            var account = captcha["groups"][0]["accounts"][i]
            if(account["status"] === "Inactive" || account["status"].includes("Error") || account["status"].includes("Invalid")) {
                inactiveAccounts.push(account)
            }
            else if(account["status"].includes("Sleeping")) {
                captchaLength += 1;
                sleepingAccounts.push(account)
            }
            else {
                captchaLength += 1;
                activeAccounts.push(account)
            }
        }

        if(tabValue === 0) {
        



            if(inactiveAccounts.length === 0) {
                inactiveElements = <EmptyPanel
                    type="captcha" text="Add accounts to get started"
                />
            }
            else {
                inactiveElements = inactiveAccounts.map((account) =>  
                <CaptchaPanel
                    id={account["id"]}
                    email={account["email"]}
                    score={account["score"]}
                    state="Inactive"
                    status={account["status"]}
                    proxy={account["proxy"]}

                    start={id => handleStartTask(id)}
                    view={id => handleStartBrowserTask(id)}
                    edit={id => handleEditAccount(id)}
                    delete={id => handleDeleteAccount(id)}
                />)
            }


            if(sleepingAccounts.length === 0) {
                sleepingElements = <EmptyPanel
                    type="captcha" text="No sleeping tasks"
                />
            }
            else {
                sleepingElements = inactiveAccounts.map((account) =>  
                <CaptchaPanel
                    id={account["id"]}
                    email={account["email"]}
                    score={account["score"]}
                    state="Sleeping"
                    status={account["status"]}
                    proxy={account["proxy"]}

                    start={id => handleStopTask(id)}
                    view={id => handleStartBrowserTask(id)}
                    edit={id => handleEditAccount(id)}
                    delete={id => handleDeleteAccount(id)}
                />)
            }


            if(activeAccounts.length === 0) {
                activeElements = <EmptyPanel
                    type="captcha" text="No active tasks"
                />
            }
            else {
                activeElements = activeAccounts.map((account) =>  
                <CaptchaPanel
                    id={account["id"]}
                    email={account["email"]}
                    score={account["score"]}
                    state="Active"
                    status={account["status"]}
                    proxy={account["proxy"]}

                    start={id => handleStopTask(id)}
                    view={id => handleStartBrowserTask(id)}
                    edit={id => handleEditAccount(id)}
                    delete={id => handleDeleteAccount(id)}
                />)
            }
        }
        else {
            if(inactiveAccounts.length === 0) {
                inactiveElements = <EmptyPanel
                    type="captcha" text="Add accounts to get started"
                />
            }
            else {
                inactiveElements = inactiveAccounts.map((account) =>  
                <CaptchaPanelWide
                    id={account["id"]}
                    email={account["email"]}
                    score={account["score"]}
                    state="Inactive"
                    status={account["status"]}
                    proxy={account["proxy"]}

                    start={id => handleStartTask(id)}
                    view={id => handleStartBrowserTask(id)}
                    edit={id => handleEditAccount(id)}
                    delete={id => handleDeleteAccount(id)}
                />)
            }


            if(sleepingAccounts.length === 0) {
                sleepingElements = <EmptyPanel
                    type="captcha" text="No sleeping tasks"
                />
            }
            else {
                sleepingElements = sleepingAccounts.map((account) =>  
                <CaptchaPanelWide
                    id={account["id"]}
                    email={account["email"]}
                    score={account["score"]}
                    state="Sleeping"
                    status={account["status"]}
                    proxy={account["proxy"]}

                    start={id => handleStopTask(id)}
                    view={id => handleStartBrowserTask(id)}
                    edit={id => handleEditAccount(id)}
                    delete={id => handleDeleteAccount(id)}
                />)
            }


            if(activeAccounts.length === 0) {
                activeElements = <EmptyPanel
                    type="captcha" text="No active tasks"
                />
            }
            else {
                activeElements = activeAccounts.map((account) =>  
                <CaptchaPanelWide
                    id={account["id"]}
                    email={account["email"]}
                    score={account["score"]}
                    state="Active"
                    status={account["status"]}
                    proxy={account["proxy"]}

                    start={id => handleStopTask(id)}
                    view={id => handleStartBrowserTask(id)}
                    edit={id => handleEditAccount(id)}
                    delete={id => handleDeleteAccount(id)}
                />)
            }
        }
    }
    catch(err) {
        console.log(err)
    }







    const handleStartBrowserTask = (id) => {
        ipcRenderer.send('startBrowserCaptchaTask', {id:id})
        handleOpenSnackbar("Starting browser task","info")
    }
    const handleStartTask = (id) => {
        ipcRenderer.send('startCaptchaTask', {id:id})
        handleOpenSnackbar("Starting task","success")
    }
    const handleStopTask = (id) => {
        ipcRenderer.send('stopCaptchaTask', {id:id})
        handleOpenSnackbar("Stopping task","warning")
    }
    const handleStartAllTasks = () => {
        ipcRenderer.send('startAllCaptchaTasks')
        handleOpenSnackbar("Starting all tasks","success")
    }
    const handleStopAllTasks = () => {
        ipcRenderer.send('stopAllCaptchaTasks')
        handleOpenSnackbar("Stopping all tasks","warning")
    }



    const [snackBarOpen, setOpenSnackBar] = React.useState(false);
    const [snackBarText,setSnackBarText] = React.useState('Success!');
    const [snackBarSeverity,setSnackBarSeverity] = React.useState('success');

    const handleOpenSnackbar = (text,severity) => {
        ipcRenderer.send('addNotification', {
            type:severity.toUpperCase(),
            title:"CAPTCHA",
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







    // ADD ACCOUNT
    const [accountAdd, setAccountAdd] = React.useState({
        email:"",
        password:"",
        recovery:"",
        proxy:""
    })
    const handleAddAccountChange = (event) => {setAccountAdd({ ...accountAdd, [event.target.name]: event.target.value });};
    const handleAddAccount = () => {handleOpenAddAccount();}
    const confirmAddAccount = () => {
        ipcRenderer.send('addCaptcha', accountAdd)
        ipcRenderer.on('addCaptcha', (event,arg) => {
            captcha = arg.captcha;
            setAccountAdd({
                email:"",
                password:"",
                recovery:"",
                proxy:""
            })
            handleOpenSnackbar("Account added","info")
            handleCloseAddAccount()
        })
    }

    const [openAddAccount, setOpenAddAccount] = React.useState(false);
    const handleOpenAddAccount = () => {setOpenAddAccount(true);};
    const handleCloseAddAccount = () => {setOpenAddAccount(false);};









    // EDIT ACCOUNT
    const [accountEdit, setAccountEdit] = React.useState({
        id:"",
        email:"",
        password:"",
        recovery:"",
        proxy:""
    })
    const handleEditAccountChange = (event) => {setAccountEdit({ ...accountEdit, [event.target.name]: event.target.value });};
    const handleEditAccount = (id) => {
        console.log(id)
        var index = getGmailIndexById(id)
        console.log(index)
        var account = captcha["groups"][0]["accounts"][index]
        console.log(account)
        setAccountEdit({
            id:id,
            email:account["email"],
            password:account["password"],
            recovery:account["recovery"],
            proxy:account["proxy"]
        })

        handleOpenEditAccount();
    }
    const confirmEditAccount = () => {
        ipcRenderer.send('editCaptcha', accountEdit)
        ipcRenderer.on('editCaptcha', (event,arg) => {
            captcha = arg.captcha;
            setAccountEdit({
                email:"",
                password:"",
                recovery:"",
                proxy:""
            })
            handleCloseEditAccount()
        })
    }

    const [openEditAccount, setOpenEditAccount] = React.useState(false);
    const handleOpenEditAccount = () => {setOpenEditAccount(true);};
    const handleCloseEditAccount = () => {setOpenEditAccount(false);};



    // DELETE ACCOUNT

    const handleDeleteAccount = (id) => {
        ipcRenderer.send('deleteCaptcha', {id:id})
        ipcRenderer.on('deleteCaptcha', (event,arg) => {
            captcha = arg.captcha;
            forceUpdate()
            //handleOpenSnackbar("Farming account deleted","warning")
        })
    }





    // PROXY OPTIONS
    const [proxyGroup,setProxyGroup] = React.useState(0)
    const handleProxyGroupChange = (event) => {setProxyGroup(event.target.value)}
    const handleSetProxyGroup = () => {handleOpenSetProxyGroup();}
    const confirmSetProxyGroup = () => {

        if(proxies["groups"][proxyGroup]["proxies"].length === 0) {
            handleOpenSnackbar("No proxies to import","warning")
            return
        }
        console.log(proxyGroup)
        ipcRenderer.send('setCaptchaProxyGroup', {proxyGroup:proxyGroup})
        ipcRenderer.on('setCaptchaProxyGroup', (event,arg) => {
            captcha = arg.captcha;
            handleOpenSnackbar("Proxies imported","success")
            handleCloseSetProxyGroup()
        })
    }

    const [openSetProxyGroup, setOpenSetProxyGroup] = React.useState(false);
    const handleOpenSetProxyGroup = () => {setOpenSetProxyGroup(true);};
    const handleCloseSetProxyGroup = () => {setOpenSetProxyGroup(false);};

   // EXPORT OPTIONS
   const [openExport, setOpenExport] = React.useState(false);
   const handleOpenExport = () => {
       exportText = ""
       for(var i = 0; i < captcha["groups"][0]["accounts"].length; i++) {
           exportText = exportText + captcha["groups"][0]["accounts"][i]["email"] + ";" + captcha["groups"][0]["accounts"][i]["password"] + ";" + captcha["groups"][0]["accounts"][i]["recovery"] + ";" + captcha["groups"][0]["accounts"][i]["proxy"] + "\n";
       }
       console.log(exportText)
       setOpenExport(true);
   };
   const handleCloseExport = () => {setOpenExport(false);};

   // IMPORT OPTIONS
   const confirmImportAccounts = () => {
       var accountInput = document.getElementById("account_import");
       var accountValues = accountInput.value;
       var accountLines = accountValues.split('\n');


       let accountParts;
       let accountList = [];


       if(accountValues === "") {
           handleOpenSnackbar("Please paste your accounts into the text panel","info");
           return
       }

       for(var i = 0; i < accountLines.length; i++) {

           if(accountLines[i] === "") {continue;};
           var count = (accountLines[i].match(/;/g) || []).length;
           accountParts = accountLines[i].split(';');

           if(count === 3) {
               accountList.push({"email":accountParts[0],"password":accountParts[1],"recovery":accountParts[2],"proxy":accountParts[3]})
               continue;
           }
           else if(count === 2) {
                accountList.push({"email":accountParts[0],"password":accountParts[1],"recovery":accountParts[2],"proxy":""})
                continue;
            }
           else {
               handleOpenSnackbar("Incorrect accounts formatting","warning");
               return;
           }
       }
      
       ipcRenderer.send('importCaptcha', {accounts:accountList})
       handleOpenSnackbar("Accounts imported","success");
       handleCloseImport()
       return;
   }

   const [openImport, setOpenImport] = React.useState(false);
   const handleOpenImport = () => {setOpenImport(true);};
   const handleCloseImport = () => {setOpenImport(false);};




    return(
        <ThemeProvider theme={theme}>
        <div className="page">

            <div className="page_header">
                <div className="page_header-section">
                    <h6 className="page_title">Captcha</h6>
                    <div className="page_subtitle-container">
                        <span className="page_subtitle">You have </span>
                        <span className="page_subtitle" style={{color:"#F1F1F2"}}>{captchaLength} emails</span>
                        <span className="page_subtitle"> being farmed. </span>
                    </div>
                </div>
            </div>
            <div className="page_body">
                <div className="page_body-header" style={{justifyContent:"space-between"}}>
                    <div class="button_group" style={{width:"170px"}}>
                            <Button color="#15BABE" text="Import" width="71px" clicked={handleOpenImport} />
                            <Button color="#D85059" text="Export" width="71px" clicked={handleOpenExport} />
                        </div>
                    <div style={{width:"300px",marginLeft:"50px"}}>
                        <div className={classes.root}>
                        <div className={classes.tabViewer}>
                            <AntTabs value={tabValue} onChange={handleTabChange}>
                                <AntTab label="Column" />
                                <AntTab label="Row" />
                            </AntTabs>
                            <Typography className={classes.padding} />
                        </div>
                        </div>
                    </div>

                    <div className="button_group" style={{width:"300px"}}>
                        <Button width="30px" color="#19C070" icon="start" clicked={handleStartAllTasks} />
                        <Button width="30px" color="#D85059" icon="stop" clicked={handleStopAllTasks} />
                        <Button width="120px" color="#15BABE" text="Manage Proxies" icon="proxy" clicked={handleSetProxyGroup} />
                        <Button width="100px" color="#15BABE" text="Add Account" icon="add" clicked={handleAddAccount} />
                    </div>
                    
                </div>

                <div className="page_main-body" style={{display:`${colPageDisplay}`}}>
                    <div className="page_body-col">
                        <DotTitle color="#1AE9B5" title="ACTIVE" />
                        <div className="page_body-cols-container">
                            {activeElements}
                        </div>
                    </div>
                    <div className="page_body-col">
                        <DotTitle color="#FFC74F" title="SLEEPING" />
                        <div className="page_body-cols-container">
                            {sleepingElements}
                        </div>
                    </div>
                    <div className="page_body-col">
                        <DotTitle color="#D85059" title="INACTIVE" />
                        <div className="page_body-cols-container">
                            {inactiveElements}
                        </div>
                    </div>
                </div>

                <div className="page_main-body" style={{display:`${rowPageDisplay}`}}>
                    <div className="page_body-row">
                        <DotTitle color="#1AE9B5" title="ACTIVE" />
                        <div className="page_body-rows-container">
                            {activeElements}
                        </div>
                        <DotTitle color="#FFC74F" title="SLEEPING" />
                        <div className="page_body-rows-container">
                            {sleepingElements}
                        </div>
                        <DotTitle color="#D85059" title="INACTIVE" />
                        <div className="page_body-rows-container">
                            {inactiveElements}
                        </div>
                    </div>

                </div>



            </div>
        </div>



        <Modal
            className={classes.modal}
            open={openAddAccount}
            onClose={handleCloseAddAccount}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
            timeout: 500,
            }}
        >
            <Fade in={openAddAccount}>
            <div className={classes.paper}>

                <div className="popup-container" style={{width:"300px",height:"290px"}}>
                    <div className="popup-header" style={{marginBottom:"20px"}}>
                        <span className="popup-section_title">Add Farming Account</span>
                        <svg className="window_icon" width="15" height="15" viewBox="0 0 13 13" onClick={handleCloseAddAccount}>
                            <path d="M0.271972 0.271972C0.634602 -0.0906574 1.22254 -0.0906574 1.58517 0.271972L6.5 5.1868L11.4148 0.271972C11.7775 -0.0906574 12.3654 -0.0906574 12.728 0.271972C13.0907 0.634602 13.0907 1.22254 12.728 1.58517L7.8132 6.5L12.728 11.4148C13.0907 11.7775 13.0907 12.3654 12.728 12.728C12.3654 13.0907 11.7775 13.0907 11.4148 12.728L6.5 7.8132L1.58517 12.728C1.22254 13.0907 0.634602 13.0907 0.271972 12.728C-0.0906574 12.3654 -0.0906574 11.7775 0.271972 11.4148L5.1868 6.5L0.271972 1.58517C-0.0906574 1.22254 -0.0906574 0.634602 0.271972 0.271972Z"/>
                        </svg>
                    </div>
                    <TextField
                        name="email"
                        className={classes.inputFull}
                        label="Email Address"
                        value={accountAdd.email}
                        onChange={handleAddAccountChange}
                        variant="outlined"
                        margin="dense"
                    ></TextField>
                    <TextField
                        name="password"
                        className={classes.inputFull}
                        label="Email Password"
                        value={accountAdd.password}
                        onChange={handleAddAccountChange}
                        variant="outlined"
                        margin="dense"
                    ></TextField>
                    <TextField
                        name="recovery"
                        className={classes.inputFull}
                        label="Recovery Email"
                        value={accountAdd.recovery}
                        onChange={handleAddAccountChange}
                        variant="outlined"
                        margin="dense"
                    ></TextField>
                    <TextField
                        name="proxy"
                        className={classes.inputFull}
                        label="Proxy"
                        value={accountAdd.proxy}
                        onChange={handleAddAccountChange}
                        variant="outlined"
                        margin="dense"
                    ></TextField>
                    <div className="button_group" style={{width:"100%",justifyContent:"flex-end",marginTop:"10px"}}>
                        <Button color="#15BABE" text="Add" icon="add" width="98px" clicked={confirmAddAccount} />

                    </div>
                </div>

            </div>
            </Fade>
        </Modal>

        <Modal
            className={classes.modal}
            open={openEditAccount}
            onClose={handleCloseEditAccount}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
            timeout: 500,
            }}
        >
        <Fade in={openEditAccount}>
            <div className={classes.paper}>

                <div className="popup-container" style={{width:"300px",height:"290px"}}>
                    <div className="popup-header" style={{marginBottom:"20px"}}>
                        <span className="popup-section_title">Edit Farming Account</span>
                        <svg className="window_icon" width="15" height="15" viewBox="0 0 13 13" onClick={handleCloseEditAccount}>
                            <path d="M0.271972 0.271972C0.634602 -0.0906574 1.22254 -0.0906574 1.58517 0.271972L6.5 5.1868L11.4148 0.271972C11.7775 -0.0906574 12.3654 -0.0906574 12.728 0.271972C13.0907 0.634602 13.0907 1.22254 12.728 1.58517L7.8132 6.5L12.728 11.4148C13.0907 11.7775 13.0907 12.3654 12.728 12.728C12.3654 13.0907 11.7775 13.0907 11.4148 12.728L6.5 7.8132L1.58517 12.728C1.22254 13.0907 0.634602 13.0907 0.271972 12.728C-0.0906574 12.3654 -0.0906574 11.7775 0.271972 11.4148L5.1868 6.5L0.271972 1.58517C-0.0906574 1.22254 -0.0906574 0.634602 0.271972 0.271972Z"/>
                        </svg>
                    </div>
                    <TextField
                        name="email"
                        className={classes.inputFull}
                        label="Email Address"
                        value={accountEdit.email}
                        onChange={handleEditAccountChange}
                        variant="outlined"
                        margin="dense"
                    ></TextField>
                    <TextField
                        name="password"
                        className={classes.inputFull}
                        label="Email Password"
                        value={accountEdit.password}
                        onChange={handleEditAccountChange}
                        variant="outlined"
                        margin="dense"
                    ></TextField>
                    <TextField
                        name="recovery"
                        className={classes.inputFull}
                        label="Recovery Email"
                        value={accountEdit.recovery}
                        onChange={handleEditAccountChange}
                        variant="outlined"
                        margin="dense"
                    ></TextField>
                    <TextField
                        name="proxy"
                        className={classes.inputFull}
                        label="Proxy"
                        value={accountEdit.proxy}
                        onChange={handleEditAccountChange}
                        variant="outlined"
                        margin="dense"
                    ></TextField>
                    <div className="button_group" style={{width:"100%",justifyContent:"flex-end",marginTop:"10px"}}>
                        <Button color="#15BABE" text="Save" icon="save" width="98px" clicked={confirmEditAccount} />

                    </div>
                </div>

            </div>
            </Fade>
        </Modal>

        <Modal
            className={classes.modal}
            open={openSetProxyGroup}
            onClose={handleCloseSetProxyGroup}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
            timeout: 500,
            }}
        >
            <Fade in={openSetProxyGroup}>
            <div className={classes.paper}>

                <div className="popup-container" style={{width:"300px",height:"130px"}}>
                    <div className="popup-header" style={{marginBottom:"20px"}}>
                        <span className="popup-section_title">Set Proxy Group</span>
                        <svg className="window_icon" width="15" height="15" viewBox="0 0 13 13" onClick={handleCloseSetProxyGroup}>
                            <path d="M0.271972 0.271972C0.634602 -0.0906574 1.22254 -0.0906574 1.58517 0.271972L6.5 5.1868L11.4148 0.271972C11.7775 -0.0906574 12.3654 -0.0906574 12.728 0.271972C13.0907 0.634602 13.0907 1.22254 12.728 1.58517L7.8132 6.5L12.728 11.4148C13.0907 11.7775 13.0907 12.3654 12.728 12.728C12.3654 13.0907 11.7775 13.0907 11.4148 12.728L6.5 7.8132L1.58517 12.728C1.22254 13.0907 0.634602 13.0907 0.271972 12.728C-0.0906574 12.3654 -0.0906574 11.7775 0.271972 11.4148L5.1868 6.5L0.271972 1.58517C-0.0906574 1.22254 -0.0906574 0.634602 0.271972 0.271972Z"/>
                        </svg>
                    </div>
                    <TextField
                        select
                        className={classes.inputFull}
                        label="Proxy Group"
                        value={proxyGroup}
                        onChange={handleProxyGroupChange}
                        variant="outlined"
                        margin="dense"
                    >

                        {proxies["groups"].map((group,index) => (
                            <MenuItem key={index} value={index}>
                                {group["name"]}
                            </MenuItem>
                            ))}
                    </TextField>

                    <div className="button_group" style={{width:"100%",justifyContent:"flex-end",marginTop:"10px"}}>
                        <Button color="#15BABE" text="Set Proxies" width="98px" clicked={confirmSetProxyGroup} />

                    </div>
                </div>

            </div>
            </Fade>
        </Modal>

        <Modal
            className={classes.modal}
            open={openExport}
            onClose={handleOpenExport}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
            timeout: 500,
            }}
        >
            <Fade in={openExport}>
            <div className={classes.paper}>

                <div className="popup-container" style={{width:"500px",height:"480px"}}>
                    <div className="popup-header" style={{marginBottom:"20px"}}>
                        <span className="popup-section_title">Export Accounts</span>
                        <svg className="window_icon" width="15" height="15" viewBox="0 0 13 13" onClick={handleCloseExport}>
                            <path d="M0.271972 0.271972C0.634602 -0.0906574 1.22254 -0.0906574 1.58517 0.271972L6.5 5.1868L11.4148 0.271972C11.7775 -0.0906574 12.3654 -0.0906574 12.728 0.271972C13.0907 0.634602 13.0907 1.22254 12.728 1.58517L7.8132 6.5L12.728 11.4148C13.0907 11.7775 13.0907 12.3654 12.728 12.728C12.3654 13.0907 11.7775 13.0907 11.4148 12.728L6.5 7.8132L1.58517 12.728C1.22254 13.0907 0.634602 13.0907 0.271972 12.728C-0.0906574 12.3654 -0.0906574 11.7775 0.271972 11.4148L5.1868 6.5L0.271972 1.58517C-0.0906574 1.22254 -0.0906574 0.634602 0.271972 0.271972Z"/>
                        </svg>
                    </div>
                    <div className="popup-flex_container" style={{height:"68%",marginTop:"20px"}}>
                        <textarea id="account_export" className="full-text" style={{height:"400px"}} placeholder="Enter accounts in user//pass/recovery//proxy format.">
                            {exportText}
                        </textarea>
                    </div>
                </div>
            </div>
            </Fade>
        </Modal>

        <Modal
            className={classes.modal}
            open={openImport}
            onClose={handleOpenImport}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
            timeout: 500,
            }}
        >
            <Fade in={openImport}>
            <div className={classes.paper}>

                <div className="popup-container" style={{width:"300px",height:"450px"}}>
                    <div className="popup-header" style={{marginBottom:"20px"}}>
                        <span className="popup-section_title">Import Accounts</span>
                        <svg className="window_icon" width="15" height="15" viewBox="0 0 13 13" onClick={handleCloseImport}>
                            <path d="M0.271972 0.271972C0.634602 -0.0906574 1.22254 -0.0906574 1.58517 0.271972L6.5 5.1868L11.4148 0.271972C11.7775 -0.0906574 12.3654 -0.0906574 12.728 0.271972C13.0907 0.634602 13.0907 1.22254 12.728 1.58517L7.8132 6.5L12.728 11.4148C13.0907 11.7775 13.0907 12.3654 12.728 12.728C12.3654 13.0907 11.7775 13.0907 11.4148 12.728L6.5 7.8132L1.58517 12.728C1.22254 13.0907 0.634602 13.0907 0.271972 12.728C-0.0906574 12.3654 -0.0906574 11.7775 0.271972 11.4148L5.1868 6.5L0.271972 1.58517C-0.0906574 1.22254 -0.0906574 0.634602 0.271972 0.271972Z"/>
                        </svg>
                    </div>
                    <div className="popup-flex_container" style={{height:"68%",marginTop:"20px"}}>
                        <textarea id="account_import" className="full-text" style={{height:"400px"}} placeholder="Enter accounts in email;password;recovery;proxy format.">

                        </textarea>
                    </div>
                </div>
                <div className="button_group" style={{width:"100%",justifyContent:"flex-end",marginTop:"10px"}}>
                    <Button color="#15BABE" text="Import" width="98px" clicked={confirmImportAccounts} />
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

    );
}


export default Captcha;


