# Publicação do Uril 1.0.0

## 1. GitHub Pages

1. Descompacta o pacote.
2. Carrega **o conteúdo da pasta** para a raiz do repositório GitHub.
3. Confirma que `index.html`, `CNAME`, `.nojekyll`, `assets`, `js` e `supabase` ficam directamente na raiz.
4. Em **Settings → Pages**, selecciona a branch `main` e a pasta `/(root)`.

O pacote inclui:

```text
uril.devnexusdigital.com
```

no ficheiro `CNAME`. O DNS deve manter:

- tipo: `CNAME`;
- host: `uril`;
- destino: `salazar-cruz.github.io`.

## 2. Configurar autenticação no Supabase

No projecto Supabase:

1. activa autenticação anónima, usada apenas para visitantes e espectadores;
2. activa Email/Password para contas permanentes;
3. decide se o email exige confirmação;
4. acrescenta o domínio publicado à lista de URLs permitidos na autenticação.

## 3. Criar a base de dados 1.0.0

1. Abre o **SQL Editor** do Supabase.
2. Cola integralmente `supabase-v1.0.0.sql`.
3. Executa a migração uma única vez.

A migração cria ou actualiza:

- contas privadas;
- perfis públicos;
- bancos oficiais;
- batimentos e estados Live;
- arquivo individual de jogadas;
- histórico Elo;
- calibração inicial;
- sugestões e respostas;
- políticas RLS e canais Realtime.

Os bancos antigos permanecem consultáveis, mas não entram retroactivamente no Elo.

## 4. Configurar a chave pública

Em `js/config.js`, mantém apenas os dados públicos:

```js
export const SUPABASE_URL = 'URL_DO_PROJECTO';
export const SUPABASE_ANON_KEY = 'CHAVE_PUBLICA_PUBLISHABLE';
```

Nunca coloques a chave secreta ou a service role neste ficheiro.

## 5. Publicar a Edge Function oficial

A pasta da função já está incluída:

```text
supabase/functions/uril-official-move/
```

A partir da pasta do projecto, usando a Supabase CLI ligada ao projecto:

```bash
supabase functions deploy uril-official-move
```

O ambiente gerido pelo Supabase deve disponibilizar à função:

- `SUPABASE_URL`;
- `SUPABASE_ANON_KEY`;
- `SUPABASE_SERVICE_ROLE_KEY`.

A service role fica no ambiente protegido da função. Não é copiada para o GitHub.

Sem esta Edge Function, o treino contra a IA e a consulta continuam disponíveis, mas as jogadas oficiais são recusadas.

## 6. Verificação após a publicação

1. Cria duas contas de teste com emails diferentes.
2. Conclui os três testes de calibração em cada conta.
3. Na primeira conta, cria um banco oficial.
4. Na segunda, entra no banco.
5. Abre um terceiro navegador sem login e confirma `Anónimo 01` na lista de espectadores.
6. Faz uma jogada e confirma uma linha em `uril_moves`.
7. Termina uma partida e confirma duas linhas em `uril_rating_history`.
8. Fecha um navegador durante mais de 90 segundos e confirma o estado `interrupted`.
9. Reabre os dois jogadores e confirma a recuperação do estado Live.
10. Consulta a partida e testa o controlador de jogadas e a análise.

## 7. Actualizações do GitHub

Depois de substituir ficheiros no repositório, actualiza ambos os navegadores com **Ctrl + F5**. A aplicação usa `?v=1.0.10` nos módulos principais para reduzir problemas de cache.
