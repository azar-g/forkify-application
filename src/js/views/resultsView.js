import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class resultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for you query. Please try again';

  _generateMarkup() {
    // console.log(this._data);
    let id = window.location.hash.slice(1);

    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new resultsView();
