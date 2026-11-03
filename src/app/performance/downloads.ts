import { signal } from '@angular/core';

// Each heavy file calls markDownloaded() when the browser loads it.
// The page shows this list, so we can see WHEN each file arrived without opening DevTools.
export const downloads = signal<string[]>([]);

export function markDownloaded(file: string) {
  downloads.update((list) => [...list, `${new Date().toLocaleTimeString()}  ${file}`]);
}
