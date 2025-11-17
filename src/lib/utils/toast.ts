/**
 * Toast Notification Utility
 * Simple toast notifications for user feedback
 */

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  title: string;
  description?: string;
  type?: ToastType;
  duration?: number;
}

class ToastManager {
  private toasts: Map<string, HTMLDivElement> = new Map();

  show(options: ToastOptions) {
    const {
      title,
      description,
      type = 'info',
      duration = 5000,
    } = options;

    const id = `toast-${Date.now()}`;
    const toast = this.createToast(id, title, description, type);

    document.body.appendChild(toast);
    this.toasts.set(id, toast);

    // Animate in
    setTimeout(() => {
      toast.classList.add('translate-x-0');
      toast.classList.remove('translate-x-full');
    }, 10);

    // Auto dismiss
    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, duration);
    }

    return id;
  }

  dismiss(id: string) {
    const toast = this.toasts.get(id);
    if (!toast) return;

    // Animate out
    toast.classList.remove('translate-x-0');
    toast.classList.add('translate-x-full');

    setTimeout(() => {
      toast.remove();
      this.toasts.delete(id);
    }, 300);
  }

  private createToast(
    id: string,
    title: string,
    description: string | undefined,
    type: ToastType
  ): HTMLDivElement {
    const toast = document.createElement('div');
    toast.id = id;
    toast.className = `fixed top-4 right-4 z-50 w-96 transform translate-x-full transition-transform duration-300 ease-in-out`;

    const colors = {
      success: 'bg-green-50 border-green-200 text-green-900',
      error: 'bg-red-50 border-red-200 text-red-900',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
      info: 'bg-blue-50 border-blue-200 text-blue-900',
    };

    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ',
    };

    toast.innerHTML = `
      <div class="flex items-start gap-3 rounded-lg border-2 ${colors[type]} p-4 shadow-lg">
        <div class="flex h-6 w-6 items-center justify-center rounded-full bg-white text-lg font-bold">
          ${icons[type]}
        </div>
        <div class="flex-1">
          <p class="font-semibold">${title}</p>
          ${description ? `<p class="mt-1 text-sm opacity-90">${description}</p>` : ''}
        </div>
        <button
          onclick="document.getElementById('${id}').remove()"
          class="text-current opacity-50 hover:opacity-100"
        >
          ✕
        </button>
      </div>
    `;

    return toast;
  }

  success(title: string, description?: string) {
    return this.show({ title, description, type: 'success' });
  }

  error(title: string, description?: string) {
    return this.show({ title, description, type: 'error' });
  }

  warning(title: string, description?: string) {
    return this.show({ title, description, type: 'warning' });
  }

  info(title: string, description?: string) {
    return this.show({ title, description, type: 'info' });
  }
}

export const toast = new ToastManager();

