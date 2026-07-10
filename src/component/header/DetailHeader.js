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

function DetailHeader(props) {
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
            size={8}
            container
            sx={{
                justifyContent: "flex-start",
                alignItems: "center",
            }}
            >   
                {
                    props.noBackButton
                    ?
                        null
                    :
                        <IconButton aria-label='back' onClick={()=>navigate(-1)}>
                            <ArrowBackIosNewIcon/>
                        </IconButton>
                }
                <Typography variant='body1' sx={{textAlign: 'left',fontWeight:'bold'}}>
                    {props.title || ""}
                </Typography>
                <Typography variant='body1' sx={{textAlign: 'left',color:'text.secondary'}}>
                    &nbsp;- {props.subtitle || ""}
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
                    props.onClickAdd
                    ?
                    <Button
                    aria-label="add"
                    variant='contained'
                    color="opposite"
                    onClick={() => props.onClickAdd()}
                    loading={props.loadingAdd}
                    disabled={props.disabled || props.disabledAdd}
                    startIcon={<SaveIcon/>}
                    >
                        Kaydet
                    </Button>
                    :
                    <></>
                }

                {
                    props.onClickSettings
                    ?
                    <>
                        <IconButton
                        aria-label="settings"
                        color="opposite"
                        loading={props.loadingSettings}
                        disabled={props.disabled || props.disabledSettings}
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
                    props.onClickSave
                    ?
                    <IconButton
                    aria-label="save"
                    color="opposite"
                    onClick={() => props.onClickSave()}
                    loading={props.loadingSave}
                    disabled={props.disabled || props.disabledSave}
                    >
                        <SaveIcon/>
                    </IconButton>
                    :
                    <></>
                }

                {
                    props.onClickDelete
                    ?
                    <IconButton
                    aria-label="delete"
                    color="error"
                    onClick={() => props.onClickDelete()}
                    loading={props.loadingDelete}
                    disabled={props.disabled || props.disabledDelete}
                    >
                        <DeleteIcon/>
                    </IconButton>
                    :
                    <></>
                }

            </Grid>
            <ChangePartnerDialog uuid={props.uuid}></ChangePartnerDialog>
        </Grid>
    )
}

export default DetailHeader
