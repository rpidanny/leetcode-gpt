import './Settings.css';

import React, { useEffect, useState } from 'react';

enum OpenAIChatModel {
  GPT_4 = 'gpt-4',
  GPT_4_0314 = 'gpt-4-0314',
  GPT_4_32K = 'gpt-4-32k',
  GPT_4_32K_0314 = 'gpt-4-32k-0314',
  GPT_3_5_TURBO = 'gpt-3.5-turbo',
  GPT_3_5_TURBO_0301 = 'gpt-3.5-turbo-0301',
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
          <option value={OpenAIChatModel.GPT_3_5_TURBO}>GPT 3.5 Turbo</option>
          <option value={OpenAIChatModel.GPT_3_5_TURBO_0301}>
            GPT 3.5 Turbo 0301
          </option>
          <option value={OpenAIChatModel.GPT_4}>GPT 4</option>
          <option value={OpenAIChatModel.GPT_4_0314}>GPT 4 0314</option>
          <option value={OpenAIChatModel.GPT_4_32K}>GPT 4 32K</option>
          <option value={OpenAIChatModel.GPT_4_32K_0314}>GPT 4 32K 0314</option>
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
