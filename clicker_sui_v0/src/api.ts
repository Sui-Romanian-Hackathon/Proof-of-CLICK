// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface ScoreData {
  wallet_address: string;
  total_score: number;
  last_score: number;
  updated_at?: string;
  created_at?: string;
}

// Get all scores for scoreboard
export async function getAllScores(): Promise<ScoreData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/scores`);
    if (!response.ok) {
      throw new Error('Failed to fetch scores');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching scores:', error);
    return [];
  }
}

// Get score for specific wallet
export async function getScore(walletAddress: string): Promise<ScoreData | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/scores/${walletAddress}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch score');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching score:', error);
    return null;
  }
}

// Save clicker game score
export async function saveClickerScore(walletAddress: string, score: number): Promise<ScoreData | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/scores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        walletAddress,
        score,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to save clicker score');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error saving clicker score', error);
    return null;
  }
}

// Earn time from quiz
export async function earnTime(walletAddress: string, timeEarned: number): Promise<{ available_time: number } | null> {
  try {
    console.log('Earning time:', timeEarned, 'for wallet:', walletAddress);
    const response = await fetch(`${API_BASE_URL}/time`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        walletAddress,
        timeEarned,
      }),
    });
    
    console.log('Earn time response status:', response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to save time, response:', errorText);
      throw new Error(`Failed to save time: ${errorText}`);
    }
    
    const result = await response.json();
    console.log('Earn time result:', result);
    return result;
  } catch (error) {
    console.error('Error saving time', error);
    return null;
  }
}

// Get available time for wallet
export async function getAvailableTime(walletAddress: string): Promise<number> {
  try {
    console.log('Fetching time for:', walletAddress, 'from:', `${API_BASE_URL}/time/${walletAddress}`);
    const response = await fetch(`${API_BASE_URL}/time/${walletAddress}`);
    console.log('Time fetch response status:', response.status);
    if (!response.ok) {
      if (response.status === 404) {
        // No time record exists yet, return 0
        return 0;
      }
      console.error('Failed to fetch time, status:', response.status);
      return 0;
    }
    const data = await response.json();
    console.log('Time data received:', data);
    return data.available_time || 0;
  } catch (error) {
    console.error('Error fetching time', error);
    return 0;
  }
}

// Update available time (for clicker game usage)
export async function updateAvailableTime(walletAddress: string, availableTime: number): Promise<{ available_time: number } | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/time/${walletAddress}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        availableTime,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update time');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating time', error);
    return null;
  }
}
