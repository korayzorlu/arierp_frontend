function Card(props) {
    const {children,className} = props;
    return ( 
        <div className={`card ${className || ""}`}>
            {children}
        </div>
    );
}

export default Card;
