import React, {useState} from 'react';
import {nanoid} from 'nanoid';
import ButtonSection from './ButtonSection'
import Button from './Button'
import cards from '../cards'
import gametypes from '../gametypes'
import highlows from '../highlows'
import postgames from '../postgames'

const HighLow = () => {
    //const [gameState, setGameState] = useState(0);
    const [gameStyle, setGameStyle] = useState(0);
    const [botAnswer, setBotAnswer] = useState(0);
    const [guessRemain, setGuessRemain] = useState(2);
    //could add useeffects here if needed
    //methods

    const changeGameStyle = (gameVal) => {
        //1 = guesser, 2 = dealer
        if (gameVal === 1){
            setBotAnswer((prevBotAnswer) => Math.floor(Math.random() * 13 + 1)); 
        }
        setGameStyle(gameVal);
    };

    const guessCard = (cardVal, id) => {
        const hideButton = document.getElementById(id);
        hideButton.setAttribute("disabled", true);

        setGuessRemain((prevRemain) => prevRemain - 1);
        if (guessRemain === 0){
            //set win/lose text
            setGameStyle(3);
            setGuessRemain(2);
        }
    };
    
    const highOrLow = (gameVal) => {
        //alert(gameVal);
    };

    const renderHeader = () => {

    };

    const renderText = () => {

    };

    const renderButtons = () => {
        const buttonElmts = [];
        switch(gameStyle){
            case 0:
                // initial
                for (const { id, value, name } of gametypes){
                    buttonElmts.push(
                        <Button
                            id={id}
                            key={nanoid()}
                            value={value}
                            children={name}
                            onClick={() => changeGameStyle(value)}
                        />
                    )
                }
                break;
            case 1:
                // play as guesser
                for (const { id, value, name } of cards){
                    buttonElmts.push(
                        <Button
                            id={id}
                            key={nanoid()}
                            value={value}
                            children={name}
                            onClick={() => guessCard(value, id)}
                        />
                    )
                }
                break;
            case 2:
                //play as dealer
                for (const { id, value, name } of highlows){
                    buttonElmts.push(
                        <Button
                            id={id}
                            key={nanoid()}
                            value={value}
                            children={name}
                            onClick={() => highOrLow(value)}
                        />
                    )
                }
                break;
            default:
                // initial
                for (const { id, value, name } of postgames){
                    buttonElmts.push(
                        <Button
                            id={id}
                            key={nanoid()}
                            value={value}
                            children={name}
                            onClick={() => changeGameStyle(value)}
                        />
                    )
                }

        }
        return buttonElmts;
    };

    return (
        <>
            <article className="game--wrapper">
                {/* replace w/ image later */}
                <section>
                    <h1>High Low</h1>
                </section>
                {/* Text Section */}
                {/* Button Section */}
                <ButtonSection>{renderButtons()}</ButtonSection>
                <p>meow</p>
            </article>
        </>
    );
};

export default HighLow;