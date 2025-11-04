// src/MarkdownPreview.jsx
import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import PageLayout from './PageLayout';
import './styles/MarkdownPreview.css';

const MarkdownPreview = () => {
  const [markdownText, setMarkdownText] = useState('');
  const [htmlOutput, setHtmlOutput] = useState('');
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    document.title = 'Предпросмотр Markdown — Writer Toolkit';
  }, []);

  useEffect(() => {
    if (markdownText) {
      const rawHtml = marked(markdownText);
      const sanitizedHtml = DOMPurify.sanitize(rawHtml);
      setHtmlOutput(sanitizedHtml);
    } else {
      setHtmlOutput('');
    }
  }, [markdownText]);

  const clearAll = () => {
    setMarkdownText('');
  };

  const togglePreview = () => {
    setPreviewMode(!previewMode);
  };

  const helpText = {
    title: 'Предпросмотр Markdown',
    description:
      'Преобразует Markdown-разметку в HTML и отображает результат.',
    features: [
      'Поддержка основных элементов Markdown',
      'Предварительный просмотр результата',
      'Очистка содержимого',
      'Безопасный рендеринг HTML',
    ],
  };

  const previewControls = (
    <>
      <button className="clear-all-md-btn" onClick={clearAll}>
        Очистить всё
      </button>
      <button className="preview-md-btn" onClick={togglePreview}>
        {previewMode ? 'Редактировать' : 'Предпросмотр'}
      </button>
    </>
  );

  return (
    <PageLayout controls={previewControls} helpText={helpText}>
      <div className="markdown-preview-content">
        {!previewMode ? (
          <div className="textareas-container">
            <div className="textarea-group">
              <label>Markdown:</label>
              <textarea
                value={markdownText}
                onChange={(e) => setMarkdownText(e.target.value)}
                placeholder="Введите Markdown-разметку сюда..."
                className="input-textarea"
              />
            </div>
            <div className="textarea-group">
              <label>Предпросмотр:</label>
              <div
                className="markdown-output"
                dangerouslySetInnerHTML={{ __html: htmlOutput || '<p>Введите Markdown для предпросмотра</p>' }}
              />
            </div>
          </div>
        ) : (
          <div className="markdown-full-preview">
            <div
              className="markdown-output-full"
              dangerouslySetInnerHTML={{ __html: htmlOutput || '<p>Введите Markdown для предпросмотра</p>' }}
            />
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default MarkdownPreview;