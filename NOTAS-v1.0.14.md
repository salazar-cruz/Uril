# Uril de Cabo Verde — versão 1.0.14

## Convites entre jogadores anónimos

- Cada sessão anónima recebe uma designação temporária estável, como `Anónimo A7C2`.
- Um jogador anónimo livre consegue convidar outro jogador anónimo livre através da lista online.
- O destinatário recebe um alerta para aceitar ou recusar.
- A recusa é comunicada ao anfitrião e encerra o banco pendente.
- A aceitação abre um banco privado não classificado, restrito aos dois participantes.
- O banco inclui sincronização das jogadas, animações, chat, desistência e partidas seguintes.
- Não há Elo, arquivo público nem espectadores nestes bancos.

## Actualização técnica obrigatória

1. Executar `supabase-v1.0.14.sql` no SQL Editor do Supabase.
2. Voltar a publicar `supabase/functions/uril-official-move/`.
3. Publicar os ficheiros web no GitHub Pages.
4. Fazer `Ctrl + F5` nos dois navegadores.

## Testes

97 testes automáticos aprovados, sem falhas.
