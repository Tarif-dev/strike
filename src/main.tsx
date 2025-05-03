import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import * as buffer from 'buffer';
window.Buffer = buffer.Buffer;

createRoot(document.getElementById("root")!).render(<App />);
