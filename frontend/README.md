# Prévia demonstrativa do frontend

O frontend usa HTML, CSS, JavaScript e SVGs locais, sem framework, build ou chamadas externas.

## Abrir no Windows

Inicie primeiro `backend/start-dev.bat`. Depois execute `abrir-demonstracao.bat` para abrir o login servido pela API. O salão está em `/site/index.html`; a documentação da API, em `/docs`.

## O que a prévia faz

- Mostra um salão de aventuras com campanhas e personagens fictícios.
- Oferece um criador de personagens de quatro etapas, com prévia ao vivo, validação de nome e atributos e uma ficha demonstrativa ao concluir.
- Exibe uma ficha resumida ao selecionar “Abrir ficha”.
- O login valida apenas o preenchimento e faz uma transição visual até o salão.
- A interface se adapta a celulares: o menu lateral abre como painel com botão animado, fundo escurecido e fechamento por toque fora ou Escape.
- As páginas do criador avançam e voltam com transições direcionais; escolhas, retratos e novos personagens têm animações curtas.
- A opção Campanhas e ações ainda não implementadas dão uma mensagem demonstrativa; campanhas continuam sem fluxo funcional nesta etapa.
- A listagem e abertura de fichas usam `GET /characters` e `GET /characters/{id}`; criar usa `POST /characters`; editar usa `PUT /characters/{id}`.

Os dados básicos de personagens vão para a API FastAPI e ficam na memória do processo; reiniciar o backend os apaga. Ainda não há autenticação, persistência no PostgreSQL ou conexão com contas de usuário. A API só armazena nome, raça, classe e nível; história, atributos e retrato seguem ilustrativos nesta fase.

O FastAPI serve também os arquivos estáticos em `/site`, mantendo frontend e API na mesma origem local. Isso evita configuração CORS na prévia. Para abrir o salão sem autenticação, acesse `http://127.0.0.1:8000/site/index.html` com o backend ligado.

Os layouts priorizam telas pequenas, alvos de toque maiores e campos com tamanho adequado para evitar zoom automático em celulares. Animações decorativas respeitam a preferência de movimento reduzido do sistema.

## Artes locais

As imagens em `assets/images/` são PNGs fornecidos para a identidade visual. O salão usa a mesa de aventuras; o login usa o arquivo medieval; o criador usa a mesa de criação; as campanhas demonstrativas usam o mapa como capa padrão; e o retrato genérico é o fallback para personagem sem retrato próprio. A imagem do estudo arcano fica reservada até a criação da biblioteca de magias. Os arquivos permanecem em PNG; o formato WebP pedido nos nomes de destino não foi gerado nesta etapa.


## Classes e saída do criador

A primeira etapa oferece as 13 classes tradicionais de D&D. Os retratos correspondentes vêm de `assets/images/characters_figs/`; ao selecionar a classe, a imagem da prévia e a ficha demonstrativa mudam.

| Classe | Imagem local |
| --- | --- |
| Artífice | `artifice.jpg` |
| Bárbaro | `barbaro.jpg` |
| Bardo | `bardo.jpg` |
| Clérigo | `Anduin_HoW.jpg` |
| Druida | `Malfurion_WotE_Cropped.webp` |
| Guerreiro | `Varian_Wei.webp` |
| Monge | `monge.jpg` |
| Paladino | `uther.jpg` |
| Patrulheiro | `ranger.jpg` |
| Ladino | `Valeera_HoW.webp` |
| Feiticeiro | `sorcerer.jpg` |
| Bruxo | `guldan.jpg` |
| Mago | `medivh.jpg` | O botão de retorno e a navegação lateral abrem uma confirmação: cancelar mantém os campos preenchidos, confirmar descarta a criação. Não existe salvamento de rascunho ainda.
