import React from 'react';
//牌基本資訊
const suitOfCardInfo = {
    suits: ["club", "diamonds", "heart", "spade"],
    suitIndex: ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"],
    posGap: {
        x: 150,
        y: 40,
        baseX: 16,
        baseY: 300
    },
    tempAreaGap: {
        x: 150,
        y: 40,
        baseX: 16,
        baseY: 20
    },
    targetAreaGap: {
        x: 150,
        y: 40,
        baseX: 616,
        baseY: 20
    },
    sendSpeed: 5
};
const getLeftByColIndex = (colIndex) => {
    return colIndex * suitOfCardInfo.posGap.x + suitOfCardInfo.posGap.baseX;
};
const getTopByColIndex = (rowIndex) => {
    return rowIndex * suitOfCardInfo.posGap.y + suitOfCardInfo.posGap.baseY;
};
//洗牌
const initCards = (cards) => {
    let resultIndex = [];
    const shuffle = (arr) => {
        let i, j, temp;
        for (i = arr.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
        return arr;
    };
    resultIndex = new Array(52).fill(0).map((v, index) => {
        return index;
    }).reverse();
    resultIndex = shuffle(resultIndex);
    resultIndex.forEach((data, index) => {
        let rowIndex = (Math.floor(index / 8));
        let colIndex = index % 8;
        cards[data] = {
            ...cards[data],
            position: {
                posType: "inRowCol",
                colIndex: colIndex,
                rowIndex: rowIndex
            }
        };
    });
    return {data: cards, dataIndex: resultIndex};
};
//預設的遊戲資訊
const defaultGameInfo = (_cards, gameRound) => {
    let cardsInfo = _cards ? _cards : initCards(new Array(52).fill(0).map((v, index) => {
        return {
            cardId: index,
            suit: Math.ceil((index + 1) / 13),
            suitIndex: index % 13 + 1,
            imgUrl: "./img/cards/" + suitOfCardInfo.suits[Math.ceil((index + 1) / 13) - 1] + "/" + suitOfCardInfo.suitIndex[index % 13] + ".png",
        }
    }));
    let cardColInfo = {};
    for (let i = 0; i < 52; i++) {
        if (!cardColInfo[i % 8]) {
            cardColInfo[i % 8] = [];
        }
        cardColInfo[i % 8].push(cardsInfo.dataIndex[i])
    }
    return {
        gameRound: gameRound ? gameRound : 1,
        originCards: cardsInfo,
        cards: cardsInfo.data,
        sendCardIndex: cardsInfo.dataIndex,
        cardColInfo: cardColInfo,
        cardTempAreaInfo: {
            "1": {
                left: suitOfCardInfo.tempAreaGap.baseX,
                top: suitOfCardInfo.tempAreaGap.y + suitOfCardInfo.tempAreaGap.baseY,
                data: null
            },
            "2": {
                left: suitOfCardInfo.tempAreaGap.x + suitOfCardInfo.tempAreaGap.baseX,
                top: suitOfCardInfo.tempAreaGap.y + suitOfCardInfo.tempAreaGap.baseY,
                data: null
            },
            "3": {
                left: suitOfCardInfo.tempAreaGap.x * 2 + suitOfCardInfo.tempAreaGap.baseX,
                top: suitOfCardInfo.tempAreaGap.y + suitOfCardInfo.tempAreaGap.baseY,
                data: null
            },
            "4": {
                left: suitOfCardInfo.tempAreaGap.x * 3 + suitOfCardInfo.tempAreaGap.baseX,
                top: suitOfCardInfo.tempAreaGap.y + suitOfCardInfo.tempAreaGap.baseY,
                data: null
            }
        },
        cardTargetAreaInfo: {
            "1": {
                left: suitOfCardInfo.targetAreaGap.baseX,
                top: suitOfCardInfo.targetAreaGap.y + suitOfCardInfo.targetAreaGap.baseY,
                data: []
            },
            "2": {
                left: suitOfCardInfo.targetAreaGap.x + suitOfCardInfo.targetAreaGap.baseX,
                top: suitOfCardInfo.targetAreaGap.y + suitOfCardInfo.targetAreaGap.baseY,
                data: []
            },
            "3": {
                left: suitOfCardInfo.targetAreaGap.x * 2 + suitOfCardInfo.targetAreaGap.baseX,
                top: suitOfCardInfo.targetAreaGap.y + suitOfCardInfo.targetAreaGap.baseY,
                data: []
            },
            "4": {
                left: suitOfCardInfo.targetAreaGap.x * 3 + suitOfCardInfo.targetAreaGap.baseX,
                top: suitOfCardInfo.targetAreaGap.y + suitOfCardInfo.targetAreaGap.baseY,
                data: []
            }
        },
        cardActiveCardIdsInfo: null,
        cardActiveBorderData: {
            disabled: true
        },
    }
};

//取得牌區牌的順序
const getCardIndex = (cards) => {
    let result = {};
    cards.forEach((data) => {
        if (data.position.posType === "inRowCol") {
            result[data.position.colIndex] = result[data.position.colIndex] || [];
            result[data.position.colIndex].push({cardId: data.cardId, rowIndex: data.position.rowIndex});
        }
    });
    for (let i = 0; i < 8; i++) {
        if (result[i]) {
            result[i] = result[i].sort((a, b) => {
                return a.rowIndex - b.rowIndex
            }).map((data) => {
                return data.cardId
            });
        }
    }
    return result;
};
//確認牌是否可以連接
const cardCanConnect = (cardTarget, cardSource, type = "inRowCol") => {
    if (type === "inRowCol" && cardTarget.suitIndex === cardSource.suitIndex + 1
        && (([1, 4].includes(cardTarget.suit) && [2, 3].includes(cardSource.suit))
            || ([1, 4].includes(cardSource.suit) && [2, 3].includes(cardTarget.suit)))
    ) {
        return true;
    } else if (type === "targetArea"
        && cardTarget.suitIndex + 1 === cardSource.suitIndex
        && cardTarget.suit === cardSource.suit
    ) {
        return true;
    } else {
        return false;
    }
};
//娶得牌的目前的擺放區域
const getCardPosType = (card) => {
    return card.position.posType;
};
//取得牌的資訊
const getCardIdsInColInfo = (state, targetIndex) => {
    const [posType, rowIndex, colIndex] = [
        state.cards[targetIndex].position.posType,
        state.cards[targetIndex].position.rowIndex,
        state.cards[targetIndex].position.colIndex,
    ];

    let borderData = {}, cardIdsData = [], hasData = false;
    if (posType === "inRowCol") {
        const rowLength = state.cardColInfo[colIndex].length;
        let tempData = state.cardColInfo[colIndex].slice(rowIndex).reverse();
        if (tempData.length > 1) {
            let tempIndex = 0;
            for (let i = 1; i < tempData.length; i++) {
                if (cardCanConnect(state.cards[tempData[i]], state.cards[tempData[i - 1]])
                ) {
                    tempIndex = i;
                } else {
                    break;
                }
            }
            cardIdsData = tempData.slice(0, tempIndex + 1);
        } else {
            cardIdsData = tempData;
        }
        hasData = true;
        borderData = {
            left: getLeftByColIndex(colIndex) - 2,
            top: getTopByColIndex(rowLength - cardIdsData.length) - 2,
            width: 116,
            height: 141 + cardIdsData.length * 40
        }
    } else if (posType === "inTempArea") {
        cardIdsData = state.cardTempAreaInfo[colIndex].data;
        hasData = true;
        borderData = {
            left: (colIndex - 1) * suitOfCardInfo.tempAreaGap.x + suitOfCardInfo.tempAreaGap.baseX,
            top: suitOfCardInfo.tempAreaGap.y + suitOfCardInfo.tempAreaGap.baseY,
            width: 120,
            height: 185
        }
    } else if (posType === "inTargetArea") {
        cardIdsData = state.cardTargetAreaInfo[colIndex].data.slice(state.cardTargetAreaInfo[colIndex].data.length - 1);
        hasData = true;
        borderData = {
            left: (colIndex - 1) * suitOfCardInfo.targetAreaGap.x + suitOfCardInfo.targetAreaGap.baseX,
            top: suitOfCardInfo.targetAreaGap.y + suitOfCardInfo.targetAreaGap.baseY,
            width: 120,
            height: 185
        }
    }
    return {
        hasData: hasData,
        cardIdsData: cardIdsData,
        borderData: borderData
    }
};
//點選牌時的動作 (框選牌/ 來源與目的牌的移動)
const getStateByClickCard = (state, cardIndex) => {
    let targetCardPosType = getCardPosType(state.cards[cardIndex]);
    let info = getCardIdsInColInfo(state, cardIndex);
    if (info.hasData) {
        if (targetCardPosType === "inRowCol" && state.cardActiveCardIdsInfo) {
            let sourceFirstData = state.cards[state.cardActiveCardIdsInfo[state.cardActiveCardIdsInfo.length - 1]];
            let targetFirstData = state.cards[info.cardIdsData[info.cardIdsData.length - 1]];
            let targetEndData = state.cards[info.cardIdsData[0]];
            if (
                getCardPosType(sourceFirstData) === "inRowCol"
                && sourceFirstData.position.rowIndex === targetFirstData.position.rowIndex
                && sourceFirstData.position.colIndex === targetFirstData.position.colIndex) {
                return {
                    ...state,
                    cardActiveBorderData: {
                        disabled: true,
                    },
                    cardActiveCardIdsInfo: null,
                };
            } else if (cardCanConnect(targetEndData, sourceFirstData)) {
                if (getCardPosType(sourceFirstData) === "inTempArea") {
                    state.cardTempAreaInfo[sourceFirstData.position.colIndex].data = null;
                    state.cards[sourceFirstData.cardId].position = {
                        posType: "inRowCol",
                        colIndex: targetEndData.position.colIndex,
                        rowIndex: targetEndData.position.rowIndex + 1,
                        left: getLeftByColIndex(targetEndData.position.colIndex),
                        top: getTopByColIndex(targetEndData.position.rowIndex + 1),
                    };
                } else if (getCardPosType(sourceFirstData) === "inTargetArea") {
                    state.cardTargetAreaInfo[state.cards[state.cardActiveCardIdsInfo[0]].position.colIndex].data.pop();
                    state.cards[sourceFirstData.cardId].position = {
                        posType: "inRowCol",
                        colIndex: targetEndData.position.colIndex,
                        rowIndex: targetEndData.position.rowIndex + 1,
                        left: getLeftByColIndex(targetEndData.position.colIndex),
                        top: getTopByColIndex(targetEndData.position.rowIndex + 1),
                    };
                } else if (targetEndData.position.colIndex !== sourceFirstData.position.colIndex) {
                    state.cardActiveCardIdsInfo.reverse().forEach((data, index) => {
                        state.cards[data].position = {
                            posType: "inRowCol",
                            colIndex: targetEndData.position.colIndex,
                            rowIndex: targetEndData.position.rowIndex + index + 1,
                            left: getLeftByColIndex(targetEndData.position.colIndex),
                            top: getTopByColIndex(targetEndData.position.rowIndex + index + 1),
                        };
                    });
                }
                state.cardActiveCardIdsInfo = null;
                state.cardColInfo = getCardIndex(state.cards);
                state.cardActiveBorderData = {
                    disabled: true,
                };
                return {...state};
            } else {
                return {
                    ...state,
                    cardActiveBorderData: {
                        disabled: false,
                        ...info.borderData
                    },
                    cardActiveCardIdsInfo: info.cardIdsData
                }
            }
        } else if (targetCardPosType === "inRowCol") {
            return {
                ...state,
                cardActiveBorderData: {
                    disabled: false,
                    ...info.borderData
                },
                cardActiveCardIdsInfo: info.cardIdsData
            }
        } else if (targetCardPosType === "inTempArea") {
            return {
                ...state,
                cardActiveCardIdsInfo: info.cardIdsData,
                cardActiveBorderData: {
                    disabled: false,
                    ...info.borderData
                }
            }
        } else if (targetCardPosType === "inTargetArea"
            && state.cardActiveCardIdsInfo
            && state.cardActiveCardIdsInfo.length === 1
        ) {
            let sourceFirstData = state.cards[state.cardActiveCardIdsInfo[0]];
            let targetEndData = state.cards[info.cardIdsData[0]];

            if (cardCanConnect(targetEndData, sourceFirstData, "targetArea")) {
                state.cards[sourceFirstData.cardId].position = {
                    posType: "inTargetArea",
                    colIndex: targetEndData.position.colIndex,
                    rowIndex: targetEndData.position.rowIndex + 1,
                    left: state.cardTargetAreaInfo[targetEndData.position.colIndex].left + 4,
                    top: state.cardTargetAreaInfo[targetEndData.position.colIndex].top + 4
                };
                if (sourceFirstData.position.posType === "inTempArea") {
                    state.cardTempAreaInfo[state.cards[state.cardActiveCardIdsInfo[0]].position.colIndex].data = null;
                }
                state.cardTargetAreaInfo[targetEndData.position.colIndex].data.push(state.cardActiveCardIdsInfo[0]);
                state.cardActiveCardIdsInfo = null;
                state.cardColInfo = getCardIndex(state.cards);
                state.cardActiveBorderData = {
                    disabled: true,
                };

            }
            return {...state};
        } else if (targetCardPosType === "inTargetArea") {
            return {
                ...state,
                cardActiveCardIdsInfo: info.cardIdsData,
                cardActiveBorderData: {
                    disabled: false,
                    ...info.borderData
                }
            }
        } else {
            return state;
        }
    } else {
        return state;
    }
};
//點選空白區域的動作
const getStateByClickTempArea = (state, colIndex) => {
    if (state.cardActiveCardIdsInfo
        && state.cardActiveCardIdsInfo.length === 1
        && !state.cardTempAreaInfo[colIndex].data
    ) {
        if (state.cards[state.cardActiveCardIdsInfo[0]].position.posType === "inTempArea") {
            state.cardTempAreaInfo[state.cards[state.cardActiveCardIdsInfo[0]].position.colIndex].data = null;
        } else if (state.cards[state.cardActiveCardIdsInfo[0]].position.posType === "inTargetArea") {
            state.cardTargetAreaInfo[state.cards[state.cardActiveCardIdsInfo[0]].position.colIndex].data.pop();
        }
        state.cards[state.cardActiveCardIdsInfo[0]].position = {
            posType: "inTempArea",
            colIndex: colIndex,
            rowIndex: 0,
            left: state.cardTempAreaInfo[colIndex].left + 4,
            top: state.cardTempAreaInfo[colIndex].top + 4
        };
        state.cardTempAreaInfo[colIndex].data = state.cardActiveCardIdsInfo;
        state.cardActiveCardIdsInfo = null;
        state.cardColInfo = getCardIndex(state.cards);
        state.cardActiveBorderData = {
            disabled: true,
        };
        return {...state};
    } else {
        return state;
    }
};
//點選下方區域的最後背景區域的動作
const getStateByClickBackArea = (state, colIndex) => {
    if (state.cardActiveCardIdsInfo) {
        if (state.cards[state.cardActiveCardIdsInfo[0]].position.posType === "inTempArea") {
            state.cardTempAreaInfo[state.cards[state.cardActiveCardIdsInfo[0]].position.colIndex].data = null;
        } else if (state.cards[state.cardActiveCardIdsInfo[0]].position.posType === "inTargetArea") {
            state.cardTargetAreaInfo[state.cards[state.cardActiveCardIdsInfo[0]].position.colIndex].data.pop();
        }
        state.cardActiveCardIdsInfo.reverse().forEach((data, index) => {
            state.cards[data].position = {
                posType: "inRowCol",
                colIndex: colIndex,
                rowIndex: index,
                left: getLeftByColIndex(colIndex),
                top: getTopByColIndex(index),
            };
        });

        state.cardActiveCardIdsInfo = null;
        state.cardColInfo = getCardIndex(state.cards);
        state.cardActiveBorderData = {
            disabled: true,
        };
        return {...state};
    } else {
        return state;
    }
};
//點選目標區域的背景區域的動作
const getStateByClickTargetArea = (state, colIndex) => {
    if (state.cardActiveCardIdsInfo
        && state.cardActiveCardIdsInfo.length === 1
        && !state.cardTargetAreaInfo[colIndex].data.length
        && state.cards[state.cardActiveCardIdsInfo[0]].suitIndex === 1
    ) {
        if (state.cards[state.cardActiveCardIdsInfo[0]].position.posType === "inTempArea") {
            state.cardTempAreaInfo[state.cards[state.cardActiveCardIdsInfo[0]].position.colIndex].data = null;
        } else if (state.cards[state.cardActiveCardIdsInfo[0]].position.posType === "inTargetArea") {
            state.cardTargetAreaInfo[state.cards[state.cardActiveCardIdsInfo[0]].position.colIndex].data.pop();
        }
        state.cards[state.cardActiveCardIdsInfo[0]].position = {
            posType: "inTargetArea",
            colIndex: colIndex,
            rowIndex: state.cardTargetAreaInfo[colIndex].data.length,
            left: state.cardTargetAreaInfo[colIndex].left + 4,
            top: state.cardTargetAreaInfo[colIndex].top + 4
        };

        state.cardTargetAreaInfo[colIndex].data.push(state.cardActiveCardIdsInfo[0]);
        state.cardActiveCardIdsInfo = null;
        state.cardColInfo = getCardIndex(state.cards);
        state.cardActiveBorderData = {
            disabled: true,
        };
        return {...state};
    } else {
        return state;
    }
};


const gameReducer = (state, action)=> {
    switch (action.type) {
        case 'reStart':
            return defaultGameInfo(null, state.gameRound + 1);
        case 'reStartSameGame':
            return defaultGameInfo(state.originCards, state.gameRound + 1);
        case 'clickCard':
            return getStateByClickCard(state, action.cardIndex);
        case 'clickTempArea':
            return getStateByClickTempArea(state, action.colIndex);
        case 'clickBackArea':
            return getStateByClickBackArea(state, action.colIndex);
        case 'clickTargetArea':
            return getStateByClickTargetArea(state, action.colIndex);
        default:
            throw new Error();
    }
}



export const DefaultGameInfo = defaultGameInfo;
export const GameReducer = gameReducer;