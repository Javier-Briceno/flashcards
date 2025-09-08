import type { Flashcard } from '../components/Deck';
import type { Deck } from '../types/Deck';

//sample data for decks and flashcards
export const sampleDecks: Deck[] = [
    {
        id: '1',
        title: 'Introduction to Machine Learning',
        description: 'About the machine learning concepts and algorithms',
        cardCount: 10
    },
    {
        id: '2',
        title: 'Einfuerung in Complex Intelligence und Software System',
        description: 'About the complex intelligence and software systems',
        cardCount:30
    }
]

export const sampleDeck: Flashcard[] = [
    {
        id: 1,
        question: 'What is Machine Learning?',
        answer: 'Machine Learning is a subset of artificial intelligence that focuses on the development of algorithms that allow computers to learn from and make predictions or decisions based on data.',
        belongsToDeck: 'Introduction to Machine Learning',
        belongsToDeckId: '1'
    }
]