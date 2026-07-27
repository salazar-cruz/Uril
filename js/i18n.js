const DEFAULT_LANGUAGE = 'pt';
const SUPPORTED_LANGUAGES = new Set(['pt', 'fr', 'en']);

const TEXT = {
  pt: {
    metaDescription: 'Uril de Cabo Verde — variante cabo-verdiana da família Ayo/Awalé, com jogo local, computador e bancos online.',
    brandHomeAria: 'Voltar ao início',
    onlinePlayers: 'jogadores online',
    helpAndRules: 'Ajuda e regras',
    live: 'AO VIVO',
    onlineRosterTitle: 'Jogadores online',
    connectingPlayers: 'A ligar ao banco de jogadores…',
    rosterHelp: 'Jogadores inscritos e calibrados recebem convites directos para bancos oficiais.',
    versionZero: 'VERSÃO 1.0',
    heroTitle: 'O jogo tradicional,<br><em>ilha por ilha.</em>',
    heroIntro: 'Treina contra a inteligência artificial ou entra numa conta para disputar partidas oficiais e integrar o ranking Elo.',
    variantLabel: 'AYO · AWALÉ · OWARE',
    variantIntro: 'O Uril é a variante praticada em Cabo Verde da grande família africana Ayo/Awalé/Oware, adaptada às regras e à tradição cabo-verdianas.',
    nickLabel: 'O teu nick',
    nickPlaceholder: 'Ex.: Mindelense77',
    islandLabel: 'A tua ilha',
    backgroundHint: 'O fundo acompanha a ilha escolhida.',
    playNow: 'JOGAR JÁ',
    versusComputer: 'Contra o computador',
    versusComputerDesc: 'Treino privado com quatro níveis de dificuldade. Estas partidas não alteram o Elo oficial.',
    level: 'Nível',
    levelApprentice: 'Aprendiz',
    levelAmateur: 'Amador',
    levelMaster: 'Mestre',
    levelGrandmaster: 'Grande Mestre',
    startMatch: 'Começar partida',
    banksOnline: 'Bancos de Uril online',
    banksOnlineDesc: 'Consulta jogos Live e partidas concluídas. Só jogadores inscritos e calibrados criam ou disputam bancos oficiais.',
    viewBanks: 'Ver bancos',
    sameScreen: 'MESMO ECRÃ',
    twoPlayers: 'Dois jogadores',
    twoPlayersDesc: 'Uma partida de treino local, alternando no mesmo dispositivo, disponível após entrar numa conta.',
    playLocally: 'Jogar localmente',
    openBanks: 'BANCOS ABERTOS',
    urilBanks: 'Bancos de Uril',
    refresh: 'Actualizar',
    bankNamePlaceholder: 'Nome do banco',
    createBank: 'Criar banco',
    setupNotice: 'O arquivo, as contas, o Elo e os bancos oficiais ainda não estão ligados ao Supabase. O treino contra a inteligência artificial continua disponível. Consulta o ficheiro <strong>GUIA-GITHUB.md</strong> para activar a versão 1.0.0.',
    whatsappInviteLabel: 'CONVITE WHATSAPP',
    whatsappInviteDefault: 'Recebeste um convite para um banco de Uril.',
    openWhatsappBank: 'Abrir convite',
    leaveBank: '← Sair do banco',
    match: 'PARTIDA',
    bankOfUril: 'Banco de Uril',
    arrangeNow: 'Arrumar agora',
    quatros: 'QUATROS',
    count: 'CONTAGEM',
    pickedNorth: 'Colhidas por Norte',
    turnSouth: 'Vez de Sul',
    pickedSouth: 'Colhidas por Sul',
    boardAria: 'Tabuleiro de Uril',
    seeds48: '48 sementes · Cabo Verde',
    roundEnded: 'PARTIDA TERMINADA',
    southWon: 'Sul venceu a partida.',
    boardWillReset: 'O tabuleiro será arrumado.',
    matchStarted: 'A partida começou.',
    southStarts: 'Sul joga primeiro.',
    bankStatus: 'ESTADO DO BANCO',
    localMatch: 'Partida local',
    countStarts: 'A contagem começa em 0–0.',
    lastMove: 'ÚLTIMA JOGADA',
    noMoves: 'Ainda não houve jogadas.',
    bankChat: 'CHAT DO BANCO',
    chatEmpty: 'Ainda não há mensagens neste banco.',
    chatPlaceholder: 'Escrever no banco…',
    chatAria: 'Mensagem para o chat',
    send: 'Enviar',
    chatNote: 'As mensagens são transmitidas em tempo real e não ficam arquivadas.',
    whatsappShare: 'CONVIDAR VIA WHATSAPP',
    whatsappShareText: 'Partilha este banco directamente com outro jogador ou com alguém que queira assistir.',
    inviteToPlayWhatsapp: 'Convidar para jogar',
    inviteToWatchWhatsapp: 'Convidar para assistir',
    reminder: 'LEMBRETE',
    reminderText: 'Distribuição anti-horária, sem deixar semente na casa de origem ao completar a volta. Colheita consecutiva de casas com 2 ou 3 sementes.',
    fullRules: 'Ler regras completas',
    assetCredit: 'Referência histórica do visual clássico: Oliver Merkel, licença CC BY-NC-SA 4.0.',
    invitationReceived: 'CONVITE RECEBIDO',
    genericInvite: 'Recebeste um convite para um banco de Uril.',
    decline: 'Recusar',
    enterBank: 'Entrar no banco',
    resignButton: 'Desistir', resignEyebrow: 'DESISTÊNCIA', resignDialogTitle: 'Confirmar desistência', resignDialogPlayer: '{player} está a pedir desistência.',
    resignWarningOne: '{player}, tens {seeds} sementes colhidas. A desistência vale uma partida. Confirma antes de terminar a partida.', resignWarningTwo: '{player}, ainda tens apenas {seeds} sementes colhidas. Como ainda não atingiste 12, a desistência vale duas partidas, como um Capote.',
    keepPlaying: 'Continuar a jogar', confirmResign: 'Confirmar desistência', reasonResignation: 'Desistência de {player}.', reasonFrouxo: 'Frouxo: quem deu fogo perde a partida porque ainda conseguia alimentar o adversário na jogada seguinte.', resignationWin: '{loser} desistiu. {winner} venceu.', resignationResultOne: 'A desistência vale uma partida.', resignationResultTwo: 'A desistência vale duas partidas porque {player} ainda não tinha 12 sementes.',
    roundResignation: '{loser} desistiu. {winner} venceu a partida.', nextResignationOne: 'A desistência vale uma partida. O tabuleiro será arrumado e {player} começa.', nextResignationTwo: 'A desistência vale duas partidas. O tabuleiro será arrumado e {player} começa.', resignError: 'Não foi possível registar a desistência.',
    aiResignEyebrow: 'PEDIDO DO COMPUTADOR', aiResignTitle: 'O computador quer desistir', aiResignWarningOne: '{player} concluiu que já não consegue ganhar e pede desistência por uma partida. Aceitas?', aiResignWarningTwo: '{player} concluiu que já não consegue ganhar e pede desistência por duas partidas, porque ainda tem apenas {seeds} sementes. Aceitas?', rejectAIResign: 'Não aceitar', acceptAIResign: 'Aceitar desistência',
    footerCopyright: '© 2026 Salazar da Cruz', footerConcept: 'Conceito, desenvolvimento e direcção', versionLabel: 'Versão 1.0.0', suggestions: 'Sugestões', suggestionsCommunity: 'COMUNIDADE', suggestionsTitle: 'Sugestões e respostas', suggestionsIntro: 'As sugestões ficam públicas, identificadas pelo nick e pela data. Todos conseguem ler; só jogadores inscritos publicam e respondem.', publishAs: 'Publicar como', suggestionPlaceholder: 'A tua sugestão…', suggestionsPublicNote: 'A sugestão ficará visível para todos os visitantes.', publishSuggestion: 'Publicar sugestão', suggestionsPublished: 'sugestões publicadas', suggestionsEmpty: 'Ainda não há sugestões. Abre a conversa.', suggestionsNeedSupabase: 'Liga o Supabase para publicar e consultar sugestões.', suggestionsLoading: 'A carregar sugestões…', suggestionsMigrationNeeded: 'Executa o ficheiro supabase-v1.0.0.sql no SQL Editor do Supabase.', suggestionsLoadError: 'Não foi possível carregar as sugestões: {error}', suggestionEmpty: 'Escreve primeiro uma sugestão com pelo menos quatro caracteres.', suggestionPublished: 'A sugestão foi publicada.', suggestionPublishError: 'Não foi possível publicar a sugestão: {error}', reply: 'Responder', replyCount: '{count} respostas', replyPlaceholder: 'Escreve uma resposta…', replyAria: 'Responder à sugestão de {nick}', cancelReply: 'Cancelar', publishReply: 'Publicar resposta', replyEmpty: 'Escreve primeiro uma resposta.', replyPublished: 'A resposta foi publicada.', replyPublishError: 'Não foi possível publicar a resposta: {error}',
    signIn: 'Entrar', registerPlayer: 'Registar jogador', signOut: 'Sair',
    heroIntroV1: 'Joga contra a inteligência artificial sem registo. Para disputar partidas oficiais, criar bancos e entrar no ranking Elo, regista uma conta de jogador.',
    playerIdentity: 'IDENTIDADE DO JOGADOR', anonymousVisitor: 'Visitante anónimo', anonymousRights: 'Treino contra a IA e consulta de partidas disponíveis.',
    eloRating: 'Elo', registerToCompete: 'Registar para competir', initialEloTest: 'Avaliação do Elo inicial', startCalibration: 'Iniciar próximo teste',
    calibrationProgress: '{current} de 3 testes concluídos', calibrationComplete: 'Elo inicial estimado: {elo}', calibrationRecorded: 'Teste registado. Elo actual: {elo}.', calibrationRequired: 'Conclui os três testes de calibração contra a IA antes de entrares em partidas oficiais.', completeCalibration: 'Concluir calibração',
    searchGames: 'Pesquisar jogador, país, ilha ou banco', fromDate: 'Desde', toDate: 'Até', resultFilter: 'Resultado', eventFilter: 'Ocorrência', allResults: 'Todos', southWonFilter: 'Vitória de Sul', northWonFilter: 'Vitória de Norte', drawFilter: 'Empate', allEvents: 'Todas', search: 'Pesquisar', createOfficialBank: 'Criar banco oficial',
    loginCreateBank: 'Entra numa conta de jogador para criar ou disputar bancos oficiais.', moveDetails: 'DETALHES DA JOGADA', analyseMove: 'Analisar jogada',
    engineAnalysis: 'ANÁLISE DO MOTOR', analysisNotRun: 'Análise ainda não executada.', moveList: 'LISTA DE JOGADAS', engineStatistics: 'ESTATÍSTICAS DA IA', noEngineStats: 'Ainda sem análise.',
    watchingPlayers: 'A ASSISTIR', officialRanking: 'RANKING OFICIAL', eloLeaderboard: 'Classificação Elo', rankingHelp: 'Apenas partidas entre jogadores inscritos alteram o Elo.',
    playerAccount: 'CONTA DE JOGADOR', enterOrRegister: 'Entrar ou registar', email: 'Email', password: 'Palavra-passe', fullName: 'Nome completo', country: 'País',
    countryPlaceholder: 'Ex.: Cabo Verde', confirmPassword: 'Confirmar palavra-passe', createPlayerAccount: 'Criar conta de jogador', accountCreatedCheckEmail: 'Conta criada. Confirma o email, caso a confirmação esteja activa no Supabase.',
    signedIn: 'Sessão iniciada como {nick}.', signedOut: 'Sessão terminada. Continuas como visitante anónimo.', passwordsDiffer: 'As palavras-passe não coincidem.',
    registrationRequired: 'Esta função está reservada a jogadores inscritos.', localLoginRequired: 'O modo local está disponível depois de entrar numa conta de jogador.',
    pageLabel: 'Página {page} de {pages}', interruptedUpper: 'INTERROMPIDO', abandonedUpper: 'ABANDONADO', statusInterrupted: 'Partida interrompida', statusAbandoned: 'Partida abandonada',
    reviewClassificationBest: 'Melhor jogada', reviewClassificationGood: 'Boa jogada', reviewClassificationInaccuracy: 'Imprecisão', reviewClassificationMistake: 'Erro', reviewClassificationBlunder: 'Erro grave',
    analysisSummary: '{classification}. Melhor casa: {best}. Profundidade {depth}, {nodes} posições, {time} ms.',
    engineStatsSummary: 'Profundidade {depth}/{maxDepth} · {nodes} posições · {time} ms · linha {pv}',
    officialOnly: 'PARTIDA OFICIAL', trainingOnly: 'TREINO', registeredPlayersOnly: 'Só jogadores inscritos', spectatorsAnonymous: 'Os visitantes sem conta aparecem como Anónimo 01, Anónimo 02, etc.',
    eloProvisional: 'provisório', officialGamesCount: '{count} jogos oficiais', leaderboardEmpty: 'Ainda não existem jogadores classificados.',
    feeding: 'Alimentação', gameStartedAt: 'Início: {date}', lastMoveAt: 'Última jogada: {date}', noLastMove: 'Ainda sem jogadas',
    helpVersion: 'AJUDA 1.0.0',
    helpTitle: 'Ajuda, bancos e regras',
    helpContent: `
      <section>
        <h3>O que é o Uril</h3>
        <p>O Uril é a variante praticada em Cabo Verde da grande família de jogos africanos conhecida por nomes como <strong>Ayo</strong>, <strong>Awalé</strong> e <strong>Oware</strong>. Esta versão segue as regras e a tradição cabo-verdianas, não uma regra genérica importada de outra variante.</p>
      </section>
      <section>
        <h3>Começar a jogar</h3>
        <p>Sem conta, entras como visitante anónimo para treinar contra a IA e consultar partidas. Com uma conta de jogador, tens identidade própria, Elo e acesso às partidas oficiais.</p>
        <ul>
          <li><strong>Contra o computador:</strong> níveis Aprendiz, Amador, Mestre e Grande Mestre. É treino privado e nunca altera o Elo.</li>
          <li><strong>Dois jogadores:</strong> Sul e Norte alternam no mesmo dispositivo. As casas da fila superior pertencem a Norte.</li>
          <li><strong>Bancos de Uril online:</strong> jogadores inscritos criam e disputam partidas oficiais; qualquer visitante consegue assistir aos jogos Live e consultar partidas concluídas.</li>
        </ul>
      </section>
      <section>
        <h3>Jogadores, bancos e convites</h3>
        <p>A coluna da esquerda actualiza-se em tempo real quando alguém entra, sai ou muda de modo. Mostra visitantes anónimos e jogadores inscritos, bem como os estados: livre, em treino contra o computador, no modo local, num banco à espera, num banco oficial ou a assistir.</p>
        <p>Um jogador inscrito, calibrado e livre recebe um convite directo pelo próprio jogo. Dentro de um banco oficial, os botões de WhatsApp geram um link directo para jogar ou assistir. O convite para jogar exige entrada numa conta; o convite para assistir também funciona para visitantes anónimos.</p>
        <p>Nos bancos online, cada jogador vê sempre o seu próprio campo na parte inferior. Os espectadores vêem Sul na parte inferior. As jogadas são sincronizadas e animadas semente a semente nos dois navegadores.</p>
      </section>
      <section>
        <h3>Chat do banco</h3>
        <p>O chat aparece dentro de um banco online e está disponível aos dois jogadores e aos espectadores. As mensagens circulam em tempo real, têm um máximo de 280 caracteres e não ficam guardadas na base de dados.</p>
      </section>


      <section>
        <h3>Contas, jogadores anónimos e partidas oficiais</h3>
        <p>Na versão 1.0.0 retirei o nick da página principal. Um visitante sem conta entra apenas como espectador anónimo ou joga contra o computador. Na lista de espectadores, esses visitantes aparecem como <strong>Anónimo 01</strong>, <strong>Anónimo 02</strong> e assim sucessivamente.</p>
        <p>Para criar um banco oficial, aceitar um convite ou jogar contra outra pessoa, exijo uma conta com nome, nick, país e email. A ilha é pedida apenas a quem indicar Cabo Verde como país. O email e o nome completo ficam na área privada da conta; o ranking público mostra o nick, o país, a ilha quando existe, o Elo e o histórico competitivo.</p>
        <p>Eu uso um sistema Elo inspirado no xadrez. As partidas contra o computador são apenas treino e não alteram a classificação. O Elo muda no fim de cada partida oficial entre dois jogadores inscritos. Nos primeiros jogos uso um factor de ajuste maior para a classificação encontrar rapidamente o nível real do jogador.</p>
        <p>Antes das partidas oficiais, o jogador faz três testes obrigatórios de calibração contra a IA. Uso os resultados contra Aprendiz, Amador e Mestre para estimar o Elo inicial. Esta calibração não conta como vitória oficial e serve apenas para evitar que todos comecem exactamente no mesmo nível.</p>
      </section>
      <section class="help-ai-section">
        <h3>Como construí o adversário do computador</h3>
        <p>Eu construí o computador para jogar Uril através de uma pesquisa <strong>Minimax com poda Alpha-Beta</strong>. Em vez de escolher apenas a colheita imediata, eu simulo uma árvore de jogadas: nas jogadas do computador procuro o maior valor possível; nas respostas do humano assumo a resposta que mais prejudica o computador. Assim, o Minimax trabalha com a hipótese de que os dois lados tentam jogar da melhor forma.</p>
        <p><strong>Parte teórica.</strong> Cada nó da árvore representa uma posição do tabuleiro e cada ramo representa uma jogada legal. O computador maximiza a pontuação e o adversário minimiza-a. A poda Alpha-Beta elimina ramos que já não conseguem alterar a decisão final. Também reutilizo posições anteriormente analisadas através de uma tabela de transposições e começo pela melhor jogada encontrada na profundidade anterior.</p>
        <p><strong>Como meço a profundidade.</strong> Eu conto meias-jogadas, também chamadas <em>plies</em>. Profundidade 1 significa apenas uma jogada do computador; profundidade 2 significa a jogada do computador e uma resposta humana; profundidade 24 corresponde, aproximadamente, a doze sequências completas de jogada e resposta.</p>
        <div class="help-levels" role="list" aria-label="Níveis do computador">
          <div role="listitem"><strong>Aprendiz</strong><span>Profundidade 4 · 320 ms</span><small>Força equivalente ao antigo Amador, com 12% de escolhas aleatórias.</small></div>
          <div role="listitem"><strong>Amador</strong><span>Profundidade 8 · 950 ms</span><small>Força equivalente ao antigo Mestre, sem aleatoriedade.</small></div>
          <div role="listitem"><strong>Mestre</strong><span>Profundidade 12 · 2,6 s</span><small>Força equivalente ao antigo Grande Mestre.</small></div>
          <div role="listitem"><strong>Grande Mestre</strong><span>Profundidade 24 · 12 s</span><small>Profundidade máxima duplicada e maior tempo de pesquisa.</small></div>
        </div>
        <p>Eu uso <strong>aprofundamento iterativo</strong>: analiso primeiro a profundidade 1, depois 2, 3 e assim sucessivamente. Quando o tempo termina, conservo a melhor jogada da última profundidade integralmente concluída. Num telemóvel mais lento, o Grande Mestre pode parar antes da profundidade máxima.</p>
        <p><strong>Como avalio uma posição.</strong> Quando não chego ao fim da partida, atribuo uma pontuação à posição. Dou maior peso à diferença de sementes já ganhas (<strong>145</strong>), seguindo-se a pressão de alimentação (<strong>18</strong>), a mobilidade ou quantidade de jogadas legais (<strong>8</strong>), as sementes vulneráveis (<strong>3,2</strong>), o equilíbrio de sementes no tabuleiro (<strong>2,2</strong>), as casas grandes com 12 ou mais sementes (<strong>2,5</strong>) e as casas vazias (<strong>1,4</strong>). Uma vitória vale aproximadamente <strong>+1 000 000</strong> e uma derrota <strong>−1 000 000</strong>, preferindo vitórias mais rápidas e atrasando derrotas inevitáveis.</p>
        <p><strong>Como abordo o Uril.</strong> Eu faço o motor considerar colheitas, alimentação obrigatória, mobilidade, casas vulneráveis, acumulações grandes, repetição tripla, Capote e a regra do Frouxo. Se uma simulação dá fogo quando ainda seria possível alimentar o adversário na jogada seguinte, o motor recebe imediatamente essa posição como derrota por Frouxo.</p>
        <p class="help-ai-note"><strong>Porque deixei um humano ganhar.</strong> Eu não quis resolver completamente o Uril nem criar uma máquina impossível de derrotar. Para simplificar e manter o jogo divertido, limitei a profundidade e o tempo, mantive alguma aleatoriedade apenas no nível Aprendiz e não usei livro de aberturas, base completa de finais ou aprendizagem automática. A avaliação é uma aproximação estratégica, não conhecimento perfeito. Um jogador experiente continua a conseguir explorar horizontes que o computador não analisou, sobretudo nos níveis Aprendiz, Amador e Mestre.</p>
      </section>
      <section>
        <h3>Regras do Uril de Cabo Verde</h3>
        <ol>
          <li><strong>Tabuleiro.</strong> São 12 casas de jogo, seis para Sul e seis para Norte, com quatro sementes em cada casa, e dois buracos laterais para as sementes ganhas.</li>
          <li><strong>Orientação.</strong> A distribuição segue o sentido anti-horário. A casa 6 de cada lado encosta à casa 1 do adversário.</li>
          <li><strong>Sementeira.</strong> Retiram-se todas as sementes de uma casa própria e distribui-se uma por casa. Ao completar a volta, a casa de origem é saltada.</li>
          <li><strong>Casa com uma semente.</strong> Qualquer casa própria com uma ou mais sementes é jogável. Quando o adversário está sem sementes, escolhe-se uma jogada que o alimente, quando tal jogada existe.</li>
          <li><strong>Colheita.</strong> Quando a última semente termina numa casa adversária com 2 ou 3 sementes, colhe-se essa casa e, para trás, as casas adversárias consecutivas que também tenham 2 ou 3.</li>
          <li><strong>Alimentação.</strong> Com o campo adversário vazio, é obrigatório deixar-lhe pelo menos uma semente. Sem qualquer jogada de alimentação, a partida termina.</li>
          <li><strong>As seis casas.</strong> É admitida a colheita das seis casas adversárias apenas quando, na jogada seguinte, quem deu fogo já não consegue alimentar o adversário. Se ainda conseguir alimentar, é <strong>Frouxo</strong> e perde a partida.</li>
          <li><strong>Fim normal.</strong> A partida não termina aos 25 pontos. Continua até deixarem de existir jogadas. As sementes restantes ficam com o jogador em cujo campo se encontram.</li>
          <li><strong>Repetição tripla.</strong> Quando a mesma posição, com o mesmo jogador na vez, surge três vezes, a partida termina. Cada jogador fica com as sementes existentes no seu próprio campo.</li>
          <li><strong>Capote.</strong> O jogador que terminar com menos de 12 sementes leva <em>Capote</em>. O Capote vale duas partidas na contagem.</li>
          <li><strong>Desistência.</strong> O jogador confirma a desistência antes do fim. Com 12 ou mais sementes colhidas perde uma partida; com menos de 12 perde duas. Contra o computador, a IA também pode pedir desistência quando já não existe possibilidade matemática de vitória; o jogador aceita ou recusa.</li>
          <li><strong>O Quatro.</strong> Quatro partidas consecutivas marcam um <em>Quatro</em>. O Quatro já marcado não desaparece.</li>
          <li><strong>Corte depois do Quatro.</strong> O adversário corta com duas partidas consecutivas e passa a liderar por 2–0. Um Capote realiza o corte de imediato.</li>
          <li><strong>Partida seguinte.</strong> O vencedor começa a partida seguinte. Num empate, volta a começar quem abriu a partida empatada.</li>
        </ol>
      </section>
      <section>
        <h3>Sugestões públicas</h3>
        <p>A área de sugestões fica na própria página. Cada publicação mostra o nick, o país, a ilha quando existe, a data e a hora. Todos os visitantes conseguem ler; apenas jogadores inscritos publicam e respondem. As sugestões e respostas ficam guardadas no Supabase e actualizam-se em tempo real.</p>
      </section>
      <section>
        <h3>Quando algo não sincroniza</h3>
        <p>Confirma que ambos entraram no mesmo banco e que o estado indica “Banco online”. Depois de uma actualização do GitHub, usa <strong>Ctrl + F5</strong> nos dois navegadores.</p>
      </section>
      <p class="rules-note">Esta é a interpretação operacional da versão zero e continuará a ser ajustada com validação de jogadores experientes de Uril.</p>`,
    close: 'Fechar',
    profileTooShort: 'Escreve primeiro um nick com pelo menos dois caracteres.',
    statusPc: 'A jogar contra o computador{bank}',
    statusLocal: 'A jogar no modo local',
    statusWaiting: 'Num banco de Uril, à espera{bank}',
    statusPlaying: 'Num banco de Uril, a jogar{bank}',
    statusWatching: 'Num banco de Uril, a ver jogar{bank}',
    statusFree: 'Livre',
    connectSupabasePlayers: 'Liga o Supabase para ver os jogadores.',
    playersConnectedOne: '1 jogador ligado',
    playersConnectedMany: '{count} jogadores ligados',
    noPlayersConnected: 'Ainda não há jogadores ligados.',
    guest: 'Convidado',
    you: 'TU',
    inGame: 'Em jogo',
    invite: 'Convidar',
    occupied: 'Ocupado',
    invitedToBank: '{nick} convidou-te para o banco de Uril “{bank}”.',
    chatReady: 'Escrever no banco…',
    chatConnecting: 'A ligar ao chat…',
    bankNotFree: 'Esse banco de Uril já não está livre.',
    onlineNotReady: 'O modo online ainda não está ligado.',
    playerAlreadyBusy: '{nick} já está num banco de Uril.',
    defaultBankName: 'Banco de {nick}',
    pcBankName: 'Banco de {nick} contra o PC',
    pcBankPublished: 'O treino contra o computador é privado.',
    pcBankPrivate: 'A partida começou em modo privado porque o serviço online ainda não está ligado.',
    pcBankPublishError: 'A partida começou, mas o banco não ficou público: {error}',
    invitationSent: 'Convite enviado a {nick}.',
    connectSupabaseBanks: 'Liga o Supabase para abrir os bancos de Uril online.',
    noBanks: 'Ainda não há bancos de Uril. Cria o primeiro banco.',
    noLiveBanks: 'Não há jogos Live neste momento.', noOpenBanks: 'Não há bancos ainda abertos.', noFinishedBanks: 'Não há partidas concluídas nos últimos 30 dias.',
    filterLive: 'Jogos Live', filterOpen: 'Ainda abertos', filterFinished: 'Concluídos',
    waitingUpper: 'AINDA ABERTO', playingUpper: 'LIVE', finishedUpper: 'CONCLUÍDO',
    bankStartedAt: 'Iniciado: {date}', bankLastMoveAt: 'Última jogada: {date}', bankNoMovesYet: 'Ainda sem jogadas',
    pcBankUpper: 'PC · AO VIVO',
    resume: 'Retomar',
    play: 'Jogar',
    watchPlay: 'Ver jogar', consultMoves: 'Consultar jogadas',
    awaitingGuest: 'À espera…',
    bankOnline: 'Banco online',
    versusPcMode: 'CONTRA O PC · {level}', versusPcLiveMode: 'CONTRA O PC · {level} · AO VIVO',
    watchingMode: 'A ASSISTIR',
    onlineBankMode: 'BANCO ONLINE',
    twoPlayersMode: 'DOIS JOGADORES',
    matchFinished: 'Partida terminada', reviewMode: 'CONSULTA DA PARTIDA', reviewingBank: 'Consulta de uma partida concluída',
    turnOf: 'Vez de {player}',
    bankWaitingOpponent: 'Banco à espera de adversário',
    watchingBank: 'A ver o banco · Sul em baixo',
    yourSideBelow: 'O teu lado está em baixo · {player}',
    computerLevel: 'Computador no nível {level}', computerPublicBank: 'Treino privado contra o computador · nível {level}',
    localBank: 'Banco local no mesmo dispositivo',
    collectedBy: 'Colhidas por {player}', capturedSeedsPit: 'Sementes ganhas por {player}: {count}.',
    cut: 'Corte: {player} {wins}/2',
    protectedFour: 'Quatro protegido por {player}',
    roundDraw: 'A partida terminou empatada.',
    roundCapote: '{player} venceu com CAPOTE.',
    roundWin: '{player} venceu a partida.',
    nextDraw: 'O tabuleiro será arrumado. {player} começa a próxima partida.',
    nextCapote: 'O Capote vale duas partidas. O tabuleiro será arrumado e {player} começa.',
    nextWin: 'O tabuleiro será arrumado. {player} começa a próxima partida.',
    liftingTitle: '{player} levantou as sementes.',
    liftingText: 'A casa de origem fica vazia antes da distribuição.',
    sowingTitle: '{player} está a semear.',
    sowingText: 'Semente {step} de {total}.',
    captureTitle: '{player} está a colher.',
    captureText: '{count} sementes recolhidas desta casa.',
    moveDone: 'Jogada concluída.',
    passingTurn: 'O tabuleiro está a passar a vez.',
    bankCreated: 'Banco criado.',
    waitingInvitation: 'À espera que outro jogador aceite o convite ou entre.',
    draw: 'Empate.',
    wonCapote: '{player} venceu com Capote.',
    wonMatch: '{player} venceu a partida.',
    previousWin: '{player} venceu a partida anterior.',
    boardResetStarter: 'Tabuleiro arrumado. {player} joga primeiro.',
    watchingTitle: 'Estás a assistir.',
    playerTurn: '{player} tem a vez.',
    waitOpponent: 'Aguarda a jogada adversária.',
    computerThinking: 'O computador está a pensar.',
    evaluatingMoves: 'A avaliar as casas disponíveis.',
    choosePit: '{player}, escolhe uma casa.',
    legalHighlighted: 'As casas válidas ficam realçadas.',
    sowingLast: '{player} distribui as sementes uma a uma.',
    capturingLast: '{player} recolhe as casas válidas.',
    moveDescription: '{player} jogou {pit}{capture}.{repetition}',
    captureDescription: ' e colheu {count} sementes{grandSlam}',
    sixPits: ' nas seis casas',
    repetitionDescription: ' A posição repetiu-se pela terceira vez e a partida terminou.',
    localGuestPrompt: 'Nick do jogador Norte:',
    whatsappPlayMessage: 'Queres jogar Uril comigo no banco “{bank}”? Este é o Uril de Cabo Verde, a variante cabo-verdiana do Ayo/Awalé. Entra aqui: {url}',
    whatsappWatchMessage: 'Vem assistir a este banco de Uril: “{bank}”. Este é o Uril de Cabo Verde, a variante cabo-verdiana do Ayo/Awalé. Abre aqui: {url}',
    sharePlayUnavailable: 'Este banco já tem dois jogadores. Envia antes um convite para assistir.',
    shareOnlyOnline: 'Os convites por WhatsApp estão disponíveis dentro de um banco oficial.',
    sharedPlayTitle: 'Convite para jogar em “{bank}”.',
    sharedWatchTitle: 'Convite para assistir a “{bank}”.',
    sharedInviteHelp: 'Entra na tua conta para aceitar o convite oficial. Como visitante anónimo, ainda consegues assistir.',
    sharedBankMissing: 'O banco indicado no convite já não está disponível.',
    sharedBankStartedWatch: 'O banco já começou. Vais entrar para assistir.',
    north: 'Norte', south: 'Sul', capeVerde: 'Cabo Verde',
    matchDrawKeep: 'Empate: a contagem mantém-se.', currentLead: '{player} lidera a contagem actual por {wins}–0.', quatroRecorded: '{player} marcou um Quatro. O Quatro fica registado.', firstCutWin: '{player} conseguiu a primeira vitória para cortar. Falta mais uma consecutiva.', capotePrefix: 'CAPOTE: {player} soma duas partidas.',
    consultBankError: 'Não foi possível consultar o banco: {error}', gameReview: 'CONSULTA DA PARTIDA', reviewPosition: 'Jogada {current} de {total}', reviewHelp: 'Move o controlo para reconstruir a partida, jogada a jogada.', reviewFirst: 'Primeira posição', reviewPrevious: 'Jogada anterior', reviewNext: 'Jogada seguinte', reviewLast: 'Última posição', reviewSlider: 'Posição da partida', reviewStartPosition: 'Posição inicial da partida.', reviewMovePosition: 'A consultar a jogada {current} de {total}.', reviewNoDate: 'Data não disponível.', pitSeeds: '{pit}: {count} sementes', acceptInviteError: 'Não foi possível aceitar o convite: {error}', sendInviteError: 'Não foi possível enviar o convite: {error}', resetError: 'Não foi possível arrumar o tabuleiro: {error}', refreshBanksError: 'Não foi possível actualizar os bancos de Uril: {error}', supabaseRequired: 'Os bancos de Uril online precisam da configuração Supabase incluída no pacote.', createBankError: 'Erro ao criar banco de Uril: {error}', enterBankError: 'Não foi possível entrar no banco de Uril: {error}', syncBankError: 'Erro ao sincronizar o banco de Uril: {error}', moveRejected: 'A jogada não foi aceite.', aiTimeout: 'A análise da jogada excedeu o tempo previsto.', aiFailed: 'A inteligência artificial falhou.', aiStartFailed: 'Não foi possível iniciar a inteligência artificial.', computerError: 'Erro do computador: {error}', chatError: 'Chat: {error}', languageName: 'Português',
  },

  fr: {
    metaDescription: 'Uril du Cap-Vert — variante cap-verdienne de la famille Ayo/Awalé, avec jeu local, ordinateur et banques en ligne.',
    brandHomeAria: 'Retour à l’accueil', onlinePlayers: 'joueurs en ligne', helpAndRules: 'Aide et règles', live: 'EN DIRECT',
    onlineRosterTitle: 'Joueurs en ligne', connectingPlayers: 'Connexion à la liste des joueurs…', rosterHelp: 'Les joueurs inscrits et calibrés reçoivent des invitations directes vers les banques officielles.',
    versionZero: 'VERSION 1.0', heroTitle: 'Le jeu traditionnel,<br><em>île par île.</em>', heroIntro: 'Entraîne-toi contre l’intelligence artificielle ou connecte-toi pour disputer des parties officielles et rejoindre le classement Elo.',
    variantLabel: 'AYO · AWALÉ · OWARE', variantIntro: 'L’Uril est la variante pratiquée au Cap-Vert de la grande famille africaine Ayo/Awalé/Oware, adaptée aux règles et à la tradition cap-verdiennes.',
    nickLabel: 'Ton pseudo', nickPlaceholder: 'Ex. : Mindelense77', islandLabel: 'Ton île', backgroundHint: 'Le fond suit l’île choisie.', playNow: 'JOUER',
    versusComputer: 'Contre l’ordinateur', versusComputerDesc: 'Entraînement privé avec quatre niveaux. Ces parties ne modifient pas le classement Elo officiel.', level: 'Niveau',
    levelApprentice: 'Apprenti', levelAmateur: 'Amateur', levelMaster: 'Maître', levelGrandmaster: 'Grand Maître', startMatch: 'Commencer la partie',
    banksOnline: 'Banques d’Uril en ligne', banksOnlineDesc: 'Consulte les parties en direct et terminées. Seuls les joueurs inscrits et calibrés créent ou disputent des banques officielles.', viewBanks: 'Voir les banques',
    sameScreen: 'MÊME ÉCRAN', twoPlayers: 'Deux joueurs', twoPlayersDesc: 'Une partie d’entraînement locale sur le même appareil, disponible après connexion à un compte.', playLocally: 'Jouer en local',
    openBanks: 'BANQUES OUVERTES', urilBanks: 'Banques d’Uril', refresh: 'Actualiser', bankNamePlaceholder: 'Nom de la banque', createBank: 'Créer une banque',
    setupNotice: 'L’archive, les comptes, le classement Elo et les banques officielles ne sont pas encore reliés à Supabase. L’entraînement contre l’IA reste disponible. Consulte <strong>GUIA-GITHUB.md</strong> pour activer la version 1.0.0.',
    whatsappInviteLabel: 'INVITATION WHATSAPP', whatsappInviteDefault: 'Tu as reçu une invitation vers une banque d’Uril.', openWhatsappBank: 'Ouvrir l’invitation',
    leaveBank: '← Quitter la banque', match: 'PARTIE', bankOfUril: 'Banque d’Uril', arrangeNow: 'Ranger maintenant', quatros: 'QUATROS', count: 'COMPTE',
    pickedNorth: 'Récoltées par Nord', turnSouth: 'Tour de Sud', pickedSouth: 'Récoltées par Sud', boardAria: 'Plateau d’Uril', seeds48: '48 graines · Cap-Vert',
    roundEnded: 'PARTIE TERMINÉE', southWon: 'Sud a gagné la partie.', boardWillReset: 'Le plateau va être remis en place.', matchStarted: 'La partie a commencé.', southStarts: 'Sud commence.',
    bankStatus: 'ÉTAT DE LA BANQUE', localMatch: 'Partie locale', countStarts: 'Le compte commence à 0–0.', lastMove: 'DERNIER COUP', noMoves: 'Aucun coup pour le moment.',
    bankChat: 'CHAT DE LA BANQUE', chatEmpty: 'Aucun message dans cette banque.', chatPlaceholder: 'Écrire dans la banque…', chatAria: 'Message du chat', send: 'Envoyer',
    chatNote: 'Les messages sont transmis en temps réel et ne sont pas archivés.', whatsappShare: 'INVITER PAR WHATSAPP', whatsappShareText: 'Partage cette banque avec un joueur ou une personne qui souhaite regarder.',
    inviteToPlayWhatsapp: 'Inviter à jouer', inviteToWatchWhatsapp: 'Inviter à regarder', reminder: 'RAPPEL',
    reminderText: 'Distribution dans le sens antihoraire, sans remettre de graine dans la case de départ après un tour complet. Récolte consécutive des cases contenant 2 ou 3 graines.',
    fullRules: 'Lire toutes les règles', assetCredit: 'Référence historique du visuel classique : Oliver Merkel, licence CC BY-NC-SA 4.0.',
    invitationReceived: 'INVITATION REÇUE', genericInvite: 'Tu as reçu une invitation vers une banque d’Uril.', decline: 'Refuser', enterBank: 'Entrer dans la banque',
    resignButton: 'Abandonner', resignEyebrow: 'ABANDON', resignDialogTitle: 'Confirmer l’abandon', resignDialogPlayer: '{player} demande l’abandon.', resignWarningOne: '{player}, tu as {seeds} graines récoltées. L’abandon vaut une partie.', resignWarningTwo: '{player}, tu n’as encore que {seeds} graines. Comme tu n’as pas atteint 12, l’abandon vaut deux parties, comme un Capote.', keepPlaying: 'Continuer à jouer', confirmResign: 'Confirmer l’abandon', reasonResignation: 'Abandon de {player}.', reasonFrouxo: 'Frouxo : le joueur qui a donné le feu perd la partie car il pouvait encore nourrir l’adversaire au coup suivant.', resignationWin: '{loser} a abandonné. {winner} gagne.', resignationResultOne: 'L’abandon vaut une partie.', resignationResultTwo: 'L’abandon vaut deux parties car {player} n’avait pas encore 12 graines.', roundResignation: '{loser} a abandonné. {winner} gagne la partie.', nextResignationOne: 'L’abandon vaut une partie. Le plateau sera remis en place et {player} commencera.', nextResignationTwo: 'L’abandon vaut deux parties. Le plateau sera remis en place et {player} commencera.', resignError: 'Impossible d’enregistrer l’abandon.', aiResignEyebrow: 'DEMANDE DE L’ORDINATEUR', aiResignTitle: 'L’ordinateur veut abandonner', aiResignWarningOne: '{player} estime ne plus pouvoir gagner et demande l’abandon pour une partie. Acceptes-tu ?', aiResignWarningTwo: '{player} estime ne plus pouvoir gagner et demande l’abandon pour deux parties, car il n’a encore que {seeds} graines. Acceptes-tu ?', rejectAIResign: 'Refuser', acceptAIResign: 'Accepter l’abandon', footerCopyright: '© 2026 Salazar da Cruz', footerConcept: 'Conception, développement et direction', versionLabel: 'Version 1.0.0', suggestions: 'Suggestions', suggestionsCommunity: 'COMMUNAUTÉ', suggestionsTitle: 'Suggestions et réponses', suggestionsIntro: 'Les suggestions sont publiques, avec le pseudo et la date. Tout le monde peut les lire; seuls les joueurs inscrits peuvent publier et répondre.', publishAs: 'Publier comme', suggestionPlaceholder: 'Ta suggestion…', suggestionsPublicNote: 'La suggestion sera visible par tous les visiteurs.', publishSuggestion: 'Publier la suggestion', suggestionsPublished: 'suggestions publiées', suggestionsEmpty: 'Aucune suggestion pour le moment. Lance la discussion.', suggestionsNeedSupabase: 'Connecte Supabase pour publier et consulter les suggestions.', suggestionsLoading: 'Chargement des suggestions…', suggestionsMigrationNeeded: 'Exécute le fichier supabase-v1.0.0.sql dans le SQL Editor de Supabase.', suggestionsLoadError: 'Impossible de charger les suggestions : {error}', suggestionEmpty: 'Écris une suggestion d’au moins quatre caractères.', suggestionPublished: 'La suggestion a été publiée.', suggestionPublishError: 'Impossible de publier la suggestion : {error}', reply: 'Répondre', replyCount: '{count} réponses', replyPlaceholder: 'Écris une réponse…', replyAria: 'Répondre à la suggestion de {nick}', cancelReply: 'Annuler', publishReply: 'Publier la réponse', replyEmpty: 'Écris d’abord une réponse.', replyPublished: 'La réponse a été publiée.', replyPublishError: 'Impossible de publier la réponse : {error}',
    signIn: 'Se connecter', registerPlayer: 'Inscrire un joueur', signOut: 'Se déconnecter',
    heroIntroV1: 'Joue contre l’intelligence artificielle sans inscription. Pour disputer des parties officielles, créer des banques et entrer au classement Elo, crée un compte de joueur.',
    playerIdentity: 'IDENTITÉ DU JOUEUR', anonymousVisitor: 'Visiteur anonyme', anonymousRights: 'Entraînement contre l’IA et consultation des parties disponibles.',
    eloRating: 'Elo', registerToCompete: 'S’inscrire pour concourir', initialEloTest: 'Évaluation Elo initiale', startCalibration: 'Lancer le prochain test',
    calibrationProgress: '{current} tests sur 3 terminés', calibrationComplete: 'Elo initial estimé : {elo}', calibrationRecorded: 'Test enregistré. Elo actuel : {elo}.', calibrationRequired: 'Termine les trois tests de calibration contre l’IA avant de participer aux parties officielles.', completeCalibration: 'Terminer la calibration',
    searchGames: 'Rechercher joueur, pays, île ou banque', fromDate: 'Depuis', toDate: 'Jusqu’au', resultFilter: 'Résultat', eventFilter: 'Événement', allResults: 'Tous', southWonFilter: 'Victoire du Sud', northWonFilter: 'Victoire du Nord', drawFilter: 'Nulle', allEvents: 'Tous', search: 'Rechercher', createOfficialBank: 'Créer une banque officielle',
    loginCreateBank: 'Connecte-toi à un compte de joueur pour créer ou disputer des banques officielles.', moveDetails: 'DÉTAILS DU COUP', analyseMove: 'Analyser le coup',
    engineAnalysis: 'ANALYSE DU MOTEUR', analysisNotRun: 'Analyse non encore exécutée.', moveList: 'LISTE DES COUPS', engineStatistics: 'STATISTIQUES DE L’IA', noEngineStats: 'Aucune analyse pour le moment.',
    watchingPlayers: 'SPECTATEURS', officialRanking: 'CLASSEMENT OFFICIEL', eloLeaderboard: 'Classement Elo', rankingHelp: 'Seules les parties entre joueurs inscrits modifient l’Elo.',
    playerAccount: 'COMPTE JOUEUR', enterOrRegister: 'Connexion ou inscription', email: 'Email', password: 'Mot de passe', fullName: 'Nom complet', country: 'Pays',
    countryPlaceholder: 'Ex. : Cap-Vert', confirmPassword: 'Confirmer le mot de passe', createPlayerAccount: 'Créer le compte joueur', accountCreatedCheckEmail: 'Compte créé. Confirme l’email si la validation est activée dans Supabase.',
    signedIn: 'Session ouverte comme {nick}.', signedOut: 'Session terminée. Tu continues comme visiteur anonyme.', passwordsDiffer: 'Les mots de passe ne correspondent pas.',
    registrationRequired: 'Cette fonction est réservée aux joueurs inscrits.', localLoginRequired: 'Le mode local est disponible après connexion à un compte joueur.',
    pageLabel: 'Page {page} sur {pages}', interruptedUpper: 'INTERROMPUE', abandonedUpper: 'ABANDONNÉE', statusInterrupted: 'Partie interrompue', statusAbandoned: 'Partie abandonnée',
    reviewClassificationBest: 'Meilleur coup', reviewClassificationGood: 'Bon coup', reviewClassificationInaccuracy: 'Imprécision', reviewClassificationMistake: 'Erreur', reviewClassificationBlunder: 'Faute grave',
    analysisSummary: '{classification}. Meilleure case : {best}. Profondeur {depth}, {nodes} positions, {time} ms.',
    engineStatsSummary: 'Profondeur {depth}/{maxDepth} · {nodes} positions · {time} ms · ligne {pv}',
    officialOnly: 'PARTIE OFFICIELLE', trainingOnly: 'ENTRAÎNEMENT', registeredPlayersOnly: 'Joueurs inscrits uniquement', spectatorsAnonymous: 'Les visiteurs sans compte apparaissent comme Anonyme 01, Anonyme 02, etc.',
    eloProvisional: 'provisoire', officialGamesCount: '{count} parties officielles', leaderboardEmpty: 'Aucun joueur classé pour le moment.',
    feeding: 'Alimentation', gameStartedAt: 'Début : {date}', lastMoveAt: 'Dernier coup : {date}', noLastMove: 'Aucun coup pour le moment',
    helpVersion: 'AIDE 1.0.0', helpTitle: 'Aide, banques et règles', close: 'Fermer',
    helpContent: `
      <section><h3>Qu’est-ce que l’Uril ?</h3><p>L’Uril est la variante pratiquée au Cap-Vert de la grande famille de jeux africains connue sous les noms <strong>Ayo</strong>, <strong>Awalé</strong> et <strong>Oware</strong>. Cette version suit les règles et la tradition cap-verdiennes.</p></section>
      <section><h3>Commencer à jouer</h3><p>Choisis un pseudo et une île. L’île définit le fond. En ligne, seule une session technique anonyme est créée.</p><ul><li><strong>Contre l’ordinateur :</strong> Apprenti, Amateur, Maître et Grand Maître. La partie contre l’ordinateur reste un entraînement privé et ne modifie jamais l’Elo.</li><li><strong>Deux joueurs :</strong> Sud et Nord alternent sur le même appareil.</li><li><strong>Banques en ligne :</strong> crée, rejoins, reprends ou regarde une banque.</li></ul></section>
      <section><h3>Joueurs, banques et invitations</h3><p>La colonne de gauche montre en temps réel les joueurs libres, ceux qui jouent contre l’ordinateur, en local, dans une banque ou comme spectateurs. Une partie publique contre l’ordinateur affiche le bouton <strong>Regarder</strong>.</p><p>Dans une banque, les boutons WhatsApp créent un lien direct pour jouer ou regarder. Chaque joueur voit toujours son propre camp en bas.</p></section>
      <section><h3>Chat</h3><p>Le chat est ouvert aux deux joueurs et aux spectateurs. Les messages sont transmis en temps réel, limités à 280 caractères et non archivés.</p></section>

      <section class="help-ai-section">
        <h3>Comment j’ai construit l’adversaire informatique</h3>
        <p>J’ai construit l’ordinateur autour d’une recherche <strong>Minimax avec élagage Alpha-Bêta</strong>. Au lieu de choisir seulement la récolte immédiate, je simule un arbre de coups : l’ordinateur cherche la valeur la plus élevée et, pour les réponses humaines, j’assume la réponse qui lui est la plus défavorable. Le Minimax suppose donc que les deux côtés essaient de jouer au mieux.</p>
        <p><strong>Principe théorique.</strong> Chaque nœud représente une position du plateau et chaque branche un coup légal. L’ordinateur maximise l’évaluation et l’adversaire la minimise. L’élagage Alpha-Bêta supprime les branches qui ne peuvent plus modifier la décision. Je réutilise aussi les positions déjà analysées grâce à une table de transpositions.</p>
        <p><strong>Profondeur.</strong> Je la mesure en demi-coups, ou <em>plies</em>. La profondeur 1 analyse un coup de l’ordinateur; la profondeur 2 ajoute une réponse humaine; la profondeur 24 représente environ douze séquences complètes de coups et réponses.</p>
        <div class="help-levels" role="list" aria-label="Niveaux de l’ordinateur">
          <div role="listitem"><strong>Apprenti</strong><span>Profondeur 4 · 320 ms</span><small>Force de l’ancien Amateur, avec 12 % de choix aléatoires.</small></div>
          <div role="listitem"><strong>Amateur</strong><span>Profondeur 8 · 950 ms</span><small>Force de l’ancien Maître, sans hasard.</small></div>
          <div role="listitem"><strong>Maître</strong><span>Profondeur 12 · 2,6 s</span><small>Force de l’ancien Grand Maître.</small></div>
          <div role="listitem"><strong>Grand Maître</strong><span>Profondeur 24 · 12 s</span><small>Profondeur maximale doublée et temps de recherche accru.</small></div>
        </div>
        <p>J’utilise un <strong>approfondissement itératif</strong> : profondeur 1, puis 2, 3, etc. Quand le temps est écoulé, je garde le meilleur coup de la dernière profondeur complètement terminée. Sur un téléphone lent, le Grand Maître peut s’arrêter avant sa profondeur maximale.</p>
        <p><strong>Évaluation.</strong> Lorsque la recherche n’atteint pas la fin de la partie, j’évalue la différence de graines gagnées (poids <strong>145</strong>), la pression d’alimentation (<strong>18</strong>), la mobilité (<strong>8</strong>), les graines vulnérables (<strong>3,2</strong>), l’équilibre des graines sur le plateau (<strong>2,2</strong>), les grandes cases de 12 graines ou plus (<strong>2,5</strong>) et les cases vides (<strong>1,4</strong>). Une victoire vaut environ <strong>+1 000 000</strong> et une défaite <strong>−1 000 000</strong>.</p>
        <p><strong>Mon approche de l’Uril.</strong> Je fais prendre en compte les récoltes, l’alimentation obligatoire, la mobilité, les cases vulnérables, les grandes accumulations, la triple répétition, le Capote et le Frouxo. Une simulation qui donne le feu alors qu’elle pouvait encore nourrir l’adversaire au coup suivant est immédiatement évaluée comme une défaite par Frouxo.</p>
        <p class="help-ai-note"><strong>Pourquoi un humain peut encore gagner.</strong> Je n’ai pas cherché à résoudre complètement l’Uril. Pour simplifier et préserver le plaisir, j’ai limité la profondeur et le temps, conservé un peu de hasard uniquement au niveau Apprenti et écarté les livres d’ouvertures, les bases complètes de finales et l’apprentissage automatique. L’évaluation reste une approximation stratégique qu’un joueur expérimenté peut exploiter.</p>
      </section>
      <section><h3>Règles de l’Uril du Cap-Vert</h3><ol><li><strong>Plateau.</strong> 12 cases de jeu, six par joueur, quatre graines par case, plus deux réserves latérales pour les graines gagnées.</li><li><strong>Sens.</strong> Distribution antihoraire.</li><li><strong>Semis.</strong> Toutes les graines d’une case sont distribuées une par une; la case de départ est sautée après un tour complet.</li><li><strong>Une graine.</strong> Toute case propre contenant au moins une graine est jouable.</li><li><strong>Récolte.</strong> La dernière graine permet de récolter les cases adverses consécutives contenant 2 ou 3 graines.</li><li><strong>Alimentation.</strong> Si le camp adverse est vide, il faut l’alimenter lorsqu’un coup le permet.</li><li><strong>Six cases.</strong> La récolte des six cases adverses n’est admise que si, au coup suivant, celui qui a donné le feu ne peut plus nourrir l’adversaire. S’il peut encore le nourrir, c’est <strong>Frouxo</strong> et il perd la partie.</li><li><strong>Fin.</strong> La partie ne s’arrête pas à 25; elle continue jusqu’à l’absence de coup.</li><li><strong>Triple répétition.</strong> À la troisième répétition, chacun garde les graines de son camp.</li><li><strong>Capote.</strong> Moins de 12 graines : Capote, valant deux parties.</li><li><strong>Quatro.</strong> Quatre victoires consécutives marquent un Quatro.</li><li><strong>Coupe.</strong> Deux victoires consécutives coupent après un Quatro; un Capote coupe immédiatement.</li><li><strong>Partie suivante.</strong> Le gagnant commence; en cas de nul, le même joueur recommence.</li></ol></section>
      <section><h3>Suggestions publiques</h3><p>La section des suggestions se trouve directement sur la page. Chaque publication affiche le pseudo, l’île, la date et l’heure. Tous les visiteurs peuvent lire; seuls les joueurs inscrits peuvent publier et répondre. Les suggestions et les réponses sont enregistrées dans Supabase et se mettent à jour en temps réel.</p></section>
      <section><h3>Synchronisation</h3><p>Vérifie que les deux joueurs sont dans la même banque. Après une mise à jour GitHub, utilise <strong>Ctrl + F5</strong>.</p></section>
      <p class="rules-note">La version 1.0.0 continuera d’être ajustée avec des joueurs expérimentés d’Uril.</p>`,
    north: 'Nord', south: 'Sud', capeVerde: 'Cap-Vert',
    matchDrawKeep: 'Match nul : le compte reste inchangé.', currentLead: '{player} mène le compte actuel par {wins}–0.', quatroRecorded: '{player} a marqué un Quatro. Le Quatro reste enregistré.', firstCutWin: '{player} a obtenu la première victoire de coupe. Il en manque encore une consécutive.', capotePrefix: 'CAPOTE : {player} ajoute deux parties.',
    profileTooShort: 'Écris d’abord un pseudo d’au moins deux caractères.', statusPc: 'Joue contre l’ordinateur{bank}', statusLocal: 'Joue en mode local',
    statusWaiting: 'Dans une banque d’Uril, en attente{bank}', statusPlaying: 'Dans une banque d’Uril, en jeu{bank}', statusWatching: 'Dans une banque d’Uril, regarde{bank}', statusFree: 'Libre',
    connectSupabasePlayers: 'Relie Supabase pour voir les joueurs.', playersConnectedOne: '1 joueur connecté', playersConnectedMany: '{count} joueurs connectés', noPlayersConnected: 'Aucun joueur connecté.',
    guest: 'Invité', you: 'TOI', inGame: 'En jeu', invite: 'Inviter', occupied: 'Occupé', invitedToBank: '{nick} t’invite dans la banque d’Uril « {bank} ».',
    chatReady: 'Écrire dans la banque…', chatConnecting: 'Connexion au chat…', bankNotFree: 'Cette banque d’Uril n’est plus libre.', onlineNotReady: 'Le mode en ligne n’est pas encore relié.',
    playerAlreadyBusy: '{nick} est déjà dans une banque d’Uril.', defaultBankName: 'Banque de {nick}', pcBankName: 'Banque de {nick} contre le PC', pcBankPublished: 'L’entraînement contre l’ordinateur est privé.', pcBankPrivate: 'La partie a commencé en privé car le service en ligne n’est pas encore connecté.', pcBankPublishError: 'La partie a commencé, mais la banque n’est pas publique : {error}', invitationSent: 'Invitation envoyée à {nick}.',
    connectSupabaseBanks: 'Relie Supabase pour ouvrir les banques d’Uril en ligne.', noBanks: 'Aucune banque d’Uril. Crée la première.', noLiveBanks: 'Aucune partie en direct actuellement.', noOpenBanks: 'Aucune banque encore ouverte.', noFinishedBanks: 'Aucune partie terminée durant les 30 derniers jours.', filterLive: 'Parties Live', filterOpen: 'Encore ouvertes', filterFinished: 'Terminées', waitingUpper: 'ENCORE OUVERTE', playingUpper: 'LIVE', finishedUpper: 'TERMINÉE', bankStartedAt: 'Début : {date}', bankLastMoveAt: 'Dernier coup : {date}', bankNoMovesYet: 'Aucun coup joué', pcBankUpper: 'PC · LIVE',
    resume: 'Reprendre', play: 'Jouer', watchPlay: 'Regarder', consultMoves: 'Consulter les coups', awaitingGuest: 'En attente…', bankOnline: 'Banque en ligne', versusPcMode: 'CONTRE LE PC · {level}', versusPcLiveMode: 'CONTRE LE PC · {level} · EN DIRECT', watchingMode: 'SPECTATEUR', onlineBankMode: 'BANQUE EN LIGNE', twoPlayersMode: 'DEUX JOUEURS',
    matchFinished: 'Partie terminée', reviewMode: 'CONSULTATION DE LA PARTIE', reviewingBank: 'Consultation d’une partie terminée', turnOf: 'Tour de {player}', bankWaitingOpponent: 'Banque en attente d’un adversaire', watchingBank: 'Spectateur · Sud en bas', yourSideBelow: 'Ton camp est en bas · {player}', computerLevel: 'Ordinateur, niveau {level}', computerPublicBank: 'Entraînement privé contre l’ordinateur · niveau {level}', localBank: 'Banque locale sur le même appareil',
    collectedBy: 'Récoltées par {player}', capturedSeedsPit: 'Graines gagnées par {player} : {count}.', cut: 'Coupe : {player} {wins}/2', protectedFour: 'Quatro protégé par {player}', roundDraw: 'La partie se termine par un nul.', roundCapote: '{player} gagne par CAPOTE.', roundWin: '{player} gagne la partie.',
    nextDraw: 'Le plateau va être remis en place. {player} commence la prochaine partie.', nextCapote: 'Le Capote vaut deux parties. Le plateau est remis en place et {player} commence.', nextWin: 'Le plateau va être remis en place. {player} commence.',
    liftingTitle: '{player} ramasse les graines.', liftingText: 'La case de départ est vidée avant la distribution.', sowingTitle: '{player} sème.', sowingText: 'Graine {step} sur {total}.', captureTitle: '{player} récolte.', captureText: '{count} graines récoltées dans cette case.', moveDone: 'Coup terminé.', passingTurn: 'Le tour passe au joueur suivant.', bankCreated: 'Banque créée.', waitingInvitation: 'En attente d’un joueur.',
    draw: 'Match nul.', wonCapote: '{player} gagne par Capote.', wonMatch: '{player} gagne la partie.', previousWin: '{player} a gagné la partie précédente.', boardResetStarter: 'Plateau remis en place. {player} commence.', watchingTitle: 'Tu regardes la partie.', playerTurn: 'C’est au tour de {player}.', waitOpponent: 'Attends le coup adverse.', computerThinking: 'L’ordinateur réfléchit.', evaluatingMoves: 'Analyse des cases disponibles.', choosePit: '{player}, choisis une case.', legalHighlighted: 'Les cases valides sont mises en évidence.', sowingLast: '{player} distribue les graines une par une.', capturingLast: '{player} récolte les cases valides.',
    moveDescription: '{player} joue {pit}{capture}.{repetition}', captureDescription: ' et récolte {count} graines{grandSlam}', sixPits: ' dans les six cases', repetitionDescription: ' La position s’est répétée trois fois et la partie est terminée.', localGuestPrompt: 'Pseudo du joueur Nord :',
    whatsappPlayMessage: 'Veux-tu jouer à l’Uril avec moi dans la banque « {bank} » ? C’est la variante cap-verdienne de l’Ayo/Awalé. Entre ici : {url}',
    whatsappWatchMessage: 'Viens regarder cette banque d’Uril : « {bank} ». C’est la variante cap-verdienne de l’Ayo/Awalé. Ouvre ici : {url}',
    sharePlayUnavailable: 'Cette banque a déjà deux joueurs. Envoie plutôt une invitation pour regarder.', shareOnlyOnline: 'Les invitations WhatsApp sont disponibles dans une banque officielle.',
    sharedPlayTitle: 'Invitation à jouer dans « {bank} ».', sharedWatchTitle: 'Invitation à regarder « {bank} ».', sharedInviteHelp: 'Connecte-toi pour accepter l’invitation officielle. Comme visiteur anonyme, tu peux encore regarder.', sharedBankMissing: 'La banque indiquée n’est plus disponible.', sharedBankStartedWatch: 'La partie a déjà commencé. Tu vas entrer comme spectateur.', consultBankError: 'Impossible de consulter la banque : {error}', gameReview: 'CONSULTATION DE LA PARTIE', reviewPosition: 'Coup {current} sur {total}', reviewHelp: 'Déplace le contrôle pour reconstruire la partie coup par coup.', reviewFirst: 'Position initiale', reviewPrevious: 'Coup précédent', reviewNext: 'Coup suivant', reviewLast: 'Dernière position', reviewSlider: 'Position de la partie', reviewStartPosition: 'Position initiale de la partie.', reviewMovePosition: 'Consultation du coup {current} sur {total}.', reviewNoDate: 'Date indisponible.', pitSeeds: '{pit} : {count} graines', acceptInviteError: 'Impossible d’accepter l’invitation : {error}', sendInviteError: 'Impossible d’envoyer l’invitation : {error}', resetError: 'Impossible de remettre le plateau en place : {error}', refreshBanksError: 'Impossible d’actualiser les banques d’Uril : {error}', supabaseRequired: 'Les banques d’Uril en ligne nécessitent la configuration Supabase du paquet.', createBankError: 'Erreur lors de la création de la banque : {error}', enterBankError: 'Impossible d’entrer dans la banque d’Uril : {error}', syncBankError: 'Erreur de synchronisation de la banque : {error}', moveRejected: 'Le coup n’a pas été accepté.', aiTimeout: 'L’analyse du coup a dépassé le temps prévu.', aiFailed: 'L’intelligence artificielle a échoué.', aiStartFailed: 'Impossible de démarrer l’intelligence artificielle.', computerError: 'Erreur de l’ordinateur : {error}', chatError: 'Chat : {error}', languageName: 'Français',
  },

  en: {
    metaDescription: 'Cape Verde Uril — the Cape Verdean variant of the Ayo/Awalé family, with local, computer and online bank play.',
    brandHomeAria: 'Back to home', onlinePlayers: 'players online', helpAndRules: 'Help and rules', live: 'LIVE', onlineRosterTitle: 'Players online', connectingPlayers: 'Connecting to the player lobby…', rosterHelp: 'Registered and calibrated players receive direct invitations to official Uril banks.',
    versionZero: 'VERSION 1.0', heroTitle: 'The traditional game,<br><em>island by island.</em>', heroIntro: 'Train against the artificial intelligence or sign in to play official games and join the Elo ranking.',
    variantLabel: 'AYO · AWALÉ · OWARE', variantIntro: 'Uril is the Cape Verdean variant of the wider African Ayo/Awalé/Oware family, adapted to Cape Verdean rules and tradition.',
    nickLabel: 'Your nickname', nickPlaceholder: 'E.g. Mindelense77', islandLabel: 'Your island', backgroundHint: 'The background follows your chosen island.', playNow: 'PLAY NOW',
    versusComputer: 'Against the computer', versusComputerDesc: 'Private training with four difficulty levels. These games do not change the official Elo rating.', level: 'Level', levelApprentice: 'Apprentice', levelAmateur: 'Amateur', levelMaster: 'Master', levelGrandmaster: 'Grand Master', startMatch: 'Start match',
    banksOnline: 'Online Uril banks', banksOnlineDesc: 'Review Live and completed games. Only registered and calibrated players create or play official banks.', viewBanks: 'View banks', sameScreen: 'SAME SCREEN', twoPlayers: 'Two players', twoPlayersDesc: 'A local training match on the same device, available after signing in to an account.', playLocally: 'Play locally',
    openBanks: 'OPEN BANKS', urilBanks: 'Uril banks', refresh: 'Refresh', bankNamePlaceholder: 'Bank name', createBank: 'Create bank', setupNotice: 'The archive, accounts, Elo rating and official banks are not connected to Supabase yet. AI training remains available. See <strong>GUIA-GITHUB.md</strong> to activate version 1.0.0.',
    whatsappInviteLabel: 'WHATSAPP INVITATION', whatsappInviteDefault: 'You received an invitation to an Uril bank.', openWhatsappBank: 'Open invitation', leaveBank: '← Leave bank', match: 'MATCH', bankOfUril: 'Uril bank', arrangeNow: 'Reset now', quatros: 'QUATROS', count: 'COUNT',
    pickedNorth: 'Captured by North', turnSouth: 'South to move', pickedSouth: 'Captured by South', boardAria: 'Uril board', seeds48: '48 seeds · Cape Verde', roundEnded: 'MATCH ENDED', southWon: 'South won the match.', boardWillReset: 'The board will be reset.', matchStarted: 'The match has started.', southStarts: 'South starts.',
    bankStatus: 'BANK STATUS', localMatch: 'Local match', countStarts: 'The count starts at 0–0.', lastMove: 'LAST MOVE', noMoves: 'No moves yet.', bankChat: 'BANK CHAT', chatEmpty: 'No messages in this bank yet.', chatPlaceholder: 'Write in the bank…', chatAria: 'Chat message', send: 'Send', chatNote: 'Messages are sent in real time and are not archived.',
    whatsappShare: 'INVITE VIA WHATSAPP', whatsappShareText: 'Share this bank with another player or someone who wants to watch.', inviteToPlayWhatsapp: 'Invite to play', inviteToWatchWhatsapp: 'Invite to watch', reminder: 'REMINDER', reminderText: 'Sow counter-clockwise, skipping the starting pit after a full lap. Capture consecutive opposing pits containing 2 or 3 seeds.', fullRules: 'Read full rules', assetCredit: 'Historical reference for the classic artwork: Oliver Merkel, CC BY-NC-SA 4.0.',
    invitationReceived: 'INVITATION RECEIVED', genericInvite: 'You received an invitation to an Uril bank.', decline: 'Decline', enterBank: 'Enter bank', resignButton: 'Resign', resignEyebrow: 'RESIGNATION', resignDialogTitle: 'Confirm resignation', resignDialogPlayer: '{player} is asking to resign.', resignWarningOne: '{player}, you have captured {seeds} seeds. Resigning counts as one game.', resignWarningTwo: '{player}, you have captured only {seeds} seeds. Since you have not reached 12, resigning counts as two games, like a Capote.', keepPlaying: 'Keep playing', confirmResign: 'Confirm resignation', reasonResignation: '{player} resigned.', reasonFrouxo: 'Frouxo: the player who cleared all six pits loses because they could still feed the opponent on the next turn.', resignationWin: '{loser} resigned. {winner} won.', resignationResultOne: 'The resignation counts as one game.', resignationResultTwo: 'The resignation counts as two games because {player} had not yet reached 12 seeds.', roundResignation: '{loser} resigned. {winner} won the game.', nextResignationOne: 'The resignation counts as one game. The board will be reset and {player} starts.', nextResignationTwo: 'The resignation counts as two games. The board will be reset and {player} starts.', resignError: 'Could not register the resignation.', aiResignEyebrow: 'COMPUTER REQUEST', aiResignTitle: 'The computer wants to resign', aiResignWarningOne: '{player} has concluded it can no longer win and asks to resign for one game. Do you accept?', aiResignWarningTwo: '{player} has concluded it can no longer win and asks to resign for two games because it has only {seeds} seeds. Do you accept?', rejectAIResign: 'Do not accept', acceptAIResign: 'Accept resignation', footerCopyright: '© 2026 Salazar da Cruz', footerConcept: 'Concept, development and direction', versionLabel: 'Version 1.0.0', suggestions: 'Suggestions', suggestionsCommunity: 'COMMUNITY', suggestionsTitle: 'Suggestions and replies', suggestionsIntro: 'Suggestions are public and show the nickname and date. Everyone can read; only registered players publish and reply.', publishAs: 'Publish as', suggestionPlaceholder: 'Your suggestion…', suggestionsPublicNote: 'The suggestion will be visible to every visitor.', publishSuggestion: 'Publish suggestion', suggestionsPublished: 'published suggestions', suggestionsEmpty: 'There are no suggestions yet. Start the conversation.', suggestionsNeedSupabase: 'Connect Supabase to publish and view suggestions.', suggestionsLoading: 'Loading suggestions…', suggestionsMigrationNeeded: 'Run supabase-v1.0.0.sql in the Supabase SQL Editor.', suggestionsLoadError: 'Could not load suggestions: {error}', suggestionEmpty: 'Write a suggestion with at least four characters.', suggestionPublished: 'The suggestion was published.', suggestionPublishError: 'Could not publish the suggestion: {error}', reply: 'Reply', replyCount: '{count} replies', replyPlaceholder: 'Write a reply…', replyAria: 'Reply to {nick}’s suggestion', cancelReply: 'Cancel', publishReply: 'Publish reply', replyEmpty: 'Write a reply first.', replyPublished: 'The reply was published.', replyPublishError: 'Could not publish the reply: {error}',     signIn: 'Sign in', registerPlayer: 'Register player', signOut: 'Sign out',
    heroIntroV1: 'Play against the artificial intelligence without registering. To play official games, create banks and enter the Elo ranking, register a player account.',
    playerIdentity: 'PLAYER IDENTITY', anonymousVisitor: 'Anonymous visitor', anonymousRights: 'AI training and consultation of available games.',
    eloRating: 'Elo', registerToCompete: 'Register to compete', initialEloTest: 'Initial Elo assessment', startCalibration: 'Start next test',
    calibrationProgress: '{current} of 3 tests completed', calibrationComplete: 'Estimated initial Elo: {elo}', calibrationRecorded: 'Test recorded. Current Elo: {elo}.', calibrationRequired: 'Complete all three AI calibration tests before entering official games.', completeCalibration: 'Complete calibration',
    searchGames: 'Search player, country, island or bank', fromDate: 'From', toDate: 'To', resultFilter: 'Result', eventFilter: 'Event', allResults: 'All', southWonFilter: 'South win', northWonFilter: 'North win', drawFilter: 'Draw', allEvents: 'All', search: 'Search', createOfficialBank: 'Create official bank',
    loginCreateBank: 'Sign in to a player account to create or play official banks.', moveDetails: 'MOVE DETAILS', analyseMove: 'Analyse move',
    engineAnalysis: 'ENGINE ANALYSIS', analysisNotRun: 'Analysis has not been run.', moveList: 'MOVE LIST', engineStatistics: 'AI STATISTICS', noEngineStats: 'No analysis yet.',
    watchingPlayers: 'WATCHING', officialRanking: 'OFFICIAL RANKING', eloLeaderboard: 'Elo standings', rankingHelp: 'Only games between registered players change Elo.',
    playerAccount: 'PLAYER ACCOUNT', enterOrRegister: 'Sign in or register', email: 'Email', password: 'Password', fullName: 'Full name', country: 'Country',
    countryPlaceholder: 'E.g. Cape Verde', confirmPassword: 'Confirm password', createPlayerAccount: 'Create player account', accountCreatedCheckEmail: 'Account created. Confirm the email if email confirmation is enabled in Supabase.',
    signedIn: 'Signed in as {nick}.', signedOut: 'Signed out. You continue as an anonymous visitor.', passwordsDiffer: 'The passwords do not match.',
    registrationRequired: 'This function is reserved for registered players.', localLoginRequired: 'Local mode is available after signing in to a player account.',
    pageLabel: 'Page {page} of {pages}', interruptedUpper: 'INTERRUPTED', abandonedUpper: 'ABANDONED', statusInterrupted: 'Interrupted game', statusAbandoned: 'Abandoned game',
    reviewClassificationBest: 'Best move', reviewClassificationGood: 'Good move', reviewClassificationInaccuracy: 'Inaccuracy', reviewClassificationMistake: 'Mistake', reviewClassificationBlunder: 'Blunder',
    analysisSummary: '{classification}. Best pit: {best}. Depth {depth}, {nodes} positions, {time} ms.',
    engineStatsSummary: 'Depth {depth}/{maxDepth} · {nodes} positions · {time} ms · line {pv}',
    officialOnly: 'OFFICIAL GAME', trainingOnly: 'TRAINING', registeredPlayersOnly: 'Registered players only', spectatorsAnonymous: 'Visitors without an account appear as Anonymous 01, Anonymous 02, etc.',
    eloProvisional: 'provisional', officialGamesCount: '{count} official games', leaderboardEmpty: 'There are no ranked players yet.',
    feeding: 'Feeding', gameStartedAt: 'Started: {date}', lastMoveAt: 'Last move: {date}', noLastMove: 'No moves yet',
    helpVersion: 'HELP 1.0.0', helpTitle: 'Help, banks and rules', close: 'Close',
    helpContent: `
      <section><h3>What is Uril?</h3><p>Uril is the Cape Verdean variant of the broad African game family known as <strong>Ayo</strong>, <strong>Awalé</strong> and <strong>Oware</strong>. This version follows Cape Verdean rules and tradition.</p></section>
      <section><h3>Starting a game</h3><p>Without an account, you enter as an anonymous visitor and can train against the AI or review games. A registered player receives a public identity, an Elo rating and access to official games after completing calibration.</p><ul><li><strong>Against the computer:</strong> Apprentice, Amateur, Master and Grand Master. Training is private and never changes Elo.</li><li><strong>Two players:</strong> South and North alternate on the same device after a player signs in.</li><li><strong>Online banks:</strong> calibrated registered players create and play official games; every visitor can watch Live games and review the archive.</li></ul></section>
      <section><h3>Players, banks and invitations</h3><p>The left column shows live player status: free, against the computer, local play, waiting in a bank, playing or watching. A public computer match includes a <strong>Watch</strong> button.</p><p>Inside an online bank, WhatsApp buttons create a direct link to play or watch. Each player always sees their own side at the bottom.</p></section>
      <section><h3>Bank chat</h3><p>Chat is available to both players and spectators. Messages are sent in real time, limited to 280 characters and are not archived.</p></section>

      <section class="help-ai-section">
        <h3>How I built the computer opponent</h3>
        <p>I built the computer around a <strong>Minimax search with Alpha-Beta pruning</strong>. Instead of choosing only the immediate capture, I simulate a tree of legal moves: the computer maximises the score, while the human response is assumed to minimise it. Minimax therefore works on the assumption that both sides try to play their strongest move.</p>
        <p><strong>Theory.</strong> Every node represents a board position and every branch a legal move. The computer maximises the evaluation and the opponent minimises it. Alpha-Beta pruning discards branches that can no longer change the final decision. I also reuse previously analysed positions through a transposition table.</p>
        <p><strong>Depth.</strong> I measure depth in half-moves, or <em>plies</em>. Depth 1 examines one computer move; depth 2 adds one human reply; depth 24 is roughly twelve complete move-and-reply sequences.</p>
        <div class="help-levels" role="list" aria-label="Computer levels">
          <div role="listitem"><strong>Apprentice</strong><span>Depth 4 · 320 ms</span><small>Strength of the former Amateur, with 12% random choices.</small></div>
          <div role="listitem"><strong>Amateur</strong><span>Depth 8 · 950 ms</span><small>Strength of the former Master, without randomness.</small></div>
          <div role="listitem"><strong>Master</strong><span>Depth 12 · 2.6 s</span><small>Strength of the former Grand Master.</small></div>
          <div role="listitem"><strong>Grand Master</strong><span>Depth 24 · 12 s</span><small>Double the maximum depth and a larger search budget.</small></div>
        </div>
        <p>I use <strong>iterative deepening</strong>: first depth 1, then 2, 3 and so on. When time expires, I keep the best move from the last fully completed depth. On a slower phone, Grand Master may stop before reaching its maximum depth.</p>
        <p><strong>Position evaluation.</strong> When the search does not reach the end of the game, I score captured-seed difference (weight <strong>145</strong>), feeding pressure (<strong>18</strong>), mobility (<strong>8</strong>), vulnerable seeds (<strong>3.2</strong>), board-seed balance (<strong>2.2</strong>), large pits containing at least 12 seeds (<strong>2.5</strong>) and empty pits (<strong>1.4</strong>). A win is worth about <strong>+1,000,000</strong> and a loss <strong>−1,000,000</strong>.</p>
        <p><strong>How I approach Uril.</strong> I make the engine consider captures, compulsory feeding, mobility, vulnerable pits, large accumulations, threefold repetition, Capote and Frouxo. A simulation that clears all six pits while the player could still feed the opponent on the next turn is immediately scored as a Frouxo loss.</p>
        <p class="help-ai-note"><strong>Why a human can still win.</strong> I did not try to solve Uril completely or build an unbeatable machine. To simplify the engine and keep the game enjoyable, I limited depth and thinking time, kept some randomness only at Apprentice level, and left out opening books, complete endgame tables and machine learning. The evaluation is a strategic approximation, so an experienced human can still exploit positions beyond the computer’s search horizon.</p>
      </section>
      <section><h3>Cape Verde Uril rules</h3><ol><li><strong>Board.</strong> 12 playing pits, six per player, with four seeds in each pit, plus two lateral stores for won seeds.</li><li><strong>Direction.</strong> Sowing is counter-clockwise.</li><li><strong>Sowing.</strong> Take all seeds from one of your pits and sow one per pit; skip the starting pit after a full lap.</li><li><strong>One seed.</strong> Any of your pits with one or more seeds is playable.</li><li><strong>Capture.</strong> If the last seed leaves 2 or 3 seeds in an opposing pit, capture it and consecutive qualifying pits backwards.</li><li><strong>Feeding.</strong> If the opponent is empty, a feeding move is mandatory whenever one exists.</li><li><strong>All six pits.</strong> Capturing all six opposing pits is allowed only if, on the next turn, the player who cleared them can no longer feed the opponent. If feeding is still possible, it is <strong>Frouxo</strong> and that player loses the game.</li><li><strong>Normal end.</strong> The game does not end at 25; it continues until there is no valid move.</li><li><strong>Triple repetition.</strong> On the third repetition, each player keeps the seeds on their own side.</li><li><strong>Capote.</strong> A player finishing with fewer than 12 seeds suffers Capote, worth two games.</li><li><strong>Resignation.</strong> The player confirms before resigning. With 12 or more captured seeds, the loss counts as one game; below 12, it counts as two. The computer may also ask to resign when victory is mathematically impossible; the player accepts or refuses.</li><li><strong>Quatro.</strong> Four consecutive wins score a Quatro.</li><li><strong>Cut after Quatro.</strong> Two consecutive wins cut the count; a Capote cuts immediately.</li><li><strong>Next game.</strong> The winner starts; after a draw, the same starter begins again.</li></ol></section>
      <section><h3>Public suggestions</h3><p>The suggestions area is part of the page. Each post shows the nickname, country, island when applicable, date and time. Every visitor can read; only registered players publish and reply. Suggestions and replies are stored in Supabase and update in real time.</p></section>
      <section><h3>Sync problems</h3><p>Check that both players entered the same bank. After a GitHub update, use <strong>Ctrl + F5</strong> in both browsers.</p></section>
      <p class="rules-note">Version 1.0.0 will continue to be refined with experienced Uril players.</p>`,
    north: 'North', south: 'South', capeVerde: 'Cape Verde',
    matchDrawKeep: 'Draw: the count remains unchanged.', currentLead: '{player} leads the current count {wins}–0.', quatroRecorded: '{player} scored a Quatro. The Quatro remains recorded.', firstCutWin: '{player} earned the first cut win. One more consecutive win is needed.', capotePrefix: 'CAPOTE: {player} adds two games.',
    profileTooShort: 'Enter a nickname with at least two characters first.', statusPc: 'Playing against the computer{bank}', statusLocal: 'Playing locally', statusWaiting: 'In an Uril bank, waiting{bank}', statusPlaying: 'In an Uril bank, playing{bank}', statusWatching: 'In an Uril bank, watching{bank}', statusFree: 'Free',
    connectSupabasePlayers: 'Connect Supabase to see players.', playersConnectedOne: '1 player connected', playersConnectedMany: '{count} players connected', noPlayersConnected: 'No players connected yet.', guest: 'Guest', you: 'YOU', inGame: 'In game', invite: 'Invite', occupied: 'Busy', invitedToBank: '{nick} invited you to the Uril bank “{bank}”.',
    chatReady: 'Write in the bank…', chatConnecting: 'Connecting to chat…', bankNotFree: 'That Uril bank is no longer free.', onlineNotReady: 'Online mode is not connected yet.', playerAlreadyBusy: '{nick} is already in an Uril bank.', defaultBankName: '{nick}’s bank', pcBankName: '{nick} vs PC', pcBankPublished: 'Training against the computer is private.', pcBankPrivate: 'The match started privately because the online service is not connected yet.', pcBankPublishError: 'The match started, but the bank was not published: {error}', invitationSent: 'Invitation sent to {nick}.',
    connectSupabaseBanks: 'Connect Supabase to open online Uril banks.', noBanks: 'There are no Uril banks yet. Create the first one.', noLiveBanks: 'There are no Live games at the moment.', noOpenBanks: 'There are no banks still open.', noFinishedBanks: 'There are no completed games from the last 30 days.', filterLive: 'Live games', filterOpen: 'Still open', filterFinished: 'Completed', waitingUpper: 'STILL OPEN', playingUpper: 'LIVE', finishedUpper: 'COMPLETED', bankStartedAt: 'Started: {date}', bankLastMoveAt: 'Last move: {date}', bankNoMovesYet: 'No moves yet', pcBankUpper: 'PC · LIVE', resume: 'Resume', play: 'Play', watchPlay: 'Watch', consultMoves: 'Review moves', awaitingGuest: 'Waiting…', bankOnline: 'Online bank', versusPcMode: 'AGAINST PC · {level}', versusPcLiveMode: 'AGAINST PC · {level} · LIVE', watchingMode: 'WATCHING', onlineBankMode: 'ONLINE BANK', twoPlayersMode: 'TWO PLAYERS',
    matchFinished: 'Match ended', reviewMode: 'GAME REVIEW', reviewingBank: 'Reviewing a completed game', turnOf: '{player} to move', bankWaitingOpponent: 'Bank waiting for an opponent', watchingBank: 'Watching · South at the bottom', yourSideBelow: 'Your side is at the bottom · {player}', computerLevel: 'Computer at {level} level', computerPublicBank: 'Private computer training · {level} level', localBank: 'Local bank on the same device',
    collectedBy: 'Captured by {player}', capturedSeedsPit: 'Seeds won by {player}: {count}.', cut: 'Cut: {player} {wins}/2', protectedFour: 'Quatro protected by {player}', roundDraw: 'The match ended in a draw.', roundCapote: '{player} won by CAPOTE.', roundWin: '{player} won the match.', nextDraw: 'The board will be reset. {player} starts the next match.', nextCapote: 'Capote is worth two games. The board will be reset and {player} starts.', nextWin: 'The board will be reset. {player} starts the next match.',
    liftingTitle: '{player} picked up the seeds.', liftingText: 'The starting pit is emptied before sowing.', sowingTitle: '{player} is sowing.', sowingText: 'Seed {step} of {total}.', captureTitle: '{player} is capturing.', captureText: '{count} seeds captured from this pit.', moveDone: 'Move completed.', passingTurn: 'The turn is passing.', bankCreated: 'Bank created.', waitingInvitation: 'Waiting for another player to accept or join.',
    draw: 'Draw.', wonCapote: '{player} won by Capote.', wonMatch: '{player} won the match.', previousWin: '{player} won the previous match.', boardResetStarter: 'Board reset. {player} starts.', watchingTitle: 'You are watching.', playerTurn: '{player} has the turn.', waitOpponent: 'Wait for the opponent’s move.', computerThinking: 'The computer is thinking.', evaluatingMoves: 'Evaluating available pits.', choosePit: '{player}, choose a pit.', legalHighlighted: 'Valid pits are highlighted.', sowingLast: '{player} sows the seeds one by one.', capturingLast: '{player} captures the valid pits.',
    moveDescription: '{player} played {pit}{capture}.{repetition}', captureDescription: ' and captured {count} seeds{grandSlam}', sixPits: ' from all six pits', repetitionDescription: ' The position repeated for the third time and the match ended.', localGuestPrompt: 'North player nickname:',
    whatsappPlayMessage: 'Want to play Uril with me in the bank “{bank}”? This is Cape Verde Uril, the Cape Verdean variant of Ayo/Awalé. Join here: {url}',
    whatsappWatchMessage: 'Come watch this Uril bank: “{bank}”. This is Cape Verde Uril, the Cape Verdean variant of Ayo/Awalé. Open here: {url}',
    sharePlayUnavailable: 'This bank already has two players. Send a watch invitation instead.', shareOnlyOnline: 'WhatsApp invitations are available inside an official bank.', sharedPlayTitle: 'Invitation to play in “{bank}”.', sharedWatchTitle: 'Invitation to watch “{bank}”.', sharedInviteHelp: 'Sign in to accept the official invitation. As an anonymous visitor, you can still watch.', sharedBankMissing: 'The bank in this invitation is no longer available.', sharedBankStartedWatch: 'The bank has already started. You will join as a spectator.', consultBankError: 'Could not review the bank: {error}', gameReview: 'GAME REVIEW', reviewPosition: 'Move {current} of {total}', reviewHelp: 'Move the control to reconstruct the game one move at a time.', reviewFirst: 'First position', reviewPrevious: 'Previous move', reviewNext: 'Next move', reviewLast: 'Last position', reviewSlider: 'Game position', reviewStartPosition: 'Initial game position.', reviewMovePosition: 'Reviewing move {current} of {total}.', reviewNoDate: 'Date unavailable.', pitSeeds: '{pit}: {count} seeds', acceptInviteError: 'Could not accept the invitation: {error}', sendInviteError: 'Could not send the invitation: {error}', resetError: 'Could not reset the board: {error}', refreshBanksError: 'Could not refresh the Uril banks: {error}', supabaseRequired: 'Online Uril banks require the Supabase configuration included in the package.', createBankError: 'Error creating the Uril bank: {error}', enterBankError: 'Could not enter the Uril bank: {error}', syncBankError: 'Error synchronising the Uril bank: {error}', moveRejected: 'The move was not accepted.', aiTimeout: 'Move analysis exceeded the expected time.', aiFailed: 'The artificial intelligence failed.', aiStartFailed: 'Could not start the artificial intelligence.', computerError: 'Computer error: {error}', chatError: 'Chat: {error}', languageName: 'English',
  },
};

let currentLanguage = DEFAULT_LANGUAGE;

function normaliseLanguage(language) {
  const short = String(language || '').toLowerCase().split('-')[0];
  return SUPPORTED_LANGUAGES.has(short) ? short : DEFAULT_LANGUAGE;
}

export function getInitialLanguage() {
  try {
    const stored = localStorage.getItem('uril-language');
    if (stored) return normaliseLanguage(stored);
  } catch {}
  return normaliseLanguage(globalThis.navigator?.language || DEFAULT_LANGUAGE);
}

export function setLanguage(language) {
  currentLanguage = normaliseLanguage(language);
  try { localStorage.setItem('uril-language', currentLanguage); } catch {}
  document.documentElement.lang = currentLanguage === 'pt' ? 'pt-PT' : currentLanguage;
  return currentLanguage;
}

export function getLanguage() {
  return currentLanguage;
}

export function localeForLanguage(language = currentLanguage) {
  if (language === 'fr') return 'fr-FR';
  if (language === 'en') return 'en-GB';
  return 'pt-PT';
}

export function t(key, variables = {}) {
  const template = TEXT[currentLanguage]?.[key] ?? TEXT.pt[key] ?? key;
  return String(template).replace(/\{(\w+)\}/g, (_, name) => String(variables[name] ?? ''));
}

export function applyTranslations(root = document) {
  for (const node of root.querySelectorAll('[data-i18n]')) {
    node.textContent = t(node.dataset.i18n);
  }
  for (const node of root.querySelectorAll('[data-i18n-html]')) {
    node.innerHTML = t(node.dataset.i18nHtml);
  }
  for (const node of root.querySelectorAll('[data-i18n-placeholder]')) {
    node.setAttribute('placeholder', t(node.dataset.i18nPlaceholder));
  }
  for (const node of root.querySelectorAll('[data-i18n-aria]')) {
    node.setAttribute('aria-label', t(node.dataset.i18nAria));
  }
  for (const node of root.querySelectorAll('[data-i18n-title]')) {
    node.setAttribute('title', t(node.dataset.i18nTitle));
  }
  const description = document.querySelector('meta[name="description"]');
  if (description) description.setAttribute('content', t('metaDescription'));
}

setLanguage(getInitialLanguage());
