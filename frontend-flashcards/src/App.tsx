import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { sampleDecks } from './data/sampleData'
import DeckList from './components/DeckList'
import type { Deck } from './types/Deck'

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

    return (
      <div className = 'App'>
        <DeckList
          decks = {decks}
          onCreateDeck={handleCreateDeck}
          onSelectDeck={handleSelectDeck}
        />
      </div>
    );
}
export default App
