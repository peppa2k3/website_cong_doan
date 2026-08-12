export function formatDate(value, opts = {}) {
  if (!value) return '—';
  const date = new Date(value);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...opts,
  });
}

export function formatDateTime(value) {
  if (!value) return '—';
  const date = new Date(value);
  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatFileSize(bytes = 0) {
  if (!bytes) return '0 KB';
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export function truncate(text = '', length = 140) {
  if (!text) return '';
  const clean = text.replace(/<[^>]*>/g, '');
  return clean.length > length ? `${clean.slice(0, length).trim()}…` : clean;
}
