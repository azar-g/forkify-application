import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js ';
import { MODAL_CLOSE_SEC } from './config.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
import View from './views/View.js';

if (module.hot) {
  module.hot.accept();
}

const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async () => {
  try {
    const id = window.location.hash.slice(1);
    // console.log(id);
    if (!id) return;
    // 0.Rendering spinner
    recipeView.renderSpinner();
    // 1.Updating results view to mark selected search result
    resultsView.update(model.getSearchResults());
    bookmarksView.update(model.state.bookmarks);
    // 2.Loading Recipe
    await model.loadRecipe(id);
    // 3.Rendering Recipe
    recipeView.render(model.state.recipe);
  } catch (error) {
    recipeView.renderError();
  }
};
// controlRecipes();

const controlSearchResults = async () => {
  try {
    // 1) Getting search query
    let query = searchView.getQuery();
    if (!query) return;
    // 2) Loading search results
    await model.loadSearchResults(query);
    // 3) Rendering initial results
    paginateUpdate();
  } catch (err) {
    console.log(err);
  }
};

const paginateHandler = (call, numPages) => {
  call ? paginatePlus(numPages) : paginateMinus();
};
//Pagination forward
const paginatePlus = numPages => {
  if (model.state.search.page === numPages) return;
  model.state.search.page++;
  paginateUpdate();
};
//Pagination backward
const paginateMinus = () => {
  if (model.state.search.page === 1) return;
  model.state.search.page--;
  paginateUpdate();
};
const paginateUpdate = () => {
  resultsView.renderSpinner();
  resultsView.render(model.getSearchResults());
  paginationView.render(model.state.search);
};

const controlServings = newServings => {
  //Update te recipe servings (in state)

  model.updateServings(newServings);
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);

  // Update the recipe view
};

const controlAddBookmarks = () => {
  // 1) Add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookMark();
  else model.deleteBookmark();
  // 2) Update recipe view
  recipeView.update(model.state.recipe);
  // 3) Render.bookmarks
  bookmarksView.render(model.state.bookmarks);
  //bookmarksView was called , and data(model.state.bookmarks array) sent to bookmarks class whis is extension of view class, so data actually recieved by view class
};

const controlBookmarks = () => {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async newRecipe => {
  try {
    addRecipeView.renderSpinner();
    // Upload new recipe
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);
    // Render recipe
    recipeView.render(model.state.recipe);
    // Success message
    addRecipeView.renderMessage();
    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);
    // Change ID in URL
    window.history
      .pushState(null, '', `#${model.state.recipe.id}`)
      // Close form
      .setTimeout(() => {
        addRecipeView.toggleWindow();
      }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    recipeView.renderError(error.message);
  }
};

const init = () => {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(paginateHandler);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmarks);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
