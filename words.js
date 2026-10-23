/**
 * words.js — word banks.
 * TARGETS: common answers (also the solver's candidate pool).
 * EXTRA_GUESSES: additional accepted guesses that are never answers.
 * To extend: append words to either array; invalid entries are filtered out.
 */
(function (global) {
  const TARGETS = `
    about actor admit after agree alarm alert alive alone alter angel angle apart apply
    argue array asset avoid aware basic beard being bench black blame blast blend blind
    blood board bonus booth brake bread brick brief broad brush bunch buyer cable carry
    cause chair charm cheap cheek chess chief chill civil class clear click climb close
    cloud coast couch count cover craft crash cream crisp crowd cruel curve daily death
    depth doubt draft dream drift drive early eight elite enemy enter error every exist
    faint faith fancy feast fever field fifty final flame fleet float floor focus forge
    frame fresh fruit ghost given globe grace grain grant graph great greet group guess
    guide happy heart hello honor hotel human ideal imply inner irony ivory joint juice
    knock label large later layer lemon light local loose lucky magic maple match mayor
    mercy metal minor money moral mount mouth music never night noise novel ocean olive
    opera order outer paint paper pasta pause pearl phone piano pilot pizza plain plant
    point pound press pride print proof queen quiet radio range ratio react realm refer
    reply ridge rigid robot round royal salad scale scope sense seven shake shape sharp
    shelf shift shirt shoot shout silly sixth sleep slide smart smoke solid sorry south
    spare speed spice sport stage stamp stare state steel stock store story study sugar
    sunny sweet sword taste thank theme thick think those throw tiger tired today tooth
    total tough track trail treat trial trick truly truth uncle union until upset usage
    valid video visit vivid waste water wheel which white whose woman worry would wrong
    young zebra
  `.split(/\s+/);

  const EXTRA_GUESSES = `aback abate abide adore agile aloft amber ample anvil aroma attic bacon badge baker basil blaze bliss bluff bolts brisk cargo cedar chaos cider cobra comet coral crisp dandy decoy delta diner dodge dwarf eagle ember epoch fable feral flair flint fjord gamer gecko glide gloom grove gypsy haven hobby hyena igloo inbox jolly kayak khaki lilac llama lunar mango mocha nacho nylon onset oxide pecan plumb quirk raven rhyme salsa tulip umbra vigor waltz xenon yacht zesty`.split(/\s+/);

  const clean = (list) => [...new Set(list.map((w) => w.toLowerCase()).filter((w) => /^[a-z]{5}$/.test(w)))];
  const targets = clean(TARGETS);
  const valid = new Set([...targets, ...clean(EXTRA_GUESSES)]);

  global.WORDS = { targets, valid };
})(window);
