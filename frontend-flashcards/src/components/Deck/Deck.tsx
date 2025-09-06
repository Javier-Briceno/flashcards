import './Deck.css';  // Importing CSS for styling
export interface Flashcard{   
    id: number;
    question: string;
    answer: string;
    belongsToDeck: string;
}
//props interface with three properties where flashcards is an array of Flashcard type with onSelectFlashcard and onCreateFlashcard as functions
interface DeckProps{   
    flashcards: Flashcard[];
    onSelectFlashcard:(FlashcardId: string) => void;
    onCreateFlashcard: () => void;
}

const FlashCardList = ({flashcards, onSelectFlashcard, onCreateFlashcard}: DeckProps)=>{  
    return (
        //form of the deck with a button to create a new flashcard and a container to display the flashcards
        <div className ='name-of-the-Deck'>                                                                 
                <h2>{flashcards.length > 0 ? flashcards[0].belongsToDeck : 'No Deck Name'}</h2>
                <button onClick = {onCreateFlashcard} className = 'create-a-flashcard'>Create a new Flashcard</button>
            
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
        </div>

    )
}
//exporting the FlashCardList component as the default export
export default FlashCardList;