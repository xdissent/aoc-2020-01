const fs = require("fs");
const path = require("path");

const INPUT_PATH = path.resolve(__dirname, "input.txt");

async function readInput() {
  return (await fs.promises.readFile(INPUT_PATH, "utf8"))
    .split(/\s+/)
    .filter(Boolean)
    .map((i) => parseInt(i, 10));
}

// Generates all unique input array value combinations of size n.
function* comboGenerator(input, n, start = 0, remaining = n, combo = []) {
  if (remaining === 0) {
    yield [...combo];
  } else {
    for (let i = start; i <= input.length - remaining; i++) {
      combo[n - remaining] = input[i];
      yield* comboGenerator(input, n, i + 1, remaining - 1, combo);
    }
  }
}

// Passes input array combinations of size n - 1 to the matcher and returns the
// first combination for which the matcher return value exists in the input.
function findMatchingPartialCombo(input, n, matcher) {
  const set = new Set(input);
  for (const combo of comboGenerator(input, n - 1)) {
    const match = matcher(combo);
    if (set.has(match)) return [...combo, match];
  }
}

// Calculates the product of the first input array combination of size n whose
// sum equals matchSum.
function findProductOfMatchingSummedCombo(input, n, matchSum) {
  const matcher = (combo) => matchSum - combo.reduce((s, e) => s + e, 0);
  const combo = findMatchingPartialCombo(input, n, matcher);
  if (!combo) throw new Error("Matching combo not found");
  return combo.reduce((p, e) => p * e, 1);
}

// Advent of Code 2020 Day 01 Part 1 Solution
function part1(input) {
  return findProductOfMatchingSummedCombo(input, 2, 2020);
}

// Advent of Code 2020 Day 01 Part 2 Solution
function part2(input) {
  return findProductOfMatchingSummedCombo(input, 3, 2020);
}

exports.main = async function main() {
  const input = await readInput();
  console.log(await part1(input));
  console.log(await part2(input));
};

if (require.main === module) {
  exports.main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
