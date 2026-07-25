# Uril de Cabo Verde — Versão Zero

Versão web do Uril de Cabo Verde, preparada para GitHub Pages.

## Incluído

- nick sem criação de conta;
- escolha das dez ilhas, com fundo associado;
- jogador contra computador nos níveis Aprendiz, Amador, Mestre e Grande Mestre;
- dois jogadores no mesmo dispositivo;
- bancos de Uril online e modo espectador através de Supabase;
- lista lateral dos nicks ligados, actualizada em tempo real, com estado Livre, Contra o computador, Jogo local, À espera, A jogar ou A ver jogar;
- convite directo de um nick livre para um banco já aberto ou para um novo banco;
- presença bidireccional com anúncio imediato, renovação periódica e recuperação quando o separador volta ao primeiro plano;
- perspectiva online com o próprio campo sempre na fila inferior;
- sementeira e colheita animadas grão a grão;
- chat em tempo real dentro de cada banco de Uril;
- interface completa em Português, Francês e Inglês, com preferência guardada no navegador;
- apresentação do Uril como a variante cabo-verdiana da família Ayo/Awalé/Oware;
- convites por WhatsApp para jogar ou assistir directamente a um banco de Uril;
- detecção de repetição tripla para impedir ciclos infinitos;
- contagem de partidas, Capote, Quatros e corte.

## Regras operacionais

- qualquer casa própria com pelo menos uma semente é jogável;
- se o campo adversário estiver vazio, é obrigatória uma jogada que o alimente, quando exista;
- a partida não termina aos 25 pontos;
- joga-se até deixar de existir uma jogada válida ou de alimentação;
- ao repetir-se três vezes a mesma posição com o mesmo jogador na vez, a partida termina e cada jogador conserva as sementes do seu campo;
- é admitida a colheita das seis casas adversárias;
- quem terminar com menos de 12 sementes leva Capote;
- o Capote vale duas partidas na contagem;
- o vencedor começa a partida seguinte;
- num empate, volta a começar quem abriu a partida empatada.

## Publicação

O ficheiro `index.html` está na raiz do repositório. Não existe compilação nem pasta `dist`.

Consulta [GUIA-GITHUB.md](GUIA-GITHUB.md) para publicar pelo sítio do GitHub, sem linha de comandos.

## Bancos de Uril online

O modo contra o computador e o modo local funcionam sem serviços externos.

Para activar os bancos online:

1. criar um projecto Supabase;
2. activar sessões anónimas na área de autenticação;
3. executar `supabase.sql` no SQL Editor;
4. preencher `SUPABASE_URL` e `SUPABASE_ANON_KEY` em `js/config.js`.

Os convites directos e o chat utilizam o canal Realtime do Supabase e não exigem tabelas adicionais. As mensagens do chat não ficam arquivadas.

## Testes

```bash
npm test
```

A versão 0.0.11 inclui 32 testes automáticos do motor, IA, presença, idiomas, convites, interface e perspectivas do tabuleiro.


## Alterações v0.0.11

- acrescenta selector **PT · FR · EN** no topo e traduz a interface, a ajuda, as mensagens do jogo e os estados online;
- explica no átrio e na ajuda que o Uril é a variante praticada em Cabo Verde da família africana **Ayo/Awalé/Oware**;
- acrescenta, dentro de cada banco online, convite WhatsApp para **jogar** enquanto o banco aguarda adversário;
- acrescenta convite WhatsApp para **assistir** a um banco em espera ou a uma partida em curso;
- os links WhatsApp abrem directamente o banco indicado e transportam o idioma escolhido;
- quando um convite para jogar é aberto depois de a partida começar, o convidado entra como espectador em vez de receber um link morto;
- mantém a configuração pública do Supabase e não exige alterações ao SQL.

## Alterações v0.0.10

- corrige a presença para que a entrada e a saída de um jogador se reflictam imediatamente nos restantes ecrãs;
- cada separador usa um identificador de ligação próprio, evitando que sessões anónimas reutilizadas escondam jogadores;
- um jogador recém-chegado recebe a lista completa dos utilizadores já ligados;
- acrescenta anúncio periódico e recuperação da presença ao regressar ao separador;
- mostra os estados **A jogar contra o computador** e **A jogar no modo local**, além dos estados dos bancos de Uril;
- actualiza a contagem e a lista sem recarregar a página;
- mantém os convites dirigidos à ligação certa do jogador.

## Alterações v0.0.9

- termina a partida na terceira repetição da mesma posição, atribuindo a cada jogador as sementes do seu campo;
- corrige o modo local: a camada transparente da fila inferior já não bloqueia os cliques nas casas de Norte;
- acrescenta chat em tempo real aos bancos de Uril, incluindo espectadores;
- reorganiza a ajuda com funcionalidades, bancos, convites, presença, chat, regras e resolução de falhas de sincronização;
- mantém a lista lateral dos nicks online, convites directos, Capote, Quatros e perspectiva individual nos bancos online.

## Licenças e atribuições

O código específico desta versão pertence à DevNexus Digital.

O tabuleiro fotográfico e as imagens das casas com sementes foram produzidos por Oliver Merkel e reutilizados ao abrigo da licença Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International. Consulta [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md).
