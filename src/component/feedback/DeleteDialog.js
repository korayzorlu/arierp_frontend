import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Dialog from './Dialog';
import MUIDialog from '@mui/material/Dialog';
import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { setAlert, setDeleteDialog } from '../../store/slices/notificationSlice';
import axios from 'axios';
import { setPartnersLoading } from '../../store/slices/partners/partnerSlice';

function DeleteDialog(props) {
    const {children,open,modelName,deleteURL,selectedItems,closeEvent,startEvent,finalEvent} = props;
    const {activeCompany} = useSelector((store) => store.organization);
    const {deleteDialog} = useSelector((store) => store.notification);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleClose = () => {
            dispatch(setDeleteDialog(false));
            if(closeEvent){
                closeEvent();
            };
    };

    const handleDelete = async () => {
        if (startEvent) {
            startEvent();
        };
        dispatch(setDeleteDialog(false));
        dispatch(setAlert({status:"info",text:"Removing items.."}));

        try {

            const response = await axios.post(deleteURL,
                {
                    uuids : selectedItems || []
                },
                { withCredentials: true},
            );
        } catch (error) {
            dispatch(setAlert({status:error.response.data.status,text:error.response.data.message}));
        } finally {
            if (finalEvent){
                finalEvent();
            };
        };
    };


    return (
        <MUIDialog
        open={deleteDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        elevation={3}
        variant="outlined"
        >
            <DialogTitle id="alert-dialog-title">
                Delete company
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Are you sure you want to delete selected items? You cant't undo this action.
                </DialogContentText>
            </DialogContent>
            <DialogActions className=''>
                <Button color="neutral" onClick={handleClose}>Cancel</Button>
                <Button variant="outlined" color="error" onClick={handleDelete} autoFocus>Delete</Button>
            </DialogActions>
        </MUIDialog>
    )
}

export default DeleteDialog
