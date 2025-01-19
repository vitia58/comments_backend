type InheritedTypes = 'a' | 'code' | 'i' | 'strong';

type TBaseDom = {
  tag: InheritedTypes;
  closed: boolean;
  attrs: Record<string, string>;
  children: TDom[];
};

export type TDom =
  | {
      tag: 'newLine';
    }
  | {
      tag: 'text';
      text: string;
    }
  | {
      tag: InheritedTypes;
      closed: boolean;
      attrs: Record<string, string>;
      children: TDom[];
    };

const allowedAttributes: Record<InheritedTypes, string[]> = {
  a: ['href', 'title'],
  code: [],
  i: [],
  strong: [],
};

export const verifyHTML = (text: string) => {
  const matches = Array.from(text.matchAll(/<([^>]*)>/g));

  const dom: TDom[] = [];

  let prev = 0;
  const parseDom = (root: TBaseDom) => {
    const parseSimpleText = (text: string) => {
      const newLines = text.split('\n');
      newLines.forEach((line, index) => {
        if (index !== 0) {
          dom.push({ tag: 'newLine' });
        }
        if (line.length) root.children.push({ tag: 'text', text: line });
      });
    };

    let el = {} as RegExpMatchArray;
    while ((el = matches.shift()!)) {
      if (prev !== el.index) parseSimpleText(text.slice(prev, el.index));

      prev = el.index! + el[0].length;

      const attrBody = el[1].trim();
      if (attrBody.startsWith('/')) {
        if (attrBody.slice(1).trim() !== root.tag) {
          throw new Error(
            `Invalid closing tag: tags does not match. Expected '${
              root.tag
            }', got '${attrBody.slice(1).trim()}'`,
          );
        }

        root.closed = true;
        return el.index;
      }
      const [tag, ...attrsList] = attrBody.split(' ') as [
        InheritedTypes,
        ...string[],
      ];

      if (!allowedAttributes[tag]) {
        throw new Error(`Verification failed: tag '${tag}' is not allowed`);
      }

      const attrs = Array.from(
        attrsList
          .join(' ')
          .matchAll(/([^ =]+)=?(?:"([^"]*)"|'([^']*)'|([^ ]*))/g),
      ).reduce((p, [_, field, ...values]) => {
        if (!allowedAttributes[tag]?.includes(field)) {
          throw new Error(
            `Verification failed: attribute '${field}' is not allowed`,
          );
        }

        return { ...p, [field]: values.find((e) => typeof e === 'string') };
      }, {});

      const element = { tag, closed: false, attrs, children: [] };

      parseDom(element);

      root.children!.push(element);

      if (!element.closed) {
        throw new Error(
          `Invalid closing tag: tag '${element.tag}' did not closed`,
        );
      }
    }
    if (prev !== text.length) parseSimpleText(text.slice(prev));
  };
  parseDom({ children: dom } as TBaseDom);

  return dom;
};
