document.addEventListener('DOMContentLoaded', function () {
  const animeDivs = document.querySelectorAll('.anime-cover');
  animeDivs.forEach(function (animeDiv) {
      animeDiv.addEventListener('click', function () {
          const animeId = this.getAttribute('data-idAnime');
          window.location.href = `/anime-info?id=${animeId}`;
      });
  });
});