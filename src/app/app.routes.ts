import { Routes } from '@angular/router';
import { AddTask } from './components/add-task/add-task';
import { ContactList } from './components/contact-list/contact-list';

export const routes: Routes = [
  { path: 'add-task', component: AddTask },
  { path: 'contacts', component: ContactList },
];
