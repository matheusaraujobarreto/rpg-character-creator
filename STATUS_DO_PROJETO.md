# Estado do projeto

**Atualizado em:** 26/10/2026  
**Etapa atual:** prévia mobile servida pelo FastAPI e conectada às rotas de personagens em memória.

Este arquivo é o ponto rápido de retomada do projeto: registra onde estamos, decisões relevantes, limitações conhecidas e o próximo passo sugerido. O `README.md` continua sendo a referência para instalação e execução.

## Onde estamos

O repositório tem uma API FastAPI e uma prévia conectada para ler e gravar personagens. Ainda não há persistência no banco de dados.

### Backend

- `backend/app/main.py` expõe `GET /health`, `GET /characters`, `GET /characters/{id}`, `POST /characters` e `PUT /characters/{id}`. Também serve o frontend em `/site`. Personagens ficam em memória.
- A documentação OpenAPI está disponível em `/docs` quando a API está rodando.
- Há quatro testes em `backend/tests/test_health.py`, cobrindo health check, documentação/OpenAPI e o fluxo básico de personagens. GET/POST/PUT foram verificados manualmente via PowerShell.
- O schema `CharacterCreate` valida os dados enviados ao POST. Módulos de banco estão preparados, mas ainda não são usados pelas rotas.
- PostgreSQL, autenticação, autorização e CRUD ainda não estão implementados.

### Frontend

- `frontend/index.html` apresenta o salão responsivo e carrega personagens da API; abrir ficha usa GET por ID, criação usa POST e edição usa PUT.
- `frontend/login.html` apresenta a entrada cinematográfica com o arquivo medieval fornecido, transição curta para o salão e validação de preenchimento. Não autentica nem protege páginas.
- O criador embutido no salão tem quatro etapas: identidade, aparência, atributos e história/revisão. A etapa de identidade lista as 13 classes com suas artes locais; selecionar uma classe troca a imagem da prévia e da ficha. Sair pelo botão de retorno ou pela navegação pede confirmação e avisa que os dados serão descartados; cancelar preserva o preenchimento.
- A API aceita nome, raça, classe e nível, mas mantém os registros somente enquanto o processo está ligado. Retrato, atributos, origem e história seguem demonstrativos.
- `frontend/styles.css` reúne paleta, componentes, animações, estados de foco, responsividade e suporte a `prefers-reduced-motion`.
- A navegação mobile abre a barra lateral com botão animado e camada de fundo; o criador tem transições direcionais entre etapas e animações nas escolhas.
- A opção Campanhas mostra um aviso de recurso futuro; o conteúdo visual demonstrativo permanece sem fluxo de campanha funcional.
- `frontend/assets/` contém ilustrações SVG locais e seis artes PNG recebidas em `frontend/assets/images/`. O salão, login, criador e capas das campanhas demonstrativas já as utilizam; o retrato genérico também serve de fallback. A arte da biblioteca de magias está reservada porque essa página ainda não existe. `assets/images/characters_figs/` reúne os 13 retratos usados pela seleção de classe. Os PNGs foram preservados: os arquivos fornecidos não são WebP, e trocar só a extensão não converteria o formato.
- `frontend/abrir-demonstracao.bat` permanece como o caminho recomendado para abrir o salão no navegador padrão do Windows.
- O FastAPI serve a interface em `/site`, na mesma origem que os endpoints, dispensando CORS na prévia local. PostgreSQL ainda não é usado.

## Decisões relevantes

- **Frontend sem framework:** esta experiência ainda pode ser servida por arquivos estáticos. HTML, CSS, JavaScript e SVG local evitam build e dependências de terceiros; podemos reavaliar quando o estado e os fluxos crescerem.
- **Site e API na mesma origem local:** FastAPI serve os arquivos em `/site`; assim o navegador chama `/characters` sem configurar CORS. Se frontend e backend forem hospedados separadamente, precisaremos permitir as origens específicas do frontend.
- **Dados e ações demonstrativos:** campanhas, personagens e usuário são fictícios. Login e criação de campanhas não são funcionalidades reais; o personagem do assistente existe apenas enquanto a página atual estiver carregada.
- **Artes locais:** as seis imagens fornecidas permanecem em PNG com os nomes originais. A interface as referencia localmente e não depende de hospedagem externa; conversão para WebP fica pendente de uma ferramenta de imagem disponível.
- **Abertura pelo Windows:** inicie `backend/start-dev.bat` e depois `frontend/abrir-demonstracao.bat`; o navegador abre o login servido pelo FastAPI.

## Verificações conhecidas

- Em 26/10/2026, GET/POST/PUT foram exercitados via PowerShell; a listagem, detalhe, criação e edição passaram, e IDs inexistentes/corpos inválidos retornaram 404/422. `/site/login.html`, `/site/index.html` e `/site/app.js` responderam 200; o fluxo POST→PUT→GET também passou.
- `node --check frontend/app.js`, balanceamento do CSS e `python -m pytest -q` passaram; a suíte atual tem quatro testes e terminou com `4 passed`.
- Em 26/10/2026, `node --check frontend/app.js` passou; as 13 classes têm imagem local correspondente; os 13 JPG/WebP passaram pela checagem de assinatura; referências HTML, diálogo de saída e balanceamento do CSS passaram na verificação estática.
- JavaScript: `node --check frontend/app.js` passou em 22/10/2026.
- Os quatro SVGs passaram pela leitura XML; referências locais dos arquivos principais existem, chaves do CSS estão balanceadas e não foram encontrados imports/fontes/CDNs externos.
- O usuário confirmou que `frontend/abrir-demonstracao.bat` abre a prévia.
- A inspeção visual automatizada não foi concluída: a ferramenta de navegador não conseguiu identificar a URL ativa com confiança e encerrou o controle por segurança. Layouts desktop e móvel ainda precisam de revisão visual manual.
- Em 22/10/2026, `python -m pytest -q` foi tentado em `backend/`, mas não iniciou porque o Python ativo não tem o pacote `pytest` instalado (`No module named pytest`). A tentativa anterior, em 21/10/2026, coletou os dois testes, mas ficou parada em `test_health_returns_ok` e foi interrompida. Portanto, a suíte continua **pendente**; não considerar os testes aprovados.

## Próxima etapa sugerida

Avaliar a prévia abrindo `frontend/abrir-demonstracao.bat`: percorrer as 13 classes, conferir a troca de retrato, testar cancelar e confirmar a saída e revisar o layout em desktop e celular. Depois decidir quando introduzir o salvamento de rascunhos.

Depois da avaliação visual, retomar o aprendizado de backend com uma rota pequena de personagens em memória e repetir a suíte backend, que ainda está pendente. A interface não deve ser conectada à API até essa etapa ser decidida.

## Histórico de marcos

- **09/09/2026 — Base da API:** estrutura inicial FastAPI e testes do health check/documentação. Há também preparação inicial para configurações, schemas e banco, sem persistência ativa.
- **21/10/2026 — Prévia visual:** criação das páginas de login e painel responsivos, com dados fictícios e ações demonstrativas. Backend preservado e sem integração.
- **22/10/2026 — Abertura local simplificada:** diagnóstico de que o Live Server não estava respondendo na porta usada; adicionado `abrir-demonstracao.bat` para abrir o HTML diretamente. Funcionamento confirmado pelo usuário.
- **22/10/2026 — Redesign medieval:** identidade de grimório com ilustrações SVG locais, login cinematográfico, salão editorial, ficha em diálogo e criador demonstrativo de quatro etapas. Criações permanecem apenas na memória da página; backend inalterado.
- **26/10/2026 — Artes do universo visual:** integradas as imagens PNG fornecidas ao salão, login, criador, capas demonstrativas de campanha e fallback de retrato. A arte de magias permanece reservada para uma futura tela; backend inalterado. Conversão para os destinos WebP originalmente especificados ainda não foi feita porque não há conversor local disponível.
- **26/10/2026 — Classes e descarte do criador:** as 13 classes agora selecionam os retratos em `characters_figs`. O retorno ao salão e os links laterais pedem confirmação; cancelar mantém os dados na tela, confirmar descarta o formulário temporário. Rascunhos ainda não são salvos; backend inalterado.
- **22/10/2026 — Revisão do redesign:** verificação sintática do JavaScript, XML dos SVGs, referências locais, balanceamento do CSS e ausência de dependências externas passou. A suíte backend não rodou por falta de `pytest`; validação visual pelo navegador segue pendente.

## Quando atualizar este arquivo

Atualize este documento ao concluir uma etapa funcional, tomar uma decisão de arquitetura, mudar como o projeto é executado ou descobrir uma limitação que afete o próximo passo. Em cada atualização relevante:

1. ajuste “Onde estamos” para refletir o estado atual;
2. registre o marco e a data no histórico;
3. atualize verificações e limitações se o resultado mudou;
4. mantenha uma próxima etapa sugerida, sem registrar pequenas correções de texto, estilo ou erros triviais.
