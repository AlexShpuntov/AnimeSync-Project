document.querySelectorAll(".rating-star").forEach(function(star) {
  star.addEventListener("click", function() {
    const rating = parseInt(this.dataset.rating);
    const stars = document.querySelectorAll(".rating-star");
    stars.forEach(function(s) {
      if (parseInt(s.dataset.rating) <= rating) {
        s.classList.add("selected");
      } else {
        s.classList.remove("selected");
      }
    });
    document.getElementById("rating-input").value = rating;
  });
});