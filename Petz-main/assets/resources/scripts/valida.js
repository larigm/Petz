
document.addEventListener('DOMContentLoaded', () => {

  const form = document.getElementById('cadastroFormulario');
  const mensagemSucesso = document.getElementById('mensagem-sucesso');


const estadoSelect = document.getElementById('estado');
const cidadeSelect = document.getElementById('cidade');

// Função para buscar e popular os estados
const popularEstados = () => {
    const url = 'https://brasilapi.com.br/api/ibge/uf/v1';

    fetch(url)
        .then(response => response.json())
        .then(estados => {
            estadoSelect.innerHTML = '<option value="" selected disabled>Estado</option>';
            estados.forEach(estado => {
                const option = document.createElement('option');
                option.value = estado.sigla;
                option.textContent = estado.nome;
                estadoSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erro ao buscar os estados:', error);
        });
};

// Função para buscar e popular as cidades de um estado
const popularCidades = (uf) => {
    cidadeSelect.innerHTML = '<option value="">Cidade</option>';
    cidadeSelect.disabled = true;

    const url = `https://brasilapi.com.br/api/ibge/municipios/v1/${uf}`;

    // A lógica do fetch vai DENTRO da função
    fetch(url)
        .then(response => response.json())
        .then(cidades => { // CORRIGIDO: 'cidades' no plural, pois é uma lista
            cidadeSelect.innerHTML = '<option value="" selected disabled>Cidade</option>';
            
            // CORRIGIDO: Loop na lista 'cidades'
            cidades.forEach(cidade => {
                const option = document.createElement('option');
                option.value = cidade.nome;
                option.textContent = cidade.nome;
                cidadeSelect.appendChild(option);
            });
            cidadeSelect.disabled = false;
        })
        .catch(error => {
            console.error('Erro ao buscar cidades:', error);
        });
}; // <--- A função popularCidades termina AQUI.

// "Escutador" que monitora a mudança no dropdown de estado
estadoSelect.addEventListener('change', (event) => {
    const ufSelecionado = event.target.value;
    if (ufSelecionado) {
        popularCidades(ufSelecionado);
    }
});

// Execução inicial: chama a função para carregar os estados quando a página abre
popularEstados();
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      // Validação do Bootstrap
      if (!form.checkValidity()) {
        event.stopPropagation();
        form.classList.add('was-validated');
        return;
      }

     

      const animal = {
        nome: document.getElementById('nomeAnimal').value.trim(),
        especie: document.getElementById('especie').value,
        sexo: document.getElementById('sexo').value,
        idade: document.getElementById('idade').value,
        porte: document.getElementById('porte').value,
        estado: document.getElementById('estado').value,
        cidade: document.getElementById('cidade').value,
        sobre: document.getElementById('sobre').value.trim(),
        foto: document.getElementById('inputFoto').value.trim()
      };

      // 1. Salvar no localStorage (para o nosso painel.html)
      const animaisSalvos = JSON.parse(localStorage.getItem('animais')) || [];
      animaisSalvos.push(animal);
      localStorage.setItem('animais', JSON.stringify(animaisSalvos));

      // 2. Enviar para uma API de teste com fetch (como no exemplo do seu amigo)
      fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify(animal),
        headers: { 'Content-type': 'application/json; charset=UTF-8' }
      })
      .then(response => response.json())
      .then(data => {
        console.log('Dados enviados para a API de teste:', data);
        
        // 3. Mostrar a mensagem de sucesso
        mensagemSucesso.style.display = 'block';
        
        // 4. Limpar o formulário
        form.reset();
        form.classList.remove('was-validated'); // Remove as marcas de validação

        // Opcional: Esconder a mensagem de sucesso depois de alguns segundos
        setTimeout(() => {
          mensagemSucesso.style.display = 'none';
        }, 4000); // A mensagem some depois de 4 segundos
      })
      .catch(error => {
        console.error('Erro ao enviar para a API:', error);
        alert('Ocorreu um erro. Tente novamente.');
      });
    });
  }
});