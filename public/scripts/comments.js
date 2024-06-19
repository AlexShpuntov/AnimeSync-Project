document.getElementById("comment-form").addEventListener("submit", function(event) {
  event.preventDefault();
  const comment = document.getElementById("comment-area").value;
  const rating = document.getElementById("rating-input").value;
  const animeId = document.getElementById("animeId").value;
  fetch('/anime-info', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ comment, rating })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    window.location.href = `/anime-info?id=${animeId}`;
  })
  .catch(error => {
    console.error('There has been a problem with fetch operation:', error);
  });
});