const knex = require("../database/knex");

class TagsController {
  async show(request, response) {
    const {movie_id} = request.params;

    const movieTags = await knex("tags").where({movie_id});

    return response.status(200).json(movieTags);
  };

  async index(request, response) {
    const {user_id, filter_tags} = request.query;

    let userTags;

    if(filter_tags) {
      const filteredTags = filter_tags.split(',').map(tag => tag.trim());

      userTags = await knex("tags").where({user_id}).whereIn("name", filteredTags);
    }else {
      userTags = await knex("tags").where({user_id});
    };

    return response.status(200).json(userTags);
  };

  async delete(request, response) {
    const {tag_id} = request.params;

    await knex("tags").where({id: tag_id}).delete();

    return response.status(200).json(`Tags of ID ${tag_id} was deleted successfully.`);
  };
};

module.exports = TagsController;