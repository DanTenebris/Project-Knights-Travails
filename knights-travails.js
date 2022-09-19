let board = [];
let root = {};

const moveFactory = (data = null) => ({ data });

const setBoard = () => {
  root = moveFactory([0, 0]);
  board = [];
  for (let i = 0; i < 8; i++) {
    board.push([]);
    for (let j = 0; j < 8; j++) {
      board[i].push(true);
    }
  }
};

const checkIfOnBoard = (movArr) => {
  const isOnBoard = (num) => {
    for (let i = 0; i < num.length; i++) {
      if (num[i] > 7 || num[i] < 0) return false;
    }
    return true;
  };

  return movArr.filter(isOnBoard);
};

const setValuesToNode = (arr, node = root) => {
  if (board[node.data[0]][node.data[1]])
    board[node.data[0]][node.data[1]] = false;

  for (let i = 0; i < arr.length; i++) {
    if (board[arr[i][0]][arr[i][1]]) {
      board[arr[i][0]][arr[i][1]] = false;
      node[`mov${i}`] = moveFactory(arr[i]);
    }
  }
};

const findPossibleMoves = (start = [0, 0]) => {
  let move = [];
  move.push([start[0] + 2, start[1] + 1]);
  move.push([start[0] + 1, start[1] + 2]);
  move.push([start[0] - 1, start[1] + 2]);
  move.push([start[0] - 2, start[1] + 1]);
  move.push([start[0] - 2, start[1] - 1]);
  move.push([start[0] - 1, start[1] - 2]);
  move.push([start[0] + 1, start[1] - 2]);
  move.push([start[0] + 2, start[1] - 1]);

  move = checkIfOnBoard(move);
  return move;
};

const buildTree = (start = [0, 0]) => {
  const nodeArr = [root];
  nodeArr[0].data = start;

  while (nodeArr.length) {
    const possibleMoves = findPossibleMoves(nodeArr[0].data);
    setValuesToNode(possibleMoves, nodeArr[0]);

    const keyArr = Object.keys(nodeArr[0]);
    keyArr.shift();
    for (let i = 0; i < keyArr.length; i++) {
      if (nodeArr[0][keyArr[i]] !== null) {
        nodeArr.push(nodeArr[0][keyArr[i]]);
      }
    }

    nodeArr.shift();
  }
};

const findPathToTarget = (target, node = root) => {
  if (target[0] === node.data[0] && target[1] === node.data[1])
    return [node.data];

  const nodeKey = Object.keys(node);
  nodeKey.shift();

  for (let i = 0; i < nodeKey.length; i++) {
    const nodeMov = node[nodeKey[i]];

    if (
      (node.data[0] - 1 <= nodeMov.data[0] && node.data[0] <= target[0]) ||
      (node.data[0] + 1 >= nodeMov.data[0] && node.data[0] >= target[0])
    ) {
      if (node.data[1] - 1 <= nodeMov.data[1] && node.data[1] <= target[1]) {
        const nResult = findPathToTarget(target, nodeMov);
        if (nResult !== null) return [node.data].concat(nResult);
      } else if (
        node.data[1] + 1 >= nodeMov.data[1] &&
        node.data[1] >= target[1]
      ) {
        const nResult = findPathToTarget(target, nodeMov);
        if (nResult !== null) return [node.data].concat(nResult);
      }
    }
  }

  return null;
};

const outputMsg = (arr) => {
  const travailLength = arr.length - 1;
  let moves = "moves";
  if (travailLength === 1) moves = "move";

  let msg = `=> You made it in ${travailLength} ${moves}! \nHere's your path:`;

  for (let i = 0; i < arr.length; i++) {
    msg += `\n[${arr[i]}]`;
  }

  return msg;
};

const knightMoves = (start = [3, 3], end = start) => {
  setBoard();
  buildTree(start);
  const path = findPathToTarget(end);
  console.log(outputMsg(path));
};

knightMoves([0, 0], [1, 2]);
knightMoves([0, 0], [3, 3]);
knightMoves([3, 3], [4, 3]);
