function Form(props) {
    const {children,onSubmit} = props;

   

    return ( 
        <form className="text-center" onSubmit={onSubmit}>
            {children}
        </form>
    );
}

export default Form;