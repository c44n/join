import { Routes } from '@angular/router';
import { ContactList } from './components/contact-list/contact-list';
import { Board } from './components/board/board';

export const routes: Routes = [
  { path: 'contacts', component: ContactList },
  { path: 'board', component: Board },
];