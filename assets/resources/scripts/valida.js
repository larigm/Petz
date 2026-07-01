
$(function () {
  const form = $('#cadastroFormulario'),
        msgSucesso = $('#mensagem-sucesso'),
        msgErro = $('#mensagem-erro'),
        estado = $('#estado'),
        cidade = $('#cidade'),
        sobre = $('#sobre'),
        contador = $('#contador-caracteres');

  if (sobre.length) {
    const max = sobre.attr('maxlength');
    contador.text(`0 / ${max}`);
    sobre.on('input', () => contador.text(`${sobre.val().length} / ${max}`));
  }

  const popularEstados = async () => {
    try {
      const res = await fetch('https://brasilapi.com.br/api/ibge/uf/v1'),
            data = await res.json();
      estado.html('<option value="" disabled selected>Estado*</option>');
      data.forEach(e => estado.append(`<option value="${e.sigla}">${e.nome}</option>`));
    } catch {
      console.error('Erro ao buscar estados');
    }
  };

  const popularCidades = async (uf) => {
    cidade.html('<option>Carregando...</option>').prop('disabled', true);
    try {
      const res = await fetch(`https://brasilapi.com.br/api/ibge/municipios/v1/${uf}`),
            data = await res.json();
      cidade.html('<option value="" disabled selected>Cidade*</option>');
      data.forEach(c => cidade.append(`<option value="${c.nome}">${c.nome}</option>`));
      cidade.prop('disabled', false);
    } catch {
      console.error('Erro ao buscar cidades');
    }
  };

  estado.on('change', () => popularCidades(estado.val()));

  form.on('submit', async function (e) {
    e.preventDefault();
    msgSucesso.hide();
    msgErro.hide();

    if (!this.checkValidity()) {
      e.stopPropagation();
      form.addClass('was-validated');
      return;
    }

    const animal = {
      nome: $('#nomeAnimal').val().trim(),
      especie: $('#especie').val(),
      sexo: $('#sexo').val(),
      idade: $('#idade').val(),
      porte: $('#porte').val(),
      estado: estado.val(),
      cidade: cidade.val(),
      sobre: sobre.val().trim(),
      foto: $('#inputFoto').val().trim(),
    };

    try {
      const { data, error } = await supabaseClient
  .from('animais')
  .insert(animal);
console.log(data);
console.log(error);
if (error) throw error();

      msgSucesso.show();
      this.reset();
      form.removeClass('was-validated');
      cidade.html('<option value="" disabled selected>Cidade*</option>').prop('disabled', true);
      setTimeout(() => msgSucesso.fadeOut(), 7000);
    }catch (erro) {
  console.log(erro);
  msgErro.text('Erro ao enviar').show();
}
  });

  popularEstados();
});
