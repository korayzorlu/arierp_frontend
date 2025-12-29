import axios from 'axios';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchCompanies, fetchCompaniesForStart, setActiveCompany } from '../../store/slices/organizationSlice';
import { setAlert } from '../../store/slices/notificationSlice';
import MUIButton from '@mui/material/Button';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Backdrop, Button, CircularProgress, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { red } from '@mui/material/colors';
import { setLoading } from '../../store/slices/authSlice';

function Companies(props) {
    const {children} = props;

    const {dark} = useSelector((store) => store.auth);
    const {companies,activeCompany} = useSelector((store) => store.organization);

    const dispatch = useDispatch();

    const [openBackdrop, setOpenBackdrop] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleChaneActiveCompany = async (companyId) => {
        //dispatch(setLoading(true));
        setOpenBackdrop(true);

        const selectedCompany = companies.find(({id}) => id === companyId);
        
        try {
            const response = await axios.put(`/companies/api/user_companies/${selectedCompany.id}/`, 
                {
                    id : selectedCompany.id,
                    is_active : true,
                    is_admin : selectedCompany.is_admin
                },
                {withCredentials: true},
            );

            if (response.status === 200) {
                if(activeCompany){
                    await axios.put(`/companies/api/user_companies/${activeCompany.id}/`, 
                        {
                            id : activeCompany.id,
                            is_active : false,
                            is_admin : activeCompany.is_admin
                        },
                        {withCredentials: true},
                    );
                };
                
                dispatch(setActiveCompany(selectedCompany));
                dispatch(setAlert({status:"success",text:"Changed successfully!"}));
            }
        } catch (error) {
            dispatch(setAlert({status:"error",text:"Sorry, something went wrong!"}));
        } finally {
            setAnchorEl(null);
            dispatch(fetchCompaniesForStart());
            //dispatch(setLoading(false));
            setOpenBackdrop(false);
        }
    };

    return (
        <>
             <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={openBackdrop}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            {
                companies.length > 0

                ?   

                    <>
                        <Button
                        id="basic-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                        variant="contained"
                        color={dark ? "mars" : "blackhole"}
                        className='me-3 pt-0 pb-0'
                        endIcon={<KeyboardArrowDownIcon />}
                        >
                            {activeCompany ? activeCompany.company.name : "-SELECT COMPANY-"}
                        </Button>
                        <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                        'aria-labelledby': 'basic-button',
                        }}
                        >
                            {
                                companies.map((company,index) => {
                                    return (
                                        <MenuItem key={index} onClick={() => handleChaneActiveCompany(company.id)}>
                                            {
                                                activeCompany && company.id === activeCompany.id
                                                ?   
                                                    <>
                                                        <ListItemIcon>
                                                            <CheckIcon />
                                                        </ListItemIcon>
                                                        <ListItemText>{company.company.name}</ListItemText>
                                                    </>
                                                :
                                                    <ListItemText inset>{company.company.name}</ListItemText>
                                            }
                                        </MenuItem>
                                    )
                                })
                            }
                        </Menu> 
                        {/* <div className="dropdown">
                            <a
                            data-mdb-dropdown-init
                            className={`link-secondary me-3 dropdown-toggle ${dark ? "text-white" : "text-dark"}`}
                            href="/"
                            id="navbarDropdownMenuLink"
                            role="button"
                            aria-expanded="false"
                            data-mdb-offset="0,12"
                            >
                                {companies.length > 0 ? activeCompany.company.name : ""}
                            </a>
                            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownMenuLink">
                                {
                                    companies.map((company,index) => {
                                        return (
                                            <li key={index}>
                                                <button
                                                className="dropdown-item"
                                                value={company.id}
                                                onClick={handleChaneActiveCompany}
                                                >
                                                    {company.id === activeCompany.id ? <i className="fas fa-check"></i> : <i className="fas fa-check invisible"></i> }
                                                    &nbsp;{company.company.name}
                                                </button>
                                            </li>
                                        );
                                    })
                                }
                            </ul>
                        </div> */}
                    </>

                :

                    <></>

            }
        </>
    )
}

export default Companies
