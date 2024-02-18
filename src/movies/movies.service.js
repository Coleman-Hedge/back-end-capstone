const db = require("../db/connection");

async function list(is_showing) {
  return db("movies")
    .select("movies.*")
    .modify((queryBuilder) => {
      console.log("Is showing is equal to ", is_showing);
      if (is_showing) {
        console.log("only returning movies that are currently showing");
        queryBuilder
          .join(
            "movies_theaters",
            "movies.movie_id",
            "movies_theaters.movie_id"
          )
          .where({ "movies_theaters.is_showing": true })
          .groupBy("movies.movie_id");
      }
    });
}

async function read(movie_id) {
  // TODO: Add your code here
  return db("movies")
    .select("movies.*")
    .where({"movies.movie_id": movie_id}).first();
  
}

module.exports = {
  list,
  read,
};
