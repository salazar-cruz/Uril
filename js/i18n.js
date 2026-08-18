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
    endgameTraining: 'FIM DE JOGO', drillsTitle: 'Drills · Corri Oro', drillsIntro: 'Finais públicos para treinar a corrida ao ouro. Não exigem conta.',
    drillLevelBeginner: 'Iniciante', drillLevelBeginnerIntro: 'Padrões fundamentais e decisões curtas.', drillLevelMedium: 'Médio', drillLevelMediumIntro: 'Sequências de vários tempos, alimentação e reserva.', drillLevelAdvanced: 'Avançado', drillLevelAdvancedIntro: 'Posições longas com paridade e várias falsas escolhas.', drillCaseLabel: 'Caso', drillStrategicPosition: 'Situação estratégica',
    drillTargetShort: '25–23 perfeito', drill01Title: 'Ouro I · A escolha decisiva', drill02Title: 'Ouro II · Três saídas', drill03Title: 'Ouro III · Não colher cedo', drill04Title: 'Ouro IV · Guardar a casa', drill05Title: 'Ouro V · Alimentação exacta', drill06Title: 'Ouro VI · Corrida curta', drill07Title: 'Ouro VII · Duas escolhas', drill08Title: 'Ouro VIII · Ouro à vista',
    drillCase32Title: 'Caso 3–2 · Fechar sem hesitar', drillCase43Title: 'Caso 4–3 · Contar o último tempo', drillCase53Title: 'Caso 5–3 · Escolher a casa certa', drillCase54Title: 'Caso 5–4 · Conservar a iniciativa', drillCase63Title: 'Caso 6–3 · Recuperar o ouro', drillCase64Title: 'Caso 6–4 · Reserva e sequência',
    drillAdvanced63Title: 'Avançado 6–3 · Captura dupla e reserva', drillAdvanced64Title: 'Avançado 6–4 · Aceitar a resposta forte', drillAdvanced65Title: 'Avançado 6–5 · Troca de colheitas', drillAdvanced54Title: 'Avançado 5–4 · Corrida sem pressa', drillAdvanced53Title: 'Avançado 5–3 · Construir três colheitas', drillAdvanced43Title: 'Avançado 4–3 · Alimentar sem ceder', drillAdvanced55Title: 'Avançado 5–5 · Simetria enganadora', drillAdvanced44Title: 'Avançado 4–4 · Paridade escondida', drillAdvanced74Title: 'Avançado 7–4 · Recuperar a iniciativa', drillAdvanced75Title: 'Avançado 7–5 · Uma semente para ganhar',
    drill01Challenge: 'Há várias jogadas aparentemente aceitáveis, mas só uma conserva o tempo certo para chegar primeiro às últimas sementes. Um principiante tende a jogar a casa mais cheia e perde a corrida.', drill02Challenge: 'Três casas conseguem avançar, mas a ordem altera quem fica obrigado a alimentar. O exercício ensina a contar não apenas sementes, mas também os tempos de cada lado.', drill03Challenge: 'A colheita imediata parece vantajosa, porém retira a reserva necessária para o final. O desafio é adiar o ganho pequeno para garantir a 25.ª semente.', drill04Challenge: 'Uma casa deve ficar guardada como reserva. Gastá-la cedo entrega o último tempo ao adversário; conservá-la permite controlar a alimentação final.', drill05Challenge: 'É necessário alimentar exactamente sem oferecer uma colheita. O principiante costuma dar sementes a mais e cria uma resposta vencedora para a defesa.', drill06Challenge: 'Restam poucas sementes e cada movimento conta. O desafio é calcular quem joga por último e escolher a casa que mantém a vantagem de um único tempo.', drill07Challenge: 'Duas escolhas parecem equivalentes. Uma conserva a sequência perfeita; a outra muda a paridade e deixa o adversário chegar primeiro ao ouro.', drill08Challenge: 'O ouro está próximo, mas a jogada mais gananciosa falha. É necessário preparar a última colheita e fechar exactamente em 25–23.',
    drillCase32Challenge: 'O caso 3–2 é a forma mais curta da corrida. Sul tem três sementes no seu campo e Norte duas. Há duas saídas, mas só a casa correcta transforma imediatamente a posição em 1–1 e garante o 25–23; jogar a semente isolada prolonga a corrida e entrega a vantagem.',
    drillCase43Challenge: 'No caso 4–3, o erro habitual é gastar primeiro uma das casas centrais. A solução consiste em conservar a ordem dos tempos: abrir pela casa de reserva, obrigar Norte a responder e conduzir a sequência até ao 1–1.',
    drillCase53Challenge: 'No caso 5–3, três casas parecem jogáveis. A escolha não depende da casa mais cheia, mas da paridade: a jogada exacta mantém Sul um tempo à frente e impede Norte de inverter a alimentação final.',
    drillCase54Challenge: 'O caso 5–4 está quase equilibrado. Uma alimentação precipitada entrega a iniciativa a Norte. O jogador deve conservar uma semente de reserva e só depois fechar a sequência, sem oferecer uma colheita intermédia.',
    drillCase63Challenge: 'Sul tem mais sementes no campo, mas começa muito atrás na contagem. O desafio é converter a vantagem de 6–3 numa sequência exacta, colher no momento certo e impedir que Norte use a sua casa de duas sementes para mudar o último tempo.',
    drillCase64Challenge: 'O caso 6–4 exige uma contagem mais longa. É necessário escolher a casa que preserva a reserva, acompanhar as respostas obrigatórias de Norte e manter a mesma paridade durante catorze movimentos até ao final 1–1.',
    drillAdvanced63Challenge: 'Sul dispõe de 6 sementes contra 3, mas a vantagem só vale se as duas primeiras colheitas forem feitas na ordem certa. Depois começa uma longa gestão de reserva e alimentação até à colheita final.',
    drillAdvanced64Challenge: 'A defesa consegue colher logo no início. O exercício obriga a aceitar essa perda temporária, manter a paridade e recuperar no momento exacto, sem alterar a ordem das casas de reserva.',
    drillAdvanced65Challenge: 'Os dois lados colhem cedo e a posição muda imediatamente de carácter. A dificuldade está em não confundir vantagem material com vantagem de tempo: a sequência longa decide quem chega ao 1–1.',
    drillAdvanced54Challenge: 'Quase toda a corrida decorre sem colheitas. É um exercício puro de contagem de tempos: uma casa jogada fora de ordem muda a paridade e entrega ao adversário a grande colheita do final.',
    drillAdvanced53Challenge: 'Sul começa muito atrás na contagem e precisa de construir três colheitas separadas. A primeira não resolve o final; o valor está em conservar a estrutura que torna possíveis as duas seguintes.',
    drillAdvanced43Challenge: 'Com apenas 4 contra 3, Norte será obrigado a alimentar mais de uma vez. O objectivo é reconhecer essas alimentações sem precipitar a captura e conservar o último tempo para fechar 25–23.',
    drillAdvanced55Challenge: 'Os campos começam equilibrados em 5–5, mas a distribuição não é simétrica. As três colheitas finais surgem em sequência e uma única troca de ordem transforma a vantagem de Sul numa chegada tardia.',
    drillAdvanced44Challenge: 'O total 4–4 parece neutro. Não é. Norte prepara uma colheita de quatro sementes perto do fim e Sul só vence se conservar a resposta que recupera o último tempo.',
    drillAdvanced74Challenge: 'Há mais sementes em Sul, mas a defesa consegue responder com colheitas próprias. O treino exige alternar ganho material e controlo de tempo até impedir que Norte estabilize a corrida.',
    drillAdvanced75Challenge: 'Sul já tem 24 sementes colhidas, mas Norte ainda dispõe de margem para duas grandes colheitas. O desafio é resistir à tentação de procurar ganho imediato e garantir a única semente que falta no momento certo.',
    drillObjective25: 'Objectivo: correr o ouro e fechar a posição em 25–23 contra a defesa de referência.', drillChallengeLabel: 'O desafio desta posição', restartDrill: 'Recomeçar', showDrillHint: 'Mostrar pista', showDrillSolution: 'Ver solução perfeita', stopDrillSolution: 'Parar solução', nextDrill: 'Drill seguinte', drillPlayer: 'Jogador', drillOpponent: 'Defesa de referência', drillStarted: 'Drill de fim de jogo iniciado.', drillMode: 'DRILL · CORRI ORO', drillPublicStatus: 'Drill público de fim de jogo · sem conta', drillHintPit: 'Pista: joga {pit}.', drillPerfectLine: 'Linha perfeita mantida · decisões: {moves}', drillLineBroken: 'Saíste da linha de referência · continua contra a IA · decisões: {moves}', drillSolutionProgress: 'Solução perfeita em movimento · jogada {current} de {total}.', drillSolutionComplete: 'Solução concluída: os dois lados jogaram a linha perfeita; no final 1–1, cada jogador recebeu a sua semente, fechando em 25–23.', drillSolutionStarted: 'A reproduzir a solução perfeita dos dois lados.', drillSolutionStopped: 'Reprodução da solução interrompida.', drillSolutionIllegal: 'A jogada {move} da solução deixou de ser válida.', drillSolutionError: 'Erro ao reproduzir a solução: {error}', drillSolutionPlayingTitle: 'Solução perfeita em reprodução.', drillSolutionPlayingText: 'Observa os dois lados a correr o ouro · jogada {current} de {total}.', drillSuccessTitle: 'O ouro foi corrido.', drillRetryTitle: 'A linha perfeita perdeu-se.', drillSuccessText: 'Resultado 25–23. Drill concluído.', drillRetryText: 'Revê a posição, usa a pista e tenta novamente.', drillOpponentThinking: 'A defesa está a calcular.', drillPerfectDefence: 'O adversário segue a melhor defesa conhecida desta posição.', drillChooseMove: 'Escolhe a continuação exacta.', statusDrill: 'A treinar Corri Oro',
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
    versusComputerDesc: 'Treino individual com quatro níveis de dificuldade, observável em directo. Estas partidas não alteram o Elo oficial.',
    level: 'Nível',
    levelApprentice: 'Aprendiz',
    levelAmateur: 'Amador',
    levelMaster: 'Mestre',
    levelGrandmaster: 'Grande Mestre',
    firstMove: 'Primeira jogada',
    humanStarts: 'Eu jogo primeiro',
    computerStarts: 'Computador joga primeiro',
    pcOpeningTitle: 'Escolhe a saída do computador',
    pcOpeningChoose: 'Toca numa casa de Norte para indicar a primeira jogada do PC. Se não escolheres, ele arranca sozinho em {seconds}s.',
    pcOpeningChosen: 'Saída do computador definida: {pit}.',
    pcOpeningAuto: 'Tempo esgotado. O computador escolhe a saída.',
    aiChatMode: 'Chat da IA',
    aiChatProvocative: 'Provocador',
    aiChatOff: 'Desligado',
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
    aiChatTitle: 'CHAT COM A IA',
    aiChatProvocation: 'PROVOCAÇÃO',
    aiChatEmpty: 'O computador ainda está calado. Aproveita enquanto dura.',
    aiChatReady: 'Responder ao computador…',
    aiChatNote: 'A IA lê a posição, as colheitas e o texto para responder com troça. O modo provocador é opcional e não usa serviços externos.',
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
    keepPlaying: 'Continuar a jogar', confirmResign: 'Confirmar desistência', reasonResignation: 'Desistência de {player}.', reasonFrouxo: 'Frouxo: quem deu fogo perde a partida porque ainda conseguia alimentar o adversário na jogada seguinte.', reasonOneEach: 'Restava uma semente em cada campo. A partida termina e cada jogador recebe a sua semente.', resignationWin: '{loser} desistiu. {winner} venceu.', resignationResultOne: 'A desistência vale uma partida.', resignationResultTwo: 'A desistência vale duas partidas porque {player} ainda não tinha 12 sementes.',
    roundResignation: '{loser} desistiu. {winner} venceu a partida.', nextResignationOne: 'A desistência vale uma partida. O tabuleiro será arrumado e {player} começa.', nextResignationTwo: 'A desistência vale duas partidas. O tabuleiro será arrumado e {player} começa.', resignError: 'Não foi possível registar a desistência.',
    aiResignEyebrow: 'PEDIDO DO COMPUTADOR', aiResignTitle: 'O computador quer desistir', aiResignWarningOne: '{player} concluiu que já não consegue ganhar e pede desistência por uma partida. Aceitas?', aiResignWarningTwo: '{player} concluiu que já não consegue ganhar e pede desistência por duas partidas, porque ainda tem apenas {seeds} sementes. Aceitas?', rejectAIResign: 'Não aceitar', acceptAIResign: 'Aceitar desistência',
    footerCopyright: '© 2026 DevNexus Digital', footerConcept: 'Conceito, desenvolvimento e direcção', versionLabel: 'Versão 1.0.16', suggestions: 'Sugestões', suggestionsCommunity: 'COMUNIDADE', suggestionsTitle: 'Sugestões e respostas', suggestionsIntro: 'As sugestões ficam públicas, identificadas pelo nick e pela data. Todos conseguem ler; só jogadores inscritos publicam e respondem.', publishAs: 'Publicar como', suggestionPlaceholder: 'A tua sugestão…', suggestionsPublicNote: 'A sugestão ficará visível para todos os visitantes.', publishSuggestion: 'Publicar sugestão', suggestionsPublished: 'sugestões publicadas', suggestionsEmpty: 'Ainda não há sugestões. Abre a conversa.', suggestionsNeedSupabase: 'Liga o Supabase para publicar e consultar sugestões.', suggestionsLoading: 'A carregar sugestões…', suggestionsMigrationNeeded: 'Executa o ficheiro supabase-v1.0.0.sql no SQL Editor do Supabase.', suggestionsLoadError: 'Não foi possível carregar as sugestões: {error}', suggestionEmpty: 'Escreve primeiro uma sugestão com pelo menos quatro caracteres.', suggestionPublished: 'A sugestão foi publicada.', suggestionPublishError: 'Não foi possível publicar a sugestão: {error}', reply: 'Responder', replyCount: '{count} respostas', replyPlaceholder: 'Escreve uma resposta…', replyAria: 'Responder à sugestão de {nick}', cancelReply: 'Cancelar', publishReply: 'Publicar resposta', replyEmpty: 'Escreve primeiro uma resposta.', replyPublished: 'A resposta foi publicada.', replyPublishError: 'Não foi possível publicar a resposta: {error}',
    signIn: 'Entrar', registerPlayer: 'Registar jogador', signOut: 'Sair',
    heroIntroV1: 'Joga contra a inteligência artificial sem registo ou convida outro visitante anónimo para uma partida privada. Para disputar partidas oficiais e entrar no ranking Elo, regista uma conta de jogador.',
    playerIdentity: 'IDENTIDADE DO JOGADOR', anonymousVisitor: 'Visitante anónimo', anonymousRights: 'Treino contra a IA, convites privados entre anónimos e consulta de partidas.',
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
    helpVersion: 'AJUDA 1.0.16',
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
          <li><strong>Contra o computador:</strong> níveis Aprendiz, Amador, Mestre e Grande Mestre. É treino individual, nunca altera o Elo e fica disponível para observação em directo através da lista de jogadores online.</li>
          <li><strong>Dois jogadores:</strong> Sul e Norte alternam no mesmo dispositivo. As casas da fila superior pertencem a Norte.</li>
          <li><strong>Bancos de Uril online:</strong> jogadores inscritos criam e disputam partidas oficiais; qualquer visitante consegue assistir aos jogos Live e consultar partidas concluídas.</li>
        </ul>
      </section>
      <section>
        <h3>Drills de fim de jogo · Corri Oro</h3>
        <p>Eu criei estes exercícios públicos para treinar a fase conhecida em Cabo Verde como <strong>correr o ouro</strong> ou <strong>Corri Oro</strong>. Não exigem conta e aparecem na coluna esquerda do ecrã.</p><p>Os Drills estão organizados em <strong>Iniciante</strong>, <strong>Médio</strong> e <strong>Avançado</strong>. Os casos 3–2, 4–3, 5–3, 5–4, 6–3 e 6–4 indicam o total de sementes ainda existentes no campo de Sul e no campo de Norte, e não a pontuação da partida.</p>
        <p>Cada Drill começa numa posição realista de final de partida. O objectivo é encontrar a sequência exacta contra a melhor defesa conhecida e terminar em <strong>25–23</strong>. O botão <strong>Mostrar pista</strong> indica a próxima casa da linha de referência; <strong>Recomeçar</strong> repõe a posição inicial e <strong>Drill seguinte</strong> abre outro caso.</p>
        <p>Para jogadores inexperientes, cada exercício explica o desafio da posição: tempo, alimentação, reserva, paridade ou momento exacto da colheita. O botão <strong>Ver solução perfeita</strong> repõe a posição e movimenta automaticamente as sementes dos dois lados até ao resultado 25–23, mostrando como ataque e defesa devem jogar.</p>
        <p>Enquanto segues a linha correcta, a defesa responde com a continuação preparada para esse final. Se te desviares, o exercício continua contra a IA no nível Grande Mestre, permitindo analisar a consequência da escolha sem interromper o treino.</p>
      </section>
      <section>
        <h3>Jogadores, bancos e convites</h3>
        <p>A coluna da esquerda actualiza-se em tempo real quando alguém entra, sai ou muda de modo. Mostra visitantes anónimos e jogadores inscritos, bem como os estados: livre, em treino contra o computador, no modo local, num banco à espera, num banco oficial ou a assistir. Quando alguém joga contra o computador, o botão <strong>Ver jogar</strong> abre o tabuleiro em directo, sem permitir qualquer interferência do espectador.</p>
        <p>Um jogador inscrito, calibrado e livre recebe um convite directo pelo próprio jogo. Dentro de um banco oficial, os botões de WhatsApp geram um link directo para jogar ou assistir. O convite para jogar exige entrada numa conta; o convite para assistir também funciona para visitantes anónimos.</p>
        <p>Nos bancos online, cada jogador vê sempre o seu próprio campo na parte inferior. Os espectadores vêem Sul na parte inferior. As jogadas são sincronizadas e animadas semente a semente nos dois navegadores.</p>
      </section>
      <section>
        <h3>Chat do banco e chat com a IA</h3>
        <p>O chat aparece dentro de um banco online e está disponível aos dois jogadores e aos espectadores. As mensagens circulam em tempo real, têm um máximo de 280 caracteres e não ficam guardadas na base de dados.</p>
        <p>Contra o computador, o modo <strong>Provocador</strong> cria respostas locais com base no marcador, nas colheitas, no Frouxo, no fim da partida e no texto escrito pelo jogador. A personagem usa troça e insultos ligeiros de jogo, como “nabo” ou “idiota”, mas exclui ameaças e ataques discriminatórios. Esta opção é desligada antes de iniciar a partida.</p>
      </section>


      <section>
        <h3>Contas, jogadores anónimos e partidas oficiais</h3>
        <p>Um visitante sem conta entra com uma identidade temporária, como <strong>Anónimo A7C2</strong>. Além de jogar contra o computador e assistir a partidas, consegue convidar directamente outro visitante anónimo livre. O convite abre um alerta para aceitar ou recusar e, quando aceite, cria um banco privado não classificado com tabuleiro sincronizado e chat em tempo real.</p>
        <p>Para criar um banco oficial, aceitar um convite oficial ou entrar no ranking Elo, exijo uma conta com nome, nick, país e email. A ilha é pedida apenas a quem indicar Cabo Verde como país. O email e o nome completo ficam na área privada da conta; o ranking público mostra o nick, o país, a ilha quando existe, o Elo e o histórico competitivo.</p>
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
          <div role="listitem"><strong>Grande Mestre</strong><span>Profundidade 18 · 4,8 s</span><small>Pesquisa mais profunda do que o Mestre, com tempo máximo reduzido para uma resposta mais rápida.</small></div>
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
    statusPcLevel: 'A jogar contra o computador · {level}',
    statusWatchingPc: 'A ver {nick} jogar contra o computador',
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
    pcWatchTitle: '{nick} contra o computador',
    watchingPcGame: 'A assistir ao treino de {nick} · Sul em baixo',
    pcWatchPresence: 'Treino de {nick} contra o PC',
    pcWatchStarted: 'Estás a assistir ao treino de {nick}.',
    pcWatchUnavailable: 'Este treino contra o computador já não está disponível.',
    pcWatchEnded: 'O treino contra o computador terminou ou o jogador saiu.',
    pcWatchSyncError: 'Erro ao acompanhar o treino: {error}',
    invitedToBank: '{nick} convidou-te para o banco de Uril “{bank}”.',
    invitedToGuestBank: '{nick} quer jogar contigo num banco privado de Uril. Aceitas?',
    invitationAcceptedBy: '{nick} aceitou o convite e entrou no banco.',
    invitationDeclinedBy: '{nick} recusou o convite.',
    officialInviteNeedsAccount: 'Este convite é para uma partida oficial e exige uma conta de jogador.',
    guestInviteAnonymousOnly: 'Os bancos privados de convidados destinam-se apenas a jogadores anónimos.',
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
    computerLevel: 'Computador no nível {level}', computerPublicBank: 'Treino contra o computador · nível {level}',
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
    metaDescription: 'Uril du Cap-Vert — variante cap-verdienne de la famille Ayo/Awalé, avec jeu local, ordinateur et tables en ligne.',
    brandHomeAria: 'Retour à l’accueil', onlinePlayers: 'joueurs en ligne', helpAndRules: 'Aide et règles', live: 'EN DIRECT',
    onlineRosterTitle: 'Joueurs en ligne', connectingPlayers: 'Connexion à la liste des joueurs…', rosterHelp: 'Les joueurs inscrits et calibrés reçoivent des invitations directes vers les tables officielles.',
    endgameTraining: 'FIN DE PARTIE', drillsTitle: 'Exercices · Corri Oro', drillsIntro: 'Finales publiques pour apprendre la course à l’or. Aucun compte requis.',
    drillLevelBeginner: 'Débutant', drillLevelBeginnerIntro: 'Schémas fondamentaux et décisions courtes.', drillLevelMedium: 'Intermédiaire', drillLevelMediumIntro: 'Suites de plusieurs tempos, nourrissage et réserve.', drillLevelAdvanced: 'Avancé', drillLevelAdvancedIntro: 'Positions longues, parité et faux choix.', drillCaseLabel: 'Cas', drillStrategicPosition: 'Position stratégique',
    drillTargetShort: '25–23 parfait', drill01Title: 'Or I · Le choix décisif', drill02Title: 'Or II · Trois sorties', drill03Title: 'Or III · Ne pas récolter trop tôt', drill04Title: 'Or IV · Garder la case', drill05Title: 'Or V · Nourrir exactement', drill06Title: 'Or VI · Course courte', drill07Title: 'Or VII · Deux choix', drill08Title: 'Or VIII · L’or en vue',
    drillCase32Title: 'Cas 3–2 · Finir sans hésiter', drillCase43Title: 'Cas 4–3 · Compter le dernier tempo', drillCase53Title: 'Cas 5–3 · Choisir la bonne case', drillCase54Title: 'Cas 5–4 · Garder l’initiative', drillCase63Title: 'Cas 6–3 · Reprendre la course à l’or', drillCase64Title: 'Cas 6–4 · Réserve et séquence',
    drillAdvanced63Title: 'Avancé 6–3 · Double capture et réserve', drillAdvanced64Title: 'Avancé 6–4 · Accepter la forte réponse', drillAdvanced65Title: 'Avancé 6–5 · Échange de captures', drillAdvanced54Title: 'Avancé 5–4 · Course sans précipitation', drillAdvanced53Title: 'Avancé 5–3 · Construire trois captures', drillAdvanced43Title: 'Avancé 4–3 · Nourrir sans céder', drillAdvanced55Title: 'Avancé 5–5 · Symétrie trompeuse', drillAdvanced44Title: 'Avancé 4–4 · Parité cachée', drillAdvanced74Title: 'Avancé 7–4 · Reprendre l’initiative', drillAdvanced75Title: 'Avancé 7–5 · Une graine pour gagner',
    drill01Challenge: 'Plusieurs coups semblent acceptables, mais un seul conserve le bon tempo pour atteindre les dernières graines en premier. Un débutant choisit souvent la case la plus pleine et perd la course.', drill02Challenge: 'Trois cases peuvent avancer, mais leur ordre détermine qui devra nourrir. Cet exercice apprend à compter les graines et les tempos de chaque côté.', drill03Challenge: 'La récolte immédiate paraît avantageuse, mais elle supprime la réserve nécessaire à la finale. Il faut retarder le petit gain pour assurer la 25e graine.', drill04Challenge: 'Une case doit rester en réserve. La jouer trop tôt donne le dernier tempo à l’adversaire; la conserver permet de contrôler le nourrissage final.', drill05Challenge: 'Il faut nourrir exactement sans offrir une récolte. Le débutant donne souvent trop de graines et crée une réponse gagnante pour la défense.', drill06Challenge: 'Il reste peu de graines et chaque coup compte. Le défi consiste à calculer qui jouera en dernier et à garder un tempo d’avance.', drill07Challenge: 'Deux choix semblent équivalents. L’un conserve la séquence parfaite; l’autre change la parité et laisse l’adversaire atteindre l’or en premier.', drill08Challenge: 'L’or est proche, mais le coup le plus gourmand échoue. Il faut préparer la dernière récolte et terminer exactement à 25–23.',
    drillCase32Challenge: 'Le cas 3–2 est la forme la plus courte de la course. Sud possède trois graines et Nord deux. Deux sorties existent, mais seule la bonne case transforme immédiatement la position en 1–1 et assure le 25–23.',
    drillCase43Challenge: 'Dans le cas 4–3, l’erreur habituelle consiste à dépenser trop tôt une case centrale. Il faut conserver l’ordre des tempos, ouvrir avec la réserve et conduire les réponses forcées jusqu’au 1–1.',
    drillCase53Challenge: 'Dans le cas 5–3, trois cases semblent jouables. Le choix dépend de la parité et non de la case la plus pleine : le coup exact maintient Sud avec un tempo d’avance.',
    drillCase54Challenge: 'Le cas 5–4 est presque équilibré. Nourrir trop tôt donne l’initiative à Nord. Il faut conserver une graine de réserve et fermer ensuite la séquence sans offrir de récolte intermédiaire.',
    drillCase63Challenge: 'Sud a davantage de graines sur le plateau mais commence loin derrière au score. Il faut transformer le 6–3 en une suite exacte et empêcher Nord de renverser le dernier tempo.',
    drillCase64Challenge: 'Le cas 6–4 exige un comptage plus long. Il faut préserver la réserve, suivre les réponses obligatoires et maintenir la parité pendant quatorze coups jusqu’au 1–1.',
    drillAdvanced63Challenge: 'Sud a 6 graines contre 3, mais l’avantage ne compte que si les deux premières captures sont jouées dans le bon ordre. Ensuite vient une longue gestion de réserve et d’alimentation.',
    drillAdvanced64Challenge: 'La défense capture dès le début. Il faut accepter cette perte temporaire, conserver la parité et récupérer au moment exact sans casser l’ordre des réserves.',
    drillAdvanced65Challenge: 'Les deux camps capturent tôt et la position change immédiatement. La difficulté consiste à distinguer l’avantage matériel de l’avantage de tempo jusqu’au final 1–1.',
    drillAdvanced54Challenge: 'Presque toute la course se déroule sans capture. C’est un exercice de tempo pur : une case jouée dans le mauvais ordre change la parité et offre la grande capture finale.',
    drillAdvanced53Challenge: 'Sud commence très loin derrière et doit construire trois captures séparées. La première ne suffit pas ; il faut préserver la structure qui rend les deux suivantes possibles.',
    drillAdvanced43Challenge: 'Avec seulement 4 contre 3, Nord devra nourrir plus d’une fois. Il faut reconnaître ces alimentations sans capturer trop tôt et garder le dernier tempo.',
    drillAdvanced55Challenge: 'Les camps commencent à 5–5, mais la distribution n’est pas symétrique. Trois captures arrivent à la fin et un seul changement d’ordre renverse la course.',
    drillAdvanced44Challenge: 'Le total 4–4 paraît neutre. Nord prépare pourtant une capture de quatre graines ; Sud ne gagne qu’en conservant la réponse qui récupère le dernier tempo.',
    drillAdvanced74Challenge: 'Sud possède davantage de graines, mais la défense dispose de ses propres captures. Il faut alterner gain matériel et contrôle du tempo pour empêcher Nord de stabiliser la course.',
    drillAdvanced75Challenge: 'Sud a déjà 24 graines capturées, tandis que Nord garde la possibilité de deux grandes captures. Le défi consiste à garantir la dernière graine au bon moment.',
    drillObjective25: 'Objectif : courir vers l’or et terminer à 25–23 contre la défense de référence.', drillChallengeLabel: 'Le défi de cette position', restartDrill: 'Recommencer', showDrillHint: 'Afficher l’indice', showDrillSolution: 'Voir la solution parfaite', stopDrillSolution: 'Arrêter la solution', nextDrill: 'Exercice suivant', drillPlayer: 'Joueur', drillOpponent: 'Défense de référence', drillStarted: 'Exercice de fin de partie lancé.', drillMode: 'EXERCICE · CORRI ORO', drillPublicStatus: 'Exercice public de fin de partie · sans compte', drillHintPit: 'Indice : joue {pit}.', drillPerfectLine: 'Ligne parfaite conservée · décisions : {moves}', drillLineBroken: 'Tu as quitté la ligne de référence · poursuis contre l’IA · décisions : {moves}', drillSolutionProgress: 'Solution parfaite en mouvement · coup {current} sur {total}.', drillSolutionComplete: 'Solution terminée : les deux côtés ont suivi la ligne parfaite; à la finale 1–1, chaque joueur a reçu sa graine, pour terminer à 25–23.', drillSolutionStarted: 'Lecture de la solution parfaite des deux côtés.', drillSolutionStopped: 'Lecture de la solution interrompue.', drillSolutionIllegal: 'Le coup {move} de la solution n’est plus valide.', drillSolutionError: 'Erreur pendant la solution : {error}', drillSolutionPlayingTitle: 'Solution parfaite en cours.', drillSolutionPlayingText: 'Observe les deux côtés courir vers l’or · coup {current} sur {total}.', drillSuccessTitle: 'La course à l’or est réussie.', drillRetryTitle: 'La ligne parfaite a été perdue.', drillSuccessText: 'Résultat 25–23. Exercice terminé.', drillRetryText: 'Revois la position, utilise l’indice et recommence.', drillOpponentThinking: 'La défense calcule.', drillPerfectDefence: 'L’adversaire suit la meilleure défense connue de cette position.', drillChooseMove: 'Choisis la continuation exacte.', statusDrill: 'En exercice Corri Oro',
    versionZero: 'VERSION 1.0', heroTitle: 'Le jeu traditionnel,<br><em>île par île.</em>', heroIntro: 'Entraîne-toi contre l’intelligence artificielle ou connecte-toi pour disputer des parties officielles et rejoindre le classement Elo.',
    variantLabel: 'AYO · AWALÉ · OWARE', variantIntro: 'L’Uril est la variante pratiquée au Cap-Vert de la grande famille africaine Ayo/Awalé/Oware, adaptée aux règles et à la tradition cap-verdiennes.',
    nickLabel: 'Ton pseudo', nickPlaceholder: 'Ex. : Mindelense77', islandLabel: 'Ton île', backgroundHint: 'Le fond suit l’île choisie.', playNow: 'JOUER',
    versusComputer: 'Contre l’ordinateur', versusComputerDesc: 'Entraînement individuel avec quatre niveaux, visible en direct. Ces parties ne modifient jamais l’Elo officiel.', level: 'Niveau',
    levelApprentice: 'Apprenti', levelAmateur: 'Amateur', levelMaster: 'Maître', levelGrandmaster: 'Grand Maître', firstMove: 'Premier coup', humanStarts: 'Je joue en premier', computerStarts: 'L’ordinateur joue en premier', pcOpeningTitle: 'Choisis le départ de l’ordinateur', pcOpeningChoose: 'Touche une case de Nord pour imposer le premier coup du PC. Sans choix, il démarre seul dans {seconds}s.', pcOpeningChosen: 'Départ de l’ordinateur fixé : {pit}.', pcOpeningAuto: 'Temps écoulé. L’ordinateur choisit son départ.', aiChatMode: 'Chat de l’IA', aiChatProvocative: 'Provocateur', aiChatOff: 'Désactivé', startMatch: 'Commencer la partie',
    banksOnline: 'Tables d’Uril en ligne', banksOnlineDesc: 'Consulte les parties en direct et terminées. Seuls les joueurs inscrits et calibrés créent ou disputent des tables officielles.', viewBanks: 'Voir les tables',
    sameScreen: 'MÊME ÉCRAN', twoPlayers: 'Deux joueurs', twoPlayersDesc: 'Une partie d’entraînement locale sur le même appareil, disponible après connexion à un compte.', playLocally: 'Jouer en local',
    openBanks: 'TABLES OUVERTES', urilBanks: 'Tables d’Uril', refresh: 'Actualiser', bankNamePlaceholder: 'Nom de la table', createBank: 'Créer une table',
    setupNotice: 'L’archive, les comptes, le classement Elo et les tables officielles ne sont pas encore reliés à Supabase. L’entraînement contre l’IA reste disponible. Consulte <strong>GUIA-GITHUB.md</strong> pour activer la version 1.0.0.',
    whatsappInviteLabel: 'INVITATION WHATSAPP', whatsappInviteDefault: 'Tu as reçu une invitation vers une table d’Uril.', openWhatsappBank: 'Ouvrir l’invitation',
    leaveBank: '← Quitter la table', match: 'PARTIE', bankOfUril: 'Table d’Uril', arrangeNow: 'Ranger maintenant', quatros: 'QUATROS', count: 'COMPTE',
    pickedNorth: 'Récoltées par Nord', turnSouth: 'Tour de Sud', pickedSouth: 'Récoltées par Sud', boardAria: 'Plateau d’Uril', seeds48: '48 graines · Cap-Vert',
    roundEnded: 'PARTIE TERMINÉE', southWon: 'Sud a gagné la partie.', boardWillReset: 'Le plateau va être remis en place.', matchStarted: 'La partie a commencé.', southStarts: 'Sud commence.',
    bankStatus: 'ÉTAT DE LA TABLE', localMatch: 'Partie locale', countStarts: 'Le compte commence à 0–0.', lastMove: 'DERNIER COUP', noMoves: 'Aucun coup pour le moment.',
    bankChat: 'CHAT DE LA TABLE', chatEmpty: 'Aucun message dans cette table.', chatPlaceholder: 'Écrire dans la table…', chatAria: 'Message du chat', send: 'Envoyer',
    chatNote: 'Les messages sont transmis en temps réel et ne sont pas archivés.', aiChatTitle: 'CHAT AVEC L’IA', aiChatProvocation: 'PROVOCATION', aiChatEmpty: 'L’ordinateur se tait encore. Profites-en.', aiChatReady: 'Répondre à l’ordinateur…', aiChatNote: 'L’IA lit la position, les récoltes et le texte pour répondre avec ironie. Le mode provocateur est facultatif et n’utilise aucun service externe.', whatsappShare: 'INVITER PAR WHATSAPP', whatsappShareText: 'Partage cette table avec un joueur ou une personne qui souhaite regarder.',
    inviteToPlayWhatsapp: 'Inviter à jouer', inviteToWatchWhatsapp: 'Inviter à regarder', reminder: 'RAPPEL',
    reminderText: 'Distribution dans le sens antihoraire, sans remettre de graine dans la case de départ après un tour complet. Récolte consécutive des cases contenant 2 ou 3 graines.',
    fullRules: 'Lire toutes les règles', assetCredit: 'Référence historique du visuel classique : Oliver Merkel, licence CC BY-NC-SA 4.0.',
    invitationReceived: 'INVITATION REÇUE', genericInvite: 'Tu as reçu une invitation vers une table d’Uril.', decline: 'Refuser', enterBank: 'Entrer dans la table',
    resignButton: 'Abandonner', resignEyebrow: 'ABANDON', resignDialogTitle: 'Confirmer l’abandon', resignDialogPlayer: '{player} demande l’abandon.', resignWarningOne: '{player}, tu as {seeds} graines récoltées. L’abandon vaut une partie.', resignWarningTwo: '{player}, tu n’as encore que {seeds} graines. Comme tu n’as pas atteint 12, l’abandon vaut deux parties, comme un Capote.', keepPlaying: 'Continuer à jouer', confirmResign: 'Confirmer l’abandon', reasonResignation: 'Abandon de {player}.', reasonFrouxo: 'Frouxo : le joueur qui a donné le feu perd la partie car il pouvait encore nourrir l’adversaire au coup suivant.', reasonOneEach: 'Il restait une graine dans chaque camp. La partie se termine et chaque joueur reçoit sa graine.', resignationWin: '{loser} a abandonné. {winner} gagne.', resignationResultOne: 'L’abandon vaut une partie.', resignationResultTwo: 'L’abandon vaut deux parties car {player} n’avait pas encore 12 graines.', roundResignation: '{loser} a abandonné. {winner} gagne la partie.', nextResignationOne: 'L’abandon vaut une partie. Le plateau sera remis en place et {player} commencera.', nextResignationTwo: 'L’abandon vaut deux parties. Le plateau sera remis en place et {player} commencera.', resignError: 'Impossible d’enregistrer l’abandon.', aiResignEyebrow: 'DEMANDE DE L’ORDINATEUR', aiResignTitle: 'L’ordinateur veut abandonner', aiResignWarningOne: '{player} estime ne plus pouvoir gagner et demande l’abandon pour une partie. Acceptes-tu ?', aiResignWarningTwo: '{player} estime ne plus pouvoir gagner et demande l’abandon pour deux parties, car il n’a encore que {seeds} graines. Acceptes-tu ?', rejectAIResign: 'Refuser', acceptAIResign: 'Accepter l’abandon', footerCopyright: '© 2026 DevNexus Digital', footerConcept: 'Conception, développement et direction', versionLabel: 'Version 1.0.16', suggestions: 'Suggestions', suggestionsCommunity: 'COMMUNAUTÉ', suggestionsTitle: 'Suggestions et réponses', suggestionsIntro: 'Les suggestions sont publiques, avec le pseudo et la date. Tout le monde peut les lire; seuls les joueurs inscrits peuvent publier et répondre.', publishAs: 'Publier comme', suggestionPlaceholder: 'Ta suggestion…', suggestionsPublicNote: 'La suggestion sera visible par tous les visiteurs.', publishSuggestion: 'Publier la suggestion', suggestionsPublished: 'suggestions publiées', suggestionsEmpty: 'Aucune suggestion pour le moment. Lance la discussion.', suggestionsNeedSupabase: 'Connecte Supabase pour publier et consulter les suggestions.', suggestionsLoading: 'Chargement des suggestions…', suggestionsMigrationNeeded: 'Exécute le fichier supabase-v1.0.0.sql dans le SQL Editor de Supabase.', suggestionsLoadError: 'Impossible de charger les suggestions : {error}', suggestionEmpty: 'Écris une suggestion d’au moins quatre caractères.', suggestionPublished: 'La suggestion a été publiée.', suggestionPublishError: 'Impossible de publier la suggestion : {error}', reply: 'Répondre', replyCount: '{count} réponses', replyPlaceholder: 'Écris une réponse…', replyAria: 'Répondre à la suggestion de {nick}', cancelReply: 'Annuler', publishReply: 'Publier la réponse', replyEmpty: 'Écris d’abord une réponse.', replyPublished: 'La réponse a été publiée.', replyPublishError: 'Impossible de publier la réponse : {error}',
    signIn: 'Se connecter', registerPlayer: 'Inscrire un joueur', signOut: 'Se déconnecter',
    heroIntroV1: 'Joue contre l’intelligence artificielle sans inscription. Pour disputer des parties officielles, créer des tables et entrer au classement Elo, crée un compte de joueur.',
    playerIdentity: 'IDENTITÉ DU JOUEUR', anonymousVisitor: 'Visiteur anonyme', anonymousRights: 'Entraînement contre l’IA, invitations privées entre anonymes et consultation des parties.',
    eloRating: 'Elo', registerToCompete: 'S’inscrire pour concourir', initialEloTest: 'Évaluation Elo initiale', startCalibration: 'Lancer le prochain test',
    calibrationProgress: '{current} tests sur 3 terminés', calibrationComplete: 'Elo initial estimé : {elo}', calibrationRecorded: 'Test enregistré. Elo actuel : {elo}.', calibrationRequired: 'Termine les trois tests de calibration contre l’IA avant de participer aux parties officielles.', completeCalibration: 'Terminer la calibration',
    searchGames: 'Rechercher joueur, pays, île ou table', fromDate: 'Depuis', toDate: 'Jusqu’au', resultFilter: 'Résultat', eventFilter: 'Événement', allResults: 'Tous', southWonFilter: 'Victoire du Sud', northWonFilter: 'Victoire du Nord', drawFilter: 'Nulle', allEvents: 'Tous', search: 'Rechercher', createOfficialBank: 'Créer une table officielle',
    loginCreateBank: 'Connecte-toi à un compte de joueur pour créer ou disputer des tables officielles.', moveDetails: 'DÉTAILS DU COUP', analyseMove: 'Analyser le coup',
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
    helpVersion: 'AIDE 1.0.16', helpTitle: 'Aide, tables et règles', close: 'Fermer',
    helpContent: `
      <section><h3>Qu’est-ce que l’Uril ?</h3><p>L’Uril est la variante pratiquée au Cap-Vert de la grande famille de jeux africains connue sous les noms <strong>Ayo</strong>, <strong>Awalé</strong> et <strong>Oware</strong>. Cette version suit les règles et la tradition cap-verdiennes.</p></section>
      <section><h3>Commencer à jouer</h3><p>Sans compte, tu entres avec une identité temporaire et tu peux t’entraîner contre l’IA, utiliser les exercices, consulter les parties ou inviter directement un autre visiteur anonyme. Une invitation acceptée ouvre une table privée non classée avec synchronisation et chat en temps réel. Avec un compte, tu obtiens une identité, un Elo et l’accès aux parties officielles après la calibration.</p><ul><li><strong>Contre l’ordinateur :</strong> Apprenti, Amateur, Maître et Grand Maître. L’entraînement reste privé et ne modifie jamais l’Elo.</li><li><strong>Deux anonymes en ligne :</strong> un joueur libre invite l’autre; le destinataire accepte ou refuse l’alerte.</li><li><strong>Tables officielles :</strong> les joueurs inscrits et calibrés créent et disputent les parties classées; tous les visiteurs peuvent regarder les parties Live et consulter les parties terminées.</li></ul></section>
      <section><h3>Exercices de fin de partie · Corri Oro</h3><p>J’ai créé ces exercices publics pour travailler la phase appelée au Cap-Vert <strong>courir vers l’or</strong> ou <strong>Corri Oro</strong>. Aucun compte n’est requis et le menu se trouve dans la colonne gauche.</p><p>Les exercices sont classés en <strong>Débutant</strong>, <strong>Intermédiaire</strong> et <strong>Avancé</strong>. Les cas 3–2, 4–3, 5–3, 5–4, 6–3 et 6–4 désignent le nombre total de graines encore présentes dans le camp Sud et le camp Nord, et non le score.</p><p>Chaque exercice commence dans une position réaliste de fin de partie. Le but est de trouver la suite exacte contre la meilleure défense connue et de terminer à <strong>25–23</strong>. <strong>Afficher l’indice</strong> révèle la prochaine case de la ligne de référence; <strong>Recommencer</strong> rétablit la position; <strong>Exercice suivant</strong> ouvre un autre cas.</p><p>Pour les joueurs débutants, chaque exercice explique le défi de la position : tempo, nourrissage, réserve, parité ou moment exact de la récolte. Le bouton <strong>Voir la solution parfaite</strong> rétablit la position et déplace automatiquement les graines des deux côtés jusqu’au résultat 25–23.</p><p>Si tu quittes la ligne préparée, l’exercice continue contre l’IA Grand Maître afin d’étudier les conséquences du choix.</p></section>
      <section><h3>Joueurs, tables et invitations</h3><p>La colonne de gauche montre en temps réel les joueurs libres, ceux qui s’entraînent contre l’ordinateur, jouent en local, attendent dans une table, disputent une partie officielle ou regardent.</p><p>Dans une table officielle, les boutons WhatsApp créent un lien direct pour jouer ou regarder. Chaque joueur voit toujours son propre camp en bas.</p></section>
      <section><h3>Chat</h3><p>Le chat est ouvert aux deux joueurs et aux spectateurs. Les messages sont transmis en temps réel, limités à 280 caractères et non archivés.</p><p>Contre l’ordinateur, le mode <strong>Provocateur</strong> produit des réponses locales à partir du score, des récoltes, du Frouxo, de la fin de partie et du texte saisi. Il reste facultatif et exclut les menaces et les attaques discriminatoires.</p></section>

      <section class="help-ai-section">
        <h3>Comment j’ai construit l’adversaire informatique</h3>
        <p>J’ai construit l’ordinateur autour d’une recherche <strong>Minimax avec élagage Alpha-Bêta</strong>. Au lieu de choisir seulement la récolte immédiate, je simule un arbre de coups : l’ordinateur cherche la valeur la plus élevée et, pour les réponses humaines, j’assume la réponse qui lui est la plus défavorable. Le Minimax suppose donc que les deux côtés essaient de jouer au mieux.</p>
        <p><strong>Principe théorique.</strong> Chaque nœud représente une position du plateau et chaque branche un coup légal. L’ordinateur maximise l’évaluation et l’adversaire la minimise. L’élagage Alpha-Bêta supprime les branches qui ne peuvent plus modifier la décision. Je réutilise aussi les positions déjà analysées grâce à une table de transpositions.</p>
        <p><strong>Profondeur.</strong> Je la mesure en demi-coups, ou <em>plies</em>. La profondeur 1 analyse un coup de l’ordinateur; la profondeur 2 ajoute une réponse humaine; la profondeur 24 représente environ douze séquences complètes de coups et réponses.</p>
        <div class="help-levels" role="list" aria-label="Niveaux de l’ordinateur">
          <div role="listitem"><strong>Apprenti</strong><span>Profondeur 4 · 320 ms</span><small>Force de l’ancien Amateur, avec 12 % de choix aléatoires.</small></div>
          <div role="listitem"><strong>Amateur</strong><span>Profondeur 8 · 950 ms</span><small>Force de l’ancien Maître, sans hasard.</small></div>
          <div role="listitem"><strong>Maître</strong><span>Profondeur 12 · 2,6 s</span><small>Force de l’ancien Grand Maître.</small></div>
          <div role="listitem"><strong>Grand Maître</strong><span>Profondeur 18 · 4,8 s</span><small>Profondeur maximale doublée et temps de recherche accru.</small></div>
        </div>
        <p>J’utilise un <strong>approfondissement itératif</strong> : profondeur 1, puis 2, 3, etc. Quand le temps est écoulé, je garde le meilleur coup de la dernière profondeur complètement terminée. Sur un téléphone lent, le Grand Maître peut s’arrêter avant sa profondeur maximale.</p>
        <p><strong>Évaluation.</strong> Lorsque la recherche n’atteint pas la fin de la partie, j’évalue la différence de graines gagnées (poids <strong>145</strong>), la pression d’alimentation (<strong>18</strong>), la mobilité (<strong>8</strong>), les graines vulnérables (<strong>3,2</strong>), l’équilibre des graines sur le plateau (<strong>2,2</strong>), les grandes cases de 12 graines ou plus (<strong>2,5</strong>) et les cases vides (<strong>1,4</strong>). Une victoire vaut environ <strong>+1 000 000</strong> et une défaite <strong>−1 000 000</strong>.</p>
        <p><strong>Mon approche de l’Uril.</strong> Je fais prendre en compte les récoltes, l’alimentation obligatoire, la mobilité, les cases vulnérables, les grandes accumulations, la triple répétition, le Capote et le Frouxo. Une simulation qui donne le feu alors qu’elle pouvait encore nourrir l’adversaire au coup suivant est immédiatement évaluée comme une défaite par Frouxo.</p>
        <p class="help-ai-note"><strong>Pourquoi un humain peut encore gagner.</strong> Je n’ai pas cherché à résoudre complètement l’Uril. Pour simplifier et préserver le plaisir, j’ai limité la profondeur et le temps, conservé un peu de hasard uniquement au niveau Apprenti et écarté les livres d’ouvertures, les bases complètes de finales et l’apprentissage automatique. L’évaluation reste une approximation stratégique qu’un joueur expérimenté peut exploiter.</p>
      </section>
      <section><h3>Règles de l’Uril du Cap-Vert</h3><ol><li><strong>Plateau.</strong> 12 cases de jeu, six par joueur, quatre graines par case, plus deux réserves latérales pour les graines gagnées.</li><li><strong>Sens.</strong> Distribution antihoraire.</li><li><strong>Semis.</strong> Toutes les graines d’une case sont distribuées une par une; la case de départ est sautée après un tour complet.</li><li><strong>Une graine.</strong> Toute case propre contenant au moins une graine est jouable.</li><li><strong>Récolte.</strong> La dernière graine permet de récolter les cases adverses consécutives contenant 2 ou 3 graines.</li><li><strong>Alimentation.</strong> Si le camp adverse est vide, il faut l’alimenter lorsqu’un coup le permet.</li><li><strong>Six cases.</strong> La récolte des six cases adverses n’est admise que si, au coup suivant, celui qui a donné le feu ne peut plus nourrir l’adversaire. S’il peut encore le nourrir, c’est <strong>Frouxo</strong> et il perd la partie.</li><li><strong>Fin.</strong> La partie ne s’arrête pas à 25; elle continue jusqu’à l’absence de coup.</li><li><strong>Triple répétition.</strong> À la troisième répétition, chacun garde les graines de son camp.</li><li><strong>Capote.</strong> Moins de 12 graines : Capote, valant deux parties.</li><li><strong>Quatro.</strong> Quatre victoires consécutives marquent un Quatro.</li><li><strong>Coupe.</strong> Deux victoires consécutives coupent après un Quatro; un Capote coupe immédiatement.</li><li><strong>Partie suivante.</strong> Le gagnant commence; en cas de nul, le même joueur recommence.</li></ol></section>
      <section><h3>Suggestions publiques</h3><p>La section des suggestions se trouve directement sur la page. Chaque publication affiche le pseudo, l’île, la date et l’heure. Tous les visiteurs peuvent lire; seuls les joueurs inscrits peuvent publier et répondre. Les suggestions et les réponses sont enregistrées dans Supabase et se mettent à jour en temps réel.</p></section>
      <section><h3>Synchronisation</h3><p>Vérifie que les deux joueurs sont dans la même table. Après une mise à jour GitHub, utilise <strong>Ctrl + F5</strong>.</p></section>
      <p class="rules-note">La version 1.0.0 continuera d’être ajustée avec des joueurs expérimentés d’Uril.</p>`,
    north: 'Nord', south: 'Sud', capeVerde: 'Cap-Vert',
    matchDrawKeep: 'Match nul : le compte reste inchangé.', currentLead: '{player} mène le compte actuel par {wins}–0.', quatroRecorded: '{player} a marqué un Quatro. Le Quatro reste enregistré.', firstCutWin: '{player} a obtenu la première victoire de coupe. Il en manque encore une consécutive.', capotePrefix: 'CAPOTE : {player} ajoute deux parties.',
    profileTooShort: 'Écris d’abord un pseudo d’au moins deux caractères.', statusPc: 'Joue contre l’ordinateur{bank}', statusPcLevel: 'Joue contre l’ordinateur · {level}', statusWatchingPc: 'Regarde {nick} jouer contre l’ordinateur', statusLocal: 'Joue en mode local',
    statusWaiting: 'Dans une table d’Uril, en attente{bank}', statusPlaying: 'Dans une table d’Uril, en jeu{bank}', statusWatching: 'Dans une table d’Uril, regarde{bank}', statusFree: 'Libre',
    connectSupabasePlayers: 'Relie Supabase pour voir les joueurs.', playersConnectedOne: '1 joueur connecté', playersConnectedMany: '{count} joueurs connectés', noPlayersConnected: 'Aucun joueur connecté.',
    guest: 'Invité', you: 'TOI', inGame: 'En jeu', invite: 'Inviter', occupied: 'Occupé', pcWatchTitle: '{nick} contre l’ordinateur', watchingPcGame: 'Regarde l’entraînement de {nick} · Sud en bas', pcWatchPresence: 'Entraînement de {nick} contre le PC', pcWatchStarted: 'Tu regardes l’entraînement de {nick}.', pcWatchUnavailable: 'Cet entraînement contre l’ordinateur n’est plus disponible.', pcWatchEnded: 'L’entraînement contre l’ordinateur est terminé ou le joueur est parti.', pcWatchSyncError: 'Erreur de synchronisation de l’entraînement : {error}', invitedToBank: '{nick} t’invite dans la table d’Uril « {bank} ».',
    invitedToGuestBank: '{nick} veut jouer avec toi dans une table privée d’Uril. Acceptes-tu ?', invitationAcceptedBy: '{nick} a accepté l’invitation et a rejoint la table.', invitationDeclinedBy: '{nick} a refusé l’invitation.', officialInviteNeedsAccount: 'Cette invitation concerne une partie officielle et nécessite un compte joueur.', guestInviteAnonymousOnly: 'Les tables privées d’invités sont réservées aux joueurs anonymes.',
    chatReady: 'Écrire dans la table…', chatConnecting: 'Connexion au chat…', bankNotFree: 'Cette table d’Uril n’est plus libre.', onlineNotReady: 'Le mode en ligne n’est pas encore relié.',
    playerAlreadyBusy: '{nick} est déjà dans une table d’Uril.', defaultBankName: 'Table de {nick}', pcBankName: 'Table de {nick} contre le PC', pcBankPublished: 'L’entraînement contre l’ordinateur est privé.', pcBankPrivate: 'La partie a commencé en privé car le service en ligne n’est pas encore connecté.', pcBankPublishError: 'La partie a commencé, mais la table n’est pas publique : {error}', invitationSent: 'Invitation envoyée à {nick}.',
    connectSupabaseBanks: 'Relie Supabase pour ouvrir les tables d’Uril en ligne.', noBanks: 'Aucune table d’Uril. Crée la première.', noLiveBanks: 'Aucune partie en direct actuellement.', noOpenBanks: 'Aucune table encore ouverte.', noFinishedBanks: 'Aucune partie terminée durant les 30 derniers jours.', filterLive: 'Parties Live', filterOpen: 'Encore ouvertes', filterFinished: 'Terminées', waitingUpper: 'ENCORE OUVERTE', playingUpper: 'LIVE', finishedUpper: 'TERMINÉE', bankStartedAt: 'Début : {date}', bankLastMoveAt: 'Dernier coup : {date}', bankNoMovesYet: 'Aucun coup joué', pcBankUpper: 'PC · LIVE',
    resume: 'Reprendre', play: 'Jouer', watchPlay: 'Regarder', consultMoves: 'Consulter les coups', awaitingGuest: 'En attente…', bankOnline: 'Table en ligne', versusPcMode: 'CONTRE LE PC · {level}', versusPcLiveMode: 'CONTRE LE PC · {level} · EN DIRECT', watchingMode: 'SPECTATEUR', onlineBankMode: 'TABLE EN LIGNE', twoPlayersMode: 'DEUX JOUEURS',
    matchFinished: 'Partie terminée', reviewMode: 'CONSULTATION DE LA PARTIE', reviewingBank: 'Consultation d’une partie terminée', turnOf: 'Tour de {player}', bankWaitingOpponent: 'Table en attente d’un adversaire', watchingBank: 'Spectateur · Sud en bas', yourSideBelow: 'Ton camp est en bas · {player}', computerLevel: 'Ordinateur, niveau {level}', computerPublicBank: 'Entraînement contre l’ordinateur · niveau {level}', localBank: 'Table locale sur le même appareil',
    collectedBy: 'Récoltées par {player}', capturedSeedsPit: 'Graines gagnées par {player} : {count}.', cut: 'Coupe : {player} {wins}/2', protectedFour: 'Quatro protégé par {player}', roundDraw: 'La partie se termine par un nul.', roundCapote: '{player} gagne par CAPOTE.', roundWin: '{player} gagne la partie.',
    nextDraw: 'Le plateau va être remis en place. {player} commence la prochaine partie.', nextCapote: 'Le Capote vaut deux parties. Le plateau est remis en place et {player} commence.', nextWin: 'Le plateau va être remis en place. {player} commence.',
    liftingTitle: '{player} ramasse les graines.', liftingText: 'La case de départ est vidée avant la distribution.', sowingTitle: '{player} sème.', sowingText: 'Graine {step} sur {total}.', captureTitle: '{player} récolte.', captureText: '{count} graines récoltées dans cette case.', moveDone: 'Coup terminé.', passingTurn: 'Le tour passe au joueur suivant.', bankCreated: 'Table créée.', waitingInvitation: 'En attente d’un joueur.',
    draw: 'Match nul.', wonCapote: '{player} gagne par Capote.', wonMatch: '{player} gagne la partie.', previousWin: '{player} a gagné la partie précédente.', boardResetStarter: 'Plateau remis en place. {player} commence.', watchingTitle: 'Tu regardes la partie.', playerTurn: 'C’est au tour de {player}.', waitOpponent: 'Attends le coup adverse.', computerThinking: 'L’ordinateur réfléchit.', evaluatingMoves: 'Analyse des cases disponibles.', choosePit: '{player}, choisis une case.', legalHighlighted: 'Les cases valides sont mises en évidence.', sowingLast: '{player} distribue les graines une par une.', capturingLast: '{player} récolte les cases valides.',
    moveDescription: '{player} joue {pit}{capture}.{repetition}', captureDescription: ' et récolte {count} graines{grandSlam}', sixPits: ' dans les six cases', repetitionDescription: ' La position s’est répétée trois fois et la partie est terminée.', localGuestPrompt: 'Pseudo du joueur Nord :',
    whatsappPlayMessage: 'Veux-tu jouer à l’Uril avec moi dans la table « {bank} » ? C’est la variante cap-verdienne de l’Ayo/Awalé. Entre ici : {url}',
    whatsappWatchMessage: 'Viens regarder cette table d’Uril : « {bank} ». C’est la variante cap-verdienne de l’Ayo/Awalé. Ouvre ici : {url}',
    sharePlayUnavailable: 'Cette table a déjà deux joueurs. Envoie plutôt une invitation pour regarder.', shareOnlyOnline: 'Les invitations WhatsApp sont disponibles dans une table officielle.',
    sharedPlayTitle: 'Invitation à jouer dans « {bank} ».', sharedWatchTitle: 'Invitation à regarder « {bank} ».', sharedInviteHelp: 'Connecte-toi pour accepter l’invitation officielle. Comme visiteur anonyme, tu peux encore regarder.', sharedBankMissing: 'La table indiquée n’est plus disponible.', sharedBankStartedWatch: 'La partie a déjà commencé. Tu vas entrer comme spectateur.', consultBankError: 'Impossible de consulter la table : {error}', gameReview: 'CONSULTATION DE LA PARTIE', reviewPosition: 'Coup {current} sur {total}', reviewHelp: 'Déplace le contrôle pour reconstruire la partie coup par coup.', reviewFirst: 'Position initiale', reviewPrevious: 'Coup précédent', reviewNext: 'Coup suivant', reviewLast: 'Dernière position', reviewSlider: 'Position de la partie', reviewStartPosition: 'Position initiale de la partie.', reviewMovePosition: 'Consultation du coup {current} sur {total}.', reviewNoDate: 'Date indisponible.', pitSeeds: '{pit} : {count} graines', acceptInviteError: 'Impossible d’accepter l’invitation : {error}', sendInviteError: 'Impossible d’envoyer l’invitation : {error}', resetError: 'Impossible de remettre le plateau en place : {error}', refreshBanksError: 'Impossible d’actualiser les tables d’Uril : {error}', supabaseRequired: 'Les tables d’Uril en ligne nécessitent la configuration Supabase du paquet.', createBankError: 'Erreur lors de la création de la table : {error}', enterBankError: 'Impossible d’entrer dans la table d’Uril : {error}', syncBankError: 'Erreur de synchronisation de la table : {error}', moveRejected: 'Le coup n’a pas été accepté.', aiTimeout: 'L’analyse du coup a dépassé le temps prévu.', aiFailed: 'L’intelligence artificielle a échoué.', aiStartFailed: 'Impossible de démarrer l’intelligence artificielle.', computerError: 'Erreur de l’ordinateur : {error}', chatError: 'Chat : {error}', languageName: 'Français',
  },

  en: {
    metaDescription: 'Cape Verde Uril — the Cape Verdean variant of the Ayo/Awalé family, with local, computer and online table play.',
    brandHomeAria: 'Back to home', onlinePlayers: 'players online', helpAndRules: 'Help and rules', live: 'LIVE', onlineRosterTitle: 'Players online', connectingPlayers: 'Connecting to the player lobby…', rosterHelp: 'Registered and calibrated players receive direct invitations to official Uril tables.',
    endgameTraining: 'ENDGAME', drillsTitle: 'Drills · Corri Oro', drillsIntro: 'Public endgames for practising the run to gold. No account required.',
    drillLevelBeginner: 'Beginner', drillLevelBeginnerIntro: 'Fundamental patterns and short decisions.', drillLevelMedium: 'Intermediate', drillLevelMediumIntro: 'Multi-tempo sequences, feeding and reserves.', drillLevelAdvanced: 'Advanced', drillLevelAdvancedIntro: 'Long positions with parity and false choices.', drillCaseLabel: 'Case', drillStrategicPosition: 'Strategic position',
    drillTargetShort: 'Perfect 25–23', drill01Title: 'Gold I · The decisive choice', drill02Title: 'Gold II · Three exits', drill03Title: 'Gold III · Do not capture too early', drill04Title: 'Gold IV · Hold the pit', drill05Title: 'Gold V · Exact feeding', drill06Title: 'Gold VI · Short race', drill07Title: 'Gold VII · Two choices', drill08Title: 'Gold VIII · Gold in sight',
    drillCase32Title: 'Case 3–2 · Finish without hesitation', drillCase43Title: 'Case 4–3 · Count the final tempo', drillCase53Title: 'Case 5–3 · Choose the right pit', drillCase54Title: 'Case 5–4 · Keep the initiative', drillCase63Title: 'Case 6–3 · Recover the gold run', drillCase64Title: 'Case 6–4 · Reserve and sequence',
    drillAdvanced63Title: 'Advanced 6–3 · Double capture and reserve', drillAdvanced64Title: 'Advanced 6–4 · Accept the strong reply', drillAdvanced65Title: 'Advanced 6–5 · Trading captures', drillAdvanced54Title: 'Advanced 5–4 · A patient race', drillAdvanced53Title: 'Advanced 5–3 · Build three captures', drillAdvanced43Title: 'Advanced 4–3 · Feed without yielding', drillAdvanced55Title: 'Advanced 5–5 · Deceptive symmetry', drillAdvanced44Title: 'Advanced 4–4 · Hidden parity', drillAdvanced74Title: 'Advanced 7–4 · Recover the initiative', drillAdvanced75Title: 'Advanced 7–5 · One seed to win',
    drill01Challenge: 'Several moves look acceptable, but only one preserves the right tempo to reach the final seeds first. A beginner often plays the fullest pit and loses the race.', drill02Challenge: 'Three pits can advance, but their order determines who must feed. This drill teaches players to count not only seeds, but also the remaining tempos on both sides.', drill03Challenge: 'The immediate capture looks attractive, but it removes the reserve needed for the ending. The challenge is to delay a small gain and secure the 25th seed.', drill04Challenge: 'One pit must be kept as a reserve. Spending it too early gives the final tempo to the opponent; keeping it controls the last feeding sequence.', drill05Challenge: 'You must feed exactly without offering a capture. Beginners often give one seed too many and create a winning reply for the defence.', drill06Challenge: 'Few seeds remain and every move matters. The challenge is to calculate who moves last and preserve a single-tempo advantage.', drill07Challenge: 'Two choices appear equivalent. One keeps the perfect sequence; the other changes the parity and lets the opponent reach gold first.', drill08Challenge: 'Gold is close, but the greediest move fails. You must prepare the last capture and finish exactly 25–23.',
    drillCase32Challenge: 'Case 3–2 is the shortest form of the race. South has three seeds and North two. There are two exits, but only the correct pit immediately creates the final 1–1 and secures 25–23.',
    drillCase43Challenge: 'In case 4–3, the common mistake is spending a central pit first. The solution preserves the order of the tempos, opens with the reserve and guides the forced replies to 1–1.',
    drillCase53Challenge: 'In case 5–3, three pits appear playable. The choice is determined by parity rather than the fullest pit: the exact move keeps South one tempo ahead.',
    drillCase54Challenge: 'Case 5–4 is almost balanced. Feeding too early gives North the initiative. Keep one reserve seed, then close the sequence without offering an intermediate capture.',
    drillCase63Challenge: 'South has more seeds on the board but starts far behind in the score. The task is to convert 6–3 into an exact sequence and stop North from reversing the final tempo.',
    drillCase64Challenge: 'Case 6–4 requires a longer count. Preserve the reserve, follow North’s forced replies and maintain the same parity for fourteen moves until the final 1–1.',
    drillAdvanced63Challenge: 'South has 6 seeds against 3, but the edge matters only if the first two captures are made in the right order. A long reserve-and-feeding sequence follows before the final capture.',
    drillAdvanced64Challenge: 'The defence captures immediately. The exercise is about accepting the temporary loss, keeping parity and recovering at exactly the right time without spending the reserve pits too early.',
    drillAdvanced65Challenge: 'Both sides capture early and the character of the position changes at once. The hard part is separating material advantage from tempo advantage all the way to the 1–1 finish.',
    drillAdvanced54Challenge: 'Almost the whole race runs without captures. This is pure tempo counting: one pit played out of order flips parity and hands the opponent the large final capture.',
    drillAdvanced53Challenge: 'South starts far behind and must construct three separate captures. The first one is not enough; the structure that enables the next two must be preserved.',
    drillAdvanced43Challenge: 'With only 4 against 3, North is forced to feed more than once. Recognise those feeds without capturing too early and keep the final tempo for the 25–23 finish.',
    drillAdvanced55Challenge: 'The fields start 5–5, but the distribution is not symmetric. Three late captures arrive in sequence and a single change of order reverses the race.',
    drillAdvanced44Challenge: 'A 4–4 total looks neutral. It is not: North prepares a four-seed capture near the end, and South wins only by preserving the reply that regains the final tempo.',
    drillAdvanced74Challenge: 'South holds more seeds on the board, but the defence has captures of its own. Alternate material gain with tempo control so North never stabilises the race.',
    drillAdvanced75Challenge: 'South already has 24 captured seeds while North still has room for two large captures. Resist the urge for an immediate gain and secure the one missing seed at the right moment.',
    drillObjective25: 'Objective: run to gold and finish 25–23 against the reference defence.', drillChallengeLabel: 'The challenge in this position', restartDrill: 'Restart', showDrillHint: 'Show hint', showDrillSolution: 'Show perfect solution', stopDrillSolution: 'Stop solution', nextDrill: 'Next drill', drillPlayer: 'Player', drillOpponent: 'Reference defence', drillStarted: 'Endgame drill started.', drillMode: 'DRILL · CORRI ORO', drillPublicStatus: 'Public endgame drill · no account', drillHintPit: 'Hint: play {pit}.', drillPerfectLine: 'Perfect line maintained · decisions: {moves}', drillLineBroken: 'You left the reference line · continue against the AI · decisions: {moves}', drillSolutionProgress: 'Perfect solution in motion · move {current} of {total}.', drillSolutionComplete: 'Solution completed: both sides followed the perfect line; at the final 1–1, each player received their seed, finishing 25–23.', drillSolutionStarted: 'Playing the perfect solution for both sides.', drillSolutionStopped: 'Solution playback stopped.', drillSolutionIllegal: 'Move {move} in the solution is no longer legal.', drillSolutionError: 'Could not play the solution: {error}', drillSolutionPlayingTitle: 'Perfect solution playing.', drillSolutionPlayingText: 'Watch both sides run to gold · move {current} of {total}.', drillSuccessTitle: 'The gold run is complete.', drillRetryTitle: 'The perfect line was lost.', drillSuccessText: 'Result 25–23. Drill completed.', drillRetryText: 'Review the position, use the hint and try again.', drillOpponentThinking: 'The defence is calculating.', drillPerfectDefence: 'The opponent follows the best known defence for this position.', drillChooseMove: 'Choose the exact continuation.', statusDrill: 'Training Corri Oro',
    versionZero: 'VERSION 1.0', heroTitle: 'The traditional game,<br><em>island by island.</em>', heroIntro: 'Train against the artificial intelligence or sign in to play official games and join the Elo ranking.',
    variantLabel: 'AYO · AWALÉ · OWARE', variantIntro: 'Uril is the Cape Verdean variant of the wider African Ayo/Awalé/Oware family, adapted to Cape Verdean rules and tradition.',
    nickLabel: 'Your nickname', nickPlaceholder: 'E.g. Mindelense77', islandLabel: 'Your island', backgroundHint: 'The background follows your chosen island.', playNow: 'PLAY NOW',
    versusComputer: 'Against the computer', versusComputerDesc: 'Individual training with four difficulty levels, watchable live. These matches never change official Elo.', level: 'Level', levelApprentice: 'Apprentice', levelAmateur: 'Amateur', levelMaster: 'Master', levelGrandmaster: 'Grand Master', firstMove: 'First move', humanStarts: 'I play first', computerStarts: 'Computer plays first', pcOpeningTitle: 'Choose the computer opening', pcOpeningChoose: 'Tap a North pit to set the PC first move. If you do not choose, it starts by itself in {seconds}s.', pcOpeningChosen: 'Computer opening set: {pit}.', pcOpeningAuto: 'Time is up. The computer chooses its opening.', aiChatMode: 'AI chat', aiChatProvocative: 'Provocative', aiChatOff: 'Off', startMatch: 'Start match',
    banksOnline: 'Online Uril tables', banksOnlineDesc: 'Review Live and completed games. Only registered and calibrated players create or play official tables.', viewBanks: 'View tables', sameScreen: 'SAME SCREEN', twoPlayers: 'Two players', twoPlayersDesc: 'A local training match on the same device, available after signing in to an account.', playLocally: 'Play locally',
    openBanks: 'OPEN TABLES', urilBanks: 'Uril tables', refresh: 'Refresh', bankNamePlaceholder: 'Table name', createBank: 'Create table', setupNotice: 'The archive, accounts, Elo rating and official tables are not connected to Supabase yet. AI training remains available. See <strong>GUIA-GITHUB.md</strong> to activate version 1.0.0.',
    whatsappInviteLabel: 'WHATSAPP INVITATION', whatsappInviteDefault: 'You received an invitation to an Uril table.', openWhatsappBank: 'Open invitation', leaveBank: '← Leave table', match: 'MATCH', bankOfUril: 'Uril table', arrangeNow: 'Reset now', quatros: 'QUATROS', count: 'COUNT',
    pickedNorth: 'Captured by North', turnSouth: 'South to move', pickedSouth: 'Captured by South', boardAria: 'Uril board', seeds48: '48 seeds · Cape Verde', roundEnded: 'MATCH ENDED', southWon: 'South won the match.', boardWillReset: 'The board will be reset.', matchStarted: 'The match has started.', southStarts: 'South starts.',
    bankStatus: 'TABLE STATUS', localMatch: 'Local match', countStarts: 'The count starts at 0–0.', lastMove: 'LAST MOVE', noMoves: 'No moves yet.', bankChat: 'TABLE CHAT', chatEmpty: 'No messages in this table yet.', chatPlaceholder: 'Write in the table…', chatAria: 'Chat message', send: 'Send', chatNote: 'Messages are sent in real time and are not archived.',
    aiChatTitle: 'CHAT WITH THE AI', aiChatProvocation: 'TAUNT MODE', aiChatEmpty: 'The computer is quiet for now. Enjoy it.', aiChatReady: 'Reply to the computer…', aiChatNote: 'The AI reads the position, captures and message text to answer with mockery. Taunt mode is optional and uses no external service.',
    whatsappShare: 'INVITE VIA WHATSAPP', whatsappShareText: 'Share this table with another player or someone who wants to watch.', inviteToPlayWhatsapp: 'Invite to play', inviteToWatchWhatsapp: 'Invite to watch', reminder: 'REMINDER', reminderText: 'Sow counter-clockwise, skipping the starting pit after a full lap. Capture consecutive opposing pits containing 2 or 3 seeds.', fullRules: 'Read full rules', assetCredit: 'Historical reference for the classic artwork: Oliver Merkel, CC BY-NC-SA 4.0.',
    invitationReceived: 'INVITATION RECEIVED', genericInvite: 'You received an invitation to an Uril table.', decline: 'Decline', enterBank: 'Enter table', resignButton: 'Resign', resignEyebrow: 'RESIGNATION', resignDialogTitle: 'Confirm resignation', resignDialogPlayer: '{player} is asking to resign.', resignWarningOne: '{player}, you have captured {seeds} seeds. Resigning counts as one game.', resignWarningTwo: '{player}, you have captured only {seeds} seeds. Since you have not reached 12, resigning counts as two games, like a Capote.', keepPlaying: 'Keep playing', confirmResign: 'Confirm resignation', reasonResignation: '{player} resigned.', reasonFrouxo: 'Frouxo: the player who cleared all six pits loses because they could still feed the opponent on the next turn.', reasonOneEach: 'One seed remained on each side. The game ends and each player receives their seed.', resignationWin: '{loser} resigned. {winner} won.', resignationResultOne: 'The resignation counts as one game.', resignationResultTwo: 'The resignation counts as two games because {player} had not yet reached 12 seeds.', roundResignation: '{loser} resigned. {winner} won the game.', nextResignationOne: 'The resignation counts as one game. The board will be reset and {player} starts.', nextResignationTwo: 'The resignation counts as two games. The board will be reset and {player} starts.', resignError: 'Could not register the resignation.', aiResignEyebrow: 'COMPUTER REQUEST', aiResignTitle: 'The computer wants to resign', aiResignWarningOne: '{player} has concluded it can no longer win and asks to resign for one game. Do you accept?', aiResignWarningTwo: '{player} has concluded it can no longer win and asks to resign for two games because it has only {seeds} seeds. Do you accept?', rejectAIResign: 'Do not accept', acceptAIResign: 'Accept resignation', footerCopyright: '© 2026 DevNexus Digital', footerConcept: 'Concept, development and direction', versionLabel: 'Version 1.0.16', suggestions: 'Suggestions', suggestionsCommunity: 'COMMUNITY', suggestionsTitle: 'Suggestions and replies', suggestionsIntro: 'Suggestions are public and show the nickname and date. Everyone can read; only registered players publish and reply.', publishAs: 'Publish as', suggestionPlaceholder: 'Your suggestion…', suggestionsPublicNote: 'The suggestion will be visible to every visitor.', publishSuggestion: 'Publish suggestion', suggestionsPublished: 'published suggestions', suggestionsEmpty: 'There are no suggestions yet. Start the conversation.', suggestionsNeedSupabase: 'Connect Supabase to publish and view suggestions.', suggestionsLoading: 'Loading suggestions…', suggestionsMigrationNeeded: 'Run supabase-v1.0.0.sql in the Supabase SQL Editor.', suggestionsLoadError: 'Could not load suggestions: {error}', suggestionEmpty: 'Write a suggestion with at least four characters.', suggestionPublished: 'The suggestion was published.', suggestionPublishError: 'Could not publish the suggestion: {error}', reply: 'Reply', replyCount: '{count} replies', replyPlaceholder: 'Write a reply…', replyAria: 'Reply to {nick}’s suggestion', cancelReply: 'Cancel', publishReply: 'Publish reply', replyEmpty: 'Write a reply first.', replyPublished: 'The reply was published.', replyPublishError: 'Could not publish the reply: {error}',     signIn: 'Sign in', registerPlayer: 'Register player', signOut: 'Sign out',
    heroIntroV1: 'Play against the artificial intelligence without registering or invite another anonymous visitor to a private match. Register a player account for official games and the Elo ranking.',
    playerIdentity: 'PLAYER IDENTITY', anonymousVisitor: 'Anonymous visitor', anonymousRights: 'AI training, private anonymous invitations and game review.',
    eloRating: 'Elo', registerToCompete: 'Register to compete', initialEloTest: 'Initial Elo assessment', startCalibration: 'Start next test',
    calibrationProgress: '{current} of 3 tests completed', calibrationComplete: 'Estimated initial Elo: {elo}', calibrationRecorded: 'Test recorded. Current Elo: {elo}.', calibrationRequired: 'Complete all three AI calibration tests before entering official games.', completeCalibration: 'Complete calibration',
    searchGames: 'Search player, country, island or table', fromDate: 'From', toDate: 'To', resultFilter: 'Result', eventFilter: 'Event', allResults: 'All', southWonFilter: 'South win', northWonFilter: 'North win', drawFilter: 'Draw', allEvents: 'All', search: 'Search', createOfficialBank: 'Create official table',
    loginCreateBank: 'Sign in to a player account to create or play official tables.', moveDetails: 'MOVE DETAILS', analyseMove: 'Analyse move',
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
    helpVersion: 'HELP 1.0.16', helpTitle: 'Help, tables and rules', close: 'Close',
    helpContent: `
      <section><h3>What is Uril?</h3><p>Uril is the Cape Verdean variant of the broad African game family known as <strong>Ayo</strong>, <strong>Awalé</strong> and <strong>Oware</strong>. This version follows Cape Verdean rules and tradition.</p></section>
      <section><h3>Starting a game</h3><p>Without an account, you enter with a temporary anonymous identity. You can train against the AI, review games or directly invite another free anonymous visitor. An accepted invitation opens a private unrated table with synchronised play and real-time chat. A registered player receives a public identity, an Elo rating and access to official games after calibration.</p><ul><li><strong>Against the computer:</strong> Apprentice, Amateur, Master and Grand Master. Training is private and never changes Elo.</li><li><strong>Two anonymous players online:</strong> one free player invites the other, who accepts or declines the alert.</li><li><strong>Official tables:</strong> calibrated registered players create and play rated games; every visitor can watch Live games and review the archive.</li></ul></section>
      <section><h3>Endgame Drills · Corri Oro</h3><p>I created these public exercises to practise the Cape Verdean endgame phase known as <strong>running to gold</strong> or <strong>Corri Oro</strong>. No account is required, and the menu appears in the left column.</p><p>The Drills are organised as <strong>Beginner</strong>, <strong>Intermediate</strong> and <strong>Advanced</strong>. Cases 3–2, 4–3, 5–3, 5–4, 6–3 and 6–4 describe the total seeds remaining on South’s and North’s sides, not the match score.</p><p>Each Drill starts from a realistic late-game position. The objective is to find the exact continuation against the best known defence and finish <strong>25–23</strong>. <strong>Show hint</strong> reveals the next pit in the reference line; <strong>Restart</strong> restores the position; <strong>Next drill</strong> opens another case.</p><p>For inexperienced players, each exercise explains the position’s main challenge: tempo, feeding, reserve, parity, or the exact moment to capture. <strong>Show perfect solution</strong> restores the position and automatically moves the seeds for both sides until the 25–23 result.</p><p>If you leave the prepared line, the exercise continues against the Grand Master AI so that you can study the consequence of the choice.</p></section>
      <section><h3>Players, tables and invitations</h3><p>The left column shows live player status: free, against the computer, local play, waiting in a table, playing or watching. A public computer match includes a <strong>Watch</strong> button.</p><p>Inside an online table, WhatsApp buttons create a direct link to play or watch. Each player always sees their own side at the bottom.</p></section>
      <section><h3>Table and AI chat</h3><p>Chat is available to both players and spectators. Messages are sent in real time, limited to 280 characters and are not archived.</p><p>Against the computer, <strong>Provocative</strong> mode creates local replies from the score, captures, Frouxo, the game result and the player’s text. It is optional and excludes threats and discriminatory attacks.</p></section>

      <section class="help-ai-section">
        <h3>How I built the computer opponent</h3>
        <p>I built the computer around a <strong>Minimax search with Alpha-Beta pruning</strong>. Instead of choosing only the immediate capture, I simulate a tree of legal moves: the computer maximises the score, while the human response is assumed to minimise it. Minimax therefore works on the assumption that both sides try to play their strongest move.</p>
        <p><strong>Theory.</strong> Every node represents a board position and every branch a legal move. The computer maximises the evaluation and the opponent minimises it. Alpha-Beta pruning discards branches that can no longer change the final decision. I also reuse previously analysed positions through a transposition table.</p>
        <p><strong>Depth.</strong> I measure depth in half-moves, or <em>plies</em>. Depth 1 examines one computer move; depth 2 adds one human reply; depth 24 is roughly twelve complete move-and-reply sequences.</p>
        <div class="help-levels" role="list" aria-label="Computer levels">
          <div role="listitem"><strong>Apprentice</strong><span>Depth 4 · 320 ms</span><small>Strength of the former Amateur, with 12% random choices.</small></div>
          <div role="listitem"><strong>Amateur</strong><span>Depth 8 · 950 ms</span><small>Strength of the former Master, without randomness.</small></div>
          <div role="listitem"><strong>Master</strong><span>Depth 12 · 2.6 s</span><small>Strength of the former Grand Master.</small></div>
          <div role="listitem"><strong>Grand Master</strong><span>Depth 18 · 4.8 s</span><small>A deeper search than Master, with a shorter maximum thinking time for faster play.</small></div>
        </div>
        <p>I use <strong>iterative deepening</strong>: first depth 1, then 2, 3 and so on. When time expires, I keep the best move from the last fully completed depth. On a slower phone, Grand Master may stop before reaching its maximum depth.</p>
        <p><strong>Position evaluation.</strong> When the search does not reach the end of the game, I score captured-seed difference (weight <strong>145</strong>), feeding pressure (<strong>18</strong>), mobility (<strong>8</strong>), vulnerable seeds (<strong>3.2</strong>), board-seed balance (<strong>2.2</strong>), large pits containing at least 12 seeds (<strong>2.5</strong>) and empty pits (<strong>1.4</strong>). A win is worth about <strong>+1,000,000</strong> and a loss <strong>−1,000,000</strong>.</p>
        <p><strong>How I approach Uril.</strong> I make the engine consider captures, compulsory feeding, mobility, vulnerable pits, large accumulations, threefold repetition, Capote and Frouxo. A simulation that clears all six pits while the player could still feed the opponent on the next turn is immediately scored as a Frouxo loss.</p>
        <p class="help-ai-note"><strong>Why a human can still win.</strong> I did not try to solve Uril completely or build an unbeatable machine. To simplify the engine and keep the game enjoyable, I limited depth and thinking time, kept some randomness only at Apprentice level, and left out opening books, complete endgame tables and machine learning. The evaluation is a strategic approximation, so an experienced human can still exploit positions beyond the computer’s search horizon.</p>
      </section>
      <section><h3>Cape Verde Uril rules</h3><ol><li><strong>Board.</strong> 12 playing pits, six per player, with four seeds in each pit, plus two lateral stores for won seeds.</li><li><strong>Direction.</strong> Sowing is counter-clockwise.</li><li><strong>Sowing.</strong> Take all seeds from one of your pits and sow one per pit; skip the starting pit after a full lap.</li><li><strong>One seed.</strong> Any of your pits with one or more seeds is playable.</li><li><strong>Capture.</strong> If the last seed leaves 2 or 3 seeds in an opposing pit, capture it and consecutive qualifying pits backwards.</li><li><strong>Feeding.</strong> If the opponent is empty, a feeding move is mandatory whenever one exists.</li><li><strong>All six pits.</strong> Capturing all six opposing pits is allowed only if, on the next turn, the player who cleared them can no longer feed the opponent. If feeding is still possible, it is <strong>Frouxo</strong> and that player loses the game.</li><li><strong>Normal end.</strong> The game does not end at 25; it continues until there is no valid move.</li><li><strong>Triple repetition.</strong> On the third repetition, each player keeps the seeds on their own side.</li><li><strong>Capote.</strong> A player finishing with fewer than 12 seeds suffers Capote, worth two games.</li><li><strong>Resignation.</strong> The player confirms before resigning. With 12 or more captured seeds, the loss counts as one game; below 12, it counts as two. The computer may also ask to resign when victory is mathematically impossible; the player accepts or refuses.</li><li><strong>Quatro.</strong> Four consecutive wins score a Quatro.</li><li><strong>Cut after Quatro.</strong> Two consecutive wins cut the count; a Capote cuts immediately.</li><li><strong>Next game.</strong> The winner starts; after a draw, the same starter begins again.</li></ol></section>
      <section><h3>Public suggestions</h3><p>The suggestions area is part of the page. Each post shows the nickname, country, island when applicable, date and time. Every visitor can read; only registered players publish and reply. Suggestions and replies are stored in Supabase and update in real time.</p></section>
      <section><h3>Sync problems</h3><p>Check that both players entered the same table. After a GitHub update, use <strong>Ctrl + F5</strong> in both browsers.</p></section>
      <p class="rules-note">Version 1.0.16 will continue to be refined with experienced Uril players.</p>`,
    north: 'North', south: 'South', capeVerde: 'Cape Verde',
    matchDrawKeep: 'Draw: the count remains unchanged.', currentLead: '{player} leads the current count {wins}–0.', quatroRecorded: '{player} scored a Quatro. The Quatro remains recorded.', firstCutWin: '{player} earned the first cut win. One more consecutive win is needed.', capotePrefix: 'CAPOTE: {player} adds two games.',
    profileTooShort: 'Enter a nickname with at least two characters first.', statusPc: 'Playing against the computer{bank}', statusPcLevel: 'Playing against the computer · {level}', statusWatchingPc: 'Watching {nick} play against the computer', statusLocal: 'Playing locally', statusWaiting: 'In an Uril table, waiting{bank}', statusPlaying: 'In an Uril table, playing{bank}', statusWatching: 'In an Uril table, watching{bank}', statusFree: 'Free',
    connectSupabasePlayers: 'Connect Supabase to see players.', playersConnectedOne: '1 player connected', playersConnectedMany: '{count} players connected', noPlayersConnected: 'No players connected yet.', guest: 'Guest', you: 'YOU', inGame: 'In game', invite: 'Invite', occupied: 'Busy', pcWatchTitle: '{nick} against the computer', watchingPcGame: 'Watching {nick} train · South at the bottom', pcWatchPresence: '{nick} training against the PC', pcWatchStarted: 'You are watching {nick} train.', pcWatchUnavailable: 'This computer match is no longer available.', pcWatchEnded: 'The computer match ended or the player left.', pcWatchSyncError: 'Training sync error: {error}', invitedToBank: '{nick} invited you to the Uril table “{bank}”.',
    invitedToGuestBank: '{nick} wants to play you in a private Uril table. Do you accept?', invitationAcceptedBy: '{nick} accepted the invitation and joined the table.', invitationDeclinedBy: '{nick} declined the invitation.', officialInviteNeedsAccount: 'This invitation is for an official match and requires a player account.', guestInviteAnonymousOnly: 'Private guest tables are available only to anonymous players.',
    chatReady: 'Write in the table…', chatConnecting: 'Connecting to chat…', bankNotFree: 'That Uril table is no longer free.', onlineNotReady: 'Online mode is not connected yet.', playerAlreadyBusy: '{nick} is already in an Uril table.', defaultBankName: '{nick}’s table', pcBankName: '{nick} vs PC', pcBankPublished: 'Training against the computer is private.', pcBankPrivate: 'The match started privately because the online service is not connected yet.', pcBankPublishError: 'The match started, but the table was not published: {error}', invitationSent: 'Invitation sent to {nick}.',
    connectSupabaseBanks: 'Connect Supabase to open online Uril tables.', noBanks: 'There are no Uril tables yet. Create the first one.', noLiveBanks: 'There are no Live games at the moment.', noOpenBanks: 'There are no tables still open.', noFinishedBanks: 'There are no completed games from the last 30 days.', filterLive: 'Live games', filterOpen: 'Still open', filterFinished: 'Completed', waitingUpper: 'STILL OPEN', playingUpper: 'LIVE', finishedUpper: 'COMPLETED', bankStartedAt: 'Started: {date}', bankLastMoveAt: 'Last move: {date}', bankNoMovesYet: 'No moves yet', pcBankUpper: 'PC · LIVE', resume: 'Resume', play: 'Play', watchPlay: 'Watch', consultMoves: 'Review moves', awaitingGuest: 'Waiting…', bankOnline: 'Online table', versusPcMode: 'AGAINST PC · {level}', versusPcLiveMode: 'AGAINST PC · {level} · LIVE', watchingMode: 'WATCHING', onlineBankMode: 'ONLINE TABLE', twoPlayersMode: 'TWO PLAYERS',
    matchFinished: 'Match ended', reviewMode: 'GAME REVIEW', reviewingBank: 'Reviewing a completed game', turnOf: '{player} to move', bankWaitingOpponent: 'Table waiting for an opponent', watchingBank: 'Watching · South at the bottom', yourSideBelow: 'Your side is at the bottom · {player}', computerLevel: 'Computer at {level} level', computerPublicBank: 'Computer training · {level} level', localBank: 'Local table on the same device',
    collectedBy: 'Captured by {player}', capturedSeedsPit: 'Seeds won by {player}: {count}.', cut: 'Cut: {player} {wins}/2', protectedFour: 'Quatro protected by {player}', roundDraw: 'The match ended in a draw.', roundCapote: '{player} won by CAPOTE.', roundWin: '{player} won the match.', nextDraw: 'The board will be reset. {player} starts the next match.', nextCapote: 'Capote is worth two games. The board will be reset and {player} starts.', nextWin: 'The board will be reset. {player} starts the next match.',
    liftingTitle: '{player} picked up the seeds.', liftingText: 'The starting pit is emptied before sowing.', sowingTitle: '{player} is sowing.', sowingText: 'Seed {step} of {total}.', captureTitle: '{player} is capturing.', captureText: '{count} seeds captured from this pit.', moveDone: 'Move completed.', passingTurn: 'The turn is passing.', bankCreated: 'Table created.', waitingInvitation: 'Waiting for another player to accept or join.',
    draw: 'Draw.', wonCapote: '{player} won by Capote.', wonMatch: '{player} won the match.', previousWin: '{player} won the previous match.', boardResetStarter: 'Board reset. {player} starts.', watchingTitle: 'You are watching.', playerTurn: '{player} has the turn.', waitOpponent: 'Wait for the opponent’s move.', computerThinking: 'The computer is thinking.', evaluatingMoves: 'Evaluating available pits.', choosePit: '{player}, choose a pit.', legalHighlighted: 'Valid pits are highlighted.', sowingLast: '{player} sows the seeds one by one.', capturingLast: '{player} captures the valid pits.',
    moveDescription: '{player} played {pit}{capture}.{repetition}', captureDescription: ' and captured {count} seeds{grandSlam}', sixPits: ' from all six pits', repetitionDescription: ' The position repeated for the third time and the match ended.', localGuestPrompt: 'North player nickname:',
    whatsappPlayMessage: 'Want to play Uril with me in the table “{bank}”? This is Cape Verde Uril, the Cape Verdean variant of Ayo/Awalé. Join here: {url}',
    whatsappWatchMessage: 'Come watch this Uril table: “{bank}”. This is Cape Verde Uril, the Cape Verdean variant of Ayo/Awalé. Open here: {url}',
    sharePlayUnavailable: 'This table already has two players. Send a watch invitation instead.', shareOnlyOnline: 'WhatsApp invitations are available inside an official table.', sharedPlayTitle: 'Invitation to play in “{bank}”.', sharedWatchTitle: 'Invitation to watch “{bank}”.', sharedInviteHelp: 'Sign in to accept the official invitation. As an anonymous visitor, you can still watch.', sharedBankMissing: 'The table in this invitation is no longer available.', sharedBankStartedWatch: 'The table has already started. You will join as a spectator.', consultBankError: 'Could not review the table: {error}', gameReview: 'GAME REVIEW', reviewPosition: 'Move {current} of {total}', reviewHelp: 'Move the control to reconstruct the game one move at a time.', reviewFirst: 'First position', reviewPrevious: 'Previous move', reviewNext: 'Next move', reviewLast: 'Last position', reviewSlider: 'Game position', reviewStartPosition: 'Initial game position.', reviewMovePosition: 'Reviewing move {current} of {total}.', reviewNoDate: 'Date unavailable.', pitSeeds: '{pit}: {count} seeds', acceptInviteError: 'Could not accept the invitation: {error}', sendInviteError: 'Could not send the invitation: {error}', resetError: 'Could not reset the board: {error}', refreshBanksError: 'Could not refresh the Uril tables: {error}', supabaseRequired: 'Online Uril tables require the Supabase configuration included in the package.', createBankError: 'Error creating the Uril table: {error}', enterBankError: 'Could not enter the Uril table: {error}', syncBankError: 'Error synchronising the Uril table: {error}', moveRejected: 'The move was not accepted.', aiTimeout: 'Move analysis exceeded the expected time.', aiFailed: 'The artificial intelligence failed.', aiStartFailed: 'Could not start the artificial intelligence.', computerError: 'Computer error: {error}', chatError: 'Chat: {error}', languageName: 'English',
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
