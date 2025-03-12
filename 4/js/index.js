// Переключение темы
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Проверяем сохранённую тему в localStorage
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  body.classList.add(savedTheme);
  updateButtonText();
}

// Переключение темы
themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark-theme');
  body.classList.toggle('light-theme');
  const currentTheme = body.classList.contains('dark-theme') ? 'dark-theme' : 'light-theme';
  localStorage.setItem('theme', currentTheme); // Сохраняем тему
  updateButtonText();
});

// Обновление текста кнопки
function updateButtonText() {
  if (body.classList.contains('dark-theme')) {
    themeToggle.textContent = '☀️ Светлая тема';
  } else {
    themeToggle.textContent = '🌙 Тёмная тема';
  }
}

// Лента отзывов
const reviews = [
  { name: "Иван", text: "Отличный продукт!", rating: 5, photo: null },
  { name: "Мария", text: "Очень довольна!", rating: 4, photo: null },
  { name: "Алексей", text: "Неплохо, но могло быть лучше.", rating: 3, photo: null },
];

const reviewForm = document.getElementById('review-form');
const reviewsContainer = document.getElementById('reviews-container');

// Отображение отзывов
function displayReviews(reviews) {
  reviewsContainer.innerHTML = reviews
    .map(
      (review) => `
      <div class="testimonial">
        <p><strong>${review.name}</strong> (${'★'.repeat(review.rating)})</p>
        <p>${review.text}</p>
        ${review.photo ? `<img src="${review.photo}" alt="Фото отзыва">` : ''}
      </div>
    `
    )
    .join('');
}

// Добавление отзыва
reviewForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('review-name').value;
  const text = document.getElementById('review-text').value;
  const rating = document.getElementById('review-rating').value;
  const photoInput = document.getElementById('review-photo');
  const photoFile = photoInput.files[0];

  if (name && text && rating) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const photo = e.target.result;
      reviews.push({ name, text, rating: parseInt(rating), photo });
      displayReviews(reviews);
      reviewForm.reset();
    };
    if (photoFile) {
      reader.readAsDataURL(photoFile);
    } else {
      reviews.push({ name, text, rating: parseInt(rating), photo: null });
      displayReviews(reviews);
      reviewForm.reset();
    }
  } else {
    alert('Заполните все обязательные поля!');
  }
});

// Сортировка и фильтрация
function sortReviews(order) {
  const sortedReviews = [...reviews].sort((a, b) =>
    order === 'asc' ? a.rating - b.rating : b.rating - a.rating
  );
  displayReviews(sortedReviews);
}

function filterReviews(minRating) {
  const filteredReviews = reviews.filter((review) => review.rating >= minRating);
  displayReviews(filteredReviews);
}

// Кнопки для сортировки и фильтрации
document.getElementById('sort-asc').addEventListener('click', () => sortReviews('asc'));
document.getElementById('sort-desc').addEventListener('click', () => sortReviews('desc'));
document.getElementById('filter-4').addEventListener('click', () => filterReviews(4));
document.getElementById('filter-5').addEventListener('click', () => filterReviews(5));

// Инициализация
displayReviews(reviews);