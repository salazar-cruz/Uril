# Notas da versão 0.0.9

## Correcções

- Regra anti-ciclo: a terceira repetição da mesma posição, com o mesmo jogador na vez, encerra a partida. Cada jogador soma as sementes que permanecem no seu próprio campo.
- Modo local: as casas de Norte voltam a aceitar cliques. A causa era uma camada transparente da fila Sul sobre toda a imagem do tabuleiro.
- Ajuda: conteúdo reorganizado em funcionalidades, bancos de Uril, jogadores online, convites, chat, regras e sincronização.

## Nova funcionalidade

- Chat ao vivo em cada banco de Uril para jogadores e espectadores.
- Mensagens até 280 caracteres.
- O chat usa Supabase Realtime e não acrescenta tabelas nem alterações ao `supabase.sql`.
- As mensagens não ficam arquivadas e desaparecem ao sair ou actualizar a página.

## Publicação

Para actualizar uma instalação existente, substitui os ficheiros do pacote de correcção e mantém o teu `js/config.js` actual.
