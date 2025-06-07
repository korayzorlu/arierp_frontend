import React from 'react'
import MUIDialog from '@mui/material/Dialog';
import { Avatar, Button, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setUserDialog } from '../../store/slices/notificationSlice';
import Row from '../grid/Row';
import Col from '../grid/Col';
import MessageIcon from '@mui/icons-material/Message';
import { amber } from '@mui/material/colors';

function UserDialog(props) {
    const {user} = props;

    const {userInformation} = useSelector((store) => store.auth);
    const {userDialog} = useSelector((store) => store.notification);

    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(setUserDialog(false))
    };

    return (
        <MUIDialog
        open={userDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        elevation={3}
        variant="outlined"
        fullWidth
        >
            <DialogTitle id="alert-dialog-title">
                Profile
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <Row>
                        <Col size="12" addClass="mb-5">
                            <Avatar className="ms-auto me-auto" alt="" src={userInformation.image} sx={{ width: 80, height: 80 }}></Avatar>
                        </Col>
                    </Row>
                    <Row addClass="g-5">
                        <Col size="6">
                            <Typography gutterBottom>
                                Name: {userInformation.name}
                            </Typography>
                            <Typography gutterBottom>
                                Email: {userInformation.email}
                            </Typography>
                            <Typography gutterBottom>
                                Phone: {userInformation.phone_number}
                            </Typography>
                        </Col>
                        <Col size="6" addClass="text-end">
                            <Typography gutterBottom>
                                <Button type="button" variant="outlined" color="primary" startIcon={<MessageIcon />}>Message</Button>
                            </Typography>
                        </Col>
                    </Row>
                </DialogContentText>
            </DialogContent>
            <DialogActions className=''>
                <Button color="neutral" onClick={handleClose}>Cancel</Button>
            </DialogActions>
        </MUIDialog>
    )
}

export default UserDialog
