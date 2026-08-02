# Uril de Cabo Verde — versão 1.0.15

## Chat com o computador

O modo **Contra o computador** passa a apresentar a opção **Chat da IA**:

- **Provocador** — activa a personagem sarcástica;
- **Desligado** — oculta o chat e mantém apenas o jogo.

O chat reage a mensagens livres e ao contexto real da partida. A resposta considera:

- quem iniciou a partida;
- vantagem ou desvantagem no marcador;
- colheitas pequenas ou grandes;
- colheita das seis casas;
- Frouxo;
- pressão sobre o campo do jogador;
- desistência, empate, vitória ou derrota.

A personagem usa troça e insultos ligeiros de jogo, como “nabo” e “idiota”, mas não produz ameaças, ataques discriminatórios nem referências a características pessoais protegidas.

## Arquitectura

O módulo `js/ai-chat.js` funciona localmente no navegador. Não usa OpenAI, Groq ou outro modelo remoto, não expõe chaves e não acrescenta consumo ao Supabase. As mensagens do treino não são guardadas na base de dados.

## Instalação

Não existe migração SQL nesta versão. Sobre a versão 1.0.14, basta substituir os ficheiros da actualização e fazer **Ctrl + F5**.

## Testes

Foram executados 102 testes automáticos, todos aprovados.
