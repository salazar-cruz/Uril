# Uril de Cabo Verde — Versão Zero

Versão web do Uril de Cabo Verde, preparada para GitHub Pages.

## Incluído

- nick sem criação de conta;
- escolha das dez ilhas, com fundo associado;
- jogador contra computador nos níveis Aprendiz, Amador, Mestre e Grande Mestre;
- dois jogadores no mesmo dispositivo;
- bancos de Uril online e modo espectador através de Supabase;
- lista lateral dos nicks online, com estado Livre, À espera, A jogar ou A ver jogar;
- convite directo de um nick livre para um banco já aberto ou para um novo banco;
- presença com contagem de utilizadores únicos;
- perspectiva online com o próprio campo sempre na fila inferior;
- sementeira e colheita animadas grão a grão;
- contagem de partidas, Capote, Quatros e corte.

## Regras operacionais

- qualquer casa própria com pelo menos uma semente é jogável;
- se o campo adversário estiver vazio, é obrigatória uma jogada que o alimente, quando exista;
- a partida não termina aos 25 pontos;
- joga-se até deixar de existir uma jogada válida ou de alimentação, sendo então contabilizadas as sementes restantes;
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

Os convites directos utilizam o canal Realtime do Supabase e não exigem uma tabela adicional.

## Testes

```bash
npm test
```

A versão 0.0.8 inclui 22 testes automáticos do motor, IA e perspectivas do tabuleiro.

## Alterações v0.0.8

- acrescenta a lista lateral dos nicks online e o estado de cada jogador;
- permite convidar um nick livre para um banco à espera ou criar automaticamente um novo banco;
- substitui a terminologia pública “sala” por “banco de Uril”;
- remove o fim automático aos 25 pontos;
- acrescenta o Capote para o derrotado com menos de 12 sementes, valendo duas partidas;
- mantém as correcções de alimentação, animação, presença, perspectiva online e IA das versões anteriores.

## Licenças e atribuições

O código específico desta versão pertence à DevNexus Digital.

O tabuleiro fotográfico e as imagens das casas com sementes foram produzidos por Oliver Merkel e reutilizados ao abrigo da licença Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International. Consulta [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md).
