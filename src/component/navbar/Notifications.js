import { Badge, IconButton } from '@mui/material'
import React from 'react'
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchNotifications, readNotifications } from '../../store/slices/notificationSlice';

function Notifications(props) {
    const {children} = props;

    const {dark} = useSelector((store) => store.auth);
    const {unreadNotifications} = useSelector((store) => store.notification);

    const dispatch = useDispatch();
    const navigate = useNavigate();


    const handleNotifications = async () => {
        navigate("/notification");

        await dispatch(readNotifications()).unwrap();
        await dispatch(fetchNotifications()).unwrap();
    };

    return (
        <IconButton className='p-0 me-3' color={dark ? "light" : "blackhole"} onClick={() => handleNotifications()}>
            <Badge
            badgeContent={unreadNotifications}
            variant="dot"
            color="error"
            >   
                <NotificationsIcon
                />
            </Badge>
        </IconButton>
    )
}

export default Notifications
