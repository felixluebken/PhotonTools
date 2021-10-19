import React from "react";

import './pages.css'

import Button from '../components/buttons/button'
import DotTitle from '../components/titles/DotTitle'



function EmailGen() {
    return(
        <div className="page">

            <div className="page_header">
                <div className="page_header-section">
                    <h6 className="page_title">Email Generator</h6>
                    <div className="page_subtitle-container">
                        <span className="page_subtitle">You have </span>
                        <span className="page_subtitle" style={{color:"#F1F1F2"}}>420 emails</span>
                        <span className="page_subtitle"> active. </span>
                    </div>
                </div>
            </div>
            <div className="page_body">
                <div className="page_body-header">
                    <div class="button_group" style={{width:"170px"}}>
                        <Button color="#15BABE" text="Import" width="71px" />
                        <Button color="#D85059" text="Export" width="71px" />
                    </div>

                    <Button color="#15BABE" text="Generate" />
                </div>

                <div className="page_main-body">
                    <div className="page_body-col">
                        <DotTitle color="#15BABE" title="12 GROUPS" />
                        <div className="page_body-cols-container">

                        </div>
                        
                    </div>
                    <div className="page_body-col">
                        <DotTitle color="#FFC74F" title="QUEUED" />
                        <div className="page_body-cols-container">

                        </div>
                    </div>
                    <div className="page_body-col">
                        <DotTitle color="#1AE9B5" title="GENERATED" />
                        <div className="page_body-cols-container">

                        </div>
                    </div>
                </div>





            </div>
        </div>


    )
}

export default EmailGen;