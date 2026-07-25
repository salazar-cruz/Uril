# Notas da versão 0.0.11

## Idiomas

A interface passa a estar disponível em **Português, Francês e Inglês**. A escolha é guardada no navegador e aplica-se ao átrio, bancos de Uril, ajuda, mensagens da partida, presença online e chat.

## Identidade do jogo

O átrio e a ajuda explicam que o **Uril é a variante praticada em Cabo Verde** da grande família africana de jogos conhecida por nomes como **Ayo, Awalé e Oware**. A implementação mantém as regras cabo-verdianas validadas para este projecto.

## Convites WhatsApp

Dentro de um banco de Uril online existem duas opções:

- **Convidar para jogar** — disponível enquanto o banco aguarda o segundo jogador;
- **Convidar para assistir** — disponível tanto em espera como durante a partida.

O WhatsApp recebe uma mensagem já preparada e um link directo para o banco. O destinatário escolhe nick e ilha antes de entrar. Se um convite para jogar for aberto quando o banco já estiver ocupado, a pessoa entra como espectador.

## Instalação

Não existem alterações à base de dados nem ao ficheiro `supabase.sql`. Para actualizar uma instalação existente, substituem-se apenas os ficheiros do pacote de correcção e conserva-se `js/config.js`.

## Testes

A versão inclui **32 testes automáticos**, incluindo traduções, identificação cultural do Uril e os dois tipos de convite WhatsApp.
