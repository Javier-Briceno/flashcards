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
import { createFlashcard } from './api/flashcards';

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
  const { decks, loading, error, onCreateDeck, onDeleteDeck } = useDecks();
  const navigate = useNavigate();
  if (loading) return <p>Loading…</p>;
  if (error) return <p>Failed to load decks.</p>;

  return (
    <DeckList
      decks={decks}
      onSelectDeck={(deckId) => navigate(`/decks/${deckId}`)}
      onCreateDeck={onCreateDeck}
      onDeleteDeck={onDeleteDeck}
    />
  );
}

function Deck(){
  const { deckId } = useParams();
  const { deck, flashcards, loading, error, refresh } = useDeckDetails(deckId!);
  //const navigate = useNavigate();
  if (loading) return <p>Loading…</p>;
  if (error) return <p>Failed to load deck.</p>;
  if (!deck) return <p>Deck not found.</p>;

   const handleCreateFlashcard = async (flashcardData: {front: string, back:string}) => {
      //const currentDeck = sampleDecks.find(deck => deck.id === deckId);
      /* open modal → call createFlashcard API, then refresh() */ 
      try {
         console.log('Creating flashcard:', flashcardData);
      //    setTimeout(() => {
      //      refresh();
      //      console.log('Flashcard created and list refreshed');
      //  }, 500);
            await createFlashcard(deckId!, flashcardData);
            await refresh();
            console.log('Flashcard created and list refreshed');
     }catch (error){
       console.log('Error creating flashcard:', error);
       alert('Failed to create flashcard. Please try again.');
       }
     };
   const handleSelectFlashcard = (id: string) => { /* navigate or toggle flip, your choice */ };

  return (
    <div className="deck">
      <FlashcardList
        currentDeck={deck}
        flashcards={flashcards}
        onCreateFlashcard={handleCreateFlashcard}
        onSelectFlashcard={handleSelectFlashcard}
      />
    </div>
  );
}
export default App
