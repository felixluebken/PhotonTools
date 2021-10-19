import React, { useState, useEffect } from "react";

import './pages.css'
import './popups.css'

import Button from '../components/buttons/button'
import DotTitle from '../components/titles/DotTitle'
import GroupPanel from '../components/panels/GroupPanel'
import GeneratorPanel from '../components/panels/GeneratorPanel'
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
import Switch from '@material-ui/core/Switch';
import LinearProgress from '@material-ui/core/LinearProgress';
import { FormatListBulletedOutlined } from "@material-ui/icons";

const { ipcRenderer } = window.require('electron/renderer')
const PHONE_AREA_CODES = ["617","978","401","203","860","959","518","864","716","252","757"] // EXPAND ON THIS LATER
var random_name = require('node-random-name')


function getRandom(min,max) {
    return Math.floor(Math.random() * (max-min)) + min
}
function generatePassword() {
    var lower_count = 0, upper_count = 0, nums_count = 0;
    var length = 12;
    var lower = "abcdefghijklmnopqrstuvwxyz";
    var upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var nums = "0123456789";
    var retVal = "";
    for (var i = 0; i < length; ++i) {
        var choice = getRandom(0,2)
        switch(choice) {
            case 0:
                retVal += lower.charAt(Math.floor(Math.random() * lower.length));
                lower_count++;
                break;
            case 1:
                retVal += upper.charAt(Math.floor(Math.random() * upper.length));
                upper_count++;
                break;
            case 2:
                retVal += nums.charAt(Math.floor(Math.random() * nums.length));
                nums_count++;
                break;
        }
    }
    if(lower_count == 0) {
        retVal += lower.charAt(Math.floor(Math.random() * lower.length));
    }
    if(upper_count == 0) {
        retVal += upper.charAt(Math.floor(Math.random() * upper.length));
    }
    if(nums_count == 0) {
        retVal += nums.charAt(Math.floor(Math.random() * nums.length));
    }
    return retVal;
}
function generatePhoneNumber() {
    return PHONE_AREA_CODES[Math.floor(Math.random() * PHONE_AREA_CODES.length)] + getRandom(1111111,9999999)
}
function generateUsername(firstName,lastName) {
    var choice = getRandom(1,5)

    switch(choice) {
        case 1:
            return firstName.toLowerCase() + lastName.toLowerCase() + getRandom(111,99999)
        case 2:
            return firstName.toLowerCase()[0] + lastName.toLowerCase() + getRandom(111,99999)
        case 3:
            return firstName.toLowerCase() + "." + lastName.toLowerCase() + getRandom(111,99999)
        case 4:
            return firstName.toLowerCase() + getRandom(1,9) + lastName.toLowerCase() + getRandom(111,99999)
        case 5:
            return firstName.toLowerCase()[0] + "-" + lastName.toLowerCase() + getRandom(111,99999)
    }
    return firstName.toLowerCase()[0] + "-" + lastName.toLowerCase() + getRandom(111,99999)

    
}
function getRandomName() {
    return random_name({ random: Math.random })
}



const theme = createTheme({
    palette: {
        primary: {
            main: '#fff'
        },
        secondary: {
            main: '#15BABE'
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
      width:"354px",
      height:"49px",
      marginRight:"auto",
      marginLeft:"auto"
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
    },
    progress: {
        width: '35%',
        '& > * + *': {
          marginTop: theme.spacing(2),
        },
      },
}));
function useForceUpdate(){
    const [value, setValue] = React.useState(0); // integer state
    return () => setValue(value => value + 1); // update the state to force render
}


const accountGroups = [
    {
        label:"Target",
        value:"target"
    },
    {
        label:"Walmart",
        value:"walmart"
    }
]

let generatorMode = {
    automatic:"block",
    manual:"none",
    profiles:"none",
    captcha:"none"
}


function getGroupName(group) {
    for(var i = 0; i < accountGroups.length; i++) {
        if(accountGroups[i]["value"] === group) {
            return accountGroups[i]["label"]
        }
    }
}
function getState(state) {
    switch(state) {
        case 0:
            return "queued"
        case 1:
            return "generating"
        case 2:
            return "error_generating"
        case 3:
            return "good"
        case 4:
            return "error_signingin"
        case 5:
            return "testing"
    }
}


let accounts;
let accountLength = 0;
let groupItems = <></>;
let queuedItems = <></>;
let completeItems = <></>;

let proxies;
let generatorActive = false;
let progressDisplay = "none";

let exportText = "";

let profiles;
let captcha;

ipcRenderer.send('getProxies')
ipcRenderer.on('getProxies', (event,arg) => {
    ipcRenderer.removeAllListeners('getProxies')
    proxies = arg.proxies
})

ipcRenderer.send('getGenAccounts')
ipcRenderer.on('returnGenAccounts', (event,arg) => {
    ipcRenderer.removeAllListeners('returnGenAccounts')
    accounts = arg.accounts
    generatorActive = !arg.generatorActive
    if(generatorActive) {
        progressDisplay="block";
    }
    else {
        progressDisplay="none";
    }
})

ipcRenderer.send('getProfiles')
ipcRenderer.on('returnProfiles', (event,arg) => {
    ipcRenderer.removeAllListeners('returnProfiles')
    profiles = arg.profiles
})

ipcRenderer.send('getCaptcha')
ipcRenderer.on('getCaptcha', (event,arg) => {
    ipcRenderer.removeAllListeners('getCaptcha')
    captcha = arg.captcha
})






function AccountGen(props) {
    const classes = useStyles();
    const forceUpdate = useForceUpdate()

    ipcRenderer.send('getGenAccounts')
    ipcRenderer.on('returnGenAccounts', (event,arg) => {
        ipcRenderer.removeAllListeners('returnGenAccounts')
        accounts = arg.accounts
        generatorActive = !arg.generatorActive
        if(generatorActive) {
            progressDisplay="block";
        }
        else {
            progressDisplay="none";
        }

    })
    ipcRenderer.send('getProxies')
    ipcRenderer.on('getProxies', (event,arg) => {
        ipcRenderer.removeAllListeners('getProxies')
        proxies = arg.proxies
    })
    ipcRenderer.send('getProfiles')
    ipcRenderer.on('returnProfiles', (event,arg) => {
        ipcRenderer.removeAllListeners('returnProfiles')
        profiles = arg.profiles
    })
    
    
    const [seconds, setSeconds] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
          setSeconds(seconds => seconds + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    




    
    const [group, setGroup] = React.useState("target") // group index
    const handleGroupChange = (index) => {
        setGroup(index);
    };







    // GENERATOR POPUP
    const [openGenerate, setOpenGenerate] = React.useState(false);
    const handleOpenGenerate = () => {
        if(proxies["groups"].length === 0) {
            handleOpenSnackbar("Please import some proxies under the proxies panel","warning")
            return
        }
        setOpenGenerate(true);
    };
    const handleCloseGenerate = () => {setOpenGenerate(false);};

    const [tabValue, setTabValue] = React.useState(0);
    const handleTabChange = (event, newValue) => {

        switch(newValue) {
            case 0:
                generatorMode["automatic"] = "block";
                generatorMode["manual"] = "none";
                generatorMode["profiles"] = "none";
                generatorMode["captcha"] = "none";
                break;
            case 1:
                generatorMode["automatic"] = "none";
                generatorMode["manual"] = "block";
                generatorMode["profiles"] = "none";
                generatorMode["captcha"] = "none";
                break;
            case 2:
                generatorMode["automatic"] = "none";
                generatorMode["manual"] = "none";
                generatorMode["profiles"] = "block";
                generatorMode["captcha"] = "none";
                break;
            case 3:
                generatorMode["automatic"] = "none";
                generatorMode["manual"] = "none";
                generatorMode["profiles"] = "none";
                generatorMode["captcha"] = "block";
                break;
        }

        setTabValue(newValue);



    };

    const [generatorConfig, setGeneratorConfig] = React.useState({
        password:"",
        randomPassword:true,
        retryTasks:true,
        proxyGroup:0,
        profileGroup:0,
        automaticPhone:false,
        automaticEmail:false,
        manualCatchall:"",
        automaticCatchall:0,
        amount:1
    })
    const handleGeneratorConfigChange = (event) => {
        if(event.target.name === "randomPassword" || event.target.name === "retryTasks" || event.target.name === "automaticEmail" || event.target.name === "automaticPhone") {
            setGeneratorConfig({ ...generatorConfig, [event.target.name]: event.target.checked });
        }
        else {
            setGeneratorConfig({ ...generatorConfig, [event.target.name]: event.target.value });
        }
        
    };

    // PROXY OPTIONS
    const handleSetProxyGroup = () => {handleOpenSetProxyGroup();}
    const confirmSetProxyGroup = () => {
        if(proxies["groups"][generatorConfig.proxyGroup]["proxies"].length === 0) {
            handleOpenSnackbar("No proxies to import","warning")
            return
        }
        handleOpenSnackbar("Proxies imported","success")
        handleCloseSetProxyGroup()
    }

    const [openSetProxyGroup, setOpenSetProxyGroup] = React.useState(false);
    const handleOpenSetProxyGroup = () => {setOpenSetProxyGroup(true);};
    const handleCloseSetProxyGroup = () => {setOpenSetProxyGroup(false);};


    // EXPORT OPTIONS
    const [openExport, setOpenExport] = React.useState(false);
    const handleOpenExport = () => {
        exportText = ""
        for(var i = 0; i < accounts[group].length; i++) {
            exportText = exportText + accounts[group][i]["email"] + ":" + accounts[group][i]["password"] + "\n";
        }
        
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
            var count = (accountLines[i].match(/:/g) || []).length;
            accountParts = accountLines[i].split(':');

            if(count === 1) {
                accountList.push({"user":accountParts[0],"password":accountParts[1]})
                continue;
            }
            else {
                handleOpenSnackbar("Incorrect accounts formatting","warning");
                return;
            }
        }
       
        ipcRenderer.send('importGenAccounts', {type:group,accounts:accountList})
        handleOpenSnackbar("Accounts imported","success");
        handleCloseImport()
        return;
    }

    const [openImport, setOpenImport] = React.useState(false);
    const handleOpenImport = () => {setOpenImport(true);};
    const handleCloseImport = () => {setOpenImport(false);};





    


    const startGenerator = () => {
        handleOpenSnackbar("Starting all queued tasks.","success")
        ipcRenderer.send('startGenAccounts')
    }
    const stopGenerator = () => {
        handleOpenSnackbar("Generator stopping after current task is comepleted.","info")
        ipcRenderer.send('stopGenAccounts')
    }

    const confirmGenerateAccounts = () => {
        var accountList = []
        var amount = 1

        if(generatorConfig.retryTasks) {
            var taskType = "gen_retry"
        }
        else {
            var taskType = "gen"
        }
        switch(tabValue) {
            case 0:
                if(generatorConfig.manualCatchall.includes("@")) {
                    var catchDomain = generatorConfig.manualCatchall;
                }
                else {
                    var catchDomain = "@"+generatorConfig.manualCatchall;
                }

                try {
                    amount = parseInt(generatorConfig.amount)
                }
                catch(err) {
                    handleOpenSnackbar("Please enter a valid amount","error")
                    return
                }




                for(var i = 0; i < amount; i++) {
                    console.log(i)


                    if(generatorConfig.randomPassword === true) {
                        var password = generatePassword();
                    }
                    else {
                        var password = generatorConfig.password;
                    }


                    var name = getRandomName()
                    var username = generateUsername(name.split(" ")[0],name.split(" ")[1])
                    var phone = generatePhoneNumber()
                    accountList.push({name:name,email:username+catchDomain,password:password,phone:phone})
                }
                
                ipcRenderer.send('runGenAccounts', {
                    category:group,
                    type:taskType,
                    proxy:generatorConfig.proxyGroup,
                    accounts:accountList
                })
                

                handleOpenSnackbar("Generating " + amount + " " + group + " accounts.","success")
                break;
            case 1:
                var emailStr = document.getElementById("generatorEmailList").value
                var emailList = emailStr.split("\n")
                if(emailList.length === 0) {
                    handleOpenSnackbar("Please paste in some emails into the text field","info")
                    return
                }
                handleOpenSnackbar("Generating " + emailList.length + " " + group + " accounts.","success")

                for(var i = 0; i < emailList.length; i++) {
                    if(generatorConfig.randomPassword === true) {
                        var password = generatePassword();
                    }
                    else {
                        var password = generatorConfig.password;
                    }
                    var phone = generatePhoneNumber();
                    var name = getRandomName()
                    accountList.push({name:name,email:emailList[i],password:password,phone:phone})


                    
                }
                ipcRenderer.send('runGenAccounts', {
                    category:group,
                    type:taskType,
                    proxy:generatorConfig.proxyGroup,
                    accounts:accountList
                })
                
            case 2:
                if(profiles["groups"].length === 0) {
                    handleOpenSnackbar("Please create a profile group and import some profiles","info")
                    return
                }

                if(profiles["groups"][generatorConfig.profileGroup]["profiles"].length === 0) {
                    handleOpenSnackbar("Profile group is empty. Please import some profiles","info")
                    return
                }

                try {
                    amount = parseInt(generatorConfig.amount)
                }
                catch(err) {
                    handleOpenSnackbar("Please enter a valid amount","error")
                    return
                }
                
                if(amount > profiles["groups"][generatorConfig.profileGroup]["profiles"].length) {
                    handleOpenSnackbar("Please enter a amount less than the group size","info")
                    return
                }

                handleOpenSnackbar("Generating " + generatorConfig.amount + " " + group + " accounts.","success")

                for(var i = 0; i < amount; i++) {
                    if(generatorConfig.randomPassword === true) {
                        var password = generatePassword();
                    }
                    else {
                        var password = generatorConfig.password;
                    }

                    var phone = profiles["groups"][generatorConfig.profileGroup]["profiles"][i]["billing"]["phone"];
                    var name = profiles["groups"][generatorConfig.profileGroup]["profiles"][i]["billing"]["name"];
                    var email = profiles["groups"][generatorConfig.profileGroup]["profiles"][i]["billing"]["email"];
                    accountList.push({name:name,email:email,password:password,phone:phone})
                }
                ipcRenderer.send('runGenAccounts', {
                    category:group,
                    type:taskType,
                    proxy:generatorConfig.proxyGroup,
                    accounts:accountList
                })
                break;
            case 3:
                if(captcha["groups"][0]["accounts"].length === 0) {
                    handleOpenSnackbar("Please add some captcha accounts","info")
                    return
                }

                try {
                    amount = parseInt(generatorConfig.amount)
                }
                catch(err) {
                    handleOpenSnackbar("Please enter a valid amount","error")
                    return
                }
                
                if(amount > captcha["groups"][0]["accounts"].length) {
                    handleOpenSnackbar("Please enter an amount less than the amound of captcha accounts","info")
                    return
                }

                handleOpenSnackbar("Generating " + generatorConfig.amount + " " + group + " accounts.","success")

                for(var i = 0; i < amount; i++) {
                    if(generatorConfig.randomPassword === true) {
                        var password = generatePassword();
                    }
                    else {
                        var password = generatorConfig.password;
                    }

                    var phone = generatePhoneNumber();
                    var name = random_name();
                    var email = captcha["groups"][0]["accounts"][i]["email"];

                    if(!email.contains("@gmail.com")) {
                        email += "@gmail.com"
                    }

                    accountList.push({name:name,email:email,password:password,phone:phone})
                }
                ipcRenderer.send('runGenAccounts', {
                    category:group,
                    type:taskType,
                    proxy:generatorConfig.proxyGroup,
                    accounts:accountList
                })
                break;
        }
        handleCloseGenerate()
    }
    const deleteAccountConfirm = (index) => {
        if(generatorActive === true) {
            handleOpenSnackbar("Please stop the generator and wait for the current task to finish.","info")
            return
        }
        ipcRenderer.send('deleteGenAccount', {type:group,index:index})
        ipcRenderer.on('deleteGenAccount', (event,arg) => {
            ipcRenderer.removeAllListeners('deleteGenAccount')
            accounts = arg.accounts
            forceUpdate()
        })
    }
    const testSpecificConfirm = (index) => {
        try {
            if(proxies["groups"].length === 0) {
                handleOpenSnackbar("Please import some proxies under the proxies panel","warning")
                return
            }
            else if(proxies["groups"][generatorConfig.proxyGroup]["proxies"].length === 0) {
                handleOpenSnackbar("Please import some proxies under the proxies panel","warning")
                return
            }
        }
        catch(err) {
            handleOpenSnackbar("Please configure your proxies","warning")
            return
        }
        ipcRenderer.send('runGenAccounts', {
            category:group,
            type:"test_specific",
            proxy:generatorConfig.proxyGroup,
            i:index
        })
        handleOpenSnackbar("Test task added to queue.","success")
    }
    const indivitualTaskConfirm = (index) => {

    }



    const [snackBarOpen, setOpenSnackBar] = React.useState(false);
    const [snackBarText,setSnackBarText] = React.useState('Success!');
    const [snackBarSeverity,setSnackBarSeverity] = React.useState('error');

    const handleOpenSnackbar = (text,severity) => {
        ipcRenderer.send('addNotification', {
            type:severity.toUpperCase(),
            title:"GENERATOR",
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
        
        groupItems = accountGroups.map((accountGroup) =>  
        <GroupPanel
            name={accountGroup["label"]}
            type="accounts"
            content={accounts[accountGroup["value"]]}
            index={accountGroup["value"]}

            switchGroup={group => setGroup(group)}
        />)

        

        var queuedAccounts = [];
        var completeAccounts = [];
        for(var i = 0; i < accounts[group].length; i++) {
            switch(accounts[group][i]["state"]) {
                case 0:
                    accounts[group][i]["id"] = i
                    queuedAccounts.push(accounts[group][i])
                    //queuedAccounts[group][i]["index"] = i;
                    break;
                case 1:
                    accounts[group][i]["id"] = i
                    queuedAccounts.push(accounts[group][i])
                    //queuedAccounts[group][i]["index"] = i;
                    break;
                case 2:
                    accounts[group][i]["id"] = i
                    queuedAccounts.push(accounts[group][i])
                    //queuedAccounts[group][i]["index"] = i;
                    break;
                case 3:
                    accounts[group][i]["id"] = i
                    completeAccounts.push(accounts[group][i])
                    //queuedAccounts[group][i]["index"] = i;
                    break;
                case 4:
                    accounts[group][i]["id"] = i
                    queuedAccounts.push(accounts[group][i])
                    //queuedAccounts[group][i]["index"] = i;
                    break;
                case 5:
                    accounts[group][i]["id"] = i
                    queuedAccounts.push(accounts[group][i])
                    //queuedAccounts[group][i]["index"] = i;
                    break;
            }
        }

        if(queuedAccounts.length === 0) {
            queuedItems = <EmptyPanel type="accounts" text="No items queued." />
        }
        
        else {
            queuedItems = queuedAccounts.map((account,index) =>  
            <GeneratorPanel 
                type={getGroupName(group)}
                email={account["email"]}
                state={getState(account["state"])}
                password={account["password"]}
                id={account["id"]}
                //id={index}

                test={id => testSpecificConfirm(id)}
                delete={id => deleteAccountConfirm(id)}
            />
            )
            
        }
        
        if(completeAccounts.length === 0) {
            completeItems = <EmptyPanel type="accounts" text="No accounts generated." />
        }
        else {
            completeItems = completeAccounts.map((account,index) =>  
            <GeneratorPanel 
                type={getGroupName(group)}
                email={account["email"]}
                state={getState(account["state"])}
                password={account["password"]}
                id={account["id"]}
                //id={index}

                test={id => testSpecificConfirm(id)}
                delete={id => deleteAccountConfirm(id)}
            />)
        }
        
        
        accountLength = 0;
        for(var i = 0; i < accountGroups.length; i++) {
            accountLength += accounts[accountGroups[i]["value"]].length
        }
        

    }
    catch(err) {
        console.log("ERROR")
    }


    return(
        <ThemeProvider theme={theme}>
            <div className="page">

                <div className="page_header">
                    <div className="page_header-section">
                        <h6 className="page_title">Account Generator</h6>
                        <div className="page_subtitle-container">
                            <span className="page_subtitle">You have </span>
                            <span className="page_subtitle" style={{color:"#F1F1F2"}}>{accountLength} accounts</span>
                            <span className="page_subtitle"> active. </span>
                        </div>
                    </div>
                </div>
                <div className="page_body">
                    <div className="page_body-header">
                        <div class="button_group" style={{width:"370px"}}>
                            <Button width="30px" color="#19C070" icon="start" clicked={startGenerator} />
                            <Button width="30px" color="#D85059" icon="stop" clicked={stopGenerator} />
                            <Button width="150px" color="#15BABE" text="Generate" clicked={handleOpenGenerate} />
                            <Button width="120px" color="#15BABE" text="Manage Proxies" icon="proxy" clicked={handleSetProxyGroup} />
                        </div>
                        <div className={classes.progress} style={{display:progressDisplay}}>
                            <LinearProgress color="secondary" />
                        </div>
                        <div class="button_group" style={{width:"180px"}}>
                            <Button color="#15BABE" text="Import" width="71px" clicked={handleOpenImport} />
                            <Button color="#D85059" text="Export" width="71px" clicked={handleOpenExport} />
                        </div>


                    </div>

                    <div className="page_main-body">
                        <div className="page_body-col">
                            <DotTitle color="#15BABE" title={accountGroups.length+" GROUPS"} />
                            <div className="page_body-cols-container">
                                {groupItems}
                            </div>
                            
                        </div>
                        <div className="page_body-col">
                            <DotTitle color="#FFC74F" title="QUEUED" />
                            <div className="page_body-cols-container">
                                {queuedItems}
                            </div>
                        </div>
                        <div className="page_body-col">
                            <DotTitle color="#1AE9B5" title="GENERATED" />
                            <div className="page_body-cols-container">
                                {completeItems}
                                {/*
                                <GeneratorPanel type="Amazon" email="felixluebken2000@gmail.com" state="good" password="1234"/>
                                */}
                                

                            </div>
                        </div>
                    </div>





                </div>
            </div>

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

                <div className="popup-container" style={{width:"300px",height:"480px"}}>
                    <div className="popup-header" style={{marginBottom:"20px"}}>
                        <span className="popup-section_title">Export {group.toUpperCase()} Accounts</span>
                        <svg className="window_icon" width="15" height="15" viewBox="0 0 13 13" onClick={handleCloseExport}>
                            <path d="M0.271972 0.271972C0.634602 -0.0906574 1.22254 -0.0906574 1.58517 0.271972L6.5 5.1868L11.4148 0.271972C11.7775 -0.0906574 12.3654 -0.0906574 12.728 0.271972C13.0907 0.634602 13.0907 1.22254 12.728 1.58517L7.8132 6.5L12.728 11.4148C13.0907 11.7775 13.0907 12.3654 12.728 12.728C12.3654 13.0907 11.7775 13.0907 11.4148 12.728L6.5 7.8132L1.58517 12.728C1.22254 13.0907 0.634602 13.0907 0.271972 12.728C-0.0906574 12.3654 -0.0906574 11.7775 0.271972 11.4148L5.1868 6.5L0.271972 1.58517C-0.0906574 1.22254 -0.0906574 0.634602 0.271972 0.271972Z"/>
                        </svg>
                    </div>
                    <div className="popup-flex_container" style={{display:`${generatorMode["automatic"]}`,height:"68%",marginTop:"20px"}}>
                        <textarea id="account_export" className="full-text" style={{height:"400px"}} placeholder="Enter accounts in user:pass format.">
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
                        <span className="popup-section_title">Import {group.toUpperCase()} Accounts</span>
                        <svg className="window_icon" width="15" height="15" viewBox="0 0 13 13" onClick={handleCloseImport}>
                            <path d="M0.271972 0.271972C0.634602 -0.0906574 1.22254 -0.0906574 1.58517 0.271972L6.5 5.1868L11.4148 0.271972C11.7775 -0.0906574 12.3654 -0.0906574 12.728 0.271972C13.0907 0.634602 13.0907 1.22254 12.728 1.58517L7.8132 6.5L12.728 11.4148C13.0907 11.7775 13.0907 12.3654 12.728 12.728C12.3654 13.0907 11.7775 13.0907 11.4148 12.728L6.5 7.8132L1.58517 12.728C1.22254 13.0907 0.634602 13.0907 0.271972 12.728C-0.0906574 12.3654 -0.0906574 11.7775 0.271972 11.4148L5.1868 6.5L0.271972 1.58517C-0.0906574 1.22254 -0.0906574 0.634602 0.271972 0.271972Z"/>
                        </svg>
                    </div>
                    <div className="popup-flex_container" style={{display:`${generatorMode["automatic"]}`,height:"68%",marginTop:"20px"}}>
                        <textarea id="account_import" className="full-text" style={{height:"400px"}} placeholder="Enter accounts in user:pass format.">

                        </textarea>
                    </div>
                </div>
                <div className="button_group" style={{width:"100%",justifyContent:"flex-end",marginTop:"10px"}}>
                    <Button color="#15BABE" text="Import" width="98px" clicked={confirmImportAccounts} />
                </div>
            </div>
            </Fade>
        </Modal>






        <Modal
            className={classes.modal}
            open={openGenerate}
            onClose={handleCloseGenerate}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
            timeout: 500,
            }}
        >
            <Fade in={openGenerate}>
            <div className={classes.paper}>

                <div className="popup-container" style={{width:"520px",height:"550px"}}>
                    <div className="popup-header" style={{marginBottom:"20px"}}>
                        <span className="popup-section_title">Generate Accounts - [{group.toUpperCase()}]</span>
                        <svg className="window_icon" width="15" height="15" viewBox="0 0 13 13" onClick={handleCloseGenerate}>
                            <path d="M0.271972 0.271972C0.634602 -0.0906574 1.22254 -0.0906574 1.58517 0.271972L6.5 5.1868L11.4148 0.271972C11.7775 -0.0906574 12.3654 -0.0906574 12.728 0.271972C13.0907 0.634602 13.0907 1.22254 12.728 1.58517L7.8132 6.5L12.728 11.4148C13.0907 11.7775 13.0907 12.3654 12.728 12.728C12.3654 13.0907 11.7775 13.0907 11.4148 12.728L6.5 7.8132L1.58517 12.728C1.22254 13.0907 0.634602 13.0907 0.271972 12.728C-0.0906574 12.3654 -0.0906574 11.7775 0.271972 11.4148L5.1868 6.5L0.271972 1.58517C-0.0906574 1.22254 -0.0906574 0.634602 0.271972 0.271972Z"/>
                        </svg>
                    </div>
                    <div className={classes.root}>
                        <div className={classes.tabViewer}>
                            <AntTabs value={tabValue} onChange={handleTabChange}>
                                <AntTab label="Automatic" />
                                <AntTab label="Manual" />
                                
                                <AntTab label="Profiles" />
                                <AntTab label="Captcha Gmails" />

                            </AntTabs>
                            <Typography className={classes.padding} />
                        </div>
                    </div>

                    <div className="popup-flex_container" style={{display:`${generatorMode["automatic"]}`,height:"68%",marginTop:"20px"}}>
                        <p className="popup-text_small-main" style={{margin:"0 30px 0 30px"}}>Generate accounts fully automatically, with no manual input. </p>
                        <p className="popup-text_small-light" style={{margin:"0 50px 0 50px"}}> * Please ensure that your catchalls are properly linked to your collector email (on PhotonTools dashboard).</p>
                        <p className="popup-text_small-light" style={{margin:"0 50px 0 50px"}}> * For some websites, it is required to top up your balance on the PhotonTools dashboard, in order to verify SMS, and to solve captchas.</p>

                        <div className="popup-flex_container" style={{width:"88%",margin:"20px 6% 0 6%"}}>
                            <div className="popup-flex_half" style={{width:"48%"}}>
                                <p className="popup-text_small-main" style={{marginBottom:"8px"}}>Catchall settings:</p>

                                <TextField
                                    name="manualCatchall"
                                    className={classes.inputFull}
                                    label="Enter catchall"
                                    value={generatorConfig.manualCatchall}
                                    onChange={handleGeneratorConfigChange}
                                    variant="outlined"
                                    margin="dense"
                                    placeholder="@email.com"
                                >
                                </TextField>

                                <div className="checkbox_container" style={{width:"190px",marginLeft:"0",marginTop:"30px"}}>
                                    <Switch 
                                        checked={generatorConfig.automaticEmail} 
                                        value={generatorConfig.automaticEmail}
                                        onChange={handleGeneratorConfigChange} 
                                        name="automaticEmail" 
                                        color="secondary"
                                    />
                                    <span className="checkbox_container-text" style={{fontSize:"12pt"}}>Auto verify email</span>
                                </div>

                                <div className="checkbox_container" style={{width:"190px",marginLeft:"0"}}>
                                    <Switch 
                                        checked={generatorConfig.automaticPhone} 
                                        value={generatorConfig.automaticPhone}
                                        onChange={handleGeneratorConfigChange} 
                                        name="automaticPhone" 
                                        color="secondary"
                                    />
                                    <span className="checkbox_container-text" style={{fontSize:"12pt"}}>Auto verify phone</span>
                                </div>

                                <TextField
                                    name="amount"
                                    className={classes.inputHalf}
                                    label="Amount"
                                    value={generatorConfig.amount}
                                    onChange={handleGeneratorConfigChange}
                                    inputProps={{ maxLength: 3 }}
                                    variant="outlined"
                                    margin="dense"
                                >
                                </TextField>
                            </div>

                            <div className="popup-flex_half" style={{width:"48%",overflow:"hidden"}}>
                            
                                <p className="popup-text_small-main" style={{marginBottom:"8px"}}>Configure your settings:</p>
                                <TextField
                                    select
                                    name="proxyGroup"
                                    className={classes.inputFull}
                                    label="Enter Proxy Group"
                                    value={generatorConfig.proxyGroup}
                                    onChange={handleGeneratorConfigChange}
                                    variant="outlined"
                                    margin="dense"
                                >
                                    {proxies["groups"].map((group,index) => (
                                        <MenuItem key={index} value={index}>
                                            {group["name"]}
                                        </MenuItem>
                                        ))}
                                </TextField>
                                <div className="checkbox_container" style={{width:"190px",marginLeft:"0",marginTop:"30px"}}>
                                    <Switch 
                                        checked={generatorConfig.retryTasks} 
                                        value={generatorConfig.retryTasks}
                                        onChange={handleGeneratorConfigChange} 
                                        name="retryTasks" 
                                        color="secondary"
                                    />
                                    <span className="checkbox_container-text" style={{fontSize:"12pt"}}>Retry Tasks</span>
                                </div>
                                <div className="checkbox_container" style={{width:"190px",marginLeft:"0"}}>
                                    <Switch 
                                        checked={generatorConfig.randomPassword} 
                                        value={generatorConfig.randomPassword}
                                        onChange={handleGeneratorConfigChange} 
                                        name="randomPassword" 
                                        color="secondary"
                                    />
                                    <span className="checkbox_container-text" style={{fontSize:"12pt"}}>Random Password</span>
                                </div>
                                <TextField
                                    disabled={generatorConfig.randomPassword}
                                    name="password"
                                    className={classes.inputFull}
                                    label="Enter Password"
                                    value={generatorConfig.password}
                                    onChange={handleGeneratorConfigChange}
                                    variant="outlined"
                                    margin="dense"
                                >
                                </TextField>
                                <div style={{height:"20px"}}></div>
            
                            </div>

                        </div>

                    </div>

                    <div className="popup-flex_container" style={{display:`${generatorMode["manual"]}`,height:"68%",marginTop:"20px"}}>
                        <p className="popup-text_small-main" style={{margin:"0 30px 0 30px"}}>Input your desired emails, and generate accounts manually.</p>
                        <p className="popup-text_small-light" style={{margin:"0 50px 0 50px"}}> * Some accounts require OTP via SMS or Email (manually entered).</p>
                        <p className="popup-text_small-light" style={{margin:"0 50px 0 50px"}}> * Captchas will only be auto solved if enough balance is on your PhotonTools dashboard.</p>
                        <div className="popup-flex_container" style={{width:"88%",margin:"20px 6% 0 6%"}}>
                            <div className="popup-flex_half" style={{width:"48%"}}>


                                <p className="popup-text_small-main" style={{marginBottom:"16px"}}>Enter your emails here:</p>
                                <textarea id="generatorEmailList" className="full-text" placeholder="username@email.com" style={{height:"270px",fontSize:"11pt"}}>

                                </textarea>

                            </div>


                            <div className="popup-flex_half" style={{width:"48%",overflow:"hidden"}}>
                            
                                <p className="popup-text_small-main" style={{marginBottom:"8px"}}>Configure your settings:</p>
                                <TextField
                                    select
                                    name="proxyGroup"
                                    className={classes.inputFull}
                                    label="Enter Proxy Group"
                                    value={generatorConfig.proxyGroup}
                                    onChange={handleGeneratorConfigChange}
                                    variant="outlined"
                                    margin="dense"
                                >
                                    {proxies["groups"].map((group,index) => (
                                        <MenuItem key={index} value={index}>
                                            {group["name"]}
                                        </MenuItem>
                                        ))}
                                </TextField>
                                <div className="checkbox_container" style={{width:"190px",marginLeft:"0",marginTop:"30px"}}>
                                    <Switch 
                                        checked={generatorConfig.retryTasks} 
                                        value={generatorConfig.retryTasks}
                                        onChange={handleGeneratorConfigChange} 
                                        name="retryTasks" 
                                        color="secondary"
                                    />
                                    <span className="checkbox_container-text" style={{fontSize:"12pt"}}>Retry Tasks</span>
                                </div>
                                <div className="checkbox_container" style={{width:"190px",marginLeft:"0"}}>
                                    <Switch 
                                        checked={generatorConfig.randomPassword} 
                                        value={generatorConfig.randomPassword}
                                        onChange={handleGeneratorConfigChange} 
                                        name="randomPassword" 
                                        color="secondary"
                                    />
                                    <span className="checkbox_container-text" style={{fontSize:"12pt"}}>Random Password</span>
                                </div>
                                <TextField
                                    disabled={generatorConfig.randomPassword}
                                    name="password"
                                    className={classes.inputFull}
                                    label="Enter Password"
                                    value={generatorConfig.password}
                                    onChange={handleGeneratorConfigChange}
                                    variant="outlined"
                                    margin="dense"
                                >
                                </TextField>
                                <div style={{height:"20px"}}></div>
                            </div>

                        </div>
                        

                    </div>

                    <div className="popup-flex_container" style={{display:`${generatorMode["profiles"]}`,height:"68%",marginTop:"20px"}}>
                        <p className="popup-text_small-main" style={{margin:"0 30px 0 30px"}}>Generate accounts from billing profiles.</p>
                        <p className="popup-text_small-light" style={{margin:"0 50px 0 50px"}}> * Some accounts require OTP via SMS or Email (manually entered).</p>
                        <p className="popup-text_small-light" style={{margin:"0 50px 0 50px"}}> * Captchas will only be auto solved if enough balance is on your PhotonTools dashboard.</p>
                        <div className="popup-flex_container" style={{width:"88%",margin:"20px 6% 0 6%"}}>
                            <div className="popup-flex_half" style={{width:"48%",overflow:"hidden"}}>


                                <p className="popup-text_small-main" style={{marginBottom:"8px"}}>Select your profiles here:</p>
                                <TextField
                                    select
                                    name="profileGroup"
                                    className={classes.inputFull}
                                    label="Enter Profile Group"
                                    value={generatorConfig.profileGroup}
                                    onChange={handleGeneratorConfigChange}
                                    variant="outlined"
                                    margin="dense"
                                >
                                    {profiles["groups"].map((group,index) => (
                                        <MenuItem key={index} value={index}>
                                            {group["name"]}
                                        </MenuItem>
                                        ))}
                                </TextField>

                                <TextField
                                    name="amount"
                                    className={classes.inputHalf}
                                    label="Amount"
                                    value={generatorConfig.amount}
                                    onChange={handleGeneratorConfigChange}
                                    inputProps={{ maxLength: 3 }}
                                    variant="outlined"
                                    margin="dense"
                                >
                                </TextField>
                            </div>


                            <div className="popup-flex_half" style={{width:"48%",overflow:"hidden"}}>
                            
                                <p className="popup-text_small-main" style={{marginBottom:"8px"}}>Configure your settings:</p>
                                <TextField
                                    select
                                    name="proxyGroup"
                                    className={classes.inputFull}
                                    label="Enter Proxy Group"
                                    value={generatorConfig.proxyGroup}
                                    onChange={handleGeneratorConfigChange}
                                    variant="outlined"
                                    margin="dense"
                                >
                                    {proxies["groups"].map((group,index) => (
                                        <MenuItem key={index} value={index}>
                                            {group["name"]}
                                        </MenuItem>
                                        ))}
                                </TextField>
                                <div className="checkbox_container" style={{width:"190px",marginLeft:"0",marginTop:"30px"}}>
                                    <Switch 
                                        checked={generatorConfig.retryTasks} 
                                        value={generatorConfig.retryTasks}
                                        onChange={handleGeneratorConfigChange} 
                                        name="retryTasks" 
                                        color="secondary"
                                    />
                                    <span className="checkbox_container-text" style={{fontSize:"12pt"}}>Retry Tasks</span>
                                </div>
                                <div className="checkbox_container" style={{width:"190px",marginLeft:"0"}}>
                                    <Switch 
                                        checked={generatorConfig.randomPassword} 
                                        value={generatorConfig.randomPassword}
                                        onChange={handleGeneratorConfigChange} 
                                        name="randomPassword" 
                                        color="secondary"
                                    />
                                    <span className="checkbox_container-text" style={{fontSize:"12pt"}}>Random Password</span>
                                </div>
                                <TextField
                                    disabled={generatorConfig.randomPassword}
                                    name="password"
                                    className={classes.inputFull}
                                    label="Enter Password"
                                    value={generatorConfig.password}
                                    onChange={handleGeneratorConfigChange}
                                    variant="outlined"
                                    margin="dense"
                                >
                                </TextField>
                                <div style={{height:"20px"}}></div>

            
                            </div>

                        </div>
                    </div>

                    <div className="popup-flex_container" style={{display:`${generatorMode["captcha"]}`,height:"68%",marginTop:"20px"}}>
                    <p className="popup-text_small-main" style={{margin:"0 30px 0 30px"}}>Generate accounts from captcha farming gmails.</p>
                        <p className="popup-text_small-light" style={{margin:"0 50px 0 50px"}}> * Some accounts require OTP via SMS or Email (manually entered).</p>
                        <p className="popup-text_small-light" style={{margin:"0 50px 0 50px"}}> * Captchas will only be auto solved if enough balance is on your PhotonTools dashboard.</p>
                        <div className="popup-flex_container" style={{width:"88%",margin:"20px 6% 0 6%"}}>
                            <div className="popup-flex_half" style={{width:"48%"}}>


                                <p className="popup-text_small-main" style={{marginBottom:"8px"}}>Select the amount of captcha mails:</p>
                                <TextField
                                    name="amount"
                                    className={classes.inputHalf}
                                    label="Amount"
                                    value={generatorConfig.amount}
                                    onChange={handleGeneratorConfigChange}
                                    inputProps={{ maxLength: 3 }}
                                    variant="outlined"
                                    margin="dense"
                                >
                                </TextField>

                            </div>


                            <div className="popup-flex_half" style={{width:"48%",overflow:"hidden"}}>
                            
                                <p className="popup-text_small-main" style={{marginBottom:"8px"}}>Configure your settings:</p>
                                <TextField
                                    select
                                    name="proxyGroup"
                                    className={classes.inputFull}
                                    label="Enter Proxy Group"
                                    value={generatorConfig.proxyGroup}
                                    onChange={handleGeneratorConfigChange}
                                    variant="outlined"
                                    margin="dense"
                                >
                                    {proxies["groups"].map((group,index) => (
                                        <MenuItem key={index} value={index}>
                                            {group["name"]}
                                        </MenuItem>
                                        ))}
                                </TextField>
                                <div className="checkbox_container" style={{width:"190px",marginLeft:"0",marginTop:"30px"}}>
                                    <Switch 
                                        checked={generatorConfig.retryTasks} 
                                        value={generatorConfig.retryTasks}
                                        onChange={handleGeneratorConfigChange} 
                                        name="retryTasks" 
                                        color="secondary"
                                    />
                                    <span className="checkbox_container-text" style={{fontSize:"12pt"}}>Retry Tasks</span>
                                </div>
                                <div className="checkbox_container" style={{width:"190px",marginLeft:"0"}}>
                                    <Switch 
                                        checked={generatorConfig.randomPassword} 
                                        value={generatorConfig.randomPassword}
                                        onChange={handleGeneratorConfigChange} 
                                        name="randomPassword" 
                                        color="secondary"
                                    />
                                    <span className="checkbox_container-text" style={{fontSize:"12pt"}}>Random Password</span>
                                </div>
                                <TextField
                                    disabled={generatorConfig.randomPassword}
                                    name="password"
                                    className={classes.inputFull}
                                    label="Enter Password"
                                    value={generatorConfig.password}
                                    onChange={handleGeneratorConfigChange}
                                    variant="outlined"
                                    margin="dense"
                                >
                                </TextField>
            
                            </div>

                        </div>
                    </div>

                    
                </div>
                <div className="button_group" style={{width:"100%",justifyContent:"flex-end",marginTop:"10px"}}>
                    <Button color="#15BABE" text="Generate" width="98px" clicked={confirmGenerateAccounts} />

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
                        name="proxyGroup"
                        className={classes.inputFull}
                        label="Select Proxy Group"
                        value={generatorConfig.proxyGroup}
                        onChange={handleGeneratorConfigChange}
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

export default AccountGen;