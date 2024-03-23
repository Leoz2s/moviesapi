const AppError = require("../utils/AppError.js");

const sqliteConnection = require("../database/sqlite");
const knex = require("../database/knex");

class MoviesController {
  async create(request, response) {
    const user_id = request.user.id;
    const {title, description, rating, tags} = request.body;

    const database = await sqliteConnection();

    if(!title && (description || rating || tags)) {
      throw new AppError("Title is obligatory to register a movie.");
    }else if(title) {
      const checkMovieExists = await database.get("SELECT title FROM movies WHERE user_id = ? AND title = ?", [user_id, title]);
      if(checkMovieExists) {
        throw new AppError("Movie already registered.");
      };
    };
    
    // await database.run(`
    //   INSERT INTO movies (title, description, rating, user_id) VALUES (?, ?, ?, ?)`, [title, description, rating, user_id]);
    const [movie_id] = await knex("movies").insert({
      title, description, rating, user_id
    });

    if(tags == true) {
      const tagsInsert = tags.map(name => {
        return {
          movie_id,
          user_id,
          name
        };
      });

      await knex("tags").insert(tagsInsert);
    };

    response.status(201).json({title, description, rating, tags, user_id});
  };

  async show(request, response) {
    const {movie_id} = request.params;

    const movie = await knex("movies").where({id: movie_id}).first();
    const tags = await knex("tags").where({movie_id}).orderBy("name");

    return response.status(200).json({...movie, tags});
  };

  async index(request, response) {
    const user_id = request.user.id;
    const {title, tags} = request.query;

    let movies;

    if(tags) {
      const filteredTags = tags.split(',').map(tag => tag.trim());

      movies = await knex("tags")
        .select([
          "movies.id",
          "movies.title",
          "movies.user_id",
        ])
        .where("movies.user_id", user_id)
        .whereLike("movies.title", `%${title}%`)
        .whereIn("name", filteredTags)
        .innerJoin("movies", "movies.id", "tags.movie_id")
        .groupBy("movies.id")
        .orderBy("movies.title");
        // Repetition of movies shown because a movie has multiple tags.

    }else if(title) {
      // const movies = await database.get("SELECT * FROM movies WHERE user_id = ?", [user_id]);
      movies = await knex("movies")
        .where({user_id})
        .whereLike("title", `%${title}%`)
        .orderBy("title");
    }else {
      movies = await knex("movies")
        .where({user_id})
        .orderBy("title")
    };

    const userTags = await knex("tags").where({user_id});
    const moviesWithTags = movies.map(movie => {
      const movieTags = userTags.filter(tag => tag.movie_id === movie.id);

      return {
        ...movie,
        tags: movieTags,
      };
    });

    return response.status(200).json(moviesWithTags);
  };

  async delete(request, response) {
    const {movie_id} = request.params;

    await knex("movies").where({id: movie_id}).delete();

    return response.status(200).json(`Movie of ID ${movie_id} was deleted successfully.`);
  };
};

module.exports = MoviesController;