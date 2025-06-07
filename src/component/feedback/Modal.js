import React from 'react'
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import DialogActions from '@mui/joy/DialogActions';
import MUIModal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DeleteForever from '@mui/icons-material/DeleteForever';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import { setDialog, setModal } from '../../store/slices/notificationSlice';
import { useDispatch, useSelector } from 'react-redux';

function Modal(props) {
    const {children,titleIcon,titleText,dismissText,dissmissColor,onClickText,onClickColor,onClick} = props;
    const {modal} = useSelector((store) => store.notification);
    
    const dispatch = useDispatch();

  return (
    <MUIModal open={modal} onClose={() => dispatch(setModal(false))}>
        <ModalDialog variant="outlined" role="alertdialog">
            <DialogTitle>
                {titleIcon}
                {titleText}
            </DialogTitle>
            <Divider />
            <DialogContent>
                {children}
            </DialogContent>
            <DialogActions>
                <Button variant="solid" color={onClickColor ? onClickColor : "primary"} onClick={onClick ? onClick : ""} autoFocus>{onClickText ? onClickText : "Save"}</Button>
                <Button variant="plain" color={dissmissColor ? dissmissColor : "neutral"} onClick={() => dispatch(setModal(false))}>{dismissText ? dismissText : "Cancel"}</Button>
            </DialogActions>
        </ModalDialog>
    </MUIModal>
  )
}

export default Modal
