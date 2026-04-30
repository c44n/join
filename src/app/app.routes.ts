import { Routes } from '@angular/router';
import { ContactList } from './components/contact-list/contact-list';
import { Task } from './components/task/task';

export const routes: Routes = [
  { path: 'contacts', component: ContactList },
  { path: 'task', component: Task },
];
