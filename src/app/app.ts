import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header>
      <b>Angular Final Session</b>
      <nav>
        <a routerLink="/templates" routerLinkActive="active">1. Templates</a>
        <a routerLink="/rxjs" routerLinkActive="active">2. RxJS</a>
        <a routerLink="/performance" routerLinkActive="active">3. Performance</a>
      </nav>
    </header>
    <main>
      <router-outlet />
    </main>
  `,
})
export class App { }
