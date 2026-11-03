# Final Session: Templates, RxJS and Performance

Last session (2 hours). Three topics that interviewers use to separate "I know Angular" from "I have built real screens".

```bash
npm install
npm start
```

Open http://localhost:4200. Each topic is one page in the top menu and one folder in `src/app/`.

`npm start` runs `ng serve --no-hmr`. With hot reload switched on, the dev server loads `@defer` code straight away, and the Performance page demo would not show the difference.

## How every page works

Every demo on every page has the same 4 parts:

1. **Expect** (yellow): what we are about to test. Guess the answer first.
2. **Steps**: 2 or 3 clicks.
3. **Red box vs green box**: the same feature, without and with the concept.
4. **Conclusion** (green, closed): open it only after you have answered.

## Plan

| Time | Part |
|------|------|
| 0:00 – 0:10 | Homework: the double-click on Pay |
| 0:10 – 0:30 | 1. viewChild, ng-content, ng-template |
| 0:30 – 0:55 | 2. RxJS operators |
| 0:55 – 1:05 | Break |
| 1:05 – 1:25 | 3. @defer and finding slow code |
| 1:25 – 2:00 | Final interview round |

---

## 1. viewChild, ng-content and ng-template (20 min)

> How do you build a component that the user of the component can fill and design?

| Tool | What it does | Real example |
|------|--------------|--------------|
| `viewChild('ref')` | the class gets an element or child component from its **own** template | focus a field, call `player.pause()` |
| `<ng-content select="[slot]">` | the parent's HTML goes inside the child | card, modal, tabs |
| `contentChild('ref')` | the child checks what the parent put inside | "no footer given" |
| `ng-template` + `ngTemplateOutlet` | a piece of HTML passed around and shown later | custom table rows |
| `ng-container` | a wrapper that adds no element to the page | holding `*ngTemplateOutlet` |

**Demos:** Templates page.
- **Demo 1, the OTP box:** after "Send OTP" only one side puts the cursor in the box.
- **Demo 2, one card, many uses:** a card built with `@Input` strings prints `<button>` as text. The ng-content card shows a real button.
- **Demo 3, same list, your design:** the same list component shows 3 designs, chosen by the page.

**Interview check:**
- viewChild vs contentChild?
- Why is a viewChild undefined in the constructor? Which hook is the first safe one?
- How do you make a card with a header slot and a footer slot?

---

## 2. RxJS operators (25 min)

> Every click or key press can start an HTTP call. What should happen when a new one starts before the old one has finished?

| Operator | New value while busy | Use for |
|----------|---------------------|---------|
| `switchMap` | cancel the old one | search, filters, dropdowns |
| `exhaustMap` | ignore the new one | Pay, Login, Submit |
| `concatMap` | wait in a queue | chat, saving in order |
| `mergeMap` | run both at the same time | independent uploads |
| `shareReplay(1)` | one request, shared by everyone | logged-in user, settings |

**Demos:** RxJS page. In every demo the red side uses `mergeMap` ("just do everything").
- **Demo 1, the search that shows the wrong results:** the box says "pizza", the results are for "p".
- **Demo 2, the double-click on Pay:** 3 clicks take Rs 1500 on one side and Rs 500 on the other.
- **Demo 3, the chat in the wrong order:** your friend reads your messages backwards.
- **Demo 4, the profile loaded twice:** the header and sidebar each ask the server.

**Interview check:**
- switchMap vs mergeMap vs concatMap vs exhaustMap, one real example each.
- How do you stop a user being charged twice?
- What is a cold Observable? What does shareReplay do?

---

## Break (10 min)

---

## 3. @defer and finding slow code (20 min)

> "The page feels slow" is not a bug report. Load less, run less, and find the exact function.

| Problem | Fix | How to find it |
|---------|-----|----------------|
| page downloads code nobody uses | `@defer (on viewport / interaction / idle)` | Network tab, JS filter |
| function called in the template | field, `computed()` or pure pipe | Performance tab, Bottom-Up |
| a component checked too often | OnPush, signals | Angular DevTools, Profiler |

**Demos:** Performance page.
- **Demo 1, the chart nobody opened:** both charts are hidden, but `@if` downloads the code with the page. `@defer` downloads it on the click.
- **Demo 2, the slow Like button:** a function in the template runs 300 times on every Like click.
- **Demo 3, find it yourself:** the Chrome Performance tab names the slow function; Angular DevTools names the slow component.

**Interview check:**
- What does @defer do? Name 3 triggers.
- Why is `{{ calculate(x) }}` in a template a problem? How do you fix it?
- A page is slow. Walk me through how you find the cause.

---

## Final interview round (35 min)

Answer each in 2 or 3 sentences, out loud, without looking at code.

1. Constructor vs ngOnInit. Where do you clean up a timer?
2. What does zone.js do? What does OnPush change?
3. Why do we need trackBy / `track`?
4. `@Input()` vs `input()`. What is `[(value)]`?
5. viewChild vs contentChild. What is ng-content for?
6. switchMap vs exhaustMap, one real example each.
7. How do you make a slow Angular page faster? Name 3 things.
8. Tell me about an Angular screen you built and one problem you solved in it.

The last question is always asked. Prepare a 1-minute answer from your own project.
