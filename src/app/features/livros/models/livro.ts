export interface Livro {
    id: number;
    titulo: string;
    quantidadePaginas: number;
    anoPublicacao: number;
    nomeAutor: string;
    criadoEm: string;
}

export type NovoLivro = Omit<Livro, "id" | "criadoEm">;