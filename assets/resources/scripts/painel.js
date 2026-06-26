$(function () {
  const apiUrl = 'http://localhost:3000/animais';
  const container = $('#cards-container');
  const modal = new bootstrap.Modal($('#modalDetalhes')[0]);

  const carregarAnimais = async () => {
    container.html('<p class="text-center text-muted my-5">Carregando pets...</p>');
    try {
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error();
      const animais = await res.json();
      if (!animais.length) container.html('<p class="text-center text-muted my-5">Nenhum pet disponível.</p>');
      else {
        container.empty();
        animais.forEach(a => {
          container.append(`
            <div class="col-lg-3 col-md-4 col-6 mb-4">
              <div class="card shadow-sm h-100">
                <img src="${a.foto||'https://via.placeholder.com/300x200'}" class="card-img-top" alt="${a.nome}" style="height:200px;object-fit:cover;">
                <div class="card-body d-flex flex-column">
                  <h5>${a.nome}</h5>
                  <p class="text-muted small">${a.cidade}, ${a.estado}</p>
                  <button class="btn btn-details mt-auto js-ver-detalhes" data-id="${a.id}">Ver detalhes</button>
                </div>
              </div>
            </div>`);
        });
      }
    } catch {
      container.html('<p class="text-center text-danger my-5">Erro ao carregar pets.</p>');
    }
  };

  const abrirModal = async (id) => {
    try {
      const res = await fetch(`${apiUrl}/${id}`);
      if (!res.ok) throw new Error();
      const a = await res.json();
      $('#modalFoto').attr('src', a.foto || 'https://via.placeholder.com/400x300');
      $('#modalNome').text(a.nome);
      $('#modalEspecie').text(a.especie);
      $('#modalSexo').text(a.sexo);
      $('#modalIdade').text(a.idade);
      $('#modalPorte').text(a.porte);
      $('#modalCidade').text(`${a.cidade}, ${a.estado}`);
      $('#modalDescricao').text(a.sobre || 'Nenhuma descrição disponível.');
      $('#btnExcluir').off('click').on('click', () => excluirAnimal(id, a.nome));
      modal.show();
    } catch {
      alert('Erro ao carregar detalhes do pet.');
    }
  };

  const excluirAnimal = async (id, nome) => {
    if (!confirm(`Excluir "${nome}"?`)) return;
    try {
      const res = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      modal.hide();
      carregarAnimais();
    } catch {
      alert('Erro ao excluir cadastro.');
    }
  };

  container.on('click', '.js-ver-detalhes', function () {
    abrirModal($(this).data('id'));
  });

  carregarAnimais();
});
