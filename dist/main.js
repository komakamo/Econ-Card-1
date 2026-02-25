import React from 'react';
import { createRoot } from 'react-dom/client';
import EconomicCardGame from './Game.js';
import { jsx as _jsx } from "react/jsx-runtime";
var rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element #root was not found.');
}
createRoot(rootElement).render(/*#__PURE__*/_jsx(React.StrictMode, {
  children: /*#__PURE__*/_jsx(EconomicCardGame, {})
}));