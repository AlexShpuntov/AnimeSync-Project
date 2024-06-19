document.querySelectorAll('.favorite-icon').forEach(icon => {
  icon.addEventListener('click', function() {
    const animeId = this.getAttribute('data-idAnime');
    fetch('/toggle-favorite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ animeId })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        if (data.isFavorite) {
          this.classList.add('selected');
        } else {
          this.classList.remove('selected');
        }
      } else {
        alert('Error updating favorites');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Error updating favorites');
    });
  });
});