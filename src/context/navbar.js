import { createContext, useState } from "react";

const NavbarContext = createContext();

function NavbarProvider(props) {
    const {children} = props;


    const sharedValuesAndMethods = {
        
    }

    return (
        <NavbarContext.Provider value={sharedValuesAndMethods}>
            {children}
        </NavbarContext.Provider>
    );
};

export {NavbarProvider};

export default NavbarContext;