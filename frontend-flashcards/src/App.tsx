import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import './App.css'
import { sampleDecks } from './data/sampleData'
import DeckList from './components/DeckList'
import type { Deck } from './types/Deck'
import { sampleDeck } from './data/sampleData'
import FlashcardList from './components/Deck'
import type { Flashcard } from './components/Deck'
import NavBar from './components/NavBar/NavBar'

function App(){
  return (
    <Router>
      <NavBar/>
      <Routes>
        <Route path = "/" element = {<HomePage/>}/>
        <Route path = "/decks" element = {<Library/>}/>
        <Route path = "/decks/:deckId" element = {<Deck/>}/>
      </Routes>
    </Router>
  )
}

function HomePage(){
  return (
    <div>
      <h1>Pink Vogel Homepage</h1>
    </div>
  )
}

function Library(){
  const[decks, setDecks] = useState<Deck[]>(sampleDecks);
  const handleSelectDeck = (deckId: string) =>{
    console.log('Selected deck:', deckId);

  };
  const handleCreateDeck = (deckData: { title: string; category: string; description: string }) => {
    const newDeck: Deck = {
      id: Date.now().toString(), // Generate unique ID
      title: deckData.title,
      description: deckData.description,
      category: deckData.category,
      cardCount: 0 // Start with 0 cards
    };
    
    setDecks([...decks, newDeck]);
    console.log('Created new deck:', newDeck);
  };
  return (
    <DeckList
      decks = {decks}
      onCreateDeck = {handleCreateDeck}
      onSelectDeck={handleSelectDeck}
    />
  )
}

function Deck(){
  const {deckId} = useParams();
  const [flashcards, setFlashcards] = useState<Flashcard[]>(sampleDeck);
  
  //find the current deck based on the deckId from the sampleDecks
  const currentDeck = sampleDecks.find(deck => deck.id === deckId);
  const handleSelectFlashcard = (flashcardId: string) =>{
    console.log('Selected flashcard:', flashcardId);
  };
  const handleCreateFlashcard = () =>{
    console.log('Create a new flashcard');
  }
  return (
    <div>
      {currentDeck && (
        <div className="deck-header">
          <h2>{currentDeck.title}</h2>
          <p>{currentDeck.description}</p>
        </div>
      )}
      <FlashcardList
          flashcards={flashcards}
          onCreateFlashcard={handleCreateFlashcard}
          onSelectFlashcard={handleSelectFlashcard}
        />
    </div>
  )
}
export default App
