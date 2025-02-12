const url = 'http://universities.hipolabs.com/search?country=United+States';

//Esta função é executada independente de outra
async function listaUniversidade(letraInicio ='') {
    try {
        //fazer a requisição HTTP
        const response = await fetch(url);

        //converte no formato JSON
        const data = await response.json();

        //processar os dados usando map e filter
        const universityNames = data
            .map(university => university.name)
            .filter(name => name.startsWith(letraInicio))
        //filtrar universidades que começam com a letra especificada
            .sort();
            //selecionar o elemento da lista
            const universityList = document.getElementById('listaUniversidade');
            universityList.innerHTML =''; //limpar a lista
            
            //adicionar os nomes das universidades à lista
            universityNames.forEach(name => {
                const listItem = document.createElement("li");
                listItem.textContent = name;
                universityList.appendChild(listItem);
            });
        } catch (error) {
            console.error("Erro ao construira API:",error);
        }
    }
    //selecionar o botão e adicionar o evento de clique
    const filterButton = document.getElementById('btnFiltrar');
    filterButton.addEventListener('click', () => {
        const entradaFiltro = document.getElementById('txtFiltro').value;
        listaUniversidade(entradaFiltro);
    });

    //chamada da função
    listaUniversidade();