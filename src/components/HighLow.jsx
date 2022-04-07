import React, {useState, useEffect} from 'react';
import Button from './Button';
import ButtonSection from './ButtonSection'
import cards from '../cards.json'
import gametypes from '../gametypes.json'
import highlows from '../highlows.json'
//import titleimg from '../images/titleimg.png';

const HighLow = () => {
    let curGame = 0;
    //const [gameState, setGameState] = useState(0);
    const [gameStyle, setGameStyle] = useState(0);

    //could add useeffects here if needed
    //methods
    const renderButtons = () => {
        const buttonElmts = [];
        switch(gameStyle){
            case 0:
                // initial
                for (const { id, value, name } of gametypes){
                    buttonElmts.push(
                        <Button
                            id={id}
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
                            value={value}
                            children={name}
                            onClick={() => guessCard(value)}
                        />
                    )
                }
                break;
            case 2:
                // play as dealer
                for (const { id, value, name } of highlows){
                    buttonElmts.push(
                        <Button
                            id={id}
                            value={value}
                            children={name}
                            onClick={() => highOrLow(value)}
                        />
                    )
                }
                break;
            default:
                // initial
                for (const { id, value, name } of gametypes){
                    buttonElmts.push(
                        <Button
                            id={id}
                            value={value}
                            children={name}
                            onClick={() => changeGameStyle(value)}
                        />
                    )
                }

        }
        return buttonElmts;
    }

    const changeGameStyle = (gameVal) => {
        alert(gameVal);
        setGameStyle(gameVal);
        curGame = gameVal;
    };

    const guessCard = (cardVal) => {
        alert(cardVal);
    };
    
    const highOrLow = (gameVal) => {
        alert(gameVal);
    };
    return (
        <>
            {/* replace w/ image later */}
            <section>
                <h1>High Low</h1>
            </section>
            {/* Text Section */}
            {/* Button Section */}
            <ButtonSection>{renderButtons()}</ButtonSection>
            <p>meow</p>
        </>
    );
};

export default HighLow;