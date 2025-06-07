import { useEffect, useState } from "react";
import PanelContent from "../../../component/panel/PanelContent";
import ListTable from "../../../component/table/ListTable";
import CustomTableButton from "../../../component/table/CustomTableButton";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { GridActionsCellItem, GridRowModes } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompanies } from "../../../store/slices/organizationSlice";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import BadgeIcon from '@mui/icons-material/Badge';
import { Chip, Divider, ListItemIcon, MenuItem } from "@mui/material";
import { amber,indigo } from '@mui/material/colors';
import Avatar from '@mui/material/Avatar';
import AccountMenu from "../../../component/menu/AccountMenu";
import MessageIcon from '@mui/icons-material/Message';
import AddBoxIcon from '@mui/icons-material/AddBox';
import CheckIcon from '@mui/icons-material/Check';
import { fetchUserInformation } from "../../../store/slices/authSlice";
import { setUserDialog } from "../../../store/slices/notificationSlice";

function Companies() {
    const {companies,companiesLoading,activeCompany} = useSelector((store) => store.organization);

    const dispatch = useDispatch();

    const [rows, setRows] = useState([]);
    //const [sessionCompany, setSessionCompany] = useState(JSON.parse(sessionStorage.getItem('active_company')));
    const [selectedUserEmail, setSelectedUserEmail] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event,params) => {
      setAnchorEl(event.currentTarget);
      setSelectedUserEmail(params.row.owner);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    useEffect(() => {
      dispatch(fetchCompanies());
      setRows(companies);
    }, []);

    const handleProfileDialog = async () => {
        await dispatch(fetchUserInformation(selectedUserEmail)).unwrap();
        dispatch(setUserDialog(true));
    };

    const columns = [
        { field: 'company', headerName: 'Name', flex: 1, editable: true, renderCell: (params) => (
            <>
              {
                params.row.is_admin
                  ?
                    <Link
                    to={`/companies/update/${params.row.id}/`} 
                    state={{id: params.row.id,companyId: params.row.companyId}}
                    style={{textDecoration:"underline"}}>
                      {params.value.name}
                    </Link>
                  :
                    params.value.name
              }
              
            </>
            
          )
        },
        { field: 'is_admin', headerName: 'Status', width: 150, renderCell: (params) => (
            <>
              {
                params.value
                  ?
                    <>
                      <Chip
                      icon={<ManageAccountsIcon/>}
                      label="Manager"
                      color="warning"
                      variant="contained"
                      size="small"
                      />
                    </>
                  :
                    <>
                      <Chip
                      icon={<BadgeIcon color={indigo[300]}/>}
                      label="Staff"
                      color="primary"
                      variant="contained"
                      size="small"
                      />
                    </>
              }
            </>
          )
        },
        { field: 'is_active', headerName: 'Is Active', width: 150, renderCell: (params) => (
          <>
            {
              activeCompany && params.row.id === activeCompany.id
              ?
                <>
                  <Chip
                  icon={<CheckIcon/>}
                  label="Active"
                  color="primary"
                  variant="contained"
                  size="small"
                  />
                </>
              :
                <></>
            }
          </>
        )
      },
        { field: 'owner', headerName: 'Owner', width: 300, renderCell: (params) => (
            <>
              <Chip
              avatar={<Avatar alt="" src={params.row.userImage} />}
              label={params.value} 
              onClick={(e) => handleClick(e,params)}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              />
              <AccountMenu open={open} anchorEl={anchorEl} onClick={handleClose} onClose={handleClose} handleClose={handleClose}>
                <MenuItem onClick={handleProfileDialog}>
                  <ListItemIcon>
                    <Avatar/>
                  </ListItemIcon>
                  Profile
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
    ]

    return ( 
            <PanelContent>
                <ListTable
                title="Companies"
                rows={companies}
                columns={columns}
                getRowId={(row) => row.id}
                loading={companiesLoading}
                customButtons={
                    <CustomTableButton link="/companies/add-company" icon={<AddBoxIcon fontSize="small"/>} title="New"/>
                }
                ></ListTable>
            </PanelContent>
        
    );
}

export default Companies;