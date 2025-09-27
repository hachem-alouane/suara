import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { map, Observable } from 'rxjs';
import {
  ICourrier,
  IStatCourrierPriorite,
  IStatDemandePriorite,
  IStatutDemandeCount,
} from '../../core/models/statistics-courrier';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.SEREVER_AUTH_V2;
  authUrl = environment.SEREVER_AUTH_V2 + 'api/auth-v2/user-statistics/';
  getTotalMembers() {
    return this.http
      .get<{ Value: number }>(
        `${this.apiUrl}api/ref-v2/statistics/members/total`
      )
      .pipe(map((res) => res.Value));
  }
  getTotalGroups() {
    return this.http
      .get<{ Value: number }>(`${this.apiUrl}api/ref-v2/statistics/group/total`)
      .pipe(map((res) => res.Value));
  }
  getTotalOrganizations() {
    return this.http
      .get<{ Value: number }>(
        `${this.apiUrl}api/ref-v2/statistics/organizations/total`
      )
      .pipe(map((res) => res.Value));
  }
  getTotalSubOrganizations() {
    return this.http
      .get<{ Value: number }>(
        `${this.apiUrl}api/ref-v2/statistics/sous-organizations/total`
      )
      .pipe(map((res) => res.Value));
  }
  getTotalCountries() {
    return this.http
      .get<{ Value: number }>(`${this.apiUrl}api/ref-v2/statistics/pays/total`)
      .pipe(map((res) => res.Value));
  }
  getTotalUsers() {
    return this.http
      .get<{ Value: number }>(`${this.authUrl}users/total`)
      .pipe(map((res) => res.Value));
  }
  getStatCourrierPeriode(
    dateDebut: string,
    dateFin: string
  ): Observable<ICourrier[]> {
    let params = new HttpParams();
    if (dateDebut && dateFin) {
      params = params.set(
        'dateDebut',
        this.formatDateLocal(new Date(dateDebut))
      );
      params = params.set('dateFin', this.formatDateLocal(new Date(dateFin)));
    }

    return this.http.get<ICourrier[]>(
      this.apiUrl + 'api/bureau-v2/statistiques/courriers/etat/periode',
      { params }
    );
  }
  private formatDateLocal(date: Date): string {
    const y = date.getFullYear();
    const m = `${date.getMonth() + 1}`.padStart(2, '0');
    const d = `${date.getDate()}`.padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  getStatCourrierSemaine(): Observable<ICourrier[]> {
    return this.http.get<ICourrier[]>(
      this.apiUrl + 'api/bureau-v2/statistiques/courriers/etat/semaine'
    );
  }
  getStatCourrierMois(): Observable<ICourrier[]> {
    return this.http.get<ICourrier[]>(
      this.apiUrl + 'api/bureau-v2/statistiques/courriers/etat/mois'
    );
  }
  getStatCourrierAnnee(): Observable<ICourrier[]> {
    return this.http.get<ICourrier[]>(
      this.apiUrl + 'api/bureau-v2/statistiques/courriers/etat/annee'
    );
  }

  getDemandePrioreteSemaine(
    priorite: string,
    statut: string,
    typeDemande: string
  ): Observable<ICourrier[]> {
    const params = new HttpParams()
      .set('priorite', priorite)
      .set('typeDemande', typeDemande)
      .set('statut', statut);
    return this.http.get<ICourrier[]>(
      this.apiUrl +
        'api/bureau-v2/statistiques/demandes/priorite/type-demande/semaine',
      { params }
    );
  }

  getDemandePrioretePeriode(
    priorite: string,
    statut: string,
    typeDemande: string,
    dateDebut: string,
    dateFin: string
  ): Observable<ICourrier[]> {
    const params = new HttpParams()
      .set('dateDebut', dateDebut)
      .set('dateFin', dateFin)
      .set('typeDemande', typeDemande)
      .set('priorite', priorite)
      .set('statut', statut);
    return this.http.get<ICourrier[]>(
      this.apiUrl +
        'api/bureau-v2/statistiques/demandes/priorite/type-demande/periode',
      { params }
    );
  }

  getDemandePrioreteAnnee(
    priorite: string,
    statut: string,
    typeDemande: string
  ): Observable<ICourrier[]> {
    const params = new HttpParams()
      .set('priorite', priorite)
      .set('statut', statut)
      .set('typeDemande', typeDemande);
    return this.http.get<ICourrier[]>(
      this.apiUrl +
        'api/bureau-v2/statistiques/demandes/priorite/type-demande/annee',
      { params }
    );
  }

  getDemandePrioreteMois(
    priorite: string,
    statut: string,
    typeDemande: string
  ): Observable<ICourrier[]> {
    const params = new HttpParams()
      .set('priorite', priorite)
      .set('statut', statut)
      .set('typeDemande', typeDemande);
    return this.http.get<ICourrier[]>(
      this.apiUrl +
        'api/bureau-v2/statistiques/demandes/priorite/type-demande/mois',
      { params }
    );
  }

  getDemandePrioretesSemaine(
    priorite: string,
    statut: string
  ): Observable<ICourrier[]> {
    const params = new HttpParams()
      .set('priorite', priorite)
      .set('statut', statut);
    return this.http.get<ICourrier[]>(
      this.apiUrl + 'api/bureau-v2/statistiques/demandes/priorite/semaine',
      { params }
    );
  }

  getDemandePrioretesPeriode(
    priorite: string,
    statut: string,
    dateDebut: string,
    dateFin: string
  ): Observable<ICourrier[]> {
    const params = new HttpParams()
      .set('priorite', priorite)
      .set('statut', statut)
      .set('dateDebut', dateDebut)
      .set('dateFin', dateFin);

    return this.http.get<ICourrier[]>(
      this.apiUrl + 'api/bureau-v2/statistiques/demandes/priorite/periode',
      { params }
    );
  }
  getDemandePrioretesMois(
    priorite: string,
    statut: string
  ): Observable<ICourrier[]> {
    const params = new HttpParams()
      .set('priorite', priorite)
      .set('statut', statut);
    return this.http.get<ICourrier[]>(
      this.apiUrl + 'api/bureau-v2/statistiques/demandes/priorite/mois',
      { params }
    );
  }

  getDemandePrioretesAnnee(
    priorite: string,
    statut: string
  ): Observable<ICourrier[]> {
    const params = new HttpParams()
      .set('priorite', priorite)
      .set('statut', statut);
    return this.http.get<ICourrier[]>(
      this.apiUrl + 'api/bureau-v2/statistiques/demandes/priorite/annee',
      { params }
    );
  }
  getStatCourrierPriorite(
    periode?: 'semaine' | 'mois' | 'annee',
    dateDebut?: string,
    dateFin?: string,
    etat?: string,
    sens?: string
  ): Observable<IStatCourrierPriorite[]> {
    let params = new HttpParams();

    if (periode) {
      params = params.set('periode', periode);
    }
    if (dateDebut) {
      params = params.set(
        'dateDebut',
        this.formatDateLocal(new Date(dateDebut))
      );
    }
    if (dateFin) {
      params = params.set('dateFin', this.formatDateLocal(new Date(dateFin)));
    }
    if (etat) {
      params = params.set('etat', etat);
    }
    if (sens) {
      params = params.set('sens', sens);
    }

    return this.http.get<IStatCourrierPriorite[]>(
      this.apiUrl +
        'api/bureau-v2/statistiques/courriers/priorite/nouvelle-approche',
      { params }
    );
  }

  getStatDemandePriorite(
    periode?: 'semaine' | 'mois' | 'annee',
    dateDebut?: string,
    dateFin?: string,
    typeDemande?: string
  ): Observable<IStatDemandePriorite[]> {
    let params = new HttpParams();

    if (periode) {
      params = params.set('periode', periode);
    }
    if (dateDebut) {
      params = params.set(
        'dateDebut',
        this.formatDateLocal(new Date(dateDebut))
      );
    }
    if (dateFin) {
      params = params.set('dateFin', this.formatDateLocal(new Date(dateFin)));
    }
    if (typeDemande) {
      params = params.set('typeDemande', typeDemande);
    }

    return this.http.get<IStatDemandePriorite[]>(
      this.apiUrl + 'api/bureau-v2/statistiques/demandes/nouvelle-approche',
      { params }
    );
  }

  getStatutDemandeCount(
    period?: 'week' | 'month' | 'year' | 'custom',
    typeDemande?: string,
    startDate?: string,
    endDate?: string
  ): Observable<IStatutDemandeCount[]> {
    let params = new HttpParams();

    if (typeDemande) {
      params = params.set('typeDemande', typeDemande);
    }
    if (period) {
      params = params.set('period', period);
    }
    if (startDate) {
      params = params.set(
        'startDate',
        this.formatDateLocal(new Date(startDate))
      );
    }
    if (endDate) {
      params = params.set('endDate', this.formatDateLocal(new Date(endDate)));
    }

    return this.http.get<IStatutDemandeCount[]>(
      this.apiUrl + 'api/bureau-v2/statistiques/demandes/statuts/count',
      { params }
    );
  }
}
