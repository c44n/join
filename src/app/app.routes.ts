import { Routes } from '@angular/router';
import { AddTask } from './components/add-task/add-task';
import { ContactList } from './components/contact-list/contact-list';
import { Board } from './components/board/board';
import { LegalNoticeComponents } from './components/legal-notice-components/legal-notice-components';
import { PrivacyPolicyComponents } from './components/privacy-policy-components/privacy-policy-components';
import { SignUp } from './components/sign-up/sign-up';
import { MainLayout } from './layouts/main-layout/main-layout';


export const routes: Routes = [
  { path: 'registration', component: SignUp },
  {
    path: '',
    component: MainLayout,
    children: [
      { path: 'add-task', component: AddTask },
      { path: 'contacts', component: ContactList },
      { path: 'board', component: Board },
      { path: 'privacy-policy', component: PrivacyPolicyComponents },
      { path: 'legal-notice', component: LegalNoticeComponents },
    ]
  }
];
