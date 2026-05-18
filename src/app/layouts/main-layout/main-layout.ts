import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Header } from '../../components/header/header';
import { Toast } from '../../components/toast/toast';

@Component({
    selector: 'app-main-layout',
    imports: [RouterOutlet, Sidebar, Header],
    templateUrl: './main-layout.html',
    styleUrl: './main-layout.scss',
})
export class MainLayout {
    protected readonly title = signal('join');
}
