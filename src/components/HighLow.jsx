import React, {useEffect, useState} from 'react';
import ButtonSection from './ButtonSection';
import RenderButtons from './RenderButtons';
import TextSection from './TextSection';
import Text from './Text';
import HeaderSection from './HeaderSection';
import Header from './Header';
import cards from '../cards';
import gametext from '../gametext';
import headertext from '../headertext';
import image from "../img/card_table.png";

//set initial states to reset to and store text arrays
const initialCardState = cards;
const initBotCards = cards.map(theCard => theCard.value);
const allHeaderText = headertext.map(theText => theText.text);
const allGuesserText = gametext.map(theText => theText.text);

const HighLow = () => {
    const [gameStyle, setGameStyle] = useState(0);
    const [prevGameStyle, setPrevGameStyle] = useState(0);
    const [userGuess, setUserGuess] = useState(1);
    const [guessRemain, setGuessRemain] = useState(3);
    const [cardState, setCardState] = useState(initialCardState);
    const [botCards, setBotCards] = useState(initBotCards);
    const [botCardAsText, setBotCardAsText] = useState('');
    const [botAnswer, setBotAnswer] = useState(0);
    const [curMax, setCurMax] = useState(0);
    const [curMin, setCurMin] = useState(0);
    const [headerText, setHeaderText] = useState(allHeaderText[0]);
    //gotta finish adding into guesser text and dealer text, also a place to set a reminder on what card you chose for bot to guess

    //useeffect for guesser, win/lose condition
    useEffect(() => {
        if(gameStyle === 1){
            if (userGuess === botAnswer){
                setGameStyle(4);
                setHeaderText(allHeaderText[3]);
                setBotAnswer(0);
                setUserGuess(1);
                setCardState(initialCardState);
            } else if (guessRemain === 0){
                setGameStyle(4);
                setHeaderText(allHeaderText[4]);
                setBotAnswer(0);
                setUserGuess(1);
                setCardState(initialCardState);
            } 
        };
    }, [botAnswer, gameStyle, guessRemain, userGuess]);

    //useeffect for dealer, win/lose condition
    useEffect(() => {
        if(gameStyle === 3 || (prevGameStyle === 2 && gameStyle === 4)){
            // using prevgamestyle as another dep array is a little hackish but it works
             if (userGuess === botAnswer){
                setGameStyle(4);
                setHeaderText(allHeaderText[4]);
            } else if (guessRemain === 0){
                setGameStyle(4);
                setHeaderText(allHeaderText[3]);
            }
        }
    }, [botAnswer, gameStyle, guessRemain, userGuess, prevGameStyle]);

    //useeffect for curmin & curmax, which is dependent on botCards specifically after filters
    useEffect(() => {
        const findMax = Math.max(...botCards);
        setCurMax(findMax);
        const findMin = Math.min(...botCards);
        setCurMin(findMin);
    }, [botCards]);
    
    //useEffect to find botAnswer using curMax and curMin
    useEffect(() => {
        const findAnswer = Math.floor(Math.random() * (curMax - curMin + 1) + curMin);
        setBotAnswer(findAnswer);
    }, [curMax, curMin]);

    //every time bot answer renders, update setBotCardAsText
    useEffect(() => {
        if(gameStyle === 3 || (prevGameStyle === 2 && gameStyle === 4)){
            const curAnswer = getBotCardAsText(botAnswer);
            setBotCardAsText(curAnswer);
        }
    }, [botAnswer, gameStyle, prevGameStyle]);

    //onclick from main menu into a chosen game
    const changeGameStyle = (gameVal) => {
        //1 = guesser, 2 = dealer
        if (gameVal === 1){
            const findRando = Math.floor(Math.random() * (14 - 2 + 1) + 2)
            setBotAnswer(findRando);
            setHeaderText(allHeaderText[2]);
        } else if(gameVal === 2) {
            setHeaderText(allHeaderText[1]);
        }
        setGuessRemain(3);
        setGameStyle(gameVal);
        if (gameVal === 1 || gameVal === 2){
            setPrevGameStyle(gameVal);  //mostly for play again button and some oneffect scenarios
        }
    };

    //onclick when user guesses card
    const guessCard = (cardVal, name) => {
        setUserGuess(cardVal);
        setDisabled(name);
        if (guessRemain > 0){
            setGuessRemain((prevRemain) => prevRemain - 1);
        }
    };

    //set card as disabled so user cannot guess same card twice
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

    //onclick choose card for bot to guess when you play as dealer
    const setInitialCard = (cardVal) => {
        //set states for this game mode
        setBotCards(initBotCards);
        setGuessRemain(3);
        setBotAnswer(0);
        setUserGuess(cardVal);
        setGameStyle(3);
        initBotGuess();
    }

    //onclick to select if bot should guess higher or lower
    const highOrLow = (buttonVal) => {
        //if higher, remove lower else remove higher
        if (botAnswer !== userGuess){
            if(botAnswer > userGuess){
                filterGreater();
            } else if (userGuess > botAnswer){
                filterLesser();
            }
        } else {
            filterAll();
        }
        theBotGuess();
    };

    //set initial bot guess not dependent on useEffect, mostly because of botcards
    const initBotGuess = () => {
        const initCurMax = Math.max(...botCards);
        const initCurMin = Math.min(...botCards);
        const initFindRandoAnswer = Math.floor(Math.random() * (initCurMax - initCurMin + 1) + initCurMin);
        setBotAnswer(initFindRandoAnswer);
        if (guessRemain > 0){
            setGuessRemain((prevRemain) => prevRemain - 1);
        };
    }

    //moved majority of content up to a useEffect
    const theBotGuess = () => {
        if (guessRemain > 0){
            setGuessRemain((prevRemain) => prevRemain - 1);
        };
    }

    //translates value into a text value "mostly for royals + ace"
    const getBotCardAsText = (cardVal) => {
        return cards.find(theCard => theCard.value === cardVal).name.toString();
    };

    //remove cards that are greater than what the bot chose
    const filterGreater = () => {
        const updatedBotCards = botCards.filter(theNum => {
            return theNum < botAnswer;
        })
        setBotCards(updatedBotCards);
    }

    //remove cards that are less than what the bot chose
    const filterLesser = () => {
        const updatedBotCards = botCards.filter(theNum => {
            return theNum > botAnswer;
        })
        setBotCards(updatedBotCards);
    }

    //remove all cards except correct answer, mostly to trigger useEffects minmax into botanswer
    const filterAll = () => {
        const updatedBotCards = botCards.filter(theNum => {
            return theNum;
        })
        setBotCards(updatedBotCards);
    }

    //onclick post game menu into main menu or to play same game
    const postGameMenu = (buttonVal) => {
        (buttonVal === 0 ? changeGameStyle(prevGameStyle) : changeGameStyle(0));
    }

    return (
        <>
            {/* background image, positionPos to assure vert/horz centered, attach fixed in viewport, size cover to rescale on container size */}
            <article className="gameWrapper" style={{backgroundImage: `url(${image})`, backgroundRepeat: 'no-repeat', 
                backgroundPosition: 'center center', backgroundAttachment: 'fixed', backgroundSize: 'cover'}}>
                <HeaderSection>
                    <Header type="h1">{headerText}</Header>
                </HeaderSection>
                <TextSection>
                    {/* replace placeholder w/ text for dealer and text for guesser */}
                    <Text>placeholderText</Text> 
                    {(gameStyle === 3 || (prevGameStyle === 2 && gameStyle === 4)) && <Text>Bot guess is: {botCardAsText}</Text>}
                    {(gameStyle === 1 || gameStyle === 3 || gameStyle === 4) && <Text>Guesses Remaining: {guessRemain}/3</Text>}
                </TextSection>
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