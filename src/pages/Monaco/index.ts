// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Window {
  monaco: Record<string, any>;
}

window.addEventListener('message', (message) => {
  if (message.data.action === 'update-code') {
    const editorInstance = window.monaco.editor.getModels()[0];
    editorInstance.setValue(message.data.code);
  }
});
