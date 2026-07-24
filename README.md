# Uril de Cabo Verde — Versão Zero

Versão web do Uril de Cabo Verde, preparada para GitHub e GitHub Pages.

## Incluído

- nick sem criação de conta;
- escolha das dez ilhas, com fundo associado;
- jogador contra computador, nos níveis Aprendiz, Amador, Mestre e Grande Mestre;
- dois jogadores no mesmo dispositivo;
- salas online e modo espectador através de Supabase;
- presença com contagem de utilizadores únicos ligados;
- regras cabo-verdianas isoladas no motor;
- contagem de partidas, Quatros e corte por duas vitórias consecutivas;
- visual clássico do tabuleiro preservado;
- sementeira e colheita animadas grão a grão.

## Regras operacionais já aplicadas

- qualquer casa própria com pelo menos uma semente é jogável;
- se o campo adversário estiver vazio, é obrigatória uma jogada que o alimente, quando exista;
- a partida só termina por falta de alimentação quando nenhuma jogada deixa sementes no campo vazio;
- é admitida a colheita das seis casas adversárias;
- o vencedor começa a partida seguinte;
- num empate, volta a começar quem abriu a partida empatada.

## Publicação

O ficheiro `index.html` está na raiz do repositório. Não há compilação nem pasta `dist`.

Consulta [GUIA-GITHUB.md](GUIA-GITHUB.md) para publicar pelo sítio do GitHub, sem linha de comandos.

## Salas online

O modo contra o computador e o modo local funcionam sem serviços externos.

Para activar salas online:

1. criar um projecto Supabase;
2. activar sessões anónimas na área de autenticação;
3. executar `supabase.sql` no SQL Editor;
4. preencher `SUPABASE_URL` e `SUPABASE_ANON_KEY` em `js/config.js`.

## Testes

```bash
npm test
```

A versão 0.0.7 inclui 15 testes automáticos do motor e da inteligência artificial.

## Alteração v0.0.7

- corrige o desaparecimento intermitente das sementes, mantendo as doze casas no DOM e pré-carregando as 16 imagens de sementes;
- aplica correctamente a obrigação de alimentar um campo vazio;
- impede o fim prematuro quando existe uma casa que consegue passar sementes ao adversário;
- reforça a IA com pesquisa progressiva, poda alfa-beta, memória de posições, ordenação táctica e execução num Web Worker;
- altera o segundo nível de `Jogador` para `Amador`;
- conta utilizadores únicos no canal de presença, sem forçar artificialmente o valor mínimo de um jogador.

## Licenças e atribuições

O código específico desta versão pertence à DevNexus Digital.

O tabuleiro fotográfico e as imagens das casas com sementes foram produzidos por Oliver Merkel e reutilizados ao abrigo da licença Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International. Consulta [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md).

## Alterações v0.0.7

- Nas salas online, cada jogador vê sempre o seu próprio campo na fila inferior.
- A disposição é rodada 180 graus para o jogador Norte, sem alterar os índices nem as regras do motor.
- As jogadas online são enviadas por Broadcast logo após a gravação e reproduzidas semente a semente nos dois navegadores.
- As alterações Postgres Realtime continuam activas como via de recuperação.
- Actualizações repetidas são eliminadas por versão e impressão digital do estado da mesa.
