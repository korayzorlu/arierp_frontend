import React, { useEffect, useContext, useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchMenuItems } from "../../store/slices/subscriptionsSlice";
import { setSidebar } from "../../store/slices/sidebarSlice";


//import { ReactComponent as DataIcon } from '../../images/icons/sidebar/light/database-filled.svg';

function Sidenav() {
    const {collapse,toggle,mobile} = useSelector((store) => store.sidebar);
    const {menuItems} = useSelector((store) => store.subscriptions);

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const icons = {
        account: require("../../images/icons/sidebar/light/account_balance_wallet-filled.svg").ReactComponent,
        accounting: require("../../images/icons/sidebar/light/calculate-filled.svg").ReactComponent,
        article: require("../../images/icons/sidebar/light/article_shortcut-filled.svg").ReactComponent,
        badge: require("../../images/icons/sidebar/light/badge-filled.svg").ReactComponent,
        box: require("../../images/icons/sidebar/light/box-filled.svg").ReactComponent,
        checkbook: require("../../images/icons/sidebar/light/checkbook-filled.svg").ReactComponent,
        contract: require("../../images/icons/sidebar/light/contract-filled.svg").ReactComponent,
        cottage: require("../../images/icons/sidebar/light/cottage-filled.svg").ReactComponent,
        dashboard: require("../../images/icons/sidebar/light/dashboard-filled.svg").ReactComponent,
        database: require("../../images/icons/sidebar/light/database-filled.svg").ReactComponent,
        description: require("../../images/icons/sidebar/light/description-filled.svg").ReactComponent,
        handshake: require("../../images/icons/sidebar/light/handshake.svg").ReactComponent,
        home: require("../../images/icons/sidebar/light/home-work.svg").ReactComponent,
        home_work: require("../../images/icons/sidebar/light/home_work-filled.svg").ReactComponent,
        hub: require("../../images/icons/sidebar/light/hub-filled.svg").ReactComponent,
        in_home_mode: require("../../images/icons/sidebar/light/in_home_mode-filled.svg").ReactComponent,
        inventory: require("../../images/icons/sidebar/light/inventory-filled.svg").ReactComponent,
        invoice: require("../../images/icons/sidebar/light/request_page-filled.svg").ReactComponent,
        mail: require("../../images/icons/sidebar/light/mail-filled.svg").ReactComponent,
        organization: require("../../images/icons/sidebar/light/home-filled.svg").ReactComponent,
        paid: require("../../images/icons/sidebar/light/paid-filled.svg").ReactComponent,
        payment: require("../../images/icons/sidebar/light/payments-filled.svg").ReactComponent,
        policy: require("../../images/icons/sidebar/light/policy-filled.svg").ReactComponent,
        price_change: require("../../images/icons/sidebar/light/price_change-filled.svg").ReactComponent,
        real_estate_agent: require("../../images/icons/sidebar/light/real_estate_agent-filled.svg").ReactComponent,
        receipt: require("../../images/icons/sidebar/light/receipt_long.svg").ReactComponent,
        report: require("../../images/icons/sidebar/light/report-filled.svg").ReactComponent,
        tree: require("../../images/icons/sidebar/light/account_tree-filled.svg").ReactComponent,
        unknown: require("../../images/icons/sidebar/light/unknown_document-filled.svg").ReactComponent, 
    };

    const DefaultIcon = require("../../images/icons/sidebar/light/dashboard-filled.svg").ReactComponent;

    const getIconComponent = (iconName) => {
        const IconComponent = icons[iconName] || DefaultIcon;
        return <IconComponent className="sideBarIcon" height="24" alt="" loading="lazy" />;
    };

    var collapsed = collapse
    var sideBarWidth = "240x";

    if (mobile){
        collapsed = false;
        sideBarWidth = "300px";
    }else{
        collapsed = collapse;
    };

    const handleClick = (event) => {
        navigate(event.currentTarget.name)
       
    };

    const handleToggle = () => {
        dispatch(setSidebar({collapseTerm:!collapse,toggleTerm:!toggle}));
    };

    /*
    <div className="row p-2" style={{ textAlign: 'center', borderTop: '1px solid #ccc' }}>
                <div className="col-md-12">
                    <img src={require("../../images/logo/light/marswide-icon.png")} height="20" alt="MichoApp" loading="lazy" />
                </div>
            </div>
            */

    return ( 
        // <Sidebar collapsed={collapsed} toggled={toggle} customBreakPoint="1024px" width={sideBarWidth} collapsedWidth="78px"
        // rootStyles={{"height":"100%","border":"none"}}>
        //     <Menu menuItemStyles={{button: {[`&.active`]: {backgroundColor: '#13395e',color: '#b6c8d9',},},}}>
        //         <MenuItem className={location.pathname === "/" ? "active" : ""} name="dashboard" component={<Link to="/"></Link>} icon={<DashboardIcon className="sideBarIcon" height="24" alt="" loading="lazy" disabled/>}>Dashboard</MenuItem>
        //         <SubMenu rootStyles={{"marginTop":"auto"}} label="Organization" icon={<OrganizationIcon className="sideBarIcon" height="24" alt="" loading="lazy"/>}>
        //             <MenuItem className={location.pathname.startsWith("/companies") ? "active" : ""} name="companies" component={<Link to="/companies"></Link>} icon={<CompanyIcon className="sideBarIcon" height="24" alt="" loading="lazy" disabled/>}>Companies</MenuItem>
        //         </SubMenu>
        //         <SubMenu label="Card" icon={<CardIcon className="sideBarIcon" height="24" alt="" loading="lazy"/>}>
        //                 <MenuItem className={location.pathname === "/partners" ? "active" : ""} name="partners" component={<Link to="/partners"></Link>} icon={<HandshakeIcon className="sideBarIcon" height="24" alt="" loading="lazy"/>}>Partners</MenuItem>
        //         </SubMenu>
        //         <SubMenu label="Data" icon={<DataIcon className="sideBarIcon" height="24" alt="" loading="lazy"/>}>
        //             <MenuItem name="maker" onClick={handleClick} icon={<i className="fa-solid fa-bookmark"></i>}> Makers </MenuItem>
        //             <MenuItem name="part" onClick={handleClick} icon={<i className="fa-solid fa-screwdriver-wrench"></i>}> Parts </MenuItem>
        //         </SubMenu>
        //     </Menu>
            
        // </Sidebar>

        <Sidebar
        collapsed={collapsed}
        toggled={toggle}
        customBreakPoint="1024px"
        width={sideBarWidth}
        collapsedWidth="78px"
        rootStyles={{"height":"100%","border":"none"}}
        onBackdropClick={handleToggle}
        >
            <Menu menuItemStyles={{button: {[`&.active`]: {backgroundColor: '#13395e',color: '#b6c8d9',},},}}>

            {
                menuItems.map((menuItem,index) => {
                    if(menuItem.type === "sub_menu"){
                        return (
                            <SubMenu
                            key={index}
                            rootStyles={{"marginTop":"auto"}}
                            label={menuItem.label}
                            icon={getIconComponent(menuItem.icon)}
                            >
                                {
                                    menuItem.items.map((item,index) => {
                                        return  <MenuItem
                                                    key={index}
                                                    className={location.pathname.startsWith(item.route) ? "active" : ""}
                                                    name={item.label}
                                                    component={<Link to={item.route}></Link>}
                                                    //icon={getIconComponent(item.icon)}
                                                >
                                                    {item.label}
                                                </MenuItem>
                                    })
                                }
                            </SubMenu>
                        );
                    }
                    if(menuItem.type === "item"){
                        return (
                            <MenuItem
                            key={index}
                            className={
                                location.pathname === "/" && menuItem.route === "/dashboard"
                                ?
                                    "active"
                                :
                                    location.pathname.startsWith(menuItem.route)
                                    ?
                                        "active"
                                    :
                                        ""
                            }
                            name={menuItem.label}
                            component={<Link to={menuItem.route === "/dashboard" ? "/" : menuItem.route}></Link>}
                            icon={getIconComponent(menuItem.icon)}
                            >
                                {menuItem.label}
                            </MenuItem>
                        )
                    }
                    
                    return <></>
                    
                })
            }
            

            </Menu>
        </Sidebar>
        
    );
}

export default Sidenav;