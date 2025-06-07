import React, { useState } from 'react'
import Form from '../../../../component/form/Form'
import Row from '../../../../component/grid/Row'
import Col from '../../../../component/grid/Col'
import { Button, Input, TextField, Typography } from '@mui/material'
import Card from '../../../../component/card/Card'
import CardBody from '../../../../component/card/CardBody'
import PanelContent from '../../../../component/panel/PanelContent'
import MessageIcon from '@mui/icons-material/Message';
import SendIcon from '@mui/icons-material/Send';
import VerifiedIcon from '@mui/icons-material/Verified';
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { setAlert } from '../../../../store/slices/notificationSlice'
import { fetchUser } from '../../../../store/slices/authSlice'
import axios from 'axios'
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';

function PhoneNumberVerify() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const location = useLocation();
    const {iso2,phoneNumber} = location.state || {};

    const [verifyCode, setVerifyCode] = useState("")
    const [buttonDisabled, setButtonDisabled] = useState(true);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setButtonDisabled(true);
        
        try {
            const response = await axios.post(`/users/phone_number_verification/`, 
                {   
                    iso2 : iso2,
                    phoneNumber : phoneNumber,
                    smsCode:verifyCode
                },
                {withCredentials: true},
            );
            dispatch(setAlert({status:response.data.status,text:response.data.message}));
            await dispatch(fetchUser()).unwrap();
            navigate("/settings/auth/phone-number");
        } catch (error) {
            dispatch(setAlert({status:error.response.data.status,text:error.response.data.message}));
        };
    };

    return (
        <PanelContent>
            <Row addClass="m-0">
                <Col size="6" addClass="ms-auto me-auto">
                    <Card>
                        <CardBody>
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col size="8" addClass="mb-3 ms-auto me-auto">
                                        <PhoneIphoneIcon sx={{fontSize:"64px"}}></PhoneIphoneIcon>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col size="8" addClass="mb-3 ms-auto me-auto">
                                        <Typography>
                                            Enter verification code
                                        </Typography>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col size="8" addClass="mb-3 ms-auto me-auto">
                                        <Typography variant="body2" sx={{color:"text.secondary"}}>
                                            A text message with a verification code has been sent to {phoneNumber}
                                        </Typography>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col size="6" addClass="mb-3 ms-auto me-auto">
                                        <TextField
                                        type="number"
                                        id="settings-auth-phone-number"
                                        size="small"
                                        variant='outlined'
                                        placeholder="SMS CODE"
                                        onChange={(e) => setVerifyCode(e.target.value)}
                                        fullWidth
                                        >
                                            {verifyCode}
                                        </TextField>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col size="6" addClass="mb-3 ms-auto me-auto">
                                        <Button type="submit" variant="contained" color="primary" startIcon={<VerifiedIcon />} fullWidth>Verify</Button>
                                    </Col>
                                </Row>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </PanelContent>
    )
}

export default PhoneNumberVerify
