import { getRandomLoadingText } from './loading.texts';

export class LeetCodeDOM {
  domLoadDelay = 1000;

  private getTextContent(selector: string): string {
    const element = document.querySelector(selector);

    if (element && element.textContent) return element.textContent;

    throw Error('Failed to text content');
  }

  private createLoadingScreen(text = 'Loading..'): HTMLDivElement {
    const loadingScreen = document.createElement('div');

    loadingScreen.className = 'loading';
    loadingScreen.innerHTML = `<div class="loading__animation"></div><p class="loading__text">${text}</p>`;

    return loadingScreen;
  }

  private addSolveButton(button: HTMLButtonElement) {
    const submitButton = document.querySelector(
      '[data-e2e-locator="console-submit-button"]'
    );

    submitButton && submitButton.parentNode?.insertBefore(button, submitButton);
  }

  injectScript(filePath: string, tag: string) {
    const node = document.getElementsByTagName(tag)[0];
    const script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', filePath);
    script.setAttribute('id', 'inject');
    node.appendChild(script);
  }

  createSolveButton(onClick?: EventListenerOrEventListenerObject) {
    const button = document.createElement('button');

    button.id = `$solve-button-leetcode-gpt`;

    button.classList.add(
      'px-3',
      'py-1.5',
      'font-medium',
      'items-center',
      'whitespace-nowrap',
      'transition-all',
      'focus:outline-none',
      'inline-flex',
      'bg-fill-3',
      'dark:bg-dark-fill-3',
      'hover:bg-fill-2',
      'dark:hover:bg-dark-fill-2',
      'text-label-2',
      'dark:text-dark-label-2',
      'rounded-lg'
    );

    button.innerHTML = 'Solve';

    if (onClick) button.addEventListener('click', onClick);

    setTimeout(() => this.addSolveButton(button), this.domLoadDelay);
  }

  getQuestion(): string {
    return this.getTextContent(
      'div[data-track-load="qd_description_content"]'
    )?.split('Example 1')[0];
  }

  getCode(): string {
    return this.getTextContent('div.lines-content.monaco-editor-background');
  }

  async updateCode(code: string): Promise<void> {
    window.postMessage({ action: 'update-code', code });
  }

  getLanguage(): string {
    const lang = localStorage.getItem('global_lang');
    if (!lang) throw Error('Failed to get language');

    return lang.replace(/"/g, '');
  }

  getOpenAiApiKey(): Promise<string> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get('openAIApiKey', (result) => {
        if (!result.openAIApiKey) return reject(Error('No API Key set'));
        resolve(result.openAIApiKey);
      });
    });
  }

  getOpenAiModel(): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get('openAIModel', (result) => {
        resolve(result.openAIModel);
      });
    });
  }

  async runAsyncJob(func: Function) {
    const targetDiv = document.querySelector('body');
    if (!targetDiv) return Error('Failed to get loading target div');

    const loadingScreen = this.createLoadingScreen(getRandomLoadingText());

    targetDiv.appendChild(loadingScreen);
    try {
      await func();
    } catch (err) {
      console.error(err);
    } finally {
      targetDiv.removeChild(loadingScreen);
      loadingScreen.remove();
    }
  }
}
