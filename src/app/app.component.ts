import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { CalendarApiService } from './services/calendar-api.service';

// Estilos integrados para mejorar la apariencia (asumiendo que app.component.css está ausente)
const STYLES = `
  :host {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    font-family: 'Arial', sans-serif;
    background-color: #f4f4f9;
    min-height: 100vh;
  }
  h1 {
    color: #4285f4;
    margin-bottom: 2rem;
    font-size: 2.5rem;
  }
  button {
    background-color: #0f9d58;
    color: white;
    border: none;
    padding: 10px 20px;
    margin: 5px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  button:hover {
    background-color: #0b7f43;
  }
  ul {
    list-style: none;
    padding: 0;
    margin-top: 2rem;
    width: 100%;
    max-width: 600px;
  }
  li {
    background-color: white;
    border-left: 5px solid #4285f4;
    padding: 15px;
    margin-bottom: 10px;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
`;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, DatePipe],
  template: `
    <div>
      <h1>🗓️ Mi Aplicación de Google Calendar en Angular</h1>
      <p class="text-sm text-gray-500">
        Estado de la Conexión:
        {{ (calendarApi.isAuthenticated$ | async) ? 'Conectado ✅' : 'Desconectado ❌' }}
      </p>

      <!-- Usando el control de flujo nativo @if con async pipe -->
      @if (!(calendarApi.isAuthenticated$ | async)) {
      <div>
        <button (click)="login()">Iniciar Sesión con Google</button>
      </div>
      }

      <!-- Usando el control de flujo nativo @if con async pipe -->
      @if (calendarApi.isAuthenticated$ | async) {
      <div>
        <button (click)="loadEvents()">Cargar Eventos</button>
        <button (click)="logout()">Cerrar Sesión</button>

        <!-- Usando el control de flujo nativo @if y @for -->
        @if (events && events.length > 0) {
        <div style="margin-top: 1rem;">
          <h3>📅 Eventos Próximos ({{ events.length }})</h3>
          <ul>
            @for (event of events; track event.id || $index) {
            <li>
              <strong>{{ event.summary }}</strong>
              <br />
              <small
                >📆 Inicio: {{ event.start.dateTime || event.start.date | date : 'full' }}</small
              >
              <br />
              @if (event.description) {
              <small>📝 {{ event.description }}</small>
              <br />
              } @if (event.organizer) {
              <small
                >👤 Organizador: {{ event.organizer.email || event.organizer.displayName }}</small
              >
              <br />
              }
              <small style="color: #888;">🆔 ID: {{ event.id }}</small>
            </li>
            }
          </ul>
        </div>
        } @else {
        <p>No hay eventos próximos.</p>
        }
      </div>
      }
    </div>
  `,
  styles: [STYLES],
})
export class AppComponent implements OnInit {
  events: any[] = [];

  constructor(public calendarApi: CalendarApiService) {}

  ngOnInit(): void {}

  public login(): void {
    this.calendarApi.login();
  }

  public logout(): void {
    this.calendarApi.logout();
  }

  public loadEvents(): void {
    this.calendarApi.getEvents().subscribe({
      next: (response: any) => {
        console.log('📋 Eventos recibidos:', response.items);
        this.events = response.items || [];
      },
      error: (err: any) => {
        console.error('Error al cargar eventos:', err);
        if (err instanceof HttpErrorResponse && err.status === 401) {
          console.log('Token no autorizado, forzando logout.');
          this.logout();
        }
      },
    });
  }
}
