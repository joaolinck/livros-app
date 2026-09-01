import { Component, OnInit, computed, inject, signal } from "@angular/core";
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { FiltroLivros } from "../../components/filtro-livros/filtro-livros";
import { ListaLivros } from "../../components/lista-livros/lista-livros";
import { Livro, NovoLivro } from "../../models/livro";
import { LivrosService } from "../../services/livros.service";

@Component({
  selector: "app-livros-page",
  imports: [FiltroLivros, ListaLivros, ReactiveFormsModule],
  templateUrl: "./livros-page.html"
})
export class LivrosPage implements OnInit {
  private readonly livrosService = inject(LivrosService);
  private readonly formBuilder = inject(NonNullableFormBuilder);

  readonly livros = signal<Livro[]>([]);
  readonly pesquisa = signal("");
  readonly carregando = signal(false);
  readonly erro = signal<string | null>(null);
  readonly mostrandoFormulario = signal(false);
  readonly salvando = signal(false);
  readonly formulario = this.formBuilder.group({
    titulo: ["", Validators.required],
    quantidadePaginas: [0, [Validators.required, Validators.min(1)]],
    anoPublicacao: [new Date().getFullYear(), [Validators.required, Validators.min(0)]],
    nomeAutor: ["", Validators.required]
  });

  readonly livrosFiltrados = computed(() => {
    const termo = this.pesquisa().trim().toLowerCase();

    return this.livros().filter(livro => {
      const correspondeTexto =
        termo === "" ||
        livro.titulo.toLowerCase().includes(termo) ||
        livro.nomeAutor.toLowerCase().includes(termo);

      return correspondeTexto;
    });
  });

  ngOnInit(): void {
    void this.carregarLivros();
  }

  async carregarLivros(): Promise<void> {
    this.carregando.set(true);
    this.erro.set(null);
    try {
      const dados = await this.livrosService.listar();
      this.livros.set(dados);
    } catch {
      this.erro.set("Não foi possível carregar os livros.");
    } finally {
      this.carregando.set(false);
    }
  }

  atualizarPesquisa(valor: string): void {
    this.pesquisa.set(valor);
  }

  alternarFormulario(): void {
    this.mostrandoFormulario.update(mostrando => !mostrando);
  }

  async adicionarLivro(): Promise<void> {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.salvando.set(true);
    this.erro.set(null);
    try {
      await this.livrosService.adicionar(this.formulario.getRawValue() as NovoLivro);
      this.formulario.reset({
        titulo: "",
        quantidadePaginas: 0,
        anoPublicacao: new Date().getFullYear(),
        nomeAutor: ""
      });
      this.mostrandoFormulario.set(false);
      await this.carregarLivros();
    } catch {
      this.erro.set("Não foi possível criar o livro.");
    } finally {
      this.salvando.set(false);
    }
  }
}
