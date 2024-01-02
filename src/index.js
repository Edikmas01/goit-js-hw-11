import { Notify } from 'notiflix/build/notiflix-notify-aio';
// import { Loading } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { client, increasePage } from './js/client.js';

const gallery = document.querySelector('.gallery');
const form = document.querySelector('#search-form');
const loadMoreBtn = document.querySelector('.load-more');
const lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});
let searchQuery = '';

const createItem = item => {
  return `
    <a class="gallery__link" href="${item.largeImageURL}">
      <div class="photo-card">
        <img src="${item.webformatURL}" alt="${item.tegs}" loading="lazy" />
        <div class="info">
          <p class="info-item">
          <b>Likes <br>${item.likes}</b>
          </p>
          <p class="info-item">
          <b>Views ${item.views}</b>
          </p>
          <p class="info-item">
          <b>Comments ${item.comments}</b>
          </p>
          <p class="info-item">
          <b>Downloads ${item.downloads}</b>
          </p>
        </div>
      </div>
    </a>
    `;
};

/*const scroll = () => {
   const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
});
 }*/

const getData = async (query = '') => {
  const { data } = await client.get(`?q=${query}`); 
  return data;
};

form.elements.searchQuery.addEventListener('input', (e) => {
  searchQuery = e.target.value;
})


form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!searchQuery) {
    return Notify.failure('Please fill in the search field');
  }

  try {
    clearMarkup();

    const data = await getData(searchQuery); 
    const markup = data.hits.map(createItem).join('');
    gallery.insertAdjacentHTML('beforeend', markup);
    
    lightbox.refresh(); 

    Notify.success(
      `Hooray! We found ${data.total} pictures!`
    );
    loadMoreBtn.style.display = 'flex';
  }
  catch (error)
  {
    console.log(error, 'error');
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } 
})

loadMoreBtn.addEventListener('click', async () => {
  increasePage();
 
  const data = await getData(searchQuery);
  const markup = data.hits.map(createItem).join('');
  console.log(markup);
  gallery.insertAdjacentHTML('beforeend', markup);
  
  lightbox.refresh()
});

const clearMarkup = () => {
  gallery.innerHTML = '';
};

