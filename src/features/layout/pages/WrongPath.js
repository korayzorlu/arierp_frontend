import { useSelector } from "react-redux";

function WrongPath() {
    const {theme} = useSelector((store) => store.auth);

    return ( 
        <div className="row w-100 vh-100 g-0">
            <div className="col-md-12 text-center d-flex flex-column justify-content-center align-items-center">

                <div className="row mb-5">
                    <div className="col-md-12 text-center">
                        <img src={require(`../../../images/logo/${theme}/ari-logo-full.png`)} height="40" alt=""/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <img src={require(`../../../images/icons/global/error-404.png`)} height="400" alt=""/>
                    </div>
                </div>
                
                

            </div>
        </div>
    );
}

export default WrongPath;