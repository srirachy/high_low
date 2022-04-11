import React, {useState} from 'react';
import {nanoid} from 'nanoid';
import Button from './Button'
import cards from '../cards'
import gametypes from '../gametypes'
import highlows from '../highlows'
import postgames from '../postgames'

const RenderButtons = ({gameStyle, changeGameStyle, guessCard, setInitialCard, highOrLow, postGameMenu, cardState}) => {

    const buttonElmts = [];

    switch(gameStyle){
        case 0:
            // initial
            for (const { disabled, value, name } of gametypes){
                buttonElmts.push(
                    <Button
                        key={nanoid()}
                        value={value}
                        children={name}
                        onClick={() => changeGameStyle(value)}
                        disabled={disabled}
                    />
                )
            }
            break;
        case 1:
            // play as guesser
            for (const { disabled, value, name } of cardState){
                buttonElmts.push(
                    <Button
                        key={nanoid()}
                        value={value}
                        children={name}
                        onClick={() => guessCard(value, name, disabled)}
                        disabled={disabled}
                    />
                )
            }
            break;
        case 2:
            // play as dealer
            for (const { disabled, value, name } of cards){
                buttonElmts.push(
                    <Button
                        key={nanoid()}
                        value={value}
                        children={name}
                        onClick={() => setInitialCard(value, name)}
                        disabled={disabled}
                    />
                )
            }
            break;
        case 3:
            //play as dealer
            for (const { disabled, value, name } of highlows){
                buttonElmts.push(
                    <Button
                        key={nanoid()}
                        value={value}
                        children={name}
                        onClick={() => highOrLow(value)}
                        disabled={disabled}
                    />
                )
            }
            break;
        default:
            // initial
            for (const { disabled, value, name } of postgames){
                buttonElmts.push(
                    <Button
                        key={nanoid()}
                        value={value}
                        children={name}
                        onClick={() => postGameMenu(value)}
                        disabled={disabled}
                    />
                )
            }

    }
    return buttonElmts;
};

export default RenderButtons;