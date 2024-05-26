import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

type PhrasalVerbQuestion = {
  verb: string
  meanings: string[]
}

type PhrasalVerbResult = {
  verb: string
  meaning: string
  example: string
}

type PhrasalVerbResponse = {
  isCorrect: boolean
  correctMeanings: PhrasalVerbResult[]
}

const App = () => {
  const [phrasalVerb, setPhrasalVerb] = useState<PhrasalVerbQuestion>();
  const [selectedMeaning, setSelectedMeaning] = useState<string>('');
  const [correctMeaning, setCorrectMeaning] = useState<string>('');
  const [example, setExample] = useState<string>()

  const BASE_URL = 'http://45.11.26.172:5000'

  useEffect(() => {
    fetchPhrasalVerb();
  }, []);

  const fetchPhrasalVerb = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/random`);
      setPhrasalVerb(response.data);
      setSelectedMeaning('');
      setCorrectMeaning('');
      setExample('')
    } catch (error) {
      console.error('Error fetching phrasal verb:', error);
    }
  };

  const checkMeaning = async (meaning: string) => {
    //console.log(phrasalVerb)
    if (!phrasalVerb) return;

    try {
      const response = await axios.post<PhrasalVerbResponse>(`${BASE_URL}/check`, {
        verb: phrasalVerb.verb,
        selectedMeaning: meaning,
      });

      for (const option of phrasalVerb.meanings) {
        const correctMeaning = response.data.correctMeanings.find(x => x.meaning === option)
        if (correctMeaning) {
          setCorrectMeaning(correctMeaning.meaning)
          setExample(correctMeaning.example)
        }
      }
      setSelectedMeaning(meaning)

    } catch (error) {
      console.error('Error checking meaning:', error);
    }
  };

  const getButtonClassName = (meaning: string) => {
    if (meaning === correctMeaning) return 'correct'
    return ''
  }

  return (
    <div className='App'>
      <header className='App-header'>
        {phrasalVerb && (
          <div>
            <h1>{phrasalVerb.verb}</h1>
            <div className='meanings'>
              {phrasalVerb.meanings.map((meaning, index) => (
                <button
                  key={index}
                  className={`meaning-button ${getButtonClassName(meaning)}`}
                  onClick={() => checkMeaning(meaning)}
                  disabled={!!selectedMeaning}
                >
                  {meaning}
                </button>
              ))}
            </div>
            <h3>{example || '* * *'}</h3>
            <button className={'meaning-button'} onClick={fetchPhrasalVerb} >next</button>
          </div>
        )}
      </header>
    </div>
  );
};

export default App;
