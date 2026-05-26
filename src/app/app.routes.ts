import { Routes } from '@angular/router';
import { AddTask } from './components/add-task/add-task';
import { ContactList } from './components/contact-list/contact-list';
import { Board } from './components/board/board';
import { LegalNoticeComponents } from './components/legal-notice-components/legal-notice-components';
import { PrivacyPolicyComponents } from './components/privacy-policy-components/privacy-policy-components';
import { SignUp } from './components/sign-up/sign-up';
import { MainLayout } from './layouts/main-layout/main-layout';
import { Help } from './components/help/help';
import { SignIn } from './components/sign-in/sign-in';
import { Summary } from './components/summary/summary';
import { authGuard, authGuestGuard, signInGuard } from './services/auth';

export const routes: Routes = [
  { path: '', component: SignIn, canActivate: [signInGuard], pathMatch: 'full' },
  { path: 'signup', component: SignUp },
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'summary' },
      { path: 'summary', component: Summary, canMatch: [authGuestGuard] },
      { path: 'summary', component: Summary, canMatch: [authGuard] },
      { path: 'add-task', component: AddTask, canMatch: [authGuard] },
      { path: 'board', component: Board, canMatch: [authGuestGuard] },
      { path: 'board', component: Board, canMatch: [authGuard] },
      { path: 'contacts', component: ContactList, canMatch: [authGuestGuard] },
      { path: 'contacts', component: ContactList, canMatch: [authGuard] },
      { path: 'legal-notice', component: LegalNoticeComponents, canMatch: [authGuestGuard] },
      { path: 'legal-notice', component: LegalNoticeComponents, canMatch: [authGuard] },
      { path: 'help', component: Help, canMatch: [authGuestGuard] },
      { path: 'help', component: Help, canMatch: [authGuard] },
      { path: 'privacy-policy', component: PrivacyPolicyComponents, canMatch: [authGuestGuard] },
      { path: 'privacy-policy', component: PrivacyPolicyComponents, canMatch: [authGuard] },
    ],
  },
  { path: '**', redirectTo: '/summary' },
];
