'use client';

type ToastProps = { tone: 'success' | 'error'; message: string; onDismiss: () => void; actionLabel?: string; onAction?: () => void };

export function Toast({ tone, message, onDismiss, actionLabel, onAction }: ToastProps) {
  const title = tone === 'success' ? 'All set' : 'Action needed';
  return <div className={`mobile-toast mobile-toast-${tone}`} role={tone === 'error' ? 'alert' : 'status'} aria-live="polite"><span className="toast-symbol" aria-hidden="true">{tone === 'success' ? '✓' : '!'}</span><div className="toast-content"><strong>{title}</strong><p>{message}</p></div>{actionLabel && onAction && <button className="toast-action" onClick={onAction}>{actionLabel}</button>}<button className="toast-close" aria-label="Dismiss notification" onClick={onDismiss}>×</button></div>;
}
