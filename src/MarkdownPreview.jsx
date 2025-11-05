// src/MarkdownPreview.jsx
import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import PageLayout from './PageLayout';
import './styles/MarkdownPreview.css';
import CopyableTextarea from './components/CopyableTextarea';

const MarkdownPreview = () => {
  const [markdownText, setMarkdownText] = useState('');
  const [htmlOutput, setHtmlOutput] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

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
    setShowClearConfirm(false);
  };

  const handleClearClick = () => {
    setShowClearConfirm(true);
  };

  const cancelClear = () => {
    setShowClearConfirm(false);
  };

  const togglePreview = () => {
    setPreviewMode(!previewMode);
  };

  const copyMarkdownToClipboard = async () => {
    if (!markdownText.trim()) {
      alert('Нет Markdown-текста для копирования');
      return;
    }
    try {
      await navigator.clipboard.writeText(markdownText);
    } catch (err) {
      console.error('Failed to copy markdown: ', err);
      alert('Не удалось скопировать Markdown в буфер обмена');
    }
  };

  const downloadMarkdown = () => {
    if (!markdownText.trim()) {
      alert('Нет Markdown-текста для скачивания');
      return;
    }
    const blob = new Blob([markdownText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'markdown_content.md';
    link.click();
    URL.revokeObjectURL(url);
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
      'Копирование Markdown в буфер обмена',
      'Скачивание Markdown как .md файл',
    ],
  };

  const previewControls = (
    <>
      <button className="download-markdown-btn" onClick={downloadMarkdown}>
        Скачать Markdown
      </button>
      <button className="clear-all-md-btn" onClick={handleClearClick}>
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
              <CopyableTextarea
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

        {showClearConfirm && (
          <div className="modal-overlay" onClick={cancelClear}>
            <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
              <p>Вы действительно хотите очистить всё содержимое?</p>
              <div className="modal-buttons">
                <button className="modal-confirm-btn" onClick={clearAll}>
                  Да, очистить
                </button>
                <button className="modal-cancel-btn" onClick={cancelClear}>
                  Отмена
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default MarkdownPreview;