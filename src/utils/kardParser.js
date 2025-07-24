export function parseKardScript(script) {
  const cards = [];

  const flashRegex = /flash\s*\(\s*\{\s*([\s\S]*?)\s*\}\s*\)/g;
  let match;

  while ((match = flashRegex.exec(script))) {
    const propsBlock = match[1];
    const card = {};

    const propRegex =
      /(\w+)\s*:\s*(?:(`([\s\S]*?)`)|"((?:[^"\\]|\\.)*)")|(\w+)\s*:\s*([0-9.]+)/g;
    let propMatch;

    while ((propMatch = propRegex.exec(propsBlock))) {
      let key, value;

      if (propMatch[1]) {
        // It's a string or backtick
        key = propMatch[1];
        const rawString = propMatch[3] || propMatch[4];
        value = rawString
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
          .join("\n");
      } else if (propMatch[5]) {
        // It's a number
        key = propMatch[5];
        value = Number(propMatch[6]);
      }

      if (key !== undefined) {
        card[key] = value;
      }
    }

    if (card.front && card.back) {
      cards.push(card);
    }
  }

  return cards;
}
