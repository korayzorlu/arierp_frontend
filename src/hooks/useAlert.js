import { Alert as MDBAlert} from 'mdb-ui-kit';
import { useState } from 'react';

function useAlert() {
    const [alert, setAlert] = useState({color:"",text:"",icon:""});

    const reset = () => {
        setAlert({color:"",text:"",icon:""});
    };

    const bind = (alertTerm) => {
        setAlert(alertTerm);
        let basicInstance = MDBAlert.getInstance(document.getElementById("mainAlert"));
        basicInstance.update({color:alert.color});
        basicInstance.show();
    };

    return [bind,reset]

}

export default useAlert
