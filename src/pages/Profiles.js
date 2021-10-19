import './pages.css'
import './popups.css'

import Button from '../components/buttons/button'
import DotTitle from '../components/titles/DotTitle'

import GroupPanelSlim from "../components/panels/GroupPanelSlim";
import ProfilesPanel from "../components/panels/ProfilesPanel";
import CardPanel from "../components/panels/CardPanel"
import EmptyPanel from "../components/panels/EmptyPanel"

import React from 'react';
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
import Divider from '@material-ui/core/Divider';

import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';

import { Country, State, City }  from 'country-state-city';

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
  listText: {
      color:"#F1F1F2"
  }
}));

function useForceUpdate(){
    const [value, setValue] = React.useState(0); // integer state
    return () => setValue(value => value + 1); // update the state to force render
}


function getCodeByCountry(country) {
    let countries = Country.getAllCountries()
    for(var i = 0; i < countries.length; i++) {
        if(countries[i]["name"] === country) {
            return countries[i]["isoCode"]
        }
    }
    return ""
}



const expiryMonths = [
    {
        value: '01',
        label: '01',
    },
    {
        value: '02',
        label: '02',
    },
    {
        value: '03',
        label: '03',
    },
    {
        value: '04',
        label: '04',
    },
    {
        value: '05',
        label: '05',
    },
    {
        value: '06',
        label: '06',
    },
    {
        value: '07',
        label: '07',
    },
    {
        value: '08',
        label: '08',
    },
    {
        value: '09',
        label: '09',
      },
      {
        value: '10',
        label: '10',
      },
      {
        value: '11',
        label: '11',
      },
      {
        value: '12',
        label: '12',
      },
  ];
const expiryYears = [
    {
        value: '21',
        label: '2021',
    },
    {
        value: '22',
        label: '2022',
    },
    {
        value: '23',
        label: '2023',
    },
    {
        value: '24',
        label: '2024',
    },
    {
        value: '25',
        label: '2025',
    },
    {
        value: '26',
        label: '2026',
    },
    {
        value: '27',
        label: '2027',
    },
    {
        value: '28',
        label: '2028',
    },
    {
        value: '29',
        label: '2029',
    },

  ];
const cardProviders = [
    {
        value: 'Visa',
        label: 'Visa',
    },
    {
        value: 'MasterCard',
        label: 'MasterCard',
    },

    {
        value: 'Amex',
        label: 'Amex',
    },
    {
        value: 'Discover',
        label: 'Discover',
    },
  ];
const botTypes = [
    {
        value:"splash",
        label:"Photon Tools",
        checked:false
    },
    {
        value:"aycd",
        label:"AYCD",
        checked:false
    },
    {
        value:"akari",
        label:"Akari",
        checked:false
    },
    {
        value:"balko",
        label:"Balko Bot",
        checked:false
    },
    {
        value:"bnb",
        label:"Better Nike Bot",
        checked:false
    },
    {
        value:"candypreme",
        label:"CandyPreme 2.0",
        checked:false
    },
    {
        value:"csv",
        label:"CSV / Google Form",
        checked:false
    },
    {
        value:"cyber",
        label:"Cyber 4.0",
        checked:false
    },
    {
        value:"cyber5",
        label:"Cyber 5.0",
        checked:false
    },
    {
        value:"dashe",
        label:"Dashe",
        checked:false
    },
    {
        value:"estock",
        label:"Estock",
        checked:false
    },
    {
        value:"eve",
        label:"Eve Aio",
        checked:false
    },
    {
        value:"ganesh_cli",
        label:"Ganesh CLI",
        checked:false
    },
    {
        value:"ganesh_gui",
        label:"Ganesh GUI",
        checked:false
    },
    {
        value:"ghost",
        label:"Ghost",
        checked:false
    },
    {
        value:"kodai",
        label:"Kodai",
        checked:false
    },
    {
        value:"ksr",
        label:"KSR",
        checked:false
    },
    {
        value:"mekpreme",
        label:"MEKPreme",
        checked:false
    },
    {
        value:"nova",
        label:"Nova",
        checked:false
    },
    {
        value:"nsb",
        label:"Nike Shoe Bot",
        checked:false
    },
    {
        value:"nyte",
        label:"Nyte",
        checked:false
    },
    {
        value:"phantom",
        label:"Phantom",
        checked:false
    },
    {
        value:"polaris",
        label:"Polaris",
        checked:false
    },
    {
        value:"prism",
        label:"Prism",
        checked:false
    },
    {
        value:"pd",
        label:"Project Destroyer",
        checked:false
    },
    {
        value:"splashforce",
        label:"Splashforce",
        checked:false
    },
    {
        value:"splashforce3ds",
        label:"Splashforce 3DS",
        checked:false
    },
    {
        value:"stellar",
        label:"Stellar",
        checked:false
    },
    {
        value:"storme",
        label:"Storme IO",
        checked:false
    },
    {
        value:"tks",
        label:"TheKickStation",
        checked:false
    },
    {
        value:"tohru",
        label:"Tohru",
        checked:false
    },
    {
        value:"tsb",
        label:"TheShitBot",
        checked:false
    },
    {
        value:"valor",
        label:"Valor",
        checked:false
    },
    {
        value:"velox",
        label:"Velox",
        checked:false
    },
    {
        value:"vite",
        label:"Vite",
        checked:false
    },
    {
        value:"wrath",
        label:"Wrath",
        checked:false
    }
]



let profiles = {"groups":[{"name":"Empty","profiles":[]}]};




ipcRenderer.send('getProfiles')
ipcRenderer.on('returnProfiles', (event,arg) => {
    ipcRenderer.removeAllListeners('returnProfiles');
    profiles = arg.profiles
})




let importFormats = botTypes;
let exportFormats = botTypes;



function Profiles(props) {
    const classes = useStyles();


    const forceUpdate = useForceUpdate()

    const [group, setGroup] = React.useState(0) // group index
    const handleGroupChange = (index) => {
        setGroup(index);
    };
    
    ipcRenderer.send('getProfiles')
    ipcRenderer.on('returnProfiles', (event,arg) => {
        ipcRenderer.removeAllListeners('returnProfiles');  
        profiles = arg.profiles;
        console.log(profiles)
    })
    
    


    const [checkboxState, setCheckboxState] = React.useState({
        checkedSameBillingAndShipping: true,
        checkedOneCheckout: true,
    });
    const [profileData,setProfileData] = React.useState({
        profileName:"",
        profileEmail:"",

        cardFirstName:"",
        cardLastName:"",
        cardNumber:"",
        cardExpiryMonth:"",
        cardExpiryYear:"",
        cardProvider:"",
        cardCVV:"",


        billingName: "",
        billingPhone: "",
        billingAddressLine1: "",
        billingAddressLine2: "",
        billingCity: "",
        billingPostalCode: "",
        billingState: "",
        billingCountry: "",

        shippingName: "",
        shippingPhone: "",
        shippingAddressLine1: "",
        shippingAddressLine2: "",
        shippingCity: "",
        shippingPostalCode: "",
        shippingState: "",
        shippingCountry: ""

    });
    const handleProfileDataChange = (event) => {
        setProfileData({ ...profileData, [event.target.name]: event.target.value });
    }
    const handleCheckboxChange = (event) => {
        setCheckboxState({ ...checkboxState, [event.target.name]: event.target.checked });
    };



    //ADD PROFILE
    const [openAddProfile, setOpenAddProfile] = React.useState(false);
    const handleOpenAddProfile = () => {
        setOpenAddProfile(true);
    };
    const handleCloseAddProfile = () => {
        setOpenAddProfile(false);
    };
    const handleAddProfile = () => {
        setProfileData({
            cardFirstName:"",
            cardLastName:"",
            cardNumber:"",
            cardExpiryMonth:"",
            cardExpiryYear:"",
            cardProvider:"",
            cardCVV:"",
    
    
            billingName: "",
            billingPhone: "",
            billingAddressLine1: "",
            billingAddressLine2: "",
            billingCity: "",
            billingPostalCode: "",
            billingState: "",
            billingCountry: "",
            billingName:"",
    
            shippingName: "",
            shippingPhone: "",
            shippingAddressLine1: "",
            shippingAddressLine2: "",
            shippingCity: "",
            shippingPostalCode: "",
            shippingState: "",
            shippingCountry: "",
            shippingName: ""
    
        })
        handleOpenAddProfile()
    };
    const handleAddProfileConfirm = () => {

        let profile;
        if(checkboxState.checkedSameBillingAndShipping) {
            try {
                //var bill_country = Country.getCountryByCode(profileData.billingCountry)["name"]
                var ship_country = Country.getCountryByCode(profileData.shippingCountry)["name"]
            }
            catch {
                handleOpenSnackbar("Please fill out all required fields.","error")
                return
            }
            profile = {
                "billing":{
                    "city": profileData.shippingCity,
                    "country": Country.getCountryByCode(profileData.shippingCountry)["name"],
                    "email":profileData.profileEmail,
                    "line1":profileData.shippingAddressLine1,
                    "line2":profileData.shippingAddressLine2,
                    "line3":"",
                    "name":profileData.shippingName,
                    "phone":profileData.shippingPhone,
                    "post_code":profileData.shippingPostalCode,
                    "state":profileData.shippingState
                },
                "card":{
                   "cvv":profileData.cardCVV,
                   "mo":profileData.cardExpiryMonth,
                   "name":profileData.cardFirstName + " " + profileData.cardLastName,
                   "no":profileData.cardNumber,
                   "type":profileData.cardProvider,
                   "yr":profileData.cardExpiryYear
                },
                "options":{
                   "checkout_once":checkboxState.checkedOneCheckout,
                   "same_billing_shipping":checkboxState.checkedSameBillingAndShipping,
                   "same_names":false,
                   "size":""
                },
                "profile_errors":[
                ],
                "profile_group":"",
                "profile_name":profileData.profileName,
                "shipping":{
                    "city": profileData.shippingCity,
                    "country": Country.getCountryByCode(profileData.shippingCountry)["name"],
                    "email":profileData.profileEmail,
                    "line1":profileData.shippingAddressLine1,
                    "line2":profileData.shippingAddressLine2,
                    "line3":"",
                    "name":profileData.shippingName,
                    "phone":profileData.shippingPhone,
                    "post_code":profileData.shippingPostalCode,
                    "state":profileData.shippingState
                }
            }
        }
        else {
            try {
                var bill_country = Country.getCountryByCode(profileData.billingCountry)["name"]
                var ship_country = Country.getCountryByCode(profileData.shippingCountry)["name"]
            }
            catch {
                handleOpenSnackbar("Please fill out all required fields.","error")
                return
            }
            profile = {
                "billing":{
                   "city": profileData.billingCity,
                   "country": Country.getCountryByCode(profileData.billingCountry)["name"],
                   "email":profileData.profileEmail,
                   "line1":profileData.billingAddressLine1,
                   "line2":profileData.billingAddressLine2,
                   "line3":"",
                   "name":profileData.billingName,
                   "phone":profileData.billingPhone,
                   "post_code":profileData.billingPostalCode,
                   "state":profileData.billingState
                },
                "card":{
                   "cvv":profileData.cardCVV,
                   "mo":profileData.cardExpiryMonth,
                   "name":profileData.cardFirstName + " " + profileData.cardLastName,
                   "no":profileData.cardNumber,
                   "type":profileData.cardProvider,
                   "yr":profileData.cardExpiryYear
                },
                "options":{
                   "checkout_once":checkboxState.checkedOneCheckout,
                   "same_billing_shipping":checkboxState.checkedSameBillingAndShipping,
                   "same_names":false,
                   "size":""
                },
                "profile_errors":[
                ],
                "profile_group":"",
                "profile_name":profileData.profileName,
                "shipping":{
                    "city": profileData.shippingCity,
                    "country": Country.getCountryByCode(profileData.shippingCountry)["name"],
                    "email":profileData.profileEmail,
                    "line1":profileData.shippingAddressLine1,
                    "line2":profileData.shippingAddressLine2,
                    "line3":"",
                    "name":profileData.shippingName,
                    "phone":profileData.shippingPhone,
                    "post_code":profileData.shippingPostalCode,
                    "state":profileData.shippingState
                }
            }
        }

        ipcRenderer.send('addProfile', {group:group,profile:profile})
        ipcRenderer.on('addProfile', (event,arg) => {
            profiles = arg.profiles
            handleCloseAddProfile();
            handleOpenSnackbar("Profile added","success")
        })
    };


    //REMOVE PROFILE
    const handleDeleteProfile = (index) => {
        ipcRenderer.send('removeProfile', {group:group,profile:index})
        ipcRenderer.on('removeProfile', (event,arg) => {
            profiles = arg.profiles
            forceUpdate()
        })
    };



    //EDIT PROFILE
    const [openEditProfile, setOpenEditProfile] = React.useState(false);
    const [profileEditIndex,setProfileEditIndex] = React.useState(0)
    const handleOpenEditProfile = () => {
        setOpenEditProfile(true);
    };
    const handleCloseEditProfile = () => {
        setOpenEditProfile(false);
    };
    const handleEditProfile = (index) => {

        let profile = profiles["groups"][group]["profiles"][index]
        let cardNames = profile["card"]["name"].split(" ")
        setProfileEditIndex(index)
        setCheckboxState({
            checkedSameBillingAndShipping: profile["options"]["same_billing_shipping"],
            checkedOneCheckout: profile["options"]["checkout_once"]
        })
        setProfileData({

            profileName:profile["profile_name"],
            profileEmail:profile["billing"]["email"],

            cardFirstName:cardNames[0],
            cardLastName:cardNames[1],
            cardNumber:profile["card"]["no"],
            cardExpiryMonth:profile["card"]["mo"],
            cardExpiryYear:profile["card"]["yr"],
            cardProvider:profile["card"]["type"],
            cardCVV:profile["card"]["cvv"],
    
    
            billingName: profile["billing"]["name"],
            billingPhone: profile["billing"]["phone"],
            billingAddressLine1: profile["billing"]["line1"],
            billingAddressLine2: profile["billing"]["line2"],
            billingCity: profile["billing"]["city"],
            billingPostalCode: profile["billing"]["post_code"],
            billingState: profile["billing"]["state"],
            billingCountry: getCodeByCountry(profile["billing"]["country"]),
    
            shippingName: profile["shipping"]["name"],
            shippingPhone: profile["shipping"]["phone"],
            shippingAddressLine1: profile["shipping"]["line1"],
            shippingAddressLine2: profile["shipping"]["line2"],
            shippingCity: profile["shipping"]["city"],
            shippingPostalCode: profile["shipping"]["post_code"],
            shippingState: profile["shipping"]["state"],
            shippingCountry: getCodeByCountry(profile["shipping"]["country"])
    
        })
        handleOpenEditProfile()
    };
    const handleEditProfileConfirm = () => {

        let profile;
        if(checkboxState.checkedSameBillingAndShipping) {
            profile = {
                "billing":{
                    "city": profileData.shippingCity,
                    "country": Country.getCountryByCode(profileData.shippingCountry)["name"],
                    "email":profileData.profileEmail,
                    "line1":profileData.shippingAddressLine1,
                    "line2":profileData.shippingAddressLine2,
                    "line3":"",
                    "name":profileData.shippingName,
                    "phone":profileData.shippingPhone,
                    "post_code":profileData.shippingPostalCode,
                    "state":profileData.shippingState
                },
                "card":{
                    "cvv":profileData.cardCVV,
                    "mo":profileData.cardExpiryMonth,
                    "name":profileData.cardFirstName + " " + profileData.cardLastName,
                    "no":profileData.cardNumber,
                    "type":profileData.cardProvider,
                    "yr":profileData.cardExpiryYear
                },
                "options":{
                    "checkout_once":checkboxState.checkedOneCheckout,
                    "same_billing_shipping":checkboxState.checkedSameBillingAndShipping,
                    "same_names":false,
                    "size":""
                },
                "profile_errors":[
                ],
                "profile_group":"",
                "profile_name":profileData.profileName,
                "shipping":{
                    "city": profileData.shippingCity,
                    "country": Country.getCountryByCode(profileData.shippingCountry)["name"],
                    "email":profileData.profileEmail,
                    "line1":profileData.shippingAddressLine1,
                    "line2":profileData.shippingAddressLine2,
                    "line3":"",
                    "name":profileData.shippingName,
                    "phone":profileData.shippingPhone,
                    "post_code":profileData.shippingPostalCode,
                    "state":profileData.shippingState
                }
            }
        }
        else {
            profile = {
                "billing":{
                    "city": profileData.billingCity,
                    "country": Country.getCountryByCode(profileData.billingCountry)["name"],
                    "email":profileData.profileEmail,
                    "line1":profileData.billingAddressLine1,
                    "line2":profileData.billingAddressLine2,
                    "line3":"",
                    "name":profileData.billingName,
                    "phone":profileData.billingPhone,
                    "post_code":profileData.billingPostalCode,
                    "state":profileData.billingState
                },
                "card":{
                    "cvv":profileData.cardCVV,
                    "mo":profileData.cardExpiryMonth,
                    "name":profileData.cardFirstName + " " + profileData.cardLastName,
                    "no":profileData.cardNumber,
                    "type":profileData.cardProvider,
                    "yr":profileData.cardExpiryYear
                },
                "options":{
                    "checkout_once":checkboxState.checkedOneCheckout,
                    "same_billing_shipping":checkboxState.checkedSameBillingAndShipping,
                    "same_names":false,
                    "size":""
                },
                "profile_errors":[
                ],
                "profile_group":"",
                "profile_name":profileData.profileName,
                "shipping":{
                    "city": profileData.shippingCity,
                    "country": Country.getCountryByCode(profileData.shippingCountry)["name"],
                    "email":profileData.profileEmail,
                    "line1":profileData.shippingAddressLine1,
                    "line2":profileData.shippingAddressLine2,
                    "line3":"",
                    "name":profileData.shippingName,
                    "phone":profileData.shippingPhone,
                    "post_code":profileData.shippingPostalCode,
                    "state":profileData.shippingState
                }
            }
        }

        ipcRenderer.send('editProfile', {group:group,index:profileEditIndex,profile:profile})
        ipcRenderer.on('editProfile', (event,arg) => {
            profiles = arg.profiles
            handleCloseEditProfile();
            handleOpenSnackbar("Profile edited","success")
        })
    };







    const [profileSelector, setProfileSelector] = React.useState([])
    const [profileSelectorCheckAll,setProfileSelectorCheckAll] = React.useState(true)
    const handleProfileSelectorChange = (value) => {

        for(const each of profileSelector){
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
    const handleProfileSelectorCheckAllChange = (event) => {
        console.log("CHECKING ALL")



        for(const each of profileSelector) {
            if(profileSelectorCheckAll) {
                each.checked = false;
            }
            else {
                each.checked = true;
            }
            
        }
        if(profileSelectorCheckAll) {
            setProfileSelectorCheckAll(false)
        }
        else {
            setProfileSelectorCheckAll(true)
        }
        
    }
    const handleProfileSelectorStart = () => {
        let profilesInit = profiles["groups"][group]["profiles"]
        for(var i = 0; i < profilesInit.length; i++) {
            profileSelector.push({id:i,name:profilesInit[i]["profile_name"],checked:true})
        }
    }
    const handleProfileSelectorClose = () => {
        setProfileSelector([])
    }
    const getCheckedInProfileSelector = () => {
        let profileSelection = [];
        for(const each of profileSelector) {
            if(each.checked) {
                profileSelection.push(each.id)
            }
        }
        return profileSelection;
    }











    //JIG PROFILE
    const [openJigProfile, setOpenJigProfile] = React.useState(false);
    const [jigOptions,setJigOptions] = React.useState({

        firstName:true,
        lastName:true,
        cardName:true,
        email:true,
        phone:true,
        billingAddress:true,
        shippingAddress:true,

        useDotTrick:true,
        useCatchall:true,

        line1:true,
        line2:true,
        apartment:true,
        
    })
    const [jigParams,setJigParams] = React.useState({
        jigAmount:"1",
        catchall:"",
        line1Pos:"0",
        line2Pos:"0",
        line1Char:"3",
        line2Char:"3"
    })
    const handleJigOptionsChange = (event) => {
        setJigOptions({ ...jigOptions, [event.target.name]: event.target.checked });
    };
    const handleJigParamChange = (event) => {
        setJigParams({ ...jigParams, [event.target.name]: event.target.value });
    };


    const handleOpenJigProfile = () => {

        handleProfileSelectorStart()
        setOpenJigProfile(true);
    };
    const handleCloseJigProfile = () => {
        handleProfileSelectorClose()
        setOpenJigProfile(false);
    };
    const handleJigProfile = () => {
        

        let jigProfilesInit = profiles["groups"][group]["profiles"]
        if(jigProfilesInit.length === 0) {
            handleOpenSnackbar("No profiles to jig","warning")
            return
        }




        handleOpenJigProfile()
    };
    const handleJigProfileConfirm = () => {
        let catchall
        if(jigOptions.useCatchall) {
            catchall = jigParams.catchall
        } else {
            catchall = ""
        }

        let line1Len;
        let line2Len;
        if(jigOptions.line1) {
            line1Len = jigParams.line1Char
        }
        else {
            line1Len = "0"
        }
        if(jigOptions.line2) {
            line2Len = jigParams.line2Char
        }
        else {
            line2Len = "0"
        }
        

        var selection = getCheckedInProfileSelector()

        console.log(selection)

        ipcRenderer.send('jigProfiles', {
            group:group,
            profiles:getCheckedInProfileSelector(),
            amount:jigParams.jigAmount,
            firstName:jigOptions.firstName,
            lastName:jigOptions.lastName,
            email:jigOptions.email,
            phone:jigOptions.phone,
            billing:jigOptions.billingAddress,
            shipping:jigOptions.shippingAddress,
            line1:line1Len,
            line2:line2Len,
            apt:jigOptions.apartment,
            catchall:catchall,
            dotTrick:jigOptions.useDotTrick,
            line1Param:jigParams.line1Pos,
            line2Param:jigParams.line2Pos,
            cardName:jigOptions.cardName
        })
        ipcRenderer.on('jigProfiles', (event,arg) => {
            profiles = arg.profiles
            handleCloseJigProfile();
            handleOpenSnackbar("Profiles jigged","success")
        })
    };


    //DUPLICATE PROFILE
    const [openDuplicateProfile, setOpenDuplicateProfile] = React.useState(false);
    const handleOpenDuplicateProfile = () => {

        handleProfileSelectorStart()
        setOpenDuplicateProfile(true);
    };
    const handleCloseDuplicateProfile = () => {
        handleProfileSelectorClose()
        setOpenDuplicateProfile(false);
    };
    const handleDuplicateProfile = () => {
        let dupProfilesInit = profiles["groups"][group]["profiles"]
        if(dupProfilesInit.length === 0) {
            handleOpenSnackbar("No profiles to duplicate","warning");
            return;
        }
        console.log("OPENING")

        handleOpenDuplicateProfile()
    }
    const confirmDuplicateProfile = () => {
        ipcRenderer.send('duplicateProfiles', {
            group:group,
            profiles:getCheckedInProfileSelector()
        })
        ipcRenderer.on('duplicateProfiles', (event,arg) => {
            profiles = arg.profiles
            console.log("CLOSING")
            handleCloseDuplicateProfile();
            handleOpenSnackbar("Profiles duplicated to new group","success")
        })
    }

    //MOVE PROFILE
    const [openMoveProfile, setOpenMoveProfile] = React.useState(false);
    const [targetMoveGroup, setTargetMoveGroup] = React.useState(0);
    const handleTargetMoveGroupChange = (event) => {
        setTargetMoveGroup(
            event.target.value
        );
    };
    const handleOpenMoveProfile = () => {

        handleProfileSelectorStart()
        setOpenMoveProfile(true);
    };
    const handleCloseMoveProfile = () => {
        handleProfileSelectorClose()
        setOpenMoveProfile(false);
    };
    const handleMoveProfile = () => {
        let dupProfilesInit = profiles["groups"][group]["profiles"]
        if(dupProfilesInit.length === 0) {
            handleOpenSnackbar("No profiles to move","warning");
            return;
        }

        handleOpenMoveProfile()
    }
    const confirmMoveProfile = () => {
        console.log(targetMoveGroup)
        ipcRenderer.send('moveProfiles', {
            group:group,
            newGroup:targetMoveGroup,
            profiles:getCheckedInProfileSelector()
        })
        ipcRenderer.on('moveProfiles', (event,arg) => {
            
            profiles = arg.profiles
            handleCloseMoveProfile();
            handleOpenSnackbar("Profiles moved to specified group","success")
        })
    }




    const resetBotTypes = () => {
        for(var i = 0; i < botTypes.length; i++) {
            botTypes[i].checked = false
        }
    }

    //IMPORT PROFILE
    const [openImportProfile, setOpenImportProfile] = React.useState(false);
    const [importSearch,setImportSearch] = React.useState("")
    const handleImportSearchChange = (event) => {
        importFormats = []
        if(event.target.value === "") {
            importFormats = botTypes;
            setImportSearch(event.target.value);
            return;
        }
        for(const botType of botTypes) {
            if(botType.label.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1 ||botType.value.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1) {
                importFormats.push(botType)
            }
        }
        setImportSearch(event.target.value)
    }

    const handleOpenImportProfile = () => {
        setOpenImportProfile(true);
    };
    const handleCloseImportProfile = () => {
        importFormats = botTypes;
        resetBotTypes()
        setImportSearch("")
        setOpenImportProfile(false);

    };
    const handleImportProfile = () => {

        handleOpenImportProfile()
    }
    const confirmImportProfile = (type) => {

        ipcRenderer.send('importProfiles', {
            group:group,
            type:type
        })
        ipcRenderer.on('importProfiles', (event,arg) => {
            switch(arg.response) {
                case 1:
                    handleOpenSnackbar("Error reading import file","error")
                    handleCloseImportProfile();
                    return;
                case 2:
                    handleOpenSnackbar("Empty import file","error")
                    handleCloseImportProfile();
                    return;
                case 3:
                    handleOpenSnackbar("Incorrect import format","error")
                    handleCloseImportProfile();
                    return;
                case 4:
                    handleOpenSnackbar("JSON read error","error")
                    handleCloseImportProfile();
                    return;
                case 5:
                    handleOpenSnackbar("Import canceled","info")
                    handleCloseImportProfile();
                    return;
            }
            profiles = arg.response;
            handleOpenSnackbar("Profiles imported","success")
            handleCloseImportProfile();
        })
    }


    //Export PROFILE
    const [openExportProfile, setOpenExportProfile] = React.useState(false);
    const [ExportSearch,setExportSearch] = React.useState("")
    const handleExportSearchChange = (event) => {
        exportFormats = []
        if(event.target.value === "") {
            exportFormats = botTypes;
            setExportSearch(event.target.value);
            return;
        }
        for(const botType of botTypes) {
            if(botType.label.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1 ||botType.value.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1) {
                exportFormats.push(botType)
            }
        }
        setExportSearch(event.target.value)
    }
    const handleExportFormatChange = (value) => {

        for(const each of botTypes){
            if(each.value == value){
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

    const handleOpenExportProfile = () => {
        setOpenExportProfile(true);
    };
    const handleCloseExportProfile = () => {
        exportFormats = botTypes;
        resetBotTypes()
        setExportSearch("")
        handleProfileSelectorClose()
        setOpenExportProfile(false);
    };
    const handleExportProfile = () => {
        handleProfileSelectorStart()
        handleOpenExportProfile()
    }
    const confirmExportProfile = () => {
        let exportValues = [];
        let exportProfiles = [];
        for(const each of botTypes){
            if(each.checked) {
                exportValues.push(each.value)
            }
        }
        exportProfiles = getCheckedInProfileSelector()


        if(exportValues.length === 0) {
            handleOpenSnackbar("No export format selected","error")
            return
        }
        if(exportProfiles.length === 0) {
            handleOpenSnackbar("No export profiles selected","error")
            return
        }

        ipcRenderer.send('exportProfiles', {
            group:group,
            profiles:exportProfiles,
            types:exportValues
        })
        ipcRenderer.on('exportProfiles', (event,arg) => {
            switch(arg.response) {
                case 1:
                    handleOpenSnackbar("Error writing file","error")
                    handleCloseImportProfile();
                    return;
                case 2:
                    handleOpenSnackbar("Empty writing directories","error")
                    handleCloseImportProfile();
                    return;
                case 3:
                    handleOpenSnackbar("Error converting formats","error")
                    handleCloseImportProfile();
                    return;
                case 4:
                    handleOpenSnackbar("Error parsing data","error")
                    handleCloseImportProfile();
                    return;
            }
            handleCloseExportProfile();
            handleOpenSnackbar("Profiles exported to desktop","success")
        })
    }





    let profileGroups = <></>;
    let profileItems = <></>;
    let profileGroupCount = "";

    try {
        console.log("UPDATING GROUPS")
        
        if(profiles["groups"].length !== 0) {
            profileGroupCount = profiles["groups"][group]["profiles"].length
            profileGroups = profiles["groups"].map((group,index) =>  
                <GroupPanelSlim
                    name={group["name"]} 
                    content={group["profiles"]} 
                    type="profiles" 
                    index={index} 
                    key={index}
                    switchGroup={group => handleGroupChange(group)} 
                    editGroup={group => handleGroupEdit(group)}
                    deleteGroup={group => handleGroupDelete(group)}
                />)
    
    
            if(profiles["groups"][group]["profiles"].length !== 0) {

                profileItems = profiles["groups"][group]["profiles"].map((profile,index) =>  
                    <ProfilesPanel 
                        key={index}
                        index={index}
                        lastFour={profile["card"]["no"].substring(12,16)}
                        profileName={profile["profile_name"]}
                        cardType={profile["card"]["type"]}



                        name={profile["billing"]["name"]}
                        street={profile["billing"]["line1"]}
                        zip={profile["billing"]["post_code"]}
                        state={profile["billing"]["state"]}
                        city={profile["billing"]["city"]}

                        editProfile={index => handleEditProfile(index)}
                        deleteProfile={index => handleDeleteProfile(index)}
                    />)

            } else {
                profileItems = <EmptyPanel type="profiles" text="Import some profiles"/>
            }
    
        }
        else {
            profileGroupCount = 0
            profileGroups = <EmptyPanel type="group" text="Add a group"/>
            profileItems = <EmptyPanel type="proxy" text="Import some profiles"/>
        }
        
    }
    catch(err) {
        console.log(err)
        forceUpdate()
    }

    let profileCount = 0;
    try {
        console.log("UPDATING PROFILES")
        for(var i = 0; i < profiles["groups"].length; i++) {
            for(var j = 0; j < profiles["groups"][i]["profiles"].length; j++) {
                profileCount++;
            }
        }
    }
    catch(err) {
        console.log(err)
        forceUpdate()
    }








    const [snackBarOpen, setOpenSnackBar] = React.useState(false);
    const [snackBarText,setSnackBarText] = React.useState('Success!');
    const [snackBarSeverity,setSnackBarSeverity] = React.useState('error');

    const handleOpenSnackbar = (text,severity) => {
        ipcRenderer.send('addNotification', {
            type:severity.toUpperCase(),
            title:"PROFILES",
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









    // ADD GROUP
    const [groupAdd, setGroupAdd] = React.useState("")
    const handleGroupAddChange = (event) => {setGroupAdd(event.target.value)};
    const handleGroupAdd = () => {
        setGroupAdd("")
        handleOpenAddGroup();
    }
    const confirmGroupAdd = () => {
        ipcRenderer.send('addProfilesGroup', {name:groupAdd})
        ipcRenderer.on('addProfilesGroup', (event,arg) => {
            profiles = arg.profiles
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
            groupName: profiles["groups"][index]["name"]
        });
        setOpenEditGroup(true)
    }
    const confirmGroupEdit = () => {
        ipcRenderer.send('editProfilesGroup', {index:groupEdit.groupIndex,name:groupEdit.groupName})
        ipcRenderer.on('editProfilesGroup', (event,arg) => {
            profiles = arg.profiles
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
        ipcRenderer.send('deleteProfilesGroup', {index:groupDelete})
        ipcRenderer.on('deleteProfilesGroup', (event,arg) => {
            profiles = arg.profiles
            setGroup(0)
            handleCloseDeleteGroup();
        })
        
    }

    const [openDeleteGroup, setOpenDeleteGroup] = React.useState(false);
    const handleOpenDeleteGroup = () => {setOpenDeleteGroup(true);};
    const handleCloseDeleteGroup = () => {setOpenDeleteGroup(false);}










    return(

        <div className="page">

            <div className="page_header">
                <div className="page_header-section">
                    <h6 className="page_title">Profiles</h6>
                    <div className="page_subtitle-container">
                        <span className="page_subtitle">You have </span>
                        <span className="page_subtitle" style={{color:"#F1F1F2"}}>{profileCount} profiles</span>
                        <span className="page_subtitle"> available. </span>
                    </div>
                </div>
            </div>
            <div className="page_body">
                <div className="page_body-header">
                    <div className="button_group" style={{width:"170px"}}>
                        <Button color="#15BABE" text="Import" width="71px" clicked={() => handleImportProfile()} />
                        <Button color="#D85059" text="Export" width="71px" clicked={() => handleExportProfile()} />
                    </div>
                    <div style={{width:"160px"}}>
                        <Button color="#15BABE" text="Add Profile" icon="add" clicked={() => handleAddProfile()} />
                    </div>                  
                </div>

                <div className="page_main-body">
                    <div className="page_body-col">
                        <DotTitle color="#1AE9B5" title={`${profileGroupCount} GROUPS`} />
                        <div className="page_body-cols-container">
                            {profileGroups}
                            <Button icon="add" color="#1D1D27" border="1px solid #343444" width="95%" clicked={handleGroupAdd} />
                        </div>
                        
                    </div>
                    <div className="page_body-col" style={{width:"67%"}}>
                        <DotTitle color="#1AE9B5" title={profileGroupCount + " PROFILES"} />
                        <div className="page_body-cols-container" style={{display:"flex",flexWrap:"wrap",alignItems:"flex-start",alignContent:"flex-start",height:"calc(100% - 69px)"}}>
                            {profileItems}
                        </div>
                        <div className="button_group" style={{width:"100%", height:"31px",justifyContent:"flex-end",marginTop:"12px"}}>
                            <div className="button_group" style={{width:"400px"}}>
                            <Button color="#15BABE" text="Jig Profiles" clicked={() => handleJigProfile()} />
                            <Button color="#15BABE" text="Duplicate Group" clicked={() => handleDuplicateProfile()} />
                            <Button color="#15BABE" text="Move Profiles" clicked={() => handleMoveProfile()} />
                            </div>
                            
                        </div>
                    </div>
                    
                </div>





            </div>

        <ThemeProvider theme={theme}>
            <Modal
                    className={classes.modal}
                    open={openAddProfile}
                    onClose={handleCloseAddProfile}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                    timeout: 500,
                    }}
                >
                    <Fade in={openAddProfile}>
                    <div className={classes.paper}>

                        <div className="popup-container" style={{width:"900px",height:"620px"}}>
                            <div className="popup-header">
                            <svg className="window_icon" width="15" height="15" viewBox="0 0 13 13" onClick={handleCloseAddProfile}>
                                <path d="M0.271972 0.271972C0.634602 -0.0906574 1.22254 -0.0906574 1.58517 0.271972L6.5 5.1868L11.4148 0.271972C11.7775 -0.0906574 12.3654 -0.0906574 12.728 0.271972C13.0907 0.634602 13.0907 1.22254 12.728 1.58517L7.8132 6.5L12.728 11.4148C13.0907 11.7775 13.0907 12.3654 12.728 12.728C12.3654 13.0907 11.7775 13.0907 11.4148 12.728L6.5 7.8132L1.58517 12.728C1.22254 13.0907 0.634602 13.0907 0.271972 12.728C-0.0906574 12.3654 -0.0906574 11.7775 0.271972 11.4148L5.1868 6.5L0.271972 1.58517C-0.0906574 1.22254 -0.0906574 0.634602 0.271972 0.271972Z"/>
                            </svg>
                            </div>

                            <div className="popup-body">
                                <div className="popup-section" style={{width:"39%"}}>
                                    <CardPanel cardType={profileData.cardProvider} name={profileData.profileName} month={profileData.cardExpiryMonth} year={profileData.cardExpiryYear} cardNumber={profileData.cardNumber}/>
                                    
                                    <div>
                                    <TextField
                                        name="profileName"
                                        className={classes.inputFull}
                                        label="Profile Name"
                                        value={profileData.profileName}
                                        onChange={handleProfileDataChange}
                                        variant="outlined"
                                        margin="dense"
                                    >
                                    </TextField>
                                    <TextField
                                        name="profileEmail"
                                        className={classes.inputFull}
                                        label="Email Address"
                                        value={profileData.profileEmail}
                                        onChange={handleProfileDataChange}
                                        variant="outlined"
                                        margin="dense"
                                    >
                                    </TextField>

                                    <p className="popup-section_title" style={{marginTop:"24px"}}>Payment</p>
                                    <div className="popup-section_container">
                                        <TextField
                                            name="cardFirstName"
                                            className={classes.inputHalf}
                                            label="First Name"
                                            value={profileData.cardFirstName}
                                            onChange={handleProfileDataChange}
                                            variant="outlined"
                                            margin="dense"
                                        >
                                        </TextField>
                                        <TextField
                                            name="cardLastName"
                                            className={classes.inputHalf}
                                            label="Last Name"
                                            value={profileData.cardLastName}
                                            onChange={handleProfileDataChange}
                                            variant="outlined"
                                            margin="dense"
                                        >
                                        </TextField>
                                    </div>
                                    <TextField
                                        name="cardNumber"
                                        className={classes.inputFull}
                                        label="Card Number"
                                        value={profileData.cardNumber}
                                        onChange={handleProfileDataChange}
                                        inputProps={{ maxLength: 16 }}
                                        
                                        variant="outlined"
                                        margin="dense"
                                    >
                                    </TextField>

                                    <div className="popup-section_container">
                                        <TextField
                                            select
                                            name="cardExpiryMonth"
                                            className={classes.inputHalf}
                                            label="Expiry Month"
                                            value={profileData.cardExpiryMonth}
                                            onChange={handleProfileDataChange}
                                            variant="outlined"
                                            margin="dense"
                                        >
                                            {expiryMonths.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                                </MenuItem>
                                            ))}

                                        </TextField>
                                        <TextField
                                            select
                                            name="cardExpiryYear"
                                            className={classes.inputHalf}
                                            label="Expiry Year"
                                            value={profileData.cardExpiryYear}
                                            onChange={handleProfileDataChange}
                                            variant="outlined"
                                            margin="dense"
                                        >
                                            {expiryYears.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </div>

                                    <div className="popup-section_container">
                                        <TextField
                                            select
                                            name="cardProvider"
                                            className={classes.inputHalf}
                                            label="Provider"
                                            value={profileData.cardProvider}
                                            onChange={handleProfileDataChange}
                                            variant="outlined"
                                            margin="dense"
                                        >
                                            {cardProviders.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                        <TextField
                                            name="cardCVV"
                                            className={classes.inputHalf}
                                            label="CVV"
                                            value={profileData.cardCVV}
                                            onChange={handleProfileDataChange}
                                            variant="outlined"
                                            margin="dense"
                                            inputProps={{ maxLength: 3 }}
                                        >
                                        </TextField>
                                    </div>
                                    </div>

                                </div>
                                <div className="popup-section" style={{width:"56%"}}>
                                    <div>
                                        <p className="popup-section_title">Shipping</p>
                                        <div className="popup-section_container">
                                            <TextField
                                                name="shippingName"
                                                className={classes.inputHalf}
                                                label="Shipping Name"
                                                
                                                value={profileData.shippingName}
                                                onChange={handleProfileDataChange}
                                                variant="outlined"
                                                margin="dense"
                                            >
                                            </TextField>
                                            <TextField
                                                name="shippingPhone"
                                                className={classes.inputHalf}
                                                label="Phone Number"
                                                value={profileData.shippingPhone}
                                                onChange={handleProfileDataChange}
                                                variant="outlined"
                                                margin="dense"
                                            >
                                            </TextField>
                                        </div>
                                        <div className="popup-section_container">
                                            <TextField
                                                name="shippingAddressLine1"
                                                className={classes.inputHalf}
                                                label="Address Line 1"
                                                value={profileData.shippingAddressLine1}
                                                onChange={handleProfileDataChange}
                                                variant="outlined"
                                                margin="dense"
                                            >
                                            </TextField>
                                            <TextField
                                                name="shippingAddressLine2"
                                                className={classes.inputHalf}
                                                label="Address Line 2"
                                                value={profileData.shippingAddressLine2}
                                                onChange={handleProfileDataChange}
                                                variant="outlined"
                                                margin="dense"
                                            >
                                            </TextField>
                                        </div>
                                        <div className="popup-section_container">
                                            <TextField
                                                
                                                name="shippingCity"
                                                className={classes.inputHalf}
                                                label="City"
                                                value={profileData.shippingCity}
                                                onChange={handleProfileDataChange}
                                                variant="outlined"
                                                margin="dense"
                                            >
                                            </TextField>
                                            <TextField
                                                
                                                name="shippingPostalCode"
                                                className={classes.inputHalf}
                                                label="Postal Code"
                                                value={profileData.shippingPostalCode}
                                                onChange={handleProfileDataChange}
                                                variant="outlined"
                                                margin="dense"
                                            >
                                            </TextField>
                                        </div>
                                        <div className="popup-section_container">
                                            <TextField
                                                select
                                                name="shippingState"
                                                className={classes.inputHalf}
                                                label="State"
                                                value={profileData.shippingState}
                                                onChange={handleProfileDataChange}
                                                variant="outlined"
                                                margin="dense"
                                            >
                                            <MenuItem key="" value="">
                                                ...
                                            </MenuItem>
                                                {
                                                State.getStatesOfCountry(profileData.shippingCountry).map((option) => (
                                                    
                                                    <MenuItem key={option.name} value={option.name}>
                                                        {option.name}
                                                    </MenuItem>
                                                ))}
                                            </TextField>


                                            
                                            <TextField
                                                select
                                                name="shippingCountry"
                                                className={classes.inputHalf}
                                                label="Country"
                                                value={profileData.shippingCountry}
                                                onChange={handleProfileDataChange}
                                                variant="outlined"
                                                margin="dense"
                                            >
                                            <MenuItem key="" value="">
                                                ...
                                            </MenuItem>
                                                {Country.getAllCountries().map((option) => (
                                                    
                                                    <MenuItem key={option.isoCode} value={option.isoCode}>
                                                        {option.name}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                            
                                        </div>
                                    </div>
                                    <div>
                                        <p className="popup-section_title">Billing</p>
                                        <div className="popup-section_container">
                                            <TextField
                                                name="billingName"
                                                className={classes.inputHalf}
                                                label="Billing Name"
                                                value={profileData.billingName}
                                                onChange={handleProfileDataChange}
                                                variant="outlined"
                                                margin="dense"
                                                disabled={checkboxState.checkedSameBillingAndShipping}
                                            >
                                            </TextField>
                                            <TextField
                                                name="billingPhone"
                                                className={classes.inputHalf}
                                                label="Phone Number"
                                                value={profileData.billingPhone}
                                                onChange={handleProfileDataChange}
                                                variant="outlined"
                                                margin="dense"
                                                disabled={checkboxState.checkedSameBillingAndShipping}
                                            >
                                            </TextField>
                                        </div>
                                        <div className="popup-section_container">
                                            <TextField
                                                name="billingAddressLine1"
                                                className={classes.inputHalf}
                                                label="Address Line 1"
                                                value={profileData.billingAddressLine1}
                                                onChange={handleProfileDataChange}
                                                variant="outlined"
                                                margin="dense"
                                                disabled={checkboxState.checkedSameBillingAndShipping}
                                            >
                                            </TextField>
                                            <TextField
                                                name="billingAddressLine2"
                                                className={classes.inputHalf}
                                                label="Address Line 2"
                                                value={profileData.billingAddressLine2}
                                                onChange={handleProfileDataChange}
                                                variant="outlined"
                                                margin="dense"
                                                disabled={checkboxState.checkedSameBillingAndShipping}
                                            >
                                            </TextField>
                                        </div>
                                        <div className="popup-section_container">
                                            <TextField
                                                
                                                name="billingCity"
                                                className={classes.inputHalf}
                                                label="City"
                                                value={profileData.billingCity}
                                                onChange={handleProfileDataChange}
                                                variant="outlined"
                                                margin="dense"
                                                disabled={checkboxState.checkedSameBillingAndShipping}
                                            >
                                            </TextField>
                                            <TextField
                                                
                                                name="billingPostalCode"
                                                className={classes.inputHalf}
                                                label="Postal Code"
                                                value={profileData.billingPostalCode}
                                                onChange={handleProfileDataChange}
                                                variant="outlined"
                                                margin="dense"
                                                disabled={checkboxState.checkedSameBillingAndShipping}
                                            >
                                            </TextField>
                                        </div>
                                        <div className="popup-section_container">
                                            <TextField
                                                select
                                                name="billingState"
                                                className={classes.inputHalf}
                                                label="State"
                                                value={profileData.billingState}
                                                onChange={handleProfileDataChange}
                                                variant="outlined"
                                                margin="dense"
                                                disabled={checkboxState.checkedSameBillingAndShipping}
                                            >
                                            <MenuItem key="" value="">
                                                ...
                                            </MenuItem>
                                            {
                                            State.getStatesOfCountry(profileData.billingCountry).map((option) => (
                                                
                                                <MenuItem key={option.name} value={option.name}>
                                                    {option.name}
                                                </MenuItem>
                                            ))}
                                            </TextField>
                                            <TextField
                                                select
                                                name="billingCountry"
                                                className={classes.inputHalf}
                                                label="Country"
                                                value={profileData.billingCountry}
                                                onChange={handleProfileDataChange}
                                                variant="outlined"
                                                margin="dense"
                                                disabled={checkboxState.checkedSameBillingAndShipping}
                                            >
                                            {Country.getAllCountries().map((option) => (
                                                    
                                                <MenuItem key={option.isoCode} value={option.isoCode}>
                                                    {option.name}
                                                </MenuItem>
                                            ))}
                                            </TextField>
                                        </div>
                                    </div>

                                </div>
                                
                            </div>

                            <div className="popup-footer">
                                <div className="checkbox_container">
                                    <GreenCheckbox color="secondary" checked={checkboxState.checkedOneCheckout} onChange={handleCheckboxChange} name="checkedOneCheckout" />
                                    <span className="checkbox_container-text">One Checkout Per Profile</span>
                                </div>
                                
                                <div className="checkbox_container">
                                <GreenCheckbox color="secondary" checked={checkboxState.checkedSameBillingAndShipping} onChange={handleCheckboxChange} name="checkedSameBillingAndShipping" />
                                    <span className="checkbox_container-text">Same Shipping and Billing</span>
                                </div>
                                
                                <Button text="Save Profile" icon="save" clicked={() => handleAddProfileConfirm()} />
                            </div>

                        </div>

                    </div>
                    </Fade>
            </Modal>
            
            <Modal
                    className={classes.modal}
                    open={openEditProfile}
                    onClose={handleCloseEditProfile}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                    timeout: 500,
                    }}
                >
                    <Fade in={openEditProfile}>
                    <div className={classes.paper}>

                        <div className="popup-container" style={{width:"900px",height:"620px"}}>
                            <div className="popup-header">
                            <svg className="window_icon" width="15" height="15" viewBox="0 0 13 13" onClick={handleCloseEditProfile}>
                                <path d="M0.271972 0.271972C0.634602 -0.0906574 1.22254 -0.0906574 1.58517 0.271972L6.5 5.1868L11.4148 0.271972C11.7775 -0.0906574 12.3654 -0.0906574 12.728 0.271972C13.0907 0.634602 13.0907 1.22254 12.728 1.58517L7.8132 6.5L12.728 11.4148C13.0907 11.7775 13.0907 12.3654 12.728 12.728C12.3654 13.0907 11.7775 13.0907 11.4148 12.728L6.5 7.8132L1.58517 12.728C1.22254 13.0907 0.634602 13.0907 0.271972 12.728C-0.0906574 12.3654 -0.0906574 11.7775 0.271972 11.4148L5.1868 6.5L0.271972 1.58517C-0.0906574 1.22254 -0.0906574 0.634602 0.271972 0.271972Z"/>
                            </svg>
                            </div>

                            <div className="popup-body">
                                <div className="popup-section" style={{width:"39%"}}>
                                    <CardPanel cardType={profileData.cardProvider} name={profileData.profileName} month={profileData.cardExpiryMonth} year={profileData.cardExpiryYear} cardNumber={profileData.cardNumber}/>
                                    
                                    <div>
                                    <TextField
                                        name="profileName"
                                        className={classes.inputFull}
                                        label="Profile Name"
                                        value={profileData.profileName}
                                        onChange={handleProfileDataChange}
                                        variant="outlined"
                                        margin="dense"
                                    >
                                    </TextField>
                                    <TextField
                                        name="profileEmail"
                                        className={classes.inputFull}
                                        label="Email Address"
                                        value={profileData.profileEmail}
                                        onChange={handleProfileDataChange}
                                        variant="outlined"
                                        margin="dense"
                                    >
                                    </TextField>

                                    <p className="popup-section_title" style={{marginTop:"24px"}}>Payment</p>
                                    <div className="popup-section_container">
                                        <TextField
                                            name="cardFirstName"
                                            className={classes.inputHalf}
                                            label="First Name"
                                            value={profileData.cardFirstName}
                                            onChange={handleProfileDataChange}
                                            variant="outlined"
                                            margin="dense"
                                        >
                                        </TextField>
                                        <TextField
                                            name="cardLastName"
                                            className={classes.inputHalf}
                                            label="Last Name"
                                            value={profileData.cardLastName}
                                            onChange={handleProfileDataChange}
                                            variant="outlined"
                                            margin="dense"
                                        >
                                        </TextField>
                                    </div>
                                    <TextField
                                        name="cardNumber"
                                        className={classes.inputFull}
                                        label="Card Number"
                                        value={profileData.cardNumber}
                                        onChange={handleProfileDataChange}
                                        inputProps={{ maxLength: 16 }}
                                        
                                        variant="outlined"
                                        margin="dense"
                                    >
                                    </TextField>

                                    <div className="popup-section_container">
                                        <TextField
                                            select
                                            name="cardExpiryMonth"
                                            className={classes.inputHalf}
                                            label="Expiry Month"
                                            value={profileData.cardExpiryMonth}
                                            onChange={handleProfileDataChange}
                                            variant="outlined"
                                            margin="dense"
                                        >
                                            {expiryMonths.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                                </MenuItem>
                                            ))}

                                        </TextField>
                                        <TextField
                                            select
                                            name="cardExpiryYear"
                                            className={classes.inputHalf}
                                            label="Expiry Year"
                                            value={profileData.cardExpiryYear}
                                            onChange={handleProfileDataChange}
                                            variant="outlined"
                                            margin="dense"
                                        >
                                            {expiryYears.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </div>

                                    <div className="popup-section_container">
                                        <TextField
                                            select
                                            name="cardProvider"
                                            className={classes.inputHalf}
                                            label="Provider"
                                            value={profileData.cardProvider}
                                            onChange={handleProfileDataChange}
                                            variant="outlined"
                                            margin="dense"
                                        >
                                            {cardProviders.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                        <TextField
                                            name="cardCVV"
                                            className={classes.inputHalf}
                                            label="CVV"
                                            value={profileData.cardCVV}
                                            onChange={handleProfileDataChange}
                                            variant="outlined"
                                            margin="dense"
                                            inputProps={{ maxLength: 3 }}
                                        >
                                        </TextField>
                                    </div>
                                    </div>

                                </div>
                                <div className="popup-section" style={{width:"56%"}}>
                                    <div>
                                        <p className="popup-section_title">Shipping</p>
                                        <div className="popup-section_container">
                                            <TextField
                                                name="shippingName"
                                                className={classes.inputHalf}
                                                label="Shipping Name"
                                                
                                                value={profileData.shippingName}
                                                onChange={handleProfileDataChange}
                                                variant="outlined"
                                                margin="dense"
                                            >
                                            </TextField>
                                            <TextField
                                                name="shippingPhone"
                                                className={classes.inputHalf}
                                                label="Phone Number"
                                                value={profileData.shippingPhone}
                                                onChange={handleProfileDataChange}
                                                variant="outlined"
                                                margin="dense"
                                            >
                                            </TextField>
                                        </div>
                                        <div className="popup-section_container">
                                            <TextField
                                                name="shippingAddressLine1"
                                                className={classes.inputHalf}
                                                label="Address Line 1"
                                                value={profileData.shippingAddressLine1}
                                                onChange={handleProfileDataChange}
                                                variant="outlined"
                                                margin="dense"
                                            >
                                            </TextField>
                                            <TextField
                                                name="shippingAddressLine2"
                                                className={classes.inputHalf}
                                                label="Address Line 2"
                                                value={profileData.shippingAddressLine2}
                                                onChange={handleProfileDataChange}
                                                variant="outlined"
                                                margin="dense"
                                            >
                                            </TextField>
                                        </div>
                                        <div className="popup-section_container">
                                            <TextField
                                                
                                                name="shippingCity"
                                                className={classes.inputHalf}
                                                label="City"
                                                value={profileData.shippingCity}
                                                onChange={handleProfileDataChange}
                                                variant="outlined"
                                                margin="dense"
                                            >
                                            </TextField>
                                            <TextField
                                                
                                                name="shippingPostalCode"
                                                className={classes.inputHalf}
                                                label="Postal Code"
                                                value={profileData.shippingPostalCode}
                                                onChange={handleProfileDataChange}
                                                variant="outlined"
                                                margin="dense"
                                            >
                                            </TextField>
                                        </div>
                                        <div className="popup-section_container">
                                            <TextField
                                                select
                                                name="shippingState"
                                                className={classes.inputHalf}
                                                label="State"
                                                value={profileData.shippingState}
                                                onChange={handleProfileDataChange}
                                                variant="outlined"
                                                margin="dense"
                                            >
                                            <MenuItem key="" value="">
                                                ...
                                            </MenuItem>
                                                {
                                                State.getStatesOfCountry(profileData.shippingCountry).map((option) => (
                                                    
                                                    <MenuItem key={option.name} value={option.name}>
                                                        {option.name}
                                                    </MenuItem>
                                                ))}
                                            </TextField>


                                            
                                            <TextField
                                                select
                                                name="shippingCountry"
                                                className={classes.inputHalf}
                                                label="Country"
                                                value={profileData.shippingCountry}
                                                onChange={handleProfileDataChange}
                                                variant="outlined"
                                                margin="dense"
                                            >
                                            <MenuItem key="" value="">
                                                ...
                                            </MenuItem>
                                                {Country.getAllCountries().map((option) => (
                                                    
                                                    <MenuItem key={option.isoCode} value={option.isoCode}>
                                                        {option.name}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                            
                                        </div>
                                    </div>
                                    <div>
                                        <p className="popup-section_title">Billing</p>
                                        <div className="popup-section_container">
                                            <TextField
                                                name="billingName"
                                                className={classes.inputHalf}
                                                label="Billing Name"
                                                value={profileData.billingName}
                                                onChange={handleProfileDataChange}
                                                variant="outlined"
                                                margin="dense"
                                                disabled={checkboxState.checkedSameBillingAndShipping}
                                            >
                                            </TextField>
                                            <TextField
                                                name="billingPhone"
                                                className={classes.inputHalf}
                                                label="Phone Number"
                                                value={profileData.billingPhone}
                                                onChange={handleProfileDataChange}
                                                variant="outlined"
                                                margin="dense"
                                                disabled={checkboxState.checkedSameBillingAndShipping}
                                            >
                                            </TextField>
                                        </div>
                                        <div className="popup-section_container">
                                            <TextField
                                                name="billingAddressLine1"
                                                className={classes.inputHalf}
                                                label="Address Line 1"
                                                value={profileData.billingAddressLine1}
                                                onChange={handleProfileDataChange}
                                                variant="outlined"
                                                margin="dense"
                                                disabled={checkboxState.checkedSameBillingAndShipping}
                                            >
                                            </TextField>
                                            <TextField
                                                name="billingAddressLine2"
                                                className={classes.inputHalf}
                                                label="Address Line 2"
                                                value={profileData.billingAddressLine2}
                                                onChange={handleProfileDataChange}
                                                variant="outlined"
                                                margin="dense"
                                                disabled={checkboxState.checkedSameBillingAndShipping}
                                            >
                                            </TextField>
                                        </div>
                                        <div className="popup-section_container">
                                            <TextField
                                                
                                                name="billingCity"
                                                className={classes.inputHalf}
                                                label="City"
                                                value={profileData.billingCity}
                                                onChange={handleProfileDataChange}
                                                variant="outlined"
                                                margin="dense"
                                                disabled={checkboxState.checkedSameBillingAndShipping}
                                            >
                                            </TextField>
                                            <TextField
                                                
                                                name="billingPostalCode"
                                                className={classes.inputHalf}
                                                label="Postal Code"
                                                value={profileData.billingPostalCode}
                                                onChange={handleProfileDataChange}
                                                variant="outlined"
                                                margin="dense"
                                                disabled={checkboxState.checkedSameBillingAndShipping}
                                            >
                                            </TextField>
                                        </div>
                                        <div className="popup-section_container">
                                            <TextField
                                                select
                                                name="billingState"
                                                className={classes.inputHalf}
                                                label="State"
                                                value={profileData.billingState}
                                                onChange={handleProfileDataChange}
                                                variant="outlined"
                                                margin="dense"
                                                disabled={checkboxState.checkedSameBillingAndShipping}
                                            >
                                            <MenuItem key="" value="">
                                                ...
                                            </MenuItem>
                                            {
                                            State.getStatesOfCountry(profileData.billingCountry).map((option) => (
                                                
                                                <MenuItem key={option.name} value={option.name}>
                                                    {option.name}
                                                </MenuItem>
                                            ))}
                                            </TextField>
                                            <TextField
                                                select
                                                name="billingCountry"
                                                className={classes.inputHalf}
                                                label="Country"
                                                value={profileData.billingCountry}
                                                onChange={handleProfileDataChange}
                                                variant="outlined"
                                                margin="dense"
                                                disabled={checkboxState.checkedSameBillingAndShipping}
                                            >
                                            {Country.getAllCountries().map((option) => (
                                                    
                                                <MenuItem key={option.isoCode} value={option.isoCode}>
                                                    {option.name}
                                                </MenuItem>
                                            ))}
                                            </TextField>
                                        </div>
                                    </div>

                                </div>
                                
                            </div>

                            <div className="popup-footer">
                                <div className="checkbox_container">
                                    <GreenCheckbox color="secondary" checked={checkboxState.checkedOneCheckout} onChange={handleCheckboxChange} name="checkedOneCheckout" />
                                    <span className="checkbox_container-text">One Checkout Per Profile</span>
                                </div>
                                
                                <div className="checkbox_container">
                                <GreenCheckbox color="secondary" checked={checkboxState.checkedSameBillingAndShipping} onChange={handleCheckboxChange} name="checkedSameBillingAndShipping" />
                                    <span className="checkbox_container-text">Same Shipping and Billing</span>
                                </div>
                                
                                <Button text="Save Profile" icon="save" clicked={() => handleEditProfileConfirm()}/>
                            </div>

                        </div>

                    </div>
                    </Fade>
            </Modal>

            <Modal
                className={classes.modal}
                open={openJigProfile}
                onClose={handleCloseJigProfile}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                timeout: 500,
                }}
            >
                <Fade in={openJigProfile}>
                <div className={classes.paper}>

                    <div className="popup-container" style={{width:"700px",height:"620px"}}>
                        <div className="popup-header" style={{marginBottom:"20px"}}>
                            <span className="popup-section_title">Jig Profiles</span>
                            <svg className="window_icon" width="15" height="15" viewBox="0 0 13 13" onClick={handleCloseJigProfile}>
                                <path d="M0.271972 0.271972C0.634602 -0.0906574 1.22254 -0.0906574 1.58517 0.271972L6.5 5.1868L11.4148 0.271972C11.7775 -0.0906574 12.3654 -0.0906574 12.728 0.271972C13.0907 0.634602 13.0907 1.22254 12.728 1.58517L7.8132 6.5L12.728 11.4148C13.0907 11.7775 13.0907 12.3654 12.728 12.728C12.3654 13.0907 11.7775 13.0907 11.4148 12.728L6.5 7.8132L1.58517 12.728C1.22254 13.0907 0.634602 13.0907 0.271972 12.728C-0.0906574 12.3654 -0.0906574 11.7775 0.271972 11.4148L5.1868 6.5L0.271972 1.58517C-0.0906574 1.22254 -0.0906574 0.634602 0.271972 0.271972Z"/>
                            </svg>
                        </div>
                        <div className="popup-flex_container">
                            <div className="popup-flex_half" style={{width:"30%"}}>
                            <div className="popup-flex_container" style={{height:"100%"}}>
                                <List className={classes.list} style={{width:"100%",marginTop:"0px",height:"94%"}} component="nav" aria-label="Bot Import" dense="True">
                                    <ListItem dense button onClick={handleProfileSelectorCheckAllChange}>
                                        <ListItemIcon>
                                            <GreenCheckbox 
                                                color="secondary"
                                                checked={profileSelectorCheckAll} 
                                                />
                                        </ListItemIcon>
                                        <ListItemText primary="CHECK ALL" className={classes.listText}/>
                                    </ListItem>
                                    <Divider style={{width:"100%"}}/>
                                    {profileSelector.map( (profile,index) => 
                                    <ListItem key={profile["id"]} value={profile["id"]} dense button onClick={() => handleProfileSelectorChange(profile["id"])}>
                                        <ListItemIcon>
                                            <GreenCheckbox 
                                            color="secondary"
                                            checked={profile["checked"]} 
                                            
                                            value={profile["id"]} 
                                            key={profile["id"]}
                                            />
                                        </ListItemIcon>
                                        <ListItemText id={profile["id"]} primary={profile["name"]} className={classes.listText}/>
                                    </ListItem>
                                    )}
                                </List>

                            </div>
                            </div>


                            <div className="popup-flex_half" style={{width:"65%"}}>
                                <div className="popup-flex_wrapper" style={{marginBottom:"10px"}}>
                                    <span className="page_title" style={{fontSize:"12pt",marginRight:"10px"}}>Amount of jigs per profile: </span>
                                    <TextField
                                        name="jigAmount"
                                        className={classes.inputSmall}
                                        value={jigParams.jigAmount}
                                        onChange={handleJigParamChange}
                                        margin="dense"
                                    ></TextField>
                                </div>
                                <div className="popup-flex_wrapper" style={{marginBottom:"10px"}}>
                                    <div>
                                        <div className="checkbox_container" style={{width:"131px"}}>
                                            <Switch 
                                                checked={jigOptions.firstName} 
                                                value={jigOptions.firstName}
                                                onChange={handleJigOptionsChange} 
                                                name="firstName" 
                                                color="secondary"
                                            />
                                            <span className="checkbox_container-text" style={{fontSize:"12pt"}}>First Name</span>
                                        </div>
                                        <div className="checkbox_container" style={{width:"130px"}}>
                                            <Switch 
                                                checked={jigOptions.lastName} 
                                                value={jigOptions.lastName}
                                                onChange={handleJigOptionsChange} 
                                                name="lastName" 
                                                color="secondary"
                                            />
                                            <span className="checkbox_container-text" style={{fontSize:"12pt"}}>Last Name</span>
                                        </div>
                                        <div className="checkbox_container" style={{width:"134px"}}>
                                            <Switch 
                                                checked={jigOptions.cardName} 
                                                value={jigOptions.cardName}
                                                onChange={handleJigOptionsChange} 
                                                name="cardName" 
                                                color="secondary"
                                            />
                                            <span className="checkbox_container-text" style={{fontSize:"12pt"}}>Card Name</span>
                                        </div>
                                        <div className="checkbox_container" style={{width:"100px"}}>
                                            <Switch 
                                                checked={jigOptions.email} 
                                                value={jigOptions.email}
                                                onChange={handleJigOptionsChange} 
                                                name="email" 
                                                color="secondary"
                                            />
                                            <span className="checkbox_container-text" style={{fontSize:"12pt"}}>Email</span>
                                        </div>
                 
                                    </div>
                                    <div>
                                        <div className="checkbox_container" style={{width:"100px"}}>
                                            <Switch 
                                                checked={jigOptions.phone} 
                                                value={jigOptions.phone}
                                                onChange={handleJigOptionsChange} 
                                                name="phone" 
                                                color="secondary"
                                            />
                                            <span className="checkbox_container-text" style={{fontSize:"12pt"}}>Phone</span>
                                        </div>    
                                        <div className="checkbox_container" style={{width:"160px"}}>
                                            <Switch 
                                                checked={jigOptions.billingAddress} 
                                                value={jigOptions.billingAddress}
                                                onChange={handleJigOptionsChange} 
                                                name="billingAddress" 
                                                color="secondary"
                                            />
                                            <span className="checkbox_container-text" style={{fontSize:"12pt"}}>Billing Address</span>
                                        </div>
                                        <div className="checkbox_container" style={{width:"180px"}}>
                                            <Switch 
                                                checked={jigOptions.shippingAddress} 
                                                value={jigOptions.shippingAddress}
                                                onChange={handleJigOptionsChange} 
                                                name="shippingAddress" 
                                                color="secondary"
                                            />
                                            <span className="checkbox_container-text" style={{fontSize:"12pt"}}>Shipping Address</span>
                                        </div>
                                    </div>

                                </div>
                                <div className="popup-flex_wrapper" style={{marginBottom:"10px"}}>
                                    <span className="page_title" style={{fontSize:"12pt",marginRight:"10px"}}>Email Options: </span>
                                </div>
                                <div className="popup-flex_wrapper" style={{marginBottom:"10px"}}>
                                    <div>
                                        <div className="checkbox_container" style={{width:"155px"}}>
                                            <Switch 
                                                checked={jigOptions.useCatchall} 
                                                value={jigOptions.useCatchall}
                                                onChange={handleJigOptionsChange} 
                                                name="useCatchall" 
                                                color="secondary"
                                            />
                                            <span className="checkbox_container-text" style={{fontSize:"12pt"}}>Use Catchall</span>
                                        </div>
                                        <div className="checkbox_container" style={{width:"160px"}}>
                                            <Switch 
                                                checked={jigOptions.useDotTrick} 
                                                value={jigOptions.useDotTrick}
                                                onChange={handleJigOptionsChange} 
                                                name="useDotTrick" 
                                                color="secondary"
                                            />
                                            <span className="checkbox_container-text" style={{fontSize:"12pt"}}>Use Dot Trick</span>
                                        </div>
                                    </div>

                                    <TextField
                                        name="catchall"
                                        className={classes.inputMedium}
                                        value={jigParams.catchall}
                                        onChange={handleJigParamChange}
                                        margin="dense"
                                        label="Catchall"
                                        variant="outlined"
                                    ></TextField>
                                </div>
                                <div className="popup-flex_wrapper" style={{marginBottom:"20px"}}>
                                    <span className="page_title" style={{fontSize:"12pt",marginRight:"10px"}}>Address Options: </span>
                                </div>
                                <div className="popup-flex_wrapper" style={{marginBottom:"20px"}}>
                                    <div className="checkbox_container" style={{width:"100%"}}>
                                        <Switch 
                                            checked={jigOptions.line1} 
                                            value={jigOptions.line1}
                                            onChange={handleJigOptionsChange} 
                                            name="line1" 
                                            color="secondary"
                                        />
                                        <span className="checkbox_container-text" style={{fontSize:"12pt"}}>Line1</span>
                                        <TextField
                                            name="line1Pos"
                                            className={classes.inputTiny}
                                            value={jigParams.line1Pos}
                                            onChange={handleJigParamChange}
                                            margin="dense"
                                            select
                                        >
                                            <MenuItem key="0" value="0">
                                                start
                                            </MenuItem>
                                            <MenuItem key="1" value="1">
                                                end
                                            </MenuItem>
                                            <MenuItem key="2" value="2">
                                                both
                                            </MenuItem>

                                        </TextField>
                                        <span className="checkbox_container-text" style={{fontSize:"12pt"}}>Character # </span>
                                        <TextField
                                            name="line1Char"
                                            className={classes.inputTiny}
                                            value={jigParams.line1Char}
                                            onChange={handleJigParamChange}
                                            margin="dense"
                                            select
                                        >
                                            <MenuItem key="1" value="1">
                                                1
                                            </MenuItem>
                                            <MenuItem key="2" value="2">
                                                2
                                            </MenuItem>
                                            <MenuItem key="3" value="3">
                                                3
                                            </MenuItem>

                                        </TextField>
                                    </div>
                                    <div className="checkbox_container" style={{width:"100%"}}>
                                        <Switch 
                                            checked={jigOptions.line2} 
                                            value={jigOptions.line2}
                                            onChange={handleJigOptionsChange} 
                                            name="line2" 
                                            color="secondary"
                                        />
                                        <span className="checkbox_container-text" style={{fontSize:"12pt"}}>Line2</span>
                                        <TextField
                                            name="line2Pos"
                                            className={classes.inputTiny}
                                            value={jigParams.line2Pos}
                                            onChange={handleJigParamChange}
                                            margin="dense"
                                            select
                                        >
                                            <MenuItem key="0" value="0">
                                                start
                                            </MenuItem>
                                            <MenuItem key="1" value="1">
                                                end
                                            </MenuItem>
                                            <MenuItem key="2" value="2">
                                                both
                                            </MenuItem>

                                        </TextField>
                                        <span className="checkbox_container-text" style={{fontSize:"12pt"}}>Character # </span>
                                        <TextField
                                            name="line2Char"
                                            className={classes.inputTiny}
                                            value={jigParams.line2Char}
                                            onChange={handleJigParamChange}
                                            margin="dense"
                                            select
                                        >
                                            <MenuItem key="1" value="1">
                                                1
                                            </MenuItem>
                                            <MenuItem key="2" value="2">
                                                2
                                            </MenuItem>
                                            <MenuItem key="3" value="3">
                                                3
                                            </MenuItem>

                                        </TextField>
                                    </div>
                                    <div className="checkbox_container" style={{width:"180px"}}>
                                        <Switch 
                                            checked={jigOptions.apartment} 
                                            value={jigOptions.apartment}
                                            onChange={handleJigOptionsChange} 
                                            name="apartment" 
                                            color="secondary"
                                        />
                                        <span className="checkbox_container-text" style={{fontSize:"12pt"}}>Apartment Jig</span>
                                    </div>
                                </div>
                            
                            
                            </div>

                        </div>
                        <div className="button_group" style={{width:"100%",display:"flex",justifyContent:"flex-end",marginTop:"20px"}}>
                            <Button color="#15BABE" text="Confirm" width="71px" clicked={() => handleJigProfileConfirm()} />
                            
                        </div>
                    </div>

                </div>
                </Fade>
            </Modal>

            <Modal
                className={classes.modal}
                open={openDuplicateProfile}
                onClose={handleCloseDuplicateProfile}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                timeout: 500,
                }}
            >
                <Fade in={openDuplicateProfile}>
                <div className={classes.paper}>

                    <div className="popup-container" style={{width:"300px",height:"620px"}}>
                        <div className="popup-header" style={{marginBottom:"20px"}}>
                            <span className="popup-section_title">Duplicate Profiles</span>
                            <svg className="window_icon" width="15" height="15" viewBox="0 0 13 13" onClick={handleCloseDuplicateProfile}>
                                <path d="M0.271972 0.271972C0.634602 -0.0906574 1.22254 -0.0906574 1.58517 0.271972L6.5 5.1868L11.4148 0.271972C11.7775 -0.0906574 12.3654 -0.0906574 12.728 0.271972C13.0907 0.634602 13.0907 1.22254 12.728 1.58517L7.8132 6.5L12.728 11.4148C13.0907 11.7775 13.0907 12.3654 12.728 12.728C12.3654 13.0907 11.7775 13.0907 11.4148 12.728L6.5 7.8132L1.58517 12.728C1.22254 13.0907 0.634602 13.0907 0.271972 12.728C-0.0906574 12.3654 -0.0906574 11.7775 0.271972 11.4148L5.1868 6.5L0.271972 1.58517C-0.0906574 1.22254 -0.0906574 0.634602 0.271972 0.271972Z"/>
                            </svg>
                        </div>
                        <div className="popup-flex_container">
                            <div className="popup-flex_half" style={{width:"100%"}}>
                            <div className="popup-flex_container" style={{height:"100%"}}>
                                <List className={classes.list} style={{width:"100%",marginTop:"0px",height:"94%"}} component="nav" aria-label="Bot Import" dense="True">
                                    <ListItem dense button onClick={handleProfileSelectorCheckAllChange}>
                                        <ListItemIcon>
                                            <GreenCheckbox 
                                                color="secondary"
                                                checked={profileSelectorCheckAll} 
                                                />
                                        </ListItemIcon>
                                        <ListItemText primary="CHECK ALL" className={classes.listText}/>
                                    </ListItem>
                                    <Divider style={{width:"100%"}}/>
                                    {profileSelector.map( (profile,index) => 
                                    <ListItem key={profile["id"]} value={profile["id"]} dense button onClick={() => handleProfileSelectorChange(profile["id"])}>
                                        <ListItemIcon>
                                            <GreenCheckbox 
                                            color="secondary"
                                            checked={profile["checked"]} 
                                            
                                            value={profile["id"]} 
                                            key={profile["id"]}
                                            />
                                        </ListItemIcon>
                                        <ListItemText id={profile["id"]} primary={profile["name"]} className={classes.listText}/>
                                    </ListItem>
                                    )}
                                </List>

                            </div>

                        </div>

                    </div>
                    <div className="button_group" style={{width:"100%",display:"flex",justifyContent:"flex-end",marginTop:"20px"}}>
                        <Button color="#15BABE" text="Duplicate" width="71px" clicked={() => confirmDuplicateProfile()} />
                    </div>
                    </div>
                </div>
                </Fade>
            </Modal>

            <Modal
                className={classes.modal}
                open={openMoveProfile}
                onClose={handleCloseMoveProfile}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                timeout: 500,
                }}
            >
                <Fade in={openMoveProfile}>
                <div className={classes.paper}>

                    <div className="popup-container" style={{width:"300px",height:"620px"}}>
                        <div className="popup-header" style={{marginBottom:"20px"}}>
                            <span className="popup-section_title">Move Profiles</span>
                            <svg className="window_icon" width="15" height="15" viewBox="0 0 13 13" onClick={handleCloseMoveProfile}>
                                <path d="M0.271972 0.271972C0.634602 -0.0906574 1.22254 -0.0906574 1.58517 0.271972L6.5 5.1868L11.4148 0.271972C11.7775 -0.0906574 12.3654 -0.0906574 12.728 0.271972C13.0907 0.634602 13.0907 1.22254 12.728 1.58517L7.8132 6.5L12.728 11.4148C13.0907 11.7775 13.0907 12.3654 12.728 12.728C12.3654 13.0907 11.7775 13.0907 11.4148 12.728L6.5 7.8132L1.58517 12.728C1.22254 13.0907 0.634602 13.0907 0.271972 12.728C-0.0906574 12.3654 -0.0906574 11.7775 0.271972 11.4148L5.1868 6.5L0.271972 1.58517C-0.0906574 1.22254 -0.0906574 0.634602 0.271972 0.271972Z"/>
                            </svg>
                        </div>
                        <div className="popup-flex_container" style={{height:"480px"}}>
                            <div className="popup-flex_half" style={{width:"100%"}}>
                            <div className="popup-flex_container" style={{height:"100%"}}>
                                <List className={classes.list} style={{width:"100%",marginTop:"0px",height:"94%"}} component="nav" aria-label="Bot Import" dense="True">
                                    <ListItem dense button onClick={handleProfileSelectorCheckAllChange}>
                                        <ListItemIcon>
                                            <GreenCheckbox 
                                                color="secondary"
                                                checked={profileSelectorCheckAll} 
                                                />
                                        </ListItemIcon>
                                        <ListItemText primary="CHECK ALL" className={classes.listText}/>
                                    </ListItem>
                                    <Divider style={{width:"100%"}}/>
                                    {profileSelector.map( (profile,index) => 
                                    <ListItem key={profile["id"]} value={profile["id"]} dense button onClick={() => handleProfileSelectorChange(profile["id"])}>
                                        <ListItemIcon>
                                            <GreenCheckbox 
                                            color="secondary"
                                            checked={profile["checked"]} 
                                            
                                            value={profile["id"]} 
                                            key={profile["id"]}
                                            />
                                        </ListItemIcon>
                                        <ListItemText id={profile["id"]} primary={profile["name"]} className={classes.listText}/>
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
                            {profiles["groups"].map((group,index) => (
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
                open={openImportProfile}
                onClose={handleCloseImportProfile}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                timeout: 500,
                }}
            >
                <Fade in={openImportProfile}>
                <div className={classes.paper}>

                    <div className="popup-container" style={{width:"300px",height:"620px"}}>
                        <div className="popup-header" style={{marginBottom:"20px"}}>
                            <span className="popup-section_title">Import Profiles</span>
                            <svg className="window_icon" width="15" height="15" viewBox="0 0 13 13" onClick={handleCloseImportProfile}>
                                <path d="M0.271972 0.271972C0.634602 -0.0906574 1.22254 -0.0906574 1.58517 0.271972L6.5 5.1868L11.4148 0.271972C11.7775 -0.0906574 12.3654 -0.0906574 12.728 0.271972C13.0907 0.634602 13.0907 1.22254 12.728 1.58517L7.8132 6.5L12.728 11.4148C13.0907 11.7775 13.0907 12.3654 12.728 12.728C12.3654 13.0907 11.7775 13.0907 11.4148 12.728L6.5 7.8132L1.58517 12.728C1.22254 13.0907 0.634602 13.0907 0.271972 12.728C-0.0906574 12.3654 -0.0906574 11.7775 0.271972 11.4148L5.1868 6.5L0.271972 1.58517C-0.0906574 1.22254 -0.0906574 0.634602 0.271972 0.271972Z"/>
                            </svg>
                        </div>

                        <TextField
                            className={classes.inputFull}
                            placeholder="Search..."
                            value={importSearch}
                            onChange={handleImportSearchChange}
                            variant="outlined"
                            margin="dense"
                            InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <SearchIcon />
                                  </InputAdornment>
                                ),
                              }}
                        />
                        <div className="popup-flex_container">
                            <List className={classes.list} component="nav" aria-label="Bot Import" dense="True">
                            {importFormats.map((format) => (
                                <ListItem button onClick={() => confirmImportProfile(format.value)}>
                                    <ListItemText primary={format.label} className={classes.listText} />
                                </ListItem>
                            ))}

                            </List>
                        </div>

                    </div>
                    <div className="button_group" style={{width:"100%",display:"flex",justifyContent:"flex-end",marginTop:"20px"}}>
                        <Button color="#D85059" text="Cancel" width="71px" clicked={() => handleCloseImportProfile()} />
                    </div>

                </div>
                </Fade>
            </Modal>

            <Modal
                className={classes.modal}
                open={openExportProfile}
                onClose={handleCloseExportProfile}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                timeout: 500,
                }}
            >
                <Fade in={openExportProfile}>
                <div className={classes.paper}>

                    <div className="popup-container" style={{width:"640px",height:"620px"}}>
                        <div className="popup-header" style={{marginBottom:"20px"}}>
                            <span className="popup-section_title">Export Profiles</span>
                            <svg className="window_icon" width="15" height="15" viewBox="0 0 13 13" onClick={handleCloseExportProfile}>
                                <path d="M0.271972 0.271972C0.634602 -0.0906574 1.22254 -0.0906574 1.58517 0.271972L6.5 5.1868L11.4148 0.271972C11.7775 -0.0906574 12.3654 -0.0906574 12.728 0.271972C13.0907 0.634602 13.0907 1.22254 12.728 1.58517L7.8132 6.5L12.728 11.4148C13.0907 11.7775 13.0907 12.3654 12.728 12.728C12.3654 13.0907 11.7775 13.0907 11.4148 12.728L6.5 7.8132L1.58517 12.728C1.22254 13.0907 0.634602 13.0907 0.271972 12.728C-0.0906574 12.3654 -0.0906574 11.7775 0.271972 11.4148L5.1868 6.5L0.271972 1.58517C-0.0906574 1.22254 -0.0906574 0.634602 0.271972 0.271972Z"/>
                            </svg>
                        </div>
                        <div className="popup-flex_container">
                            <div className="popup-flex_half" style={{width:"48%"}}>
                                
                                <div className="popup-flex_container" style={{height:"100%"}}>
                                <List className={classes.list} style={{width:"98%",marginTop:"0px",height:"90%"}} component="nav" aria-label="Bot Import" dense="True">
                                    <ListItem dense button onClick={handleProfileSelectorCheckAllChange}>
                                        <ListItemIcon>
                                            <GreenCheckbox 
                                                color="secondary"
                                                checked={profileSelectorCheckAll} 
                                                
                                                />
                                        </ListItemIcon>
                                        <ListItemText primary="CHECK ALL" className={classes.listText}/>
                                    </ListItem>
                                    <Divider style={{width:"100%"}}/>
                                    {profileSelector.map( (profile,index) => 
                                    <ListItem key={profile["id"]} value={profile["id"]} dense button onClick={() => handleProfileSelectorChange(profile["id"])}>
                                        <ListItemIcon>
                                            <GreenCheckbox 
                                            color="secondary"
                                            checked={profile["checked"]} 
                                            
                                            value={profile["id"]} 
                                            key={profile["id"]}
                                            />
                                        </ListItemIcon>
                                        <ListItemText id={profile["id"]} primary={profile["name"]} className={classes.listText}/>
                                    </ListItem>
                                    )}
                                </List>

                                </div>

                            </div>
                            <div className="popup-flex_half" style={{width:"48%"}}>
                                <TextField
                                    className={classes.inputFull}
                                    style={{marginTop:"0px"}}
                                    placeholder="Search..."
                                    value={ExportSearch}
                                    onChange={handleExportSearchChange}
                                    variant="outlined"
                                    margin="dense"
                                    InputProps={{
                                        startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                        ),
                                    }}
                                />
                                <div className="popup-flex_container">
                                    <List className={classes.list} component="nav" aria-label="Bot Export" dense="True">
                                    {exportFormats.map((format) => (
                                        <ListItem key={format["value"]} value={format["value"]} dense button onClick={() => handleExportFormatChange(format["value"])}>
                                            <ListItemIcon>
                                                <GreenCheckbox 
                                                color="secondary"
                                                checked={format["checked"]} 
                                                
                                                value={format["value"]} 
                                                key={format["value"]}
                                                />
                                            </ListItemIcon>
                                            <ListItemText id={format["value"]} primary={format["label"]} className={classes.listText}/>
                                        </ListItem>
                                        /*
                                        <ListItem button onClick={() => confirmImportProfile(format.value)}>
                                            <ListItemText primary={format.label} className={classes.listText} />
                                        </ListItem>
                                        */
                                    ))}

                                    </List>
                                </div>
                            </div>
                        </div>
                        


                        
                        

                    </div>
                    <div className="button_group" style={{width:"100%",display:"flex",justifyContent:"flex-end",marginTop:"0px"}}>

                        <Button color="#D85059" text="Cancel" width="71px" clicked={() => handleCloseExportProfile()} />
                        
                        <div style={{width:"10px",height:"100%"}}></div>

                        <Button color="#19C070" text="Export" width="71px" clicked={() => confirmExportProfile()} />
                    </div>

                </div>
                </Fade>
            </Modal>




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
           

        </div>


    )
}

export default Profiles;