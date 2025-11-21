'use client';

import { useState, useEffect } from 'react';
import { ValidateSentenceRequest, ValidateSentenceResponse, WordResponse } from '@/types/api'; 

const API_BASE_URL = 'http://localhost:8000/api'; 

const getScoreColor = (score: number): string => {
  if (score >= 80) return 'bg-success text-white'; 
  if (score >= 60) return 'bg-warning text-gray-800'; 
  return 'bg-danger text-white'; 
};

export default function WordChallengePage() {
  const [currentWord, setCurrentWord] = useState<WordResponse | null>(null);
  const [sentence, setSentence] = useState('');
  const [result, setResult] = useState<ValidateSentenceResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNewWord = async () => {
    setLoading(true);
    setSentence('');
    setResult(null);
    setError(null);
    setCurrentWord(null); 
    try {
        const response = await fetch(`${API_BASE_URL}/word`);
        if (!response.ok) throw new Error('Failed to fetch word. Check Backend API status.');
        const data: WordResponse = await response.json();
        setCurrentWord(data);
    } catch (err: any) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewWord();
  }, []); 

  const handleSentenceChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSentence(event.target.value);
    if (result) setResult(null); 
  };

  const handleSubmitSentence = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!currentWord || sentence.trim() === '') return;

    setLoading(true);
    setResult(null);
    setError(null);

    const submission: ValidateSentenceRequest = {
        word_id: currentWord.id,
        sentence: sentence.trim(),
    };

    try {
        const response = await fetch(`${API_BASE_URL}/validate-sentence`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(submission), 
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'API request failed.');
        }

        const data: ValidateSentenceResponse = await response.json();
        setResult(data); 

    } catch (err: any) {
        setError(`Error submitting: ${err.message}`);
    } finally {
        setLoading(false);
    }
  };


  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-lg mt-8">
      <h1 className="text-3xl font-bold text-primary mb-6">🎯 Word Challenge</h1>
      
      {loading && !currentWord && <p className="text-center text-info">Loading new word...</p>}
      {error && <p className="text-danger text-center mb-4">{error}</p>}
      
      {currentWord && (
        <>
          <div className={`p-4 rounded-lg mb-6 border-l-4 border-info bg-gray-50`}>
            <h2 className="text-2xl font-semibold text-gray-800">{currentWord.word}</h2>
            <p className="text-sm text-gray-500 mb-2">Level: <span className="font-medium text-secondary">{currentWord.difficulty_level}</span></p>
            <p className="text-gray-600 italic">"{currentWord.definition}"</p>
          </div>

          <form onSubmit={handleSubmitSentence} className="space-y-4">
            <label htmlFor="sentence-input" className="block text-lg font-medium text-gray-700">
              Write a sentence using **"{currentWord.word}"**
            </label>
            <textarea
              id="sentence-input"
              value={sentence}
              onChange={handleSentenceChange}
              rows={5}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary transition duration-150 ease-in-out resize-none"
              placeholder="Start typing your sentence here..."
              disabled={loading}
            />
            <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={loading || sentence.trim() === ''}
                  className="px-6 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-secondary disabled:bg-gray-400 transition duration-150"
                >
                  {loading && !result ? 'Validating...' : 'Submit Sentence'}
                </button>
                <button
                    type="button"
                    onClick={fetchNewWord}
                    disabled={loading}
                    className="px-6 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-50 disabled:bg-gray-200 transition duration-150"
                >
                    New Word (Skip)
                </button>
            </div>
          </form>

          {/* Result Display */}
          {result && (
            <div className={`mt-8 p-5 rounded-lg shadow-lg transition duration-300 ${getScoreColor(result.score)}`}>
              <h3 className="text-xl font-bold mb-3">✅ Validation Result</h3>
              <p className="text-sm"><strong>Score:</strong> <span className="text-2xl font-extrabold">{result.score.toFixed(1)}/100</span></p>
              <p className="mt-2"><strong>Level Assessed:</strong> {result.level}</p>
              <p><strong>Suggestion:</strong> {result.suggestion}</p>
              <p className="mt-3 border-t pt-2 border-opacity-30">
                  <span className="font-semibold">Corrected Sentence:</span> {result.corrected_sentence}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}