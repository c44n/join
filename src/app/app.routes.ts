import { Routes } from '@angular/router';
import { AddTask } from './components/add-task/add-task';
import { ContactList } from './components/contact-list/contact-list';
import { Board } from './components/board/board';
import { BoardHeader } from './components/board-header/board-header';

export const routes: Routes = [
  { path: 'add-task', component: AddTask },
  { path: 'contacts', component: ContactList },
  { path: 'board', component: Board },
  { path: 'board_header', component: BoardHeader },
];
