import React, {useEffect, useState} from 'react';
import ButtonSection from './ButtonSection';
import RenderButtons from './RenderButtons';
import Text from './Text';
import TextSection from './TextSection';
import HeaderSection from './HeaderSection'
import cards from '../cards';
import guessertext from '../guessertext';
import {nanoid} from 'nanoid';

//set initial card state to reset to
const initialCardState = cards;
const initBotCards = cards.map(theCard => theCard.value);
const allGuesserText = guessertext.map(theText => theText.text);

const HighLow = () => {
    const [gameStyle, setGameStyle] = useState(0);
    const [botAnswer, setBotAnswer] = useState(0);
    const [prevGameStyle, setPrevGameStyle] = useState(0);
    const [userGuess, setUserGuess] = useState(1);
    const [guessRemain, setGuessRemain] = useState(3);
    const [cardState, setCardState] = useState(initialCardState);
    const [botCards, setBotCards] = useState(initBotCards);
    //const [botState, setBotState] = useState('');
    const [botCardAsText, setBotCardAsText] = useState('');
    // const [textState, setTextState] = useState(allGuesserText);

    //use effects for guesser
    useEffect(() => {
        if(gameStyle === 1){
            if (userGuess === botAnswer){
                //set win/lose text
                setGameStyle(4);
                setBotAnswer(0);
                setUserGuess(1);
                setCardState(initialCardState);
                console.log("you win");
            } else if (guessRemain === 0){
                //set win/lose text
                setGameStyle(4);
                setBotAnswer(0);
                setUserGuess(1);
                setCardState(initialCardState);
                console.log("you lose");
            } 
        };
    }, [botAnswer, gameStyle, guessRemain, userGuess]);

    //use effect for dealer
    useEffect(() => {
        if(gameStyle === 3){
             if (botAnswer === userGuess){
                setGameStyle(4);
                setBotCards(initBotCards);
                console.log("you lose");
            } else if (guessRemain === 0){
                setGameStyle(4);
                setBotCards(initBotCards);
                console.log("you win");
            }
        }
    }, [botAnswer, gameStyle, guessRemain, userGuess]);

    //every time bot answer renders, update setBotCardAsText
    useEffect(() => {
        if(gameStyle === 3){
            console.log("i rendered");
            const curAnswer = getBotCardAsText(botAnswer);
            setBotCardAsText(curAnswer);
        }
    }, [botAnswer, gameStyle]);

    const changeGameStyle = (gameVal) => {
        //1 = guesser, 2 = dealer
        console.log(allGuesserText);
        if (gameVal === 1){
            setBotAnswer((prevBotAnswer) => Math.floor(Math.random() * (14 - 2 + 1) + 2));
        }
        setGuessRemain(3);
        setGameStyle(gameVal);
        setBotCardAsText('');
        if (gameVal === 1 || gameVal === 2){
            setPrevGameStyle(gameVal);
        }
    };

    const guessCard = (cardVal, name) => {
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
        });
        //set the card state to the new array
        setCardState(updatedCardState);
    };

    const theBotGuess = () => {
        //need to set to to useeffect maybe? i tried but no bueno, but these values need to be up-to-date
        const curMax = Math.max(...botCards);
        //console.log(botCards);
        console.log(curMax);
        const curMin = Math.min(...botCards);
        console.log(curMin)
        setBotAnswer(Math.floor(Math.random() * (curMax - curMin + 1) + curMin));
        console.log(botAnswer);
        if (guessRemain > 0){
            setGuessRemain((prevRemain) => prevRemain - 1);
        };
    }

    // useEffect(() => {
    //     const curMax = Math.max(...botCards);
    //     //console.log(botCards);
    //     console.log(curMax);
    //     const curMin = Math.min(...botCards);
    //     console.log(curMin)
    //     setBotAnswer(Math.floor(Math.random() * (curMax - curMin + 1) + curMin));
    // }, [botCards])

    const setInitialCard = (cardVal) => {
        //add card name
        setGuessRemain(3);
        setBotAnswer(0);
        setUserGuess(cardVal);
        setGameStyle(3);
        theBotGuess(); //set initial bot guess
    }

    const getBotCardAsText = (cardVal) => {
        return cards.find(theCard => theCard.value === cardVal).name.toString();
    };

    const filterGreater = () => {
        const updatedBotCards = botCards.filter(theNum => {
            return theNum < botAnswer;
        })
        console.log(updatedBotCards);
        setBotCards(updatedBotCards);
    }

    const filterLesser = () => {
        const updatedBotCards = botCards.filter(theNum => {
            return theNum > botAnswer;
        })
        console.log(updatedBotCards);
        setBotCards(updatedBotCards);
    }
    
    const highOrLow = (buttonVal) => {
        //if higher, remove lower else remove higher
        if (botAnswer !== userGuess){
            if(botAnswer > userGuess){
                filterGreater();
            } else if (userGuess > botAnswer){
                filterLesser();
            }
        }
        //filterItems();
        theBotGuess();
    };

    const postGameMenu = (buttonVal) => {
        (buttonVal === 0 ? changeGameStyle(prevGameStyle) : changeGameStyle(0))
    }

    const renderHeader = () => {

    };

    const displayText = () => {
        renderText();
        //setText();
    }

    const renderText = () => {
        const textElmts = [];

        if (gameStyle === 1){
            for (const { text } of guessertext) {
                textElmts.push(
                <Text key={nanoid()} children={text} />)
            };
        };
        return textElmts;
    };

    return (
        <>
            <article className="game--wrapper">
                {/* Header Section */}
                <HeaderSection>
                    {/* header */}
                </HeaderSection>
                {/* Text Section */}
                <TextSection>
                    {botCardAsText && (gameStyle === 3 || gameStyle === 4) && <p>Bot guess is: {botCardAsText}</p>}
                    {(gameStyle === 1 || gameStyle === 3 || gameStyle === 4) && <p>Guesses Remaining: {guessRemain}/3</p>}
                </TextSection>
                {/* Button Section */}
                <ButtonSection>
                    <RenderButtons gameStyle={gameStyle} cardState={cardState} guessCard={guessCard} 
                        changeGameStyle={changeGameStyle} setInitialCard={setInitialCard} 
                        highOrLow={highOrLow} postGameMenu={postGameMenu}>
                    </RenderButtons>
                </ButtonSection>
            </article>
        </>
    );
};

export default HighLow;