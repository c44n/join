import { Component, inject } from '@angular/core';
import { CdkMenuModule } from '@angular/cdk/menu';
import { ConnectedPosition } from '@angular/cdk/overlay';
import { Router, RouterModule } from '@angular/router';
import { SupabaseService } from '../../services/supabase';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CdkMenuModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  supabaseService = inject(SupabaseService);
  router = inject(Router);
  auth = inject(AuthService);

  readonly avatarMenuPositions: ConnectedPosition[] = [
    {
      originX: 'end',
      originY: 'bottom',
      overlayX: 'end',
      overlayY: 'top',
      offsetY: 8,
    },
    {
      originX: 'end',
      originY: 'top',
      overlayX: 'end',
      overlayY: 'bottom',
      offsetY: -8,
    },
  ];

async logout() {
  await this.supabaseService.supabase.auth.signOut();

  localStorage.setItem("guestUser", "signOut");
  this.auth.isGuestSignIn.set("signOut");
  
  this.router.navigateByUrl('');
}
}







