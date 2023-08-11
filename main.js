// Função para abrir o modal
const abrirModal = () => 
    document.getElementById('modal').classList.add('active'); // Adiciona a classe 'active' para exibir o modal

// Função para fechar o modal
const fecharModal = () => {
    clearFields(); // Limpa os campos do modal
    document.getElementById('modal').classList.remove('active'); // Remove a classe 'active' para esconder o modal
}

// Função para armazenar os itens de clientes no Local Storage
const setLocalStorage = (dbCliente) => 
    localStorage.setItem("db_cliente", JSON.stringify(dbCliente)); // Converte o objeto em string JSON e armazena no Local Storage

// Função para obter os itens de clientes do Local Storage
const getLocalStorage = () => 
    JSON.parse(localStorage.getItem('db_cliente')) ?? []; // Analisa a string JSON e retorna um objeto, ou um array vazio se não houver dados

// Função para criar um novo cliente
const createCliente = (cliente) => {
    const dbCliente = getLocalStorage();
    dbCliente.push(cliente);
    setLocalStorage(dbCliente); // Atualiza o Local Storage com o novo cliente
}

// Função para limpar os campos do modal
const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field'); // Seleciona os campos do modal
    fields.forEach(field => field.value = ""); // Limpa os valores dos campos
    document.getElementById('nome').dataset.index = 'new'; // Define o índice como 'new' para indicar um novo cliente
    document.querySelector(".modal-header>h2").textContent  = 'Novo Cliente'; // Altera o título do modal
}

// Função para salvar um cliente (cadastrar ou editar)
const saveCliente = () => {
    // Captura os dados do cliente do modal
    const cliente = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        celular: document.getElementById('celular').value,
        cidade: document.getElementById('cidade').value
    }

    const index = document.getElementById('nome').dataset.index;

    if (index === 'new') {
        createCliente(cliente);
    } else {
        updateCliente(index, cliente);
    }

    atualizaTabela(); // Atualiza a tabela na interface
    fecharModal(); // Fecha o modal
}



// Função para listar os clientes
const readCliente = () => getLocalStorage();

// Função para criar uma linha na tabela
const criarLinha = (cliente, index) => {
    const novaLinha = document.createElement('tr');
    novaLinha.innerHTML = `
        <td>${cliente.nome}</td>
        <td>${cliente.email}</td>
        <td>${cliente.celular}</td>
        <td>${cliente.cidade}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}">Excluir</button>
        </td>
    `;
    document.querySelector('#tableClient>tbody').appendChild(novaLinha);
}

// Função para atualizar a tabela na interface
const atualizaTabela = () => {
    const dbCliente = readCliente();
    limparTabela();
    dbCliente.forEach((cliente, index) => criarLinha(cliente, index));
}

// Função para atualizar os dados de um cliente
const updateCliente = (index, cliente) => {
    const dbCliente = readCliente();
    dbCliente[index] = cliente;
    setLocalStorage(dbCliente);
}

// Função para remover um cliente
const deleteCliente = (index) => {
    const dbCliente = readCliente();
    dbCliente.splice(index, 1);
    setLocalStorage(dbCliente);
}

// Função para limpar a tabela na interface
const limparTabela = () => {
    const linhas = document.querySelectorAll('#tableClient>tbody tr');
    linhas.forEach(linha => linha.parentNode.removeChild(linha));
}

// Função para preencher os campos do modal com os dados do cliente
const fillFields = (cliente, index) => {
    document.getElementById('nome').value = cliente.nome;
    document.getElementById('email').value = cliente.email;
    document.getElementById('celular').value = cliente.celular;
    document.getElementById('cidade').value = cliente.cidade;
    document.getElementById('nome').dataset.index = index; // Define o índice do cliente
    document.querySelector(".modal-header>h2").textContent = `Editando ${cliente.nome}`; // Altera o título do modal
}

// Função para edição ou exclusão ao clicar nos botões da tabela
const editDelete = (event) => {
    if (event.target.type === 'button') {
        const [action, index] = event.target.id.split('-');

        if (action === 'edit') {
            const clienteIndex = parseInt(index);
            fillFields(readCliente()[clienteIndex], clienteIndex);
            abrirModal();
        } else {
            const cliente = readCliente()[index];
            const response = confirm(`Deseja realmente excluir o cliente ${cliente.nome}?`);
            if (response) {
                deleteCliente(index);
                atualizaTabela();
            }
        }
    }
}

// Eventos

// Abre o modal ao clicar no botão "Cadastrar Cliente"
document.getElementById('cadastrarCliente')
    .addEventListener('click', () => {
        clearFields();
        abrirModal();
    });

// Fecha o modal ao clicar no botão de fechar
document.getElementById('modalClose')
    .addEventListener('click', fecharModal);

// Gerencia cliques nos botões de edição/exclusão na tabela
document.querySelector('#tableClient>tbody')
    .addEventListener('click', editDelete);

// Salva os dados do cliente ao clicar no botão "Salvar"
document.getElementById('salvar')
    .addEventListener('click', saveCliente);

// Cancela a edição ou cadastro ao clicar no botão "Cancelar"
document.getElementById('cancelar')
    .addEventListener('click', fecharModal);

// Inicializa a tabela na interface
atualizaTabela();
