$(document).ready(function () {

  const modalElement = document.getElementById('modalDetalhes');
  const modalDetalhes = new bootstrap.Modal(modalElement);
  const container = $('#cards-container');
  const apiUrl = 'http://localhost:3000/animais';

  const carregarAnimais = async () => {
    container.html('<p class="text-center text-muted col-12 my-5">Carregando pets...</p>');
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('Erro ao carregar dados');
      
      const animais = await response.json();
      container.empty(); // .empty() é o atalho do jQuery para limpar o conteúdo

      if (!animais.length) {
        container.html('<p class="text-center text-muted col-12 my-5">Nenhum pet disponível.</p>');
        return;
      }

      animais.forEach(animal => {
        const cardHtml = `
          <div class="col-lg-3 col-md-4 col-6 mb-4">
            <div class="card shadow-sm h-100">
              <img src="${animal.foto}" class="card-img-top" alt="Foto de ${animal.nome}" style="height: 200px; object-fit: cover;">
              <div class="card-body d-flex flex-column">
                <h5 class="card-title">${animal.nome}</h5>
                <p class="card-text text-muted small">${animal.cidade}, ${animal.estado}</p>
                <button class="btn btn-details mt-auto js-ver-detalhes" data-id="${animal.id}">Ver detalhes</button>
              </div>
            </div>
          </div>`;
        container.append(cardHtml); // .append() é o atalho do jQuery
      });
    } catch (error) {
      console.error('Erro ao carregar animais:', error);
      container.html('<p class="text-center text-danger col-12 my-5">Ocorreu um erro ao carregar os pets.</p>');
    }
  };

  const abrirModal = async (animalId) => {
    try {
      const response = await fetch(`${apiUrl}/${animalId}`);
      if (!response.ok) throw new Error('Animal não encontrado');
      
      const animal = await response.json();

      // Preenche o modal usando seletores e métodos jQuery
      $('#modalFoto').attr('src', animal.foto);
      $('#modalNome').text(animal.nome);
      $('#modalEspecie').text(animal.especie);
      $('#modalSexo').text(animal.sexo);
      $('#modalIdade').text(animal.idade);
      $('#modalPorte').text(animal.porte);
      $('#modalCidade').text(`${animal.cidade}, ${animal.estado}`);
      $('#modalDescricao').text(animal.sobre || 'Nenhuma descrição disponível.');
      
      $('#btnExcluir').off('click').on('click', () => excluirAnimal(animal.id, animal.nome));

      modalDetalhes.show();
    } catch (error) {
      console.error('Erro ao buscar detalhes do animal:', error);
      alert('Não foi possível carregar os detalhes deste pet.');
    }
  };

  const excluirAnimal = async (animalId, nome) => {
    if (confirm(`Tem certeza que deseja excluir "${nome}"?`)) {
      try {
        const response = await fetch(`${apiUrl}/${animalId}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Falha ao excluir');
        modalDetalhes.hide();
        carregarAnimais();
      } catch (error) {
        console.error('Erro ao excluir animal:', error);
        alert('Não foi possível excluir o cadastro.');
      }
    }
  };

  // O 'event delegation' do jQuery é mais limpo
  container.on('click', '.js-ver-detalhes', function() {
    const animalId = $(this).data('id');
    abrirModal(animalId);
  });

  // Inicialização
  carregarAnimais();
});