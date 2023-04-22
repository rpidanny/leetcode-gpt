import './Options.css';

import React, { useEffect, useState } from 'react';

function Options(): JSX.Element {
  const [apiKey, setApiKey] = useState<string>('');
  const [storedApiKey, setStoredApiKey] = useState<string>('');

  useEffect(() => {
    // Load the stored API key from Chrome local storage on app load
    chrome.storage.local.get('openAIApiKey', (result) => {
      if (result.openAIApiKey) {
        setStoredApiKey(result.openAIApiKey);
      }
    });
  }, []);

  const handleApiKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(event.target.value);
  };

  const handleApiKeySubmit = () => {
    // Save the API key to Chrome local storage
    chrome.storage.local.set({ openAIApiKey: apiKey }, () => {
      setStoredApiKey(apiKey);
      setApiKey('');
    });
  };

  const handleApiKeyClear = () => {
    // Clear the API key from Chrome local storage
    chrome.storage.local.remove('openAIApiKey', () => {
      setStoredApiKey('');
    });
  };

  return (
    <div className="container">
      <h1 className="title">API Key</h1>
      {storedApiKey ? (
        <div className="card">
          <p className="card-text">
            Your API key is stored in Chrome local storage. It is obfuscated for
            security purposes, but you can still change or clear it.
          </p>
          <p className="card-text">
            Stored API key: {storedApiKey.replace(/./g, '*')}
          </p>
          <button className="btn" onClick={handleApiKeyClear}>
            Clear API Key
          </button>
        </div>
      ) : (
        <div className="card">
          <p className="card-text">
            You have not set an API key yet. Enter it below to store it in
            Chrome local storage.
          </p>
          <input
            className="input"
            type="text"
            placeholder="Enter API key"
            value={apiKey}
            onChange={handleApiKeyChange}
          />
          <button className="btn" onClick={handleApiKeySubmit}>
            Save API Key
          </button>
        </div>
      )}
    </div>
  );
}

export default Options;
