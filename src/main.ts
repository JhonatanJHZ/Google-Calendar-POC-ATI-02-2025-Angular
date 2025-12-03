import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
// Importamos el componente de calendario corregido
import { AppComponent } from './app/app.component';

// Iniciamos la aplicación con el componente AppComponent
bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
