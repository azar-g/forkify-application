import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    // console.log(this._data);
    let id = window.location.hash.slice(1);

    const bookmark = this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
    // and here recieced data from view via controller(accepted data from model) was sent to previewView class. And as previewView class  is extension of View class data(each bookmark) was sent to View class again

    // console.log('🔴 bookmarksView', typeof bookmark, bookmark);
    return bookmark;
  }
}

export default new BookmarksView();
