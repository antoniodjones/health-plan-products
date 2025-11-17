/**
 * useToast Hook
 * React hook wrapper for toast notifications
 */
'use client';

import { useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  title: string;
  description?: string;
  duration?: number;
}

export function useToast() {
  const showToast = useCallback((type: ToastType, options: ToastOptions) => {
    // Create toast container if it doesn't exist
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'fixed top-4 right-4 z-[9999] flex flex-col gap-2';
      document.body.appendChild(container);
    }

    // Create toast element
    const id = `toast-${Date.now()}`;
    const toast = document.createElement('div');
    toast.id = id;
    toast.className = 'w-96 transform translate-x-full transition-transform duration-300';

    const colors = {
      success: 'bg-green-50 border-green-500 text-green-900',
      error: 'bg-red-50 border-red-500 text-red-900',
      warning: 'bg-yellow-50 border-yellow-500 text-yellow-900',
      info: 'bg-blue-50 border-blue-500 text-blue-900',
    };

    const icons = {
      success: `<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>`,
      error: `<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>`,
      warning: `<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>`,
      info: `<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`,
    };

    toast.innerHTML = `
      <div class="flex items-start gap-3 rounded-lg border-l-4 ${colors[type]} p-4 shadow-lg backdrop-blur-sm bg-opacity-95">
        <div class="flex-shrink-0">
          ${icons[type]}
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-semibold text-sm">${options.title}</p>
          ${options.description ? `<p class="mt-1 text-xs opacity-90">${options.description}</p>` : ''}
        </div>
        <button
          onclick="this.closest('[id^=toast-]').remove()"
          class="flex-shrink-0 text-current opacity-50 hover:opacity-100 transition-opacity"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    `;

    container.appendChild(toast);

    // Animate in
    setTimeout(() => {
      toast.classList.remove('translate-x-full');
      toast.classList.add('translate-x-0');
    }, 10);

    // Auto dismiss
    const duration = options.duration ?? 5000;
    if (duration > 0) {
      setTimeout(() => {
        toast.classList.add('translate-x-full');
        setTimeout(() => toast.remove(), 300);
      }, duration);
    }
  }, []);

  return {
    toast: {
      success: (title: string, description?: string, duration?: number) =>
        showToast('success', { title, description, duration }),
      error: (title: string, description?: string, duration?: number) =>
        showToast('error', { title, description, duration }),
      warning: (title: string, description?: string, duration?: number) =>
        showToast('warning', { title, description, duration }),
      info: (title: string, description?: string, duration?: number) =>
        showToast('info', { title, description, duration }),
    },
  };
}

