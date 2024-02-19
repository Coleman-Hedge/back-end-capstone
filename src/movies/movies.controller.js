const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");


// async function commentExists(req, res, next) {
//   const { commentId } = req.params;
//   const comment = await service.read(commentId);
//   if (comment) {
//     res.locals.comment = comment;
//     return next();
//   }
//   return next({ status: 404, message: `Comment cannot be found.` });
// }
async function movieExists(request, response, next) {
  // TODO: Add your code here.
  const { movieId } = request.params;
  const movie = await service.read(movieId);
  if(movie) {
    response.locals.movie = movie;
    return next();
  } 
  return next({ status: 404, message: "Movie cannot be found." });
}

async function read(request, response) {
  // TODO: Add your code here
  const movie = response.locals.movie;
  response.json({ data: movie });
}

async function list(request, response) {
  // TODO: Add your code here.
  const isShowing = request.query['is_showing'];
  const movies = await service.list(isShowing);
  response.json({ data: movies });
}

module.exports = { 
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(movieExists), read],
  movieExists,
};
