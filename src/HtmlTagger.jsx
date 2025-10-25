// src/HtmlTagger.jsx
import React, { useState, useEffect } from 'react';
import PageLayout from './PageLayout';
import './styles/HtmlTagger.css';

const HtmlTagger = () => {
  useEffect(() => {
    document.title = 'HTML-теггер — Writer Toolkit';
  }, []);

  const [inputText, setInputText] = useState('');
  const [outputHtml, setOutputHtml] = useState('');
  const [previewMode, setPreviewMode] = useState(false);

  const transformText = () => {
    let processedText = inputText.replace(/«([\s\S]*?)»/g, (match, content) => {
      return `<em>«${content}»</em>`;
    });

    const lines = processedText.split('\n');
    const htmlLines = lines.map(line => {
      const trimmed = line;
      if (trimmed.trim() === '') {
        return '<p></p>';
      }
      return `<p>${trimmed}</p>`;
    });

    setOutputHtml(htmlLines.join('\n'));
  };

  const downloadHtml = () => {
    if (!outputHtml.trim()) {
      alert('Нет данных для скачивания');
      return;
    }
    const blob = new Blob([outputHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'output.html';
    link.click();
    URL.revokeObjectURL(url);
  };

  const togglePreview = () => {
    setPreviewMode(!previewMode);
  };

  const openInNewTab = () => {
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><title>Предпросмотр</title></head>
    <body>${outputHtml}</body>
    </html>
  `;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const clearAll = () => {
    setInputText('');
    setOutputHtml('');
  };

  // Убрали кнопку "Что это?" из controls
  const taggerControls = (
    <>
      <button className="convert-btn" onClick={transformText}>
        Преобразовать
      </button>
      <button className="download-btn" onClick={downloadHtml}>
        Скачать HTML
      </button>
      <button className="preview-btn" onClick={togglePreview}>
        {previewMode ? 'Редактировать' : 'Предпросмотр'}
      </button>
      <button className="preview-tab-btn" onClick={openInNewTab}>
        Открыть в новой вкладке
      </button>
      <button className="clear-all-nd-btn" onClick={clearAll}>
        Очистить всё
      </button>
    </>
  );

  // Справка для PageLayout
  const helpText = {
    title: 'HTML-теггер',
    description:
      'Преобразует обычный текст в HTML-разметку с тегами <p> и <em>.',
    features: [
      'Оборачивает каждую строку в <p>',
      'Текст в кавычках «...» оборачивается в <em>',
      'Поддерживает многострочные кавычки',
      'Предпросмотр результата без перезагрузки',
      'Скачивание результата как HTML-файл',
      'Открытие предпросмотра в новой вкладке',
    ],
  };

  return (
    <PageLayout controls={taggerControls} helpText={helpText}>
      <div className="html-tagger-content">
        {!previewMode ? (
          <div className="textareas-container">
            <div className="textarea-group">
              <label>Исходный текст:</label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Вставьте сюда текст с кавычками «...»"
                className="input-textarea"
              />
            </div>
            <div className="textarea-group">
              <label>Результат (HTML):</label>
              <textarea
                value={outputHtml}
                readOnly
                placeholder="Нажмите «Преобразовать»"
                className="output-textarea"
              />
            </div>
          </div>
        ) : (
          <div className="html-preview">
            <div dangerouslySetInnerHTML={{ __html: outputHtml || '<p>Нет данных для предпросмотра</p>' }} />
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default HtmlTagger;