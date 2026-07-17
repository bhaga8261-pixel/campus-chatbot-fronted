/**
 * Format a date string to a human-readable local date and time.
 * @param {string|Date} dateVal - Date input
 * @param {boolean} includeTime - Whether to include hours/minutes
 * @returns {string} Formatted string
 */
export const formatDate = (dateVal, includeTime = true) => {
  if (!dateVal) return '';
  const date = new Date(dateVal);
  if (isNaN(date.getTime())) return '';
  
  if (includeTime) {
    return date.toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  }
  return date.toLocaleDateString(undefined, {
    dateStyle: 'medium',
  });
};

/**
 * Format a date string to a relative time (e.g., "3 hours ago", "Yesterday").
 * @param {string|Date} dateVal - Date input
 * @returns {string} Relativized time string
 */
export const formatRelativeTime = (dateVal) => {
  if (!dateVal) return '';
  const date = new Date(dateVal);
  if (isNaN(date.getTime())) return '';

  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

/**
 * Copy text to clipboard and trigger optional callback.
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export const copyToClipboard = async (text) => {
  if (!navigator.clipboard) {
    // Fallback
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (err) {
      console.error('Fallback copy failed', err);
      return false;
    }
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Clipboard copy failed', err);
    return false;
  }
};

/**
 * Parse errors from api responses to return clean string messages.
 * @param {object} error - Axios or general error
 * @returns {string} Readble error message
 */
export const parseError = (error) => {
  if (error.response) {
    // Request made and server responded
    const data = error.response.data;
    if (data && typeof data.detail === 'string') {
      return data.detail;
    }
    if (data && typeof data.detail === 'object' && data.detail.message) {
      return data.detail.message;
    }
    if (data && Array.isArray(data.detail)) {
      // Pydantic validation errors list
      return data.detail.map((err) => `${err.loc?.join('.') || 'field'}: ${err.msg}`).join(', ');
    }
    return data?.message || `Server error: ${error.response.status}`;
  } else if (error.request) {
    // The request was made but no response was received
    return 'No response received from college server. Please check if the backend is running.';
  } else {
    // Something happened in setting up the request that triggered an Error
    return error.message || 'An unexpected connection error occurred.';
  }
};
