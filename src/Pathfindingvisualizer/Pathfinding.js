import React, { useState, useEffect } from "react";
import Node from "../Pathfindingvisualizer/Node/Node.js";
import { dijkstra, getNodesInShortestPathOrder } from "../alogrithm/dijikitra";
import "../Pathfindingvisualizer/pathfinding.css";


const NUM_ROWS = 22;
const NUM_COLS =45;

const PathfindingVisualizer = () => {
  const [grid, setGrid] = useState([]);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [startNode, setStartNode] = useState(null);
  const [finishNode, setFinishNode] = useState(null);
  const [isDraggingStart, setIsDraggingStart] = useState(false);
  const [isDraggingFinish, setIsDraggingFinish] = useState(false);

  useEffect(() => {
    setGrid(createGrid());
  }, []);

  const createGrid = () => {
    const grid = [];
    for (let row = 0; row < NUM_ROWS; row++) {
      const currentRow = [];
      for (let col = 0; col < NUM_COLS; col++) {
        currentRow.push({
          row,
          col,
          isStart: false,
          isFinish: false,
          isWall: false,
          distance: Infinity,
          isVisited: false,
          previousNode: null,
        });
      }
      grid.push(currentRow);
    }
    return grid;
  };

  const handleMouseDown = (row, col) => {
    const newGrid = [...grid];
    if (!startNode) {
      newGrid[row][col].isStart = true;
      setStartNode(newGrid[row][col]);
    } else if (!finishNode) {
      newGrid[row][col].isFinish = true;
      setFinishNode(newGrid[row][col]);
    } else {
      newGrid[row][col].isWall = !newGrid[row][col].isWall;
    }
    setGrid(newGrid);
    setMouseIsPressed(true);
  };

  const handleMouseEnter = (row, col) => {
    if (!mouseIsPressed) return;
    const newGrid = [...grid];

    if (!isDraggingStart && !isDraggingFinish) {
      newGrid[row][col].isWall = !newGrid[row][col].isWall;
    }

    setGrid(newGrid);
  };

  const handleMouseUp = () => {
    setMouseIsPressed(false);
    setIsDraggingStart(false);
    setIsDraggingFinish(false);
  };

  const visualizeDijkstra = () => {
    if (!startNode || !finishNode) {
      alert('Please select start and end points.');
      return;
    }

    const newGrid = [...grid];
    const visitedNodesInOrder = dijkstra(newGrid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);

    animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
  };

  const animateAlgorithm = (visitedNodes, shortestPath) => {
    for (let i = 0; i < visitedNodes.length; i++) {
      setTimeout(() => {
        const node = visitedNodes[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 10 * i);
    }
    setTimeout(() => {
      animateShortestPath(shortestPath);
    }, 10 * visitedNodes.length);
  };

  const animateShortestPath = (nodesInShortestPathOrder) => {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 50 * i);
    }
  };

  return (
    <div>
      <button className="button" onClick={visualizeDijkstra}>Visualize Dijkstra</button>
      <div className="grid">
        {grid.map((row, rowIdx) => (
          <div key={rowIdx} className="grid-row">
            {row.map((node, nodeIdx) => {
              const { row, col, isStart, isFinish, isWall } = node;
              return (
                <Node
                  key={nodeIdx}
                  col={col}
                  row={row}
                  isStart={isStart}
                  isFinish={isFinish}
                  isWall={isWall}
                  onMouseDown={handleMouseDown}
                  onMouseEnter={handleMouseEnter}
                  onMouseUp={handleMouseUp}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PathfindingVisualizer;
