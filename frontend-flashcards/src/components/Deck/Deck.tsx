import type { Deck } from '../DeckList';
import './Deck.css';  // Importing CSS for styling
import React, {useState} from 'react';

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
    onSelectFlashcard:(flashcardId: string) => void;
    onCreateFlashcard: (flashcard: { front: string; back: string }) => void;
}

const FlashCardList = ({currentDeck, flashcards, onSelectFlashcard, onCreateFlashcard}: DeckProps) => {  

    const[isModalOpen, setIsModalOpen ] = useState(false);
    const[newFlashCardQuestion, setNeWFlashCardQuestion] = useState('');
    const[newFlashCardAnswer, setNewFlashCardAnswer] = useState('');

    const handleCreateFlashCard = () => {
        setIsModalOpen(true);
    };
    const handleModalClose  = () => {
        setIsModalOpen(false);
        setNeWFlashCardQuestion('');
        setNewFlashCardAnswer('');
    };
    const handleCreateCardSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(newFlashCardQuestion.trim() && newFlashCardAnswer.trim()){
            onCreateFlashcard({
                front: newFlashCardQuestion.trim(),
                back: newFlashCardAnswer.trim(),
            });
            setNeWFlashCardQuestion('');
            setNewFlashCardAnswer('');
            setIsModalOpen(false);
        }
    };
    return (
        <>
            <div className = 'name-of-the-Deck'> 
                <div className="deck-header">
                    <h2>{currentDeck.title}</h2>
                    <p>{currentDeck.description}</p>
                    
                    <div className="deck-meta">
                        <span className="card-count">{flashcards.length} cards</span>
                        {currentDeck.category && 
                        <span className="deck-category">{currentDeck.category}</span>}
                    </div>
                </div> 
                <div className = 'deck-actions'>
                    <div className = 'searchbar'>Search flashcard...</div>
                    <button className = 'start-learning'> Start Learning </button>
                    <button onClick = {handleCreateFlashCard} className = 'create-a-flashcard'>Create a new Flashcard</button>
                </div>   
            </div>
            {isModalOpen && (
                <div className="modal-overlay" onClick={handleModalClose}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Create New Flashcard</h3>
                            <button className="modal-close" onClick={handleModalClose}>X</button>
                        </div>
                        <form onSubmit = {handleCreateCardSubmit} className="flashcard-form">
                            <div className="form-group">
                                <label htmlFor="flashcard-question">Question</label>
                                <input
                                    type="text"
                                    id = "flashcard-question"
                                    value = {newFlashCardQuestion}
                                    onChange = {(e) => setNeWFlashCardQuestion(e.target.value)}
                                    placeholder = "Enter the question"
                                    required
                                    autoFocus
                                />
                            </div>
                            <div className = "form-group">
                                <label htmlFor="flashcard-answer">Answer</label>
                                <textarea
                                    id="flashcard-answer"
                                    value={newFlashCardAnswer}
                                    onChange={(e) => setNewFlashCardAnswer(e.target.value)}
                                    placeholder="Enter the answer"
                                    required
                                    rows={4}
                                />
                            </div>

                            <div className="form-actions">
                                <button type="button" onClick={handleModalClose} className="cancel-btn">Cancel</button>
                                <button type="submit" className="create-btn">Create Flashcard</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <div className = 'flashcard-container'>
                {(flashcards.length === 0) ? (
                    <div className="empty-state">
                        <p>No Flashcard here. Please create your first one</p>
                    </div>
                ):(
                    flashcards.map(flashcard => (
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
                ))
            )}
            </div>
        </>
    )
};
//exporting the FlashCardList component as the default export
export default FlashCardList;