import React, {useEffect, useState} from 'react';
import ButtonSection from './ButtonSection'
import RenderButtons from './RenderButtons';
import cards from '../cards'

//set initial card state to reset to
const initialCardState = cards;

const HighLow = () => {
    const [gameStyle, setGameStyle] = useState(0);
    const [botAnswer, setBotAnswer] = useState(0);
    const [prevGameStyle, setPrevGameStyle] = useState(0);
    const [userGuess, setUserGuess] = useState(1);
    const [guessRemain, setGuessRemain] = useState(3);
    const [cardState, setCardState] = useState(initialCardState);


    useEffect(() => {
        if (guessRemain === 0){
            //set win/lose text
            setGameStyle(4);
            setGuessRemain(3);
            setBotAnswer(0);
            setUserGuess(1);
            setCardState(initialCardState);
            console.log("you lose");
        } else if (userGuess === botAnswer){
            //set win/lose text
            setGameStyle(4);
            setGuessRemain(3);
            setBotAnswer(0);
            setUserGuess(1);
            setCardState(initialCardState);
            console.log("you win");
        }
    }, [userGuess, gameStyle, guessRemain, botAnswer])

    const changeGameStyle = (gameVal) => {
        //1 = guesser, 2 = dealer
        if (gameVal === 1){
            setBotAnswer((prevBotAnswer) => Math.floor(Math.random() * (14 - 2 + 1) + 2));
        }
        setGameStyle(gameVal);
        setPrevGameStyle(gameVal);
    };

    const guessCard = (cardVal, name, disabled) => {
        setUserGuess(cardVal);
        setDisabled(name);
        if (guessRemain > 0){
            setGuessRemain((prevRemain) => prevRemain - 1);
        }
    };

    const setDisabled = (cardVal) => {
        //create a map that will store a new array with the card disabled
        const updatedCardState = cardState.map(theCard => {
            if (theCard.name === cardVal){
                return {...theCard, disabled: true};
            }
            return theCard;
        })
        //set the card state to the new array
        setCardState(updatedCardState);
    };

    const setInitialCard = (cardVal) => {
        //add card name
        setBotAnswer(cardVal);
        setGameStyle(3);
    }
    
    const highOrLow = (buttonVal) => {
       //write bot logic here?
    };

    const postGameMenu = (buttonVal) => {
        (buttonVal === 0 ? changeGameStyle(prevGameStyle) : setGameStyle(0))
    }

    // const renderHeader = () => {

    // };

    // const renderText = () => {

    // };


    return (
        <>
            <article className="game--wrapper">
                {/* replace w/ image later */}
                <section>
                    <h1>High Low</h1>
                </section>
                {/* Text Section */}
                {/* Button Section */}
                <ButtonSection>
                    <RenderButtons gameStyle={gameStyle} guessCard={guessCard} changeGameStyle={changeGameStyle} setInitialCard={setInitialCard} highOrLow={highOrLow} postGameMenu={postGameMenu} cardState={cardState}></RenderButtons>
                </ButtonSection>
                <p>meow</p>
            </article>
        </>
    );
};

export default HighLow;