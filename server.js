const Fastify = require("fastify");
const { faker } = require("@faker-js/faker");

const fastify = Fastify({ logger: true });
const PORT = 3000;

// Gerar dados aleatórios
let posts = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  mensagem: faker.lorem.sentence(),
  usuario: faker.number.int({ min: 1, max: 10 }),
}));

// 🔹 Listar todas as publicações
fastify.get("/posts", async (request, reply) => {
  return posts;
});

// 🔹 Buscar uma publicação por ID
fastify.get("/posts/:id", async (request, reply) => {
  const post = posts.find((p) => p.id === Number(request.params.id));
  return post ? post : reply.status(404).send({ error: "Post não encontrado" });
});

// 🔹 Criar uma nova publicação
fastify.post("/posts", async (request, reply) => {
  const { mensagem, usuario } = request.body;
  if (!mensagem || !usuario) {
    return reply.status(400).send({ error: "Mensagem e usuário são obrigatórios" });
  }

  const novoPost = { id: posts.length + 1, mensagem, usuario };
  posts.push(novoPost);
  return reply.status(201).send(novoPost);
});

// 🔹 Atualizar uma publicação por ID
fastify.put("/posts/:id", async (request, reply) => {
  const { mensagem, usuario } = request.body;
  const postIndex = posts.findIndex((p) => p.id === Number(request.params.id));

  if (postIndex === -1) {
    return reply.status(404).send({ error: "Post não encontrado" });
  }

  posts[postIndex] = { ...posts[postIndex], mensagem, usuario };
  return posts[postIndex];
});

// 🔹 Excluir uma publicação por ID
fastify.delete("/posts/:id", async (request, reply) => {
  const postIndex = posts.findIndex((p) => p.id === Number(request.params.id));

  if (postIndex === -1) {
    return reply.status(404).send({ error: "Post não encontrado" });
  }

  const [deletedPost] = posts.splice(postIndex, 1);
  return { message: "Post excluído", deletedPost };
});

// Iniciar o servidor
fastify.listen({ port: PORT }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
