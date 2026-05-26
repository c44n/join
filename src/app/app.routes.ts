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
import { authGuard, signInGuard } from './services/auth';

export const routes: Routes = [
  { path: '', component: SignIn, canActivate: [signInGuard]},
  { path: 'signup', component: SignUp },
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'summary' },
      { path: 'summary', component: Summary, canMatch: [authGuard] },
      { path: 'add-task', component: AddTask, canMatch: [authGuard] },
      { path: 'board', component: Board, canMatch: [authGuard] },
      { path: 'contacts', component: ContactList, canMatch: [authGuard] },
      { path: 'help', component: Help },
      { path: 'legal-notice', component: LegalNoticeComponents },
      { path: 'privacy-policy', component: PrivacyPolicyComponents},
    ],
  },
  { path: '**', redirectTo: '/summary' },
];
