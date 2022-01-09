import React from "react";
import styled from "styled-components";
import shuffle from "lodash/shuffle";
type RuleTuple = [number, number, number];
type Rules = { rule: RuleTuple; resolve: number }[];
type Settings = { maze: boolean; shuffled: boolean };
const ON_COLOR = "#313950";

// http://localhost:3000/?rule=e5bbd71d&maze=false&shuffle=false


const params = new URLSearchParams(window.location.search)
const paramW = params.get("w")
const paramH = params.get("h")
const paramRule = params.get("r")
const paramMaze = params.get("m")
const paramShuffle = params.get("s")

const cw = paramW ? Number(paramW) : (window.innerWidth % 2 === 0 ? window.innerWidth + 1 : window.innerWidth);
const ch = paramH ? Number(paramH) : window.innerHeight + 1000;
const cellWidth = 4;
const cellHeight = 6;
const ROWS = Math.round(ch / cellHeight);
const COLUMNS = Math.round(cw / cellWidth);
const COUNT = ROWS * COLUMNS;

const ArbitraryRulesList: Rules[] = [
  [
    { rule: [0, 1, 1], resolve: 1 },
    { rule: [1, 1, 0], resolve: 0 },
    { rule: [0, 0, 1], resolve: 1 },
    { rule: [1, 0, 0], resolve: 1 },
    { rule: [0, 1, 0], resolve: 1 },
    { rule: [0, 0, 0], resolve: 0 },
  ],
  [
    { rule: [0, 0, 1], resolve: 0 },
    { rule: [0, 0, 0], resolve: 1 },
    { rule: [1, 1, 1], resolve: 1 },
    { rule: [0, 0, 1], resolve: 1 },
    { rule: [1, 0, 1], resolve: 0 },
    { rule: [1, 0, 1], resolve: 0 },
  ],
  [
    { rule: [0, 1, 0], resolve: 0 },
    { rule: [1, 0, 1], resolve: 1 },
    { rule: [0, 0, 0], resolve: 1 },
    { rule: [1, 1, 1], resolve: 1 },
    { rule: [0, 1, 0], resolve: 0 },
    { rule: [0, 1, 1], resolve: 1 },
  ],
  [
    { rule: [1, 1, 0], resolve: 1 },
    { rule: [0, 0, 1], resolve: 1 },
    { rule: [0, 1, 1], resolve: 1 },
    { rule: [1, 0, 0], resolve: 0 },
    { rule: [0, 0, 0], resolve: 1 },
    { rule: [0, 0, 0], resolve: 1 },
  ],
  [
    { rule: [1, 0, 1], resolve: 0 },
    { rule: [0, 0, 0], resolve: 1 },
    { rule: [1, 0, 1], resolve: 1 },
    { rule: [1, 1, 1], resolve: 1 },
    { rule: [1, 0, 0], resolve: 0 },
    { rule: [0, 1, 0], resolve: 1 },
  ],
  [
    { rule: [0, 0, 0], resolve: 1 },
    { rule: [0, 1, 1], resolve: 1 },
    { rule: [1, 1, 1], resolve: 1 },
    { rule: [0, 1, 1], resolve: 1 },
    { rule: [0, 0, 0], resolve: 0 },
    { rule: [1, 0, 1], resolve: 0 },
  ],
  [
    { rule: [1, 0, 0], resolve: 1 },
    { rule: [0, 0, 1], resolve: 1 },
    { rule: [1, 1, 1], resolve: 0 },
    { rule: [1, 1, 0], resolve: 1 },
    { rule: [0, 1, 1], resolve: 1 },
    { rule: [1, 0, 0], resolve: 0 },
  ],
  [
    { rule: [0, 0, 1], resolve: 0 },
    { rule: [1, 1, 0], resolve: 1 },
    { rule: [1, 0, 1], resolve: 1 },
    { rule: [0, 0, 0], resolve: 1 },
    { rule: [0, 1, 1], resolve: 1 },
    { rule: [1, 1, 1], resolve: 0 },
  ],
  [
    { rule: [0, 1, 0], resolve: 0 },
    { rule: [0, 0, 0], resolve: 1 },
    { rule: [1, 0, 0], resolve: 1 },
    { rule: [0, 0, 1], resolve: 1 },
    { rule: [1, 0, 1], resolve: 0 },
    { rule: [0, 0, 0], resolve: 0 },
  ],
  [
    { rule: [1, 1, 1], resolve: 0 },
    { rule: [0, 0, 0], resolve: 1 },
    { rule: [1, 0, 0], resolve: 1 },
    { rule: [0, 1, 1], resolve: 1 },
    { rule: [0, 0, 0], resolve: 0 },
    { rule: [1, 0, 1], resolve: 1 },
  ],
];

// http://localhost:3000/?rule=f93ab04e&maze=false&shuffle=true

function* RandomStoreRule() {
  let prev = 0;

  while (true) {

    if(prev > ArbitraryRulesList.length - 1) {
      prev = 0
    }
    yield prev++;
    
  }
  // eslint-disable-next-line 
  return prev;
}

const randomStoreRule = RandomStoreRule();

const RULES: Rules = paramRule ? decodeRule(paramRule) : ArbitraryRulesList[1];

const randomBinary = () => Math.round(Math.random());
const randomRules = () =>
  Array(8)
    .fill({ rule: [0, 0, 0], resolve: 0 })
    .map(() => ({
      rule: [randomBinary(), randomBinary(), randomBinary()],
      resolve: randomBinary(),
    })) as Rules;

const Container = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const Controls = styled.div`
  display: flex;
  flex-flow: row;
  gap: 30px;
  width: 100%;
  left: 0;

  justify-content: space-between;
  top: 0;
  padding: 5px 20px;
`;

const Button = styled.div`
  border: none;
  border-radius: 4px;
  padding: 10px 30px;
  color: white;
  font-weight: 500;
  font-family: arial;
  background: #313a50;
  cursor: pointer;
  user-select: none;
`;

const Rule = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  gap: 5px;
  border: 1px solid #cdcdcd;
  border-radius: 3px;
  padding: 5px 10px;
`;

const Horizontal = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: row;
  gap: 2px;
`;

const Arrow = styled.div`
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 7px solid #dfdfdf;
  border-radius: 3px;
  margin: 14px 0 2px 0;
  position: relative;

  &:after {
    content: "";
    position: absolute;
    top: -15px;
    left: 0px;
    right: 0;
    margin: auto;
    height: 10px;
    width: 2px;
    transform: translateX(-1px);
    background: #dfdfdf;
  }
`;

const Cell = styled.div<{ active?: boolean }>`
  background: ${(props) => (props.active ? ON_COLOR : "#d7d7d7")};
  width: 20px;
  height: 20px;
  border-radius: 1px;

  &:hover {
    background: ${(props) => (props.active ? "#262d3e" : "#b3b3b3")};
  }
`;

function getCoords(index: number) {
  return {
    x: index % COLUMNS,
    y: index === 0 ? 0 : Math.floor(index / COLUMNS),
  };
}

function convertNumber(n: string, fromBase: number, toBase: number) {
  return parseInt(n.toString(), fromBase).toString(toBase);
}

function converter(c: string) {
  const j = convertNumber(c, 16, 2).split("").map(r => Number(r))
  const pad = 4 - j.length
  for(let i = 0; i < pad; i++) {
    j.splice(0,0,0)
  }
  return j
}

function encodeRule(rules: Rules, settings: Settings) {
  const code = rules.reduce((str, c) => str + convertNumber(c.rule.join("") + c.resolve, 2, 16), "")
  window.history.replaceState({}, "rule", `?r=${code}&m=${settings.maze}&s=${settings.shuffled}&w=${cw}&h=${ch}`)
  return code
}


function decodeRule(code: string) {
  return code.split("").map(c => {
    const [x,y,z,d] = converter(c)
    return { 
      rule:  [x,y,z] as RuleTuple,
      resolve: d
    }
  })
}





function generateCellularAutomata(_rules: Rules, settings: Settings) {
  let rules = [..._rules];
  let world = Array(COUNT).fill(0);
  world[Math.floor(COLUMNS / 2)] ^= 1;

  encodeRule(rules, settings)


  for (let position = 0; position < COUNT; position++) {
    const x = position % COLUMNS;

    const next = x + 1 > COLUMNS ? 0 : world[position + 1];
    const current = world[position];
    const prev = x - 1 < 0 ? 0 : world[position - 1];

    // for (let i = 0; i < rules.length; i++) {
    //   const r = rules[i]
    for (let r of rules) {
      let [p, c, n] = r.rule;

      if (prev === p && current === c && next === n) {
        const below_position = position + COLUMNS;
        world[below_position] = r.resolve;
        break;
      }

      if (settings.shuffled) {
        rules = shuffle(rules);
      }

      if (settings.maze) {
        rules = ArbitraryRulesList[randomStoreRule.next().value];
      }
    }
  }

  return world;
}

function createCanvasDrawing(
  destinationCanvas: HTMLCanvasElement,
  rules: Rules,
  settings: Settings
) {
  const canvas = destinationCanvas;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.clearRect(0, 0, cw, ch);
    canvas.setAttribute("width", "" + cw * +window.devicePixelRatio);
    canvas.setAttribute("height", "" + ch * +window.devicePixelRatio);
    canvas.style.width = cw + "px";
    canvas.style.height = ch + "px";
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);




    let world = generateCellularAutomata(rules, settings);

    for (let index = 0; index < COUNT; index++) {
      const { x, y } = getCoords(index);

      ctx.fillStyle = world[index] ? ON_COLOR : "white";

      const cx = x * cellWidth;
      const cy = y * cellHeight;

      ctx.fillRect(cx, cy, cellWidth, cellHeight);
    }
  }

  return { canvas, ctx };
}

function CellularAutomata() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [rules, setRules] = React.useState<Rules>(RULES);
  const [maze, setMaze] = React.useState<boolean>(paramMaze === "true" ? true : false);
  const [shuffled, setShuffled] = React.useState<boolean>(paramShuffle === "true" ? true : false);

  React.useEffect(
    () =>
      void createCanvasDrawing(canvasRef.current!, rules, { maze, shuffled }),
    [rules, maze, shuffled]
  );

  const changeRule = (ri: number, i: number) => {
    setRules((prevRules) =>
      prevRules.map((r, rri: number) => {
        if (rri === ri) {
          const nrule = [...r.rule];
          nrule[i] ^= 1;
          return { ...r, rule: nrule as RuleTuple };
        }
        return r;
      })
    );
  };

  const changeResolve = (ri: number) =>
    setRules((prev) =>
      prev.map((r, rri) => (rri === ri ? { ...r, resolve: r.resolve ^ 1 } : r))
    );

  return (
    <Container>
      <Controls>
        <Horizontal>
          <Button onClick={() => setMaze((prev) => !prev)}>
            Maze: {maze ? "on" : "off"}
          </Button>
          <Button onClick={() => setShuffled((prev) => !prev)}>
            Shuffle rules: {shuffled ? "on" : "off"}
          </Button>
        </Horizontal>
        <Horizontal style={{ gap: 20 }}>
          {rules.map((r, ri) => (
            <Rule key={ri}>
              <Horizontal>
                {r.rule.map((c, i) => (
                  <Cell
                    key={ri + "-" + i}
                    active={!!c}
                    onClick={() => changeRule(ri, i)}
                  />
                ))}
              </Horizontal>
              <Horizontal>
                <Arrow />
              </Horizontal>
              <Horizontal>
                <Cell active={!!r.resolve} onClick={() => changeResolve(ri)} />
              </Horizontal>
            </Rule>
          ))}
        </Horizontal>
        <Horizontal>
          <Button onClick={() => setRules(randomRules)}>Randomize</Button>
          <Button
            onClick={() =>
              setRules(ArbitraryRulesList[randomStoreRule.next().value])
            }
          >
            Pattern
          </Button>
        </Horizontal>
      </Controls>
      <canvas ref={canvasRef} />
    </Container>
  );
}



export default CellularAutomata;
