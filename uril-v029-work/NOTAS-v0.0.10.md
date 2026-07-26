# Notas da versão 0.0.10

## Presença online corrigida

- A entrada de um novo jogador passa a surgir imediatamente nos ecrãs já ligados.
- Ao entrar, o novo jogador recebe os utilizadores que já estão no sítio.
- Os estados incluem Livre, Contra o computador, Jogo local, À espera num banco, A jogar num banco e A ver jogar.
- A presença é renovada de 12 em 12 segundos e recuperada quando o separador volta ao primeiro plano.
- Cada separador tem um identificador de ligação próprio, mesmo quando o navegador reutiliza a mesma sessão anónima Supabase.
- Um anúncio por Broadcast complementa a presença nativa do Supabase e reduz falhas de actualização.

## Instalação

Substituir os ficheiros da correcção no repositório e fazer `Ctrl + F5` nos navegadores. Não é necessário executar novamente o `supabase.sql`.
