import './DeckList.css';
import { Link } from 'react-router-dom';
import React, {useState} from 'react';
//Define the structure of a Deck object
export interface Deck{
    id: string;
    title: string;
    description: string;
    cardCount: number;
    category?: string; //Optional category field
}
//Define the props that DeckList component expects
interface DeckListProps {
    decks: Deck[];
    onSelectDeck: (deckId: string) => void;
    onCreateDeck: (deckData: {title: string, description: string, category: string}) => void;
}
//Main DeckList component function
const DeckList = ({decks, onSelectDeck, onCreateDeck}: DeckListProps) => {
    //State for managing modal visibility and form inputs
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newDeckName, setNewDeckName] = useState('');
    const [newDeckDescription, setNewDeckDescription] = useState('');
    const [newDeckCategory, setNewDeckCategory] = useState('');
    //Function to handle the create button click - opens the modak
    const handleCreateDeck = () => {
        setIsModalOpen(true);
    };
    //Function to close the modal and reset form fields
    const handleModalClose = () => {
        setIsModalOpen(false);
        // Reset form fields
        setNewDeckName('');
        setNewDeckDescription('');
        setNewDeckCategory('');
    };

    //Function to handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); //Prevent default form submission behavior

        //Only proceed if deck name is not empty
        if(newDeckName.trim()){
            onCreateDeck({
                title: newDeckName.trim(), //remove extra spaces
                description: newDeckDescription.trim(),
                category: newDeckCategory.trim()
            });
            //Close the modal after submission
            handleModalClose();
        }
    };

    return (
        <div className = 'decklist'>
            <div className='decklist-header'>
                <h2>My Decks</h2>
                {/* Button to open the create deck modal */}
                <button onClick = {handleCreateDeck} className = "create-a-deck">
                    + Create a new Deck
                </button>
            </div>
            {/* Container for all the deck cards */}
            <div className = 'deck-container'>
                {decks.map(deck => (
                    <div 
                        key ={deck.id}
                        className = 'deck-card'
                        onClick = {() => onSelectDeck(deck.id)}    //Handle click on deck card
                    >
                        {/* //Link to navigate to the deck's detail page */}
                        <Link to = {`/decks/${deck.id}`}>  
                            <div className = "deck-content">
                                <h3 className = "deck-title">{deck.title}</h3>
                                <p className = "deck-description">{deck.description}</p>
                                <p className = "deck-card-count">{deck.cardCount} cards</p>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

            {/* Modal for creating a new deck */}
            {isModalOpen &&(
                //Overlay that covers the entire screen
                <div className="modal-overlay" onClick={handleModalClose}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Create New Deck</h3>
                            <button className="modal-close" onClick={handleModalClose}></button>
                        </div>
                        <form onSubmit ={handleSubmit} className="deck-form">
                            <div className="form-group">
                                <label htmlFor="deck-name">Deck Name</label>
                                <input
                                    type="text"
                                    id="deck-name"
                                    //value={newDeckName}
                                    //onChange={(e) => setNewDeckName(e.target.value)} //Update state on input change
                                    placeholder="Enter deck name"
                                    required
                                    autoFocus
                                />
                            </div>

                            {/* Deck category input field */}
                            <div className="form-group">
                                <label htmlFor="deck-category">Category</label>
                                <input
                                    type="text"
                                    id="deck-category"
                                    //value={newDeckCategory}
                                    //onChange={(e) => setNewDeckCategory(e.target.value)}
                                    placeholder="Enter category (optional)"
                                />
                            </div>

                            {/* Deck description textarea */}
                            <div className="form-group">
                                <label htmlFor="deck-description">Description</label>
                                <textarea
                                    id="deck-description"
                                    //value={newDeckDescription}
                                    //onChange={(e) => setNewDeckDescription(e.target.value)}
                                    placeholder="Enter description (optional)"
                                    rows={3} // Set initial visible rows
                                />
                            </div>

                            {/* Form action buttons */}
                            <div className="form-actions">
                                {/* Cancel button - closes modal without saving */}
                                <button type="button" onClick={handleModalClose} className="cancel-btn">
                                Cancel
                                </button>
                                
                                {/* Submit button - creates the new deck */}
                                <button type="submit" className="create-btn">
                                Create Deck
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

//Export the component for use in other files
export default DeckList;