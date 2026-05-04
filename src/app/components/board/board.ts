import { Component } from '@angular/core';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';


@Component({
  selector: 'app-board',
  imports: [MatProgressBarModule, CdkMenuTrigger, CdkMenu, CdkMenuItem],
  templateUrl: './board.html',
  styleUrl: './board.scss',
})
export class Board {}
