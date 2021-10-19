import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom';

import './pages.css'

import Button from '../components/buttons/button'
import DotTitle from '../components/titles/DotTitle'
import GroupPanel from '../components/panels/GroupPanel'
import ProxyPanel from '../components/panels/ProxyPanel'
import EmptyPanel from '../components/panels/EmptyPanel'


import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField'
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Snackbar from '@material-ui/core/Snackbar';
import {Alert, AlertTitle} from '@material-ui/lab';


const { ipcRenderer } = window.require('electron/renderer')
const request = require('request')


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
const useStyles = makeStyles((theme) => ({
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


const pingEndpoints = [
    {
      value: 'https://google.com',
      label: 'Google',
    },
    {
      value: 'https://adidas.com',
      label: 'Adidas',
    },
    {
      value: 'https://amazon.com',
      label: 'Amazon',
    },
    {
      value: 'https://bestbuy.com',
      label: 'Bestbuy',
    },
    {
    value: 'https://footlocker.com',
    label: 'Footsites',
    },
    {
    value: 'https://yeezysupply.com',
    label: 'Yeezysupply',
    },
];
function combineProxy(ip,port,user,pass) {
    if(user === undefined) {
        return ip + ":" + port
    }
    else {
        return ip + ":" + port + ":" + user + ":" + pass
    }
};

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
};

/*
let proxiesInit
fetch('http://localhost:8080/getProxies')
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        proxiesInit = data
    })
    .catch(err => console.log(err))
*/


let proxyCount;
let groupCount = 0;
let proxies;
ipcRenderer.send('getProxies')
ipcRenderer.on('getProxies', (event,arg) => {
    ipcRenderer.removeAllListeners('getProxies')
    
    proxies = arg.proxies
    //setProxies(arg.proxies)
})

const Proxies = (props) => {

    const classes = useStyles();

    let proxyGroups;
    let proxyItems;


    ipcRenderer.send('getProxies')
    ipcRenderer.on('getProxies', (event,arg) => {
        ipcRenderer.removeAllListeners('getProxies')
        proxies = arg.proxies
        //setProxies(arg.proxies)
    })


    const [seconds, setSeconds] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
          setSeconds(seconds => seconds + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);


    // GENERAL PARAMS
    const [pingEndpoint, setPingEndpoint] = React.useState('https://google.com');
    const [group, setGroup] = React.useState(0) // group index
    //const [proxies, setProxies] = React.useState(proxies)
    
    const handleUrlChange = (event) => {setPingEndpoint(event.target.value);};
    const handleGroupChange = (index) => {
        setGroup(index);
        var proxyInput = document.getElementById("proxy_input")
        proxyInput.value = ""
    };

    const [snackBarOpen, setOpenSnackBar] = React.useState(false);
    const [snackBarText,setSnackBarText] = React.useState('Success!');
    const [snackBarSeverity,setSnackBarSeverity] = React.useState('success');

    const handleOpenSnackbar = (text,severity) => {
        ipcRenderer.send('addNotification', {
            type:severity.toUpperCase(),
            title:"PROXIES",
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






    try {
        groupCount = proxies["groups"].length
        if(proxies["groups"].length !== 0) {
            proxyGroups = proxies["groups"].map((group,index) =>  
                <GroupPanel 
                    name={group["name"]} 
                    content={group["proxies"]} 
                    type="proxies" 
                    index={index} 
                    key={index}
                    allowModify={true}
                    switchGroup={group => handleGroupChange(group)} 
                    editGroup={group => handleGroupEdit(group)}
                    deleteGroup={group => handleGroupDelete(group)}
                />)
    
    
            if(proxies["groups"][group]["proxies"].length !== 0) {
                proxyItems = proxies["groups"][group]["proxies"].map((proxy,index) =>  
                    <ProxyPanel 
                        index={index}
                        proxy={combineProxy(proxy["ip"],proxy["port"],proxy["user"],proxy["pass"])} 
                        key={index}
                        speed={proxy["speed"]}
                        deleteProxy={id => confirmDeleteProxy(id)}
                    />)
            } else {
                proxyItems = <EmptyPanel type="proxy" text="Import some proxies"/>
            }
    
        }
        else {
            proxyGroups = <EmptyPanel type="group" text="Add a group"/>
            proxyItems = <EmptyPanel type="proxy" text="Import some proxies"/>
        }


        proxyCount = 0;
        for(var i = 0; i < proxies["groups"].length; i++) {

            proxyCount += proxies["groups"][i]["proxies"].length
        }
    }
    catch {
        console.log("ERROR")
    }








    // ADD GROUP
    const [groupAdd, setGroupAdd] = React.useState("")
    const handleGroupAddChange = (event) => {setGroupAdd(event.target.value)};
    const handleGroupAdd = () => {
        setGroupAdd("")
        handleOpenAddGroup();
    }
    const confirmGroupAdd = () => {
        ipcRenderer.send('addProxyGroup', {name:groupAdd})
        ipcRenderer.on('addProxyGroup', (event,arg) => {
            proxies = arg.proxies
            //setProxies(arg.proxies)
            handleCloseAddGroup()
        })
    }

    const [openAddGroup, setOpenAddGroup] = React.useState(false);
    const handleOpenAddGroup = () => {setOpenAddGroup(true);};
    const handleCloseAddGroup = () => {setOpenAddGroup(false);};




    // EDITING GROUP
    const [groupEdit, setGroupEdit] = React.useState({groupIndex:0,groupName:""})
    const handleGroupEditChange = (event) => {setGroupEdit({ ...groupEdit, [event.target.name]: event.target.value });};
    const handleGroupEdit = (index) => {
        setGroupEdit({
            groupIndex: index,
            groupName: proxies["groups"][index]["name"]
        });
        setOpenEditGroup(true)
    }
    const confirmGroupEdit = () => {
        /*
        fetch('http://localhost:8080/editProxyGroup',{
            method:"PATCH",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name:groupEdit.groupName,
                index:groupEdit.groupIndex
            }) 
        })
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                setProxies(data)
                handleCloseEditGroup()
            })
            .catch(err => console.log(err))
        */
        ipcRenderer.send('editProxyGroup', {index:groupEdit.groupIndex,name:groupEdit.groupName})
        ipcRenderer.on('editProxyGroup', (event,arg) => {
            proxies = arg.proxies
            //setProxies(arg.proxies)
            handleCloseEditGroup()
        })
    };

    const [openEditGroup, setOpenEditGroup] = React.useState(false);
    const handleOpenEditGroup = () => {setOpenEditGroup(true);};
    const handleCloseEditGroup = () => {setOpenEditGroup(false);};



    // DELETE PARAMS
    const [groupDelete, setGroupDelete] = React.useState(0)
    const handleGroupDelete = (index) => {
        setGroupDelete(index);
        handleOpenDeleteGroup();
    }
    const confirmGroupDelete = (index) => {
        ipcRenderer.send('deleteProxyGroup', {index:groupDelete})
        ipcRenderer.on('deleteProxyGroup', (event,arg) => {
            proxies = arg.proxies
            //setProxies(arg.proxies)
            handleCloseDeleteGroup()
        })
        
    }

    const [openDeleteGroup, setOpenDeleteGroup] = React.useState(false);
    const handleOpenDeleteGroup = () => {setOpenDeleteGroup(true);};
    const handleCloseDeleteGroup = () => {setOpenDeleteGroup(false);};




    // IMPORT / EXPORT PROXIES
    const handleProxyImport = () => {
        var proxyInput = document.getElementById("proxy_input");
        var proxyValues = proxyInput.value;
        var proxyLines = proxyValues.split('\n');


        let proxyParts;
        let proxyList = [];

        if(proxies["groups"].length === 0) {
            handleOpenSnackbar("No groups to export","info");
            return
        }


        if(proxyValues === "") {
            handleOpenSnackbar("Please paste your proxies into the text panel","info");
            return
        }

        for(var i = 0; i < proxyLines.length; i++) {
            if(proxyLines[i] === "") {continue;};
            var count = (proxyLines[i].match(/:/g) || []).length;

            proxyParts = proxyLines[i].split(':');
            if(count === 1) {
                proxyList.push({"ip":proxyParts[0],"port":proxyParts[1]})
                continue;
            }
            else if(count === 3) {
                proxyList.push({"ip":proxyParts[0],"port":proxyParts[1],"user":proxyParts[2],"pass":proxyParts[3]})
                continue;
            }
            else {
                handleOpenSnackbar("Incorrect proxy formatting","warning");
                return;
            }
        }
       
        ipcRenderer.send('importProxies', {index:group,proxies:proxyList})
        ipcRenderer.on('importProxies', (event,arg) => {
            proxies = arg.proxies
            //setProxies(arg.proxies)
            proxyInput.value = ""
            handleOpenSnackbar("Proxies imported","success");
        })
        
        
    }
    const handleProxyExport = () => {
        var proxyInput = document.getElementById("proxy_input");

        if(proxies["groups"].length === 0) {
            handleOpenSnackbar("No groups to export","info");
            return
        }
        if(proxies["groups"][group]["proxies"].length === 0) {
            handleOpenSnackbar("No proxies to export","info");
            return
        }



        proxyInput.value = "";
        for(var i = 0; i < proxies["groups"][group]["proxies"].length; i++) {
            if(proxies["groups"][group]["proxies"][i].hasOwnProperty('user')) {
                proxyInput.value += proxies["groups"][group]["proxies"][i]["ip"] + ":" + proxies["groups"][group]["proxies"][i]["port"] + ":" + proxies["groups"][group]["proxies"][i]["user"] + ":" + proxies["groups"][group]["proxies"][i]["pass"]
            }
            else {
                proxyInput.value += proxies["groups"][group]["proxies"][i]["ip"] + ":" + proxies["groups"][group]["proxies"][i]["port"]
            }
            proxyInput.value += "\n"

        }


        handleOpenSnackbar("Proxies exported into text field","success");
        return
        
    }




    // COPY / PASTE CLIPBOARD
    const handleCopy = () => {
        document.getElementById('proxy_input').select();
        document.execCommand('copy');
        handleOpenSnackbar("Copied from clipboard","success");
    }
    const handlePaste = async () => {
        var clipboard = await navigator.clipboard.readText();
        var proxyInput = document.getElementById('proxy_input');
        proxyInput.value = clipboard;
        handleOpenSnackbar("Pasted from clipboard","success");
    }



    // TEST FUNCTIONS
    const testAllProxies = () => {
        if(proxies["groups"].length === 0) {
            handleOpenSnackbar("No proxies to test","info");
            return;
        }
        if(proxies["groups"][group]["proxies"].length === 0) {
            handleOpenSnackbar("No proxies to test","info");
            return;
        }

        handleOpenSnackbar("Testing proxies...","success");
        ipcRenderer.send('testProxies', {group:group,pingEndpoint:pingEndpoint})
        return;
    }



    // CLEAR FUNCTIONS
    const handleClearAll = () => {
        ipcRenderer.send('removeAllProxies', {group:group})
        ipcRenderer.on('removeAllProxies', (event,arg) => {
            proxies = arg.proxies;
            console.log(proxies)
            handleOpenSnackbar("All proxies cleared","success");
        })
    }

    const handleClearBad = () => {
        var badProxiesCount = 0;
        for(var i = 0; i < proxies["groups"][group]["proxies"].length; i++) {
            if(proxies["groups"][group]["proxies"][i]["speed"] === "BAD") badProxiesCount += 1;
        }
        if(badProxiesCount === 0) {
            handleOpenSnackbar("No bad proxies","warning");
            return
        }

        ipcRenderer.send('removeBadProxies', {group:group})
        ipcRenderer.on('removeBadProxies', (event,arg) => {
            proxies = arg.proxies
            console.log("removing bad proxies")
            console.log(arg.proxies)
            handleOpenSnackbar("Bad proxies cleared","success");
        })
    }


    const confirmDeleteProxy = (index) => {
        ipcRenderer.send('removeProxy', {group:group,index:index})
        ipcRenderer.on('removeProxy', (event,arg) => {
            proxies = arg.proxies
            handleOpenSnackbar("Proxy removed","success");
        })
    }


    
    return(
        <ThemeProvider theme={theme}>

        <div className="page">

            <div className="page_header">
                <div className="page_header-section">
                    <h6 className="page_title">Proxies</h6>
                    <div className="page_subtitle-container">
                        <span className="page_subtitle">You have </span>
                        <span className="page_subtitle" style={{color:"#F1F1F2"}}>{proxyCount} proxies</span>
                        <span className="page_subtitle"> available. </span>
                    </div>
                </div>
            </div>
            <div className="page_body">
                <div className="page_body-header">
                    <div className="button_group" style={{width:"170px"}}>
                        <Button color="#15BABE" text="Import" width="71px" clicked={handleProxyImport} />
                        <Button color="#D85059" text="Export" width="71px" clicked={handleProxyExport} />
                    </div>
                    <div className="button_group" style={{width:"220px"}}>
                        <Button width="100px" color="#D85059" text="Clear All" icon="delete" clicked={handleClearAll} />
                        <Button width="100px" color="#D85059" text="Clear Failed" icon="delete" clicked={handleClearBad} />
                    </div>

                </div>

                <div className="page_main-body">
                    <div className="page_body-col">
                        <DotTitle color="#1AE9B5" title={groupCount + " GROUPS"} />
                        <div className="page_body-cols-container">
                            {proxyGroups}
                            <Button icon="add" color="#1D1D27" border="1px solid #343444" width="95%" clicked={handleGroupAdd} />
                        </div>
                        
                    </div>
                    <div className="page_body-col">
                        <DotTitle color="#1AE9B5" title="ENTER PROXY" />
                        <div className="page_body-cols-container" style={{height:"calc(100% - 67px)"}}>
                            <textarea id="proxy_input" className="full-text" style={{height:"98%"}} placeholder="Enter proxy in ip:port:user:pass format.">

                            </textarea>

                        </div>
                        <div className="button_group" style={{width:"100%",justifyContent:"flex-end",marginTop:"10px"}}>
                                
                            <Button color="#15BABE" text="Paste" width="61px" clicked={handlePaste} />
                            <div style={{width:"10px",height:"100%"}}></div>
                            <Button color="#15BABE" text="Copy" width="61px" clicked={handleCopy} />
                            <div style={{width:"10px",height:"100%"}}></div>
                            <Button color="#19C070" text="Save" icon="save" width="98px" clicked={handleProxyImport} />

                        </div>
                    </div>
                    <div className="page_body-col">
                        <DotTitle color="#1AE9B5" title="TEST PROXY" />
                        <div className="page_body-cols-container" style={{height:"calc(100% - 76px)"}}>
                            {proxyItems}
                            
                        </div>
                        <div className="button_group" style={{width:"100%", height:"40px",justifyContent:"flex-end",marginTop:"12px"}}>
                            <TextField
                                select
                                className={classes.select}
                                label="URL"
                                value={pingEndpoint}
                                onChange={handleUrlChange}
                                variant="outlined"
                                margin="dense"
                            >
                                {pingEndpoints.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                                ))}
                            </TextField>
                            <div style={{width:"10px",height:"100%"}}></div>
                            <Button color="#19C070" text="Test" icon="timer" width="112px" height="40px" clicked={testAllProxies}  />

                        </div>
                    </div>
                </div>





            </div>
        </div>

        <Modal
            className={classes.modal}
            open={openEditGroup}
            onClose={handleOpenEditGroup}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
            timeout: 500,
            }}
        >
            <Fade in={openEditGroup}>
            <div className={classes.paper}>

                <div className="popup-container" style={{width:"200px",height:"140px"}}>
                    <div className="popup-header" style={{marginBottom:"20px"}}>
                        <span className="popup-section_title">Edit Proxy Group</span>
                        <svg className="window_icon" width="15" height="15" viewBox="0 0 13 13" onClick={handleCloseEditGroup}>
                            <path d="M0.271972 0.271972C0.634602 -0.0906574 1.22254 -0.0906574 1.58517 0.271972L6.5 5.1868L11.4148 0.271972C11.7775 -0.0906574 12.3654 -0.0906574 12.728 0.271972C13.0907 0.634602 13.0907 1.22254 12.728 1.58517L7.8132 6.5L12.728 11.4148C13.0907 11.7775 13.0907 12.3654 12.728 12.728C12.3654 13.0907 11.7775 13.0907 11.4148 12.728L6.5 7.8132L1.58517 12.728C1.22254 13.0907 0.634602 13.0907 0.271972 12.728C-0.0906574 12.3654 -0.0906574 11.7775 0.271972 11.4148L5.1868 6.5L0.271972 1.58517C-0.0906574 1.22254 -0.0906574 0.634602 0.271972 0.271972Z"/>
                        </svg>
                    </div>
                    <TextField
                        name="groupName"
                        className={classes.inputFull}
                        label="Group Name"
                        value={groupEdit.groupName}
                        onChange={handleGroupEditChange}
                        variant="outlined"
                        margin="dense"
                    ></TextField>
                    <div className="button_group" style={{width:"100%",justifyContent:"flex-end",marginTop:"10px"}}>
                        <Button color="#15BABE" text="Save" icon="save" width="98px" clicked={confirmGroupEdit} />

                    </div>
                </div>

            </div>
            </Fade>
        </Modal>

        <Modal
            className={classes.modal}
            open={openDeleteGroup}
            onClose={handleCloseDeleteGroup}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
            timeout: 500,
            }}
        >
            <Fade in={openDeleteGroup}>
            <div className={classes.paper}>

                <div className="popup-container" style={{width:"200px",height:"128px"}}>
                    <div className="popup-header" style={{marginBottom:"20px"}}>
                        <span className="popup-section_title">Delete Proxy Group</span>
                        <svg className="window_icon" width="15" height="15" viewBox="0 0 13 13" onClick={handleCloseDeleteGroup}>
                            <path d="M0.271972 0.271972C0.634602 -0.0906574 1.22254 -0.0906574 1.58517 0.271972L6.5 5.1868L11.4148 0.271972C11.7775 -0.0906574 12.3654 -0.0906574 12.728 0.271972C13.0907 0.634602 13.0907 1.22254 12.728 1.58517L7.8132 6.5L12.728 11.4148C13.0907 11.7775 13.0907 12.3654 12.728 12.728C12.3654 13.0907 11.7775 13.0907 11.4148 12.728L6.5 7.8132L1.58517 12.728C1.22254 13.0907 0.634602 13.0907 0.271972 12.728C-0.0906574 12.3654 -0.0906574 11.7775 0.271972 11.4148L5.1868 6.5L0.271972 1.58517C-0.0906574 1.22254 -0.0906574 0.634602 0.271972 0.271972Z"/>
                        </svg>
                    </div>
                    <span className="popup-section_title">Are you sure you want to delete this group?</span>

                    <div className="button_group" style={{width:"100%",justifyContent:"flex-end",marginTop:"20px"}}>
                        <Button color="#D85059" text="Cancel" width="98px" clicked={handleCloseDeleteGroup} width="70px" style={{marginRight:"10px"}} />
                        <div style={{width:"10px",height:"100%"}}></div>
                        <Button color="#15BABE" text="Yes" width="98px" clicked={confirmGroupDelete} width="70px" />
                    </div>
                </div>

            </div>
            </Fade>
        </Modal>

        <Modal
            className={classes.modal}
            open={openAddGroup}
            onClose={handleCloseAddGroup}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
            timeout: 500,
            }}
        >
            <Fade in={openAddGroup}>
            <div className={classes.paper}>

                <div className="popup-container" style={{width:"200px",height:"128px"}}>
                    <div className="popup-header" style={{marginBottom:"20px"}}>
                        <span className="popup-section_title">Add Proxy Group</span>
                        <svg className="window_icon" width="15" height="15" viewBox="0 0 13 13" onClick={handleCloseAddGroup}>
                            <path d="M0.271972 0.271972C0.634602 -0.0906574 1.22254 -0.0906574 1.58517 0.271972L6.5 5.1868L11.4148 0.271972C11.7775 -0.0906574 12.3654 -0.0906574 12.728 0.271972C13.0907 0.634602 13.0907 1.22254 12.728 1.58517L7.8132 6.5L12.728 11.4148C13.0907 11.7775 13.0907 12.3654 12.728 12.728C12.3654 13.0907 11.7775 13.0907 11.4148 12.728L6.5 7.8132L1.58517 12.728C1.22254 13.0907 0.634602 13.0907 0.271972 12.728C-0.0906574 12.3654 -0.0906574 11.7775 0.271972 11.4148L5.1868 6.5L0.271972 1.58517C-0.0906574 1.22254 -0.0906574 0.634602 0.271972 0.271972Z"/>
                        </svg>
                    </div>
                    <TextField
                        name="groupAdd"
                        className={classes.inputFull}
                        label="Group Name"
                        value={groupAdd}
                        onChange={handleGroupAddChange}
                        variant="outlined"
                        margin="dense"
                    ></TextField>
                    <div className="button_group" style={{width:"100%",justifyContent:"flex-end",marginTop:"10px"}}>
                        <Button color="#15BABE" text="Add" icon="add" width="98px" clicked={confirmGroupAdd} />

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
    );

}




export default Proxies;