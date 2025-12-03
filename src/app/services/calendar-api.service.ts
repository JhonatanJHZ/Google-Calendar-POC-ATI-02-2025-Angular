import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';
import { Observable, BehaviorSubject } from 'rxjs'; // Importamos BehaviorSubject
import { filter } from 'rxjs/operators'; // Importamos filter

@Injectable({
  providedIn: 'root',
})
export class CalendarApiService {
  private readonly API_BASE_URL = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';

  private _isAuthenticated = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this._isAuthenticated.asObservable();
  private authConfig: AuthConfig = {
    issuer: 'https://accounts.google.com',

    clientId: '55213476512-ookglmnsmgpteruo4skd6hdnc15smfdp.apps.googleusercontent.com',

    responseType: 'token',

    scope: 'openid profile email https://www.googleapis.com/auth/calendar.readonly',

    redirectUri: window.location.origin,

    oidc: false,

    showDebugInformation: true,
    strictDiscoveryDocumentValidation: false,
  };

  constructor(private http: HttpClient, private oauthService: OAuthService) {
    this.configureOAuth();
  }

  /**
   * Configura el servicio OAuth, procesa el token y configura la detección de estado.
   */
  private configureOAuth(): void {
    this.oauthService.configure(this.authConfig);
    this.oauthService.setupAutomaticSilentRefresh();

    this.oauthService
      .loadDiscoveryDocumentAndTryLogin()
      .then(() => {
        console.log('Discovery document loaded and tryLogin completed.');
        console.log('Has valid access token:', this.oauthService.hasValidAccessToken());
        console.log('Identity claims:', this.oauthService.getIdentityClaims());
        console.log('Access token:', this.oauthService.getAccessToken());

        this.updateAuthStatus();
      })
      .catch((err) => console.error('Error al configurar OAuth:', err));
    this.oauthService.events
      .pipe(filter((e) => e.type === 'token_received' || e.type === 'token_refreshed'))
      .subscribe(() => {
        console.log('Token received or refreshed!');
        this.updateAuthStatus();
      });

    this.oauthService.events
      .pipe(filter((e) => e.type === 'session_terminated' || e.type === 'logout'))
      .subscribe(() => {
        console.log('Session terminated or logout');
        this._isAuthenticated.next(false);
      });
  }

  public getEvents(): Observable<any> {
    const now = new Date().toISOString();

    const params = {
      orderBy: 'startTime',
      singleEvents: 'true',
      timeMin: now,
      maxResults: '10',
    };

    return this.http.get(this.API_BASE_URL, { params: params });
  }

  private updateAuthStatus(): void {
    const isAuth = this.oauthService.hasValidAccessToken();
    console.log('🔄 Updating auth status to:', isAuth);
    this._isAuthenticated.next(isAuth);
  }

  public login(): void {
    this.oauthService.initLoginFlow();
  }

  public logout(): void {
    this.oauthService.logOut();
  }

  public isAuthenticated(): boolean {
    return this._isAuthenticated.value;
  }
}
