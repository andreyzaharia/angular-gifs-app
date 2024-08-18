import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

@Injectable({
  providedIn: 'root', //hace disponible a toda la aplicacion, sino habria que importar en el gifs.module en providers:[]
})
export class GifsService {
  public gifList: Gif[] = [];

  private _tagsHistory: string[] = [];
  private GIPHY_API_KEY: string = 'ZWomYLJqOW8RrgzUIY75UQPjNk5nb8i9';
  private serviceUrl: string = 'https://api.giphy.com/v1/gifs/search';

  constructor(private http: HttpClient) {
    this.loadLocalStorage();
  }

  get tagsHistory() {
    //operador spread
    return [...this._tagsHistory];
  }

  public searchTag(tag: string): void {
    //valida no recibir una busqueda vacia
    if (tag.length === 0) return;
    this.organizeHistory(tag);

    const params = new HttpParams()
      .set('api_key', this.GIPHY_API_KEY)
      .set('limit', '10')
      .set('q', tag);

    this.http
      .get<SearchResponse>(this.serviceUrl, { params })
      .subscribe((resp) => {
        this.gifList = resp.data;
      });
  }

  private organizeHistory(tag: string) {
    tag = tag.toLowerCase();

    if (this._tagsHistory.includes(tag)) {
      //solo regresa los elementos no repetidos
      this._tagsHistory = this._tagsHistory.filter((oldTag) => oldTag !== tag);
    }

    //insertta los elementos al 1º
    this._tagsHistory.unshift(tag);
    this._tagsHistory = this._tagsHistory.splice(0, 10);

    this.saveLocalStorage();
  }

  private loadLocalStorage(): void {
    if (!localStorage.getItem('history')) return;

    this._tagsHistory = JSON.parse(localStorage.getItem('history')!);

    if (this._tagsHistory.length === 0) return;

    this.searchTag(this._tagsHistory[0]);
  }

  private saveLocalStorage(): void {
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }
}
