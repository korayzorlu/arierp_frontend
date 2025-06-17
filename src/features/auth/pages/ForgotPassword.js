import { useEffect, useState } from "react";
import { Input } from "mdb-ui-kit";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthMessage, fetchCSRFToken, forgotPasswordAuth, setAuthMessage } from "../../../store/slices/authSlice";

function ForgotPassword() {
    const {authMessage} = useSelector((store) => store.auth);
    const dispatch = useDispatch()

    const [email, setEmail] = useState("");

    useEffect(() => {
        //mdb input
        const inputs = document.querySelectorAll('.form-outline');
        inputs.forEach((input) => {
            new Input(input); // Her dropdown öğesini başlat
        });

        //clear input
        setEmail("");
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        try {
            await dispatch(forgotPasswordAuth(email)).unwrap();
            await dispatch(fetchCSRFToken()).unwrap();
            dispatch(setAuthMessage({
                color:"text-green-500",
                icon:"fas fa-check-circle",
                text:(
                    <>
                    Password reset link has been sent. <Link to="/auth/login" onClick={() => dispatch(clearAuthMessage())} className="text-blue-500 fw-bold">Log in</Link>
                    </>
                    )
            }));
        } catch (error) {

        };
        
    };

    return ( 
        <>
            <form className="card-body text-center needs-validation" onSubmit={handleSubmit} novalidate>
                <h5 className="card-title mb-3">Reset Password</h5>
                <div data-mdb-input-init className="form-outline mb-3">
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} id="formOutline-user-register-email" className="form-control" required />
                    <label className="form-label" htmlFor="formOutline-user-register-email-">Email address</label>
                </div>
                <button data-mdb-ripple-init type="submit" className="btn btn-primary btn-block">Send Password Reset Link</button>
                <span className={`text-start btn-block ${authMessage.color}`}><i className={authMessage.icon}></i> {authMessage.text}</span>
            </form>
            <div className="card-footer text-center d-none">
                Don't have an account? <Link to="/auth/register" onClick={() => dispatch(clearAuthMessage())} className="text-blue-500 fw-bold">Sign up</Link>
            </div>
        </>
    );
}

export default ForgotPassword;