import { NgtArgs, NgtCanvas, injectLoader } from 'angular-three';
import { Experience } from './experience/experience.component';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Board } from './experience/board.component';
import { GLTFLoader } from 'three-stdlib';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, NgtCanvas],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent {

  protected sceneGraph = Board;
}
