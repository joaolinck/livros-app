import { Component, input, output } from "@angular/core";

@Component({
  selector: "app-filtro-livros",
  standalone: true,
  templateUrl: "./filtro-livros.html",
  styleUrl: "./filtro-livros.css"
})
export class FiltroLivros {
  pesquisa = input.required<string>();
  pesquisaChange = output<string>();

  alterarPesquisa(event: Event): void {
    const valor = (event.target as HTMLInputElement).value;
    this.pesquisaChange.emit(valor);
  }
}