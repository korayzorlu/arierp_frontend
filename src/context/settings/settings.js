import { createContext, useEffect, useState } from "react";

const SettingsContext = createContext();

function SettingsProvider(props){
    const {children} = props;

    const [tabs, setTabs] = useState([]);
    const [item, setItem] = useState({});

    useEffect(() => {
      setTabs(
        {
            items:[
                {
                    id:"test",
                    target:"esk",
                    active:"active",
                    text:"Profile"
                }
            ],
            panes:[
                {
                    id:"esk",
                    label:"test",
                    active:"show active"
                }
            ]
        }
      );
    }, [])

    const handleItem = (idTerm,targetTerm,activeTerm) => {
        setItem(
            {
                id:idTerm,
                target:targetTerm,
                active:activeTerm
            }
        );
    };
    

    const sharedValuesAndMethods = {
        tabs,
        handleItem
    }

    return (
        <SettingsContext.Provider value={sharedValuesAndMethods}>
            {children}
        </SettingsContext.Provider>
    );
};

export {SettingsProvider};
export default SettingsContext;