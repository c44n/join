import { Routes } from '@angular/router';
import { AddTask } from './components/add-task/add-task';
import { ContactList } from './components/contact-list/contact-list';
import { Board } from './components/board/board';

export const routes: Routes = [
  { path: 'add-task', component: AddTask },
  { path: 'contacts', component: ContactList },
  { path: 'board', component: Board },
];
