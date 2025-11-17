import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "bootstrap/js/dist/dropdown.js";
import { Dropdown } from "mdb-ui-kit";
import { Link } from 'react-router-dom';
import { ReactComponent as NavbarLogo } from '../../images/logo/light/marswide-logo.svg';
//import { ReactComponent as DarkModeIcon } from '../../images/icons/navbar/dark-mode.svg';
//import { ReactComponent as LightModeIcon } from '../../images/icons/navbar/light-mode.svg';
import ProgressBar from '../progress/ProgressBar';
import { useDispatch, useSelector } from 'react-redux';
import { changeTheme, logoutAuth } from '../../store/slices/authSlice';
import { setSidebar } from '../../store/slices/sidebarSlice';
import { Badge, Box, CircularProgress, Divider, IconButton, LinearProgress, Menu, MenuItem, Typography } from '@mui/material';
import ImportProcesses from './ImportProcesses';
import Companies from './Companies';
import Notifications from './Notifications';
import User from './User';
import ExportProcesses from './ExportProcesses';
import Langs from './Langs';

function Navbar() {
    const {dark,logo} = useSelector((store) => store.auth);
    const {collapse,toggle} = useSelector((store) => store.sidebar);
    //const {progress} = useSelector((store) => store.process);
    const {importProcesses,exportProcesses,isProgress} = useSelector((store) => store.process);

    const dispatch = useDispatch();

    useEffect(() => {
        const dropdowns = document.querySelectorAll('.dropdown-toggle');
        dropdowns.forEach((dropdown) => {
            new Dropdown(dropdown); // Her dropdown öğesini başlat
        });
    }, []);
    
    const handleToggle = (event) => {
        event.preventDefault();
        //setCollapse(!collapse);
        //setToggle(!toggle);
        
        dispatch(setSidebar({collapseTerm:!collapse,toggleTerm:!toggle}));
    };
    
    return (
        <>
            {
                isProgress
                ?
                <Box sx={{ width:'100%',position:'absolute',zIndex:'9999' }}>
                    <LinearProgress
                    color={dark ? 'mars' : 'blackhole'}
                    />
                </Box>
                :
                <></>
            }
            
            <nav className="navbar fixed-top navbar-expand-lg navbar-light bg-body-tertiary" style={{"height":"40px"}}>
            {/* <ProgressBar value={progress.value} display={progress.display}></ProgressBar> */}
        
            <div className="container-fluid">
                <button data-mdb-collapse-init className="navbar-toggler d-block" type="button" data-mdb-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" onClick={handleToggle}>
                    <i className="fas fa-bars"></i>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <a className="navbar-brand mt-2 mt-lg-0" href="/">
                        <img src={logo} height="18" alt="Arinet" loading="lazy" />
                        {/* <span className="sansation-bold">ARINET</span> */}
                    </a>
                </div>
                <div className="d-flex align-items-end">
                    <ImportProcesses importProcesses={importProcesses}/>
                    <ExportProcesses exportProcesses={exportProcesses}/>
                    <Companies/>
                    {/* <Langs/> */}
                    <Notifications/>
                    <User></User>
                </div>
            </div>
        
        </nav>
        </>
        
    );
}

export default Navbar;