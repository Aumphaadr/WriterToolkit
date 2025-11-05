// src/components/CopyableTextarea.jsx
import React, { forwardRef, useState } from 'react';
import './CopyableTextarea.css';

const CopyableTextarea = forwardRef(({ value, onChange, placeholder, className, readOnly = false, ...props }, ref) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    if (!value) {
      alert('Нет текста для копирования');
      return;
    }
    try {
      await navigator.clipboard.writeText(value);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      alert('Не удалось скопировать текст в буфер обмена');
    }
  };

  return (
    <div className="copyable-textarea-wrapper">
      <textarea
        ref={ref}
        className={`copyable-textarea ${className || ''}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        {...props}
      />
      <button
        type="button"
        className={`copy-btn ${isCopied ? 'copied' : ''}`}
        onClick={handleCopy}
        title="Скопировать в буфер обмена"
      >
        {isCopied ? '✅' : '📋'}
      </button>
    </div>
  );
});

CopyableTextarea.displayName = 'CopyableTextarea';

export default CopyableTextarea;