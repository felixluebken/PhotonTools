import React, { useState, useEffect } from "react";
import './pages.css'
import '../components/panels/panels.css'

import Button from '../components/buttons/button'
import ButtonUnclickable from '../components/buttons/buttonUnclickable'
import DotTitle from '../components/titles/DotTitle'
import GroupPanel from '../components/panels/GroupPanel'
import EmptyPanel from '../components/panels/EmptyPanel'
import CardPanel from '../components/panels/CardPanelSmall'
import CardPanelEdit from '../components/panels/CardPanel'


import { makeStyles, withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Checkbox from '@material-ui/core/Checkbox';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MenuItem from "@material-ui/core/MenuItem";
import Snackbar from '@material-ui/core/Snackbar';
import {Alert, AlertTitle} from '@material-ui/lab';
import Switch from '@material-ui/core/Switch';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import LinearProgress from '@material-ui/core/LinearProgress';
import Divider from '@material-ui/core/Divider';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

const { ipcRenderer } = window.require('electron/renderer')






const GreenCheckbox = withStyles({
    root: {
      color: "#1F696B",
      padding: "0 10px 0 0",
      '&$checked': {
        color: "#1F696B",
        "& .MuiIconButton-label": {
            position: "relative",
            zIndex: 0
          },
          "& .MuiIconButton-label:after": {
            content: '""',
            left: 4,
            top: 4,
            height: 15,
            width: 15,
            position: "absolute",
            backgroundColor: "#15BABE",
            zIndex: -1
          }
      },
    },
    checked: {},
  })((props) => <Checkbox color="default" {...props} />);
const AntTabs = withStyles({
    root: {
      borderBottom: '1px solid #8B8B9E',
      width:"372px",
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

const useStyles = makeStyles((theme) => ({
    '@global': {
        '*::-webkit-scrollbar': {
          width: '12px'
        },
        '*::-webkit-scrollbar-track': {
          '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
        },
        '*::-webkit-scrollbar-thumb': {
            backgroundColor: "#0E0E14", /* color of the scroll thumb */
            borderRadius: "20px",     /* roundness of the scroll thumb */
            border: "3px solid #15151D",  /* creates padding around scroll thumb */
        },
        "*::-webkit-scrollbar-corner": { 
            '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
        }
      },
  inputHalf: {
    width:"48%",
    backgroundColor:"#15151D",
  },
  inputFull: {
    width:"100%",
    backgroundColor:"#15151D",
  },
  inputTiny: {
    width:"60px",
    backgroundColor:"#15151D",
  },
  inputSmall: {
    width:"100px",
    backgroundColor:"#15151D",
  },
  inputMedium: {
    width:"180px",
    backgroundColor:"#15151D",
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
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
  label: {
    color:"white"
  }

  },
  list: {
      backgroundColor:"#15151D",
      borderRadius:"4px",
      border:"1px solid #343444",
      marginTop:"5px",
      width:"100%",
      overflow:"scroll"
  },
  accountList: {
    backgroundColor:"#15151D",
    borderRadius:"4px",
    border:"1px solid #343444",
    marginTop:"5px",
    width:"60%",
    height:"200px",
    overflow:"scroll"
},
  listText: {
      color:"#F1F1F2"
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






let generatorMode = {
    privacy:"flex",
    eno:"none",
    stripe:"none",
    citi:"none"
}
let accountTypesDetail = {
    privacy: {
        userLabel:"Privacy Email",
        passLabel:"Privacy Password",
        userKey:"user",
        passKey:"password",
        title:"Add Privacy Account"
    },
    stripe: {
        userLabel:"Stripe Holder ID",
        passLabel:"Stripe API Key",
        userKey:"holder",
        passKey:"api",
        title:"Add Stripe Issuing Account"
    }

}
let accountTypes = [
    {
        label:"Privacy Web",
        value:"privacy"
    },
    {
        label:"Stripe Issuing",
        value:"stripe"
    }
]




let cards = [];
let cardItems = <></>;
let groupItems = <></>;
let groupLength = 0;
let cardLength = 0;
let totalCardLength = 0;

let generatorCurrentMode = "privacy"
let generatorCurrentLabel = "Privacy"

let currentlyLoggingIn = false;
let currentlyLoggedIn = false;
let currentlyGenerating = false;
let progressDisplay = "none";
let cardGenStatus = "Inactive";
let cardGenOtpDisplay = "none";
let genCards = [];
var genCardSelector = [];

let cardGroupLength = 0;
let profileGroupLength = 0;


let profiles = {"groups":[{"name":"Empty","profiles":[]}]};

ipcRenderer.send('getCardGroups')
ipcRenderer.on('getCardGroups', (event,arg) => {
    ipcRenderer.removeAllListeners('getCardGroups')
    cards = arg.cards
})







ipcRenderer.send('getProfiles')
ipcRenderer.on('returnProfiles', (event,arg) => {
    ipcRenderer.removeAllListeners('returnProfiles');
    profiles = arg.profiles
})




function CardGen(props) {

    const classes = useStyles();
    const forceUpdate = useForceUpdate()

    const [group, setGroup] = React.useState(0) // group index
    const handleGroupChange = (index) => {
        setGroup(index);
    };

    ipcRenderer.send('getCardGroups')
    ipcRenderer.on('getCardGroups', (event,arg) => {
        ipcRenderer.removeAllListeners('getCardGroups')
        cards = arg.cards
    })

    ipcRenderer.send('getCardGenStatus')
    ipcRenderer.on('getCardGenStatus', (event,arg) => {
        ipcRenderer.removeAllListeners('getCardGenStatus')
        cardGenStatus = arg.status[1]
        genCards = arg.cards
        if(arg.cards.length !== genCardSelector.length) {
            updateGenCardSelector(arg.cards)

        }

        if(!currentlyLoggingIn && !currentlyGenerating && !currentlyLoggedIn) return;



        if(arg.status[0] === 3 || arg.status[0] === "3") cardGenOtpDisplay = "flex"
        else cardGenOtpDisplay = "none"

        if(arg.status[0] === 4 || arg.status[0] === "4" || arg.status[0] === 6 || arg.status[0] === "6") {
            currentlyLoggedIn = true;
            currentlyLoggingIn = false;
            currentlyGenerating = false;
            
            progressDisplay = "none";
        }
        else if(arg.status[0] === 7 || arg.status[0] === "7") {
            currentlyLoggedIn = true;
            currentlyLoggingIn = false;
            currentlyGenerating = true;
        }
        else {
            if(arg.status[0] === 0 || arg.status[0] === "0") progressDisplay = "none"
            else if(arg.status[0] === 9 || arg.status[0] === "9") progressDisplay = "none"
            else if(arg.status[0] === 10 || arg.status[0] === "10") progressDisplay = "none"
            else progressDisplay = "block";
        }
    })

    ipcRenderer.send('getProfiles')
    ipcRenderer.on('returnProfiles', (event,arg) => {
        ipcRenderer.removeAllListeners('returnProfiles');
        profiles = arg.profiles
    })


    const [tabValue, setTabValue] = React.useState(0);
    const handleTabChange = (event, newValue) => {
        if(currentlyLoggingIn || currentlyLoggedIn) {
            handleOpenSnackbar("Please log out first","warning")
            return
        }
        switch(newValue) {
            case 0:
                generatorMode["privacy"] = "flex";
                generatorMode["eno"] = "none";
                generatorMode["stripe"] = "none";
                generatorMode["citi"] = "none";
                
                generatorCurrentMode = "privacy";
                generatorCurrentLabel = "Privacy";

                cardGeneratorConfig.limitType = "0";
                break;
            case 1:
                generatorMode["privacy"] = "none";
                generatorMode["eno"] = "flex";
                generatorMode["stripe"] = "none";
                generatorMode["citi"] = "none";

                generatorCurrentMode = "capital_one";
                generatorCurrentLabel = "Eno";
                break;
            case 2:
                generatorMode["privacy"] = "none";
                generatorMode["eno"] = "none";
                generatorMode["stripe"] = "flex";
                generatorMode["citi"] = "none";

                generatorCurrentMode = "stripe";
                generatorCurrentLabel = "Stripe";


                cardGeneratorConfig.limitType = "per_authorization";
                break;
            case 3:
                generatorMode["privacy"] = "none";
                generatorMode["eno"] = "none";
                generatorMode["stripe"] = "none";
                generatorMode["citi"] = "flex";

                generatorCurrentMode = "citi";
                generatorCurrentLabel = "Citi";
                break;
        }




        setTabValue(newValue);



    };


    const [seconds, setSeconds] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
          setSeconds(seconds => seconds + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);



    // ADD GROUP
    const [groupAdd, setGroupAdd] = React.useState("")
    const handleGroupAddChange = (event) => {setGroupAdd(event.target.value)};
    const handleGroupAdd = () => {
        setGroupAdd("")
        handleOpenAddGroup();
    }
    const confirmGroupAdd = () => {
        console.log("CONFIRMING")
        ipcRenderer.send('addCardGroup', {name:groupAdd})
        ipcRenderer.on('addCardGroup', (event,arg) => {
            cards = arg.cards
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
            groupName: cards["groups"][index]["name"]
        });
        setOpenEditGroup(true)
    }
    const confirmGroupEdit = () => {
        ipcRenderer.send('editCardGroup', {index:groupEdit.groupIndex,name:groupEdit.groupName})
        ipcRenderer.on('editCardGroup', (event,arg) => {
            cards = arg.cards
            handleCloseEditGroup()
        })
    };

    const [openEditGroup, setOpenEditGroup] = React.useState(false);
    const handleOpenEditGroup = () => {setOpenEditGroup(true);};
    const handleCloseEditGroup = () => {setOpenEditGroup(false);};





    // DELETE GROUP
    const [groupDelete, setGroupDelete] = React.useState(0)
    const handleGroupDelete = (index) => {
        setGroupDelete(index);
        handleOpenDeleteGroup();
    }
    const confirmGroupDelete = (index) => {
        ipcRenderer.send('deleteCardgroup', {index:groupDelete})
        ipcRenderer.on('deletedCardGroup', (event,arg) => {
            console.log("RECEIVED")
            cards = arg.cards
            forceUpdate()
        })
        setGroup(0)
        handleCloseDeleteGroup();
        
    }

    const [openDeleteGroup, setOpenDeleteGroup] = React.useState(false);
    const handleOpenDeleteGroup = () => {setOpenDeleteGroup(true);};
    const handleCloseDeleteGroup = () => {setOpenDeleteGroup(false);}



    const [cardSelector, setCardSelector] = React.useState([])
    const [cardSelectorCheckAll,setCardSelectorCheckAll] = React.useState(true)
    const handleCardSelectorChange = (value) => {

        for(const each of cardSelector){
            if(each.id == value){
                if(each.checked) {
                    each.checked = false
                }
                else {
                    each.checked = true
                }

            }
        }
        

        forceUpdate()
    }
    const handleCardSelectorCheckAllChange = (event) => {
        console.log("CHECKING ALL")



        for(const each of cardSelector) {
            if(cardSelectorCheckAll) {
                each.checked = false;
            }
            else {
                each.checked = true;
            }
            
        }
        if(cardSelectorCheckAll) {
            setCardSelectorCheckAll(false)
        }
        else {
            setCardSelectorCheckAll(true)
        }
        
    }
    const handleCardSelectorStart = () => {
        let cardsInit = cards["groups"][group]["cards"]
        for(var i = 0; i < cardsInit.length; i++) {
            cardSelector.push({
                id:i,
                name:cardsInit[i]["name"],
                number:cardsInit[i]["no"],
                month:cardsInit[i]["mo"],
                year:cardsInit[i]["yr"],
                cvv:cardsInit[i]["cvv"],
                checked:true})
        }
    }
    const handleCardSelectorClose = () => {
        setCardSelector([])
    }
    const getCheckedInCardSelector = () => {
        let cardSelection = [];
        for(const each of cardSelector) {
            if(each.checked) {
                cardSelection.push(each.id)
            }
        }
        return cardSelection;
    }


    //MOVE CARDS
    const [openMoveCards, setOpenMoveCards] = React.useState(false);
    const [targetMoveGroup, setTargetMoveGroup] = React.useState(0);
    const handleTargetMoveGroupChange = (event) => {
        setTargetMoveGroup(
            event.target.value
        );
    };
    const handleOpenMoveCards = () => {

        handleCardSelectorStart()
        setOpenMoveCards(true);
    };
    const handleCloseMoveCards = () => {
        handleCardSelectorClose()
        setOpenMoveCards(false);
    };
    const handleMoveCards = () => {
        let moveCardsInit = cards["groups"][group]["cards"]
        if(moveCardsInit.length === 0) {
            handleOpenSnackbar("No cards to move","warning");
            return;
        }

        handleOpenMoveCards()
    }
    const confirmMoveProfile = () => {
        ipcRenderer.send('moveCards', {
            group:group,
            newGroup:targetMoveGroup,
            cards:getCheckedInCardSelector()
        })
        ipcRenderer.on('moveCards', (event,arg) => {
            
            cards = arg.cards
            handleCloseMoveCards();
            handleOpenSnackbar("Cards moved to specified group","success")
        })
        
    }

    
    //DELETE CARDS
    const [openDeleteCards, setOpenDeleteCards] = React.useState(false);
    const handleOpenDeleteCards = () => {

        handleCardSelectorStart()
        setOpenDeleteCards(true);
    };
    const handleCloseDeleteCards = () => {
        handleCardSelectorClose()
        setOpenDeleteCards(false);
    };
    const handleDeleteCards = () => {
        let cardsInit = cards["groups"][group]["cards"]
        if(cardsInit.length === 0) {
            handleOpenSnackbar("No cards to duplicate","warning");
            return;
        }

        handleOpenDeleteCards()
    }
    const confirmDeleteCards = () => {
        
        ipcRenderer.send('deleteCards', {
            group:group,
            cards:getCheckedInCardSelector()
        })
        ipcRenderer.on('deleteCards', (event,arg) => {
            cards = arg.cards
            console.log("CLOSING")
            handleCloseDeleteCards();
            handleOpenSnackbar("Specified cards deleted","success")
        })
        
    }



    //EDIT CARD
    const [openEditCard, setOpenEditCard] = React.useState(false);
    const [editCardName, setEditCardName] = React.useState("");
    const [editCardIndex, setEditCardIndex] = React.useState(0);
    const [editCardInfo, setEditCardInfo] = React.useState({
        cardNumber:"",
        cardMonth:"",
        cardYear:"",
        cardType:"",
        cvv:""
    })
    const handleOpenEditCard = (index) => {
        setEditCardIndex(index)
        
        setEditCardName(cards["groups"][group]["cards"][index]["name"])
        setEditCardInfo({
            cardNumber:cards["groups"][group]["cards"][index]["no"],
            cardMonth:cards["groups"][group]["cards"][index]["mo"],
            cardYear:cards["groups"][group]["cards"][index]["yr"],
            cardType:cards["groups"][group]["cards"][index]["type"],
            cvv:cards["groups"][group]["cards"][index]["cvv"]
        })

        setOpenEditCard(true)
    }
    const handleCloseEditCard = () => {
        setOpenEditCard(false)
    }
    const handleEditCardNameChange = (event) => {
        setEditCardName(event.target.value)
    }
    const confirmEditCard = () => {
        ipcRenderer.send('editCardName', {
            group:group,
            card:editCardIndex,
            name:editCardName
        })
        ipcRenderer.on('editCardName', (event,arg) => {
            cards = arg.cards
            handleCloseEditCard();
        })
    }
    const confirmDeleteCard = () => {
        ipcRenderer.send('deleteCards', {
            group:group,
            cards:[editCardIndex]
        })
        ipcRenderer.on('deleteCards', (event,arg) => {
            cards = arg.cards
            handleCloseEditCard();
        })
    }



    //GENERATE CARDS
    const [openGenerateCards, setOpenGenerateCards] = React.useState(false);
    const [accountSelector,setAccountSelector] = React.useState(0);
    const [cardGeneratorConfig,setCardGeneratorConfig] =  React.useState({
        name:"",
        limit:"",
        limitType:"0",
        verifyCode:"",
        amount:""
    });
    const [cardGeneratorState,setCardGeneratorState] = React.useState({
        status:"",
        cards:"",
        verifyCodeDisplay:""

    })

    const handleCardGeneratorConfigChange = (event) => {setCardGeneratorConfig({ ...cardGeneratorConfig, [event.target.name]: event.target.value });}
    const handleAccountSelectorChange = (event) => {
        if(currentlyLoggingIn || currentlyLoggedIn) {
            handleOpenSnackbar("Please log out first before switching accounts","Warning")
            return;
        }
        setAccountSelector(event.target.value)
    } 

    const handleOpenGenerateCards = () => {
        setOpenGenerateCards(true)
    }
    const handleCloseGenerateCards = () => {
        currentlyLoggingIn = false;
        currentlyLoggedIn = false;
        currentlyGenerating = false;
        cardGenOtpDisplay = "none";
        progressDisplay = "none";
        cardGenStatus = "Inactive"
        setCardGeneratorConfig({
            name:"",
            limit:"",
            limitType:"0",
            verifyCode:"",
            amount:""
        })
        ipcRenderer.send('closeCardGenBrowser');
        setOpenGenerateCards(false);
        handleOpenSnackbar("Logged out of " + generatorCurrentMode, "success");
    }

    const handleLogin = () => {
        currentlyLoggingIn = true;
        progressDisplay = "block"
        handleOpenSnackbar("Logging into " + generatorCurrentMode, "info")


        if(generatorCurrentMode === "privacy") {
            ipcRenderer.send('cardGenSignin', {
                type:"privacy",
                user:cards["accounts"]["privacy"][accountSelector]["user"],
                pass:cards["accounts"]["privacy"][accountSelector]["password"]
            })
        }
        else if(generatorCurrentMode === "stripe") {

            console.log(cards["accounts"]["stripe"][accountSelector]["api"])
            console.log(cards["accounts"]["stripe"][accountSelector]["holder"])

            ipcRenderer.send('cardGenSignin', {
                type:"stripe",
                api:cards["accounts"]["stripe"][accountSelector]["api"],
                id:cards["accounts"]["stripe"][accountSelector]["holder"]
            })
        }

    }
    const handleLogout = () => {
        currentlyLoggingIn = false;
        currentlyLoggedIn = false;
        currentlyGenerating = false;
        cardGenOtpDisplay = "none";
        progressDisplay = "none";
        ipcRenderer.send('closeCardGenBrowser')
        handleOpenSnackbar("Logged out of " + generatorCurrentMode, "success")
        
    }

    const handleGenerate = () => {
        if(isNaN(cardGeneratorConfig.limit)) {
            handleOpenSnackbar("Please enter a valid limit","Error")
            return;
        }
        if(isNaN(cardGeneratorConfig.amount)) {
            handleOpenSnackbar("Please enter a valid amount","Error")
            return;
        }
        if(!currentlyLoggedIn) {
            handleOpenSnackbar("Please log in first","warning")
            return;
        }
        if(currentlyLoggingIn) {
            handleOpenSnackbar("Please wait until generator logged in","warning")
            return;
        }
        if(currentlyGenerating) {
            handleOpenSnackbar("Please wait until card generation is complete","warning")
            return;
        }



        currentlyGenerating = true;
        if(generatorCurrentMode === "privacy") {
            ipcRenderer.send('privacyGenerate', {
                name:cardGeneratorConfig.name,
                limit:cardGeneratorConfig.limit,
                type:cardGeneratorConfig.limitType,
                amount:cardGeneratorConfig.amount
            })
        }
        else if(generatorCurrentMode === "stripe") {
            ipcRenderer.send('stripeGenerate', {
                name:cardGeneratorConfig.name,
                limit:cardGeneratorConfig.limit,
                type:cardGeneratorConfig.limitType,
                amount:cardGeneratorConfig.amount
            })
        }

        handleOpenSnackbar("Generating " + cardGeneratorConfig.amount + " " + generatorCurrentLabel + " cards", "info")
    }

    const handleImportGenCards = () => {
        if(!currentlyLoggedIn) {
            handleOpenSnackbar("Please log in first","warning")
            return;
        }
        if(currentlyLoggingIn) {
            handleOpenSnackbar("Please wait until generator logged in","warning")
            return;
        }
        if(currentlyGenerating) {
            handleOpenSnackbar("Please wait until card generation is complete","warning")
            return;
        }

        var selectedCards = getCheckedInGenCardSelector()

        console.log(selectedCards)
        if(selectedCards.length === 0) {
            handleOpenSnackbar("Please make a selection first", "info")
            return
        }

        ipcRenderer.send('importGenCards', {
            group:group,
            values:selectedCards
        })
        handleOpenSnackbar(selectedCards.length + " imported into group " + group, "success")
    } 

    const handleDeleteGenCards = () => {
        if(!currentlyLoggedIn) {
            handleOpenSnackbar("Please log in first","warning")
            return;
        }
        if(currentlyLoggingIn) {
            handleOpenSnackbar("Please wait until generator logged in","warning")
            return;
        }
        if(currentlyGenerating) {
            handleOpenSnackbar("Please wait until card generation is complete","warning")
            return;
        }


        var selectedCards = getCheckedInGenCardSelector()

        console.log(selectedCards)
        if(selectedCards.length === 0) {
            handleOpenSnackbar("Please make a selection first", "info")
            return
        }

        ipcRenderer.send('deleteImportGenCards', {
            type:generatorCurrentMode,
            values:selectedCards
        })
        handleOpenSnackbar("Deleting " + selectedCards.length + " cards from " + generatorCurrentLabel, "info")
    } 


    const submitPrivacyTFA = () => {
        ipcRenderer.send('privacyTFA', {
            code:cardGeneratorConfig.verifyCode
        })
    }



    const [genCardSelectorCheckAll,setGenCardSelectorCheckAll] = React.useState(true)
    const handleGenCardSelectorChange = (value) => {

        for(const each of genCardSelector){
            if(each.id == value){
                if(each.checked) {
                    each.checked = false
                }
                else {
                    each.checked = true
                }

            }
        }
        

        forceUpdate()
    }
    const handleGenCardSelectorCheckAllChange = (event) => {
        console.log("CHECKING ALL")



        for(const each of genCardSelector) {
            if(genCardSelectorCheckAll) {
                each.checked = false;
            }
            else {
                each.checked = true;
            }
            
        }
        if(genCardSelectorCheckAll) {
            setGenCardSelectorCheckAll(false)
        }
        else {
            setGenCardSelectorCheckAll(true)
        }
        
    }
    const updateGenCardSelector = (updatedGenCards) => {
        //console.log(updatedGenCards)
        //setGenCardSelector([])
        genCardSelector = []
        for(var i = 0; i < updatedGenCards.length; i++) {
            genCardSelector.push({id:i,name:updatedGenCards[i]["name"],no:updatedGenCards[i]["no"],checked:true})
        }
        //console.log(genCardSelector)
    }
    const resetGenCardSelector = () => {
        genCardSelector = [];
        //setGenCardSelector([])
    }
    const getCheckedInGenCardSelector = () => {
        let cardSelection = [];
        for(const each of genCardSelector) {
            if(each.checked) {
                cardSelection.push(each.id)
            }
        }
        return cardSelection;
    }


    //MANAGE ACCOUNTS
    const [openManageAccounts,setOpenManageAccounts] = React.useState(false);
    const [manageAccountType,setManageAccountType] = React.useState("privacy");
    const handleManageAccountTypeChange = (event) => {
        setManageAccountType(event.target.value)
    };
    const handleOpenManageAccounts = () => {
        setManageAccountType("privacy");
        setOpenManageAccounts(true);
    }
    const handleCloseManageAccounts = () => {
        setOpenManageAccounts(false)
    }

    const [addCardAccount,setAddCardAccount] = React.useState({
        username:"",
        password:""
    })
    const handleAddCardAccountChange = (event) => {setAddCardAccount({ ...addCardAccount, [event.target.name]: event.target.value });};
    const addCardAccountConfirm = () => {
        if(manageAccountType === "stripe") {
            ipcRenderer.send('addCardAccount', {
                type:manageAccountType,
                user:addCardAccount.password,
                password:addCardAccount.username
            })
            ipcRenderer.on('addCardAccount', (event,arg) => {
                cards = arg.cards
                setAddCardAccount({
                    username:"",
                    password:""
                })
                handleOpenSnackbar("Successfully added " + manageAccountType + " account","success")
                forceUpdate()
            })
        }
        else {
            ipcRenderer.send('addCardAccount', {
                type:manageAccountType,
                user:addCardAccount.username,
                password:addCardAccount.password
            })
            ipcRenderer.on('addCardAccount', (event,arg) => {
                cards = arg.cards
                setAddCardAccount({
                    username:"",
                    password:""
                })
                handleOpenSnackbar("Successfully added " + manageAccountType + " account","success")
                forceUpdate()
            })
        }


    }
    const removeCardAccount = (index) => {
        console.log(index)
        
        ipcRenderer.send('removeCardAccount', {
            type:manageAccountType,
            account:index
        })
        ipcRenderer.on('removeCardAccount', (event,arg) => {
            cards = arg.cards
            handleOpenSnackbar("Successfully removed " + manageAccountType + " account","info")
            forceUpdate();
        })
        
    }


    //EXPORT CARDS

    const [openExportCards,setOpenExportCards] = React.useState(false);
    const [exportConfig,setExportConfig] = React.useState({
        cardGroup:0,
        profileGroup:0,
        reuseCards:false,
        duplicateProfileGroup:false
    })
    const handleOpenExportCards = () => {
        if(cards["groups"].length === 0) {
            handleOpenSnackbar("No card group to export","warning")
            return
        }
        if(profiles["groups"].length === 0) {
            handleOpenSnackbar("No profile group to export to","warning")
            return
        }

        setOpenExportCards(true)
    }
    const handleCloseExportCards = () => {
        setOpenExportCards(false)
    }
    const confirmExportCards = () => {
        if(cards["groups"][exportConfig.cardGroup]["cards"].length === 0) {
            handleOpenSnackbar("No cards to export","warning")
            return
        }
        if(profiles["groups"][exportConfig.profileGroup]["profiles"].length === 0) {
            handleOpenSnackbar("No profiles to export","warning")
            return
        }

        var cardValues = []
        var exportProfiles = profiles["groups"][exportConfig.profileGroup]["profiles"]
        var exportCards = cards["groups"][exportConfig.cardGroup]["cards"]

        for(var i = 0; i < exportCards.length; i++) {
            cardValues.push(i)
        }

        ipcRenderer.send('exportCards', {
            reuse:exportConfig.reuseCards,
            duplicateProfiles:exportConfig.duplicateProfileGroup,
            cardValues:cardValues,
            cardGroup:exportConfig.cardGroup,
            profileGroup:exportConfig.profileGroup
        })

        //TEST

        handleOpenSnackbar("Exported cards to profile group","success")
        handleCloseExportCards()
        return


    }
    const handleExportConfigChange = (event) => {

        if(event.target.name === "reuseCards" || event.target.name === "duplicateProfileGroup") {
            setExportConfig({ ...exportConfig, [event.target.name]: event.target.checked });
        }
        else {
            setExportConfig({ ...exportConfig, [event.target.name]: event.target.value });
        }
        
    };



    const [snackBarOpen, setOpenSnackBar] = React.useState(false);
    const [snackBarText,setSnackBarText] = React.useState('Success!');
    const [snackBarSeverity,setSnackBarSeverity] = React.useState('error');

    const handleOpenSnackbar = (text,severity) => {
        ipcRenderer.send('addNotification', {
            type:severity.toUpperCase(),
            title:"CARDS",
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


        if(cards["groups"].length === 0) {
            groupItems = <EmptyPanel
                type="cards"
                text="Add a group"
            />

            cardItems = <EmptyPanel
                type="cards"
                text="Import some cards"
            />

            totalCardLength = 0;
            cardGroupLength = 0;
            
        }
        else {
            cardGroupLength = cards["groups"][exportConfig.cardGroup]["cards"].length
            totalCardLength = 0;

            for(var i = 0; i < cards["groups"].length; i++) {
                totalCardLength += cards["groups"][i]["cards"].length
            }


            groupItems = cards["groups"].map((cardGroup,index) =>  
                <GroupPanel
                    name={cardGroup["name"]}
                    type="cards"
                    content={cardGroup["cards"]}
                    index={index}
                    allowModify={true}
        
                    switchGroup={group => handleGroupChange(group)} 
                    editGroup={group => handleGroupEdit(group)}
                    deleteGroup={group => handleGroupDelete(group)}
                />)

            if(cards["groups"][group]["cards"].length === 0) {
                cardItems = <EmptyPanel
                    type="cards"
                    text="Import some cards"
                />
            }
            else {
                cardItems = cards["groups"][group]["cards"].map((card,index) =>  
                    <CardPanel
                        name={card["name"]}
                        cardNumber={card["no"]}
                        cardType={card["type"]}
                        month={card["mo"]}
                        year={card["yr"]}
                        index={index}

                        viewCard={index => handleOpenEditCard(index)}
                    />)
            }
        }        


        if(profiles["groups"] === 0) {
            profileGroupLength = 0;
        }
        else {
            profileGroupLength = profiles["groups"][exportConfig.profileGroup]["profiles"].length
        }
        

        groupLength = cards["groups"].length
        cardLength = cards["groups"][group]["cards"].length
    }
    catch(err) {
        console.log(err)
        //groupItems = <></>
        //cardItems = <></>
    }



    return(

        <ThemeProvider theme={theme}>

            <div className="page">

            <div className="page_header">
                <div className="page_header-section">
                    <h6 className="page_title">Card Generator</h6>
                    <div className="page_subtitle-container">
                        <span className="page_subtitle">You have </span>
                        <span className="page_subtitle" style={{color:"#F1F1F2"}}>{totalCardLength} cards</span>
                        <span className="page_subtitle"> available. </span>
                    </div>
                </div>
            </div>
            <div className="page_body">
                <div className="page_body-header">
                    <div class="button_group" style={{width:"270px"}}>
                        <Button color="#15BABE" text="Manage Accounts" icon="save" clicked={handleOpenManageAccounts} />
                        <div style={{width:"10px"}} />
                        <Button color="#19C070" text="Generate" icon="timer" clicked={handleOpenGenerateCards} />
                    </div>
                    <div class="button_group" style={{width:"170px"}}>
                        <Button color="#D85059" text="Export" width="170px" clicked={handleOpenExportCards} />
                    </div>
                </div>

                <div className="page_main-body">
                    <div className="page_body-col">
                        <DotTitle color="#15BABE" title={groupLength + " GROUPS"} />
                        <div className="page_body-cols-container">
                            {groupItems}
                            <Button icon="add" color="#1D1D27" border="1px solid #343444" width="95%" clicked={handleGroupAdd} />
                        </div>
                        
                    </div>
                    <div className="page_body-col" style={{width:"67%"}}>
                        <DotTitle color="#FFC74F" title={cardLength + " CARDS"} />
                        <div className="page_body-cols-container"style={{display:"flex",flexWrap:"wrap",alignItems:"flex-start",alignContent:"flex-start",height:"calc(100% - 69px)",justifyContent:"space-between"}}>
                            {cardItems}
                        </div>
                        <div className="button_group" style={{width:"100%", height:"31px",justifyContent:"flex-end",marginTop:"12px"}}>
                            <div className="button_group" style={{width:"300px"}}>
                                <Button color="#15BABE" text="Move" clicked={handleMoveCards}/>
                                <Button color="#D85059" text="Delete" icon="delete" clicked={handleDeleteCards}/>
                            </div>
                            
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
                        <span className="popup-section_title">Edit Profile Group</span>
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
                            <span className="popup-section_title">Delete Profile Group</span>
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
                            <span className="popup-section_title">Add Profile Group</span>
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
            

            <Modal
                className={classes.modal}
                open={openExportCards}
                onClose={handleCloseExportCards}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                timeout: 500,
                }}
            >
                <Fade in={openExportCards}>
                <div className={classes.paper}>

                    <div className="popup-container" style={{width:"300px",height:"386px"}}>
                        <div className="popup-header" style={{marginBottom:"20px"}}>
                            <span className="popup-section_title">Export Cards to Profiles</span>
                            <svg className="window_icon" width="15" height="15" viewBox="0 0 13 13" onClick={handleCloseExportCards}>
                                <path d="M0.271972 0.271972C0.634602 -0.0906574 1.22254 -0.0906574 1.58517 0.271972L6.5 5.1868L11.4148 0.271972C11.7775 -0.0906574 12.3654 -0.0906574 12.728 0.271972C13.0907 0.634602 13.0907 1.22254 12.728 1.58517L7.8132 6.5L12.728 11.4148C13.0907 11.7775 13.0907 12.3654 12.728 12.728C12.3654 13.0907 11.7775 13.0907 11.4148 12.728L6.5 7.8132L1.58517 12.728C1.22254 13.0907 0.634602 13.0907 0.271972 12.728C-0.0906574 12.3654 -0.0906574 11.7775 0.271972 11.4148L5.1868 6.5L0.271972 1.58517C-0.0906574 1.22254 -0.0906574 0.634602 0.271972 0.271972Z"/>
                            </svg>
                        </div>
                        <TextField
                            select
                            name="cardGroup"
                            className={classes.inputFull}
                            label="Select Card Group"
                            value={exportConfig.cardGroup}
                            onChange={handleExportConfigChange}
                            variant="outlined"
                            margin="dense"
                        >
                            {cards["groups"].map((group,index) => (
                                <MenuItem key={index} value={index}>
                                    {group.name}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            select
                            name="profileGroup"
                            className={classes.inputFull}
                            label="Select Profile Group"
                            value={exportConfig.profileGroup}
                            onChange={handleExportConfigChange}
                            variant="outlined"
                            margin="dense"
                        >
                            {profiles["groups"].map((group,index) => (
                                <MenuItem key={index} value={index}>
                                    {group.name}
                                </MenuItem>
                            ))}
                        </TextField>

                        <div className="popup-flex_container" style={{height:"30px",marginTop:"10px",marginBottom:"5px"}}>
                            <p className="popup-section_title" style={{textAlign:"left",margin:"10px auto"}}>Cards</p>
                            <ButtonUnclickable text={cardGroupLength} color="#1D1D27" width="200px" /> 
                        </div>
                        <div className="popup-flex_container" style={{height:"32px",marginTop:"5px",marginBottom:"10px"}}>
                            <p className="popup-section_title" style={{textAlign:"left",margin:"10px auto"}}>Profiles</p>
                            <ButtonUnclickable text={profileGroupLength} color="#1D1D27" width="200px" /> 
                        </div>

                        <div className="checkbox_container" style={{width:"67%",marginTop:"30px"}}>
                            <Switch 
                                checked={exportConfig.reuseCards} 
                                value={exportConfig.reuseCards}
                                onChange={handleExportConfigChange} 
                                name="reuseCards" 
                                color="secondary"
                            />
                            <span className="checkbox_container-text" style={{fontSize:"12pt"}}>Reuse Cards</span>
                        </div>
                        <div className="checkbox_container" style={{width:"90%"}}>
                            <Switch 
                                checked={exportConfig.duplicateProfileGroup} 
                                value={exportConfig.duplicateProfileGroup}
                                onChange={handleExportConfigChange} 
                                name="duplicateProfileGroup" 
                                color="secondary"
                            />
                            <span className="checkbox_container-text" style={{fontSize:"12pt"}}>Duplicate Profile Group</span>
                        </div>

                        <div className="button_group" style={{width:"100%",justifyContent:"flex-end",marginTop:"30px"}}>
                            <Button color="#15BABE" text="Export" width="98px" clicked={confirmExportCards} />
                        </div>
                    </div>

                </div>
                </Fade>
            </Modal>

            <Modal
                className={classes.modal}
                open={openMoveCards}
                onClose={handleCloseMoveCards}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                timeout: 500,
                }}
            >
                <Fade in={openMoveCards}>
                <div className={classes.paper}>

                    <div className="popup-container" style={{width:"380px",height:"620px"}}>
                        <div className="popup-header" style={{marginBottom:"20px"}}>
                            <span className="popup-section_title">Move Cards</span>
                            <svg className="window_icon" width="15" height="15" viewBox="0 0 13 13" onClick={handleCloseMoveCards}>
                                <path d="M0.271972 0.271972C0.634602 -0.0906574 1.22254 -0.0906574 1.58517 0.271972L6.5 5.1868L11.4148 0.271972C11.7775 -0.0906574 12.3654 -0.0906574 12.728 0.271972C13.0907 0.634602 13.0907 1.22254 12.728 1.58517L7.8132 6.5L12.728 11.4148C13.0907 11.7775 13.0907 12.3654 12.728 12.728C12.3654 13.0907 11.7775 13.0907 11.4148 12.728L6.5 7.8132L1.58517 12.728C1.22254 13.0907 0.634602 13.0907 0.271972 12.728C-0.0906574 12.3654 -0.0906574 11.7775 0.271972 11.4148L5.1868 6.5L0.271972 1.58517C-0.0906574 1.22254 -0.0906574 0.634602 0.271972 0.271972Z"/>
                            </svg>
                        </div>
                        <div className="popup-flex_container" style={{height:"480px"}}>
                            <div className="popup-flex_half" style={{width:"100%"}}>
                            <div className="popup-flex_container" style={{height:"100%"}}>
                                <List className={classes.list} style={{width:"100%",marginTop:"0px",height:"94%"}} component="nav" aria-label="Bot Import" dense="True">
                                    <ListItem dense button onClick={handleCardSelectorCheckAllChange}>
                                        <ListItemIcon>
                                            <GreenCheckbox 
                                                color="secondary"
                                                checked={cardSelectorCheckAll} 
                                                />
                                        </ListItemIcon>
                                        <ListItemText primary="CHECK ALL" className={classes.listText}/>
                                    </ListItem>
                                    <Divider style={{width:"100%"}}/>
                                    {cardSelector.map( (card,index) => 
                                    <ListItem key={card["id"]} value={card["id"]} dense button onClick={() => handleCardSelectorChange(card["id"])}>
                                        <ListItemIcon>
                                            <GreenCheckbox 
                                            color="secondary"
                                            checked={card["checked"]} 
                                            
                                            value={card["id"]} 
                                            key={card["id"]}
                                            />
                                        </ListItemIcon>
                                        <ListItemText id={card["id"]} primary={"•••• " + card["number"].substring(12,16) + " - " + card["month"] + "/" + card["year"] + " - " +card["name"]} className={classes.listText}/>
                                    </ListItem>
                                    )}
                                </List>

                            </div>
                        </div>

                    </div>
                    
                    <div className="profile-flex_wrapper">
                        <TextField
                            select
                            className={classes.inputFull}
                            label="Move to"
                            value={targetMoveGroup}
                            onChange={handleTargetMoveGroupChange}
                            variant="outlined"
                            margin="dense"
                        >
                            {cards["groups"].map((group,index) => (
                                <MenuItem key={index} value={index}>
                                {group.name}
                                </MenuItem>
                            ))}

                        </TextField>
                    </div>
                    <div className="button_group" style={{width:"100%",display:"flex",justifyContent:"flex-end",marginTop:"20px"}}>
                        <Button color="#15BABE" text="Move" width="71px" clicked={() => confirmMoveProfile()} />
                    </div>
                    </div>
                </div>
                </Fade>
            </Modal>

            <Modal
                className={classes.modal}
                open={openDeleteCards}
                onClose={handleCloseDeleteCards}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                timeout: 500,
                }}
            >
                <Fade in={openDeleteCards}>
                <div className={classes.paper}>

                    <div className="popup-container" style={{width:"380px",height:"620px"}}>
                        <div className="popup-header" style={{marginBottom:"20px"}}>
                            <span className="popup-section_title">Delete Cards</span>
                            <svg className="window_icon" width="15" height="15" viewBox="0 0 13 13" onClick={handleCloseDeleteCards}>
                                <path d="M0.271972 0.271972C0.634602 -0.0906574 1.22254 -0.0906574 1.58517 0.271972L6.5 5.1868L11.4148 0.271972C11.7775 -0.0906574 12.3654 -0.0906574 12.728 0.271972C13.0907 0.634602 13.0907 1.22254 12.728 1.58517L7.8132 6.5L12.728 11.4148C13.0907 11.7775 13.0907 12.3654 12.728 12.728C12.3654 13.0907 11.7775 13.0907 11.4148 12.728L6.5 7.8132L1.58517 12.728C1.22254 13.0907 0.634602 13.0907 0.271972 12.728C-0.0906574 12.3654 -0.0906574 11.7775 0.271972 11.4148L5.1868 6.5L0.271972 1.58517C-0.0906574 1.22254 -0.0906574 0.634602 0.271972 0.271972Z"/>
                            </svg>
                        </div>
                        <div className="popup-flex_container">
                            <div className="popup-flex_half" style={{width:"100%"}}>
                            <div className="popup-flex_container" style={{height:"100%"}}>
                                <List className={classes.list} style={{width:"100%",marginTop:"0px",height:"94%"}} component="nav" aria-label="Bot Import" dense="True">
                                    <ListItem dense button onClick={handleCardSelectorCheckAllChange}>
                                        <ListItemIcon>
                                            <GreenCheckbox 
                                                color="secondary"
                                                checked={cardSelectorCheckAll} 
                                                />
                                        </ListItemIcon>
                                        <ListItemText primary="CHECK ALL" className={classes.listText}/>
                                    </ListItem>
                                    <Divider style={{width:"100%"}}/>
                                    {cardSelector.map( (card,index) => 
                                    <ListItem key={card["id"]} value={card["id"]} dense button onClick={() => handleCardSelectorChange(card["id"])}>
                                        <ListItemIcon>
                                            <GreenCheckbox 
                                            color="secondary"
                                            checked={card["checked"]} 
                                            
                                            value={card["id"]} 
                                            key={card["id"]}
                                            />
                                        </ListItemIcon>
                                        <ListItemText id={card["id"]} primary={"•••• " + card["number"].substring(12,16) + " - " + card["month"] + "/" + card["year"] + " - " +card["name"]} className={classes.listText}/>
                                    </ListItem>
                                    )}
                                </List>

                            </div>

                        </div>

                    </div>
                    <div className="button_group" style={{width:"100%",display:"flex",justifyContent:"flex-end",marginTop:"20px"}}>
                        <Button color="#D85059" text="Delete" icon="delete" width="71px" clicked={() => confirmDeleteCards()} />
                    </div>
                    </div>
                </div>
                </Fade>
            </Modal>

            <Modal
                className={classes.modal}
                open={openEditCard}
                onClose={handleCloseEditCard}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                timeout: 500,
                }}
            >
                <Fade in={openEditCard}>
                <div className={classes.paper}>

                    <div className="popup-container" style={{width:"316px",height:"420px"}}>
                        <div className="popup-header" style={{marginBottom:"20px"}}>
                            <span className="popup-section_title">Manage Card</span>
                            <svg className="window_icon" width="15" height="15" viewBox="0 0 13 13" onClick={handleCloseEditCard}>
                                <path d="M0.271972 0.271972C0.634602 -0.0906574 1.22254 -0.0906574 1.58517 0.271972L6.5 5.1868L11.4148 0.271972C11.7775 -0.0906574 12.3654 -0.0906574 12.728 0.271972C13.0907 0.634602 13.0907 1.22254 12.728 1.58517L7.8132 6.5L12.728 11.4148C13.0907 11.7775 13.0907 12.3654 12.728 12.728C12.3654 13.0907 11.7775 13.0907 11.4148 12.728L6.5 7.8132L1.58517 12.728C1.22254 13.0907 0.634602 13.0907 0.271972 12.728C-0.0906574 12.3654 -0.0906574 11.7775 0.271972 11.4148L5.1868 6.5L0.271972 1.58517C-0.0906574 1.22254 -0.0906574 0.634602 0.271972 0.271972Z"/>
                            </svg>
                        </div>
                        <CardPanelEdit
                            name={editCardName}
                            cardNumber={editCardInfo.cardNumber}
                            month={editCardInfo.cardMonth}
                            year={editCardInfo.cardYear}
                            cardType={editCardInfo.cardType}
                        />

                        <div className="button_group" style={{width:"100%",display:"flex",justifyContent:"flex-end",alignItems:"flex-end",marginTop:"10px"}}>
                            <ButtonUnclickable color="#1D1D27" text={editCardInfo.cvv} width="40%" style={{cursor:"none"}}clicked={() => confirmDeleteCard()} />
                            
                        </div>

                        <div className="button_group" style={{width:"100%",display:"flex",justifyContent:"space-between",marginTop:"10px"}}>
                            <Button color="#1D1D27" text="Copy Number" width="40%" clicked={() => copyToClipboard(cards["groups"][group]["cards"][editCardIndex]["no"])} />
                            <div style={{width:"10px"}} />
                            <Button color="#1D1D27" text="Copy CVV" width="40%" clicked={() => copyToClipboard(cards["groups"][group]["cards"][editCardIndex]["cvv"])} />
                        </div>

                        <div style={{height:"10px"}} />
                        <TextField
                            name="cardName"
                            className={classes.inputFull}
                            label="Change Card Name"
                            value={editCardName}
                            onChange={handleEditCardNameChange}
                            variant="outlined"
                            margin="dense"
                        ></TextField>
                        <div className="button_group" style={{width:"100%",display:"flex",justifyContent:"flex-end",marginTop:"20px"}}>
                            <Button color="#D85059" text="Delete" icon="delete" width="81px" clicked={() => confirmDeleteCard()} />
                            <div style={{width:"10px"}} />
                            <Button color="#15BABE" text="Edit" width="81px" clicked={() => confirmEditCard()} />
                        </div>
                    </div>
                </div>
                </Fade>
            </Modal>

            <Modal
                className={classes.modal}
                open={openGenerateCards}
                onClose={handleCloseGenerateCards}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                timeout: 500,
                }}
            >
                <Fade in={openGenerateCards}>
                <div className={classes.paper}>

                    <div className="popup-container" style={{width:"680px",height:"720px"}}>
                        <div className="popup-header" style={{marginBottom:"20px"}}>
                            <span className="popup-section_title">Generate Cards</span>
                            <svg className="window_icon" width="15" height="15" viewBox="0 0 13 13" onClick={handleCloseGenerateCards}>
                                <path d="M0.271972 0.271972C0.634602 -0.0906574 1.22254 -0.0906574 1.58517 0.271972L6.5 5.1868L11.4148 0.271972C11.7775 -0.0906574 12.3654 -0.0906574 12.728 0.271972C13.0907 0.634602 13.0907 1.22254 12.728 1.58517L7.8132 6.5L12.728 11.4148C13.0907 11.7775 13.0907 12.3654 12.728 12.728C12.3654 13.0907 11.7775 13.0907 11.4148 12.728L6.5 7.8132L1.58517 12.728C1.22254 13.0907 0.634602 13.0907 0.271972 12.728C-0.0906574 12.3654 -0.0906574 11.7775 0.271972 11.4148L5.1868 6.5L0.271972 1.58517C-0.0906574 1.22254 -0.0906574 0.634602 0.271972 0.271972Z"/>
                            </svg>
                        </div>
                        
                        <div className={classes.root}>
                        <div className={classes.tabViewer}>
                            <AntTabs value={tabValue} onChange={handleTabChange}>
                                <AntTab label="Privacy" />
                                <AntTab label="CapitalOne Eno" />
                                <AntTab label="Stripe Issuing" />
                                <AntTab label="Citi VC" />

                            </AntTabs>
                            <Typography className={classes.padding} />
                        </div>
                    </div>
                        
                        <div className={classes.progress} style={{display:progressDisplay,width:"100%",marginTop:"20px"}}>
                        <LinearProgress color="secondary" />
                    </div>
                                                
                        <div className="popup-flex_container" style={{display:`${generatorMode["privacy"]}`,height:"560px",marginTop:"20px"}}>
                            <div className="popup-flex_half" style={{width:"48%",overflow:"hidden",height:"100%"}}>
                                <div className="popup-flex_container" style={{height:"30px",marginTop:"5px",marginBottom:"5px"}}>
                                    <p className="popup-section_title" style={{textAlign:"left",margin:"10px auto"}}>Status</p>
                                    <ButtonUnclickable text={cardGenStatus} color="#1D1D27" width="200px" /> 
                                </div>


                                <div className="popup-flex_container" style={{height:"32px",marginTop:"5px",marginBottom:"10px"}}>
                                    <p className="popup-section_title" style={{textAlign:"left",margin:"10px auto"}}>Detected Cards</p>
                                    <ButtonUnclickable text={genCards.length} color="#1D1D27" width="200px" /> 
                                </div>

                                <div className="popup-flex_container" style={{height:"50px",marginTop:"5px",marginBottom:"5px",alignItems:"center",display:`${cardGenOtpDisplay}`}}>
                                    <TextField
                                        name="verifyCode"
                                        className={classes.inputHalf}
                                        label="Enter TFA Code"
                                        value={cardGeneratorConfig.verifyCode}
                                        onChange={handleCardGeneratorConfigChange}
                                        variant="outlined"
                                        margin="dense"
                                    />

                                    <Button color="#15BABE" text="Submit" width="118px" clicked={() => submitPrivacyTFA()} />
                                </div>

                                
                                <div style={{padding:"10px",backgroundColor:"#1D1D27",border:"1px solid #343444",borderRadius:"3px"}}>
                                    <p className="popup-section_title" style={{textAlign:"left",margin:"10px auto"}}>Log into {generatorCurrentLabel}</p>
                                    <TextField
                                        select
                                        name="accountSelector"
                                        className={classes.inputFull}
                                        label="Select account"
                                        value={accountSelector}
                                        onChange={handleAccountSelectorChange}
                                        variant="outlined"
                                        margin="dense"
                                    >
                                        {cards["accounts"][generatorCurrentMode].map( (account,index) => 
                                            <MenuItem key={index} value={index}>
                                                {account["user"]}
                                            </MenuItem>
                                        )}
                                    </TextField>
                                    <div className="button_group" style={{width:"100%",display:"flex",justifyContent:"flex-end",marginTop:"10px"}}>
                                        <Button color="#D85059" text="Log Out" width="81px" clicked={() => handleLogout()} />
                                        <div style={{width:"20px"}}/>
                                        <Button color="#15BABE" text="Log In" width="81px" clicked={() => handleLogin()} />
                                    </div> 
                                </div>

                                <div style={{marginTop:"20px",padding:"10px",backgroundColor:"#1D1D27",border:"1px solid #343444",borderRadius:"3px"}}>
                                <p className="popup-section_title" style={{textAlign:"left",margin:"10px auto"}}>Generate Cards</p>
                                    <TextField
                                        name="name"
                                        className={classes.inputFull}
                                        label="Name of Cards"
                                        value={cardGeneratorConfig.name}
                                        onChange={handleCardGeneratorConfigChange}
                                        variant="outlined"
                                        margin="dense"
                                    />
                                    <div className="popup-flex_container">
                                        <TextField
                                            name="limit"
                                            className={classes.inputHalf}
                                            label="Card Limit"
                                            value={cardGeneratorConfig.limit}
                                            onChange={handleCardGeneratorConfigChange}
                                            variant="outlined"
                                            margin="dense"
                                        />
                                        <TextField
                                            select
                                            name="limitType"
                                            className={classes.inputHalf}
                                            label="Period"
                                            value={cardGeneratorConfig.limitType}
                                            onChange={handleCardGeneratorConfigChange}
                                            variant="outlined"
                                            margin="dense"
                                        >
                                            <MenuItem key="0" value="0">
                                                Per Month
                                            </MenuItem>
                                            <MenuItem key="1" value="1">
                                                Per Year
                                            </MenuItem>
                                            <MenuItem key="2" value="2">
                                                Per Transaction
                                            </MenuItem>
                                            <MenuItem key="3" value="3">
                                                Total
                                            </MenuItem>
                                            <MenuItem key="4" value="4">
                                                Single Use
                                            </MenuItem>
                                        </TextField>
                                    </div>
                                    <TextField
                                            name="amount"
                                            className={classes.inputHalf}
                                            label="# of Cards"
                                            value={cardGeneratorConfig.amount}
                                            onChange={handleCardGeneratorConfigChange}
                                            variant="outlined"
                                            margin="dense"
                                        />
                                    <div className="button_group" style={{width:"100%",display:"flex",justifyContent:"flex-end",marginTop:"10px"}}>
                                        <Button color="#15BABE" text="Generate" width="81px" clicked={() => handleGenerate()} />
                                    </div> 
                                </div>

                            </div>
                            
                            <div className="popup-flex_half" style={{width:"48%",overflow:"hidden",height:"100%"}}>
                                <List className={classes.list} style={{width:"98%",marginTop:"0px",height:"93%"}} component="nav" aria-label="Bot Import" dense="True">
                                    <ListItem dense button onClick={handleGenCardSelectorCheckAllChange}>
                                        <ListItemIcon>
                                            <GreenCheckbox 
                                                color="secondary"
                                                checked={genCardSelectorCheckAll} 
                                                />
                                        </ListItemIcon>
                                        <ListItemText primary="CHECK ALL" className={classes.listText}/>
                                    </ListItem>
                                    <Divider style={{width:"100%"}}/>
                                    {genCardSelector.map( (card) => 
                                    <ListItem key={card["no"]} value={card["no"]} dense button onClick={() => handleGenCardSelectorChange(card["id"])}>
                                        <ListItemIcon>
                                            <GreenCheckbox 
                                            color="secondary"
                                            checked={card["checked"]} 
                                            
                                            value={card["id"]} 
                                            key={card["id"]}
                                            />
                                        </ListItemIcon>
                                        <ListItemText id={card["id"]} primary={card["no"].substring(12,16) + " - " + card["name"]} className={classes.listText}/>
                                    </ListItem>
                                    )}
                                </List>
                            </div>
                        </div>

                        <div className="popup-flex_container" style={{display:`${generatorMode["eno"]}`,height:"560px",marginTop:"20px"}}>
                            <EmptyPanel
                                type="cards"
                                text="CapitalOne ENO coming soon!"
                            />
                        </div>

                        <div className="popup-flex_container" style={{display:`${generatorMode["stripe"]}`,height:"560px",marginTop:"20px"}}>
                            <div className="popup-flex_half" style={{width:"48%",overflow:"hidden",height:"100%"}}>
                                <div className="popup-flex_container" style={{height:"30px",marginTop:"5px",marginBottom:"5px"}}>
                                    <p className="popup-section_title" style={{textAlign:"left",margin:"10px auto"}}>Status</p>
                                    <ButtonUnclickable text={cardGenStatus} color="#1D1D27" width="200px" /> 
                                </div>


                                <div className="popup-flex_container" style={{height:"32px",marginTop:"5px",marginBottom:"10px"}}>
                                    <p className="popup-section_title" style={{textAlign:"left",margin:"10px auto"}}>Detected Cards</p>
                                    <ButtonUnclickable text={genCards.length} color="#1D1D27" width="200px" /> 
                                </div>
                                
                                <div style={{padding:"10px",backgroundColor:"#1D1D27",border:"1px solid #343444",borderRadius:"3px"}}>
                                    <p className="popup-section_title" style={{textAlign:"left",margin:"10px auto"}}>Log into {generatorCurrentLabel}</p>
                                    <TextField
                                        select
                                        name="accountSelector"
                                        className={classes.inputFull}
                                        label="Select account"
                                        value={accountSelector}
                                        onChange={handleAccountSelectorChange}
                                        variant="outlined"
                                        margin="dense"
                                    >
                                        {cards["accounts"][generatorCurrentMode].map( (account,index) => 
                                            <MenuItem key={index} value={index}>
                                                {account["holder"]}
                                            </MenuItem>
                                        )}
                                    </TextField>
                                    <div className="button_group" style={{width:"100%",display:"flex",justifyContent:"flex-end",marginTop:"10px"}}>
                                        <Button color="#D85059" text="Log Out" width="81px" clicked={() => handleLogout()} />
                                        <div style={{width:"20px"}}/>
                                        <Button color="#15BABE" text="Log In" width="81px" clicked={() => handleLogin()} />
                                    </div> 
                                </div>

                                <div style={{marginTop:"20px",padding:"10px",backgroundColor:"#1D1D27",border:"1px solid #343444",borderRadius:"3px"}}>
                                <p className="popup-section_title" style={{textAlign:"left",margin:"10px auto"}}>Generate Cards</p>
                                    <TextField
                                        name="name"
                                        className={classes.inputFull}
                                        label="Name of Cards"
                                        value={cardGeneratorConfig.name}
                                        onChange={handleCardGeneratorConfigChange}
                                        variant="outlined"
                                        margin="dense"
                                    />
                                    <div className="popup-flex_container">
                                        <TextField
                                            name="limit"
                                            className={classes.inputHalf}
                                            label="Card Limit"
                                            value={cardGeneratorConfig.limit}
                                            onChange={handleCardGeneratorConfigChange}
                                            variant="outlined"
                                            margin="dense"
                                        />
                                        <TextField
                                            select
                                            name="limitType"
                                            className={classes.inputHalf}
                                            label="Period"
                                            value={cardGeneratorConfig.limitType}
                                            onChange={handleCardGeneratorConfigChange}
                                            variant="outlined"
                                            margin="dense"
                                        >
                                            <MenuItem key="0" value="per_authorization">
                                                Per Authorization
                                            </MenuItem>
                                            <MenuItem key="1" value="daily">
                                                Daily
                                            </MenuItem>
                                            <MenuItem key="2" value="weekly">
                                                Weekly
                                            </MenuItem>
                                            <MenuItem key="3" value="monthly">
                                                Monthly
                                            </MenuItem>
                                            <MenuItem key="4" value="yearly">
                                                Yealy
                                            </MenuItem>
                                            <MenuItem key="4" value="all_time">
                                                All Time
                                            </MenuItem>
                                        </TextField>
                                    </div>
                                    <TextField
                                            name="amount"
                                            className={classes.inputHalf}
                                            label="# of Cards"
                                            value={cardGeneratorConfig.amount}
                                            onChange={handleCardGeneratorConfigChange}
                                            variant="outlined"
                                            margin="dense"
                                        />
                                    <div className="button_group" style={{width:"100%",display:"flex",justifyContent:"flex-end",marginTop:"10px"}}>
                                        <Button color="#15BABE" text="Generate" width="81px" clicked={() => handleGenerate()} />
                                    </div> 
                                </div>

                            </div>
                            
                            <div className="popup-flex_half" style={{width:"48%",overflow:"hidden",height:"100%"}}>
                                <List className={classes.list} style={{width:"98%",marginTop:"0px",height:"93%"}} component="nav" aria-label="Bot Import" dense="True">
                                    <ListItem dense button onClick={handleGenCardSelectorCheckAllChange}>
                                        <ListItemIcon>
                                            <GreenCheckbox 
                                                color="secondary"
                                                checked={genCardSelectorCheckAll} 
                                                />
                                        </ListItemIcon>
                                        <ListItemText primary="CHECK ALL" className={classes.listText}/>
                                    </ListItem>
                                    <Divider style={{width:"100%"}}/>
                                    {genCardSelector.map( (card) => 
                                    <ListItem key={card["no"]} value={card["no"]} dense button onClick={() => handleGenCardSelectorChange(card["id"])}>
                                        <ListItemIcon>
                                            <GreenCheckbox 
                                            color="secondary"
                                            checked={card["checked"]} 
                                            
                                            value={card["id"]} 
                                            key={card["id"]}
                                            />
                                        </ListItemIcon>
                                        <ListItemText id={card["id"]} primary={card["no"].substring(12,16) + " - " + card["name"]} className={classes.listText}/>
                                    </ListItem>
                                    )}
                                </List>
                            </div>
                        </div>

                        <div className="popup-flex_container" style={{display:`${generatorMode["citi"]}`,height:"560px",marginTop:"20px"}}>
                            <EmptyPanel
                                type="cards"
                                text="CITI VC coming soon!"
                            />
                        </div>
                        
                        <div className="button_group" style={{width:"100%",display:"flex",justifyContent:"flex-end",marginTop:"20px"}}>
                            <Button color="#D85059" text="Delete Selection" width="120px" clicked={() => handleDeleteGenCards()} />
                            <div style={{width:"10px"}} />
                            <Button color="#15BABE" text="Import Selection" width="120px" clicked={() => handleImportGenCards()} />
                        </div>
                    </div>
                </div>
                </Fade>
            </Modal>

            <Modal
                className={classes.modal}
                open={openManageAccounts}
                onClose={handleCloseManageAccounts}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                timeout: 500,
                }}
            >
                <Fade in={openManageAccounts}>
                <div className={classes.paper}>

                    <div className="popup-container" style={{width:"600px",height:"320px"}}>
                        <div className="popup-header" style={{marginBottom:"20px"}}>
                            <span className="popup-section_title">Manage Accounts</span>
                            <svg className="window_icon" width="15" height="15" viewBox="0 0 13 13" onClick={handleCloseManageAccounts}>
                                <path d="M0.271972 0.271972C0.634602 -0.0906574 1.22254 -0.0906574 1.58517 0.271972L6.5 5.1868L11.4148 0.271972C11.7775 -0.0906574 12.3654 -0.0906574 12.728 0.271972C13.0907 0.634602 13.0907 1.22254 12.728 1.58517L7.8132 6.5L12.728 11.4148C13.0907 11.7775 13.0907 12.3654 12.728 12.728C12.3654 13.0907 11.7775 13.0907 11.4148 12.728L6.5 7.8132L1.58517 12.728C1.22254 13.0907 0.634602 13.0907 0.271972 12.728C-0.0906574 12.3654 -0.0906574 11.7775 0.271972 11.4148L5.1868 6.5L0.271972 1.58517C-0.0906574 1.22254 -0.0906574 0.634602 0.271972 0.271972Z"/>
                            </svg>
                        </div>
                        <TextField
                            select
                            name="manageAccountType"
                            className={classes.inputFull}
                            label="Select Account Type"
                            value={manageAccountType}
                            onChange={handleManageAccountTypeChange}
                            variant="outlined"
                            margin="dense"
                        >
                            {accountTypes.map( (accountType) => 
                                <MenuItem key={accountType["value"]} value={accountType["value"]}>
                                    {accountType["label"]}
                                </MenuItem>
                            )}
                        </TextField>
                        <div className="popup-flex_container" style={{marginTop:"10px",height:"200px"}}>
                            <div className="popup-flex_half" style={{width:"30%",height:"98%",padding:"10px",backgroundColor:"#1D1D27",border:"1px solid #343444",borderRadius:"3px"}}>
                                <p className="popup-section_title" style={{textAlign:"center",margin:"10px auto"}}>{accountTypesDetail[manageAccountType]["title"]}</p>
                                <TextField
                                    name="username"
                                    className={classes.inputFull}
                                    label={accountTypesDetail[manageAccountType]["userLabel"]}
                                    value={addCardAccount.username}
                                    onChange={handleAddCardAccountChange}
                                    variant="outlined"
                                    margin="dense"
                                ></TextField>
                                <TextField
                                    name="password"
                                    className={classes.inputFull}
                                    label={accountTypesDetail[manageAccountType]["passLabel"]}
                                    value={addCardAccount.password}
                                    onChange={handleAddCardAccountChange}
                                    variant="outlined"
                                    margin="dense"
                                ></TextField>
                                <div className="button_group" style={{width:"100%",display:"flex",justifyContent:"flex-end",marginTop:"20px"}}>
                                    <Button color="#15BABE" icon="add" width="81px" clicked={() => addCardAccountConfirm()} />
                                </div>
                            </div>
                            <List className={classes.list} style={{width:"60%",marginTop:"0px",height:"100%"}} component="nav" aria-label="Bot Import" dense="True">
                                {cards["accounts"][manageAccountType].map( (account,index) => 
                                <ListItem key={index} value={index} dense>
                                    <ListItemText id={index} primary={account[accountTypesDetail[manageAccountType]["userKey"]]} className={classes.listText}/>
                                    <div className="delete-icon" onClick={() => removeCardAccount(index)}></div>
                                </ListItem>
                                )}
                            </List>

                        </div>
                    
                        
                    </div>
                    <div className="button_group" style={{width:"100%",display:"flex",justifyContent:"flex-end",marginTop:"20px"}}>
                        <Button color="#D85059" text="Close" width="81px" clicked={() => handleCloseManageAccounts()} />
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

export default CardGen;