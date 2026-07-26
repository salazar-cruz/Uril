# Uril Cabo Verde v0.0.15

## Sugestões públicas na página

- O botão **Sugestões** leva agora a um mural público integrado na própria página.
- Cada sugestão mostra o nick, a ilha, a data e a hora de publicação.
- Todos os visitantes com sessão anónima conseguem ler as sugestões e responder.
- As respostas aparecem por baixo da sugestão, também identificadas pelo nick, ilha, data e hora.
- Sugestões e respostas ficam guardadas no Supabase e actualizam-se em tempo real.
- O conteúdo introduzido pelos utilizadores é apresentado como texto, sem executar HTML.
- O antigo envio por correio electrónico foi retirado.

## Actualização do Supabase

Num projecto existente, executar no SQL Editor:

```text
supabase-sugestoes-v0.0.15.sql
```

O ficheiro cria as tabelas `uril_suggestions` e `uril_suggestion_replies`, as políticas RLS e a publicação Realtime.
