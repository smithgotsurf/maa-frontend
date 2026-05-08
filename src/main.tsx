import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import './index.css';

// eslint-disable-next-line react-refresh/only-export-components
function Placeholder() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-[30px] font-bold mb-1.5">MAA</h1>
      <p>Site under construction.</p>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <Placeholder />
    </HashRouter>
  </StrictMode>,
);
