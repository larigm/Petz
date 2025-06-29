
function getAnimais() {
  return JSON.parse(localStorage.getItem('animais')) || [];
}

function salvarAnimais(animais) {
  localStorage.setItem('animais', JSON.stringify(animais));
}

$(document).ready(function() {
  const modalDetalhes = new bootstrap.Modal($('#modalDetalhes')[0]);

  function carregarAnimais() {
    const animais = getAnimais();
    const container = $('#cards-container');
    container.empty();

    if (animais.length === 0) {
      container.html('<p class="text-center text-muted col-12 my-5">Nenhum pet disponível para adoção no momento.</p>');
      return;
    }

    animais.forEach((animal, index) => {
      const cardHtml = `
        <div class="col-lg-3 col-md-4 col-6 mb-4">
          <div class="card shadow-sm h-100">
            <img src="${animal.foto}" class="card-img-top" alt="Foto de ${animal.nome}" style="height: 200px; object-fit: cover;">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${animal.nome}</h5>
              <p class="card-text text-muted small">${animal.cidade}, ${animal.estado}</p>
              <button class="btn btn-details mt-auto js-ver-detalhes" data-index="${index}">
                Ver detalhes
              </button>
            </div>
          </div>
        </div>
      `;
      container.append(cardHtml);
    });
  }

  function abrirModal(index) {
    const animais = getAnimais();
    const animal = animais[index];

    $('#modalFoto').attr('src', animal.foto);
    $('#modalNome').text(animal.nome);
    $('#modalEspecie').text(animal.especie);
    $('#modalSexo').text(animal.sexo);
    $('#modalIdade').text(animal.idade);
    $('#modalPorte').text(animal.porte);
    $('#modalCidade').text(`${animal.cidade}, ${animal.estado}`);
    $('#modalDescricao').text(animal.sobre || 'Nenhuma descrição disponível.');
    
    $('#btnExcluir').off('click').on('click', () => {
      excluirAnimal(index, animal.nome);
    });

    modalDetalhes.show();
  }

  function excluirAnimal(index, nome) {
    if (confirm(`Tem certeza que deseja excluir o cadastro de "${nome}"?`)) {
      const animais = getAnimais();
      animais.splice(index, 1);
      salvarAnimais(animais);
      modalDetalhes.hide();
      carregarAnimais();
    }
  }
  $('#cards-container').on('click', '.js-ver-detalhes', function() {
    const index = $(this).data('index');
    abrirModal(index);
  });
  carregarAnimais();
});