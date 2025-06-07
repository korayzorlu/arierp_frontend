import React, { useState } from 'react'
import PanelContent from '../../../../component/panel/PanelContent'
import Row from '../../../../component/grid/Row'
import Col from '../../../../component/grid/Col'
import Card from '../../../../component/card/Card'
import CardBody from '../../../../component/card/CardBody'
import { Button, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { setAlert } from '../../../../store/slices/notificationSlice';
import { fetchUser, logoutAuth } from '../../../../store/slices/authSlice'
import VerifiedIcon from '@mui/icons-material/Verified';
import EmailIcon from '@mui/icons-material/Email';
import Alert from '../../../../component/alert/Alert'

function EmailVerify() {
    const {user} = useSelector((store) => store.auth);

    const dispatch = useDispatch();

    const [buttonDisabled, setButtonDisabled] = useState(false);

    const sendEmail = async () => {
        setButtonDisabled(true);
        
        try {
            const response = await axios.post(`/users/email_settings/`, 
                {
                    email : user.email,
                },
                {withCredentials: true},
            );
            dispatch(setAlert({status:response.data.status,text:response.data.message}));
            await dispatch(fetchUser()).unwrap();
        } catch (error) {
            const status = error?.response?.status || 500;
            const message = error?.response?.data?.message || "Sorry, something went wrong!";
            dispatch(setAlert({ status:"error", text: message }));
        } finally {
            setButtonDisabled(false);
        }
    };

    return (
        <PanelContent>
            <Row addClass="m-0">
                <Col size="6" addClass="ms-auto me-auto">
                    <Card>
                        <CardBody>
                            <Row>
                                <Col size="8" addClass="mb-3 ms-auto me-auto text-center">
                                    <EmailIcon sx={{fontSize:"64px"}}></EmailIcon>
                                </Col>
                            </Row>
                            <Row>
                                <Col size="8" addClass="mb-3 ms-auto me-auto text-center">
                                    <Typography>
                                        Verification required
                                    </Typography>
                                </Col>
                            </Row>
                            <Row>
                                <Col size="8" addClass="mb-3 ms-auto me-auto text-center">
                                    <Typography variant="body2" sx={{color:"text.secondary"}}>
                                    Your account ({user.email}) has not been verified yet. Please verify your account to log in. If you haven’t received the verification email, you can request a new one below.
                                    </Typography>
                                </Col>
                            </Row>
                            <Row>
                                <Col size="6" addClass="mb-3 ms-auto me-auto text-center">
                                    <Button
                                    type="button"
                                    onClick={sendEmail}
                                    variant="contained"
                                    color="primary"
                                    startIcon={<VerifiedIcon />}
                                    disabled={buttonDisabled}
                                    fullWidth
                                    >
                                        Resend Verification Email
                                    </Button>
                                </Col>
                            </Row>
                            <Row>
                                <Col size="6" addClass="mb-3 ms-auto me-auto text-center">
                                    <Button
                                    type="button"
                                    onClick={() => dispatch(logoutAuth())}
                                    variant="contained"
                                    color="primary"
                                    disabled={buttonDisabled}
                                    fullWidth
                                    >
                                        Back To Homepage
                                    </Button>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <Alert color={alert.color} text={alert.text} icon={alert.icon}></Alert>
        </PanelContent>
    )
}

export default EmailVerify
