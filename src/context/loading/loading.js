import { createContext, useState } from "react";

const LoadingContext = createContext();

function LoadingProvider(props){
    const {children} = props;

    const [loading, setLoading] = useState(true)

    const handleLoading = (loadingTerm) => {
        setLoading(loadingTerm);
    };

    const sharedValuesAndMethods = {
        loading,
        handleLoading
    };

    return (
        <LoadingContext.Provider value={sharedValuesAndMethods}>
            {children}
        </LoadingContext.Provider>
    );
};

export {LoadingProvider};
export default LoadingContext;