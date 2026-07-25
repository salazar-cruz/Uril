# Uril de Cabo Verde v0.0.8

## Alterações

- lista lateral dos nicks online;
- estado Livre, À espera, A jogar ou A ver jogar;
- convite directo para um banco de Uril existente ou criado automaticamente;
- terminologia pública “banco de Uril”;
- fim da partida apenas quando deixa de existir jogada válida ou de alimentação;
- eliminação do fim automático aos 25 pontos;
- Capote para o derrotado com menos de 12 sementes;
- Capote vale duas partidas e corta de imediato uma contagem protegida.

## Actualização

Substitui os ficheiros do pacote de correcção nas mesmas pastas do repositório.

O pacote de correcção não inclui `js/config.js`, pelo que as credenciais públicas do Supabase ficam preservadas.

Não é necessário executar novamente `supabase.sql`: a lista de presença e os convites usam o Realtime já activo.
