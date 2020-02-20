import React, {useState, useEffect, useReducer, useRef} from 'react';
import ReactDOM from 'react-dom';
import "./css/custom.scss";
import Card from './conponent/card.jsx';
import CardsBorder from './conponent/cardsBorder.jsx';
import {GameReducer, DefaultGameInfo} from "./reducers/gameReducer.jsx";

//牌基本資訊
const suitOfCardInfo = {
    posGap: {
        x: 150,
        y: 40,
        baseX: 16,
        baseY: 300
    },
    sendSpeed: 5
};

function App() {
    const [gameInfo, dispatch] = useReducer(GameReducer, null, DefaultGameInfo);
    let cardsRender = [], cardTempAreaRender = [], cardTargetAreaRender = [];

    //下方區域的背景區域的顯示
    for (let index = 0; index < 8; index++) {
        cardsRender.push(
            (<Card key={"back_" + index}
                   {...{
                       gameRound: gameInfo.gameRound,
                       index: index,
                       cardClick: () => {
                           dispatch({type: 'clickBackArea', colIndex: index});
                       },
                       sendSpeed: suitOfCardInfo.sendSpeed,
                       position: {
                           left: (index % 8) * suitOfCardInfo.posGap.x + suitOfCardInfo.posGap.baseX,
                           top: suitOfCardInfo.posGap.baseY,
                       }
                   }}
            />)
        );
    }
    //下方區域的牌的顯示
    for (let index = 0; index < 52; index++) {
        cardsRender.push(
            (<Card key={index}
                   index={index}
                   gameRound={gameInfo.gameRound}
                   cardClick={() => {
                       dispatch({type: 'clickCard', cardIndex: gameInfo.sendCardIndex[index]});
                   }}
                   {...gameInfo.cards[gameInfo.sendCardIndex[index]]}
                   sendSpeed={suitOfCardInfo.sendSpeed}/>)
        )
    }
    //左上暫時區域的顯示
    for (let index in gameInfo.cardTempAreaInfo) {
        let data = gameInfo.cardTempAreaInfo[index];
        cardTempAreaRender.push(
            <div
                key={index}
                className="cardsTempAreaBorder"
                onClick={() => {
                    dispatch({type: 'clickTempArea', colIndex: index});
                }}
                style={{
                    top: data.top + "px",
                    left: data.left + "px",
                }}/>
        )
    }
    //右上目標區域的顯示
    for (let index in gameInfo.cardTargetAreaInfo) {
        let data = gameInfo.cardTargetAreaInfo[index];
        cardTargetAreaRender.push(
            <div
                key={index}
                className="cardsTargetAreaBorder"
                onClick={() => {
                    dispatch({type: 'clickTargetArea', colIndex: index});
                }}
                style={{
                    top: data.top + "px",
                    left: data.left + "px",
                }}/>
        )
    }
    return (<>
        <button onClick={() => dispatch({type: 'reStart'})}>重發牌</button>
        <button onClick={() => dispatch({type: 'reStartSameGame'})}>同樣的重發牌</button>
        {cardTempAreaRender}
        {cardTargetAreaRender}
        <CardsBorder {...gameInfo.cardActiveBorderData}/>
        {cardsRender}
    </>)
}


ReactDOM.render(
    <>
        <App/>
    </>,
    document.getElementById('root')
);
