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
    rosterHelp: 'Os jogadores livres recebem convites directos para um banco de Uril.',
    versionZero: 'VERSÃO ZERO',
    heroTitle: 'O jogo tradicional,<br><em>ilha por ilha.</em>',
    heroIntro: 'Escolhe o teu nick, a tua ilha e entra num banco de Uril. Sem conta, sem formulários intermináveis.',
    variantLabel: 'AYO · AWALÉ · OWARE',
    variantIntro: 'O Uril é a variante praticada em Cabo Verde da grande família africana Ayo/Awalé/Oware, adaptada às regras e à tradição cabo-verdianas.',
    nickLabel: 'O teu nick',
    nickPlaceholder: 'Ex.: Mindelense77',
    islandLabel: 'A tua ilha',
    backgroundHint: 'O fundo acompanha a ilha escolhida.',
    playNow: 'JOGAR JÁ',
    versusComputer: 'Contra o computador',
    versusComputerDesc: 'Treino individual com quatro níveis de dificuldade. Com Supabase ligado, o banco fica visível para espectadores.',
    level: 'Nível',
    levelApprentice: 'Aprendiz',
    levelAmateur: 'Amador',
    levelMaster: 'Mestre',
    levelGrandmaster: 'Grande Mestre',
    startMatch: 'Começar partida',
    banksOnline: 'Bancos de Uril online',
    banksOnlineDesc: 'Cria um banco, convida outro jogador ou entra apenas para assistir.',
    viewBanks: 'Ver bancos',
    sameScreen: 'MESMO ECRÃ',
    twoPlayers: 'Dois jogadores',
    twoPlayersDesc: 'Uma partida local, alternando no mesmo dispositivo.',
    playLocally: 'Jogar localmente',
    openBanks: 'BANCOS ABERTOS',
    urilBanks: 'Bancos de Uril',
    refresh: 'Actualizar',
    bankNamePlaceholder: 'Nome do banco',
    createBank: 'Criar banco',
    setupNotice: 'Os bancos de Uril online ainda não estão ligados ao Supabase. O jogo contra o computador e o modo local já funcionam. Consulta o ficheiro <strong>GUIA-GITHUB.md</strong> para activar esta área.',
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
    keepPlaying: 'Continuar a jogar', confirmResign: 'Confirmar desistência', reasonResignation: 'Desistência de {player}.', resignationWin: '{loser} desistiu. {winner} venceu.', resignationResultOne: 'A desistência vale uma partida.', resignationResultTwo: 'A desistência vale duas partidas porque {player} ainda não tinha 12 sementes.',
    roundResignation: '{loser} desistiu. {winner} venceu a partida.', nextResignationOne: 'A desistência vale uma partida. O tabuleiro será arrumado e {player} começa.', nextResignationTwo: 'A desistência vale duas partidas. O tabuleiro será arrumado e {player} começa.', resignError: 'Não foi possível registar a desistência.',
    aiResignEyebrow: 'PEDIDO DO COMPUTADOR', aiResignTitle: 'O computador quer desistir', aiResignWarningOne: '{player} concluiu que já não consegue ganhar e pede desistência por uma partida. Aceitas?', aiResignWarningTwo: '{player} concluiu que já não consegue ganhar e pede desistência por duas partidas, porque ainda tem apenas {seeds} sementes. Aceitas?', rejectAIResign: 'Não aceitar', acceptAIResign: 'Aceitar desistência',
    footerCopyright: '© 2026 Salazar da Cruz', footerConcept: 'Conceito, desenvolvimento e direcção', versionLabel: 'Versão 0.0.28', suggestions: 'Sugestões', suggestionsCommunity: 'COMUNIDADE', suggestionsTitle: 'Sugestões e respostas', suggestionsIntro: 'As sugestões ficam públicas, identificadas pelo nick e pela data. Todos podem ler e responder.', publishAs: 'Publicar como', suggestionPlaceholder: 'A tua sugestão…', suggestionsPublicNote: 'A sugestão ficará visível para todos os visitantes.', publishSuggestion: 'Publicar sugestão', suggestionsPublished: 'sugestões publicadas', suggestionsEmpty: 'Ainda não há sugestões. Abre a conversa.', suggestionsNeedSupabase: 'Liga o Supabase para publicar e consultar sugestões.', suggestionsLoading: 'A carregar sugestões…', suggestionsMigrationNeeded: 'Executa o ficheiro supabase-sugestoes-v0.0.24.sql no SQL Editor do Supabase.', suggestionsLoadError: 'Não foi possível carregar as sugestões: {error}', suggestionEmpty: 'Escreve primeiro uma sugestão com pelo menos quatro caracteres.', suggestionPublished: 'A sugestão foi publicada.', suggestionPublishError: 'Não foi possível publicar a sugestão: {error}', reply: 'Responder', replyCount: '{count} respostas', replyPlaceholder: 'Escreve uma resposta…', replyAria: 'Responder à sugestão de {nick}', cancelReply: 'Cancelar', publishReply: 'Publicar resposta', replyEmpty: 'Escreve primeiro uma resposta.', replyPublished: 'A resposta foi publicada.', replyPublishError: 'Não foi possível publicar a resposta: {error}',
    helpVersion: 'AJUDA V0.0.28',
    helpTitle: 'Ajuda, bancos e regras',
    helpContent: `
      <section>
        <h3>O que é o Uril</h3>
        <p>O Uril é a variante praticada em Cabo Verde da grande família de jogos africanos conhecida por nomes como <strong>Ayo</strong>, <strong>Awalé</strong> e <strong>Oware</strong>. Esta versão segue as regras e a tradição cabo-verdianas, não uma regra genérica importada de outra variante.</p>
      </section>
      <section>
        <h3>Começar a jogar</h3>
        <p>Escolhe um nick e a ilha. A ilha define o fundo do jogo. Não existe registo por email: no modo online é criada apenas uma sessão técnica anónima.</p>
        <ul>
          <li><strong>Contra o computador:</strong> níveis Aprendiz, Amador, Mestre e Grande Mestre. Com o Supabase ligado, a partida abre automaticamente um banco público que outros jogadores conseguem observar em tempo real.</li>
          <li><strong>Dois jogadores:</strong> Sul e Norte alternam no mesmo dispositivo. As casas da fila superior pertencem a Norte.</li>
          <li><strong>Bancos de Uril online:</strong> cria um banco, entra num banco à espera, retoma o teu banco ou assiste a uma partida em curso.</li>
        </ul>
      </section>
      <section>
        <h3>Jogadores, bancos e convites</h3>
        <p>A coluna da esquerda actualiza-se em tempo real quando alguém entra, sai ou muda de modo. Mostra os estados: livre, a jogar contra o computador, a jogar no modo local, num banco à espera, num banco a jogar ou a ver jogar. Quando uma partida contra o computador tem banco público, surge o botão <strong>Ver jogar</strong>.</p>
        <p>Um jogador livre recebe um convite directo pelo próprio jogo. Dentro de um banco online, os botões de WhatsApp geram um link directo para jogar ou para assistir. Quem abre o link escolhe o nick e entra no banco indicado.</p>
        <p>Nos bancos online, cada jogador vê sempre o seu próprio campo na parte inferior. Os espectadores vêem Sul na parte inferior. As jogadas são sincronizadas e animadas semente a semente nos dois navegadores.</p>
      </section>
      <section>
        <h3>Chat do banco</h3>
        <p>O chat aparece dentro de um banco online e está disponível aos dois jogadores e aos espectadores. As mensagens circulam em tempo real, têm um máximo de 280 caracteres e não ficam guardadas na base de dados.</p>
      </section>
      <section>
        <h3>Regras do Uril de Cabo Verde</h3>
        <ol>
          <li><strong>Tabuleiro.</strong> São 12 casas, seis para Sul e seis para Norte, com quatro sementes em cada casa.</li>
          <li><strong>Orientação.</strong> A distribuição segue o sentido anti-horário. A casa 6 de cada lado encosta à casa 1 do adversário.</li>
          <li><strong>Sementeira.</strong> Retiram-se todas as sementes de uma casa própria e distribui-se uma por casa. Ao completar a volta, a casa de origem é saltada.</li>
          <li><strong>Casa com uma semente.</strong> Qualquer casa própria com uma ou mais sementes é jogável. Quando o adversário está sem sementes, escolhe-se uma jogada que o alimente, quando tal jogada existe.</li>
          <li><strong>Colheita.</strong> Quando a última semente termina numa casa adversária com 2 ou 3 sementes, colhe-se essa casa e, para trás, as casas adversárias consecutivas que também tenham 2 ou 3.</li>
          <li><strong>Alimentação.</strong> Com o campo adversário vazio, é obrigatório deixar-lhe pelo menos uma semente. Sem qualquer jogada de alimentação, a partida termina.</li>
          <li><strong>As seis casas.</strong> É admitida a colheita das seis casas adversárias. A partida termina apenas quando o adversário fica sem jogada de alimentação.</li>
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
        <p>A área de sugestões fica na própria página. Cada publicação mostra o nick, a ilha, a data e a hora. Todos os visitantes conseguem ler e responder. As sugestões e respostas ficam guardadas no Supabase e actualizam-se em tempo real.</p>
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
    pcBankPublished: 'O banco contra o computador está público e já pode ser observado.',
    pcBankPrivate: 'A partida começou em modo privado porque o serviço online ainda não está ligado.',
    pcBankPublishError: 'A partida começou, mas o banco não ficou público: {error}',
    invitationSent: 'Convite enviado a {nick}.',
    connectSupabaseBanks: 'Liga o Supabase para abrir os bancos de Uril online.',
    noBanks: 'Ainda não há bancos de Uril. Cria o primeiro banco.',
    waitingUpper: 'À ESPERA',
    playingUpper: 'EM JOGO',
    pcBankUpper: 'PC · AO VIVO',
    resume: 'Retomar',
    play: 'Jogar',
    watchPlay: 'Ver jogar',
    awaitingGuest: 'À espera…',
    bankOnline: 'Banco online',
    versusPcMode: 'CONTRA O PC · {level}', versusPcLiveMode: 'CONTRA O PC · {level} · AO VIVO',
    watchingMode: 'A ASSISTIR',
    onlineBankMode: 'BANCO ONLINE',
    twoPlayersMode: 'DOIS JOGADORES',
    matchFinished: 'Partida terminada',
    turnOf: 'Vez de {player}',
    bankWaitingOpponent: 'Banco à espera de adversário',
    watchingBank: 'A ver o banco · Sul em baixo',
    yourSideBelow: 'O teu lado está em baixo · {player}',
    computerLevel: 'Computador no nível {level}', computerPublicBank: 'Banco público contra o computador · nível {level}',
    localBank: 'Banco local no mesmo dispositivo',
    collectedBy: 'Colhidas por {player}',
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
    shareOnlyOnline: 'Os convites por WhatsApp estão disponíveis dentro de um banco online ou de um banco público contra o computador.',
    sharedPlayTitle: 'Convite para jogar em “{bank}”.',
    sharedWatchTitle: 'Convite para assistir a “{bank}”.',
    sharedInviteHelp: 'Escolhe o teu nick e a tua ilha; depois abre o convite.',
    sharedBankMissing: 'O banco indicado no convite já não está disponível.',
    sharedBankStartedWatch: 'O banco já começou. Vais entrar para assistir.',
    north: 'Norte', south: 'Sul', capeVerde: 'Cabo Verde',
    matchDrawKeep: 'Empate: a contagem mantém-se.', currentLead: '{player} lidera a contagem actual por {wins}–0.', quatroRecorded: '{player} marcou um Quatro. O Quatro fica registado.', firstCutWin: '{player} conseguiu a primeira vitória para cortar. Falta mais uma consecutiva.', capotePrefix: 'CAPOTE: {player} soma duas partidas.',
    pitSeeds: '{pit}: {count} sementes', acceptInviteError: 'Não foi possível aceitar o convite: {error}', sendInviteError: 'Não foi possível enviar o convite: {error}', resetError: 'Não foi possível arrumar o tabuleiro: {error}', refreshBanksError: 'Não foi possível actualizar os bancos de Uril: {error}', supabaseRequired: 'Os bancos de Uril online precisam da configuração Supabase incluída no pacote.', createBankError: 'Erro ao criar banco de Uril: {error}', enterBankError: 'Não foi possível entrar no banco de Uril: {error}', syncBankError: 'Erro ao sincronizar o banco de Uril: {error}', moveRejected: 'A jogada não foi aceite.', aiTimeout: 'A análise da jogada excedeu o tempo previsto.', aiFailed: 'A inteligência artificial falhou.', aiStartFailed: 'Não foi possível iniciar a inteligência artificial.', computerError: 'Erro do computador: {error}', chatError: 'Chat: {error}', languageName: 'Português',
  },

  fr: {
    metaDescription: 'Uril du Cap-Vert — variante cap-verdienne de la famille Ayo/Awalé, avec jeu local, ordinateur et banques en ligne.',
    brandHomeAria: 'Retour à l’accueil', onlinePlayers: 'joueurs en ligne', helpAndRules: 'Aide et règles', live: 'EN DIRECT',
    onlineRosterTitle: 'Joueurs en ligne', connectingPlayers: 'Connexion à la liste des joueurs…', rosterHelp: 'Les joueurs libres reçoivent des invitations directes vers une banque d’Uril.',
    versionZero: 'VERSION ZÉRO', heroTitle: 'Le jeu traditionnel,<br><em>île par île.</em>', heroIntro: 'Choisis ton pseudo, ton île et entre dans une banque d’Uril. Sans compte ni formulaire interminable.',
    variantLabel: 'AYO · AWALÉ · OWARE', variantIntro: 'L’Uril est la variante pratiquée au Cap-Vert de la grande famille africaine Ayo/Awalé/Oware, adaptée aux règles et à la tradition cap-verdiennes.',
    nickLabel: 'Ton pseudo', nickPlaceholder: 'Ex. : Mindelense77', islandLabel: 'Ton île', backgroundHint: 'Le fond suit l’île choisie.', playNow: 'JOUER',
    versusComputer: 'Contre l’ordinateur', versusComputerDesc: 'Entraînement individuel avec quatre niveaux. Avec Supabase connecté, la banque devient visible aux spectateurs.', level: 'Niveau',
    levelApprentice: 'Apprenti', levelAmateur: 'Amateur', levelMaster: 'Maître', levelGrandmaster: 'Grand Maître', startMatch: 'Commencer la partie',
    banksOnline: 'Banques d’Uril en ligne', banksOnlineDesc: 'Crée une banque, invite un autre joueur ou entre seulement pour regarder.', viewBanks: 'Voir les banques',
    sameScreen: 'MÊME ÉCRAN', twoPlayers: 'Deux joueurs', twoPlayersDesc: 'Une partie locale en alternance sur le même appareil.', playLocally: 'Jouer en local',
    openBanks: 'BANQUES OUVERTES', urilBanks: 'Banques d’Uril', refresh: 'Actualiser', bankNamePlaceholder: 'Nom de la banque', createBank: 'Créer une banque',
    setupNotice: 'Les banques d’Uril en ligne ne sont pas encore reliées à Supabase. Le jeu contre l’ordinateur et le mode local fonctionnent déjà. Consulte <strong>GUIA-GITHUB.md</strong>.',
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
    resignButton: 'Abandonner', resignEyebrow: 'ABANDON', resignDialogTitle: 'Confirmer l’abandon', resignDialogPlayer: '{player} demande l’abandon.', resignWarningOne: '{player}, tu as {seeds} graines récoltées. L’abandon vaut une partie.', resignWarningTwo: '{player}, tu n’as encore que {seeds} graines. Comme tu n’as pas atteint 12, l’abandon vaut deux parties, comme un Capote.', keepPlaying: 'Continuer à jouer', confirmResign: 'Confirmer l’abandon', reasonResignation: 'Abandon de {player}.', resignationWin: '{loser} a abandonné. {winner} gagne.', resignationResultOne: 'L’abandon vaut une partie.', resignationResultTwo: 'L’abandon vaut deux parties car {player} n’avait pas encore 12 graines.', roundResignation: '{loser} a abandonné. {winner} gagne la partie.', nextResignationOne: 'L’abandon vaut une partie. Le plateau sera remis en place et {player} commencera.', nextResignationTwo: 'L’abandon vaut deux parties. Le plateau sera remis en place et {player} commencera.', resignError: 'Impossible d’enregistrer l’abandon.', aiResignEyebrow: 'DEMANDE DE L’ORDINATEUR', aiResignTitle: 'L’ordinateur veut abandonner', aiResignWarningOne: '{player} estime ne plus pouvoir gagner et demande l’abandon pour une partie. Acceptes-tu ?', aiResignWarningTwo: '{player} estime ne plus pouvoir gagner et demande l’abandon pour deux parties, car il n’a encore que {seeds} graines. Acceptes-tu ?', rejectAIResign: 'Refuser', acceptAIResign: 'Accepter l’abandon', footerCopyright: '© 2026 Salazar da Cruz', footerConcept: 'Conception, développement et direction', versionLabel: 'Version 0.0.28', suggestions: 'Suggestions', suggestionsCommunity: 'COMMUNAUTÉ', suggestionsTitle: 'Suggestions et réponses', suggestionsIntro: 'Les suggestions sont publiques, avec le pseudo et la date. Tout le monde peut les lire et répondre.', publishAs: 'Publier comme', suggestionPlaceholder: 'Ta suggestion…', suggestionsPublicNote: 'La suggestion sera visible par tous les visiteurs.', publishSuggestion: 'Publier la suggestion', suggestionsPublished: 'suggestions publiées', suggestionsEmpty: 'Aucune suggestion pour le moment. Lance la discussion.', suggestionsNeedSupabase: 'Connecte Supabase pour publier et consulter les suggestions.', suggestionsLoading: 'Chargement des suggestions…', suggestionsMigrationNeeded: 'Exécute le fichier supabase-sugestoes-v0.0.24.sql dans le SQL Editor de Supabase.', suggestionsLoadError: 'Impossible de charger les suggestions : {error}', suggestionEmpty: 'Écris une suggestion d’au moins quatre caractères.', suggestionPublished: 'La suggestion a été publiée.', suggestionPublishError: 'Impossible de publier la suggestion : {error}', reply: 'Répondre', replyCount: '{count} réponses', replyPlaceholder: 'Écris une réponse…', replyAria: 'Répondre à la suggestion de {nick}', cancelReply: 'Annuler', publishReply: 'Publier la réponse', replyEmpty: 'Écris d’abord une réponse.', replyPublished: 'La réponse a été publiée.', replyPublishError: 'Impossible de publier la réponse : {error}',
    helpVersion: 'AIDE V0.0.28', helpTitle: 'Aide, banques et règles', close: 'Fermer',
    helpContent: `
      <section><h3>Qu’est-ce que l’Uril ?</h3><p>L’Uril est la variante pratiquée au Cap-Vert de la grande famille de jeux africains connue sous les noms <strong>Ayo</strong>, <strong>Awalé</strong> et <strong>Oware</strong>. Cette version suit les règles et la tradition cap-verdiennes.</p></section>
      <section><h3>Commencer à jouer</h3><p>Choisis un pseudo et une île. L’île définit le fond. En ligne, seule une session technique anonyme est créée.</p><ul><li><strong>Contre l’ordinateur :</strong> Apprenti, Amateur, Maître et Grand Maître. Avec Supabase connecté, la partie ouvre automatiquement une banque publique observable en temps réel.</li><li><strong>Deux joueurs :</strong> Sud et Nord alternent sur le même appareil.</li><li><strong>Banques en ligne :</strong> crée, rejoins, reprends ou regarde une banque.</li></ul></section>
      <section><h3>Joueurs, banques et invitations</h3><p>La colonne de gauche montre en temps réel les joueurs libres, ceux qui jouent contre l’ordinateur, en local, dans une banque ou comme spectateurs. Une partie publique contre l’ordinateur affiche le bouton <strong>Regarder</strong>.</p><p>Dans une banque, les boutons WhatsApp créent un lien direct pour jouer ou regarder. Chaque joueur voit toujours son propre camp en bas.</p></section>
      <section><h3>Chat</h3><p>Le chat est ouvert aux deux joueurs et aux spectateurs. Les messages sont transmis en temps réel, limités à 280 caractères et non archivés.</p></section>
      <section><h3>Règles de l’Uril du Cap-Vert</h3><ol><li><strong>Plateau.</strong> 12 cases, six par joueur, quatre graines par case.</li><li><strong>Sens.</strong> Distribution antihoraire.</li><li><strong>Semis.</strong> Toutes les graines d’une case sont distribuées une par une; la case de départ est sautée après un tour complet.</li><li><strong>Une graine.</strong> Toute case propre contenant au moins une graine est jouable.</li><li><strong>Récolte.</strong> La dernière graine permet de récolter les cases adverses consécutives contenant 2 ou 3 graines.</li><li><strong>Alimentation.</strong> Si le camp adverse est vide, il faut l’alimenter lorsqu’un coup le permet.</li><li><strong>Six cases.</strong> La récolte des six cases adverses est admise.</li><li><strong>Fin.</strong> La partie ne s’arrête pas à 25; elle continue jusqu’à l’absence de coup.</li><li><strong>Triple répétition.</strong> À la troisième répétition, chacun garde les graines de son camp.</li><li><strong>Capote.</strong> Moins de 12 graines : Capote, valant deux parties.</li><li><strong>Quatro.</strong> Quatre victoires consécutives marquent un Quatro.</li><li><strong>Coupe.</strong> Deux victoires consécutives coupent après un Quatro; un Capote coupe immédiatement.</li><li><strong>Partie suivante.</strong> Le gagnant commence; en cas de nul, le même joueur recommence.</li></ol></section>
      <section><h3>Suggestions publiques</h3><p>La section des suggestions se trouve directement sur la page. Chaque publication affiche le pseudo, l’île, la date et l’heure. Tous les visiteurs peuvent lire et répondre. Les suggestions et les réponses sont enregistrées dans Supabase et se mettent à jour en temps réel.</p></section>
      <section><h3>Synchronisation</h3><p>Vérifie que les deux joueurs sont dans la même banque. Après une mise à jour GitHub, utilise <strong>Ctrl + F5</strong>.</p></section>
      <p class="rules-note">Cette version zéro continuera d’être ajustée avec des joueurs expérimentés d’Uril.</p>`,
    north: 'Nord', south: 'Sud', capeVerde: 'Cap-Vert',
    matchDrawKeep: 'Match nul : le compte reste inchangé.', currentLead: '{player} mène le compte actuel par {wins}–0.', quatroRecorded: '{player} a marqué un Quatro. Le Quatro reste enregistré.', firstCutWin: '{player} a obtenu la première victoire de coupe. Il en manque encore une consécutive.', capotePrefix: 'CAPOTE : {player} ajoute deux parties.',
    profileTooShort: 'Écris d’abord un pseudo d’au moins deux caractères.', statusPc: 'Joue contre l’ordinateur{bank}', statusLocal: 'Joue en mode local',
    statusWaiting: 'Dans une banque d’Uril, en attente{bank}', statusPlaying: 'Dans une banque d’Uril, en jeu{bank}', statusWatching: 'Dans une banque d’Uril, regarde{bank}', statusFree: 'Libre',
    connectSupabasePlayers: 'Relie Supabase pour voir les joueurs.', playersConnectedOne: '1 joueur connecté', playersConnectedMany: '{count} joueurs connectés', noPlayersConnected: 'Aucun joueur connecté.',
    guest: 'Invité', you: 'TOI', inGame: 'En jeu', invite: 'Inviter', occupied: 'Occupé', invitedToBank: '{nick} t’invite dans la banque d’Uril « {bank} ».',
    chatReady: 'Écrire dans la banque…', chatConnecting: 'Connexion au chat…', bankNotFree: 'Cette banque d’Uril n’est plus libre.', onlineNotReady: 'Le mode en ligne n’est pas encore relié.',
    playerAlreadyBusy: '{nick} est déjà dans une banque d’Uril.', defaultBankName: 'Banque de {nick}', pcBankName: 'Banque de {nick} contre le PC', pcBankPublished: 'La banque contre l’ordinateur est publique et peut maintenant être regardée.', pcBankPrivate: 'La partie a commencé en privé car le service en ligne n’est pas encore connecté.', pcBankPublishError: 'La partie a commencé, mais la banque n’est pas publique : {error}', invitationSent: 'Invitation envoyée à {nick}.',
    connectSupabaseBanks: 'Relie Supabase pour ouvrir les banques d’Uril en ligne.', noBanks: 'Aucune banque d’Uril. Crée la première.', waitingUpper: 'EN ATTENTE', playingUpper: 'EN JEU', pcBankUpper: 'PC · EN DIRECT',
    resume: 'Reprendre', play: 'Jouer', watchPlay: 'Regarder', awaitingGuest: 'En attente…', bankOnline: 'Banque en ligne', versusPcMode: 'CONTRE LE PC · {level}', versusPcLiveMode: 'CONTRE LE PC · {level} · EN DIRECT', watchingMode: 'SPECTATEUR', onlineBankMode: 'BANQUE EN LIGNE', twoPlayersMode: 'DEUX JOUEURS',
    matchFinished: 'Partie terminée', turnOf: 'Tour de {player}', bankWaitingOpponent: 'Banque en attente d’un adversaire', watchingBank: 'Spectateur · Sud en bas', yourSideBelow: 'Ton camp est en bas · {player}', computerLevel: 'Ordinateur, niveau {level}', computerPublicBank: 'Banque publique contre l’ordinateur · niveau {level}', localBank: 'Banque locale sur le même appareil',
    collectedBy: 'Récoltées par {player}', cut: 'Coupe : {player} {wins}/2', protectedFour: 'Quatro protégé par {player}', roundDraw: 'La partie se termine par un nul.', roundCapote: '{player} gagne par CAPOTE.', roundWin: '{player} gagne la partie.',
    nextDraw: 'Le plateau va être remis en place. {player} commence la prochaine partie.', nextCapote: 'Le Capote vaut deux parties. Le plateau est remis en place et {player} commence.', nextWin: 'Le plateau va être remis en place. {player} commence.',
    liftingTitle: '{player} ramasse les graines.', liftingText: 'La case de départ est vidée avant la distribution.', sowingTitle: '{player} sème.', sowingText: 'Graine {step} sur {total}.', captureTitle: '{player} récolte.', captureText: '{count} graines récoltées dans cette case.', moveDone: 'Coup terminé.', passingTurn: 'Le tour passe au joueur suivant.', bankCreated: 'Banque créée.', waitingInvitation: 'En attente d’un joueur.',
    draw: 'Match nul.', wonCapote: '{player} gagne par Capote.', wonMatch: '{player} gagne la partie.', previousWin: '{player} a gagné la partie précédente.', boardResetStarter: 'Plateau remis en place. {player} commence.', watchingTitle: 'Tu regardes la partie.', playerTurn: 'C’est au tour de {player}.', waitOpponent: 'Attends le coup adverse.', computerThinking: 'L’ordinateur réfléchit.', evaluatingMoves: 'Analyse des cases disponibles.', choosePit: '{player}, choisis une case.', legalHighlighted: 'Les cases valides sont mises en évidence.', sowingLast: '{player} distribue les graines une par une.', capturingLast: '{player} récolte les cases valides.',
    moveDescription: '{player} joue {pit}{capture}.{repetition}', captureDescription: ' et récolte {count} graines{grandSlam}', sixPits: ' dans les six cases', repetitionDescription: ' La position s’est répétée trois fois et la partie est terminée.', localGuestPrompt: 'Pseudo du joueur Nord :',
    whatsappPlayMessage: 'Veux-tu jouer à l’Uril avec moi dans la banque « {bank} » ? C’est la variante cap-verdienne de l’Ayo/Awalé. Entre ici : {url}',
    whatsappWatchMessage: 'Viens regarder cette banque d’Uril : « {bank} ». C’est la variante cap-verdienne de l’Ayo/Awalé. Ouvre ici : {url}',
    sharePlayUnavailable: 'Cette banque a déjà deux joueurs. Envoie plutôt une invitation pour regarder.', shareOnlyOnline: 'Les invitations WhatsApp sont disponibles dans une banque en ligne ou une banque publique contre l’ordinateur.',
    sharedPlayTitle: 'Invitation à jouer dans « {bank} ».', sharedWatchTitle: 'Invitation à regarder « {bank} ».', sharedInviteHelp: 'Choisis ton pseudo et ton île, puis ouvre l’invitation.', sharedBankMissing: 'La banque indiquée n’est plus disponible.', sharedBankStartedWatch: 'La partie a déjà commencé. Tu vas entrer comme spectateur.', pitSeeds: '{pit} : {count} graines', acceptInviteError: 'Impossible d’accepter l’invitation : {error}', sendInviteError: 'Impossible d’envoyer l’invitation : {error}', resetError: 'Impossible de remettre le plateau en place : {error}', refreshBanksError: 'Impossible d’actualiser les banques d’Uril : {error}', supabaseRequired: 'Les banques d’Uril en ligne nécessitent la configuration Supabase du paquet.', createBankError: 'Erreur lors de la création de la banque : {error}', enterBankError: 'Impossible d’entrer dans la banque d’Uril : {error}', syncBankError: 'Erreur de synchronisation de la banque : {error}', moveRejected: 'Le coup n’a pas été accepté.', aiTimeout: 'L’analyse du coup a dépassé le temps prévu.', aiFailed: 'L’intelligence artificielle a échoué.', aiStartFailed: 'Impossible de démarrer l’intelligence artificielle.', computerError: 'Erreur de l’ordinateur : {error}', chatError: 'Chat : {error}', languageName: 'Français',
  },

  en: {
    metaDescription: 'Cape Verde Uril — the Cape Verdean variant of the Ayo/Awalé family, with local, computer and online bank play.',
    brandHomeAria: 'Back to home', onlinePlayers: 'players online', helpAndRules: 'Help and rules', live: 'LIVE', onlineRosterTitle: 'Players online', connectingPlayers: 'Connecting to the player lobby…', rosterHelp: 'Free players receive direct invitations to an Uril bank.',
    versionZero: 'VERSION ZERO', heroTitle: 'The traditional game,<br><em>island by island.</em>', heroIntro: 'Choose your nickname and island, then enter an Uril bank. No account and no endless forms.',
    variantLabel: 'AYO · AWALÉ · OWARE', variantIntro: 'Uril is the Cape Verdean variant of the wider African Ayo/Awalé/Oware family, adapted to Cape Verdean rules and tradition.',
    nickLabel: 'Your nickname', nickPlaceholder: 'E.g. Mindelense77', islandLabel: 'Your island', backgroundHint: 'The background follows your chosen island.', playNow: 'PLAY NOW',
    versusComputer: 'Against the computer', versusComputerDesc: 'Solo practice with four difficulty levels. With Supabase connected, the bank is visible to spectators.', level: 'Level', levelApprentice: 'Apprentice', levelAmateur: 'Amateur', levelMaster: 'Master', levelGrandmaster: 'Grand Master', startMatch: 'Start match',
    banksOnline: 'Online Uril banks', banksOnlineDesc: 'Create a bank, invite another player or join only to watch.', viewBanks: 'View banks', sameScreen: 'SAME SCREEN', twoPlayers: 'Two players', twoPlayersDesc: 'A local match, taking turns on the same device.', playLocally: 'Play locally',
    openBanks: 'OPEN BANKS', urilBanks: 'Uril banks', refresh: 'Refresh', bankNamePlaceholder: 'Bank name', createBank: 'Create bank', setupNotice: 'Online Uril banks are not connected to Supabase yet. Computer and local play already work. See <strong>GUIA-GITHUB.md</strong>.',
    whatsappInviteLabel: 'WHATSAPP INVITATION', whatsappInviteDefault: 'You received an invitation to an Uril bank.', openWhatsappBank: 'Open invitation', leaveBank: '← Leave bank', match: 'MATCH', bankOfUril: 'Uril bank', arrangeNow: 'Reset now', quatros: 'QUATROS', count: 'COUNT',
    pickedNorth: 'Captured by North', turnSouth: 'South to move', pickedSouth: 'Captured by South', boardAria: 'Uril board', seeds48: '48 seeds · Cape Verde', roundEnded: 'MATCH ENDED', southWon: 'South won the match.', boardWillReset: 'The board will be reset.', matchStarted: 'The match has started.', southStarts: 'South starts.',
    bankStatus: 'BANK STATUS', localMatch: 'Local match', countStarts: 'The count starts at 0–0.', lastMove: 'LAST MOVE', noMoves: 'No moves yet.', bankChat: 'BANK CHAT', chatEmpty: 'No messages in this bank yet.', chatPlaceholder: 'Write in the bank…', chatAria: 'Chat message', send: 'Send', chatNote: 'Messages are sent in real time and are not archived.',
    whatsappShare: 'INVITE VIA WHATSAPP', whatsappShareText: 'Share this bank with another player or someone who wants to watch.', inviteToPlayWhatsapp: 'Invite to play', inviteToWatchWhatsapp: 'Invite to watch', reminder: 'REMINDER', reminderText: 'Sow counter-clockwise, skipping the starting pit after a full lap. Capture consecutive opposing pits containing 2 or 3 seeds.', fullRules: 'Read full rules', assetCredit: 'Historical reference for the classic artwork: Oliver Merkel, CC BY-NC-SA 4.0.',
    invitationReceived: 'INVITATION RECEIVED', genericInvite: 'You received an invitation to an Uril bank.', decline: 'Decline', enterBank: 'Enter bank', resignButton: 'Resign', resignEyebrow: 'RESIGNATION', resignDialogTitle: 'Confirm resignation', resignDialogPlayer: '{player} is asking to resign.', resignWarningOne: '{player}, you have captured {seeds} seeds. Resigning counts as one game.', resignWarningTwo: '{player}, you have captured only {seeds} seeds. Since you have not reached 12, resigning counts as two games, like a Capote.', keepPlaying: 'Keep playing', confirmResign: 'Confirm resignation', reasonResignation: '{player} resigned.', resignationWin: '{loser} resigned. {winner} won.', resignationResultOne: 'The resignation counts as one game.', resignationResultTwo: 'The resignation counts as two games because {player} had not yet reached 12 seeds.', roundResignation: '{loser} resigned. {winner} won the game.', nextResignationOne: 'The resignation counts as one game. The board will be reset and {player} starts.', nextResignationTwo: 'The resignation counts as two games. The board will be reset and {player} starts.', resignError: 'Could not register the resignation.', aiResignEyebrow: 'COMPUTER REQUEST', aiResignTitle: 'The computer wants to resign', aiResignWarningOne: '{player} has concluded it can no longer win and asks to resign for one game. Do you accept?', aiResignWarningTwo: '{player} has concluded it can no longer win and asks to resign for two games because it has only {seeds} seeds. Do you accept?', rejectAIResign: 'Do not accept', acceptAIResign: 'Accept resignation', footerCopyright: '© 2026 Salazar da Cruz', footerConcept: 'Concept, development and direction', versionLabel: 'Version 0.0.28', suggestions: 'Suggestions', suggestionsCommunity: 'COMMUNITY', suggestionsTitle: 'Suggestions and replies', suggestionsIntro: 'Suggestions are public and show the nickname and date. Everyone can read and reply.', publishAs: 'Publish as', suggestionPlaceholder: 'Your suggestion…', suggestionsPublicNote: 'The suggestion will be visible to every visitor.', publishSuggestion: 'Publish suggestion', suggestionsPublished: 'published suggestions', suggestionsEmpty: 'There are no suggestions yet. Start the conversation.', suggestionsNeedSupabase: 'Connect Supabase to publish and view suggestions.', suggestionsLoading: 'Loading suggestions…', suggestionsMigrationNeeded: 'Run supabase-sugestoes-v0.0.24.sql in the Supabase SQL Editor.', suggestionsLoadError: 'Could not load suggestions: {error}', suggestionEmpty: 'Write a suggestion with at least four characters.', suggestionPublished: 'The suggestion was published.', suggestionPublishError: 'Could not publish the suggestion: {error}', reply: 'Reply', replyCount: '{count} replies', replyPlaceholder: 'Write a reply…', replyAria: 'Reply to {nick}’s suggestion', cancelReply: 'Cancel', publishReply: 'Publish reply', replyEmpty: 'Write a reply first.', replyPublished: 'The reply was published.', replyPublishError: 'Could not publish the reply: {error}', helpVersion: 'HELP V0.0.28', helpTitle: 'Help, banks and rules', close: 'Close',
    helpContent: `
      <section><h3>What is Uril?</h3><p>Uril is the Cape Verdean variant of the broad African game family known as <strong>Ayo</strong>, <strong>Awalé</strong> and <strong>Oware</strong>. This version follows Cape Verdean rules and tradition.</p></section>
      <section><h3>Starting a game</h3><p>Choose a nickname and island. The island sets the background. Online mode creates only an anonymous technical session.</p><ul><li><strong>Against the computer:</strong> Apprentice, Amateur, Master and Grand Master. With Supabase connected, the match automatically opens a public bank that can be watched live.</li><li><strong>Two players:</strong> South and North alternate on the same device.</li><li><strong>Online banks:</strong> create, join, resume or watch a bank.</li></ul></section>
      <section><h3>Players, banks and invitations</h3><p>The left column shows live player status: free, against the computer, local play, waiting in a bank, playing or watching. A public computer match includes a <strong>Watch</strong> button.</p><p>Inside an online bank, WhatsApp buttons create a direct link to play or watch. Each player always sees their own side at the bottom.</p></section>
      <section><h3>Bank chat</h3><p>Chat is available to both players and spectators. Messages are sent in real time, limited to 280 characters and are not archived.</p></section>
      <section><h3>Cape Verde Uril rules</h3><ol><li><strong>Board.</strong> 12 pits, six per player, with four seeds in each pit.</li><li><strong>Direction.</strong> Sowing is counter-clockwise.</li><li><strong>Sowing.</strong> Take all seeds from one of your pits and sow one per pit; skip the starting pit after a full lap.</li><li><strong>One seed.</strong> Any of your pits with one or more seeds is playable.</li><li><strong>Capture.</strong> If the last seed leaves 2 or 3 seeds in an opposing pit, capture it and consecutive qualifying pits backwards.</li><li><strong>Feeding.</strong> If the opponent is empty, a feeding move is mandatory whenever one exists.</li><li><strong>All six pits.</strong> Capturing all six opposing pits is allowed.</li><li><strong>Normal end.</strong> The game does not end at 25; it continues until there is no valid move.</li><li><strong>Triple repetition.</strong> On the third repetition, each player keeps the seeds on their own side.</li><li><strong>Capote.</strong> A player finishing with fewer than 12 seeds suffers Capote, worth two games.</li><li><strong>Resignation.</strong> The player confirms before resigning. With 12 or more captured seeds, the loss counts as one game; below 12, it counts as two. The computer may also ask to resign when victory is mathematically impossible; the player accepts or refuses.</li><li><strong>Quatro.</strong> Four consecutive wins score a Quatro.</li><li><strong>Cut after Quatro.</strong> Two consecutive wins cut the count; a Capote cuts immediately.</li><li><strong>Next game.</strong> The winner starts; after a draw, the same starter begins again.</li></ol></section>
      <section><h3>Public suggestions</h3><p>The suggestions area is part of the page. Each post shows the nickname, island, date and time. Every visitor can read and reply. Suggestions and replies are stored in Supabase and update in real time.</p></section>
      <section><h3>Sync problems</h3><p>Check that both players entered the same bank. After a GitHub update, use <strong>Ctrl + F5</strong> in both browsers.</p></section>
      <p class="rules-note">This version zero will continue to be refined with experienced Uril players.</p>`,
    north: 'North', south: 'South', capeVerde: 'Cape Verde',
    matchDrawKeep: 'Draw: the count remains unchanged.', currentLead: '{player} leads the current count {wins}–0.', quatroRecorded: '{player} scored a Quatro. The Quatro remains recorded.', firstCutWin: '{player} earned the first cut win. One more consecutive win is needed.', capotePrefix: 'CAPOTE: {player} adds two games.',
    profileTooShort: 'Enter a nickname with at least two characters first.', statusPc: 'Playing against the computer{bank}', statusLocal: 'Playing locally', statusWaiting: 'In an Uril bank, waiting{bank}', statusPlaying: 'In an Uril bank, playing{bank}', statusWatching: 'In an Uril bank, watching{bank}', statusFree: 'Free',
    connectSupabasePlayers: 'Connect Supabase to see players.', playersConnectedOne: '1 player connected', playersConnectedMany: '{count} players connected', noPlayersConnected: 'No players connected yet.', guest: 'Guest', you: 'YOU', inGame: 'In game', invite: 'Invite', occupied: 'Busy', invitedToBank: '{nick} invited you to the Uril bank “{bank}”.',
    chatReady: 'Write in the bank…', chatConnecting: 'Connecting to chat…', bankNotFree: 'That Uril bank is no longer free.', onlineNotReady: 'Online mode is not connected yet.', playerAlreadyBusy: '{nick} is already in an Uril bank.', defaultBankName: '{nick}’s bank', pcBankName: '{nick} vs PC', pcBankPublished: 'The bank against the computer is public and can now be watched.', pcBankPrivate: 'The match started privately because the online service is not connected yet.', pcBankPublishError: 'The match started, but the bank was not published: {error}', invitationSent: 'Invitation sent to {nick}.',
    connectSupabaseBanks: 'Connect Supabase to open online Uril banks.', noBanks: 'There are no Uril banks yet. Create the first one.', waitingUpper: 'WAITING', playingUpper: 'IN PLAY', pcBankUpper: 'PC · LIVE', resume: 'Resume', play: 'Play', watchPlay: 'Watch', awaitingGuest: 'Waiting…', bankOnline: 'Online bank', versusPcMode: 'AGAINST PC · {level}', versusPcLiveMode: 'AGAINST PC · {level} · LIVE', watchingMode: 'WATCHING', onlineBankMode: 'ONLINE BANK', twoPlayersMode: 'TWO PLAYERS',
    matchFinished: 'Match ended', turnOf: '{player} to move', bankWaitingOpponent: 'Bank waiting for an opponent', watchingBank: 'Watching · South at the bottom', yourSideBelow: 'Your side is at the bottom · {player}', computerLevel: 'Computer at {level} level', computerPublicBank: 'Public bank against the computer · {level} level', localBank: 'Local bank on the same device',
    collectedBy: 'Captured by {player}', cut: 'Cut: {player} {wins}/2', protectedFour: 'Quatro protected by {player}', roundDraw: 'The match ended in a draw.', roundCapote: '{player} won by CAPOTE.', roundWin: '{player} won the match.', nextDraw: 'The board will be reset. {player} starts the next match.', nextCapote: 'Capote is worth two games. The board will be reset and {player} starts.', nextWin: 'The board will be reset. {player} starts the next match.',
    liftingTitle: '{player} picked up the seeds.', liftingText: 'The starting pit is emptied before sowing.', sowingTitle: '{player} is sowing.', sowingText: 'Seed {step} of {total}.', captureTitle: '{player} is capturing.', captureText: '{count} seeds captured from this pit.', moveDone: 'Move completed.', passingTurn: 'The turn is passing.', bankCreated: 'Bank created.', waitingInvitation: 'Waiting for another player to accept or join.',
    draw: 'Draw.', wonCapote: '{player} won by Capote.', wonMatch: '{player} won the match.', previousWin: '{player} won the previous match.', boardResetStarter: 'Board reset. {player} starts.', watchingTitle: 'You are watching.', playerTurn: '{player} has the turn.', waitOpponent: 'Wait for the opponent’s move.', computerThinking: 'The computer is thinking.', evaluatingMoves: 'Evaluating available pits.', choosePit: '{player}, choose a pit.', legalHighlighted: 'Valid pits are highlighted.', sowingLast: '{player} sows the seeds one by one.', capturingLast: '{player} captures the valid pits.',
    moveDescription: '{player} played {pit}{capture}.{repetition}', captureDescription: ' and captured {count} seeds{grandSlam}', sixPits: ' from all six pits', repetitionDescription: ' The position repeated for the third time and the match ended.', localGuestPrompt: 'North player nickname:',
    whatsappPlayMessage: 'Want to play Uril with me in the bank “{bank}”? This is Cape Verde Uril, the Cape Verdean variant of Ayo/Awalé. Join here: {url}',
    whatsappWatchMessage: 'Come watch this Uril bank: “{bank}”. This is Cape Verde Uril, the Cape Verdean variant of Ayo/Awalé. Open here: {url}',
    sharePlayUnavailable: 'This bank already has two players. Send a watch invitation instead.', shareOnlyOnline: 'WhatsApp invitations are available inside an online bank or a public bank against the computer.', sharedPlayTitle: 'Invitation to play in “{bank}”.', sharedWatchTitle: 'Invitation to watch “{bank}”.', sharedInviteHelp: 'Choose your nickname and island, then open the invitation.', sharedBankMissing: 'The bank in this invitation is no longer available.', sharedBankStartedWatch: 'The bank has already started. You will join as a spectator.', pitSeeds: '{pit}: {count} seeds', acceptInviteError: 'Could not accept the invitation: {error}', sendInviteError: 'Could not send the invitation: {error}', resetError: 'Could not reset the board: {error}', refreshBanksError: 'Could not refresh the Uril banks: {error}', supabaseRequired: 'Online Uril banks require the Supabase configuration included in the package.', createBankError: 'Error creating the Uril bank: {error}', enterBankError: 'Could not enter the Uril bank: {error}', syncBankError: 'Error synchronising the Uril bank: {error}', moveRejected: 'The move was not accepted.', aiTimeout: 'Move analysis exceeded the expected time.', aiFailed: 'The artificial intelligence failed.', aiStartFailed: 'Could not start the artificial intelligence.', computerError: 'Computer error: {error}', chatError: 'Chat: {error}', languageName: 'English',
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
