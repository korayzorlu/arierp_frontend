import { Box, Button, IconButton, LinearProgress, Menu, MenuItem, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Row from '../grid/Row';
import Col from '../grid/Col';
import DownloadingIcon from '@mui/icons-material/Downloading';
import axios from 'axios';
import { setAlert } from '../../store/slices/notificationSlice';

function ExportProcesses(props) {
    const {children,excelURL,file_name,exportProcesses} = props;

    const {dark} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);

    const dispatch = useDispatch();

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    
    const fetchExcel = async () => {
        try {
            const response = await axios.get("/leasing/bank_activities_excel",
                {
                    responseType: "blob",
                    withCredentials: true
                }
            );
            const a = document.createElement("a");
            a.href = URL.createObjectURL(response.data);
            a.download = "banka-hareketleri.xlsx";
            a.click();
            URL.revokeObjectURL(a.href);
        } catch (error) {
            dispatch(setAlert({status:error.response.data.status,text:error.response.data.message}));
        } finally {

        }
    };

    return (
        <>
            {
                exportProcesses.length > 0

                ?

                <>
                    <IconButton
                        id="basic-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                        color={dark ? "whitehole" : "blackhole"}
                        className='me-3 p-0'
                    >
                        <DownloadingIcon/>
                    </IconButton>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                        'aria-labelledby': 'basic-button',
                        }}
                        PaperProps={{
                            sx: {
                                marginTop: 1.2,
                                width: 360, // Piksel cinsinden genişlik belirleme
                            }
                        }}
                    >   
                        {
                            exportProcesses.map((process,index) => {
                                return (
                                    <MenuItem key={index}>
                                        <Row className="w-100">
                                            <Col size="6" className={process.progress >= 100 ? "d-none" : ""}>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Box sx={{ width: '100%'}}>
                                                        <LinearProgress variant="determinate" color={dark ? "mars" : "blackhole"} value={process.progress} />
                                                    </Box>
                                                    <Box sx={{ minWidth: 35 }}>
                                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                            {`${Math.round(process.progress)}%`}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Col>
                                            <Col size={process.progress >= 100 ? "12" : "6"}>
                                                {
                                                    process.progress >= 100
                                                    ?
                                                        <Row>
                                                            <Col size="6">
                                                                Dosya hazır!
                                                            </Col>
                                                            <Col size="6">
                                                                <Button variant="contained" color="mars" size='small' onClick={fetchExcel} autoFocus fullWidth>İndir</Button>
                                                            </Col>
                                                        </Row>
                                                    :
                                                        <>Dosya hazırlanıyor...</>
                                                }
                                            </Col>
                                        </Row>
                                        
                                    </MenuItem>
                                )
                            })
                        }
                    </Menu>
                </>

                :

                <>
                </>
            }
        </>
    )
}

export default ExportProcesses
