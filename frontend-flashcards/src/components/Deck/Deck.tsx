import React, { useState } from 'react';
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
    onSelectFlashcard:(flashcardId: string) => void;
    onCreateFlashcard: (flashcard: { front: string; back: string }) => void;
}

const FlashcardList = ({currentDeck, flashcards, onSelectFlashcard, onCreateFlashcard}: DeckProps) => {  

    const[isModalOpen, setIsModalOpen ] = useState(false);
    const[newFlashcardQuestion, setNeWFlashcardQuestion] = useState('');
    const[newFlashcardAnswer, setNewFlashcardAnswer] = useState('');

    const handleCreateFlashcard = () => {
        setIsModalOpen(true);
    };
    const handleModalClose  = () => {
        setIsModalOpen(false);
        setNeWFlashcardQuestion('');
        setNewFlashcardAnswer('');
    };
    const handleCreateCardSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(newFlashcardQuestion.trim() && newFlashcardAnswer.trim()){
            onCreateFlashcard({
                front: newFlashcardQuestion.trim(),
                back: newFlashcardAnswer.trim(),
            });
            setNeWFlashcardQuestion('');
            setNewFlashcardAnswer('');
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
                    <input type = "text" placeholder= "search (not working)" className = 'searchbar'/>
                    <button className = 'start-learning'> Start Learning </button>
                    <button onClick = {handleCreateFlashcard} className = 'create-a-flashcard'>Create a new Flashcard</button>
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
                                    value = {newFlashcardQuestion}
                                    onChange = {(e) => setNeWFlashcardQuestion(e.target.value)}
                                    placeholder = "Enter the question"
                                    required
                                    autoFocus
                                />
                            </div>
                            <div className = "form-group">
                                <label htmlFor="flashcard-answer">Answer</label>
                                <textarea
                                    id="flashcard-answer"
                                    value={newFlashcardAnswer}
                                    onChange={(e) => setNewFlashcardAnswer(e.target.value)}
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
            {isModalOpen && (
                <div onClick = {handleModalClose} className = "modal-overlay overlay-2">
                    <div onClick = {(e) => {e.stopPropagation()}} className = "modal-content">
                        <div className = "modal-header">Create a flashcard</div>
                        <form onSubmit={handleCreateCardSubmit}>
                            <div className = "form-group">
                                <label>Front of the card:</label><br/>
                                <textarea 
                                    onChange = {(e) => {setNeWFlashcardQuestion(e.target.value)}}
                                    placeholder = "Question..."
                                />
                            </div>
                            <div className = "form-group">
                                <label>Back of the card:</label><br/>
                                <textarea 
                                    onChange = {(e) => {setNewFlashcardAnswer(e.target.value)}}
                                    placeholder = "Answer..."
                                />
                            </div>
                            <div className = "modal-actions">
                                <button onClick = {handleModalClose} className = "cancel-btn">Cancel</button>
                                <button className = "create-btn">+ Create flashcard</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
};
//exporting the FlashCardList component as the default export
export default FlashcardList;