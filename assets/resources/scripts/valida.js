$(document).ready(function () {

  // Seletores jQuery
  const form = $('#cadastroFormulario');
  const mensagemSucesso = $('#mensagem-sucesso');
  const mensagemErro = $('#mensagem-erro');
  const estadoSelect = $('#estado');
  const cidadeSelect = $('#cidade');
  const sobreTextarea = $('#sobre');
  const contadorDisplay = $('#contador-caracteres');

  
  

  // Contador de Caracteres
  if (sobreTextarea.length) {
    const maxLength = sobreTextarea.attr('maxlength');
    contadorDisplay.text(`0 / ${maxLength}`);
    sobreTextarea.on('input', function () {
      contadorDisplay.text(`${$(this).val().length} / ${maxLength}`);
    });
  }
  // Funções de Localização (mantivemos async/await por ser mais moderno e limpo)
  const popularEstados = async () => {
    try {
      const response = await fetch('https://brasilapi.com.br/api/ibge/uf/v1');
      const estados = await response.json();
      estadoSelect.html('<option value="" selected disabled>Estado*</option>');
      estados.forEach(estado => {
        estadoSelect.append(`<option value="${estado.sigla}">${estado.nome}</option>`);
      });
    } catch (error) {
      console.error('Erro ao buscar estados:', error);
    }
  };
  const popularCidades = async (uf) => {
    cidadeSelect.html('<option value="">Carregando...</option>').prop('disabled', true);
    try {
      const response = await fetch(`https://brasilapi.com.br/api/ibge/municipios/v1/${uf}`);
      const cidades = await response.json();
      cidadeSelect.html('<option value="" selected disabled>Cidade*</option>');
      cidades.forEach(cidade => {
        cidadeSelect.append(`<option value="${cidade.nome}">${cidade.nome}</option>`);
      });
      cidadeSelect.prop('disabled', false);
    } catch (error) {
      console.error('Erro ao buscar cidades:', error);
    }
  };
  estadoSelect.on('change', function () {
    popularCidades($(this).val());
  });
  // Submissão do formulário
  //Ele envia os dados do formulário para o JSON Server:
  form.on('submit', async function (event) {
    event.preventDefault();
    mensagemSucesso.hide();
    mensagemErro.hide();
    if (!this.checkValidity()) {
      event.stopPropagation();
      form.addClass('was-validated');
      return;
    }
    const animal = {
      nome: $('#nomeAnimal').val().trim(),
      especie: $('#especie').val(),
      sexo: $('#sexo').val(),
      idade: $('#idade').val(),
      porte: $('#porte').val(),
      estado: estadoSelect.val(),
      cidade: cidadeSelect.val(),
      sobre: sobreTextarea.val().trim(),
      foto: $('#inputFoto').val().trim(),
    };

    try {
      const response = await fetch('http://localhost:3000/animais', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(animal),
      });
      if (!response.ok) throw new Error('Falha no envio');

      mensagemSucesso.show();
      this.reset();
      form.removeClass('was-validated');
      cidadeSelect.html('<option value="" selected disabled>Cidade*</option>').prop('disabled', true);
      setTimeout(() => mensagemSucesso.fadeOut(), 7000);

    } catch (error) {
      console.error('Erro ao enviar para a API:', error);
      mensagemErro.show();
    }
  });
  // Inicialização
  popularEstados();
});