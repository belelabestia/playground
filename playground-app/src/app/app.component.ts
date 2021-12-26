import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  text = "";
  loading = false;
  error = false;
  lastRequest = {};

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.setLoading();
    this.fetchText();
  }

  fetchText(): void {
    this.http.get(
      "/api/",
      { responseType: "text" })
      .subscribe({
        next: (val: string) => this.setText(val),
        error: () => this.setError()
      });
  }

  saveText(value: string): void {
    const thisRequest = this.lastRequest = {};

    timer(500)
      .subscribe(() => {
        if (this.lastRequest != thisRequest)
          return;

        this.http.post("/api/", { value })
          .subscribe({ error: () => this.setError() });
      });
  }

  init(): void {
    this.setLoading();

    this.http.post("/api/init", null)
      .subscribe({
        next: () => this.fetchText(),
        error: () => this.setError()
      });
  }

  setLoading(): void {
    this.error = false;
    this.loading = true;
  }

  setError(): void {
    this.error = true;
    this.loading = false;
    this.text = "";
  }

  setText(val: string): void {
    this.loading = false;
    this.error = false;
    this.text = val;
  }
}
