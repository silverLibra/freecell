import React, {useState, useEffect} from 'react';
import "../css/custom.scss";

export default function Card(props) {
    let classNameIndex = props.index;
    let [cardInfo, setCardInfo] = useState({
        className: "hideCard card cardSendAnimation" + classNameIndex
    });
    let position = props.position;
    useEffect(() => {
        return (()=>{
            console.log('test');
        })
    },[]);
    useEffect(() => {
        setCardInfo({...cardInfo, className: "hideCard card cardSendAnimation" + classNameIndex})

    }, [props.gameRound]);

    let style = {
        zIndex: position.rowIndex !== undefined ? (position.rowIndex >= 0 ? position.rowIndex + 10 : props.suitIndex) : "1",
        backgroundImage: 'url(' + props.imgUrl + ')',
    };
    if (position.left) {
        style.left = position.left + "px";
    }
    if (position.top) {
        style.top = position.top + "px";
    }
    return (<div
        // onMouseEnter={props.cardMouseEnter}
        onAnimationEnd={() => {
            setCardInfo({...cardInfo, className: "card cardEnd" + classNameIndex});
        }}
        onAnimationStart={() => {
            setCardInfo({...cardInfo, className: "card cardSendAnimation" + classNameIndex});
        }}
        onClick={props.cardClick}
        className={cardInfo.className}
        style={style}>{}</div>)
}

