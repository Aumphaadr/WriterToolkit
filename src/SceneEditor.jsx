// src/SceneEditor.jsx

import React, { useState, useRef, useEffect } from 'react';
import PageLayout from './PageLayout';
import './styles/SceneEditor.css';
import CopyableTextarea from './components/CopyableTextarea';

const Scene = ({
  scene,
  canDeleteScene,
  fontSize,
  onActiveVariantChange,
  onAddVariant,
  onDeleteVariant,
  onDeleteScene,
  onTitleChange,
  onMoveUp,
  onMoveDown,
  sceneIndex,
  totalScenes,
  flashingSceneIds,
}) => {
  const [deleteConfirm, setDeleteConfirm] = useState({
    variantId: null,
    show: false,
  });

  const [deleteSceneConfirm, setDeleteSceneConfirm] = useState(false);
  const [isEditingTitle, setEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(scene.title);

  useEffect(() => {
    setTempTitle(scene.title);
  }, [scene.title]);

  const activeVariant = scene.variants.find((v) => v.id === scene.activeVariant);
  const charCount = activeVariant ? activeVariant.text.length : 0;

  const showDeleteConfirm = (variantId) => {
    setDeleteConfirm({ variantId, show: true });
  };

  const hideDeleteConfirm = () => {
    setDeleteConfirm({ variantId: null, show: false });
  };

  const confirmDeleteVariant = () => {
    if (!deleteConfirm.variantId) return;
    onDeleteVariant(scene.id, deleteConfirm.variantId);
    hideDeleteConfirm();
  };

  const showDeleteSceneConfirm = () => {
    setDeleteSceneConfirm(true);
  };

  const hideDeleteSceneConfirm = () => {
    setDeleteSceneConfirm(false);
  };

  const confirmDeleteScene = () => {
    onDeleteScene(scene.id);
    hideDeleteSceneConfirm();
  };

  const handleTitleSave = () => {
    const newTitle = tempTitle.trim();
    if (newTitle !== '') {
      onTitleChange(scene.id, newTitle);
    }
    setEditingTitle(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    } else if (e.key === 'Escape') {
      setTempTitle(scene.title);
      setEditingTitle(false);
    }
  };

  const canMoveUp = sceneIndex > 0;
  const canMoveDown = sceneIndex < totalScenes - 1;

  const isFlashing = flashingSceneIds.includes(scene.id);

  return (
    <div className={`scene ${isFlashing ? 'flashing' : ''}`}>
      <div className="scene-sidebar">
        <div>
          <div className="scene-title-wrapper">
            {isEditingTitle ? (
              <input
                type="text"
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={handleKeyDown}
                autoFocus
                className="scene-title-input"
              />
            ) : (
              <div
                className="scene-number"
                onClick={() => setEditingTitle(true)}
                title="Нажмите для редактирования"
              >
                {scene.title}
              </div>
            )}
          </div>

          <div className="char-count">{charCount} симв.</div>
        </div>

        <div className="move-buttons">
          {canMoveUp && (
            <button
              className="move-up-btn"
              onClick={() => onMoveUp(scene.id)}
              title="Переместить вверх"
            >
              ↑
            </button>
          )}
          {canMoveDown && (
            <button
              className="move-down-btn"
              onClick={() => onMoveDown(scene.id)}
              title="Переместить вниз"
            >
              ↓
            </button>
          )}
        </div>

        {canDeleteScene && (
          <button
            className="delete-scene-btn"
            onClick={showDeleteSceneConfirm}
            title="Удалить сцену"
          >
            ×
          </button>
        )}

        {deleteSceneConfirm && (
          <div className="delete-confirm-dialog scene-delete-dialog">
            <span>Удалить сцену?</span>
            <div className="confirm-buttons">
              <button onClick={confirmDeleteScene}>Да</button>
              <button onClick={hideDeleteSceneConfirm}>Нет</button>
            </div>
          </div>
        )}
      </div>

      <div className="scene-content">
        <div className="variants-buttons">
          {scene.variants.map((variant) => (
            <div key={variant.id} className="variant-button-wrapper">
              <button
                className={scene.activeVariant === variant.id ? 'active' : ''}
                onClick={() => onActiveVariantChange(scene.id, variant.id)}
              >
                {variant.id}
              </button>

              {scene.activeVariant === variant.id && (
                <button
                  className="delete-variant-badge"
                  onClick={() => showDeleteConfirm(variant.id)}
                  title="Удалить вариант"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button className="add-variant-btn" title="Добавить вариант" onClick={() => onAddVariant(scene.id)}>
            +
          </button>

          {deleteConfirm.show && (
            <div className="delete-confirm-dialog">
              <span>Удалить вариант {deleteConfirm.variantId}?</span>
              <div className="confirm-buttons">
                <button onClick={confirmDeleteVariant}>Да</button>
                <button onClick={hideDeleteConfirm}>Нет</button>
              </div>
            </div>
          )}
        </div>

        <CopyableTextarea
          value={scene.variants.find((v) => v.id === scene.activeVariant)?.text || ''}
          onChange={(e) =>
            onActiveVariantChange(scene.id, scene.activeVariant, e.target.value)
          }
          className="variant-text"
          rows="6"
          style={{ fontSize: `${fontSize}px` }}
        />
      </div>
    </div>
  );
};

const SceneEditor = () => {
  useEffect(() => {
    document.title = 'Редактор сцен — Writer Toolkit';
  }, []);

  const [scenes, setScenes] = useState(() => {
    const saved = localStorage.getItem('scene-editor-data');
    if (saved) {
      try {
        return JSON.parse(saved).map((scene) => ({
          ...scene,
          title: scene.title || `Сцена ${scene.id}`,
        }));
      } catch (e) {
        console.warn('Failed to parse saved scenes, using default');
      }
    }
    return [
      {
        id: 1,
        variants: [{ id: 1, text: '' }],
        activeVariant: 1,
        title: 'Сцена 1',
      },
    ];
  });

  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem('scene-editor-font-size');
    return saved ? parseInt(saved, 10) || 16 : 16;
  });

  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);
  const [flashingSceneIds, setFlashingSceneIds] = useState([]);
  const [showImportError, setShowImportError] = useState(false);

  useEffect(() => {
    localStorage.setItem('scene-editor-data', JSON.stringify(scenes));
  }, [scenes]);

  useEffect(() => {
    localStorage.setItem('scene-editor-font-size', fontSize.toString());
  }, [fontSize]);

  const fileInputRef = useRef(null);

  const getNextId = (items) => Math.max(0, ...items.map((item) => item.id)) + 1;

  const addScene = () => {
    const newId = getNextId(scenes);
    setScenes([
      ...scenes,
      {
        id: newId,
        variants: [{ id: 1, text: '' }],
        activeVariant: 1,
        title: `Сцена ${newId}`,
      },
    ]);
  };

  const deleteScene = (sceneId) => {
    if (scenes.length <= 1) return;
    setScenes(scenes.filter((s) => s.id !== sceneId));
  };

  const addVariant = (sceneId) => {
    setScenes(
      scenes.map((scene) => {
        if (scene.id === sceneId) {
          const newVariantId = getNextId(scene.variants);
          return {
            ...scene,
            variants: [...scene.variants, { id: newVariantId, text: '' }],
            activeVariant: newVariantId,
          };
        }
        return scene;
      })
    );
  };

  const deleteVariant = (sceneId, variantId) => {
    setScenes(
      scenes.map((scene) => {
        if (scene.id === sceneId && scene.variants.length > 1) {
          const newVariants = scene.variants.filter((v) => v.id !== variantId);
          const newActive = scene.activeVariant === variantId ? newVariants[0].id : scene.activeVariant;
          return { ...scene, variants: newVariants, activeVariant: newActive };
        }
        return scene;
      })
    );
  };

  const updateVariantText = (sceneId, variantId, text) => {
    setScenes(
      scenes.map((scene) =>
        scene.id === sceneId
          ? {
              ...scene,
              variants: scene.variants.map((v) => (v.id === variantId ? { ...v, text } : v)),
            }
          : scene
      )
    );
  };

  const setActiveVariant = (sceneId, variantId) => {
    setScenes(
      scenes.map((scene) =>
        scene.id === sceneId ? { ...scene, activeVariant: variantId } : scene
      )
    );
  };

  const updateSceneTitle = (sceneId, newTitle) => {
    setScenes(
      scenes.map((scene) =>
        scene.id === sceneId ? { ...scene, title: newTitle } : scene
      )
    );
  };

  const moveSceneUp = (sceneId) => {
    setScenes(prevScenes => {
      const index = prevScenes.findIndex(scene => scene.id === sceneId);
      if (index > 0) {
        const newScenes = [...prevScenes];
        const allDefault = newScenes.every((s, i) => s.title === `Сцена ${i + 1}`);
        [newScenes[index], newScenes[index - 1]] = [newScenes[index - 1], newScenes[index]];

        if (allDefault) {
          const updatedScenes = newScenes.map((s, i) => ({
            ...s,
            title: `Сцена ${i + 1}`
          }));
          return updatedScenes;
        }

        return newScenes;
      }
      return prevScenes;
    });

    setFlashingSceneIds([sceneId, scenes[scenes.findIndex(s => s.id === sceneId) - 1].id]);
  };

  const moveSceneDown = (sceneId) => {
    setScenes(prevScenes => {
      const index = prevScenes.findIndex(scene => scene.id === sceneId);
      if (index < prevScenes.length - 1) {
        const newScenes = [...prevScenes];
        const allDefault = newScenes.every((s, i) => s.title === `Сцена ${i + 1}`);
        [newScenes[index], newScenes[index + 1]] = [newScenes[index + 1], newScenes[index]];

        if (allDefault) {
          const updatedScenes = newScenes.map((s, i) => ({
            ...s,
            title: `Сцена ${i + 1}`
          }));
          return updatedScenes;
        }

        return newScenes;
      }
      return prevScenes;
    });

    setFlashingSceneIds([sceneId, scenes[scenes.findIndex(s => s.id === sceneId) + 1].id]);
  };

  useEffect(() => {
    if (flashingSceneIds.length > 0) {
      const timer = setTimeout(() => {
        setFlashingSceneIds([]);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [flashingSceneIds]);

  const normalizeLineBreaks = () => {
    setScenes((prevScenes) =>
      prevScenes.map((scene) => ({
        ...scene,
        variants: scene.variants.map((variant) => ({
          ...variant,
          text: variant.text
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => line !== '')
            .join('\n'),
        })),
      }))
    );
  };

  const clearAllScenes = () => {
    setScenes([
      {
        id: 1,
        variants: [{ id: 1, text: '' }],
        activeVariant: 1,
        title: 'Сцена 1',
      },
    ]);
    setShowClearAllConfirm(false);
  };

  const exportToJson = () => {
    const dataStr = JSON.stringify(scenes, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'scenes.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const validateImportedData = (data) => {
    if (!Array.isArray(data)) {
      return false;
    }

    for (const scene of data) {
      if (
        typeof scene !== 'object' ||
        scene === null ||
        typeof scene.id !== 'number' ||
        !Array.isArray(scene.variants) ||
        typeof scene.activeVariant !== 'number' ||
        typeof scene.title !== 'string'
      ) {
        return false;
      }

      for (const variant of scene.variants) {
        if (
          typeof variant !== 'object' ||
          variant === null ||
          typeof variant.id !== 'number' ||
          typeof variant.text !== 'string'
        ) {
          return false;
        }
      }

      const activeVariantExists = scene.variants.some(v => v.id === scene.activeVariant);
      if (!activeVariantExists) {
        return false;
      }
    }
    return true;
  };

  const importFromJson = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (!validateImportedData(imported)) {
          setShowImportError(true);
          e.target.value = '';
          return;
        }
        if (Array.isArray(imported) && imported.length > 0) {
          const migrated = imported.map((scene) => ({
            ...scene,
            title: scene.title || `Сцена ${scene.id}`,
          }));
          setScenes(migrated);
        }
      } catch (err) {
        setShowImportError(true);
        e.target.value = '';
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const increaseFontSize = () => {
    setFontSize((prev) => Math.min(prev + 1, 32));
  };

  const decreaseFontSize = () => {
    setFontSize((prev) => Math.max(prev - 1, 10));
  };

  const handleFontSizeChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 10 && value <= 32) {
      setFontSize(value);
    }
  };

  const editorControls = (
    <>
      <button className="addScene" onClick={addScene}>
        Добавить сцену
      </button>
      <button className="exportToJson" onClick={exportToJson}>
        Экспорт в JSON
      </button>
      <button className="importFromJson" onClick={() => fileInputRef.current?.click()}>
        Импорт из JSON
      </button>
      <button className="normalizeLineBreaks" onClick={normalizeLineBreaks}>
        Очистить переносы
      </button>
      <input
        type="file"
        ref={fileInputRef}
        accept=".json"
        onChange={importFromJson}
        style={{ display: 'none' }}
      />

      <div className="font-size-control">
        <span>Размер шрифта: </span>
        <div className="font-field">
          <button onClick={decreaseFontSize} className="font-btn">
            −
          </button>
          <input
            type="number"
            value={fontSize}
            onChange={handleFontSizeChange}
            min="10"
            max="32"
            step="1"
            className="font-input"
          />
          <button onClick={increaseFontSize} className="font-btn">
            +
          </button>
        </div>
      </div>

      <button className="clear-all-scenes-btn" onClick={() => setShowClearAllConfirm(true)}>
        Очистить всё
      </button>
    </>
  );

  const helpText = {
    title: 'Редактор сцен',
    description:
      'Этот инструмент позволяет писать и редактировать сценарии с поддержкой нескольких вариантов текста на сцену.',
    features: [
      'Добавляйте и удаляйте сцены',
      'Создавайте альтернативные варианты текста',
      'Переименовывайте сцены по клику',
      'Экспортируйте/импортируйте данные в JSON',
      'Очищайте лишние переносы строк',
      'Все данные сохраняются автоматически',
      'Перемещайте сцены с помощью кнопок в боковой панели',
      'При перемещении дефолтных сцен их названия автоматически обновляются',
      'Перемещённые сцены кратковременно подсвечиваются',
    ],
  };

  return (
    <PageLayout controls={editorControls} helpText={helpText}>
      <div className="scenes">
        {scenes.map((scene, index) => (
          <Scene
            key={scene.id}
            scene={scene}
            canDeleteScene={scenes.length > 1}
            fontSize={fontSize}
            onActiveVariantChange={(sceneId, variantId, newText) => {
              if (newText !== undefined) {
                updateVariantText(sceneId, variantId, newText);
              } else {
                setActiveVariant(sceneId, variantId);
              }
            }}
            onAddVariant={addVariant}
            onDeleteVariant={deleteVariant}
            onDeleteScene={deleteScene}
            onTitleChange={updateSceneTitle}
            onMoveUp={moveSceneUp}
            onMoveDown={moveSceneDown}
            sceneIndex={index}
            totalScenes={scenes.length}
            flashingSceneIds={flashingSceneIds}
          />
        ))}
      </div>

      {showClearAllConfirm && (
        <div className="modal-overlay" onClick={() => setShowClearAllConfirm(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <p>Удалить все сцены и варианты?</p>
            <div className="modal-buttons">
              <button className="modal-confirm-btn" onClick={clearAllScenes}>
                Да, очистить
              </button>
              <button className="modal-cancel-btn" onClick={() => setShowClearAllConfirm(false)}>
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
      {showImportError && (
        <div className="modal-overlay" onClick={() => setShowImportError(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <p>Ваш JSON не соответствует структуре, необходимой для SceneEditor.</p>
            <div className="modal-buttons">
              <button className="modal-cancel-btn" onClick={() => setShowImportError(false)}>
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default SceneEditor;