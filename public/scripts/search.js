document.querySelector('.search-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const searchInput = document.getElementById('search-input').value;
  window.location.href = `/search?title=${searchInput}`;
});