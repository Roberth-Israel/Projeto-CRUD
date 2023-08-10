
//função para abrir o modal 
const abrirModal = () => 
    //add - adicionar o modal
    document.getElementById('modal').classList.add('active')

//função para fechar o modal
const fecharModal = () => {
    clearFields()//função para os campos do modal
    //remove - fechar o modal
    document.getElementById('modal').classList.remove('active')
}

//guardar os itens - clientes - setItem
//exemplo: localStorage.setItem("nome","Henrique");
const setLocalStorage = (dbCliente) => //objeto a ser armazenado
    //O JSON.stringify() método converte um valor em uma string JSON
    //nome da chave do objeto db_client
    localStorage.setItem("db_cliente",JSON.stringify(dbCliente))

//puxar os itens - clientes 
//exemplo: let cliente = localStorage.getItem("nome");
//console.log("Meu nome é: ",cliente)
const getLocalStorage = () => 
//O JSON.parse()método que analisa uma string JSON, construindo um objeto
    JSON.parse(localStorage.getItem('db_cliente')) ?? []

//CRUD - create
const createCliente = (cliente) => {
    const dbCliente = getLocalStorage();
    dbCliente.push(cliente);
    setLocalStorage(dbCliente); //devolve o array para o localStorage
}

//Interação com o layout
const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')//inputs do modal
    fields.forEach(field => field.value = "")//percorrer os valores informados 
    //propriedade de acesso ao dado do elemento
    document.getElementById('nome').dataset.index = 'new'
    //mostrar no título do modal 
    document.querySelector(".modal-header>h2").textContent  = 'Novo Cliente'
}

//função para verificar se deseja cadastrar ou editar
const saveCliente = () => {
    const cliente = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        celular: document.getElementById('celular').value,
        cidade: document.getElementById('cidade').value
    }

    const index = document.getElementById('nome').dataset.index;

    const dbCliente = readCliente(); // Lê os clientes do Local Storage

    // Verifica se já existe um cliente com o mesmo nome ou e-mail
    const nomeRepetido = dbCliente.some(clienteExistente => clienteExistente.nome === cliente.nome && clienteExistente.index !== index);
    const emailRepetido = dbCliente.some(clienteExistente => clienteExistente.email === cliente.email && clienteExistente.index !== index);

    if (nomeRepetido) {
        alert("Nome já está cadastrado em outro cliente.");
        return;
    }

    if (emailRepetido) {
        alert("E-mail já está cadastrado em outro cliente.");
        return;
    }

    if (index === 'new') {
        createCliente(cliente);
    } else {
        updateCliente(index, cliente);
    }

    atualizaTabela();
    fecharModal();
}

//Mostrar na tabela 
const criarLinha = (cliente, index) => {//método para criar uma linha na tabela 
    const novaLinha = document.createElement('tr')//criar o elemento TR
    novaLinha.innerHTML = `
        <td>${cliente.nome}</td>
        <td>${cliente.email}</td>
        <td>${cliente.celular}</td>
        <td>${cliente.cidade}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}" >Excluir</button>
        </td>
    `
    //acrescenta a linha a tabela 
    document.querySelector('#tableClient>tbody').appendChild(novaLinha)
}

//CRUD - read
const readCliente = (cliente) => getLocalStorage() //listar os clientes

const atualizaTabela = () => {//método para atualizar a tabela
    const dbCliente = readCliente()//mostrar os clientes
    limparTabela()//fechar a tabela 
    dbCliente.forEach(criarLinha)//
}

//CRUD - update
const updateCliente = (index, cliente) => { //cliente selecionado 
    const dbCliente = readCliente()//chamada do método 
    dbCliente[index] = cliente//chave e valor
    setLocalStorage(dbCliente)//grava o valor atualizado
}

//CRUD - delete
const deleteCliente = (index) => {
    const dbCliente = readCliente();
    dbCliente.splice(index, 1); // Remove o cliente do array
    setLocalStorage(dbCliente);//adicionar o cliente no localStorage
}

const limparTabela = () => {
    const linhas = document.querySelectorAll('#tableClient>tbody tr')
    linhas.forEach(linha => linha.parentNode.removeChild(linha))
}

atualizaTabela()//atualiza a tabela

const fillFields = (cliente) => { //mostrar as propriedades do objeto no modal 
    document.getElementById('nome').value = cliente.nome
    document.getElementById('email').value = cliente.email
    document.getElementById('celular').value = cliente.celular
    document.getElementById('cidade').value = cliente.cidade
    document.getElementById('nome').dataset.index = cliente.index
}

const editDelete = (event) => {
    if (event.target.type === 'button') {
        const [action, index] = event.target.id.split('-');

        if (action === 'edit') {
            const clienteIndex = parseInt(index); // Converta o índice para um número inteiro
            editCliente(clienteIndex); // Chama a função de edição ao clicar em "Editar"
        } else {
            const cliente = readCliente()[index];
            const response = confirm(`Deseja realmente excluir o cliente ${cliente.nome}`);
            if (response) {
                deleteCliente(index);
                atualizaTabela();//atualiza a tabela
            }
        }
    }
}

const editCliente = (index) => {
    const cliente = readCliente()[index];
    cliente.index = index;
    fillFields(cliente);
    document.querySelector(".modal-header>h2").textContent = `Editando ${cliente.nome}`;
    abrirModal()
}

//eventos
//abrir o modal
document.getElementById('cadastrarCliente')
    .addEventListener('click', () => {
        clearFields(); // Limpa os campos do modal
        abrirModal(); // Abre o modal
    });

document.getElementById('modalClose')
    .addEventListener('click', fecharModal);

document.querySelector('#tableClient>tbody')
    .addEventListener('click', editDelete);

document.getElementById('salvar') // Adicione um ID ao botão "Salvar"
    .addEventListener('click', saveCliente); // Chama a função saveCliente ao clicar em "Salvar"

document.getElementById('cancelar')
    .addEventListener('click', fecharModal);

atualizaTabela();









