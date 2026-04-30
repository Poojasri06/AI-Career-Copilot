const payloadInput = document.getElementById('payloadInput');
const loadPayloadBtn = document.getElementById('loadPayloadBtn');
const overrideInput = document.getElementById('overrideInput');
const applyOverrideBtn = document.getElementById('applyOverrideBtn');
const statusEl = document.getElementById('status');

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.style.color = isError ? '#a00' : '#0a7f56';
}

async function getActiveTabId() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs?.[0]?.id;
}

function isStringArray(value) {
  return Array.isArray(value) && value.every((item) => typeof item === 'string' && item.trim().length > 0);
}

function validateOverrideShape(overrides) {
  if (!overrides || typeof overrides !== 'object' || Array.isArray(overrides)) {
    throw new Error('Overrides must be a JSON object.');
  }

  for (const [platform, fields] of Object.entries(overrides)) {
    if (typeof fields !== 'object' || fields === null || Array.isArray(fields)) {
      throw new Error(`Platform ${platform} must map to an object.`);
    }
    for (const [fieldKey, selectors] of Object.entries(fields)) {
      if (!isStringArray(selectors)) {
        throw new Error(`Field ${fieldKey} in ${platform} must be a non-empty string array.`);
      }
    }
  }
}

async function sendToActiveTab(message) {
  const tabId = await getActiveTabId();
  if (!tabId) {
    throw new Error('Unable to detect active tab.');
  }
  await chrome.tabs.sendMessage(tabId, message);
}

loadPayloadBtn.addEventListener('click', async () => {
  try {
    const raw = payloadInput.value.trim();
    if (!raw) {
      setStatus('Paste payload JSON first.', true);
      return;
    }

    const parsed = JSON.parse(raw);
    if (!parsed.fields || typeof parsed.fields !== 'object') {
      setStatus('Invalid payload: missing fields object.', true);
      return;
    }

    await chrome.storage.local.set({ aiAutofillPayload: parsed });
    await sendToActiveTab({
      type: 'AI_AUTOFILL_SET_PAYLOAD',
      payload: parsed,
    });

    setStatus('Payload loaded. Use helper panel in page.');
  } catch (error) {
    setStatus(`Error: ${error.message}`, true);
  }
});

applyOverrideBtn.addEventListener('click', async () => {
  try {
    const raw = overrideInput.value.trim();
    if (!raw) {
      await chrome.storage.local.remove('aiSelectorOverrides');
      await sendToActiveTab({
        type: 'AI_AUTOFILL_SET_OVERRIDES',
        overrides: {},
      });
      setStatus('Selector overrides cleared.');
      return;
    }

    const parsed = JSON.parse(raw);
    validateOverrideShape(parsed);

    await chrome.storage.local.set({ aiSelectorOverrides: parsed });
    await sendToActiveTab({
      type: 'AI_AUTOFILL_SET_OVERRIDES',
      overrides: parsed,
    });

    setStatus('Selector overrides applied.');
  } catch (error) {
    setStatus(`Error: ${error.message}`, true);
  }
});

async function hydrateSavedInputs() {
  const result = await chrome.storage.local.get(['aiAutofillPayload', 'aiSelectorOverrides']);
  if (result?.aiAutofillPayload) {
    payloadInput.value = JSON.stringify(result.aiAutofillPayload, null, 2);
  }
  if (result?.aiSelectorOverrides) {
    overrideInput.value = JSON.stringify(result.aiSelectorOverrides, null, 2);
  }
}

hydrateSavedInputs().catch(() => {});
