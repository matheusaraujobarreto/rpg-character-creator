# Repositorio de RPG

Projeto pessoal para aprender desenvolvimento backend construindo uma API para campanhas e personagens de RPG.

Para retomar rapidamente o trabalho, consulte [STATUS_DO_PROJETO.md](STATUS_DO_PROJETO.md), que registra a etapa atual, decisões e próximos passos.

## Base funcional do backend

Nesta primeira etapa, o objetivo e somente:

1. Criar e utilizar um ambiente virtual Python.
2. Instalar as dependencias da API e de desenvolvimento.
3. Iniciar o FastAPI.
4. Acessar `GET /health`, listar, consultar, criar e atualizar personagens em memória e explorar `/docs`.
5. Executar os testes automatizados com `pytest`.

O frontend é servido pela API em `/site` e já usa os endpoints temporários de personagens. A API não se conecta ao PostgreSQL e os registros desaparecem quando o processo reinicia.

## Estrutura inicial

- `backend/app/main.py`: ponto de entrada da API.
- `backend/app/api/`: espaço reservado para organizar futuras rotas HTTP.
- `backend/app/schemas/`: futuros contratos de dados e validacoes.
- `backend/app/core/`: futuras configuracoes compartilhadas.
- `backend/app/db/`: conexao com o banco e base dos modelos.
- `backend/tests/`: testes automatizados.
- `frontend/`: interface HTML, CSS e JavaScript servida pela API em `/site`.
- `docs/`: anotacoes e decisoes de aprendizado.

## Como iniciar a primeira rota

No PowerShell, dentro da pasta `backend`:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -e ".[dev]"
python -m pytest
python -m uvicorn app.main:app --reload
```

O health check retorna HTTP 200 e `{"status":"ok"}`. Personagens podem ser listados em `GET /characters`, consultados por ID, criados em `POST /characters` e atualizados em `PUT /characters/{id}`; os dados desaparecem ao reiniciar a aplicação. Abra `http://127.0.0.1:8000/docs` para explorar as rotas e `http://127.0.0.1:8000/site/index.html` para abrir o site.

Para iniciar no Windows, execute `start-dev.bat` dentro da pasta `backend`, ou use `..\backend\start-dev.bat` a partir da raiz do projeto. O script cria `.venv` quando necessário, instala/atualiza as dependências declaradas no projeto e inicia o servidor usando o Python do ambiente virtual. Na primeira execução, a instalação exige acesso ao índice de pacotes Python.

## Frontend demonstrativo

O frontend usa HTML, CSS, JavaScript e ilustrações locais, sem framework, build ou dependências externas. Além dos SVGs, `frontend/assets/images/` contém seis artes fornecidas em PNG; a tela de magias ainda não existe e sua arte está reservada. O salão inclui um criador demonstrativo de personagens em quatro etapas e fichas em um grimório visual. Quando a interface precisar de mais estado e fluxos, podemos reavaliar um framework.

Inicie `backend/start-dev.bat` e depois execute `frontend/abrir-demonstracao.bat`. O login fica em `http://127.0.0.1:8000/site/login.html`, o salão em `/site/index.html`, e a API interativa em `/docs`.

Os nomes, campanhas e usuário continuam demonstrativos. O login só verifica preenchimento; não existe conta, senha válida, sessão ou proteção de página. Personagens usam GET/POST/PUT da API, mas ficam apenas na memória do servidor e desaparecem ao reiniciá-lo. A API armazena apenas nome, raça, classe e nível; outros campos do criador ainda são ilustrativos. As ações de criar campanha e conta continuam demonstrativas.

## Banco de dados

O projeto está planejado para usar PostgreSQL, mas a API desta etapa não se conecta ao banco. Não é necessário configurar ou iniciar o PostgreSQL para executar `/health`. A conexão fica preparada em `backend/app/db/session.py` para uma etapa posterior; ainda não há configuração Docker nesta base.

```powershell
docker compose up -d db
```

Quando a integração com o banco for implementada, documentaremos as variáveis necessárias e como configurar o banco antes de habilitar essa conexão.
