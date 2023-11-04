<!-- 
link icones titulo:

https://github.com/ikatyang/emoji-cheat-sheet#smileys--emotion
 -->

<!-- banner -->
<img src="https://user-images.githubusercontent.com/111146527/184427724-57d0a08f-7d48-45d6-a5ea-32016851ab84.png" width="100%" alt="MetaBuilders">
<span><img src="https://github.com/meta-build/field-crew-manager/assets/111146527/39cbc58a-44e5-477a-b58a-927e3dd8cd2f" width="100%" alt="Fatec Instituto Jessen Vidal"></span>

<!-- cabeçalho -->
<h4>Aprendizagem por projeto Integrado <h1>FCManager</h1></h4>

<!-- resumo do projeto -->
<p>
    O FCManager foi um projeto destinado à empresa Imagem Geosistemas. Consiste em um aplicativo de campo para gerenciamento de equipamentos de campo em uso de manobras. Em seu desenvolvimento, foi utilizado React Native para as interfaces, linguagem typescript para o servidor API aliado com MongoDB para armazenamento de dados. Para organização e gerenciamento do projeto, foi utilizado principalmente a metodologia SCRUM.
</p>

<!-- objetivo -->
## :dart: Objetivo
<p>
    O objetivo desse projeto é de melhorar o gerenciamento de equipamentos usados em campo durante a realização de consertos e manobras por funcionários de outras áreas. Consistindo em uma administração dos equipamentos, manobras realizadas e dos usuários cadastrados no sistema.
</p>

<!-- backlog -->
## :repeat: Backlog
<!-- Versões anteriores:<br>
<a href='https://user-images.githubusercontent.com/90328897/229401867-6c327c67-188d-41d4-a167-153cb717ef4c.png'>v1.0</a>
<br><br>
Versão atual (v3.0) <br> -->
![backlog-novo](https://github.com/meta-build/field-crew-manager/assets/111146527/cf0c3e3a-7737-4354-897e-d4898a45d1b3)


<h2 style="font -weight: bold; margin=bottom: margin-bottom: 0px">
    Sprints:
</h2>

### Sprint 1
<p>
A entrega da primeira sprint do projeto marcou um importante marco, concentrando-se na funcionalidade fundamental de criação, edição, ativação e desativação de equipamentos, juntamente com a capacidade de listar esses itens. Essas conquistas iniciais representam a base sólida sobre a qual construiremos as futuras etapas do projeto, prometendo maior eficiência e controle na gestão de equipamentos. Para uma visão mais detalhada dessas realizações, você pode conferir a apresentação em vídeo desta sprint <a href="https://www.youtube.com/watch?v=jTcLtERkjKo">aqui.</a>
</p>

##### Funcionalidades
<ul>
 <li>Cadastro de equipamentos (com fotos, tipo de equipamento, n° serial, observações e cidade em que se encontra;</li>
 <li>Edição de equipamentos;</li>
 <li>Ativação/Desativação de equipamentos;</li>
 <li>Listagem de equipamentos (com filtros de tipo de equipamento e status ativo ou inativo);</li>
</ul>

#### Apresentação das telas
![metabuilders-apres-projeto](https://github.com/meta-build/field-crew-manager/assets/111146527/773003df-d09b-42a8-8dd4-8c294615d49c)

### Sprint 2
<p>
 Na segunda sprint do projeto, avançamos significativamente na construção da aplicação. Foram implementados recursos essenciais, como o sistema de gerenciamento de usuários, que permite o cadastro, edição e atribuição de privilégios administrativos. A autenticação agora é um elemento central, garantindo a segurança do acesso à aplicação. Além disso, introduzimos o gerenciamento de manobras, onde cada manobra pode envolver um número variável de equipamentos. Uma característica notável é que, ao cadastrar uma manobra, os equipamentos selecionados são automaticamente desativados, e quando a manobra é marcada como concluída, eles são reativados. Uma regra importante estabelecida é que um usuário pode cadastrar apenas uma manobra por vez, assegurando um controle eficaz das operações. Essas adições são fundamentais para a funcionalidade geral do projeto, tornando-o mais completo e eficiente.
</p>

#### Funcionlalidades
<ul>
 <li>Cadastro de usuários (somente administrador)</li>
 <li>Edição de usuários (somente administrador)</li>
 <li>Autenticação (login)</li>
 <li>Alterar senha</li>
 <li>Editar próprios dados</li>
 <li>Cadastro de manobras</li>
 <li>Listagem de manobras</li>
 <li>Ativação/desativação automática de equipamentos ao criar/conlcuir manobra</li>
 <li>Listagem de manobras na tela de equipamento</li>
</ul>

#### Apresentação das telas
##### Usuários
![usuarios](https://github.com/meta-build/field-crew-manager/assets/111146527/16b320f8-b4b0-4bb0-aace-8d04edd2ddc3)

##### Manobras
![manobras](https://github.com/meta-build/field-crew-manager/assets/111146527/556c4400-5da2-4356-8911-0e5223c4cfce)

### Sprint 3
<p>
 Na terceira sprint do nosso projeto, direcionamos nossos esforços para aprimorar a funcionalidade de mapas no aplicativo. Introduzimos telas de mapas que permitem aos usuários localizar facilmente equipamentos e manobras. Também implementamos telas de mapas nas quais os usuários podem selecionar a localização do equipamento ou manobra diretamente nos formulários de cadastro de edição, tornando o processo mais intuitivo e eficiente. Além disso, incorporamos um filtro de distância máxima, que oferece aos usuários a capacidade de personalizar a busca por equipamentos com base na proximidade, proporcionando flexibilidade e praticidade. Aumentamos ainda o limite de manobras ativas por usuário para 10, ampliando a utilidade do aplicativo. Para reforçar a segurança, aprimoramos o processo de autenticação, agora exigindo que os usuários insiram sua senha sempre que minimizarem e abrirem novamente o aplicativo. Essas melhorias representam um avanço significativo em termos de funcionalidade e segurança.
</p>

#### Funcionalidades
<ul>
 <li>Visualização dos equipamentos e manobras em mapas</li>
 <li>Visualização individual do equipamento ou manobra no mapa</li>
 <li>Filtro de distância máxima</li>
 <li>Seleção de localização no cadastro/edição de manobras e equipamentos</li>
 <li>Poder de cadastrar até 10 manobras ativas simultaneamente</li>
 <li>Autenticação ao minizar e retornar ao app</li>
</ul>

#### Apresentação das telas
##### Autenticação ao minizar e retorar ao app
![1-gravacao-autenticacao-ao-retornar](https://github.com/meta-build/field-crew-manager/assets/111146527/79bf5f0a-d7ef-42cc-927d-55b0e6825137)

##### Localização de equipamentos/manobras em mapas
![2-gravacao-mapas](https://github.com/meta-build/field-crew-manager/assets/111146527/1dde2b07-3eeb-4da9-be2d-0dd3def3306c)

##### Seleção de localização nos formulários de criação/edição de manobras e equipamentos
![3-gravacao-criar-manobra-equipamento ‐ Feito com o Clipchamp](https://github.com/meta-build/field-crew-manager/assets/111146527/0ca9578e-4cfc-4bf1-9441-b47e8c55618d)

##### Filtro de distância máxima entre usuário e equipamento/manobra
![4-gravacao-filtro-buffer](https://github.com/meta-build/field-crew-manager/assets/111146527/68825c74-2b4b-47e1-ae31-712837326764)

##### Limite de cadastro de manobras ativas simultâneas
![5-gravacao-max-manobras](https://github.com/meta-build/field-crew-manager/assets/111146527/3d7ed258-b2d2-432c-9875-ec39351f3ff1)


<!-- tecnologias -->
## :computer: Tecnologias utilizadas
<!-- 
badges: https://dev.to/envoy_/150-badges-for-github-pnk

modelo: 
<img src="cole-link-aqui" style="border-radius: 8px">
-->
### Front-end
<span> <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB"> </span>
<span> <img src='https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white'> </span>

### Back-end
<span> <img src='https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white'> </span>
<span> <img src='https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white'> </span>

### Planejamento
<span> <img src="https://img.shields.io/badge/Slack-4A154B?style=for-the-badge&logo=slack&logoColor=white"> </span>
<span> <img src='https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white'> </span>
<span> <img src='https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white'> </span>

## :busts_in_silhouette: Equipe
<!-- scrum master -->
<div>
<span>
<!--link github aqui -->
 <a href="https://github.com/RodrigoDGoulart">
 <!-- card aqui -->
  <img src="https://user-images.githubusercontent.com/111146527/227824022-e663d388-5db0-4900-9d9c-05a98872277f.png" width="350px">
 </a>
</span>

<!-- product owner -->
<span>
<!--link github aqui -->
 <a href="https://github.com/WallaceMarinho">
 <!-- card aqui -->
  <img src="https://user-images.githubusercontent.com/111146527/227824051-5366357b-ce70-4051-9bf5-36f262235784.png" width="350px">
 </a>
</span>
</div>

<br>

<!-- dev -->
<span>
<!--link github aqui -->
 <a href="https://github.com/AnaPaulaSOliveira">
 <!-- card aqui -->
  <img src="https://github.com/meta-build/field-crew-manager/assets/111146527/41ff1408-797e-4cac-b025-7e7976cf8e8c" width="350px">
 </a>
</span>

<span>
<!--link github aqui -->
 <a href="https://github.com/Rafael-Caje">
 <!-- card aqui -->
  <img src="https://user-images.githubusercontent.com/111146527/227824336-bbf12637-6a8f-4ae7-93c8-c7cc08da621f.png" width="350px">
 </a>
</span>

<span>
<!--link github aqui -->
 <a href="https://github.com/William2819">
 <!-- card aqui -->
  <img src="https://user-images.githubusercontent.com/111146527/227824530-56baae99-7d2f-469a-9157-4cf0816dab30.png" width="350px">
 </a>
</span>

<!--
## :page_facing_up: Licença MIT
Este projeto está sob a licença MIT. <a href=""> Clique aqui</a> para mais detalhes.
-->
