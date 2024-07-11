import './Settings.css';

import React, { useEffect, useState } from 'react';

enum OpenAIChatModel {
  GPT_4 = 'gpt-4',
  GPT_4_o = 'gpt-4o',
  GPT_4_TURBO = 'gpt-4-turbo',
  GPT_4_0613 = 'gpt-4-0613',
  GPT_3_5_TURBO = 'gpt-3.5-turbo',
  GPT_3_5_TURBO_0301 = 'gpt-3.5-turbo-0301',
  GPT_3_5_TURBO_0125 = 'gpt-3.5-turbo-0125',
  GPT_3_5_TURBO_1106 = 'gpt-3.5-turbo-1106',
  GPT_3_5_TURBO_INSTRUCT = 'gpt-3.5-turbo-instruct',
}

const Settings = () => {
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    chrome.storage.local.get(['openAIApiKey', 'openAIModel'], (result) => {
      if (result.openAIApiKey) {
        setApiKey(result.openAIApiKey);
      }
      if (result.openAIModel) {
        setModel(result.openAIModel);
      }
    });
  }, []);

  const handleApiKeyChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setApiKey(event.target.value);
    setIsSaved(false);
  };

  const handleModelChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setModel(event.target.value);
    setIsSaved(false);
  };

  const handleSaveClick = () => {
    chrome.storage.local.set(
      { openAIApiKey: apiKey, openAIModel: model },
      () => {
        setIsSaved(true);
        console.log(`API key: ${apiKey}, Model: ${model}`);
        setTimeout(() => setIsSaved(false), 1400);
      }
    );
  };

  const isSaveButtonDisabled = !apiKey || !model;

  return (
    <div className="settings-page">
      <h1>LeetCodeGPT</h1>
      <div className="input-field">
        <label htmlFor="apiKey">OpenAI API Key</label>
        <input
          type="password"
          name="apiKey"
          id="apiKey"
          value={apiKey}
          placeholder="Enter your OpenAI API key"
          onChange={handleApiKeyChange}
        />
      </div>
      <div className="input-field">
        <label htmlFor="selectedModel">Select a Model</label>
        <select
          name="selectedModel"
          id="selectedModel"
          value={model}
          onChange={handleModelChange}
          defaultValue={OpenAIChatModel.GPT_3_5_TURBO}
        >
          ${...Object.values(OpenAIChatModel).map(value => (<option value={value}>{value}</option>))}
        </select>
      </div>
      <br />
      <button
        className="save-button"
        disabled={isSaveButtonDisabled}
        type="button"
        onClick={handleSaveClick}
      >
        Save
      </button>
      {isSaved && <p className="save-message">Settings saved!</p>}
    </div>
  );
};

export default Settings;
