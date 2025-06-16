import { Link } from "react-router-dom";
import { ReactComponent as DarkModeIcon } from '../../images/icons/navbar/dark-mode.svg';
import { ReactComponent as LightModeIcon } from '../../images/icons/navbar/light-mode.svg';
import { useDispatch, useSelector } from "react-redux";
import { changeTheme, clearAuthMessage } from "../../store/slices/authSlice";

function NavbarLanding() {
    const {dark,theme,logo} = useSelector((store) => store.auth);
    const dispatch = useDispatch();

     //theme

     const handleToggleTheme = (event) => {
        event.preventDefault();

        dispatch(changeTheme(!dark));
    };

    //theme-end


    return ( 
        <nav className="navbar fixed-top navbar-expand-lg navbar-light bg-body-tertiary" style={{"height":"40px"}}>
                
            <div className="container-fluid">
                <a className="navbar-brand mt-lg-0 p-0" href="/">
                    <img src={logo} height="18" alt="Marswide" loading="lazy" />
                </a>
                <div className="d-flex align-items-center">
                    <button className="nav-link me-3" onClick={handleToggleTheme}>{theme === "dark" ? <><LightModeIcon/></>: <><DarkModeIcon/></>}</button>
                    <Link className="nav-link" to="/auth/login" onClick={() => dispatch(clearAuthMessage())}>Giriş</Link>
                </div>
            </div>
                
        </nav>
     );
}

export default NavbarLanding;