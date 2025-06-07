import * as yup from 'yup';

export const basicSchema=yup.object().shape({
    firstName:yup
        .string()
        .required("sdgsfdgfdg"),
    email:yup
        .string()
        .email("Invalid email address!")
        .required("Email address is required.")
    
})