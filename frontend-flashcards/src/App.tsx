import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import './App.css'
import { sampleDecks } from './data/sampleData'
import DeckList from './components/DeckList'
import type { Deck } from './types/Deck'
import { sampleDeck } from './data/sampleData'
import FlashcardList from './components/Deck'
import type { Flashcard } from './components/Deck'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.tsx</code> and save to test HMR
//         </p>
//       </div>
//     </>
//   )
// }
function App(){
  return (
    <Router>
      <div className="App">
      <Routes>
        <Route path = "/" element = {<HomePage/>}/>
        <Route path = "/decks" element = {<Library/>}/>
        <Route path = "/decks/:deckId" element = {<Deck/>}/>
      </Routes>
      </div>
    </Router>
  )
}

function HomePage(){
  return (
    <div>
      <h1>Pink Vogel</h1>
      <nav>
        <Link to = "/decks">View Library</Link>
      </nav>
    </div>
  )
}

function Library(){
  const[decks, setDecks] = useState<Deck[]>(sampleDecks);
  const handleSelectDeck = (deckId: string) =>{
    console.log('Selected deck:', deckId);

  };
  const handleCreateDeck = () =>{
    console.log('Create a new deck');
  }
  return (
    <div>
      <nav>
        <Link to ="/">Back to Home</Link>
        <DeckList
          decks = {decks}
          onCreateDeck = {handleCreateDeck}
          onSelectDeck={handleSelectDeck}
        />
      </nav>
    </div>
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
      <nav>
        <Link to ="/decks">Back to Library</Link>
      </nav>
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
