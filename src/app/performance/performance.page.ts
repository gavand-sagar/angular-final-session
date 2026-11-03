import { Component } from '@angular/core';
import { ChartEager } from './chart-eager';
import { ChartLazy } from './chart-lazy';
import { downloads } from './downloads';
import { MenuFast } from './menu-fast';
import { MenuSlow } from './menu-slow';

@Component({
  selector: 'app-performance-page',
  imports: [ChartEager, ChartLazy, MenuSlow, MenuFast],
  template: `
    <h1>3. &#64;defer, Chrome Performance tab, Angular DevTools</h1>
    <p class="hook">"The page feels slow" is not a bug report. Load less, run less, and find the exact function.</p>

    <div class="box">
      <h2>Demo 1: The chart nobody opened (&#64;defer)</h2>
      <div class="expect"><b>Expect:</b> both charts are hidden until you click. One chart's code was downloaded anyway.</div>
      <ol class="steps">
        <li>Refresh the page (F5). Read <b>Files downloaded</b> before clicking anything.</li>
        <li>Click <b>Show sales chart</b> on both sides. Read the list again.</li>
      </ol>
      <p><b>Files downloaded:</b></p>
      <div class="log">@for (line of downloads(); track $index) { <div>{{ line }}</div> }</div>
      <div class="row" style="margin-top: 12px">
        <div class="bad">
          <h3>&#64;if</h3>
          @if (showEager) {
            <app-chart-eager />
          } @else {
            <button (click)="showEager = true">Show sales chart</button>
          }
          <p class="muted">Hidden, but the code came with the page.</p>
        </div>
        <div class="good">
          <h3>&#64;defer (on interaction)</h3>
          @defer (on interaction) {
            <app-chart-lazy />
          } @placeholder {
            <button>Show sales chart</button>
          } @loading (minimum 500ms) {
            <p>Loading chart...</p>
          }
          <p class="muted">The code is downloaded only on the click.</p>
        </div>
      </div>
      <details class="conclude">
        <summary>Conclusion (open after the demo)</summary>
        <p><b>&#64;if</b> hides a component. Its code is still downloaded with the page.</p>
        <p><b>&#64;defer</b> puts the component in its own file and downloads it only when needed. The first load of the page is smaller and faster.</p>
        <p>Triggers: <code>on viewport</code> (scrolled into view), <code>on interaction</code> (click), <code>on idle</code> (browser is free), <code>on timer(2s)</code>, <code>when condition</code>.</p>
        <p>Real examples: charts, maps, video players, comments, reviews, anything below the fold.</p>
      </details>
    </div>

    <div class="box">
      <h2>Demo 2: The slow Like button (function in template)</h2>
      <div class="expect"><b>Expect:</b> both menus show the same 300 dishes. Clicking Like should be instant. On one side it is not.</div>
      <ol class="steps">
        <li>Red side: click <b>Like</b> 3 times. Watch the calls number and the time.</li>
        <li>Green side: click <b>Like</b> 3 times.</li>
      </ol>
      <div class="row">
        <div class="bad">
          <h3>{{ '{{' }} priceWithTax(dish) {{ '}}' }}</h3>
          <app-menu-slow />
        </div>
        <div class="good">
          <h3>{{ '{{' }} row.withTax {{ '}}' }}</h3>
          <app-menu-fast />
        </div>
      </div>
      <p class="muted">Both menus are OnPush, so a click on one side does not check the other side.</p>
      <details class="conclude">
        <summary>Conclusion (open after the demo)</summary>
        <p>A function called in the template runs on <b>every</b> change detection, for every row. The Like button has nothing to do with prices, but it still paid for 300 price calculations.</p>
        <p>Fix: calculate once and keep the result: a field, a <b>computed()</b> signal, or a <b>pure pipe</b>.</p>
      </details>
    </div>

    <div class="box">
      <h2>Demo 3: Find the slow function yourself</h2>
      <div class="expect"><b>Expect:</b> the browser will tell us the name of the slow function. No guessing.</div>
      <div class="row">
        <div>
          <h3>Chrome Performance tab</h3>
          <ol class="steps">
            <li>F12, open the <b>Performance</b> tab, click <b>Record</b>.</li>
            <li>Click <b>Like</b> on the red menu 2 times. Click <b>Stop</b>.</li>
            <li>In the Main track, find the blocks with a <b>red corner</b> (long tasks). Click one.</li>
            <li>Open <b>Bottom-Up</b>, sort by <b>Self Time</b>. <code>priceWithTax</code> is at the top.</li>
            <li>Record the green menu the same way. No long task.</li>
          </ol>
        </div>
        <div>
          <h3>Angular DevTools</h3>
          <ol class="steps">
            <li>Install the "Angular DevTools" Chrome extension. F12, open the <b>Angular</b> tab.</li>
            <li><b>Profiler</b>, click <b>Start</b>. Click Like on both menus. Click <b>Stop</b>.</li>
            <li>Each bar is one change detection. Click the tall one: <code>MenuSlow</code> took the time.</li>
            <li>The <b>Components</b> tab shows the tree and the current values of each component.</li>
          </ol>
        </div>
      </div>
      <details class="conclude">
        <summary>Conclusion (open after the demo)</summary>
        <p><b>Chrome Performance</b> tells you <b>which function</b> is slow. <b>Angular DevTools</b> tells you <b>which component</b> is slow and how often it is checked.</p>
        <p>Order of work: measure first, fix the biggest thing, measure again.</p>
      </details>
    </div>
  `,
})
export default class PerformancePage {
  downloads = downloads;
  showEager = false;
}
