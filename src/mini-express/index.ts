import http from 'http'; // Importa o módulo HTTP nativo do

type RequestHandler = (req: http.IncomingMessage, res: http.ServerResponse, next: () => void) => void;
// Define o tipo RequestHandler, que é uma função que recebe um objeto de solicitação (req), um objeto de resposta (res),

// e um callback opcional `next` que, quando chamado, passa
export class MiniExpress {
    private middlewares: RequestHandler[] = []; // Um array para armazenar todos os middlewares registrados.
    // Método para registrar um middleware.
    use(handler: RequestHandler) {
        // Adiciona a função middleware ao array middlewares.
        // Quando `this.middlewares.push(handler);` é chamado, estamos simplesmente armazenando a função `handler`
        // no array `middlewares` para que possa ser chamada posteriormente, durante o processamento de uma solicitação.
        this.middlewares.push(handler);
    }
    // Método para iniciar o servidor e começar a ouvir em uma porta específica.
    listen(port: number, callback?: () => void) {
        // Cria um servidor HTTP e define o comportamento ao receber uma solicitação.
        const server = http.createServer((req, res) => {
            let idx = 0; // Inicializa o índice para rastrear qual middleware está sendo executado.
            // Função interna `next` para avançar para o próximo middleware na cadeia.
            const next = () => {
                // Se o índice atual for menor que o número total de middlewares registrados...
                if (idx < this.middlewares.length) {
                    // Obtém o próximo middleware da lista.
                    const handler = this.middlewares[idx++];
                    // Chama o middleware atual, passando req, res e a própria função next.
                    handler(req, res, next);
                } else {
                    // Se não houver mais middlewares, encerra a resposta.
                    res.end();
                }
            };
            // Inicia a execução do primeiro middleware.
            next();
        });
        // Inicia o servidor na porta especificada e, se um callback for fornecido, ele será chamado assim que o servidor começar a escutar.
        server.listen(port, callback);
    }
}