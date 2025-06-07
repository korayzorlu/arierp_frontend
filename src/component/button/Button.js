function Button(props) {
    const {children,type,color,addClass,onClick,disabled} = props;

    return ( 
        <button data-mdb-ripple-init type={type} className={`btn btn-${color} ${addClass}`} onClick={onClick} disabled={disabled}>
            {children}
        </button>
    );
}

export default Button;