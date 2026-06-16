import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setAlert, setMessageDialog, setSendSMSDialog, setagentDialog, setThirdPersonStatusDialog, setAgentDialog } from 'store/slices/notificationSlice';
import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Stack, TextField, Typography } from '@mui/material';
import MUIDialog from '@mui/material/Dialog';
import SmsIcon from '@mui/icons-material/Sms';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { sendSMS, setSMSsLoading } from 'store/slices/communication/smsSlice';
import SendIcon from '@mui/icons-material/Send';
import { fetchThirdPersons, setThirdPersonsLoading, updateThirdPersonStatus } from 'store/slices/compliance/thirdPersonSlice';
import RuleIcon from '@mui/icons-material/Rule';
import CheckIcon from '@mui/icons-material/Check';
import DoDisturbAltIcon from '@mui/icons-material/DoDisturbAlt';
import DownloadingIcon from '@mui/icons-material/Downloading';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import VissuallyHiddenInput from 'component/input/VissuallyHiddenInput';
import axios from 'axios';
import NetworkIntelligenceIcon from 'component/icon/NetworkIntelligenceIcon';
import FilePresentIcon from 'component/icon/FilePresentIcon';
import { fetchAgentTasks } from 'store/slices/agent/agentTaskSlice';

function AgentDialog({...props}) {
    const {dark} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {agentDialog} = useSelector((store) => store.notification);
    const {partnerInformation} = useSelector((store) => store.partner);
    const {smss,smssCount,smssParams,smssLoading} = useSelector((store) => store.sms);
    const {thirdPersonsParams} = useSelector((store) => store.thirdPerson);
    const {agentTasks,agentTasksCount,agentTasksParams,agentTasksLoading} = useSelector((store) => store.agentTask);

    const dispatch = useDispatch();

    const [disabled, setDisabled] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFileText, setSelectedFileText] = useState(null);
    const [lfUsername, setLfUsername] = useState(null);
    const [lfPassword, setLfPassword] = useState(null);

    useEffect(() => {
        if(props.needLF){
            if(selectedFile && lfUsername && lfPassword && lfUsername !== "" && lfPassword !== ""){
                setDisabled(false);
            }
            else{
                setDisabled(true);
            }
        }
        else{
            if(selectedFile){
                setDisabled(false);
            }
            else{
                setDisabled(true);
            }
        }
        
    }, [selectedFile,lfUsername,lfPassword]);
    

    const handleClose = () => {
        dispatch(setAgentDialog(false));
        setSelectedFile(null);
        setSelectedFileText(null);
        setLfUsername(null);
        setLfPassword(null);
    };

    const handleSubmit = async (status) => {
        dispatch(setThirdPersonsLoading(true));
        if (props.startEvent) {
            props.startEvent();
        };
        dispatch(setAgentDialog(false));


        dispatch(setThirdPersonsLoading(false));
        
    };

    const fetchTemplate = async () => {
        try {
            const response = await axios.get('/agent/agent_template',
                {
                    responseType: "blob",
                    withCredentials: true
                }
            );
            const a = document.createElement("a");
            a.href = URL.createObjectURL(response.data);
            a.download = props.templateName || "template.xlsx";
            a.click();
            URL.revokeObjectURL(a.href);
        } catch (error) {
            const data = JSON.parse(await error.response.data.text());
            dispatch(setAlert({status: data.status, text: data.message}));
        } finally {

        }
    };

     const handleSelectFile = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        setSelectedFileText(file.name);
    };

    const handleImport = async () => {
        if (props.startEvent) {
            props.startEvent();
        };

        if (!selectedFile) {
            dispatch(setAlert({status:"error",text:"Lütfen bir dosya seçin!"}));
            return;
        }

        dispatch(setAgentDialog(false));
        setSelectedFile(null);
        setSelectedFileText(null);
        
        try {
            const formData = new FormData();
            const jsonData = JSON.stringify({
                companyId: activeCompany.companyId,
                agentName: props.agentName,
                ...(lfUsername && { lf_username: lfUsername }),
                ...(lfPassword && { lf_password: lfPassword })
            });
            formData.append("data", jsonData);

            if (selectedFile) {
                formData.append("file", selectedFile);
            };

            const response = await axios.post('/agent/run_agent/',
                formData,
                {   
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true
                },
            );
            //dispatch(setAlert({status:"success",text:"Agent işlemi başlatıldı!"}));
        } catch (error) {
            dispatch(setAlert({status:error.response.data.status,text:error.response.data.message}));
        } finally {
            if (props.finalEvent){
                props.finalEvent();
            };
        };
    };

    return (
        <MUIDialog
        open={agentDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        elevation={3}
        variant="outlined"
        maxWidth="xs"
        fullWidth
        >
            <DialogTitle>
                <NetworkIntelligenceIcon/> {props.title || "Agent"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <Stack spacing={2}>
                        <Typography>
                            Başlatmak için bir dosya seçin ve ardından "Başlat" butonuna tıklayın. Örnek dosya şablonunu indirip doldurarak işlemi kolayca başlatabilirsiniz.
                        </Typography>
                        <Typography>
                            Desteklenen dosya formatları: XLSX
                        </Typography>
                        <Typography>
                            Maksimum dosya boyutu 5MB
                        </Typography>
                        <Button
                        variant="contained"
                        color="mars"
                        onClick={fetchTemplate}
                        startIcon={<FilePresentIcon/>}
                        fullWidth
                        >
                            Örnek Dosyayı İndir
                        </Button>
                        <Button
                        variant='contained'
                        color={dark ? "silvercoin" : "ari"}
                        component="label"
                        role={undefined}
                        tabIndex={-1}
                        startIcon={ !selectedFileText ? <CloudUploadIcon /> : <InsertDriveFileIcon/>}
                        fullWidth
                        >
                            {selectedFileText || "Dosya Seç"}
                            <VissuallyHiddenInput onChange={handleSelectFile} accept=".xlsx"/>
                        </Button>
                        {
                            props.needLF
                            ?
                                <>
                                    <TextField
                                    type="text"
                                    size="small"
                                    label={"Leaseflex Kullanıcı Adı"}
                                    variant='outlined'
                                    value={lfUsername}
                                    onChange={(e) => setLfUsername(e.target.value)}
                                    fullWidth
                                    />
                                    <TextField
                                    type="password"
                                    size="small"
                                    label={"Leaseflex Şifre"}
                                    variant='outlined'
                                    value={lfPassword}
                                    onChange={(e) => setLfPassword(e.target.value)}
                                    fullWidth
                                    />
                                </>
                            :
                                null
                        }
                    </Stack>
                    
                </DialogContentText>
            </DialogContent>
            <DialogActions className=''>
                <Button variant="text" color="neutral" onClick={handleClose}>Vazgeç</Button>
                <Button
                variant="contained"
                color="opposite"
                onClick={handleImport}
                endIcon={<PlayArrowIcon />}
                disabled={disabled}
                >
                    Başlat
                </Button>
            </DialogActions>
            
        </MUIDialog>
    )
}

export default AgentDialog
