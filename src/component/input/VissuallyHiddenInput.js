import React from 'react'
import { styled } from '@mui/material/styles';

function VissuallyHiddenInput(props) {
    const {onChange,accept} = props;

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

  return (
    <VisuallyHiddenInput
        type="file"
        onChange={onChange}
        multiple
        accept={accept || null}
    />
  )
}

export default VissuallyHiddenInput
