const API_URL = 'http://localhost:5000/api';


export const saveScore = async (scoreData, token) => {
  const response = await fetch(`${API_URL}/scores`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(scoreData)
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to save score');
  }
  
  return data;
};

export const getUserScores = async (token, game) => {
  const url = game ? `${API_URL}/scores?game=${game}` : `${API_URL}/scores`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch scores');
  }
  
  return data;
};


export const getHighScores = async (game, limit = 10) => {
  const response = await fetch(`${API_URL}/scores/highscores?game=${game}&limit=${limit}`, {
    method: 'GET'
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch high scores');
  }
  
  return data;
};