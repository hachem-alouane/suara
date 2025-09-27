/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { INotification } from '../../core/models/notification.interface';

@Injectable({
  providedIn: 'root',
})
export class SseService {
  private readonly zone = inject(NgZone);
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.BO_V2 + 'api/bureau-v2';
  private readonly apiUrlAuth = environment.SEREVER_AUTH_V2 + 'api/bureau-v2';

  private readonly currentNotif$ = new BehaviorSubject<any>(null);

  get currentNotif() {
    return this.currentNotif$.asObservable();
  }

  changeCurrentNotif(notif: any) {
    this.currentNotif$.next(notif);
  }

  subscribeToNewEmail(email: string): Observable<string> {
    return new Observable<any>((observer) => {
      const eventSource = new EventSource(
        this.apiUrl + `/notifications/subscribe/${email}`
      );

      // Listen for your specific event: "new-email"
      eventSource.addEventListener('notification', (event: MessageEvent) => {
        // console.log('🚀 ~ SseService ~ subscribeToNewEmail ~ event:', event);
        this.zone.run(() => {
          console.log('Received SSE event:', event);
          const notif = JSON.parse(event.data);
          observer.next(notif);
        });
      });

      eventSource.onerror = (error) => {
        console.error('SSE error', error);
        eventSource.close();
        observer.error(error);
      };

      return () => {
        eventSource.close();
      };
    });
  }
  getNotificationById(id: number) {
    return this.http.get(this.apiUrlAuth + `/notifications/${id}`);
  }
  loadHistory() {
    return this.http.get<INotification[]>(
      this.apiUrlAuth + `/notifications/history`
    );
  }
  markAllAsRead() {
    return this.http.post(
      this.apiUrlAuth + `/notifications/notifications/mark-all-read`,
      {}
    );
  }
}
