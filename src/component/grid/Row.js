function Row(props) {
    const {children,addClass,className} = props;

  return (
    <div className={`row ${addClass ? addClass : ""} ${className || ""}`}>
      {children}
    </div>
  )
}

export default Row
