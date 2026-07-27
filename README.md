# Uril de Cabo Verde — 1.0.0

Aplicação web do Uril de Cabo Verde, preparada para GitHub Pages e Supabase.

**Conceito, desenvolvimento e direcção:** Salazar da Cruz  
Desenvolvimento assistido por ferramentas de inteligência artificial.

## O que inclui

- treino privado contra a IA nos níveis Aprendiz, Amador, Mestre e Grande Mestre;
- registo de jogadores com nome, nick, país, ilha para residentes em Cabo Verde e email;
- visitantes sem conta limitados ao treino contra a IA, visualização Live e consulta do arquivo;
- espectadores anónimos identificados dentro de cada banco como `Anónimo 01`, `Anónimo 02`, etc.;
- três partidas de calibração contra a IA para estimar o Elo inicial;
- bancos oficiais criados e disputados apenas por jogadores inscritos e calibrados;
- Elo inspirado no xadrez, actualizado no fim de cada partida oficial entre dois jogadores;
- jogos contra o computador e modo local fora da classificação Elo;
- ranking público com país, ilha quando aplicável, Elo e registo competitivo;
- estados Live, ainda aberto, interrompido, concluído e abandonado;
- batimentos de presença e recuperação de partidas interrompidas;
- arquivo paginado com pesquisa por banco, jogador, país ou ilha, datas, resultado e ocorrências como Capote, Frouxo e Quatro;
- uma linha própria por jogada oficial na base de dados;
- consulta cronológica com controlador, lista de jogadas e análise Minimax;
- validação das jogadas oficiais numa Supabase Edge Function;
- chat em tempo real não arquivado;
- Português, Francês e Inglês;
- design adaptado a computador e telemóvel;
- 12 casas jogáveis e dois depósitos laterais para as sementes ganhas.

## Segurança e classificação

O navegador envia apenas a acção escolhida numa partida oficial. A Edge Function confirma a identidade, o banco, o jogador, a vez, a versão da posição e aplica as regras do Uril no servidor.

A chave `SUPABASE_SERVICE_ROLE_KEY` fica exclusivamente no ambiente da Edge Function. Nunca deve entrar em `js/config.js`, no GitHub ou no navegador.

O Elo muda apenas quando:

1. os dois participantes têm conta;
2. os dois concluíram os três testes de calibração;
3. a partida pertence a um banco oficial classificado;
4. o resultado ainda não foi registado para essa partida.

Durante os primeiros dez jogos oficiais, o jogador mantém Elo provisório e usa um factor de ajuste maior.

## Ficheiros de instalação

- `supabase-v1.0.0.sql` — migração integral da base de dados;
- `supabase.sql` — cópia da mesma migração;
- `supabase/functions/uril-official-move/` — validação oficial das jogadas;
- `js/config.js` — URL e chave pública do Supabase;
- `GUIA-GITHUB.md` — publicação e activação.

## Testes

```bash
npm test
```

Os testes cobrem o motor, Fogo/Frouxo, alimentação, Capote, Quatro, perspectivas, IA, Elo, calibração, contas, presença, arquivo, consulta, análise e estrutura do backend oficial.

## Regras específicas já implementadas

- distribuição anti-horária e salto da casa de origem após uma volta completa;
- colheita consecutiva de casas adversárias com duas ou três sementes;
- alimentação obrigatória quando o campo adversário está vazio;
- Fogo válido apenas quando quem colheu as seis casas já não consegue alimentar na jogada seguinte;
- Frouxo e derrota quando ainda existe alimentação depois de dar Fogo;
- repetição tripla: cada jogador conserva as sementes do próprio campo;
- Capote abaixo de 12 sementes, valendo duas partidas;
- contagem contínua depois do Quatro e regras de corte já definidas no motor.

## Licenças

Consulta `THIRD-PARTY-NOTICES.md`. O código específico e o conceito desta aplicação seguem a indicação de autoria existente no rodapé e em `COPYRIGHT.txt`.


## Versão 1.0.1
Corrige a contagem dos Quatros e restaura as sementes clássicas do código inicial.


## Versão 1.0.2

Correcção visual das sementes clássicas, que estavam ocultas por uma regra CSS anterior com maior especificidade.
