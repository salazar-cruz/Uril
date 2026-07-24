# Publicar no GitHub e GitHub Pages

## 1. Criar o repositório

1. Entra no GitHub.
2. Selecciona **New repository**.
3. Nome sugerido: `uril-cabo-verde`.
4. Selecciona **Public**.
5. Não acrescentes README, `.gitignore` ou licença, porque já vêm no pacote.
6. Cria o repositório.

## 2. Carregar o pacote

1. Descompacta o ZIP.
2. No repositório vazio, selecciona **uploading an existing file** ou **Add file → Upload files**.
3. Arrasta todo o conteúdo da pasta descompactada, incluindo `assets`, `js`, `tests`, `index.html`, `CNAME` e os restantes ficheiros.
4. Confirma em **Commit changes**.

O `index.html` deve ficar directamente na raiz do repositório, e não dentro de outra pasta.

## 3. Activar o GitHub Pages

1. Abre **Settings → Pages**.
2. Em **Build and deployment**, escolhe **Deploy from a branch**.
3. Selecciona a branch `main` e a pasta `/(root)`.
4. Grava.

A primeira publicação costuma demorar alguns minutos.

## 4. Ligar o subdomínio

Este pacote já inclui o ficheiro `CNAME` com:

`uril.devnexusdigital.com`

No gestor DNS do domínio, cria um registo:

- Tipo: `CNAME`
- Host: `uril`
- Destino: `salazar-cruz.github.io`

Depois regressa a **Settings → Pages**, confirma o domínio personalizado e activa **Enforce HTTPS** quando a opção surgir disponível.

## 5. Activar as salas online

1. Cria um projecto Supabase.
2. Abre o **SQL Editor**.
3. Cola e executa o conteúdo de `supabase.sql`.
4. Em **Project Settings → API Keys**, copia o URL do projecto e a chave pública `Publishable key` (`sb_publishable_...`).
5. Abre `js/config.js` no GitHub, selecciona o lápis e preenche:

```js
export const SUPABASE_URL = 'COLOCAR_AQUI_O_URL';
export const SUPABASE_ANON_KEY = 'COLOCAR_AQUI_A_CHAVE_PUBLICA';
```

6. Grava a alteração.

A chave pública fica no navegador por desenho do Supabase. Nunca coloques a `Secret key` no repositório. A protecção das tabelas assenta nas políticas RLS incluídas em `supabase.sql`.
