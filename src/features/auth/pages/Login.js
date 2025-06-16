import { useEffect,useState } from "react";
import { Input } from "mdb-ui-kit";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { changeTheme, clearAuthMessage, fetchCSRFToken, loginAuth, setLoading } from "../../../store/slices/authSlice";
import { fetchCompanies, fetchCompaniesForStart } from "../../../store/slices/organizationSlice";
import { fetchMenuItems } from "../../../store/slices/subscriptionsSlice";
import { fetchNotifications } from "../../../store/slices/notificationSlice";
import { fetchImportProcess } from "../../../store/slices/processSlice";

function Login() {
    const {status,theme,authMessage} = useSelector((store) => store.auth);
    const dispatch = useDispatch();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(true);

    const navigate = useNavigate();
    
    useEffect(() => {
        //mdb input
        const inputs = document.querySelectorAll('.form-outline');
        inputs.forEach((input) => {
            new Input(input); // Her dropdown öğesini başlat
        });

    }, []);

    
    const handleLoginAuth = async (event) => {
        event.preventDefault();
        dispatch(setLoading(true));
        try {
            await dispatch(loginAuth({email, password, remember})).unwrap();
            await dispatch(fetchCSRFToken()).unwrap();
            await Promise.all([
                dispatch(changeTheme(theme === "dark" ? true : false)).unwrap(),
                dispatch(fetchMenuItems()).unwrap(),
                dispatch(fetchCompaniesForStart()).unwrap(),
                dispatch(fetchNotifications()).unwrap(),
                dispatch(fetchImportProcess()).unwrap()
            ]);
            dispatch(setLoading(false));
            navigate('/');
        } catch (error) {
            dispatch(setLoading(false));
        };
    };

    const handleRemember = (event) => {
        setRemember(event.target.checked);
    };

    useEffect(() => {
        if (status) {
            navigate('/');
        }
    }, [status, navigate]);

    return ( 
        <>
            <form className="card-body text-center"onSubmit={handleLoginAuth}>
                <h5 className="card-title mb-3">Oturum Aç</h5>
                <div data-mdb-input-init className="form-outline mb-3">
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} id="formOutline-user-login-email" className="form-control" required />
                    <label className="form-label" htmlFor="formOutline-user-login-email-">Kullanıcı Adı</label>
                </div>
                <div data-mdb-input-init className="form-outline mb-3">
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} id="formOutline-user-login-password" className="form-control" required />
                    <label className="form-label" htmlFor="formOutline-user-login-password-">Parola</label>
                </div>
                <div className="row mb-3">
                    <div className="col d-flex justify-content-center">
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" checked={remember} onChange={handleRemember} id="formOutline-user-rememberMe"/>
                        <label className="form-check-label" htmlFor="formOutline-user-rememberMe"> Beni hatırla </label>
                    </div>
                    </div>

                    <div className="col">
                    <Link to="/auth/forgot-password" className="text-blue-500 fw-bold">Şifremi unuttum</Link>
                    </div>
                </div>
                <button data-mdb-ripple-init type="submit" className="btn btn-primary btn-block">Giriş</button>
                <span className={`text-start btn-block ${authMessage.color}`}><i className={authMessage.icon}></i> {authMessage.text}</span>
            </form>
            <div className="card-footer d-none">
            Don't have an account? <Link to="/auth/register" onClick={() => dispatch(clearAuthMessage())} className="text-blue-500 fw-bold">Kayıt Ol</Link>
            </div>
        </>
    );
}

export default Login;