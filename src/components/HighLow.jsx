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
const allGameText = gametext.map(theText => theText.text);

const HighLow = () => {
    const [gameStyle, setGameStyle] = useState(0);
    const [prevGameStyle, setPrevGameStyle] = useState(0);
    const [userGuess, setUserGuess] = useState(1);
    const [userCardAsText, setUserCardAsText] = useState('');
    const [guessRemain, setGuessRemain] = useState(3);
    const [cardState, setCardState] = useState(initialCardState);
    const [botCards, setBotCards] = useState(initBotCards);
    const [botCardAsText, setBotCardAsText] = useState('');
    const [botAnswer, setBotAnswer] = useState(0);
    const [curMax, setCurMax] = useState(0);
    const [curMin, setCurMin] = useState(0);
    const [headerText, setHeaderText] = useState(allHeaderText[0]);
    const [gameText, setGameText] = useState(allGameText[0]);

    //useeffect for guesser, win/lose condition
    useEffect(() => {
        if(gameStyle === 1){
            if (userGuess === botAnswer){
                setGameText(`Success! Bot's card was indeed: ${botCardAsText}`);
                setGameStyle(4);
                setHeaderText(allHeaderText[3]);
                setCardState(initialCardState);
            } else if (guessRemain === 0){
                setGameText(`Better luck next time. Bot's card was: ${botCardAsText}`);
                setGameStyle(4);
                setHeaderText(allHeaderText[4]);
                setCardState(initialCardState);
            } 
        };
    }, [botAnswer, gameStyle, guessRemain, userGuess, botCardAsText]);

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

    //every time bot answer renders, update setBotCardAsText
    useEffect(() => {
        if(gameStyle === 1){
            const curAnswer = getCardAsText(botAnswer);
            setBotCardAsText(curAnswer);
        }
    }, [botAnswer, gameStyle]);

    //useeffect for user guess as text when playing as dealer
    useEffect(() => {
        if(gameStyle === 3){
            const curAnswer = getCardAsText(userGuess);
            setUserCardAsText(curAnswer);
        }
    }, [userGuess, gameStyle]);

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
            const curAnswer = getCardAsText(botAnswer);
            setBotCardAsText(curAnswer);
        }
    }, [botAnswer, gameStyle, prevGameStyle]);

    //onclick from main menu into a chosen game
    const changeGameStyle = (gameVal) => {
        //set//resetters for game transitions
        setBotAnswer(0);
        setUserGuess(1);
        //1 = guesser, 2 = dealer
        if (gameVal === 1){
            const findRando = Math.floor(Math.random() * (14 - 2 + 1) + 2);
            setBotAnswer(findRando);
            setHeaderText(allHeaderText[2]);
            setGameText(allGameText[1]);
        } else if(gameVal === 2) {
            setHeaderText(allHeaderText[1]);
            setGameText(allGameText[4]);
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
        //set game text to say if card is higher or lower
        if (cardVal > botAnswer){
            setGameText(allGameText[3]);
        } else{
            setGameText(allGameText[2]);
        }
        
        //decremement guessremain
        if (guessRemain > 0){
            setGuessRemain((prevRemain) => prevRemain - 1);
        }
    };

    //set card as disabled so user cannot guess same card twice
    const setDisabled = (cardVal) => {
        //create a map that will store a new array with the card disabled
        const updatedCardState = cardState.map(theCard => {
            if (theCard.name === cardVal){
                //wrap return in bracket to return more than one item maybe... worth trying/testing for img opacity
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
        setUserGuess(cardVal);
        setGameStyle(3);
        initBotGuess();
    }

    //onclick to select if bot should guess higher or lower
    const highOrLow = (buttonVal) => {
        //if higher, remove lower else remove higher
        if (botAnswer !== userGuess){
            //button val 0 = higher, 1 = lower
            if(botAnswer > userGuess){
                filterGreater();
                //set game text for bot to say if chose higher or lower
                if (buttonVal === 0){
                    setGameText(allGameText[9]); //higher
                } else {
                    setGameText(allGameText[7]); //user lied, bot guesses lower
                }
            } else if (userGuess > botAnswer){
                filterLesser();
                if (buttonVal === 0){
                    setGameText(allGameText[6]); //user lied, bot guesses higher
                } else{
                    setGameText(allGameText[8]); //lower
                }
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
        setGameText(`Bot's first guess...`);
        if (guessRemain > 0){
            setGuessRemain((prevRemain) => prevRemain - 1);
        };
    }

    //moved majority of function content up to a useEffect
    const theBotGuess = () => {
        if (guessRemain > 0){
            setGuessRemain((prevRemain) => prevRemain - 1);
        };
    }

    //translates value into a text value "mostly for royals + ace"
    const getCardAsText = (cardVal) => {
        return cards.find(theCard => theCard.value === cardVal).name.toString();
    };

    //remove cards that are greater than what the bot chose
    const filterGreater = () => {
        const updatedBotCards = botCards.filter(theNum => {
            return theNum < botAnswer;
        })
        setBotCards(updatedBotCards);   //could return the state from function then update in main
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
        if( buttonVal === 0){
            changeGameStyle(prevGameStyle);
        } else{
            setGameText(allGameText[0]);
            setHeaderText(allHeaderText[0]);
            changeGameStyle(0);
        }
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
                    <Text>{gameText}</Text> 
                    {(gameStyle === 3 || (prevGameStyle === 2 && gameStyle === 4)) && <Text>Bot guess is: {botCardAsText} (Your card: {userCardAsText})</Text>}
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