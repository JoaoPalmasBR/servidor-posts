const Fastify = require("fastify");
const { faker } = require("@faker-js/faker");

const fastify = Fastify({ logger: true });

// Porta dinâmica para Render
const PORT = process.env.PORT || 3000;

// Gerar 50 posts aleatórios
let posts = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  mensagem: faker.lorem.sentence(),
  usuario: faker.number.int({ min: 1, max: 10 }),
}));

// Rota para listar posts
fastify.get("/posts", async (request, reply) => {
  return posts;
});

// Rota para buscar um post por ID
fastify.get("/posts/:id", async (request, reply) => {
  const post = posts.find((p) => p.id === Number(request.params.id));
  return post ? post : reply.status(404).send({ error: "Post não encontrado" });
});

// Criar um novo post
fastify.post("/posts", async (request, reply) => {
  const { mensagem, usuario } = request.body;
  if (!mensagem || !usuario) {
    return reply.status(400).send({ error: "Mensagem e usuário são obrigatórios" });
  }
  const novoPost = { id: posts.length + 1, mensagem, usuario };
  posts.push(novoPost);
  return reply.status(201).send(novoPost);
});

// Iniciar o servidor
fastify.listen({ port: PORT, host: "0.0.0.0" }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
