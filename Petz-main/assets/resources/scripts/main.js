document.addEventListener("DOMContentLoaded", function() {
  // Encontra o local onde a navbar deve ser inserida
  const navbarPlaceholder = document.getElementById("navbar-placeholder");
  
  // Se o local for encontrado, busca o conteúdo do navbar.html
  if (navbarPlaceholder) {
    fetch("/Petz-main/app/navbar.html")
      .then(response => response.text())
      .then(data => {
        // Insere o conteúdo da navbar no local definido
        navbarPlaceholder.innerHTML = data;
      })
      .catch(error => {
        console.error("Erro ao carregar a navbar:", error);
        navbarPlaceholder.innerHTML = "<p>Erro ao carregar o menu.</p>";
      });
  }
});