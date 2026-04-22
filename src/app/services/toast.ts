import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  message = signal('');
  isVisible = signal(false);
  private hideTimerId: ReturnType<typeof setTimeout> | null = null;

  show(message: string, durationMs: number = 3000) {
    this.message.set(message);
    this.isVisible.set(true);

    if (this.hideTimerId) {
      clearTimeout(this.hideTimerId);
    }

    this.hideTimerId = setTimeout(() => {
      this.isVisible.set(false);
      this.hideTimerId = null;
    }, durationMs);
  }
}
