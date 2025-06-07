import React, { useEffect, useState } from 'react'
import BasicTable from '../../../component/table/BasicTable'
import CustomTableButton from '../../../component/table/CustomTableButton'
import AddIcon from "@mui/icons-material/Add";
import { Avatar, Button, Chip, Divider, ListItemIcon, MenuItem, Typography } from '@mui/material';
import AccountMenu from '../../../component/menu/AccountMenu';
import MessageIcon from '@mui/icons-material/Message';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { amber,indigo,red} from '@mui/material/colors';
import BadgeIcon from '@mui/icons-material/Badge';
import CancelIcon from '@mui/icons-material/Cancel';
import { useDispatch, useSelector } from 'react-redux';
import OutUserInCompanyDialog from './OutUserInCompanyDialog';
import { fetchUsersInCompany } from '../../../store/slices/organizationSlice';
import InviteDialog from './InviteDialog';
import axios from 'axios';
import { setAlert, setUserDialog } from '../../../store/slices/notificationSlice';
import { fetchUserInformation } from '../../../store/slices/authSlice';
import AddBoxIcon from '@mui/icons-material/AddBox';

function UsersInCompany(props) {
    const {companyId,companyName} = props;

    const {user} = useSelector((store) => store.auth);
    const {usersLoading,usersInCompany} = useSelector((store) => store.organization);

    const dispatch = useDispatch();

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [anchorElUserStatus, setAnchorElUserStatus] = useState(null);
    const openUserStatus = Boolean(anchorElUserStatus);
    const [openUserStatusDialog, setOpenUserStatusDialog] = useState(false);
    const [openInviteDialog, setOpenInviteDialog] = useState(false);
    const [selectedUserEmail, setSelectedUserEmail] = useState(null);
    const [selectedUserCompanyId, setSelectedUserCompanyId] = useState(null)

    useEffect(() => {
        dispatch(fetchUsersInCompany(companyId));
    }, [])

    const handleClick = (event,params) => {
        setAnchorEl(event.currentTarget);
        setSelectedUserEmail(params.row.email);
    };

    const handleProfileDialog = async () => {
        await dispatch(fetchUserInformation(selectedUserEmail)).unwrap();
        dispatch(setUserDialog(true));
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClickUserStatus = (event,params) => {
        setAnchorElUserStatus(event.currentTarget);
        setSelectedUserEmail(params.row.email);
        setSelectedUserCompanyId(params.row.id);
    };

    const handleCloseUserStatus = () => {
        setAnchorElUserStatus(null);
    };

    const handleChangeUserStatusInCompany = async ({status}) => {
        try {
            const response = await axios.post(`/companies/update_user_company/`,
                {id:selectedUserCompanyId,userEmail:selectedUserEmail,status:status},
                { withCredentials: true},
            );
            dispatch(setAlert({status:response.data.status,text:response.data.message}));
        } catch (error) {
            dispatch(setAlert({status:error.response.data.status,text:error.response.data.message}));
        } finally {
            dispatch(fetchUsersInCompany(companyId));
            handleClose();
        }
    };

    const userColumns = [
        { field: 'email', headerName: 'User', flex: 1, renderCell: (params) => (
            <>
              <Chip
              avatar={<Avatar alt="" src={params.row.image} />}
              label={params.value} 
              onClick={(e) => handleClick(e,params)}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              />
              <AccountMenu open={open} anchorEl={anchorEl} onClick={handleClose} onClose={handleClose} handleClose={handleClose}>
                <MenuItem onClick={handleProfileDialog}>
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
        { field: 'is_admin', headerName: 'Status', flex: 1, renderCell: (params) => {
            const getChipProps = (status) => {
                switch (status) {
                    case true:
                    return { 
                        icon: <ManageAccountsIcon color={amber[900]}/>, 
                        label: "Manager", 
                        color: amber[900] 
                    };
                    case false:
                    return { 
                        icon: <BadgeIcon color={indigo[300]}/>, 
                        label: "Staff", 
                        color: indigo[300] 
                    };
                    default:
                    return { 
                        icon: <CancelIcon color={amber[900]}/>, 
                        label: "No status", 
                        color: amber[900] 
                    };
                }
            };
        
            const { icon, label, color } = getChipProps(params.value);

            return (
                <>
                    {
                        params.row.email === user.email
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
                            onClick={(e) => handleClickUserStatus(e, params)}
                            color='primary'
                            variant="contained"
                            />
                            <AccountMenu open={openUserStatus} anchorEl={anchorElUserStatus} onClick={handleCloseUserStatus} onClose={handleCloseUserStatus} handleClose={handleCloseUserStatus}>
                                <MenuItem onClick={() => handleChangeUserStatusInCompany({status:"manager"})}>
                                    <ListItemIcon>
                                        <ManageAccountsIcon fontSize="small" color="warning"/>
                                    </ListItemIcon>
                                    <Typography color="warning">Set Manager</Typography>
                                </MenuItem>
                                <MenuItem onClick={() => handleChangeUserStatusInCompany({status:"staff"})}>
                                    <ListItemIcon>
                                        <BadgeIcon fontSize="small" color="primary"/>
                                    </ListItemIcon>
                                    <Typography color="primary">Set Staff</Typography>
                                </MenuItem>
                                <MenuItem onClick={() => setOpenUserStatusDialog(true)}>
                                    <ListItemIcon>
                                        <CancelIcon fontSize="small" color="error"/>
                                    </ListItemIcon>
                                    <Typography color="error">Remove</Typography>
                                </MenuItem>
                            </AccountMenu>
                        </>
                    }
                </>
            )

        }
        },
    ]

    return (
        <>
            <BasicTable
            title="Users"
            rows={usersInCompany}
            columns={userColumns}
            getRowId={(row) => row.id}
            checkboxSelection={false}
            disableRowSelectionOnClick={true}
            loading={usersLoading}
            customButtons={
                <CustomTableButton title="Invite Person" onClick={() => setOpenInviteDialog(true)} icon={<AddBoxIcon fontSize="small"/>}/>
            }
            />
            <InviteDialog
            openInviteDialog={openInviteDialog}
            handleClose={() => setOpenInviteDialog(false)}
            companyId={companyId}
            />
            <OutUserInCompanyDialog
            openInviteDialog={openUserStatusDialog}
            handleClose={() => setOpenUserStatusDialog(false)}
            id={selectedUserCompanyId}
            companyId={companyId}
            companyName={companyName}
            userEmail={selectedUserEmail}
            />
        </>
    )
}

export default UsersInCompany
