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
    onSelectFlashcard:(FlashcardId: string) => void;
    onCreateFlashcard:(Front: string, Back: string) => void;
}

const FlashCardList = ({currentDeck, flashcards, onSelectFlashcard, onCreateFlashcard}: DeckProps) => { 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newFlashcardFront, setNewFlashcardFront] = useState('');
    const [newFlashcardBack, setNewFlashcardBack] = useState('');

    const handleCreateFlashcard = () => {
        setIsModalOpen(true);
    }

    const handleModalClose = () => {
        setIsModalOpen(false);
        setNewFlashcardFront('');
        setNewFlashcardBack('');
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedFront = newFlashcardFront.trim();
        const trimmedBack = newFlashcardBack.trim();
        if (trimmedFront && trimmedBack) {
            onCreateFlashcard(trimmedFront, trimmedBack);
            handleModalClose();
        }
    }

    return (
        <>
            <div className = 'name-of-the-Deck'> 
                <div className="deck-header">
                    <h2>{currentDeck.title}</h2>
                    <p>{currentDeck.description}</p>
                </div> 
                <div className = 'deck-actions'>
                    <input type = "text" placeholder= "search (not working)" className = 'searchbar'/>
                    <button className = 'start-learning'> Start Learning </button>
                    <button onClick = {handleCreateFlashcard} className = 'create-a-flashcard'>Create a new Flashcard</button>
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
            {isModalOpen && (
                <div onClick = {handleModalClose} className = "modal-overlay overlay-2">
                    <div onClick = {(e) => {e.stopPropagation()}} className = "modal-content">
                        <div className = "modal-header">Create a flashcard</div>
                        <form onSubmit={handleSubmit}>
                            <div className = "form-group">
                                <label>Front of the card:</label><br/>
                                <textarea 
                                    onChange = {(e) => {setNewFlashcardFront(e.target.value)}}
                                    placeholder = "Question..."
                                />
                            </div>
                            <div className = "form-group">
                                <label>Back of the card:</label><br/>
                                <textarea 
                                    onChange = {(e) => {setNewFlashcardBack(e.target.value)}}
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
}
//exporting the FlashCardList component as the default export
export default FlashCardList;