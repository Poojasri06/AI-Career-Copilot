(() => {
  const state = {
    payload: null,
    entries: [],
    index: 0,
    filledKeys: new Set(),
    selectorOverrides: {},
    manualSubmitConfirmed: false,
    panelMounted: false,
  };

  const PANEL_ID = 'ai-job-assistant-helper-panel';

  function shouldRunOnThisHost() {
    const host = window.location.hostname.toLowerCase();
    return host.includes('linkedin.com') || host.includes('indeed.com') || host.includes('naukri.com');
  }

  function detectPlatform() {
    const host = window.location.hostname.toLowerCase();
    if (host.includes('linkedin.com')) {
      return 'linkedin';
    }
    if (host.includes('indeed.com')) {
      return 'indeed';
    }
    if (host.includes('naukri.com')) {
      return 'naukri';
    }
    return 'unknown';
  }

  function normalizeFieldKey(key) {
    const k = String(key || '').toLowerCase();
    if (k.startsWith('q')) {
      return 'question';
    }
    return k;
  }

  const PLATFORM_SELECTOR_TEMPLATES = {
    linkedin: {
      full_name: ['input[name*="name" i]', 'input[id*="name" i]'],
      headline: ['input[name*="headline" i]', 'input[id*="headline" i]', 'textarea[name*="headline" i]'],
      top_skills: ['input[name*="skill" i]', 'textarea[name*="skill" i]', 'input[id*="skill" i]'],
      cover_letter: ['textarea[name*="cover" i]', 'textarea[id*="cover" i]', 'div[contenteditable="true"]'],
      resume_text: ['textarea[name*="resume" i]', 'textarea[id*="resume" i]'],
      question: ['textarea[name*="question" i]', 'input[name*="question" i]', 'div[contenteditable="true"]']
    },
    indeed: {
      full_name: ['input[name*="name" i]', 'input[id*="name" i]'],
      headline: ['input[name*="title" i]', 'input[id*="title" i]'],
      top_skills: ['textarea[name*="skill" i]', 'input[name*="skill" i]'],
      cover_letter: ['textarea[name*="cover" i]', 'textarea[id*="cover" i]'],
      resume_text: ['textarea[name*="resume" i]'],
      question: ['textarea[name*="question" i]', 'input[name*="question" i]']
    },
    naukri: {
      full_name: ['input[name*="name" i]', 'input[id*="name" i]'],
      headline: ['input[name*="headline" i]', 'input[id*="headline" i]'],
      top_skills: ['input[name*="skill" i]', 'textarea[name*="skill" i]'],
      cover_letter: ['textarea[name*="cover" i]', 'textarea[id*="cover" i]'],
      resume_text: ['textarea[name*="resume" i]'],
      question: ['textarea[name*="question" i]', 'input[name*="question" i]']
    }
  };

  function mergeSelectorTemplates(baseTemplates, overrideTemplates) {
    const merged = JSON.parse(JSON.stringify(baseTemplates));

    if (!overrideTemplates || typeof overrideTemplates !== 'object' || Array.isArray(overrideTemplates)) {
      return merged;
    }

    for (const [platform, fields] of Object.entries(overrideTemplates)) {
      if (!merged[platform]) {
        merged[platform] = {};
      }
      if (!fields || typeof fields !== 'object' || Array.isArray(fields)) {
        continue;
      }

      for (const [fieldKey, selectors] of Object.entries(fields)) {
        if (!Array.isArray(selectors)) {
          continue;
        }
        const validSelectors = selectors.filter((s) => typeof s === 'string' && s.trim().length > 0);
        if (validSelectors.length > 0) {
          merged[platform][fieldKey] = validSelectors;
        }
      }
    }

    return merged;
  }

  function getSelectorTemplateForPlatform(platform) {
    const mergedTemplates = mergeSelectorTemplates(PLATFORM_SELECTOR_TEMPLATES, state.selectorOverrides);
    return mergedTemplates[platform];
  }

  function setSelectorOverrides(overrides) {
    if (!overrides || typeof overrides !== 'object' || Array.isArray(overrides)) {
      state.selectorOverrides = {};
      renderPanel();
      notify('Selector overrides cleared.');
      return;
    }

    state.selectorOverrides = overrides;
    renderPanel();
    notify('Selector overrides updated.');
  }

  function parseEntries(payload) {
    const fields = payload?.fields || {};
    return Object.entries(fields).filter(([, value]) => value !== null && value !== undefined && String(value).trim() !== '');
  }

  function setPayload(payload) {
    state.payload = payload;
    state.entries = parseEntries(payload);
    state.index = 0;
    state.filledKeys = new Set();
    state.manualSubmitConfirmed = false;
    renderPanel();
  }

  function syncIndexToNextUnfilled() {
    while (state.index < state.entries.length) {
      const [key] = state.entries[state.index];
      if (!state.filledKeys.has(key)) {
        break;
      }
      state.index += 1;
    }
  }

  function getCurrentEntry() {
    syncIndexToNextUnfilled();
    if (state.entries.length === 0 || state.index >= state.entries.length) {
      return null;
    }
    return state.entries[state.index];
  }

  function applyValueToElement(target, value) {
    const isInput = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;
    const isEditable = target instanceof HTMLElement && target.isContentEditable;

    if (!isInput && !isEditable) {
      return false;
    }

    if (target instanceof HTMLInputElement && target.type === 'checkbox') {
      return false;
    }

    if (target instanceof HTMLInputElement && target.type === 'radio') {
      return false;
    }

    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
      target.focus();
      target.value = String(value);
      target.dispatchEvent(new Event('input', { bubbles: true }));
      target.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    }

    target.focus();
    target.textContent = String(value);
    target.dispatchEvent(new Event('input', { bubbles: true }));
    target.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }

  function findEditableBySelectors(selectors) {
    for (const selector of selectors) {
      const nodes = Array.from(document.querySelectorAll(selector));
      for (const node of nodes) {
        if (!(node instanceof HTMLElement)) {
          continue;
        }
        if ((node instanceof HTMLInputElement || node instanceof HTMLTextAreaElement) && node.disabled) {
          continue;
        }
        if (node.offsetParent === null && node !== document.activeElement) {
          continue;
        }
        return node;
      }
    }
    return null;
  }

  function fillActiveField() {
    const current = getCurrentEntry();
    if (!current) {
      notify('No remaining fields to fill.');
      return;
    }

    const [key, value] = current;
    const target = document.activeElement;

    if (!target) {
      notify('Select an input/textarea field first.');
      return;
    }

    if (!(target instanceof HTMLElement)) {
      notify('Active element is not editable. Click a form field first.');
      return;
    }

    if (!applyValueToElement(target, value)) {
      notify('Active element is not editable. Click a form field first.');
      return;
    }

    state.filledKeys.add(key);
    state.index += 1;
    notify(`Filled ${key}.`);
    renderPanel();
  }

  function autoFillCommonFields() {
    if (!state.payload || state.entries.length === 0) {
      notify('Load payload first.');
      return;
    }

    const platform = (state.payload.platform || detectPlatform()).toLowerCase();
    const template = getSelectorTemplateForPlatform(platform);
    if (!template) {
      notify('No selector template for this platform.');
      return;
    }

    let filledCount = 0;
    for (const [key, value] of state.entries) {
      if (state.filledKeys.has(key)) {
        continue;
      }

      const normalized = normalizeFieldKey(key);
      const selectors = template[normalized];
      if (!selectors) {
        continue;
      }

      const target = findEditableBySelectors(selectors);
      if (!target) {
        continue;
      }

      if (applyValueToElement(target, value)) {
        state.filledKeys.add(key);
        filledCount += 1;
      }
    }

    syncIndexToNextUnfilled();
    renderPanel();

    if (filledCount === 0) {
      notify('No common fields matched. Use Fill Next Field manually.');
      return;
    }

    notify(`Auto-filled ${filledCount} common field(s).`);
  }

  function resetProgress() {
    state.index = 0;
    state.filledKeys = new Set();
    state.manualSubmitConfirmed = false;
    renderPanel();
    notify('Reset helper progress.');
  }

  function toggleManualConfirmation() {
    state.manualSubmitConfirmed = !state.manualSubmitConfirmed;
    renderPanel();
  }

  function isSubmitElement(element) {
    if (!(element instanceof HTMLElement)) {
      return false;
    }

    if (element.matches('button[type="submit"], input[type="submit"]')) {
      return true;
    }

    const text = (element.textContent || '').toLowerCase();
    const aria = (element.getAttribute('aria-label') || '').toLowerCase();
    return text.includes('submit') || text.includes('apply') || aria.includes('submit') || aria.includes('apply');
  }

  function guardSubmit(event) {
    if (state.manualSubmitConfirmed) {
      return;
    }

    const target = event.target;
    const submitByClick = isSubmitElement(target);
    const submitByForm = event.type === 'submit';

    if (!submitByClick && !submitByForm) {
      return;
    }

    event.preventDefault();
    event.stopImmediatePropagation();
    notify('Manual submit blocked. Confirm in helper panel first.');
    alert('Manual submit confirmation required. In the helper panel, check: I manually reviewed and approve submit.');
  }

  function notify(message) {
    const status = document.querySelector(`#${PANEL_ID} [data-role="status"]`);
    if (status) {
      status.textContent = message;
    }
  }

  function renderPanel() {
    let panel = document.getElementById(PANEL_ID);
    if (!panel) {
      panel = document.createElement('aside');
      panel.id = PANEL_ID;
      panel.style.position = 'fixed';
      panel.style.right = '12px';
      panel.style.bottom = '12px';
      panel.style.width = '320px';
      panel.style.zIndex = '2147483647';
      panel.style.border = '1px solid #bfd0dd';
      panel.style.borderRadius = '12px';
      panel.style.background = '#ffffff';
      panel.style.boxShadow = '0 8px 24px rgba(0,0,0,0.18)';
      panel.style.padding = '10px';
      panel.style.fontFamily = 'Segoe UI, sans-serif';
      document.body.appendChild(panel);
    }

    const current = getCurrentEntry();
    const nextLabel = current ? current[0] : 'Done';

    panel.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
        <strong style="font-size:13px;">AI Autofill Helper</strong>
        <span style="font-size:11px;color:#506877;">${state.index}/${state.entries.length}</span>
      </div>
      <p style="margin:8px 0 6px;font-size:12px;color:#334d5b;">Next field: <strong>${nextLabel}</strong></p>
      <div style="display:flex;gap:6px;flex-wrap:wrap;">
        <button data-action="auto-fill" style="border:0;background:#0f5f8a;color:#fff;border-radius:999px;padding:6px 10px;font-size:12px;cursor:pointer;">Auto Fill Common Fields</button>
        <button data-action="fill-next" style="border:0;background:#13212a;color:#fff;border-radius:999px;padding:6px 10px;font-size:12px;cursor:pointer;">Fill Next Field</button>
        <button data-action="reset" style="border:1px solid #bfd0dd;background:#fff;color:#13212a;border-radius:999px;padding:6px 10px;font-size:12px;cursor:pointer;">Reset</button>
      </div>
      <label style="display:flex;align-items:flex-start;gap:6px;margin-top:8px;font-size:12px;color:#223742;">
        <input type="checkbox" data-action="confirm-submit" ${state.manualSubmitConfirmed ? 'checked' : ''} />
        <span>I manually reviewed all answers and approve submit.</span>
      </label>
      <p data-role="status" style="min-height:16px;margin:8px 0 0;font-size:12px;color:#0a7f56;"></p>
    `;

    panel.querySelector('[data-action="auto-fill"]').addEventListener('click', autoFillCommonFields);
    panel.querySelector('[data-action="fill-next"]').addEventListener('click', fillActiveField);
    panel.querySelector('[data-action="reset"]').addEventListener('click', resetProgress);
    panel.querySelector('[data-action="confirm-submit"]').addEventListener('change', toggleManualConfirmation);
  }

  async function tryHydratePayloadFromStorage() {
    const result = await chrome.storage.local.get(['aiAutofillPayload', 'aiSelectorOverrides']);
    if (result?.aiSelectorOverrides) {
      state.selectorOverrides = result.aiSelectorOverrides;
    }
    if (result?.aiAutofillPayload?.fields) {
      setPayload(result.aiAutofillPayload);
    } else {
      renderPanel();
      notify('Load payload from extension popup.');
    }
  }

  chrome.runtime.onMessage.addListener((message) => {
    if (message?.type === 'AI_AUTOFILL_SET_PAYLOAD' && message.payload) {
      setPayload(message.payload);
      notify('Payload loaded. Click a field, then Fill Next Field.');
    }
    if (message?.type === 'AI_AUTOFILL_SET_OVERRIDES') {
      setSelectorOverrides(message.overrides || {});
    }
  });

  function mount() {
    if (!shouldRunOnThisHost() || state.panelMounted) {
      return;
    }

    state.panelMounted = true;
    document.addEventListener('click', guardSubmit, true);
    document.addEventListener('submit', guardSubmit, true);
    tryHydratePayloadFromStorage().catch(() => {
      renderPanel();
      notify('Failed to load payload from storage.');
    });
  }

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
