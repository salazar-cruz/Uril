# Uril de Cabo Verde — Versão Zero

Versão web do Uril de Cabo Verde, preparada para GitHub e GitHub Pages.

## Incluído

- nick sem criação de conta;
- escolha das dez ilhas, com fundo associado;
- jogador contra computador, em quatro níveis;
- dois jogadores no mesmo dispositivo;
- salas online e modo espectador através de Supabase;
- regras cabo-verdianas indicadas para esta versão;
- contagem de partidas, Quatros e corte por duas vitórias consecutivas;
- visual clássico do tabuleiro preservado.

## Publicação

O ficheiro `index.html` está na raiz do repositório. Não há compilação nem pasta `dist`.

Consulta [GUIA-GITHUB.md](GUIA-GITHUB.md) para publicar pelo sítio do GitHub, sem linha de comandos.

## Salas online

O modo contra o computador e o modo local funcionam sem serviços externos.

Para activar salas online:

1. criar um projecto Supabase;
2. executar `supabase.sql` no SQL Editor;
3. preencher `SUPABASE_URL` e `SUPABASE_ANON_KEY` em `js/config.js`.

## Testes

```bash
npm test
```

## Licenças e atribuições

O código específico desta versão pertence à DevNexus Digital.

O tabuleiro fotográfico e as imagens das casas com sementes foram produzidos por Oliver Merkel e reutilizados ao abrigo da licença Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International. Consulta [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md).


## Alteração v0.0.3

- Sementeira animada grão a grão, com bloqueio da mesa até ao fim da jogada.
- Colheita das casas também apresentada de forma progressiva.
- Jogadas recebidas nas salas online são reproduzidas no tabuleiro em vez de surgirem de forma brusca.

## Correcção v0.0.4

- Remove totalmente o bloqueio de casas com uma semente.
- Elimina a obrigação de alimentação na selecção de jogadas.
- Após a colheita das seis casas, a vez passa ao adversário; sem sementes para jogar, a partida termina.
- Acrescenta versionamento aos módulos JavaScript para evitar que o navegador reutilize o motor antigo em cache.


## Alteração v0.0.5

No fim de cada partida, o jogo anuncia o vencedor e o resultado, arruma automaticamente o tabuleiro e dá a primeira jogada da partida seguinte ao vencedor. Em caso de empate, volta a abrir o mesmo jogador que iniciou a partida empatada.
