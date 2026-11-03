import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, Subject, concatMap, exhaustMap, mergeMap, shareReplay, switchMap } from 'rxjs';
import { fakeRequest } from './fake-server';

const MESSAGES = [
  { text: 'Hi! (with a photo)', ms: 1500 },
  { text: 'Are you coming?', ms: 600 },
  { text: 'Bring snacks', ms: 200 },
];

@Component({
  selector: 'app-rxjs-page',
  imports: [AsyncPipe],
  template: `
    <h1>2. switchMap, exhaustMap, concatMap, mergeMap, shareReplay</h1>
    <p class="hook">Every click or key press can start an HTTP call. What should happen when a new one starts before the old one has finished?</p>

    <div class="box">
      <h2>Demo 1: The search that shows the wrong results (switchMap)</h2>
      <div class="expect"><b>Expect:</b> both boxes end with "pizza" typed. One shows results for a different word.</div>
      <ol class="steps">
        <li>Red side: click <b>Type "pizza" for me</b>. Wait 2 seconds. Compare the box and the results.</li>
        <li>Green side: same thing. Read the log: what happened to "p", "pi", "piz"?</li>
      </ol>
      <p class="muted">Fake server: short words are slow to answer ("p" takes 1.5 s, "pizza" takes 0.3 s).</p>
      <div class="row">
        <div class="bad">
          <h3>mergeMap</h3>
          <input [value]="redTerm" (input)="typeRed($any($event.target).value)" placeholder="search food" />
          <button (click)="typeForMe('red')">Type "pizza" for me</button>
          <p>Showing results for: <span class="big">{{ redResult }}</span></p>
          <div class="log">@for (line of redLog; track $index) { <div>{{ line }}</div> }</div>
        </div>
        <div class="good">
          <h3>switchMap</h3>
          <input [value]="greenTerm" (input)="typeGreen($any($event.target).value)" placeholder="search food" />
          <button (click)="typeForMe('green')">Type "pizza" for me</button>
          <p>Showing results for: <span class="big">{{ greenResult }}</span></p>
          <div class="log">@for (line of greenLog; track $index) { <div>{{ line }}</div> }</div>
        </div>
      </div>
      <details class="conclude">
        <summary>Conclusion (open after the demo)</summary>
        <p><b>mergeMap</b> keeps every request. The slowest one ("p") arrives last and wins.</p>
        <p><b>switchMap</b> cancels the old request when a new one starts. Only the newest answer is shown.</p>
        <p>Use switchMap when only the <b>latest</b> value matters: search box, filters, route params, dropdowns.</p>
      </details>
    </div>

    <div class="box">
      <h2>Demo 2: The double-click on Pay (exhaustMap)</h2>
      <div class="expect"><b>Expect:</b> the user wants to pay Rs 500 once. One wallet loses more.</div>
      <ol class="steps">
        <li>Red side: click <b>Pay Rs 500</b> 3 times quickly. Look at the wallet.</li>
        <li>Green side: same thing.</li>
      </ol>
      <div class="row">
        <div class="bad">
          <h3>mergeMap</h3>
          <button (click)="payRed.next(redPayNo = redPayNo + 1)">Pay Rs 500</button>
          <button (click)="redWallet = 2000; redPayLog = []; redPayNo = 0">Reset</button>
          <p>Wallet: <span class="big">Rs {{ redWallet }}</span></p>
          <div class="log">@for (line of redPayLog; track $index) { <div>{{ line }}</div> }</div>
        </div>
        <div class="good">
          <h3>exhaustMap</h3>
          <button (click)="payGreen.next(greenPayNo = greenPayNo + 1)">Pay Rs 500</button>
          <button (click)="greenWallet = 2000; greenPayLog = []; greenPayNo = 0">Reset</button>
          <p>Wallet: <span class="big">Rs {{ greenWallet }}</span></p>
          <div class="log">@for (line of greenPayLog; track $index) { <div>{{ line }}</div> }</div>
        </div>
      </div>
      <details class="conclude">
        <summary>Conclusion (open after the demo)</summary>
        <p><b>exhaustMap</b> ignores new clicks while the first payment is still running. That is the homework answer.</p>
        <p>Use it for Pay, Login, Submit, Place order: anything that must happen <b>once</b>.</p>
        <p>Disabling the button helps too, but exhaustMap protects the code even if the button is not disabled.</p>
      </details>
    </div>

    <div class="box">
      <h2>Demo 3: The chat in the wrong order (concatMap)</h2>
      <div class="expect"><b>Expect:</b> you send 3 messages in order. One friend reads them backwards.</div>
      <ol class="steps">
        <li>Click <b>Send 3 messages</b> on both sides. Wait 3 seconds.</li>
        <li>Read "Friend's phone" from top to bottom on each side.</li>
      </ol>
      <p class="muted">The first message has a photo, so it takes the longest to upload.</p>
      <div class="row">
        <div class="bad">
          <h3>mergeMap</h3>
          <button (click)="sendAll('red')">Send 3 messages</button>
          <p><b>Friend's phone:</b></p>
          <ol>@for (m of redChat; track $index) { <li>{{ m }}</li> }</ol>
        </div>
        <div class="good">
          <h3>concatMap</h3>
          <button (click)="sendAll('green')">Send 3 messages</button>
          <p><b>Friend's phone:</b></p>
          <ol>@for (m of greenChat; track $index) { <li>{{ m }}</li> }</ol>
        </div>
      </div>
      <details class="conclude">
        <summary>Conclusion (open after the demo)</summary>
        <p><b>concatMap</b> waits for one request to finish before starting the next. Order is kept.</p>
        <table>
          <tr><th>Operator</th><th>New value while busy</th><th>Use for</th></tr>
          <tr><td><code>switchMap</code></td><td>cancel the old one</td><td>search, filters</td></tr>
          <tr><td><code>exhaustMap</code></td><td>ignore the new one</td><td>Pay, Login, Submit</td></tr>
          <tr><td><code>concatMap</code></td><td>wait in a queue</td><td>chat, saving steps in order</td></tr>
          <tr><td><code>mergeMap</code></td><td>run both at the same time</td><td>independent uploads, delete many</td></tr>
        </table>
      </details>
    </div>

    <div class="box">
      <h2>Demo 4: The profile loaded twice (shareReplay)</h2>
      <div class="expect"><b>Expect:</b> the header and the sidebar both show the user's name. One side asks the server twice for it.</div>
      <ol class="steps">
        <li>Click <b>Load profile</b> on both sides. Wait 1 second.</li>
        <li>Compare "Requests the server answered".</li>
      </ol>
      <div class="row">
        <div class="bad">
          <h3>Plain Observable (cold)</h3>
          <button (click)="loadProfile('red')">Load profile</button>
          @if (redUser$) {
            <p>Header: {{ redUser$ | async }}</p>
            <p>Sidebar: {{ redUser$ | async }}</p>
          }
          <p>Requests the server answered: <span class="big">{{ redRequests }}</span></p>
        </div>
        <div class="good">
          <h3>shareReplay(1)</h3>
          <button (click)="loadProfile('green')">Load profile</button>
          @if (greenUser$) {
            <p>Header: {{ greenUser$ | async }}</p>
            <p>Sidebar: {{ greenUser$ | async }}</p>
          }
          <p>Requests the server answered: <span class="big">{{ greenRequests }}</span></p>
        </div>
      </div>
      <details class="conclude">
        <summary>Conclusion (open after the demo)</summary>
        <p>An HTTP Observable is <b>cold</b>: every subscriber (every async pipe) starts its own request.</p>
        <p><b>shareReplay(1)</b> makes it shared: one request, and late subscribers get the saved answer.</p>
        <p>Real examples: logged-in user, app settings, country list. Load once, use everywhere.</p>
      </details>
    </div>
  `,
})
export default class RxjsPage {
  // ---------- Demo 1: search ----------
  redTerm = '';
  greenTerm = '';
  redResult = '-';
  greenResult = '-';
  redLog: string[] = [];
  greenLog: string[] = [];
  private redTyped = new Subject<string>();
  private greenTyped = new Subject<string>();

  private redSearch = this.redTyped
    .pipe(mergeMap((term) => this.search(term, (line) => (this.redLog = [...this.redLog, line]))), takeUntilDestroyed())
    .subscribe((result) => (this.redResult = result));

  private greenSearch = this.greenTyped
    .pipe(switchMap((term) => this.search(term, (line) => (this.greenLog = [...this.greenLog, line]))), takeUntilDestroyed())
    .subscribe((result) => (this.greenResult = result));

  // Short words are slow on this server: "p" 1.5 s ... "pizza" 0.3 s
  private search(term: string, log: (line: string) => void) {
    const ms = Math.max(300, (6 - term.length) * 300);
    return fakeRequest(`"${term}"`, ms, term, log);
  }

  typeRed(term: string) {
    this.redTerm = term;
    this.redTyped.next(term);
  }

  typeGreen(term: string) {
    this.greenTerm = term;
    this.greenTyped.next(term);
  }

  typeForMe(side: 'red' | 'green') {
    if (side === 'red') this.redLog = [];
    else this.greenLog = [];
    const word = 'pizza';
    for (let i = 1; i <= word.length; i++) {
      setTimeout(() => (side === 'red' ? this.typeRed(word.slice(0, i)) : this.typeGreen(word.slice(0, i))), i * 100);
    }
  }

  // ---------- Demo 2: Pay ----------
  redPayNo = 0;
  greenPayNo = 0;
  redWallet = 2000;
  greenWallet = 2000;
  redPayLog: string[] = [];
  greenPayLog: string[] = [];
  payRed = new Subject<number>();
  payGreen = new Subject<number>();

  private redPayments = this.payRed
    .pipe(mergeMap((n) => this.pay(n, (line) => (this.redPayLog = [...this.redPayLog, line]))), takeUntilDestroyed())
    .subscribe(() => (this.redWallet -= 500));

  private greenPayments = this.payGreen
    .pipe(exhaustMap((n) => this.pay(n, (line) => (this.greenPayLog = [...this.greenPayLog, line]))), takeUntilDestroyed())
    .subscribe(() => (this.greenWallet -= 500));

  private pay(n: number, log: (line: string) => void) {
    return fakeRequest(`payment ${n}`, 2000, n, log);
  }

  // ---------- Demo 3: chat ----------
  redChat: string[] = [];
  greenChat: string[] = [];
  private sendRed = new Subject<{ text: string; ms: number }>();
  private sendGreen = new Subject<{ text: string; ms: number }>();

  private redMessages = this.sendRed
    .pipe(mergeMap((m) => fakeRequest(m.text, m.ms, m.text, () => {})), takeUntilDestroyed())
    .subscribe((text) => (this.redChat = [...this.redChat, text]));

  private greenMessages = this.sendGreen
    .pipe(concatMap((m) => fakeRequest(m.text, m.ms, m.text, () => {})), takeUntilDestroyed())
    .subscribe((text) => (this.greenChat = [...this.greenChat, text]));

  sendAll(side: 'red' | 'green') {
    if (side === 'red') this.redChat = [];
    else this.greenChat = [];
    MESSAGES.forEach((m) => (side === 'red' ? this.sendRed : this.sendGreen).next(m));
  }

  // ---------- Demo 4: shareReplay ----------
  redRequests = 0;
  greenRequests = 0;
  redUser$?: Observable<string>;
  greenUser$?: Observable<string>;

  loadProfile(side: 'red' | 'green') {
    if (side === 'red') {
      this.redRequests = 0;
      this.redUser$ = fakeRequest('profile', 800, 'Asha (admin)', (line) => line.endsWith('answered') && this.redRequests++);
    } else {
      this.greenRequests = 0;
      this.greenUser$ = fakeRequest('profile', 800, 'Asha (admin)', (line) => line.endsWith('answered') && this.greenRequests++).pipe(
        shareReplay(1),
      );
    }
  }
}
