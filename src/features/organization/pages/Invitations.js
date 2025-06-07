import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchCompanies, fetchInvitations } from '../../../store/slices/organizationSlice';
import { Link } from 'react-router-dom';
import { Avatar, Chip, Divider, ListItemIcon, MenuItem, Typography } from '@mui/material';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { green,amber,red,indigo,cyan } from '@mui/material/colors';
import BadgeIcon from '@mui/icons-material/Badge';
import AccountMenu from '../../../component/menu/AccountMenu';
import MessageIcon from '@mui/icons-material/Message';
import { GridActionsCellItem } from '@mui/x-data-grid';
import PanelContent from '../../../component/panel/PanelContent';
import ListTable from '../../../component/table/ListTable';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';
import { setAlert } from '../../../store/slices/notificationSlice';

function Invitations() {
    const {invitations,companiesLoading} = useSelector((store) => store.organization);

    const dispatch = useDispatch();

    const [rows, setRows] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [anchorElAction, setAnchorElAction] = useState(null);
    const openAction = Boolean(anchorElAction);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleClickAction = (event) => {
      setAnchorElAction(event.currentTarget);
    };

    const handleCloseAction = () => {
      setAnchorElAction(null);
    };

    useEffect(() => {
      dispatch(fetchInvitations());
      setRows(invitations);
    }, []);

    const handleConfirm = async ({id,status}) => {
      try {
        const response = await axios.post(`/companies/confirm_invitation/`,
          {id,status},
          { withCredentials: true},
        );
        dispatch(setAlert({status:response.data.status,text:response.data.message}));
      } catch (error) {
        dispatch(setAlert({status:error.response.data.status,text:error.response.data.message}));
      } finally {
        dispatch(fetchInvitations());
        dispatch(fetchCompanies());
        handleClose();
      }
    };

    const columns = [
        { field: 'company', headerName: 'Company', flex: 1},
        { field: 'sender', headerName: 'Sender', width: 300, renderCell: (params) => (
            <>
              <Chip
              avatar={<Avatar alt="" src={params.row.senderImage} />}
              label={params.value} 
              onClick={handleClick}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              />
              <AccountMenu open={open} anchorEl={anchorEl} onClick={handleClose} onClose={handleClose} handleClose={handleClose}>
                <MenuItem onClick={handleClose}>
                  <Avatar /> Profile
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <MessageIcon fontSize="small" />
                    </ListItemIcon>
                    Message
                </MenuItem>
              </AccountMenu>
            </>
          )
        },
        { field: 'status', headerName: 'Action', width: 150, renderCell: (params) => {  
                const getChipProps = (status) => {
                    switch (status) {
                        case "pending":
                        return { 
                            icon: <HourglassTopIcon color={amber[900]}/>, 
                            label: "Pending", 
                            color: amber[900] 
                        };
                        case "accepted":
                        return { 
                            icon: <CheckCircleIcon color={green[500]}/>, 
                            label: "Accepted", 
                            color: green[500] 
                        };
                        case "declined":
                        return { 
                            icon: <CancelIcon color={red[300]}/>, 
                            label: "Declined", 
                            color: red[500] 
                        };
                        default:
                        return { 
                            icon: <HourglassTopIcon color={amber[900]}/>, 
                            label: "Pending", 
                            color: amber[900] 
                        };
                    }
                };
            
                const { icon, label, color } = getChipProps(params.value);

                return (
                  <>
                    {
                      params.row.status !== "pending"
                      ?
                      <Chip
                        icon={icon}
                        label={label}
                        sx={{
                          color: color,
                          borderColor: color,
                          border: "none"
                        }}
                        variant="outlined"
                      />
                      :
                      <>
                        <Chip
                          icon={icon}
                          label={label}
                          onClick={handleClickAction}
                          sx={{
                            color: color,
                            borderColor: color,
                          }}
                          variant="outlined"
                        />
                        <AccountMenu open={openAction} anchorEl={anchorElAction} onClick={handleCloseAction} onClose={handleCloseAction} handleClose={handleCloseAction}>
                          <MenuItem onClick={() => handleConfirm({id:params.row.id,status:"accepted"})}>
                              <ListItemIcon>
                                  <CheckCircleIcon fontSize="small" color="success"/>
                              </ListItemIcon>
                              <Typography color="success">Accept</Typography>
                          </MenuItem>
                          <MenuItem onClick={() => handleConfirm({id:params.row.id,status:"declined"})}>
                              <ListItemIcon>
                                  <CancelIcon fontSize="small" color="error"/>
                              </ListItemIcon>
                              <Typography color="error">Decline</Typography>
                          </MenuItem>
                        </AccountMenu>
                      </>
                    }
                  </>
                );
            }
        },
        { field: 'created_date', headerName: 'Time', width: 150},
    ]

    return (
        <PanelContent>
            <ListTable
            title="Invitations"
            rows={invitations}
            columns={columns}
            getRowId={(row) => row.id}
            loading={companiesLoading}
            disableRowSelectionOnClick={true}
            ></ListTable>
        </PanelContent>
    )
}

export default Invitations
