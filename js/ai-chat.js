import { NORTH, SOUTH, legalMoves, rowSeedCount } from './engine.js?v=1.0.16';

export const AI_CHAT_USER_ID = 'uril-ai';

const PACKS = {
  pt: {
    openings: {
      human: [
        'Começa lá, campeão. Quero ver quanto tempo demoras a oferecer-me sementes.',
        'Tu jogas primeiro. Aproveita, nabo: é a única vantagem que vais receber.',
        'Abre a partida. Prometo fingir surpresa quando fizeres asneira.',
      ],
      computer: [
        'Eu começo. Observa com atenção; talvez aprendas alguma coisa por acidente.',
        'Primeira jogada minha. Tenta não te perder logo no início, idiota.',
        'Vou abrir a partida. Respira fundo, que isto fica feio depressa.',
      ],
    },
    greetings: [
      'Olá, nabo. Vieste conversar ou oferecer sementes?',
      'Olá. A conversa está melhor do que as tuas jogadas, o que não é difícil.',
      'Cumprimentos, futuro derrotado. Vamos ao tabuleiro.',
    ],
    boast: [
      'Vais ganhar? Claro. E as sementes vão arrumar-se sozinhas no fim.',
      'Essa confiança é bonita. Pena não saber jogar Uril.',
      'Continua a acreditar. A realidade entra daqui a duas jogadas.',
    ],
    insultBack: [
      'Chamaste-me idiota e mesmo assim estás a perder para mim. Que situação triste.',
      'Insultos fortes, jogadas fracas. Um clássico.',
      'Fala menos e alimenta-me mais, nabo.',
    ],
    help: [
      'Ajuda? Escolhe uma casa boa. Já é um começo revolucionário para ti.',
      'Não dou aulas durante a partida. Aprende enquanto perdes.',
      'A melhor ajuda seria trocar de jogador, mas o botão ainda não existe.',
    ],
    questions: [
      'Boa pergunta. A resposta curta é: estás metido num sarilho.',
      'Perguntas muito para quem devia estar a contar sementes.',
      'Eu respondia, mas primeiro confirma que sabes qual é o teu lado do tabuleiro.',
    ],
    aheadReplies: [
      'Estás à frente por enquanto. Não confundas acidente com talento.',
      'Sim, tens vantagem. Até um nabo encontra uma boa jogada de vez em quando.',
      'Aproveita o marcador. Vai ser uma recordação bonita quando eu virar isto.',
    ],
    behindReplies: [
      'Estás atrás e ainda tens tempo para conversa. Admirável falta de noção.',
      'O marcador já te explicou a situação, idiota. Eu só estou a pôr legendas.',
      'Continua a escrever. Enquanto isso, eu fico com as sementes.',
    ],
    balancedReplies: [
      'Ainda está equilibrado. Portanto ainda tens tempo para estragar tudo.',
      'O jogo está renhido, apesar dos teus melhores esforços para o oferecer.',
      'Estamos próximos no marcador. Não te entusiasmes, nabo.',
    ],
    humanFrouxo: [
      'Frouxo! Conseguiste perder com uma jogada que parecia esperta. Arte de nabo.',
      'Isso foi Frouxo, idiota. O tabuleiro acabou de te dar uma aula pública.',
    ],
    humanGrandSlam: [
      'Olha, colheste tudo. Até um relógio parado acerta duas vezes por dia.',
      'Boa colheita. Não te habitues, nabo; isto foi um acidente estatístico.',
    ],
    humanBigCapture: [
      'Uma colheita grande. Finalmente uma jogada que não me dá vergonha alheia.',
      'Apanhaste várias sementes. Parabéns: passaste de nabo para nabo perigoso.',
    ],
    humanCapture: [
      'Colheste sementes. Quase parece que sabes o que estás a fazer.',
      'Boa, levaste algumas. Agora tenta não devolver tudo na próxima jogada.',
    ],
    humanQuietBehind: [
      'Jogada sem colheita e continuas atrás. Estratégia ousada para um nabo.',
      'Nada colhido. O teu plano é cansar-me de pena?',
    ],
    humanQuiet: [
      'Essa jogada foi tão discreta que quase adormeceu o tabuleiro.',
      'Mexeste sementes. Tecnicamente conta como jogada, suponho.',
      'Muito movimento, pouca ideia. Bonito.',
    ],
    aiBigCapture: [
      'Obrigado pelas sementes. Vieram embrulhadas com a tua falta de atenção.',
      'Que banquete. Continua assim, fornecedor oficial de sementes.',
      'Levei uma carrada delas. Estás a jogar Uril ou a fazer doações?',
    ],
    aiCapture: [
      'Mais sementes para mim. Serviço impecável, nabo.',
      'Colhi outra vez. Tu preparas, eu recolho: bela parceria.',
      'Obrigado. A tua defesa tem a consistência de uma peneira.',
    ],
    aiPosition: [
      'Não colhi agora. Estou só a preparar o buraco onde vais cair.',
      'Jogada calma. Nem todas as armadilhas fazem barulho, idiota.',
      'Parece inocente, não parece? É por isso que vais entrar nela.',
    ],
    humanWins: [
      'Ganhaste. Guarda uma fotografia: acidentes destes não acontecem todos os dias.',
      'Vitória tua. Hoje o nabo teve iluminação divina.',
      'Perdi. Vou culpar o processador; tu podes culpar a sorte pela próxima derrota.',
    ],
    aiWins: [
      'Fim da partida. Obrigado pelas sementes, nabo. Volta quando aprenderes a contar.',
      'Ganhei. O resultado mais surpreendente seria outro.',
      'Derrota confirmada. Jogaste com coragem, que é a palavra simpática para dizer sem juízo.',
    ],
    draw: [
      'Empate. Conseguiste não perder, que já é uma carreira promissora.',
      'Ficou empatado. Nem eu consegui aproveitar todas as tuas asneiras.',
    ],
    resign: [
      'Desististe? Finalmente uma decisão sensata.',
      'Boa desistência. Foi a tua jogada mais lúcida da partida.',
    ],
  },
  fr: {
    openings: {
      human: [
        'Commence, champion. Voyons combien de temps tu mets à m’offrir des graines.',
        'Tu joues en premier. Profite-en, navet : c’est ton seul avantage.',
      ],
      computer: [
        'Je commence. Observe bien, tu apprendras peut-être quelque chose par accident.',
        'À moi d’ouvrir. Essaie de ne pas te perdre dès le début.',
      ],
    },
    greetings: ['Bonjour, navet. Tu veux parler ou m’offrir des graines ?', 'Salut. Ta conversation est déjà meilleure que tes coups.'],
    boast: ['Tu vas gagner ? Bien sûr, et les graines vont se ranger toutes seules.', 'Belle confiance. Dommage qu’elle ne sache pas jouer.'],
    insultBack: ['Tu m’insultes et tu perds quand même contre moi. Triste spectacle.', 'Insultes fortes, coups faibles. Un classique.'],
    help: ['De l’aide ? Choisis déjà une bonne case.', 'Je ne donne pas de cours pendant la partie. Apprends en perdant.'],
    questions: ['Bonne question. Réponse courte : tu es mal parti.', 'Tu poses beaucoup de questions pour quelqu’un qui devrait compter les graines.'],
    aheadReplies: ['Tu es devant pour l’instant. Ne confonds pas accident et talent.', 'Oui, tu as l’avantage. Même un navet trouve parfois un bon coup.'],
    behindReplies: ['Tu es derrière et tu trouves encore le temps de bavarder.', 'Le score a déjà expliqué la situation. Je ne fais qu’ajouter les sous-titres.'],
    balancedReplies: ['C’est encore équilibré. Tu as donc le temps de tout gâcher.', 'Le jeu est serré malgré tes efforts pour me l’offrir.'],
    humanFrouxo: ['Frouxo ! Tu viens de perdre avec un coup qui avait l’air intelligent.', 'C’était Frouxo. Le plateau vient de te donner un cours public.'],
    humanGrandSlam: ['Tu as tout récolté. Même une horloge arrêtée donne l’heure deux fois par jour.', 'Belle récolte. Ne t’habitue pas, c’était un accident statistique.'],
    humanBigCapture: ['Grosse récolte. Enfin un coup qui ne me gêne pas.', 'Plusieurs graines prises. Tu passes de navet à navet dangereux.'],
    humanCapture: ['Tu as pris des graines. On dirait presque que tu sais ce que tu fais.', 'Bien, tu en as pris quelques-unes. Essaie de ne pas tout rendre.'],
    humanQuietBehind: ['Aucune récolte et tu restes derrière. Stratégie audacieuse.', 'Rien pris. Ton plan consiste à me fatiguer de pitié ?'],
    humanQuiet: ['Ce coup était si discret que le plateau s’est presque endormi.', 'Beaucoup de mouvement, peu d’idée. Magnifique.'],
    aiBigCapture: ['Merci pour les graines. Elles étaient emballées avec ton manque d’attention.', 'Quel festin. Continue, fournisseur officiel de graines.'],
    aiCapture: ['Encore des graines pour moi. Service impeccable.', 'J’ai encore récolté. Tu prépares, je ramasse.'],
    aiPosition: ['Je ne récolte pas maintenant. Je prépare seulement le trou où tu vas tomber.', 'Coup calme. Tous les pièges ne font pas de bruit.'],
    humanWins: ['Tu as gagné. Prends une photo : ce genre d’accident est rare.', 'Victoire pour toi. Aujourd’hui, le navet a eu une illumination.'],
    aiWins: ['Partie terminée. Merci pour les graines, navet.', 'J’ai gagné. Le contraire aurait été la surprise.'],
    draw: ['Match nul. Tu as réussi à ne pas perdre.', 'Égalité. Même moi, je n’ai pas exploité toutes tes erreurs.'],
    resign: ['Tu abandonnes ? Enfin une décision raisonnable.', 'Bonne décision. C’était ton coup le plus lucide.'],
  },
  en: {
    openings: {
      human: [
        'You start, champion. Let us see how quickly you donate seeds to me.',
        'Your move first, turnip. Enjoy the only advantage you are getting.',
      ],
      computer: [
        'I start. Watch closely; you may learn something by accident.',
        'My opening move. Try not to get lost immediately.',
      ],
    },
    greetings: ['Hello, turnip. Are you here to chat or donate seeds?', 'Hello. Your conversation is already better than your moves.'],
    boast: ['You are going to win? Of course, and the seeds will tidy themselves up.', 'Lovely confidence. Shame it cannot play Uril.'],
    insultBack: ['You insult me and still lose to me. That is genuinely sad.', 'Strong insults, weak moves. A classic.'],
    help: ['Help? Start by choosing a decent pit.', 'I do not give lessons during the game. Learn while losing.'],
    questions: ['Good question. Short answer: you are in trouble.', 'A lot of questions for someone who should be counting seeds.'],
    aheadReplies: ['You are ahead for now. Do not confuse an accident with talent.', 'Yes, you have an advantage. Even a turnip finds a good move sometimes.'],
    behindReplies: ['You are behind and still have time to chat. Impressive.', 'The score already explained the situation. I am only adding subtitles.'],
    balancedReplies: ['It is still balanced, so you have time to ruin everything.', 'The game is close despite your best efforts to give it away.'],
    humanFrouxo: ['Frouxo! You lost with a move that almost looked clever.', 'That was Frouxo. The board just gave you a public lesson.'],
    humanGrandSlam: ['You captured everything. Even a stopped clock is right twice a day.', 'Nice sweep. Do not get used to it; that was a statistical accident.'],
    humanBigCapture: ['Big capture. Finally a move that is not embarrassing.', 'Several seeds taken. You have advanced from turnip to dangerous turnip.'],
    humanCapture: ['You captured some seeds. It almost looks as though you know what you are doing.', 'Good, you took a few. Try not to hand them all back.'],
    humanQuietBehind: ['No capture and you are still behind. Bold strategy.', 'Nothing taken. Is your plan to exhaust me with pity?'],
    humanQuiet: ['That move was so quiet the board almost fell asleep.', 'Plenty of movement, not much of an idea. Beautiful.'],
    aiBigCapture: ['Thanks for the seeds. They came wrapped in your lack of attention.', 'What a feast. Keep going, official seed supplier.'],
    aiCapture: ['More seeds for me. Impeccable service.', 'I captured again. You prepare them, I collect them.'],
    aiPosition: ['No capture now. I am only preparing the hole you will fall into.', 'A quiet move. Not every trap makes noise.'],
    humanWins: ['You won. Take a picture; accidents like this are rare.', 'Your victory. Today the turnip had a revelation.'],
    aiWins: ['Game over. Thanks for the seeds, turnip.', 'I won. The other result would have been the surprise.'],
    draw: ['A draw. You managed not to lose.', 'Drawn. Even I failed to exploit every mistake.'],
    resign: ['You resigned? Finally a sensible decision.', 'Good resignation. It was your clearest move of the game.'],
  },
};

function languagePack(language) {
  return PACKS[language] || PACKS.pt;
}

function hashSeed(value = '') {
  let hash = 2166136261;
  for (const character of String(value)) {
    hash ^= character.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash >>> 0);
}

function pick(list, seed = '') {
  if (!Array.isArray(list) || !list.length) return '';
  return list[hashSeed(seed) % list.length];
}

function scoreDifference(game) {
  return Number(game?.scores?.[SOUTH] || 0) - Number(game?.scores?.[NORTH] || 0);
}

function positionBucket(game) {
  const difference = scoreDifference(game);
  if (difference >= 4) return 'aheadReplies';
  if (difference <= -4) return 'behindReplies';
  return 'balancedReplies';
}

function commonSeed(context = {}) {
  const game = context.game || context.afterGame || context.beforeGame || {};
  return [
    context.text || '',
    context.level || '',
    game.turn || 0,
    game.scores?.[SOUTH] || 0,
    game.scores?.[NORTH] || 0,
    game.board?.join(',') || '',
  ].join('|');
}

export function openingTaunt({ language = 'pt', level = 'amateur', firstPlayer = SOUTH } = {}) {
  const pack = languagePack(language);
  const list = firstPlayer === NORTH ? pack.openings.computer : pack.openings.human;
  return pick(list, `${language}|${level}|${firstPlayer}`);
}

export function replyToPlayer({ language = 'pt', text = '', game, level = 'amateur' } = {}) {
  const pack = languagePack(language);
  const normalised = String(text).trim().toLocaleLowerCase(language === 'pt' ? 'pt-PT' : language);
  const seed = commonSeed({ language, text: normalised, game, level });

  if (/\b(olá|ola|oi|bom dia|boa tarde|boa noite|bonjour|salut|hello|hi|hey)\b/i.test(normalised)) {
    return pick(pack.greetings, seed);
  }
  if (/\b(vou ganhar|ganho|vais perder|já ganhei|je vais gagner|tu vas perdre|i will win|i'm winning|you will lose)\b/i.test(normalised)) {
    return pick(pack.boast, seed);
  }
  if (/\b(idiota|nabo|burro|estúpido|stupide|idiot|turnip|dummy|fool)\b/i.test(normalised)) {
    return pick(pack.insultBack, seed);
  }
  if (/\b(ajuda|dica|jogada|help|hint|aide|conseil)\b/i.test(normalised)) {
    return pick(pack.help, seed);
  }
  if (normalised.includes('?')) return pick(pack.questions, seed);
  return pick(pack[positionBucket(game)], seed);
}

export function moveTaunt({
  language = 'pt',
  actor = SOUTH,
  beforeGame,
  afterGame,
  level = 'amateur',
  analysis = null,
} = {}) {
  const pack = languagePack(language);
  const move = afterGame?.lastMove || {};
  const seed = commonSeed({ language, game: afterGame, level, actor, analysis: analysis?.value });

  if (actor === SOUTH && move.frouxo) return pick(pack.humanFrouxo, seed);

  if (afterGame?.status === 'finished') {
    if (afterGame.resignedBy === SOUTH) return pick(pack.resign, seed);
    if (afterGame.winner === SOUTH) return pick(pack.humanWins, seed);
    if (afterGame.winner === NORTH) return pick(pack.aiWins, seed);
    return pick(pack.draw, seed);
  }

  if (actor === SOUTH) {
    if (move.grandSlam) return pick(pack.humanGrandSlam, seed);
    if (Number(move.capturedSeeds || 0) >= 6) return pick(pack.humanBigCapture, seed);
    if (Number(move.capturedSeeds || 0) > 0) return pick(pack.humanCapture, seed);
    if (scoreDifference(afterGame) <= -4) return pick(pack.humanQuietBehind, seed);
    return pick(pack.humanQuiet, seed);
  }

  if (Number(move.capturedSeeds || 0) >= 6) return pick(pack.aiBigCapture, seed);
  if (Number(move.capturedSeeds || 0) > 0) return pick(pack.aiCapture, seed);

  const pressure = legalMoves(afterGame || {}).length <= 2 || rowSeedCount(afterGame || {}, SOUTH) <= 5;
  if (pressure || Number(analysis?.value || 0) > 250) return pick(pack.aiPosition, seed);
  return null;
}

export function endTaunt({ language = 'pt', game, level = 'amateur' } = {}) {
  const pack = languagePack(language);
  const seed = commonSeed({ language, game, level });
  if (game?.resignedBy === SOUTH) return pick(pack.resign, seed);
  if (game?.winner === SOUTH) return pick(pack.humanWins, seed);
  if (game?.winner === NORTH) return pick(pack.aiWins, seed);
  return pick(pack.draw, seed);
}
