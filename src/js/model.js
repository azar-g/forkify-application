import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
import { AJAX } from './helpers.js';
// import { getJSON, sendJSON } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: {},
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = data => {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key =${KEY}`);

    state.recipe = createRecipeObject(data);

    //🔴 Updating variable(state) outside of async functtion sope🔴//

    // console.log(state.bookmarks);
    if (state.bookmarks.some(bookmarkedRecipe => bookmarkedRecipe.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (error) {
    // console.error(`🔴${error}🔴`);
    throw new Error(`${error}`);
  }
};

export const loadSearchResults = async query => {
  try {
    state.search.query = query;
    state.search.page = 1;
    const data = await AJAX(`${API_URL}?search=${query}&key =${KEY}`);
    // console.log(data.data.recipes);
    state.search.results = data.data.recipes.map(
      recipe =>
        (recipe = {
          id: recipe.id,
          title: recipe.title,
          publisher: recipe.publisher,
          image: recipe.image_url,
          ...(recipe.key && { key: recipe.key }),
        })
    );
  } catch (error) {
    throw error;
  }
};

export const getSearchResults = (page = state.search.page) => {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

export const updateServings = newServings => {
  state.recipe.ingredients.forEach(ing => {
    return (
      (ing.quantity = (ing.quantity * newServings) / state.recipe.servings),
      (state.recipe.servings = newServings)
    );
  });
  state.recipe.servings = newServings;
};

const persistBookmarks = () => {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookMark = () => {
  //Add bookmark
  state.bookmarks.push(state.recipe);
  state.recipe.bookmarked = true;
  persistBookmarks();
};

export const deleteBookmark = () => {
  const index = state.bookmarks.findIndex(
    element => element.id === state.recipe.id
  );
  state.bookmarks.splice(index, 1);
  state.recipe.bookmarked = false;
  persistBookmarks();
};
const init = () => {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();

export const uploadRecipe = async newRecipe => {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(
        ([key, value]) =>
          // Here we can exclude value
          key.startsWith('ingredient') && value !== ''
      )
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please use correct ingredient format'
          );
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    console.log(recipe);

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);

    state.recipe = createRecipeObject(data);
    addBookMark(state.recipe);
  } catch (err) {
    throw err;
  }
};
