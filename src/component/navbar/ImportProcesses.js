import React, { useState } from 'react'
import MUIButton from '@mui/material/Button';
import DownloadingIcon from '@mui/icons-material/Downloading';
import { Box, IconButton, LinearProgress, Menu, MenuItem, Typography } from '@mui/material';
import Row from '../grid/Row';
import Col from '../grid/Col';
import { useSelector } from 'react-redux';

function ImportProcesses(props) {
    const {children,importProcesses} = props;

    const {dark} = useSelector((store) => store.auth);

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            {
                importProcesses.length > 0

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
                            importProcesses.map((process,index) => {
                                return (
                                    <MenuItem key={index}>
                                        <Row>
                                            <Col size="6">
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
                                            <Col size="6">
                                                Processing partner items...
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

export default ImportProcesses
