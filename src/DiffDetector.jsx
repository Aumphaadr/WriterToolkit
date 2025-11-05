// src/DiffDetector.jsx

import React, { useState, useEffect } from 'react';
import PageLayout from './PageLayout';
import './styles/DiffDetector.css';
import { diff_match_patch } from 'diff-match-patch';
import CopyableTextarea from './components/CopyableTextarea';

const getWordForm = (number, forms) => {
  const n = Math.abs(number) % 100;
  const n1 = n % 10;
  if (n > 10 && n < 20) return forms[2];
  if (n1 > 1 && n1 < 5) return forms[1];
  if (n1 === 1) return forms[0];
  return forms[2];
};

const dmp = new diff_match_patch();

const DiffDetector = () => {
  useEffect(() => {
    document.title = 'Сравнение текстов — Writer Toolkit';
  }, []);

  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [isComparing, setIsComparing] = useState(false);
  const [diffResult, setDiffResult] = useState({ left: [], right: [] });

  const normalizeLineBreaks = (text) => {
    return text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line !== '')
      .join('\n');
  };

  const compareTexts = () => {
    if (text1 === text2) {
      setDiffResult({ left: [], right: [] });
      setIsComparing(true);
      return;
    }

    const diffs = dmp.diff_main(text1, text2);
    dmp.diff_cleanupSemantic(diffs);

    const leftParts = [];
    const rightParts = [];

    diffs.forEach(([op, text]) => {
      if (op === 0) {
        leftParts.push({ type: 'same', text });
        rightParts.push({ type: 'same', text });
      } else if (op === -1) {
        leftParts.push({ type: 'deleted', text });
        rightParts.push({ type: 'same', text: '' });
      } else if (op === 1) {
        leftParts.push({ type: 'same', text: '' });
        rightParts.push({ type: 'added', text });
      }
    });

    setDiffResult({ left: leftParts, right: rightParts });
    setIsComparing(true);
  };

  const editMode = () => setIsComparing(false);

  const handleClearAll = () => {
    setText1('');
    setText2('');
  };

  const handleNormalize = () => {
    setText1(normalizeLineBreaks(text1));
    setText2(normalizeLineBreaks(text2));
  };

  const diffControls = (
    <>
      <button className="clear-all-btn" onClick={handleClearAll}>
        Удалить всё
      </button>
      <button className="normalize-btn" onClick={handleNormalize}>
        Очистить переносы
      </button>
      {isComparing ? (
        <button className="edit-btn" onClick={editMode}>
          Редактировать
        </button>
      ) : (
        <button className="compare-btn" onClick={compareTexts}>
          Сравнить
        </button>
      )}
    </>
  );

  const helpText = {
    title: 'Детектор различий',
    description:
      'Сравнивает два текста и визуально выделяет различия между ними.',
    features: [
      'Подсвечивает добавленные фрагменты зелёным',
      'Подсвечивает удалённые/изменённые фрагменты красным',
      'Показывает сообщение, если тексты идентичны',
      'Автоматически переносит длинные строки',
      'Очищает лишние переносы и пробелы',
      'Работает с большими объёмами текста',
    ],
  };

  return (
    <PageLayout controls={diffControls} helpText={helpText}>
      <div className="diff-detector-content">
        {!isComparing ? (
          <div className="textareas-container">
            <div className="textarea-group">
              <label>
                Текст 1 ({text1.length} {getWordForm(text1.length, ['символ', 'символа', 'символов'])}):
              </label>
              <CopyableTextarea
                value={text1}
                onChange={(e) => setText1(e.target.value)}
                placeholder="Введите первый текст"
                className="input-textarea"
              />
            </div>
            <div className="textarea-group">
              <label>
                Текст 2 ({text2.length} {getWordForm(text2.length, ['символ', 'символа', 'символов'])}):
              </label>
              <CopyableTextarea
                value={text2}
                onChange={(e) => setText2(e.target.value)}
                placeholder="Введите второй текст"
                className="input-textarea"
              />
            </div>
          </div>
        ) : (
          <div className="diff-result-container">
            {text1 === text2 ? (
              <div className="diff-no-differences">
                Тексты идентичны
              </div>
            ) : (
              <>
                <h3 className="diff-has-differences">Различия между текстами:</h3>
                <div className="diff-columns">
                  <div className="diff-column">
                    <div className="diff-text">
                      {diffResult.left.map((part, i) => (
                        <span
                          key={i}
                          className={
                            part.type === 'deleted'
                              ? 'diff-deleted'
                              : part.type === 'same'
                              ? 'diff-same'
                              : ''
                          }
                        >
                          {part.text}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="diff-column">
                    <div className="diff-text">
                      {diffResult.right.map((part, i) => (
                        <span
                          key={i}
                          className={
                            part.type === 'added'
                              ? 'diff-added'
                              : part.type === 'same'
                              ? 'diff-same'
                              : ''
                          }
                        >
                          {part.text}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default DiffDetector;