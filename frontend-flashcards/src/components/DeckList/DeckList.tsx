import './DeckList.css';
import { Link } from 'react-router-dom';
export interface Deck{
    id: string;
    title: string;
    description: string;
    cardCount: number;
}
interface DeckListProps {
    decks: Deck[];
    onSelectDeck: (deckId: string) => void;
    onCreateDeck: () => void;
}
const DeckList = ({decks, onSelectDeck, onCreateDeck}: DeckListProps)=>{
    return (
        <div className = 'decklist'>
            <div className = 'decklist-header'></div>
            <h2>My Decks</h2>
            <button onClick = {onCreateDeck} className = "create-a-deck">
                + Create a new Deck
            </button>
            <div className = 'deck-container'>
                {decks.map(deck => (
                    <div 
                        key ={deck.id}
                        className = 'deck-card'
                        onClick = {() => onSelectDeck(deck.id)}
                    >
                        <Link to = {`/decks/${deck.id}`} className = "deck-link">
                        <div className = "deck-content">
                            <h3 className = "deck-title">{deck.title}</h3>
                            <p className = "deck-description">{deck.description}</p>
                            <div className = "deck-meta">
                              <p className = "deck-card-count">{deck.cardCount} cards</p>
                            </div>
                        </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DeckList;