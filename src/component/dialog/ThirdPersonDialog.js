import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setMessageDialog, setSendSMSDialog, setThirdPersonDialog } from 'store/slices/notificationSlice';
import { Button, CardMedia, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Grid, Link, ListItem, Stack, TextField, Typography } from '@mui/material';
import MUIDialog from '@mui/material/Dialog';
import SmsIcon from '@mui/icons-material/Sms';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { sendSMS, setSMSsLoading } from 'store/slices/communication/smsSlice';
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';
import UserDefaultPng from "images/icons/user-default.png";
import LabelValueText from 'component/feedback/text/LabelValueText';


function ThirdPersonDialog({...props}) {
    const {activeCompany} = useSelector((store) => store.organization);
    const {thirdPersonDialog} = useSelector((store) => store.notification);
    const {partnerInformation} = useSelector((store) => store.partner);
    const {smss,smssCount,smssParams,smssLoading} = useSelector((store) => store.sms);

    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(setThirdPersonDialog(false));
    };

    const handleSubmit = async () => {
        dispatch(setSMSsLoading(true));
        if (props.startEvent) {
            props.startEvent();
        };
        dispatch(setThirdPersonDialog(false));

        await dispatch(sendSMS({data:{project:props.project,risk_status:props.risk_status}})).unwrap();
        dispatch(setSMSsLoading(true));
    };

    return (
        <MUIDialog
        open={thirdPersonDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        elevation={3}
        variant="outlined"
        maxWidth="md"
        fullWidth
        >
            {/* <DialogTitle id="alert-dialog-title">
                <PersonIcon/> {props.thirdPerson.FullName}
            </DialogTitle> */}
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <Stack spacing={2}>
                        {
                            props.thirdPerson.Images.length > 0
                            ?
                                <Grid container spacing={2} sx={{justifyContent:'center',alignItems:'center'}}>
                                    <Grid size={{xs:12,sm:3}}>
                                        <CardMedia
                                        sx={{ height: 90, width: 90, marginLeft: 'auto', marginRight: 'auto', mt: 2,borderRadius: '50%',objectFit: 'cover', }}
                                        image={props.thirdPerson.Images[0].Link}
                                        title="person"
                                        />
                                    </Grid>
                                </Grid>
                            :
                                <Grid container spacing={2} sx={{justifyContent:'center',alignItems:'center'}}>
                                    <Grid size={{xs:12,sm:3}}>
                                        <CardMedia
                                        sx={{ height: 90, width: 90, marginLeft: 'auto', marginRight: 'auto', mt: 2,borderRadius: '50%',objectFit: 'cover', }}
                                        image={UserDefaultPng}
                                        title="person"
                                        />
                                    </Grid>
                                </Grid>
                        }
                        {
                            props.thirdPerson.FullName && (
                                <>  
                                    <Divider/>
                                    <Typography color='primary'>
                                        İsim
                                    </Typography>
                                    <Typography>
                                        {props.thirdPerson.FullName}
                                    </Typography>
                                </>
                            )
                        }
                        {
                            props.thirdPerson.OtherNames.length > 0 && (
                                <>  
                                    <Divider/>
                                    <Typography color='primary'>
                                        Diğer İsimler
                                    </Typography>
                                    {
                                        props.thirdPerson.OtherNames.map((otherName,index) => (
                                            otherName.FullName !== props.thirdPerson.FullName &&
                                            <Typography key={index}>
                                                {otherName.FullName}
                                            </Typography>
                                        ))
                                    }
                                </>
                            )
                        }
                        {
                            props.thirdPerson.ProfileId && (
                                <>
                                    <Divider/>
                                    <Typography color='primary'>
                                        Profile ID
                                    </Typography>
                                    <Typography>
                                        {props.thirdPerson.ProfileId}
                                    </Typography>
                                </>
                            )
                        }
                        {
                            props.thirdPerson.BirthDetails.length > 0 && (
                                <>
                                    <Divider/>
                                    <Typography color='primary'>
                                        Doğum Bilgileri
                                    </Typography>
                                    {
                                        props.thirdPerson.BirthDetails.map((birthDetail,index) => (
                                            <Typography key={index}>
                                                {birthDetail.BirthDate}, {birthDetail.BirthPlace}
                                            </Typography>
                                        ))
                                    }
                                </>
                            )
                        }
                        {
                            props.thirdPerson.AddressDetails.length > 0 && (
                                <>
                                    <Divider/>
                                    <Typography color='primary'>
                                        Adres Bilgileri
                                    </Typography>
                                    {
                                        props.thirdPerson.AddressDetails.map((addressDetail,index) => (
                                            <Typography key={index}>
                                                {addressDetail.OtherInformation}, {addressDetail.City}, {addressDetail.Country}
                                            </Typography>
                                        ))
                                    }
                                </>
                            )
                        }
                        {
                            props.thirdPerson.Function && (
                                <>
                                    <Divider/>
                                    <Typography color='primary'>
                                        Bilgi
                                    </Typography>
                                    <Typography>
                                        {props.thirdPerson.Function}
                                    </Typography>
                                </>
                            )
                        }
                        {
                            props.thirdPerson.Summary && (
                                <>
                                    <Divider/>
                                    <Typography color='primary'>
                                        Özet
                                    </Typography>
                                    <Typography>
                                        {props.thirdPerson.Summary}
                                    </Typography>
                                </>
                            )
                        }
                        {
                            (props.thirdPerson.BlacklistName || props.thirdPerson.OtherInformation) && (
                                <>
                                    <Divider/>
                                    <Typography color='primary'>
                                        Açıklama
                                    </Typography>
                                    <Grid container spacing={2}>
                                        {props.thirdPerson.BlacklistFlagCode && (
                                            <i class={props.thirdPerson.BlacklistFlagCode} aria-label="Flag"></i>
                                        )}
                                        <Typography variant='h6' sx={{fontWeight: 'bold'}}>
                                            {props.thirdPerson.BlacklistName}
                                        </Typography>
                                    </Grid>
                                    <Typography>
                                        {props.thirdPerson.OtherInformation}
                                    </Typography>
                                </>
                            )
                        }
                        {
                            props.thirdPerson.Links.length > 0 && (
                                <>
                                    <Divider/>
                                    <Typography color='primary'>
                                        Belgeler
                                    </Typography>
                                    {
                                        props.thirdPerson.Links.map((link,index) => (
                                            <Typography key={index}>
                                                <Link href={link.Link} target="_blank" component="a">{link.Link}</Link>
                                            </Typography>
                                        ))
                                    }
                                </>
                            )
                        }
                    </Stack>
                </DialogContentText>
            </DialogContent>
            <DialogActions className=''>
                <Button variant="text" color="neutral" onClick={handleClose}>Kapat</Button>
            </DialogActions>
        </MUIDialog>
    )
}

export default ThirdPersonDialog
