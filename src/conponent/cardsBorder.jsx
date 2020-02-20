import React, {useState, useEffect} from 'react';


export default function CardsBorder(props) {
    return (<div className="cardsBorder" style={{
        display: props.disabled ? "none" : "block",
        top: (props.top || 0) + "px",
        left: (props.left || 0) + "px",
        height: props.height + "px",
        width: props.width + "px",
        zIndex:100
    }}/>)
}


