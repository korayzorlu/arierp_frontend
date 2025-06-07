import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Card from '../../../component/card/Card';
import Form from '../../../component/form/Form';
import CardHeader from '../../../component/card/CardHeader';
import BackAndHeader from '../../../component/card/BackAndHeader';
import CardBody from '../../../component/card/CardBody';
import CardFooter from '../../../component/card/CardFooter';
import { Button, Divider, Paper, Stack, Tab, Tabs } from '@mui/material';
import { setAlert } from '../../../store/slices/notificationSlice';
import { addPartner, fetchPartners } from '../../../store/slices/partners/partnerSlice';
import axios from 'axios';
import TabPanel from '../../../component/tab/TabPanel';
import { fetchCountries, fetchCurrencies} from '../../../store/slices/dataSlice';
import AddressTab from '../companies/AddressTab';
import InformationTab from '../companies/InformationTab';
import ContactTab from '../companies/ContactTab';
import SaveIcon from '@mui/icons-material/Save';
import { Grid } from '@mui/material';
import AndroidSwitch from '../../../component/switch/AndroidSwitch';
import { setIsProgress } from '../../../store/slices/processSlice';
import FormHeader from '../../../component/header/FormHeader';
import InfoIcon from '@mui/icons-material/Info';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CallIcon from '@mui/icons-material/Call';

function AddPartner() {
    const {user,dark} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [disabled, setDisabled] = useState(false);
    const [switchDisabled, setSwitchDisabled] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const [data, setData] = useState({companyId: activeCompany.companyId})

    useEffect(() => {
        dispatch(setIsProgress(true));
        dispatch(fetchCountries());
        dispatch(fetchCurrencies());
        dispatch(setIsProgress(false));
    }, [dispatch])
    

    const handleChangeTabValue = (event, newTabValue) => {
        setTabValue(newTabValue);
    };

    const handleSubmit = async () => {
        setDisabled(true);
        await dispatch(addPartner({data})).unwrap();
        setDisabled(false);
    };

    const handleChangeShareholder = (value) => {
        setSwitchDisabled(value);
        handleChangeField("customer",false);
        handleChangeField("supplier",false);
    };

    const handleChangeField = (field,value) => {
        setData(data => ({...data, [field]:value}));
        setButtonDisabled(false);
    };

    return (
        <Paper elevation={0} sx={{p:2}} square>
            <Stack spacing={2}>
                <FormHeader
                title="CREATE PARTNER"
                loadingAdd={disabled}
                disabledAdd={buttonDisabled}
                onClickAdd={() => handleSubmit()}
                />
                <Divider></Divider>
                <Stack spacing={2}>
                    <Grid
                    container
                    spacing={{xs:2,sm:0}}
                    sx={{
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                    >
                        <Grid>
                            <Tabs value={tabValue} onChange={handleChangeTabValue} aria-label="basic tabs example">
                            <Tab label="Information" value={0} icon={<InfoIcon/>}/>
                                <Tab label="Address" value={1} icon={<LocationOnIcon/>}/>
                                <Tab label="Contact" value={2} icon={<CallIcon/>}/>
                            </Tabs>
                        </Grid>
                        <Grid>
                            <AndroidSwitch
                            label="Customer"
                            checked={data.customer}
                            onChange={(value) => handleChangeField("customer",value)}
                            disabled={switchDisabled}
                            />
                            <AndroidSwitch
                            label="Supplier"
                            checked={data.supplier}
                            onChange={(value) => handleChangeField("supplier",value)}
                            disabled={switchDisabled}
                            />
                            <AndroidSwitch
                            label="Shareholder"
                            checked={data.shareholder}
                            onChange={(value) => {handleChangeField("shareholder",value);handleChangeShareholder(value);}}
                            />
                        </Grid>
                    </Grid>
                    <Divider></Divider>
                    <TabPanel value={tabValue} index={0}>
                        <InformationTab
                        valueName={data.name || ""}
                        valueFormalName={data.formalName || ""}
                        valueVatOffice={data.vatOffice || ""}
                        valueVatNo={data.vatNo || ""}
                        valueAbout={data.about || ""}
                        onChangeName={(value) => handleChangeField("name",value)}
                        onChangeFormalName={(value) => handleChangeField("formalName",value)}
                        onChangeVatOffice={(value) => handleChangeField("vatOffice",value)}
                        onChangeVatNo={(value) => handleChangeField("vatNo",value)}
                        onChangeAbout={(value) => handleChangeField("about",value)}
                        disabled={disabled}
                        />
                    </TabPanel>
                    <TabPanel value={tabValue} index={1}>
                        <AddressTab
                        valueCountry={data.country || 0}
                        valueCity={data.city || 0}
                        valueAddress={data.address || ""}
                        valueAddress2={data.address2 || ""}
                        onChangeCountry={(value) => handleChangeField("country",value)}
                        onChangeCity={(value) => handleChangeField("city",{id:value})}
                        onChangeAddress={(value) => handleChangeField("address",value)}
                        onChangeAddress2={(value) => handleChangeField("address2",value)}
                        isBillingSame={data.isBillingSame}
                        onChangeIsBillingSame={(value) => handleChangeField("isBillingSame",value)}
                        valueBillingCountry={data.billingCountry || 0}
                        valueBillingCity={data.billingCity || 0}
                        valueBillingAddress={data.billingAddress || ""}
                        valueBillingAddress2={data.billingAddress2 || ""}
                        onChangeBillingCountry={(value) => handleChangeField("billingCountry",value)}
                        onChangeBillingCity={(value) => handleChangeField("billingCity",{id:value})}
                        onChangeBillingAddress={(value) => handleChangeField("billingAddress",value)}
                        onChangeBillingAddress2={(value) => handleChangeField("billingAddress2",value)}
                        disabled={disabled}
                        />
                    </TabPanel>
                    <TabPanel value={tabValue} index={2}>
                        <ContactTab
                        valueEmail={data.email || ""}
                        valueWeb={data.web || ""}
                        valuePhoneCountry={data.phoneCountry || user.location.country || 0}
                        valuePhoneNumber={data.phoneNumber || ""}
                        onChangeEmail={(value) => handleChangeField("email",value)}
                        onChangeWeb={(value) => handleChangeField("web",value)}
                        onChangePhoneCountry={(value) => handleChangeField("phoneCountry",value)}
                        onChangePhoneNumber={(value) => handleChangeField("phoneNumber",value)}
                        valueCurrency={data.currency || user.location.currency || 0}
                        onChangeCurrency={(value) => handleChangeField("currency",value)}
                        disabled={disabled}
                        />
                    </TabPanel>
                </Stack>
            </Stack>
        </Paper>
    )
}

export default AddPartner
