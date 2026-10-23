/**
 * solver.js — pure, DOM-free solver (Shannon-entropy guess ranking).
 * Feedback codes: 0 = absent (gray), 1 = present (yellow), 2 = correct (green).
 * A 5-tile pattern is packed into one base-3 integer in [0, 242].
 */
(function (global) {
  /** Score a guess against an answer. Returns an array of five codes. */
  function score(guess, answer) {
    const res = [0, 0, 0, 0, 0];
    const left = {}; // unmatched answer letters and their remaining counts
    for (let i = 0; i < 5; i++) {
      if (guess[i] === answer[i]) res[i] = 2;          // pass 1: greens
      else left[answer[i]] = (left[answer[i]] || 0) + 1;
    }
    for (let i = 0; i < 5; i++) {                      // pass 2: yellows, capped by remaining count
      if (res[i] === 0 && left[guess[i]] > 0) { res[i] = 1; left[guess[i]]--; }
    }                                                  // everything else stays 0 (gray)
    return res;
  }

  /** Pack an array of codes into a base-3 integer. */
  const encode = (p) => p.reduce((n, d) => n * 3 + d, 0);

  /** Keep only candidates that would have produced the observed pattern. */
  function filterCandidates(candidates, guess, pattern) {
    const code = encode(pattern);
    return candidates.filter((w) => encode(score(guess, w)) === code);
  }

  /**
   * Expected information (bits) of `guess` over the candidate pool:
   * E[I] = -sum_p P(p) * log2 P(p), with P(p) = (# candidates giving p) / N.
   */
  function entropy(guess, candidates) {
    const buckets = new Array(243).fill(0);
    for (const w of candidates) buckets[encode(score(guess, w))]++;
    const n = candidates.length;
    let bits = 0;
    for (const c of buckets) if (c) bits -= (c / n) * Math.log2(c / n);
    return bits;
  }

  /** Rank candidates by entropy; ties prefer words that could be the answer (always true here). */
  function rank(candidates, topN = 3) {
    return candidates
      .map((word) => ({ word, bits: entropy(word, candidates) }))
      .sort((a, b) => b.bits - a.bits || (a.word < b.word ? -1 : 1))
      .slice(0, topN);
  }

  global.Solver = { score, encode, filterCandidates, entropy, rank };
})(window);
