import React, { useState } from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Divider, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Typography } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as DarkModeIcon } from '../../images/icons/navbar/dark-mode.svg';
import { ReactComponent as LightModeIcon } from '../../images/icons/navbar/light-mode.svg';
import { changeTheme, logoutAuth } from '../../store/slices/authSlice';
import LogoutIcon from '@mui/icons-material/Logout';

function User(props) {
    const {children} = props;

    const {user,dark,theme} = useSelector((store) => store.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleToggleTheme = (event) => {
        event.preventDefault();

        dispatch(changeTheme(!dark));
        setAnchorEl(null);
    };

    const handleLogoutAuth = async (event) => {
        event.preventDefault();
        
        try {
            await dispatch(logoutAuth()).unwrap();
            navigate('/auth/login');
        } catch (error) {

        };
    };

    return (
        <>
            <IconButton
            id="navbar-user-button"
            aria-controls={open ? 'navbar-user-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            className='me-3 p-0'
            >   
                {
                    user.image
                    ?
                        <img
                        src={user.image}
                        className="rounded-circle" alt="" loading="lazy"
                        style={{objectFit:"cover",height:"1.5rem",width:"1.5rem"}}
                        />
                    :
                    <AccountCircleIcon />
                }
                
            </IconButton>
            <Menu
            id="navbar-user-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
                'aria-labelledby': 'navbar-user-button',
            }}
            >   
                <MenuItem>
                    <ListItemText>
                        <Typography variant="body2" sx={{ color: 'text.secondary',textAlign:"center" }}>
                            {user.name}
                        </Typography>
                    </ListItemText>
                </MenuItem>
                <Divider/>
                <MenuItem onClick={() => {navigate(`/profile/${user["username"]}`);setAnchorEl(null);}}>
                    <ListItemIcon>
                        <AccountCircleIcon />
                    </ListItemIcon>
                    <ListItemText>Profile</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => {navigate(`/settings/auth`);setAnchorEl(null);}}>
                    <ListItemIcon>
                        <SettingsIcon />
                    </ListItemIcon>
                    <ListItemText>Settings</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleToggleTheme}>
                    <ListItemIcon>
                        {theme === "dark" ? <><LightModeIcon/></>: <><DarkModeIcon/></>}
                    </ListItemIcon>
                    <ListItemText>{theme === "dark" ? "Light" : "Dark"}</ListItemText>
                </MenuItem>
                <Divider/>
                <MenuItem onClick={handleLogoutAuth}>
                    <ListItemIcon>
                        <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText>Logout</ListItemText>
                </MenuItem>
            </Menu> 
        </>
    )
}

export default User
