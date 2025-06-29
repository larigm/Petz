
/* contador do carroseel */
  function animarContador(id, valorFinal, duracao) {
    const elemento = document.getElementById(id);
    let inicio = 30000;
    const incremento = Math.ceil(valorFinal / (duracao / 30));

    const contador = setInterval(() => {
      inicio += incremento;
      if (inicio >= valorFinal) {
        elemento.textContent = valorFinal.toLocaleString('pt-BR'); 
        clearInterval(contador);
      } else {
        elemento.textContent = inicio.toLocaleString('pt-BR');
      }
    }, 30);
  }
  // Quando a página carregar inicia o contador
  window.addEventListener('load', () => {
    animarContador('contador', 82409, 1000);
  });
