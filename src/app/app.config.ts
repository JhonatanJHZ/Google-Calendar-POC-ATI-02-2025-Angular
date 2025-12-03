import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideOAuthClient } from 'angular-oauth2-oidc';

/**
 * Los proveedores de la aplicación definen todos los módulos y servicios globales
 * necesarios para la aplicación Standalone.
 * Reemplazan la sección 'imports' del AppModule tradicional.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    // Habilita el HttpClient con interceptores (necesario para que OAuth pueda inyectar el token)
    provideHttpClient(withInterceptorsFromDi()),

    // Habilita la inyección y configuración del cliente OAuth
    // El interceptor automáticamente adjuntará el token a las peticiones configuradas
    provideOAuthClient({
      resourceServer: {
        allowedUrls: ['https://www.googleapis.com'],
        sendAccessToken: true,
      },
    }),
  ],
};
