import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Grid, Menu, MenuItem } from '@mui/material';
import { Button, IconButton, Typography } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import ChangePartnerDialog from 'component/feedback/ChangePartnerDialog';
import { setChangePartnerDialog } from 'store/slices/notificationSlice';
import { useDispatch } from 'react-redux';

function FormHeader(props) {
    const {
        children,
        disabled,
        loadingAdd,
        disabledAdd,
        onClickAdd,
        loadingSave,
        disabledSave,
        onClickSave,
        loadingDelete,
        disabledDelete,
        onClickDelete,
        onClickSettings,
        loadingSettings,
        title,
        noBackButton,
        disabledSettings,
        uuid
    } = props;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Grid
        container
        spacing={0}
        >
            <Grid
            size={4}
            container
            sx={{
                justifyContent: "flex-start",
                alignItems: "center",
            }}
            >   
                {
                    noBackButton
                    ?
                        null
                    :
                        <IconButton aria-label='back' onClick={()=>navigate(-1)}>
                            <ArrowBackIosNewIcon/>
                        </IconButton>
                }
            </Grid>
            <Grid
            size={4}
            container
            sx={{
                justifyContent: "flex-center",
                alignItems: "center",
            }}
            >
                <Typography variant='body1' sx={{textAlign: 'center',width: '100%',color:'text.secondary'}}>
                    {title || ""}
                </Typography>
            </Grid>
            <Grid
            size={4}
            container
            sx={{
                justifyContent: "flex-end",
                alignItems: "center",
            }}
            >
                
                {
                    onClickAdd
                    ?
                    <Button
                    aria-label="add"
                    variant='contained'
                    color="opposite"
                    onClick={() => onClickAdd()}
                    loading={loadingAdd}
                    disabled={disabled || disabledAdd}
                    startIcon={<SaveIcon/>}
                    >
                        Kaydet
                    </Button>
                    :
                    <></>
                }

                {
                    onClickSettings
                    ?
                    <>
                        <IconButton
                        aria-label="settings"
                        color="opposite"
                        loading={loadingSettings}
                        disabled={disabled || disabledSettings}
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                        >
                            <SettingsIcon/>
                        </IconButton>
                        <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        slotProps={{
                        list: {
                            'aria-labelledby': 'basic-button',
                        },
                        }}
                        >
                            <MenuItem onClick={() => dispatch(setChangePartnerDialog(true))}>Kiracı Değişikliği</MenuItem>
                        </Menu>
                    </>
                    
                    :
                    <></>
                }

                {
                    onClickSave
                    ?
                    <IconButton
                    aria-label="save"
                    color="opposite"
                    onClick={() => onClickSave()}
                    loading={loadingSave}
                    disabled={disabled || disabledSave}
                    >
                        <SaveIcon/>
                    </IconButton>
                    :
                    <></>
                }

                {
                    onClickDelete
                    ?
                    <IconButton
                    aria-label="delete"
                    color="error"
                    onClick={() => onClickDelete()}
                    loading={loadingDelete}
                    disabled={disabled || disabledDelete}
                    >
                        <DeleteIcon/>
                    </IconButton>
                    :
                    <></>
                }

            </Grid>
            <ChangePartnerDialog uuid={uuid}></ChangePartnerDialog>
        </Grid>
    )
}

export default FormHeader
