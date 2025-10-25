// src/PageLayout.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PageLayout = ({ children, controls = null, helpText = null }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const closeHelp = () => setShowHelp(false);

  return (
    <>
      <div className="top-bar">
        <div className="nav-burger">
          <button className="burger-btn" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </button>
          {menuOpen && (
            <nav className="nav-menu">
              <Link to="/" onClick={() => setMenuOpen(false)}>Редактор сцен</Link>
              <Link to="/html-tagger" onClick={() => setMenuOpen(false)}>HTML-теггер</Link>
              <Link to="/diff-detector" onClick={() => setMenuOpen(false)}>Детектор различий</Link>
              <Link to="/key-tester" onClick={() => setMenuOpen(false)}>Тестер клавиатуры</Link>
            </nav>
          )}
        </div>

        {controls && (
          <div className="page-controls">
            <div className="page-controls-left">{controls}</div>
            <div className="page-controls-right">
              {helpText && (
                <button className="help-btn" onClick={() => setShowHelp(true)}>
                  Что это?
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="page-content">{children}</div>

      {/* Модальное окно помощи */}
      {showHelp && helpText && (
        <div className="modal-overlay" onClick={closeHelp}>
          <div className="modal-dialog help-dialog" onClick={(e) => e.stopPropagation()}>
            <h3>{helpText.title}</h3>
            <p>{helpText.description}</p>
            {helpText.features && (
              <ul>
                {helpText.features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
            )}
            <button className="modal-close-btn" onClick={closeHelp}>
              Закрыть
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PageLayout;