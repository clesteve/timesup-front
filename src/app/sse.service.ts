import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class SSEService {

  constructor(private zone: NgZone) { }

  getEventSource(url: string): EventSource {
    return new EventSource(url);
  }

  getServerSentEvent(url: string) {

    return Observable.create(observer => {
      const eventSource = this.getEventSource(url);

      eventSource.onmessage = event => {
        this.zone.run(() => {
          observer.next(event);
        });
      };

      eventSource.onerror = error => {
        this.zone.run(() => {
          observer.error(error);
        });

      };

    });
  }

}
