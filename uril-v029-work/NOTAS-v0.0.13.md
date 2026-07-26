# Uril Cabo Verde v0.0.14

## Banco contra o computador observável

- Ao iniciar uma partida contra o computador, o jogo cria automaticamente um banco público quando o Supabase está ligado.
- O banco aparece na lista com o estado `PC · AO VIVO`.
- Outros utilizadores entram como espectadores através da lista de bancos, da lista lateral de nicks ou de um convite WhatsApp.
- As jogadas do jogador e da IA são gravadas no Supabase antes da animação local, permitindo reprodução semente a semente nos ecrãs dos espectadores.
- O chat fica disponível ao jogador e aos espectadores.
- O jogador anfitrião consegue retomar o banco contra o computador.
- Ao sair, o banco é encerrado.
- Se a publicação falhar, a partida continua de forma privada.

Não é necessário executar novamente o `supabase.sql`.
