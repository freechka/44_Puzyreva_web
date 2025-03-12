/**
 * Функция для сохранения отзывов в cookies.
 * @param {Array} reviews - Массив отзывов.
 */
function saveReviewsToCookies(reviews) {
  // Сериализуем массив отзывов в JSON
  const reviewsJson = JSON.stringify(reviews);
  // Сохраняем в cookies на 7 дней
  Cookies.set('reviews', reviewsJson, { expires: 7 });
}

/**
 * Функция для загрузки отзывов из cookies.
 * @returns {Array} - Массив отзывов.
 */
function loadReviewsFromCookies() {
  // Получаем данные из cookies
  const reviewsJson = Cookies.get('reviews');
  // Если данные есть, парсим их в массив
  return reviewsJson ? JSON.parse(reviewsJson) : [];
}

/**
 * Функция для очистки отзывов из cookies.
 */
function clearReviewsFromCookies() {
  Cookies.remove('reviews');
}

export { saveReviewsToCookies, loadReviewsFromCookies, clearReviewsFromCookies };>