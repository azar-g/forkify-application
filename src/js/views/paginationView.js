import View from './View.js';
import icons from 'url:../../img/icons.svg';

class paginationView extends View {
  _parentElement = document.querySelector('.pagination');
  _btnNext;
  _btnPrev;
  _numPages;

  _generateMarkup() {
    let curPage = this._data.page;

    this._numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    if (curPage === 1 && this._numPages > 1)
      return this.generatePaginationButton(1);

    if (curPage === this._numPages && this._numPages > 1)
      return this.generatePaginationButton(-1);

    if (curPage > 1 && curPage < this._numPages)
      //prettier-ignore
      return `${this.generatePaginationButton(-1)} ${this.generatePaginationButton(1)}`;

    return ``;
  }

  generatePaginationButton(num) {
    const curPage = this._data.page;
    const buttonState = num === 1 ? 'next' : 'prev';
    const iconState = num === 1 ? 'right' : 'left';

    return `<button class="btn--inline pagination__btn--${buttonState}">
    <span>Page ${curPage + num}</span>
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-${iconState}"></use>
    </svg>
  </button>`;
  }

  addHandlerClick(func) {
    this._parentElement.addEventListener('click', e => {
      e.preventDefault();
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      if (btn.classList.contains('pagination__btn--next')) {
        func(true, this._numPages);
      }
      if (btn.classList.contains('pagination__btn--prev')) {
        func(false, this._numPages);
      }
    });
  }
}
export default new paginationView();
