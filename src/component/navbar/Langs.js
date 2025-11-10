import axios from 'axios';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchLangs, fetchLangsForStart, setActiveCompany } from '../../store/slices/organizationSlice';
import { setAlert } from '../../store/slices/notificationSlice';
import MUIButton from '@mui/material/Button';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Backdrop, Button, CircularProgress, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { red } from '@mui/material/colors';
import { setLang, setLoading } from '../../store/slices/authSlice';

function Langs(props) {
    const {children} = props;

    const {dark,lang} = useSelector((store) => store.auth);

    const dispatch = useDispatch();

    const [openBackdrop, setOpenBackdrop] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleChaneLang = (lang) => {
        //dispatch(setLoading(true));
        setOpenBackdrop(true);

        dispatch(setLang(lang));

        setOpenBackdrop(false);
    };

    return (
        <>
             <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={openBackdrop}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
                <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                variant="contained"
                color={dark ? "mars" : "blackhole"}
                className='me-3 pt-0 pb-0'
                endIcon={<KeyboardArrowDownIcon />}
                >
                    {lang || "-SELECT LANGUAGE-"}
                </Button>
                <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                'aria-labelledby': 'basic-button',
                }}
                >
                    <MenuItem onClick={() => handleChaneLang("tr")}>
                        {
                            lang === "tr"
                            ?   
                                <>
                                    <ListItemIcon>
                                        <CheckIcon />
                                    </ListItemIcon>
                                    <ListItemText>TR</ListItemText>
                                </>
                            :
                                <ListItemText inset>TR</ListItemText>
                        }
                    </MenuItem>
                    <MenuItem onClick={() => handleChaneLang("en")}>
                        {
                            lang === "en"
                            ?   
                                <>
                                    <ListItemIcon>
                                        <CheckIcon />
                                    </ListItemIcon>
                                    <ListItemText>EN</ListItemText>
                                </>
                            :
                                <ListItemText inset>EN</ListItemText>
                        }
                    </MenuItem>
                </Menu>
            </>
    )
}

export default Langs
