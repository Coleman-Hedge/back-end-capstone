const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const methodNotAllowed = require("../errors/methodNotAllowed");

async function reviewExists(request, response, next) {
  // TODO: Write your code here
  const { reviewId } = request.params;
  const review = await service.read(reviewId);
  if(review) {
    response.locals.review = review;
    next();
  } else {
    return next({ status: 404, message: "Review cannot be found." });
  }
}

async function destroy(request, response) {
  // TODO: Write your code here
  const deleteResponse = await service.destroy(response.locals.review.review_id);
  response.sendStatus(204);
}

async function list(request, response) {
  // TODO: Write your code here
  const reviews = await service.list(response.locals.movieId);
  response.json({ data: reviews });
}

async function read(request, response) {
  const review = response.locals.review;
  response.json({ data: review });
}

function hasMovieIdInPath(request, response, next) {
  const movieId = request.params.movieId;
  if (movieId) {
    response.locals.movieId = movieId;
    return next();
  }
  methodNotAllowed(request, response, next);
}

async function update(request, response) {
  console.log("updateing review");
  const updatedReview = {
    ...response.locals.review,
    ...request.body.data,
    review_id: response.locals.review.review_id,
  };


  const updateResponse = await service.update(updatedReview);
  console.log("review updated to ", updateResponse);
  response.json({data: updateResponse});
}


module.exports = {
  destroy: [
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(destroy),
  ],
  list: [hasMovieIdInPath, asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(read)],
  update: [
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(update),
  ],
};
