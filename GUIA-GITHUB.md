# Publicação do Uril 1.0.15

## Actualização da versão 1.0.14

A versão 1.0.15 acrescenta apenas o chat contextual contra o computador. Não exige novo SQL nem nova publicação da Edge Function. Substitui os ficheiros do pacote no ramo `main` e faz uma actualização forçada com **Ctrl + F5**.


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

1. activa autenticação anónima, usada por visitantes, espectadores e partidas privadas entre jogadores anónimos;
2. activa Email/Password para contas permanentes;
3. decide se o email exige confirmação;
4. acrescenta o domínio publicado à lista de URLs permitidos na autenticação.

## 3. Criar ou actualizar a base de dados

1. Abre o **SQL Editor** do Supabase.
2. Numa instalação nova, cola e executa integralmente `supabase-v1.0.0.sql`.
3. Numa instalação que já tinha a versão 1.0.13, executa apenas `supabase-v1.0.14.sql`.

A migração cria ou actualiza:

- contas privadas;
- perfis públicos;
- bancos oficiais;
- batimentos e estados Live;
- arquivo individual de jogadas;
- histórico Elo;
- calibração inicial;
- sugestões e respostas;
- políticas RLS e canais Realtime;
- bancos privados não classificados entre jogadores anónimos;
- tokens de convite e restrição do banco aos dois participantes.

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

Sem esta Edge Function actualizada, o treino contra a IA e a consulta continuam disponíveis, mas as jogadas oficiais e as partidas privadas entre anónimos são recusadas.

## 6. Verificação após a publicação

1. Abre dois navegadores com sessões anónimas diferentes, por exemplo Chrome normal e janela anónima.
2. Confirma que aparecem designações diferentes, como `Anónimo A7C2` e `Anónimo 4F91`.
3. Num dos navegadores, selecciona o outro jogador e carrega em **Convidar**.
4. Confirma que o destinatário recebe o alerta para aceitar ou recusar.
5. Testa primeiro **Recusar** e confirma a mensagem no navegador do anfitrião.
6. Envia um novo convite, aceita e confirma que os dois entram no mesmo banco privado.
7. Faz jogadas dos dois lados e confirma sincronização, animações e chat.
8. Confirma que o banco privado não surge no arquivo e não altera o Elo.
9. Cria depois duas contas de teste, conclui a calibração e confirma que os bancos oficiais continuam a funcionar.
10. Faz uma jogada oficial e confirma uma linha em `uril_moves`; termina a partida e confirma o histórico Elo.

## 7. Actualizações do GitHub

Depois de substituir ficheiros no repositório, actualiza ambos os navegadores com **Ctrl + F5**. A aplicação usa `?v=1.0.15` nos módulos principais para reduzir problemas de cache.
