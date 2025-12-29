import React, { useEffect, useState } from 'react'
import MUIDialog from '@mui/material/Dialog';
import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import Input from '../../../component/input/Input';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setAlert } from '../../../store/slices/notificationSlice';

function InviteDialog(props) {
  const {children,openInviteDialog,handleClose,companyId} = props;
  const dispatch = useDispatch();

  const [open, setOpen] = useState(openInviteDialog);
  const [email, setEmail] = useState("");
  
  useEffect(() => {
    setOpen(openInviteDialog);
  }, [openInviteDialog]);

  const onClick = async () => {
    try {
      const response = await axios.post(`/companies/add_invitation/`,
        {email:email,companyId:`${companyId}`},
        { withCredentials: true},
      );
      dispatch(setAlert({status:response.data.status,text:response.data.message}));
    } catch (error) {
        dispatch(setAlert({status:error.response.data.status,text:error.response.data.message}));
    } finally {
      handleClose();
    }
  };

  return (
    <MUIDialog
    open={openInviteDialog}
    onClose={handleClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
    elevation={3}
    variant="outlined"
    >
        <DialogTitle id="alert-dialog-title">
          Invite
        </DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description" component="div">
              Invite a user to this company.
              <Input
              addClass="mt-3"
              type="text"
              id="invite-user-in-company"
              label={"Email"}
              onChange={(e) => setEmail(e.target.value)}
              >
                  {email}
              </Input>
            </DialogContentText>
        </DialogContent>
        <DialogActions className=''>
            <Button color="neutral" onClick={handleClose}>Cancel</Button>
            <Button variant="outlined" color="success" onClick={onClick} autoFocus>Invite</Button>
        </DialogActions>
    </MUIDialog>
  )
}

export default InviteDialog
