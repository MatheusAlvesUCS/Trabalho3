function Autenticar() {
    $.ajax({
        url: "https://ucsdiscosapi.azurewebsites.net/Discos/autenticar", 
        method: "POST",
        headers: {
            "ChaveAPI": "8175fA5f6098c5301022f475da32a2aa"
        },
        success: function(response) {
            
            // Aqui, como a resposta é o próprio token, podemos armazená-lo diretamente
            if (response) {
                localStorage.setItem("auth_token", response);
                console.log("Autenticação realizada, token recebido:", response);
            } else {
                console.log("Resposta da autenticação sem token:", response);
            }
        },
        error: function(xhr, status, error) {
            console.error("Erro na autenticação:", xhr.status, xhr.responseText);
        }
    });
  }
  
  // Função para carregar discos
  function carregarDiscos() {
    const token = localStorage.getItem("auth_token");
    console.log("Token recuperado:", token); // Verifique se o token está correto
  
    $.ajax({
      url: "https://ucsdiscosapi.azurewebsites.net/Discos/records",
      method: "GET",
      data: {
          numeroInicio: 1,
          quantidade: 12
      },
      headers: {
          "TokenApiUCS": token // Certifique-se de que o token está sendo passado corretamente aqui
      },
      success: function(response) {
          console.log("Discos carregados com sucesso:", response);
          exibirDiscos(response);
      },
      error: function(xhr, status, error) {
          console.error("Erro ao carregar discos:", xhr.status, xhr.responseText);
      }
  });
  }
  
  // Função para exibir discos na tela
  function exibirDiscos(discos) {
    // Verifica se há discos para exibir
    if (!discos || discos.length === 0) {
        console.log("Nenhum disco encontrado.");
        return;
    }
  
    // Vamos criar um container onde as imagens e descrições serão exibidas
    const container = $('#discosContainer');
    container.empty(); // Limpa o conteúdo anterior
  
    discos.forEach(disco => {
        // Cria o HTML para cada disco
        const discoHTML = `
            <div class="disco">
                <img src="data:image/jpeg;base64,${disco.imagemEmBase64}" alt="Imagem do disco" class="imagem-disco" />
                

                
            </div>
        `;
  
        // Adiciona o HTML criado ao container
        container.append(discoHTML);
    });
  }
  
  // Chama a função para carregar os discos
  carregarDiscos();