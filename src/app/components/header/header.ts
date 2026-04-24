import { Component } from '@angular/core';
import { CdkMenuModule } from '@angular/cdk/menu';
import { ConnectedPosition } from '@angular/cdk/overlay';

@Component({
  selector: 'app-header',
  imports: [CdkMenuModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
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
}
