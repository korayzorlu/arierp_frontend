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
    const {thirdPerson} = useSelector((store) => store.thirdPerson);

    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(setThirdPersonDialog(false));
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
                <PersonIcon/> {thirdPerson.FullName}
            </DialogTitle> */}
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <Stack spacing={2}>
                        {
                            thirdPerson.Images.length > 0
                            ?
                                <Grid container spacing={2} sx={{justifyContent:'center',alignItems:'center'}}>
                                    <Grid size={{xs:12,sm:3}}>
                                        <CardMedia
                                        sx={{ height: 90, width: 90, marginLeft: 'auto', marginRight: 'auto', mt: 2,borderRadius: '50%',objectFit: 'cover', }}
                                        image={thirdPerson.Images[0].Link}
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
                            thirdPerson.FullName && (
                                <>  
                                    <Divider/>
                                    <Typography color='primary'>
                                        İsim
                                    </Typography>
                                    <Typography>
                                        {thirdPerson.FullName}
                                    </Typography>
                                </>
                            )
                        }
                        {
                            thirdPerson.OtherNames.length > 0 && (
                                <>  
                                    <Divider/>
                                    <Typography color='primary'>
                                        Diğer İsimler
                                    </Typography>
                                    {
                                        thirdPerson.OtherNames.map((otherName,index) => (
                                            otherName.FullName !== thirdPerson.FullName &&
                                            <Typography key={index}>
                                                {otherName.FullName}
                                            </Typography>
                                        ))
                                    }
                                </>
                            )
                        }
                        {
                            thirdPerson.ProfileId && (
                                <>
                                    <Divider/>
                                    <Typography color='primary'>
                                        Profile ID
                                    </Typography>
                                    <Typography>
                                        {thirdPerson.ProfileId}
                                    </Typography>
                                </>
                            )
                        }
                        {
                            thirdPerson.BirthDetails.length > 0 && (
                                <>
                                    <Divider/>
                                    <Typography color='primary'>
                                        Doğum Bilgileri
                                    </Typography>
                                    {
                                        thirdPerson.BirthDetails.map((birthDetail,index) => (
                                            <Typography key={index}>
                                                {birthDetail.BirthDate}, {birthDetail.BirthPlace}
                                            </Typography>
                                        ))
                                    }
                                </>
                            )
                        }
                        {
                            thirdPerson.AddressDetails.length > 0 && (
                                <>
                                    <Divider/>
                                    <Typography color='primary'>
                                        Adres Bilgileri
                                    </Typography>
                                    {
                                        thirdPerson.AddressDetails.map((addressDetail,index) => (
                                            <Typography key={index}>
                                                {addressDetail.OtherInformation}, {addressDetail.City}, {addressDetail.Country}
                                            </Typography>
                                        ))
                                    }
                                </>
                            )
                        }
                        {
                            thirdPerson.Function && (
                                <>
                                    <Divider/>
                                    <Typography color='primary'>
                                        Bilgi
                                    </Typography>
                                    <Typography>
                                        {thirdPerson.Function}
                                    </Typography>
                                </>
                            )
                        }
                        {
                            thirdPerson.Summary && (
                                <>
                                    <Divider/>
                                    <Typography color='primary'>
                                        Özet
                                    </Typography>
                                    <Typography>
                                        {thirdPerson.Summary}
                                    </Typography>
                                </>
                            )
                        }
                        {
                            (thirdPerson.BlacklistName || thirdPerson.OtherInformation) && (
                                <>
                                    <Divider/>
                                    <Typography color='primary'>
                                        Açıklama
                                    </Typography>
                                    <Grid container spacing={2}>
                                        {thirdPerson.BlacklistFlagCode && (
                                            <i class={thirdPerson.BlacklistFlagCode} aria-label="Flag"></i>
                                        )}
                                        <Typography variant='h6' sx={{fontWeight: 'bold'}}>
                                            {thirdPerson.BlacklistName}
                                        </Typography>
                                    </Grid>
                                    <Typography>
                                        {thirdPerson.OtherInformation}
                                    </Typography>
                                </>
                            )
                        }
                        {
                            thirdPerson.Links.length > 0 && (
                                <>
                                    <Divider/>
                                    <Typography color='primary'>
                                        Belgeler
                                    </Typography>
                                    {
                                        thirdPerson.Links.map((link,index) => (
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
