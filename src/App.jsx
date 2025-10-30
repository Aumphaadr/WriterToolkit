// src/App.jsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SceneEditor from './SceneEditor';
import HtmlTagger from './HtmlTagger';
import DiffDetector from './DiffDetector';
import KeyboardTester from './KeyboardTester';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SceneEditor />} />
        <Route path="/html-tagger" element={<HtmlTagger />} />
        <Route path="/diff-detector" element={<DiffDetector />} />
        <Route path="/key-tester" element={<KeyboardTester />} />
      </Routes>
    </BrowserRouter>
  );
}