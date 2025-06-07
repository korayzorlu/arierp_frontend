import { useSelector } from "react-redux";

function Loading() {
    const {theme} = useSelector((store) => store.auth);
    return ( 
        <div className="row w-100 vh-100">
            <div className="col-md-12 text-center d-flex justify-content-center align-items-center">

                <img src={require(`../../images/logo/${theme}/marswide-icon.png`)} height="120" alt=""/>

            </div>
        </div>
     );
}

export default Loading;