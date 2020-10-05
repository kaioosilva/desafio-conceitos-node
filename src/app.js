const express = require("express");
const cors = require("cors");

const { v4: uuid, } = require('uuid');
const { isUuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryId(request, response, next) {
  const { id } = request.params;

  if(!isUuid(id)) {
    return response.status(400).json({ error: 'Repository Id not valid'});
  }

  return next();
}

app.use("/repositories/:id", validateRepositoryId);

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title: title,
    url: url,
    techs: techs,
    likes: 0
  }

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found. Enter a new ID, please!"});
  }

  let newArrayRepositories = {}
  repositories.map((repo, index) => {
    if(index == repositoryIndex) {
      newArrayRepositories = {
        id: repo.id,
        title: title,
        url: url,
        techs: techs,
        likes: repo.likes
      }
    }
  });

  repositories[repositoryIndex] = newArrayRepositories;

  return response.json(newArrayRepositories);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found. Enter a new ID, please!"});
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found. Enter a new ID, please!"});
  }

  let newArrayRepositories = {}
  repositories.map((repo, index) => {
    if(index == repositoryIndex) {
      newArrayRepositories = {
        id: repo.id,
        title: repo.title,
        url: repo.url,
        techs: repo.techs,
        likes: repo.likes + 1
      }
    }
  });

  repositories[repositoryIndex] = newArrayRepositories;
  return response.json(newArrayRepositories);

});

module.exports = app;
