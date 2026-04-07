import React, { useState } from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Avatar, Card, CardHeader, Divider, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Typography } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as DarkModeIcon } from '../../images/icons/navbar/dark-mode.svg';
import { ReactComponent as LightModeIcon } from '../../images/icons/navbar/light-mode.svg';
import { changeTheme, logoutAuth } from '../../store/slices/authSlice';
import LogoutIcon from '@mui/icons-material/Logout';

const avatarColors = ['#e53935','#d81b60','#8e24aa','#5e35b1','#1e88e5','#00897b','#43a047','#fb8c00','#f4511e','#6d4c41'];

function stringToColor(str) {
    if (!str) return avatarColors[0];
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return avatarColors[Math.abs(hash) % avatarColors.length];
}

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
                        <Card sx={{ maxWidth: 345 }}>
                            <CardHeader
                                avatar={
                                <Avatar sx={{ bgcolor: stringToColor(user?.name || user?.email) }} aria-label="recipe">
                                    {user.image
                                    ?
                                        <img
                                        src={user.image}
                                        className="rounded-circle" alt="" loading="lazy"
                                        style={{objectFit:"cover",height:"100%",width:"100%"}}
                                        />
                                    :
                                        user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()
                                    }
                                </Avatar>
                                }
                                title={user.name}
                                subheader={user.position ? user.position : user.authorization}
                            />
                            </Card>
                        {/* <Typography variant="body2" sx={{ color: 'text.secondary',textAlign:"center" }}>
                            {user.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary',textAlign:"center" }}>
                            {user.authorization}
                        </Typography> */}
                    </ListItemText>
                </MenuItem>
                <Divider/>
                <MenuItem onClick={() => {navigate(`/profile/${user["username"]}`);setAnchorEl(null);}}>
                    <ListItemIcon>
                        <AccountCircleIcon />
                    </ListItemIcon>
                    <ListItemText>Profil</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => {navigate(`/settings/auth`);setAnchorEl(null);}}>
                    <ListItemIcon>
                        <SettingsIcon />
                    </ListItemIcon>
                    <ListItemText>Ayarlar</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleToggleTheme}>
                    <ListItemIcon>
                        {theme === "dark" ? <><LightModeIcon/></>: <><DarkModeIcon/></>}
                    </ListItemIcon>
                    <ListItemText>{theme === "dark" ? "Aydınlık Tema" : "Karanlık Tema"}</ListItemText>
                </MenuItem>
                <Divider/>
                <MenuItem onClick={handleLogoutAuth}>
                    <ListItemIcon>
                        <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText>Çıkış</ListItemText>
                </MenuItem>
            </Menu> 
        </>
    )
}

export default User
