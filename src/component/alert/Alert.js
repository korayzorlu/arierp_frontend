import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Snackbar } from "@mui/material";
import { Alert as MUIAlert } from "@mui/material";
import { setOpenAlert } from "../../store/slices/notificationSlice";

function Alert(props) {
    const {} = props;
    const {dark} = useSelector((store) => store.auth);
    const {alertt,openAlert} = useSelector((store) => store.notification);

    const dispatch = useDispatch();

    useEffect(() => {
        //mdb input
        // const alerts = document.querySelectorAll('.alert');
        // alerts.forEach((alert) => {
        //     new MDBAlert(alert); // Her dropdown öğesini başlat
        // });
    
    }, []);

    const handleClick = () => {
        dispatch(setOpenAlert(false));
    };
    
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }
    
        dispatch(setOpenAlert(false));
    };
    

    return ( 
        // <div className="alert alert-dismissible fade mt-3 shadow-2" id="mainAlert" role="alert"
        // data-mdb-alert-init
        // data-mdb-color={color}
        // data-mdb-position="bottom-right"
        // data-mdb-hidden="true"
        // data-mdb-autohide="true"
        // data-mdb-width={mobile ? "75%" : "25%"}
        // data-mdb-delay="2000"
        // >
        //     <i className={`fas fa-${icon} me-3`}></i>
        //     {text}
        //     <button type="button" className="btn-close" data-mdb-dismiss="alert" aria-label="Close"></button>
        // </div>
        <Snackbar
        open={openAlert}
        onClose={handleClose}
        autoHideDuration={3000}
        anchorOrigin={{ vertical:"bottom", horizontal:"right" }}
        message={alertt.status ? "" : alertt.text}
        >
            {
                alertt.status
                ?
                <MUIAlert
                onClose={handleClose}
                severity={alertt.status}
                variant={dark ? "standard" : "outlined"}
                sx={{ bgcolor: 'background.paper' }}
                //sx={{ width: '100%' }}
                >
                    {alertt.text}
                </MUIAlert>
                :
                null
            }
            
        </Snackbar>
    );
}

export default Alert;