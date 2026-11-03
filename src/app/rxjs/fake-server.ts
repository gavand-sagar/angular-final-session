import { Observable, defer, finalize, map, timer } from 'rxjs';

// Pretend HTTP call: answers with `value` after `ms` milliseconds.
// It writes "sent", "answered" and "cancelled" lines to the log so we can see what happens.
export function fakeRequest<T>(label: string, ms: number, value: T, log: (line: string) => void): Observable<T> {
  return defer(() => {
    log(`${label}: sent`);
    let answered = false;
    return timer(ms).pipe(
      map(() => {
        answered = true;
        log(`${label}: answered`);
        return value;
      }),
      finalize(() => {
        if (!answered) log(`${label}: cancelled`);
      }),
    );
  });
}
