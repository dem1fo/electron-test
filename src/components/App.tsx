// src/components/App.tsx
import React, { useState } from 'react';

declare global {
  interface Window {
    electronAPI: any
  }
} 

const App: React.FC = () => {
  const [text, setText] = useState("")

  const btnClick = async () => {
    const filePath = await window.electronAPI.openFile();
    setText(filePath);
  }
  return (
    <div>
      <h1>Hello, Electron with React and Vite!</h1>
      <button type='button' id="btn" onClick={btnClick}>Open a file</button>
      File path: <strong id="filePath">{text}</strong>
    </div>
  );
};

window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(_event);
  console.log(message);
})

export default App;
