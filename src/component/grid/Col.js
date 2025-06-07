function Col(props) {
    const {children,addClass,className,size} = props;

    return (
        <div className={size ? `col-md-${size} ${addClass || ""} ${className || ""}` : `col ${addClass  || ""} ${className || ""}`}>
            {children}
        </div>
    )
}

export default Col
