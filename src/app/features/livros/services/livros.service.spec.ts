import { LivrosService } from "./livros.service";

describe("LivrosService", () => {
    it("adiciona um novo livro à lista", async () => {
        const service = new LivrosService();

        const livro = await service.adicionar({
            titulo: "Dom Casmurro",
            quantidadePaginas: 256,
            anoPublicacao: 1899,
            nomeAutor: "Machado de Assis"
        });

        const livros = await service.listar();
        expect(livros).toContainEqual(livro);
    });
});