const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

function validadeRepositoriesId(req, res, next) {
	const { id } = req.params;

	if ( !isUuid(id) )
		return res.status(400).json({error: 'Invalid repository ID.'});

	return next();
}

function isRepository(req, res, next) {
	const { id } = req.params;
	const repositoryIndex = repositories.findIndex(repository => repository.id === id);
	
	if (repositoryIndex < 0)
		return res.status(400).json({ error: 'Repository not found.' });
	
	res.locals.repositoryIndex = repositoryIndex;

	return next();
}

app.use('/repositories/:id', validadeRepositoriesId, isRepository);

const repositories = [];
// const repositories = require('./database');

app.get("/repositories", (req, res) => res.json(repositories));

app.post("/repositories", (req, res) => {
	const { title, url, techs } = req.body;

	const repository = {
		id: uuid(),
		title,
		url,
		techs,
		likes: 0
	}

	repositories.push(repository);

	return res.json(repository);
});

app.put("/repositories/:id", (req, res) => {
	const { id } = req.params;
	const { repositoryIndex } = res.locals;
	const { title, url, techs } = req.body;
	
	const likes = repositories[repositoryIndex].likes;

	const repository = {
		id,
		title,
		url,
		techs,
		likes
	};

	repositories[repositoryIndex] = repository;

	return res.json(repository);
});

app.delete("/repositories/:id", (req, res) => {
	const { repositoryIndex } = res.locals;

	repositories.splice(repositoryIndex, 1);

	return res.status(204).send('');
});

app.post("/repositories/:id/like", (req, res) => {
	const { repositoryIndex } = res.locals;

	const likes = repositories[repositoryIndex].likes += 1

	return res.json({likes});
});

module.exports = app;
