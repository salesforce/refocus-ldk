/**
 * Copyright (c) 2016, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

'use strict';
const d3r = require('d3-random');
const d3a = require('d3-array');

const lorem = [
  'Lorem ipsum dolor sit amet, in eos dolor essent, ea esse ridens efficiantur eam. Ne choro salutatus disputando mei. Ei virtute eruditi duo? Euismod maiestatis ex eum! Vel id elitr prodesset, an eos mazim labores admodum.',
  'Incorrupte neglegentur mel ei, vim errem liberavisse ex, usu ex enim veri menandri! Est nihil deterruisset ne. Alia illud volutpat eam no, mei cu graeci molestie. Sea at verear meliore, pro legere graeci ea, singulis accusata no pri?',
  'At sale dicunt signiferumque mea. Mei porro noster splendide et, et eam dolorum debitis. Ne recteque moderatius duo, iuvaret nonumes vocibus et nam, legimus percipitur sit no. An usu expetenda instructior, error utinam aperiam et per. Natum expetenda maluisset sit te, sumo accusamus iracundia et vix.',
  'Expetenda constituto nec et, vix affert fabellas scripserit ad? Mea alienum oportere ex, sea ea saepe vocibus praesent, adhuc velit verterem cum te. Salutatus corrumpit repudiare pro ex. Cu hinc concludaturque cum, nec ea primis omnesque? At errem fabulas ius! Oportere maiestatis repudiandae eam ea.',
  'Vim te populo veritus adversarium, his habemus gubergren pertinacia et? Quo suas novum corrumpit et, partiendo conceptam an pri, laoreet neglegentur an sit? Vivendum vituperatoribus ut per. Eu nec sonet lobortis facilisis, pro ignota numquam ad. Nominati periculis ut nec, movet mundi usu te, nec meis exerci ut. Vis alia ipsum hendrerit ea.',
  'Mel blandit mandamus sadipscing ea! Dicam labores vel ei, eam fuisset voluptatibus ea! Eam meis saepe posidonium ad, falli postea eum ex? Pri te labores probatus, vel ad etiam falli laudem, ex autem modus detraxit ius! Per esse malis debet ea, ei eum epicurei efficiendi!',
  'Eam ut quot latine vidisse. His et utinam tincidunt signiferumque, ad inciderint persequeris has, ius habeo idque constituam ea. Cu natum omnes cum. Mea ferri minim ex. Mel erat dicta inciderint in, cu tota primis pri? Nam in putent tamquam voluptatum, omnium sanctus evertitur te vix.',
  'Sit ne omnes volumus vituperatoribus! Sed ignota debitis eligendi ad. Per eu adhuc verear. Et malis consequuntur has, has sale dicat veniam te, nominati abhorreant usu ut. Cum unum postulant id, et purto virtute fuisset est. Vix laudem mandamus ex. Ius ea veri aperiri, impedit constituam omittantur eum ne!',
  'Illud aeterno probatus mea no, clita persequeris delicatissimi et sea! Has tale minimum eloquentiam ex, munere dignissim intellegat eu nam! Nullam minimum luptatum ne usu, quo at partem similique pertinacia? Ius doctus discere accumsan no, duo natum imperdiet deterruisset eu. Labore expetenda omittantur ut mea, et ius sumo nobis deserunt.',
  'Ei vituperata deterruisset his. Nec aperiri propriae ei, euismod appetere corrumpit vis te? Quo agam affert utinam ex. Id quo malis iriure?',
  'Natum nemore fabulas ne eos, cu sed propriae probatus complectitur! Cum altera probatus patrioque ne. An tota probo altera nam. Modo clita at eos! Cu justo dicam per, eos prompta propriae offendit no. Sit an solum mandamus?',
  'Vis id timeam civibus gloriatur, vidisse sadipscing duo id. Etiam impedit eu mei, nam te viderer sadipscing. Sed id copiosae percipit? Fugit definiebas vix at, ex usu movet putant temporibus, vis velit molestiae et. Modo impedit id sed, ludus iisque feugait duo et. Illud aperiam oportere et has, soleat fabulas imperdiet pro in, sed virtute aliquid ei. Vivendo tacimates sadipscing ne sit, eos no quando detraxit mediocrem, at rebum falli eos?',
  'Et libris similique mei, vim propriae constituto te, ut vel etiam qualisque. Eum error graeci ea. Ex pro homero detraxit, sit ne detraxit qualisque splendide. Eripuit eleifend instructior in vix, ex eum dolorem denique luptatum, sed case tibique ne? Ad sea viderer maluisset interesset.',
  'Option scribentur pro at, mandamus sapientem per eu. Mel dicat saperet inermis in, vidisse tritani recteque ea per. Prompta omittam suavitate sit eu? Possit doctus corrumpit sit et!',
  'Patrioque scribentur at est, et usu illum regione apeirian? Eu nam dolor sadipscing, vix ei alia scaevola. Ad euismod voluptua sit, eros modus vis ei. Movet platonem ad per.',
  'Modo option sed ne, vix an tota luptatum expetenda, an per appetere comprehensam? Quis novum temporibus ei his, quo dico quodsi te. Sed an constituto posidonium, quo et affert aliquip. Nullam civibus no quo, usu alterum sadipscing consectetuer ei, mei te aliquam perpetua. Summo saepe ne ius.',
  'Ea vix nibh salutatus contentiones, quando assentior eam eu, id duis oportere pri. Ad eam mucius efficiendi. Enim mnesarchum ex nam, vel aeterno tacimates vulputate te! Melius oporteat tincidunt sit cu. Vitae doctus labitur ne sea, ei suas oratio commodo mei.',
  'Nam ea harum rationibus, viris invidunt facilisi nec at! Tamquam eruditi insolens an his, ad vix magna saepe tacimates, prima quando aliquip an cum. Per ne inermis feugait, in tritani viderer atomorum vis, ad fabellas detraxit sed. Tale ipsum ut pri, summo atomorum repudiandae at eos, usu homero interesset adversarium ea. Omnes vocibus cum ad, pri nemore integre ullamcorper cu, has in alia tempor perfecto. Qui choro discere splendide ut? Usu utroque dolorem urbanitas ad, nostrud luptatum id nam.',
  'Pri audire viderer elaboraret te! Omnis prima mollis sit ne. Ex per case fabulas deseruisse, an saepe docendi eos, et has clita omittam. Tollit option mediocritatem per an, ad quod moderatius mei, repudiare dissentias pri cu. Qui nihil epicuri appellantur et, no equidem forensibus est.',
  'Inani molestie vim et, sed in sonet option fierent. Has id habemus definiebas, sumo putant debitis id duo? Ex dicat zril altera has, est omnium recusabo persequeris ea. Cu sint libris volumus vel. Odio rationibus voluptatibus an eos, mel melius scripta at. Nec laoreet ocurreret instructior ex, ex pri dolor possit.',
]; // lorem

const statuses = ['Critical', 'Warning', 'Info', 'OK', 'Timeout', 'Invalid'];

const wordlist = [
  'abidingly', 'acapnia', 'accorder', 'accra', 'acerbate', 'acescency',
  'acidy', 'adena', 'adenoidal', 'adfreeze', 'admission', 'advise', 'aeon',
  'aeriferous', 'aerodonetic', 'aerophone', 'afghani', 'agave', 'aglycone',
  'aigret', 'aim', 'aircraft', 'airlight', 'alack', 'albedo', 'alclad',
  'alienable', 'allogenic', 'allured', 'almous', 'alternating', 'amati',
  'ameiotic', 'amin', 'amis', 'ammophilous', 'amphictyon', 'amtrack',
  'analogously', 'analyzable', 'anarchism', 'anastigmat', 'androgamone',
  'anemone', 'animalculum', 'anisomerous', 'anorectous', 'anyone', 'aortal',
  'apices', 'aplanospore', 'aportlast', 'appendicle', 'appertain', 'apposite',
  'approvedly', 'arab', 'arcangelo', 'armary', 'arrogant', 'arrowless',
  'arthrectomy', 'ashburn', 'ashikaga', 'asir', 'assidean', 'assuaged',
  'astatically', 'aswampish', 'ating', 'atm', 'atry', 'attend', 'aural',
  'autoicous', 'averagely', 'avestan', 'awing', 'awninged', 'azaa',
  'aznavour', 'baalshem', 'backcomb', 'backfield', 'backgammon', 'backing',
  'backs', 'bagios', 'baptism', 'barelegged', 'baresthesia', 'barrow', 'barth',
  'bartley', 'bassetts', 'bath', 'baton', 'beal', 'beatable', 'beatty',
  'beautifier', 'bebryces', 'becker', 'beclasp', 'becripple', 'begrudge',
  'bely', 'bendel', 'benvenuto', 'beryl', 'bestiaries', 'bias', 'bichat',
  'billycan', 'biota', 'biotype', 'bipack', 'bipartitely', 'bipyramid',
  'birdied', 'bjneborg', 'blackballer', 'blackstone', 'blameful', 'blindfish',
  'blottingly', 'bluepoint', 'bondage', 'bookkeeper', 'boots', 'boreas',
  'borty', 'boyne', 'bradbury', 'brazilite', 'bregma', 'breloque', 'brendel',
  'brinishness', 'brisance', 'broughtas', 'bulleted', 'bullfrog', 'bung',
  'burghley', 'butcheries', 'butes', 'calfskin', 'canaletto', 'canalize',
  'canara', 'candie', 'canorously', 'capability', 'capt', 'carbonic',
  'carburettor', 'cardiology', 'carnify', 'carrol', 'cartist', 'cascading',
  'castelli', 'casus', 'caudal', 'cellularly', 'champers', 'chancel',
  'chanciest', 'chaprasi', 'chasidism', 'cheatable', 'chempaduk', 'child',
  'chinaberry', 'chloette', 'cincinnati', 'cinereous', 'citruses', 'claremont',
  'cleodaeus', 'clericalism', 'cletus', 'clink', 'cloque', 'coadunate',
  'cochin', 'coded', 'coelomate', 'colluding', 'colonel', 'compigne',
  'composition', 'confusional', 'consolute', 'containable', 'contumacity',
  'convexity', 'coparcener', 'copernicus', 'cornstalk', 'corruptedly', 'corti',
  'cortisol', 'cosimo', 'cotype', 'cowage', 'craftiest', 'crewel', 'criolla',
  'crowded', 'crumply', 'cruzeiros', 'cryptically', 'crystaling', 'cubbish',
  'culpa', 'culver', 'curityba', 'currier', 'curtilage', 'cute', 'czaristic',
  'damara', 'dancette', 'dcollet', 'dealership', 'decadrachm', 'decembrist',
  'deciduitis', 'declaratory', 'declared', 'defeminize', 'deletion',
  'demivierge', 'denarii', 'dens', 'deprecate', 'deutschland', 'devilwood',
  'dextrose', 'dialogize', 'diane', 'diatom', 'didrikson', 'dies', 'digresser',
  'discalced', 'distensile', 'diyarbekir', 'djellabah', 'dobbin', 'doggone',
  'dogmatizer', 'doha', 'domenick', 'dominium', 'doubtlessly', 'douppioni',
  'dowie', 'dowiness', 'downing', 'drawknife', 'drench', 'driveler', 'driving',
  'droving', 'dukhobors', 'duodena', 'durzi', 'dysphemia', 'dyspnoic',
  'earthiest', 'ecthymatous', 'edaphon', 'effacer', 'effective', 'effects',
  'effusively', 'egoism', 'egregiously', 'elastoplast', 'elegiacal', 'elman',
  'embarred', 'endoenzyme', 'endogenesis', 'endoplasmic', 'engorged', 'ennui',
  'epineuria', 'epitome', 'equalising', 'equipping', 'erebus', 'escribing',
  'estivated', 'estremadura', 'estuarine', 'ethane', 'ethos', 'etzel',
  'eviction', 'excitedness', 'excusively', 'execute', 'exogenously',
  'exorbitance', 'exordial', 'explicator', 'extenuatory', 'extinguish',
  'eyass', 'fad', 'fadge', 'falcon', 'falterer', 'farcical', 'fatimite',
  'femininity', 'fenagler', 'fiddlededee', 'filamented', 'fils', 'finesse',
  'fitment', 'fivepenny', 'flaw', 'fogless', 'forasmuch', 'forcipate',
  'formaliser', 'foxed', 'freeborn', 'freyr', 'fromentin', 'fuckwit',
  'furfuran', 'furtiveness', 'galet', 'galloglass', 'gannister', 'gastrotrich',
  'gaugeable', 'gehenna', 'genre', 'genteelness', 'gentlefolks', 'germfree',
  'germfree', 'ghazzah', 'ghebre', 'gina', 'gipseian', 'glossmeter',
  'glycocoll', 'gonfalon', 'graverobber', 'gresham', 'grewsome', 'greynville',
  'griege', 'griffinhood', 'groggery', 'grubstaker', 'gruenberg', 'grumphy',
  'guarantying', 'guesthouses', 'gunmanship', 'gunned', 'halite', 'hallel',
  'hamperedly', 'handsomeish', 'harridan', 'hasselt', 'haustorial',
  'heathiest', 'heliography', 'hellbent', 'heller', 'herborize', 'heritable',
  'hermiston', 'hesitating', 'hetairai', 'hetmanate', 'hexaplaric', 'hexapod',
  'hexose', 'hitherward', 'hogan', 'holophyte', 'hopper', 'hoquiam',
  'horrified', 'horseplayer', 'hostship', 'hotter', 'hovelling', 'hsian',
  'hullaballoo', 'humpiest', 'hunger', 'hunlike', 'hypersomnia', 'hypertragic',
  'icecap', 'ichthyornis', 'ideologise', 'idoism', 'idolatrise', 'illumed',
  'ilmen', 'imbedding', 'imbuement', 'impecunious', 'impudence', 'inapt',
  'incomplete', 'indienne', 'indirect', 'inedible', 'ineffably', 'inevasible',
  'infraction', 'infrangibly', 'ingot', 'ingrowth', 'innovator', 'instigate',
  'insulator', 'intercreate', 'intermittor', 'intervaried', 'intonation',
  'intrinsic', 'iodin', 'islandlike', 'islandlike', 'isograph', 'isokeraunic',
  'isometrical', 'issachar', 'istana', 'jacopo', 'jacquemart', 'janitorial',
  'jazzman', 'jean', 'jehovist', 'jejunity', 'jeris', 'jet', 'joab',
  'joyousness', 'jurisp', 'kadi', 'kafiristan', 'kantar', 'karlstad', 'keeno',
  'kemp', 'keyway', 'kibosh', 'kildare', 'kilmarnock', 'kilovolt', 'kimonoed',
  'kirkenes', 'knckebrd', 'knucklebone', 'kokobeh', 'kozlov', 'kurbash',
  'laburnum', 'lagerkvist', 'lair', 'laminated', 'landslip', 'lanett',
  'language', 'languor', 'lanuginose', 'lapwing', 'lat', 'lathe', 'lawbook',
  'leachable', 'leadville', 'lecturer', 'legwork', 'lehighton', 'libra',
  'libretto', 'lichenism', 'lightwood', 'limens', 'litho', 'litholapaxy',
  'litter', 'locrus', 'logogriph', 'lohrmann', 'lonesome', 'looie', 'lordotic',
  'loveably', 'lovelock', 'lucania', 'luke', 'lyncher', 'magellan',
  'magnified', 'malraux', 'maltreat', 'manicotti', 'manutius', 'manway',
  'margaritic', 'marmax', 'married', 'maryanne', 'materialize', 'matureness',
  'mccormick', 'measly', 'med', 'medallic', 'megalopsia', 'megger',
  'melanochroi', 'melioration', 'melodrama', 'menyie', 'meow', 'mercurius',
  'meridianii', 'messene', 'metamere', 'mexico', 'mignon', 'military',
  'milkmaid', 'milliard', 'millimole', 'milliohm', 'minhow', 'miracidia',
  'miraflores', 'misthrow', 'mobbist', 'monadically', 'monkfish',
  'monochasium', 'monochrome', 'mononuclear', 'monotron', 'monseigneur',
  'monument', 'morphologic', 'mot', 'msl', 'mullocky', 'musagetes', 'museful',
  'mythopoeist', 'nanism', 'nanterre', 'narrated', 'net', 'neumster',
  'neurocoel', 'neuter', 'nguni', 'nibs', 'nicolaus', 'nig', 'noisiness',
  'nondeported', 'nonoverhead', 'nonpause', 'nonpersonal', 'nonpremium',
  'nonrelease', 'nonsalutary', 'nonselected', 'nord', 'nubbly', 'num',
  'numerously', 'nummulite', 'nurl', 'nymphaeum', 'nymphean', 'obafemi',
  'octonaries', 'odovacar', 'oil', 'okinesis', 'oliguria', 'onion', 'ontario',
  'oont', 'orbit', 'organized', 'organizer', 'orogenic', 'orphan', 'oscar',
  'outbragging', 'outgrown', 'outrapped', 'outscorn', 'outsumming', 'outworn',
  'overbuying', 'overelegant', 'overgrowth', 'overhappy', 'overinvolve',
  'overlaid', 'overproved', 'ovular', 'oxydation', 'oyes', 'pact',
  'palladizing', 'pally', 'panfrying', 'pannier', 'pannonia', 'pantelleria',
  'paperbound', 'parapodial', 'pastoralism', 'patriarchal', 'pause', 'pav',
  'peacockism', 'pearlite', 'pekin', 'pennaceous', 'pentagon', 'peopleless',
  'pericycle', 'peritrichic', 'peshawar', 'peskiest', 'pest', 'petiolate',
  'petition', 'petrifiable', 'phenylene', 'phonotypist', 'phosphorate',
  'photofit', 'phthia', 'pian', 'pianist', 'pica', 'pick', 'pilsner',
  'pinguidity', 'planetary', 'plasmodesma', 'plummy', 'pocky', 'poof',
  'porthole', 'postillion', 'posturising', 'powdove', 'praesepe', 'preamble',
  'precensure', 'preclothing', 'preendorser', 'prehnite', 'preimpress',
  'preliberate', 'premenaced', 'premonition', 'prenoting', 'prepublish',
  'prepurchase', 'prerefining', 'prerequire', 'pretaught', 'preventoria',
  'previsit', 'prim', 'proboxing', 'prohibiter', 'propacifism', 'proprietor',
  'prose', 'proteolytic', 'protrude', 'pteridology', 'purdah', 'puritanism',
  'pushto', 'putrescible', 'pyometra', 'pythoness', 'quaffer', 'quantitive',
  'questioning', 'quinoxalin', 'qungur', 'quorum', 'racemize', 'radioed',
  'radiologic', 'ragtag', 'ramanujan', 'ramous', 'rancher', 'rasing', 'ratio',
  'reagitating', 'reckoner', 'reclimbing', 'recognitive', 'recoin',
  'reconciler', 'recondense', 'redebated', 'redirect', 'reemerging',
  'reencounter', 'reenjoin', 'reformedly', 'refutably', 'regina', 'reignited',
  'reindorsed', 'reinstitute', 'reliantly', 'remissively', 'remix', 'remolade',
  'reparative', 'replotting', 'reproval', 'researchist', 'reseda', 'resoak',
  'responsory', 'restore', 'restorer', 'resumed', 'reswept', 'retwine',
  'revealedly', 'revetoed', 'revoyaging', 'rewax', 'rhd', 'ride', 'rightness',
  'rightwards', 'rode', 'romany', 'rompers', 'roscommon', 'roundabout', 'rpm',
  'rutting', 'sagamore', 'sagger', 'sailoring', 'salade', 'salvator',
  'sawhorse', 'scarlatina', 'scattered', 'scheiner', 'scholarship',
  'scholiast', 'scioto', 'scofflaw', 'scrabbler', 'sedile', 'seductive',
  'seedier', 'selfishness', 'semidefined', 'seminary', 'setting', 'setulose',
  'shabbiness', 'shahdom', 'sharpfroze', 'sharpfroze', 'sheepdog', 'sheerness',
  'shenandoah', 'shinily', 'shintoistic', 'sialagogue', 'sialoid', 'simba',
  'simplified', 'sixthly', 'skidway', 'skylined', 'slimmest', 'smithsonite',
  'smoke', 'smokiest', 'snarler', 'snootiness', 'solemnness', 'solidified',
  'somebody', 'sonnetising', 'sorcerer', 'soter', 'southwest', 'spatchcock',
  'sphagnum', 'sphincter', 'spiegel', 'spiflicated', 'spillikin', 'sporocarp',
  'squarishly', 'squarrose', 'squeegeed', 'squeegeeing', 'squishier', 'stab',
  'stabilizing', 'statical', 'staving', 'steger', 'stetted', 'stodge',
  'stoniest', 'strasberg', 'stressfully', 'striges', 'strive', 'struma',
  'stumble', 'stunt', 'subacromial', 'subdermal', 'subflora', 'subform',
  'subglottic', 'subhatchery', 'submaid', 'subsect', 'subside', 'suctoria',
  'suggestibly', 'sunset', 'supercredit', 'suppuration', 'sur', 'surge',
  'suspicious', 'swale', 'sward', 'swinge', 'syllabaries', 'syntactic',
  'tabby', 'tabulation', 'tact', 'tahopped', 'tailored', 'tannish', 'tarentum',
  'tartarizing', 'tasty', 'telega', 'teleostean', 'tenfold', 'thegnly', 'then',
  'theurgical', 'thia', 'threadless', 'tibur', 'toilsomely', 'toledo',
  'tonality', 'totalling', 'touchmark', 'toughie', 'towardly', 'traceless',
  'trailboard', 'tranship', 'traveled', 'traveling', 'travestied', 'trenton',
  'trouvre', 'tsaritsyn', 'tularaemic', 'tundish', 'tungusic', 'tupelo',
  'turanian', 'turbanless', 'turnoff', 'turquois', 'tutsan', 'tweed', 'tzar',
  'ulema', 'uller', 'unaccusing', 'unawkward', 'unbendable', 'unbigamous',
  'unbrutize', 'unbumped', 'unchancy', 'uncherished', 'under', 'undergirth',
  'underlie', 'underpeep', 'understress', 'undervoice', 'unexponible',
  'unfired', 'unfoliaged', 'unforward', 'unfrilly', 'unhanged', 'unimitated',
  'unintruded', 'unknit', 'unlaughing', 'unloose', 'unmammalian',
  'unmandatory', 'unmelodious', 'unopulent', 'unpeaceable', 'unprovided',
  'unreceptive', 'unreckoned', 'unsignalled', 'unsmoked', 'unsnaky',
  'unstatistic', 'unstep', 'unstitching', 'unstriving', 'untaloned',
  'unurging', 'unvented', 'unvivified', 'utterness', 'varactor', 'vatic',
  'velleity', 'velodrome', 'veritably', 'vexilla', 'victrices', 'victualling',
  'vide', 'viewiest', 'virulently', 'visualizing', 'vitamin', 'vitamine',
  'viticulture', 'vocalist', 'volatilizer', 'volumetric', 'waaf',
  'waspishness', 'weighting', 'whistly', 'whitening', 'wilderness', 'windaus',
  'womb', 'wordsmith', 'wrapround', 'wreckfishes', 'yarest', 'yaupon', 'yeysk',
  'zernike', 'zidkijah', 'zincified', 'zoisite', 'zone', 'zoomorphism',
  'zootomy',
]; // wordlist

module.exports = class Random {

  static copyObject(obj) {
    return JSON.parse(JSON.stringify(obj));
  } // copyObject

  static intBetween(min, max) {
    return Math.round(d3r.randomUniform(min, max)());
  } // intBetween

  /**
   * Returns some "Lorem ipsum..." text (random number of sentences).
   */
  static messageBody() {
    const n = d3a.min([8, this.intBetween(1, lorem.length)]);
    return lorem.slice(0, n).join(' ');
  } // messageBody

  /**
   * Returns a random string of 0 to 5 alphanumeric characters.
   */
  static messageCode() {
    return this.word().substring(0, 5);
  } // messageCode

  /**
   * Random-ish... but with a boost to "OK" status.
   */
  static status() {
    return statuses[this.intBetween(0, statuses.length + 3)] || 'OK';
  } // status

  /**
   * Updates the specified sample:
   *  - messageBody (a "Lorem ipsum..." string)
   *  - messageCode (random string from 0 to 5 characters in length)
   *  - status (random status, not tied to value)
   *  - statusChangedAt (timestamp, only updated if the new status is different
   *    from the previous status)
   *  - updatedAt (timestamp)
   *  - value (random number, not tied to status even though it is in real
   *    life)
   */
  static updateSample(sample) {
    const s = this.copyObject(sample);
    s.messageBody = this.messageBody();
    s.messageCode = this.messageCode();
    s.previousStatus = s.status;
    s.status = this.status();
    s.updatedAt = new Date().toJSON();
    s.value = this.value();
    if (s.previousStatus !== s.status) {
      s.statusChangedAt = s.updatedAt;
    }
    return s;
  } // updateSample

  static addSample(subject) {
    const now = new Date().toJSON();
    const aspectName = this.word();
    return {
      aspect: { name: aspectName },
      messageBody: this.messageBody(),
      messageCode: this.messageCode(),
      name: subject.absolutePath + '|' + aspectName,
      status: this.status(),
      statusChangedAt: now,
      subjectId: subject.id,
      updatedAt: now,
      value: this.value(),
    };
  } // addSample

  /**
   * For now, just update description and updatedAt.
   */
  static updateSubject(subject) {
    const s = this.copyObject(subject);
    s.description = s.description + ' [UPDATED]';
    s.updatedAt = new Date().toJSON();
    return s;
  } // updateSubject

  static addSubject(parentAbsolutePath) {
    const now = new Date().toJSON();
    const name = this.word();
    const s = {
      absolutePath: `${parentAbsolutePath}.${name}`,
      description: this.messageBody(),
      helpEmail: `${name}@foo.com`,
      helpUrl: `http://${name}.foo.com`,
      name,
      updatedAt: now,
    };
    return s;
  } // addSubject

  static value() {
    return this.intBetween(0, 100000);
  } //value

  static word() {
    return wordlist[this.intBetween(0, wordlist.length - 1)] || '';
  } // word

}; // module.exports

