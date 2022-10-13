import './style.scss';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { ajax } from 'rxjs/ajax';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { tap } from 'rxjs/internal/operators/tap';
import { catchError } from 'rxjs/internal/operators/catchError';
import { EMPTY } from 'rxjs/internal/observable/empty';
import { filter } from 'rxjs/internal/operators/filter';

const search = document.getElementById('search');
const result = document.getElementById('result');

const url = 'https://api.github.com/search/users?q=';

const stream$ = fromEvent(search, 'input').pipe(
  debounceTime(1000),
  map((el) => el.target.value),
  distinctUntilChanged(),
  tap(() => (result.innerHTML = '')),
  filter((value) => value.trim()),
  switchMap((value) =>
    ajax.getJSON(`${url}${value}`).pipe(catchError((error) => EMPTY))
  ),
  map((response) => response.items),
  mergeMap((items) => items)
);

stream$.subscribe((user) => {
  console.log(user);
  const html = `
    <div class="card">
      <div class="card-image">
        <img src="${user.avatar_url}" />
        </div>
        <div class="card-content">
        <span class="card-title">Login: ${user.login}</span>
        <p>ID: ${user.id}<p>
        </div>
      <div class="card-action">
        <a href="${user.html_url}" target="_blank">Open github</a>
      </div>
    </div>
    <div class="divider"></div>
  `;
  result.insertAdjacentHTML('beforeend', html);
});
