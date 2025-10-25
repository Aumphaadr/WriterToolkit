// src/KeyboardTester.jsx
import React, { useState, useEffect } from 'react';
import PageLayout from './PageLayout';
import './styles/KeyboardTester.css';

const KeyboardTester = () => {
  useEffect(() => {
    document.title = 'Тест клавиш — Writer Toolkit';
  }, []);

  const [highlightedKeys, setHighlightedKeys] = useState(new Set());
  const [keyHistory, setKeyHistory] = useState([]);

  const keyMap = {
    'Escape': { symbols: ['Esc'], className: 'key-small' },
    'F1': { symbols: ['F1'], className: 'key-small' },
    'F2': { symbols: ['F2'], className: 'key-small' },
    'F3': { symbols: ['F3'], className: 'key-small' },
    'F4': { symbols: ['F4'], className: 'key-small' },
    'F5': { symbols: ['F5'], className: 'key-small' },
    'F6': { symbols: ['F6'], className: 'key-small' },
    'F7': { symbols: ['F7'], className: 'key-small' },
    'F8': { symbols: ['F8'], className: 'key-small' },
    'F9': { symbols: ['F9'], className: 'key-small' },
    'F10': { symbols: ['F10'], className: 'key-small' },
    'F11': { symbols: ['F11'], className: 'key-small' },
    'F12': { symbols: ['F12'], className: 'key-small' },
    'PrintScreen': { symbols: ['Prt Sc'], className: 'key-small' },
    'ScrollLock': { symbols: ['Scr Lk'], className: 'key-small' },
    'Pause': { symbols: ['Pause'], className: 'key-small' },
    'Home': { symbols: ['Home'], className: 'key-small' },
    'End': { symbols: ['End'], className: 'key-small' },

    'Backquote': { symbols: ['~', '`'], className: 'key-small' },
    'Digit1': { symbols: ['1', '!'], className: 'key-small' },
    'Digit2': { symbols: ['2', '"'], className: 'key-small' },
    'Digit3': { symbols: ['3', '№'], className: 'key-small' },
    'Digit4': { symbols: ['4', ';'], className: 'key-small' },
    'Digit5': { symbols: ['5', '%'], className: 'key-small' },
    'Digit6': { symbols: ['6', ':'], className: 'key-small' },
    'Digit7': { symbols: ['7', '?'], className: 'key-small' },
    'Digit8': { symbols: ['8', '*'], className: 'key-small' },
    'Digit9': { symbols: ['9', '('], className: 'key-small' },
    'Digit0': { symbols: ['0', ')'], className: 'key-small' },
    'Minus': { symbols: ['-', '_'], className: 'key-small' },
    'Equal': { symbols: ['=', '+'], className: 'key-small' },
    'Backspace': { symbols: ['Backspace'], className: 'key-wide' },

    'Tab': { symbols: ['Tab'], className: 'key-small' },
    'KeyQ': { symbols: ['q', 'й'], className: 'key-small' },
    'KeyW': { symbols: ['w', 'ц'], className: 'key-small' },
    'KeyE': { symbols: ['e', 'е'], className: 'key-small' },
    'KeyR': { symbols: ['r', 'р'], className: 'key-small' },
    'KeyT': { symbols: ['t', 'т'], className: 'key-small' },
    'KeyY': { symbols: ['y', 'у'], className: 'key-small' },
    'KeyU': { symbols: ['u', 'г'], className: 'key-small' },
    'KeyI': { symbols: ['i', 'ш'], className: 'key-small' },
    'KeyO': { symbols: ['o', 'о'], className: 'key-small' },
    'KeyP': { symbols: ['p', 'п'], className: 'key-small' },
    'BracketLeft': { symbols: ['[', '{'], className: 'key-small' },
    'BracketRight': { symbols: [']', '}'], className: 'key-small' },
    'Backslash': { symbols: ['\\', '|'], className: 'key-small' },
    'Delete': { symbols: ['Del'], className: 'key-small' },
    'Insert': { symbols: ['Ins'], className: 'key-small' },
    'PageUp': { symbols: ['Pg Up'], className: 'key-small' },
    'PageDown': { symbols: ['Pg Dn'], className: 'key-small' },

    'CapsLock': { symbols: ['Caps'], className: 'key-medium' },
    'KeyA': { symbols: ['a', 'ф'], className: 'key-small' },
    'KeyS': { symbols: ['s', 'ы'], className: 'key-small' },
    'KeyD': { symbols: ['d', 'в'], className: 'key-small' },
    'KeyF': { symbols: ['f', 'а'], className: 'key-small' },
    'KeyG': { symbols: ['g', 'п'], className: 'key-small' },
    'KeyH': { symbols: ['h', 'р'], className: 'key-small' },
    'KeyJ': { symbols: ['j', 'о'], className: 'key-small' },
    'KeyK': { symbols: ['k', 'л'], className: 'key-small' },
    'KeyL': { symbols: ['l', 'д'], className: 'key-small' },
    'Semicolon': { symbols: [';', ':'], className: 'key-small' },
    'Quote': { symbols: ['"', '«»'], className: 'key-small' },
    'Enter': { symbols: ['Enter'], className: 'key-wide' },

    'ShiftLeft': { symbols: ['Shift'], className: 'key-extra-wide' },
    'KeyZ': { symbols: ['z', 'я'], className: 'key-small' },
    'KeyX': { symbols: ['x', 'ч'], className: 'key-small' },
    'KeyC': { symbols: ['c', 'с'], className: 'key-small' },
    'KeyV': { symbols: ['v', 'м'], className: 'key-small' },
    'KeyB': { symbols: ['b', 'и'], className: 'key-small' },
    'KeyN': { symbols: ['n', 'т'], className: 'key-small' },
    'KeyM': { symbols: ['m', 'ь'], className: 'key-small' },
    'Comma': { symbols: [',', '<'], className: 'key-small' },
    'Period': { symbols: ['.', '>'], className: 'key-small' },
    'Slash': { symbols: ['/', '?'], className: 'key-small' },
    'ShiftRight': { symbols: ['Shift'], className: 'key-extra-wide' },

    'ControlLeft': { symbols: ['Ctrl'], className: 'key-small' },
    'MetaLeft': { symbols: ['Win'], className: 'key-small' },
    'AltLeft': { symbols: ['Alt'], className: 'key-small' },
    'Space': { symbols: [' '], className: 'key-space' },
    'AltRight': { symbols: ['Alt'], className: 'key-small' },
    'MetaRight': { symbols: ['Win'], className: 'key-small' },
    'ControlRight': { symbols: ['Ctrl'], className: 'key-small' },
    'ArrowUp': { symbols: ['↑'], className: 'key-arrow' },
    'ArrowDown': { symbols: ['↓'], className: 'key-arrow' },
    'ArrowLeft': { symbols: ['←'], className: 'key-arrow' },
    'ArrowRight': { symbols: ['→'], className: 'key-arrow' },

    'NumLock': { symbols: ['Num Lock'], className: 'key-small' },
    'NumpadDivide': { symbols: ['/'], className: 'key-small' },
    'NumpadMultiply': { symbols: ['*'], className: 'key-small' },
    'NumpadSubtract': { symbols: ['-'], className: 'key-small' },
    'Numpad7': { symbols: ['7'], className: 'key-small' },
    'Numpad8': { symbols: ['8'], className: 'key-small' },
    'Numpad9': { symbols: ['9'], className: 'key-small' },
    'NumpadAdd': { symbols: ['+'], className: 'key-small' },
    'Numpad4': { symbols: ['4'], className: 'key-small' },
    'Numpad5': { symbols: ['5'], className: 'key-small' },
    'Numpad6': { symbols: ['6'], className: 'key-small' },
    'Numpad1': { symbols: ['1'], className: 'key-small' },
    'Numpad2': { symbols: ['2'], className: 'key-small' },
    'Numpad3': { symbols: ['3'], className: 'key-small' },
    'NumpadEnter': { symbols: ['Enter'], className: 'key-small' },
    'Numpad0': { symbols: ['0'], className: 'key-wide' },
    'NumpadDecimal': { symbols: ['.'], className: 'key-small' },
  };

  const keyboardLayout = [
    ['Escape', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'PrintScreen', 'ScrollLock', 'Pause', 'Home', 'End'],
    ['Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal', 'Backspace', 'NumLock', 'NumpadDivide', 'NumpadMultiply', 'NumpadSubtract'],
    ['Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'Backslash', 'PgUp', 'Numpad7', 'Numpad8', 'Numpad9', 'NumpadAdd'],
    ['CapsLock', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'Enter', 'PgDn', 'Numpad4', 'Numpad5', 'Numpad6'],
    ['ShiftLeft', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash', 'ShiftRight', 'Del', 'Numpad1', 'Numpad2', 'Numpad3', 'NumpadEnter'],
    ['ControlLeft', 'MetaLeft', 'AltLeft', 'Space', 'AltRight', 'MetaRight', 'ControlRight', 'ArrowUp', 'Numpad0', 'NumpadDecimal'],
    ['ArrowLeft', 'ArrowDown', 'ArrowRight']
  ];

  const highlightKey = (keyCode) => {
    if (!keyMap[keyCode]) return;
    setHighlightedKeys(prev => new Set([...prev, keyCode]));
    setTimeout(() => {
      setHighlightedKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(keyCode);
        return newSet;
      });
    }, 300);
  };

  const addToHistory = (keyCode) => {
    const keyInfo = keyMap[keyCode];
    if (!keyInfo) return;
    const symbol = keyInfo.symbols[0];
    setKeyHistory(prev => {
      const newHistory = [symbol, ...prev];
      if (newHistory.length > 20) newHistory.pop();
      return newHistory;
    });
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      highlightKey(e.code);
      addToHistory(e.code);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Убрали кнопку "Что это?" из controls
  const testerControls = (
    <>
      <button className="reset-btn" onClick={() => {
        setHighlightedKeys(new Set());
        setKeyHistory([]);
      }}>
        Сбросить подсветку и историю
      </button>
    </>
  );

  // Справка для PageLayout
  const helpText = {
    title: 'Тестер клавиатуры',
    description:
      'Помогает проверить работоспособность клавиш, особенно при неисправных кнопках.',
    features: [
      'Подсвечивает нажатые клавиши зелёным',
      'Отображает историю последних 20 нажатий',
      'Работает как в английской, так и в русской раскладке',
      'Показывает оба символа (англ/рус) на клавишах',
      'Позволяет быстро выявить глючные клавиши',
    ],
  };

  return (
    <PageLayout controls={testerControls} helpText={helpText}>
      <div className="keyboard-tester-content">
        <h2>Тестер клавиатуры</h2>
        <p>Нажимайте клавиши — они будут подсвечиваться зелёным.</p>

        <div className="key-history">
          {keyHistory.map((symbol, index) => (
            <div key={index} className="history-key">
              {symbol}
            </div>
          ))}
        </div>

        <div className="keyboard-layout">
          {keyboardLayout.map((row, rowIndex) => (
            <div key={rowIndex} className="keyboard-row">
              {row.map((keyCode) => {
                const keyInfo = keyMap[keyCode];
                if (!keyInfo) return null;
                const { symbols, className } = keyInfo;
                const isHighlighted = highlightedKeys.has(keyCode);
                return (
                  <div
                    key={keyCode}
                    className={`key ${className} ${isHighlighted ? 'highlighted' : ''}`}
                  >
                    {symbols[0]}
                    {symbols.length > 1 && (
                      <span className="secondary-symbol">{symbols[1]}</span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default KeyboardTester;