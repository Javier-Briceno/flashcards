import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
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
    const[decks, setDecks] = useState<Deck[]>(sampleDecks);
    const handleSelectDeck = (deckId: string) =>{
      console.log('Selected deck:', deckId);

    };
    const handleCreateDeck = () =>{
      console.log('Create a new deck');
    }


    const [flashcards, setFlashcards] = useState<Flashcard[]>(sampleDeck);
    const handleSelectFlashcard = (flashcardId: string) =>{
      console.log('Selected flashcard:', flashcardId);
    };
    const handleCreateFlashcard = () =>{
      console.log('Create a new flashcard');
    }


    const [currentView, setCurrentView] = useState<'decks' | 'flashcards'>('decks');
    const switchToDecks = () => setCurrentView('decks');
    const switchToFlashcards = () => setCurrentView('flashcards');
    return (
      <div className = 'App'>
        <div className="view-switcher">
        <button 
          onClick={switchToDecks}
          className={currentView === 'decks' ? 'active' : ''}
        >
          My Decks
        </button>
        <button 
          onClick={switchToFlashcards}
          className={currentView === 'flashcards' ? 'active' : ''}
        >
          My Flashcards
        </button>
      </div>

      {/* Conditional rendering */}
      {currentView === 'decks' ? (
        <DeckList
          decks={decks}
          onCreateDeck={handleCreateDeck}
          onSelectDeck={handleSelectDeck}
        />
      ) : (
        <FlashcardList
          flashcards={flashcards}
          onCreateFlashcard={handleCreateFlashcard}
          onSelectFlashcard={handleSelectFlashcard}
        />
      )}
      </div>
    );

  }
export default App
