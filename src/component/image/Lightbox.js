import React, { useEffect } from 'react'
import { Lightbox as MDBLightbox } from "mdb-ui-kit";

function Lightbox(props) {
    const {children,src,alt,height,width,addClass,loading} = props;

    useEffect(() => {
            //mdb lightbox
            const lightboxs = document.querySelectorAll('.lightbox');
            lightboxs.forEach((lightbox) => {
                new MDBLightbox(lightbox);
            });
    
        }, []);
    
  return (
    <div className="lightbox" data-mdb-lightbox-init>
      <img
        src={src ? src : ""}
        alt={alt ? alt : ""}
        height={height ? height : "auto"}
        width={width ? width : "auto"}
        className={addClass ? addClass : ""}
        loading={loading ? loading : ""}
        style={{objectFit:"cover"}}
      />
    </div>
  )
}

export default Lightbox
