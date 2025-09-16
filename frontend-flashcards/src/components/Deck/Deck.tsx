import type { Deck } from '../DeckList';
import './Deck.css';  // Importing CSS for styling
export interface Flashcard{   
    id: number;
    question: string;
    answer: string;
    belongsToDeck: string;
    belongsToDeckId: string;
}
//props interface with three properties where flashcards is an array of Flashcard type with onSelectFlashcard and onCreateFlashcard as functions
interface DeckProps {  
    currentDeck: Deck;
    flashcards: Flashcard[];
    onSelectFlashcard:(FlashcardId: string) => void;
    onCreateFlashcard: () => void;
}

const FlashCardList = ({currentDeck, flashcards, onSelectFlashcard, onCreateFlashcard}: DeckProps) => {  
    return (
        <>
            <div className = 'name-of-the-Deck'> 
                <div className="deck-header">
                    <h2>{currentDeck.title}</h2>
                    <p>{currentDeck.description}</p>
                </div> 
                <div className = 'deck-actions'>
                    <div className = 'searchbar'>Search flashcard...</div>
                    <button className = 'start-learning'> Start Learning </button>
                    <button onClick = {onCreateFlashcard} className = 'create-a-flashcard'>Create a new Flashcard</button>
                </div>   
            </div>
            <div className = 'flashcard-container'>
                {flashcards.map(flashcard =>(
                    <div
                        key = {flashcard.id}
                        className = 'flashcard-card'
                        onClick = {() => onSelectFlashcard(flashcard.id.toString())}
                    >
                        <div className ='flashcard-content'>
                            <p className = 'flashcard-question'>{flashcard.question}</p>
                            <p className = 'flashcard-answer'>{flashcard.answer}</p>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}
//exporting the FlashCardList component as the default export
export default FlashCardList;