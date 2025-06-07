function CardFooter(props) {
    const {children, addClass} = props;

    return ( 
        <div className={`card-footer ${addClass ? addClass : ""}`}>
            {children}
        </div>
    );
}

export default CardFooter;