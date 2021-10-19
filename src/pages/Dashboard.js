import React, { useState, useEffect } from "react";

import { Bar } from 'react-chartjs-2';

import './pages.css'
import './dashboard.css'

import DashboardUpdateItem from '../components/list/DashboardUpdateItem'
import DashboardStatusItem from '../components/list/DashboardStatusItem'


import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField'
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';








function useForceUpdate(){
    const [value, setValue] = React.useState(0); // integer state
    return () => setValue(value => value + 1); // update the state to force render
}

const { ipcRenderer } = window.require('electron/renderer')

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
    select: {
        width:120
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

const timeFrames = [
    {
      value: 'week',
      label: 'Week',
    },
    {
      value: 'month',
      label: 'Month',
    },
    {
      value: 'year',
      label: 'Year',
    },
];


const getListLocation = (list,index) => {

    if(list.length === 1) {
        return "single"
    }
    else if(index === 0) {
        return "top"
    }
    else if(index === list.length-1) {
        return "bottom"
    }
    else {
        return "mid"
    }
}


let notifications = [];
let notificationPanels;
let changelogPanels;

let accountsFarmed = 0;
let accountsCreated = 0;
let cardsCreated = 0;
let emailsCreated = 0;
let usageData = {};
let userData = null;

let discordUser = "username";
let discordAvatar = "";
let subscriptionType = "Renewal License";
let subscriptionIndicator = "100%"
let subscriptionIndicatorColor = "#D85059"
let daysRemaining = "-";

let avatarElement = <div className="dashboard_panel-user-avatar-icon"></div>

let usageLabels = [];
let usagePeriodData = [];
let totalUsage = 0;

let changelog = [];
let updateVersion = "";
let updateDescription = "";
let updateLog = [];



/*
ipcRenderer.send('getDashboardData')
ipcRenderer.on('returnDashboardData', (event,arg) => {
    ipcRenderer.removeAllListeners('returnDashboardData')
    notifications = arg.notifications;
    accountsFarmed = arg.captcha["groups"][0]["accounts"].length;
    usageData = arg.usage;
    changelog = arg.changelog;

    accountsCreated = 0;
    for (var key in arg.accounts) {
        if (arg.accounts.hasOwnProperty(key)) {
            accountsCreated += arg.accounts[key].length
        }
    }

    cardsCreated = 0;
    for(var i = 0; i < arg.cards["groups"].length; i++) {
        cardsCreated += arg.cards["groups"][i]["cards"].length
    }
    
    notificationPanels = notifications.map((notification,index) =>  
        <DashboardStatusItem position={getListLocation(notifications,index)} state={notification["type"]} title={notification["title"]} description={notification["message"]} />
    )
    changelogPanels = changelog.map((update,index) => 
        <DashboardUpdateItem position={getListLocation(update,index)} clicked={(updateIndex) => console.log(updateIndex)} index={index} version={update["version"]} description={update["description"]} />
    )

    usageLabels = getUsageLabels("week")
    usagePeriodData = getUsageData("week",arg.usage)
    totalUsage = getTotalUsage("week",arg.usage)

})
*/


function getCurrentDate(date) {
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();
    
    return yyyy + "-" + mm + "-" + dd
}
function getCurrentLabelDate(date) {
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    
    return dd + "/" + mm
}




const getWeekData = (usage) => {
    var startDay = new Date()
    startDay.setDate(startDay.getDate()-6)

    var endDay = new Date();
    
    var daysOfWeek = [];
    for (var d = startDay; d <= endDay; d.setDate(d.getDate() + 1)) {

        if(usage["usage"].hasOwnProperty(getCurrentDate(d))) {
            var hours = (parseFloat(usage["usage"][getCurrentDate(d)]) / 60.0).toFixed(2)
            daysOfWeek.push(hours)
        }
        else {
            daysOfWeek.push(0)
        }

    }
    return daysOfWeek
}
const getWeekLabel = () => {
    var startDay = new Date()
    startDay.setDate(startDay.getDate()-6)


    var endDay = new Date();
    
    
    var daysOfWeek = [];
    for (var d = startDay; d <= endDay; d.setDate(d.getDate() + 1)) {
        daysOfWeek.push(getCurrentLabelDate(d))
    }
    return daysOfWeek
}



const getMonthData = (usage) => {
    
    var periodOfMonth = [];


    for (var i = 10; i > 0; i--) {

        var startDay = new Date()
        startDay.setDate(startDay.getDate()-(i*3))
    
        var endDay = new Date();
        endDay.setDate(endDay.getDate()-(i*3)+3)

        var totalHours = 0.0

        for (var d = startDay; d <= endDay; d.setDate(d.getDate() + 1)) {
            if(usage["usage"].hasOwnProperty(getCurrentDate(d))) {
                var hours = (parseFloat(usage["usage"][getCurrentDate(d)]) / 60.0).toFixed(2)

                totalHours += parseFloat(hours)
            }
        }
        periodOfMonth.push(totalHours.toFixed(2))
    }

    return periodOfMonth
}
const getMonthLabel = () => {
    var periodOfMonth = [];


    for (var i = 10; i > 0; i--) {

        var startDay = new Date()
        startDay.setDate(startDay.getDate()-(i*3))
    
        var endDay = new Date();
        endDay.setDate(endDay.getDate()-(i*3)+3)

        periodOfMonth.push(getCurrentLabelDate(startDay) + " to " + getCurrentLabelDate(endDay))
    }

    return periodOfMonth
}

const getYearData = (usage) => {
    
    var periodOfYear = [];


    for (var i = 10; i > 0; i--) {

        var startDay = new Date()
        startDay.setDate(startDay.getDate()-(i*30))
    
        var endDay = new Date();
        endDay.setDate(endDay.getDate()-(i*30)+30)

        var totalHours = 0.0

        for (var d = startDay; d <= endDay; d.setDate(d.getDate() + 1)) {
            if(usage["usage"].hasOwnProperty(getCurrentDate(d))) {
                var hours = (parseFloat(usage["usage"][getCurrentDate(d)]) / 60.0).toFixed(2)

                totalHours += parseFloat(hours)
            }
        }
        periodOfYear.push(totalHours.toFixed(2))
    }

    return periodOfYear
}
const getYearLabel = () => {
    var periodOfYear = [];


    for (var i = 10; i > 0; i--) {

        var startDay = new Date()
        startDay.setDate(startDay.getDate()-(i*30))
    
        var endDay = new Date();
        endDay.setDate(endDay.getDate()-(i*30)+30)

        periodOfYear.push(getCurrentLabelDate(startDay) + " to " + getCurrentLabelDate(endDay))
    }

    return periodOfYear
}





const getUsageData = (period,usage) => {
    switch(period) {
        case "week": {
            return getWeekData(usage)
        } 
        case "month": {
            return getMonthData(usage)
        }
        case "year": {
            return getYearData(usage)
        }
    }
}
const getUsageLabels = (period) => {
    switch(period) {
        case "week": {
            return getWeekLabel()
        } 
        case "month": {
            return getMonthLabel()
        }
        case "year": {
            return getYearLabel()
        }
    }
}
const getTotalUsage = (period,usage) => {
    var usageData = getUsageData(period,usage)
    var totalUsage = parseFloat(0.0)
    for(var i = 0; i < usageData.length; i++) {
        totalUsage += parseFloat(usageData[i])
    }
    return totalUsage.toFixed(2)
}


function Dashboard(props) {
    const classes = useStyles();
    const [timeFrame, setCurrency] = React.useState('week');


    notifications = props.notifications;

    const handleTimeChange = (event) => {

      setCurrency(event.target.value);
      usageLabels = getUsageLabels(event.target.value)
      usagePeriodData = getUsageData(event.target.value,usageData)
      totalUsage = getTotalUsage(event.target.value,usageData)
    };

    ipcRenderer.send('getDashboardData')
    ipcRenderer.on('returnDashboardData', (event,arg) => {
        ipcRenderer.removeAllListeners('returnDashboardData')
        notifications = arg.notifications;
        accountsFarmed = arg.captcha["groups"][0]["accounts"].length;
        usageData = arg.usage;
        changelog = arg.changelog;
        userData = arg.user

        accountsCreated = 0;
        for (var key in arg.accounts) {
            if (arg.accounts.hasOwnProperty(key)) {
                for(var i = 0; i < arg.accounts[key].length; i++) {
                    if(arg.accounts[key][i]["state"] === 3) accountsCreated++
                }
                //accountsCreated += arg.accounts[key].length
            }
        }

        cardsCreated = 0;
        for(var i = 0; i < arg.cards["groups"].length; i++) {
            cardsCreated += arg.cards["groups"][i]["cards"].length
        }
        
        notificationPanels = notifications.map((notification,index) =>  
            <DashboardStatusItem position={getListLocation(notifications,index)} state={notification["type"]} title={notification["title"]} description={notification["message"]} />
        )
        changelogPanels = changelog.map((update,index) => 
            <DashboardUpdateItem position={getListLocation(changelog,index)} clicked={updateIndex => handleOpenUpdateLog(updateIndex)} index={index} version={update["version"]} description={update["description"]} />
        )

        usageLabels = getUsageLabels("week")
        usagePeriodData = getUsageData("week",usageData)
        totalUsage = getTotalUsage("week",usageData)
        
        if(!userData.discord.discriminator || userData.discord.discriminator === "") discordUser = userData.user
        else discordUser = userData.discord.user + "#" + userData.discord.discriminator

        if(userData.payment_type === "free") {
            subscriptionType = "Free License";
            subscriptionIndicator = "100%"
            subscriptionIndicatorColor = "#19C070"
            daysRemaining = "Unlimited";
        }
        else {
            subscriptionType = "Renewal License";
            subscriptionIndicator = "100%"
            subscriptionIndicatorColor = "#19C070"
            daysRemaining = "-";
        }
        
        discordAvatar = userData.discord.avatar_url

    })

    if(discordAvatar === "") avatarElement = <div className="dashboard_panel-user-avatar-icon"></div>
    else avatarElement = <div className="dashboard_panel-user-avatar-icon" style={{backgroundImage:`url(${discordAvatar})`}}></div>


    // OPEN UPDATE
    const [openUpdateLog, setOpenUpdateLog] = React.useState(false)
    const [updateVersion,setUpdateVersion] = React.useState("")
    const [updateDescription,setUpdateDescription] = React.useState("")
    const [updateLog,setUpdateLog] = React.useState([])


    const handleOpenUpdateLog = (index) => {
        setUpdateVersion(changelog[index]["version"]);
        setUpdateDescription(changelog[index]["description"]);
        setUpdateLog(changelog[index]["changes"]);
        setOpenUpdateLog(true)
    };
    const handleCloseUpdateLog = () => {
        setOpenUpdateLog(false)
    
    }




    return(
        <ThemeProvider theme={theme}>
        <div className="page">

            <div className="page_header">
                <div className="page_header-section">
                    <h6 className="page_title">Dashboard</h6>
                    <p className="page_subtitle">View statistics</p>
                </div>
                <div className="page_header-section">
                    <TextField
                        select
                        className={classes.select}
                        label="Select"
                        value={timeFrame}
                        onChange={handleTimeChange}
                        variant="outlined"
                        margin="dense"
                    >
                    {timeFrames.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                        {option.label}
                        </MenuItem>
                    ))}
                    </TextField>
                </div>
                

            </div>
            <div className="page_body">
                <div className="dashboard_col-main">
                    <div className="dashboard_panel-statistics">
                        <div className="dashboard_panel-statistics-accounts_farmed-panel">
                            <div className="dashboard_panel-statistics-accounts_farmed-icon"></div>
                            <p className="dashboard_panel-statistics-text">Accounts Farmed</p>
                            <p className="dashboard_panel-statistics-value">{accountsFarmed}</p>
                        </div>
                        <div className="dashboard_panel-statistics-accounts_created-panel">
                            <div className="dashboard_panel-statistics-accounts_created-icon"></div>
                            <p className="dashboard_panel-statistics-text">Accounts Created</p>
                            <p className="dashboard_panel-statistics-value">{accountsCreated}</p>
                        </div>
                        <div className="dashboard_panel-statistics-cards_created-panel">
                            <div className="dashboard_panel-statistics-cards_created-icon"></div>
                            <p className="dashboard_panel-statistics-text">Cards Created</p>
                            <p className="dashboard_panel-statistics-value">{cardsCreated}</p>
                        </div>
                        <div className="dashboard_panel-statistics-emails_created-panel">
                            <div className="dashboard_panel-statistics-emails_created-icon"></div>
                            <p className="dashboard_panel-statistics-text">Emails Created</p>
                            <p className="dashboard_panel-statistics-value">{emailsCreated}</p>
                        </div>

                    </div>
                
                    <h6 className="dashboard_title">User Information</h6>
                    <div className="dashboard_panel-user">
                        <div className="dashboard_panel-user-avatar">
                            {avatarElement}
                        </div>
                        <div className="dashboard_panel-user-info">
                            <div>
                            <p className="dashboard_panel-user-info-title">{subscriptionType}</p>
                            <p className="dashboard_panel-user-info-value">{discordUser}</p>
                            </div>
                            
                        </div>
                        <div className="dashboard_panel-user-sub">
                            <div className="dashboard_panel-user-sub-wrapper">

                            <span className="dashboard_panel-user-sub-text" style={{color: subscriptionIndicatorColor}}>{daysRemaining} Days</span> <span className="dashboard_panel-user-sub-text"> Remaining</span>
                            <div className="dashboard_panel-user-sub-bar">
                                <div className="dashboard_panel-user-sub-progress" style={{width: subscriptionIndicator, backgroundColor: subscriptionIndicatorColor}}></div>
                            </div>
                            </div>
                        
            

                        </div>
                    </div>
                    
                    <h6 className="dashboard_title">Activity and Usage</h6>
                    <div className="dashboard_panel-usage">
                        
                        <p className="dashboard_panel-usage-value">{totalUsage}</p>
                        <p className="dashboard_panel-usage-title">hours of usage this past {timeFrame}</p>
                        <div className="dashboard_panel-usage-divider"></div>
                        <div className="dashboard_panel-usage-graph">
                            <Bar data={{
                                labels: usageLabels,
                                datasets: [{
                                    barPercentage: 0.5,
                                    barThickness: 45,
                                    maxBarThickness: 100,
                                    minBarLength: 2,
                                    borderRadius: 8,
                                    data: usagePeriodData,
                                    backgroundColor: ['#15BABE'],
                                    hoverBackgroundColor: ['#15BABE'],
                                }]

                                    }}
                                options={{
                                    plugins: {
                                        legend: {
                                            display: false
                                        },
                                        tooltips: {
                                            enabled: false
                                        },
                                    },
                                    animation: true,
                                    responsive: true,
                                    maintainAspectRatio: false,


                                    scales: {
                                        
                                        x: {
                                            gridLines: {
                                                color:"#15151D",
                                            },
                                            ticks: {
                                                display: true,
                                                min:0,
                                            },
                                        },

                                        y: {
                                            gridLines: {
                                                color:"#15151D",
                                            },
                                            ticks: {
                                                display: false,
                                                min:0,
                                            },
                                        },
                                        


                                    },
                                }}
                            />
                        </div>


                    </div>
                </div>
                <div className="dashboard_col-side">
                    <h6 className="dashboard_title" style={{marginTop:0}}>Update Log</h6>     
                    <div className="dashboard_panel-updates">
                        {changelogPanels}
                    </div>
                    <h6 className="dashboard_title">Status Log</h6>  
                    <div className="dashboard_panel-status">
                        {notificationPanels}
                    </div>
                </div>
            </div>
        </div>


        <Modal
            className={classes.modal}
            open={openUpdateLog}
            onClose={handleCloseUpdateLog}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
            timeout: 500,
            }}
        >
            <Fade in={openUpdateLog}>
            <div className={classes.paper}>

                <div className="popup-container" style={{width:"300px",height:"350px"}}>
                    <div className="popup-header" style={{marginBottom:"20px"}}>
                        <span className="popup-section_title">Update Log</span>
                        <svg className="window_icon" width="15" height="15" viewBox="0 0 13 13" onClick={handleCloseUpdateLog}>
                            <path d="M0.271972 0.271972C0.634602 -0.0906574 1.22254 -0.0906574 1.58517 0.271972L6.5 5.1868L11.4148 0.271972C11.7775 -0.0906574 12.3654 -0.0906574 12.728 0.271972C13.0907 0.634602 13.0907 1.22254 12.728 1.58517L7.8132 6.5L12.728 11.4148C13.0907 11.7775 13.0907 12.3654 12.728 12.728C12.3654 13.0907 11.7775 13.0907 11.4148 12.728L6.5 7.8132L1.58517 12.728C1.22254 13.0907 0.634602 13.0907 0.271972 12.728C-0.0906574 12.3654 -0.0906574 11.7775 0.271972 11.4148L5.1868 6.5L0.271972 1.58517C-0.0906574 1.22254 -0.0906574 0.634602 0.271972 0.271972Z"/>
                        </svg>
                    </div>

                    <p className="dashboard_panel-user-info-value" style={{textAlign:"center"}}>{"Version " + updateVersion}</p>
                    <p className="dashboard_panel-user-info-title" style={{textAlign:"center",marginBottom:"30px"}}>{updateDescription}</p>

                    {updateLog.map((updateItem) => 
                        <p className="dashboard_title" style={{margin:"8px 8px 8px 26px"}}>{"• " + updateItem}</p>
                    )}
                </div>

            </div>
            </Fade>
        </Modal>
        </ThemeProvider>

    )



}


export default Dashboard;