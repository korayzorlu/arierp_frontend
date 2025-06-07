function CardBody(props) {
    const {children,addClass} = props;
    return ( 
        <div className={`card-body ${addClass ? addClass : ""}`}>
            {children}
        </div>
     );
}

export default CardBody;