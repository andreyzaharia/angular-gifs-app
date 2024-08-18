import { Component, ElementRef, ViewChild } from '@angular/core';
import { GifsService } from '../../services/gifs.service';

@Component({
  selector: 'gifs-search-box',
  template: `<h5>Buscar:</h5>
    <input
      type="text"
      class="form-control"
      placeholder="Buscar gifs.."
      (keyup.enter)="searchTag()"
      #txtTagInput
    /> `,
})
export class SearchBoxComponent {
  //tomas una ref local
  @ViewChild('txtTagInput') //solo 1, viewChildren un arreglo []
  //! non null operator, indico que siempre va a venir relleno
  public tagInput!: ElementRef<HTMLInputElement>;

  //inyeccion de dependencias
  constructor(private gifsService: GifsService) {}

  searchTag() {
    const newTag = this.tagInput.nativeElement.value;

    this.gifsService.searchTag(newTag);

    //limpiamos la busqueda
    this.tagInput.nativeElement.value = '';
  }
}
