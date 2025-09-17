import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import './App.css'
import { sampleDecks } from './data/sampleData'
import DeckList from './components/DeckList'
import type { Deck } from './types/Deck'
import { sampleDeck } from './data/sampleData'
import FlashcardList from './components/Deck'
import type { Flashcard } from './components/Deck'
import NavBar from './components/NavBar/NavBar'
import { useDecks, useDeckDetails } from './hooks/useDecks';

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
  const { decks, loading, error, onCreateDeck } = useDecks();
  const navigate = useNavigate();
  if (loading) return <p>Loading…</p>;
  if (error) return <p>Failed to load decks.</p>;

  return (
    <DeckList
      decks={decks}
      onSelectDeck={(deckId) => navigate(`/decks/${deckId}`)}
      onCreateDeck={onCreateDeck}
    />
  );
}

function Deck(){
  const { deckId } = useParams();
  const { deck, flashcards, loading, error } = useDeckDetails(deckId!);
  if (loading) return <p>Loading…</p>;
  if (error) return <p>Failed to load deck.</p>;
  if (!deck) return <p>Deck not found.</p>;

  const currentDeck = sampleDecks.find(deck => deck.id === deckId);
  const handleCreateFlashcard = () => { /* open modal → call createFlashcard API, then refresh() */ };
  const handleSelectFlashcard = (id: string) => { /* navigate or toggle flip, your choice */ };

  return (
    <div className="deck">
      <div className="deck-header">
        <h2>{deck.title}</h2>
        {deck.description && <p>{deck.description}</p>}
      </div>
      <FlashcardList
        currentDeck={currentDeck!}
        flashcards={flashcards}
        onCreateFlashcard={handleCreateFlashcard}
        onSelectFlashcard={handleSelectFlashcard}
      />
    </div>
  );
}
export default App
