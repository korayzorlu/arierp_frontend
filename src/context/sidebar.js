import { createContext, useState } from "react";
import Cookies from "js-cookie";

const SidebarContext = createContext();

function SidebarProvider(props){
    const {children} = props;
    
    const [mobile, setMobile] = useState(false);
    const [collapse, setCollapse] = useState(Cookies.get("collapse") === "true" ? true : false);
    const [toggle, setToggle] = useState(false);
    const [contentWidth, setContentWidth] = useState({sidebar:"240px",page:"calc(100% - 240px)"});
    const [tabNavItems, setTabNavItems] = useState([]);
    const [tabNavContents, setTabNavContents] = useState([]);

 

    //open&close sidebar with button
    const handleCollapse = (collapseTerm,toggleTerm) => {
        setCollapse(collapseTerm);
        setToggle(toggleTerm);
        var element = document.querySelector('.ps-sidebar-root');

        //if (element && element.classList.contains('ps-broken')) {
        if(window.innerWidth <= 1024) {
            setMobile(true);
            if (collapseTerm){
                setContentWidth({sidebar:"0",page:"100%"});
            }else{
                setContentWidth({sidebar:"0",page:"100%"});
            };
        } else {
            setMobile(false);
            document.cookie = `collapse=${collapseTerm}; path=/; ${process.env.REACT_APP_SAME_SITE}`
            if (collapseTerm){
                setContentWidth({sidebar:"78px",page:"calc(100% - 78px)"});
            }else{
                setContentWidth({sidebar:"240px",page:"calc(100% - 240px)"});
            };
        };
    
    };

    //check mobile in opening
    const checkMobile = () => {
        const element = document.querySelector('.ps-sidebar-root');

        //if (element && element.classList.contains('ps-broken')) {
        if(window.innerWidth <= 1024) {
            setMobile(true);
            setContentWidth({sidebar:"0",page:"100%"});
        }else{
            setMobile(false);
            setContentWidth(Cookies.get("collapse") === "true" ? {sidebar:"78px",page:"calc(100% - 78px)"} : {sidebar:"240px",page:"calc(100% - 240px)"});
        };
    };

    //with window resize
    const handleResize = () => {
        const element = document.querySelector('.ps-sidebar-root');

        //if (element && element.classList.contains('ps-broken')) {
        if(window.innerWidth <= 1024) {
            setMobile(true);
            setContentWidth({sidebar:"0",page:"100%"});
        } else {
            setMobile(false);
            setContentWidth({sidebar:"240px",page:"calc(100% - 240px)"});
        }
    };

    const handleOpenTab = (term) => {
        //tab item
        const updatedTabNavItems = tabNavItems.map(item => ({
            ...item,
            class: ""
        }));

        const openedTabNavItems = [
            ...updatedTabNavItems,
            {
                name: term.name,
                class: "active"
            }
        ];

        //tab content
        const updatedTabNavContents = tabNavContents.map(item => ({
            ...item,
            class: ""
        }));

        const openedTabNavContents = [
            ...updatedTabNavContents,
            {
                name: term.name,
                class: "show active",
                component: term.component
            }
        ];

        //set
        setTabNavItems(openedTabNavItems);
        setTabNavContents(openedTabNavContents);
    };
    

    const sharedValuesAndMethods = {
        mobile,
        collapse,
        toggle,
        contentWidth,
        tabNavItems,
        tabNavContents,
        handleCollapse,
        checkMobile,
        handleResize,
        handleOpenTab
    };

    return (
        <SidebarContext.Provider value={sharedValuesAndMethods}>
            {children}
        </SidebarContext.Provider>
    );
};

export {SidebarProvider};
export default SidebarContext;