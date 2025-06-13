import { useEffect, useState } from "react";
import { Input as MDBInput} from "mdb-ui-kit";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from 'formik';
import { basicSchema } from "../../../schemas";
import { useDispatch, useSelector } from "react-redux";
import { changeTheme, clearAuthMessage, fetchCSRFToken, registerAuth } from "../../../store/slices/authSlice";
import Input from "../../../component/input/Input";
import Button from "../../../component/button/Button";
import { fetchMenuItems } from "../../../store/slices/subscriptionsSlice";
import { fetchCompanies } from "../../../store/slices/organizationSlice";
import { fetchNotifications } from "../../../store/slices/notificationSlice";
import { fetchImportProcess } from "../../../store/slices/processSlice";

function Register() {
    const {authMessage,theme} = useSelector((store) => store.auth);
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const [form, setForm] = useState({
        email:"",
        password:"",
        passwordConfirmation:"",
        firstName:"",
        lastName:"",
        refCode:""
    });

    useEffect(() => {
        //mdb input
        const inputs = document.querySelectorAll('.form-outline');
        inputs.forEach((input) => {
            new MDBInput(input); // Her dropdown öğesini başlat
        });

        (() => {
            'use strict';
        
            // Fetch all the forms we want to apply custom Bootstrap validation styles to
            const forms = document.querySelectorAll('.needs-validation');
        
            // Loop over them and prevent submission
            Array.prototype.slice.call(forms).forEach((form) => {
            form.addEventListener('submit', (event) => {
                if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
                }
                form.classList.add('was-validated');
            }, false);
            });
        })();

        //clear input
        setForm({
            email:"",
            password:"",
            passwordConfirmation:"",
            firstName:"",
            lastName:"",
            refCode:""
        })
    }, []);

    const formik = useFormik({
        initialValues: {
            firstName:'',
            email: '',
        },
        validationSchema:basicSchema,
   
        onSubmit: values => {
          alert(JSON.stringify(values, null, 2));
        },
   
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value
        }));
    };

    const handleRegisterAuth = async (event) => {
        event.preventDefault();
        
        try {
            await dispatch(registerAuth(form)).unwrap();
            await Promise.all([
                dispatch(fetchCSRFToken()).unwrap(),
                dispatch(changeTheme(theme === "dark" ? true : false)).unwrap(),
                dispatch(fetchMenuItems()).unwrap(),
                dispatch(fetchCompanies()).unwrap(),
                dispatch(fetchNotifications()).unwrap(),
                dispatch(fetchImportProcess()).unwrap()
                        ]);
            navigate('/');
        } catch (error) {

        };
    };

    



    return ( 
        <>
            <form className="card-body text-center needs-validation" onSubmit={handleRegisterAuth} novalidate>
                <h5 className="card-title mb-3">Sign up to Arınet</h5>
                <div className="row">
                    <div className="col-md-6">
                        <Input type="text" name="firstName" label={"First Name"} onChange={handleChange} id="formOutline-user-register-firstName" required={true}>{form.firstName}</Input>
                    </div>
                    <div className="col-md-6">
                        <Input type="text" name="lastName" label={"Last Name"} onChange={handleChange} id="formOutline-user-register-lastName" required={true}>{form.lastName}</Input>
                    </div>
                </div>
                <Input type="text" name="email" label={"Email Address"} onChange={handleChange} id="formOutline-user-register-email" required={true}>{form.email}</Input>
                <Input type="password" name="password" label={"Password"} onChange={handleChange} id="formOutline-user-register-password" autoComplete="new-password" required={true}>{form.password}</Input>
                <Input type="password" name="passwordConfirmation" label={"Password Confirmation"} onChange={handleChange} id="formOutline-user-register-passwordConfirmation" autoComplete="new-password" required={true}>{form.passwordConfirmation}</Input>
                <Input type="text" name="refCode" label={"Reference Code"} onChange={handleChange} id="formOutline-user-register-refCode" required={true}>{form.refCode}</Input>
                <Button type="submit" color="primary" addClass="btn-block">Sign Up</Button>
                <span className={`text-start btn-block ${authMessage.color}`}><i className={authMessage.icon}></i> {authMessage.text}</span>
            </form>
            <div className="card-footer text-center">
            Have an account? <Link to="/auth/login" onClick={() => dispatch(clearAuthMessage())} className="text-blue-500 fw-bold">Log in</Link>
            </div>
        </>
    );
}

export default Register;