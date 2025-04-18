// minigamesStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useMinigamesStore = create(
  persist(
    (set, get) => ({
      // Minigame state
      activeMinigame: null, // 'memory', 'logic', 'focus', 'sequential'
      isPlaying: false,
      difficulty: "normal", // 'easy', 'normal', 'hard'
      score: 0,
      highScores: {
        memory: 0,
        logic: 0,
        focus: 0,
        sequential: 0,
      },

      // Minigame context (why the player is playing)
      context: null, // 'exam', 'job_interview', 'project', 'skill_development', 'certification'

      // Current game data (specific to each minigame type)
      gameData: null,

      // Track game history
      history: [], // [{type, date, score, outcome}]

      // Start a minigame
      startMinigame: (type, context, difficulty = "normal") =>
        set((state) => {
          // Generate game data based on type
          let gameData;

          if (type === "memory") {
            // Memory game data
            const pairs =
              difficulty === "easy" ? 6 : difficulty === "normal" ? 8 : 12;
            const symbols = [
              "🔴",
              "🟢",
              "🔵",
              "🟡",
              "🟣",
              "⚫️",
              "⚪️",
              "🟠",
              "⬛️",
              "⬜️",
              "🟥",
              "🟩",
              "🟦",
              "🟨",
              "🟪",
              "⬛️",
            ];

            // Generate pairs
            const items = [];
            for (let i = 0; i < pairs; i++) {
              items.push({
                id: `a${i}`,
                symbol: symbols[i],
                flipped: false,
                matched: false,
              });
              items.push({
                id: `b${i}`,
                symbol: symbols[i],
                flipped: false,
                matched: false,
              });
            }

            // Shuffle items
            for (let i = items.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [items[i], items[j]] = [items[j], items[i]];
            }

            gameData = {
              items,
              flippedCards: [],
              matches: 0,
              totalPairs: pairs,
              moves: 0,
              startTime: Date.now(),
            };
          } else if (type === "logic") {
            // Logic puzzle game
            const difficultyFactor =
              difficulty === "easy" ? 3 : difficulty === "normal" ? 5 : 7;
            const patterns = [
              [1, 2, 3, 4, 5], // +1
              [2, 4, 6, 8, 10], // +2
              [1, 3, 9, 27, 81], // *3
              [5, 10, 20, 40, 80], // *2
              [100, 50, 25, 12.5, 6.25], // /2
              [1, 4, 9, 16, 25], // squares
              [1, 1, 2, 3, 5], // fibonacci
              [1, 4, 3, 6, 5], // odd +2, even +1
              [2, 6, 12, 20, 30], // +4, +6, +8, +10
              [8, 4, 8, 4, 8], // alternating
            ];

            // Select random patterns based on difficulty
            const selectedPatterns = [];
            const indices = Array.from(
              { length: patterns.length },
              (_, i) => i
            );

            for (let i = 0; i < difficultyFactor; i++) {
              if (indices.length === 0) break;

              const randomIndex = Math.floor(Math.random() * indices.length);
              const patternIndex = indices[randomIndex];
              indices.splice(randomIndex, 1);

              selectedPatterns.push({
                sequence: patterns[patternIndex].slice(0, -1),
                answer:
                  patterns[patternIndex][patterns[patternIndex].length - 1],
                userAnswer: null,
              });
            }

            gameData = {
              patterns: selectedPatterns,
              currentPattern: 0,
              startTime: Date.now(),
            };
          } else if (type === "focus") {
            // Concentration/focus game (spot the difference)
            const difficultyFactor =
              difficulty === "easy" ? 3 : difficulty === "normal" ? 5 : 8;

            // Generate a grid with one different item
            const gridSize =
              difficulty === "easy" ? 4 : difficulty === "normal" ? 6 : 8;
            const totalGrids = difficultyFactor;

            const grids = [];
            for (let g = 0; g < totalGrids; g++) {
              const mainSymbol = [
                "🔴",
                "🟢",
                "🔵",
                "🟡",
                "🟣",
                "⚫️",
                "⚪️",
                "🟠",
              ][Math.floor(Math.random() * 8)];
              const differentSymbol = [
                "🔴",
                "🟢",
                "🔵",
                "🟡",
                "🟣",
                "⚫️",
                "⚪️",
                "🟠",
              ].filter((s) => s !== mainSymbol)[Math.floor(Math.random() * 7)];

              const grid = Array(gridSize * gridSize).fill(mainSymbol);
              const differentPos = Math.floor(Math.random() * grid.length);
              grid[differentPos] = differentSymbol;

              grids.push({
                grid,
                differentPos,
                mainSymbol,
                differentSymbol,
                userSelected: null,
                correct: false,
              });
            }

            gameData = {
              grids,
              currentGrid: 0,
              startTime: Date.now(),
            };
          } else if (type === "sequential") {
            // Sequential ordering game
            const numberCount =
              difficulty === "easy" ? 9 : difficulty === "normal" ? 16 : 25;

            // Generate numbers 1 to numberCount
            const numbers = Array.from(
              { length: numberCount },
              (_, i) => i + 1
            );

            // Shuffle numbers
            for (let i = numbers.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
            }

            gameData = {
              numbers,
              selected: [],
              currentExpected: 1,
              gridSize: Math.sqrt(numberCount),
              startTime: Date.now(),
            };
          }

          return {
            activeMinigame: type,
            isPlaying: true,
            difficulty,
            score: 0,
            context,
            gameData,
          };
        }),

      // Memory game actions
      flipCard: (cardId) =>
        set((state) => {
          if (state.activeMinigame !== "memory" || !state.isPlaying)
            return state;

          const gameData = { ...state.gameData };

          // If already two cards flipped and not matched, return
          if (gameData.flippedCards.length === 2) return state;

          // Find the card
          const cardIndex = gameData.items.findIndex(
            (card) => card.id === cardId
          );
          if (cardIndex === -1) return state;

          // If card is already flipped or matched, return
          if (
            gameData.items[cardIndex].flipped ||
            gameData.items[cardIndex].matched
          )
            return state;

          // Flip the card
          const items = [...gameData.items];
          items[cardIndex] = { ...items[cardIndex], flipped: true };

          // Add to flipped cards
          const flippedCards = [...gameData.flippedCards, items[cardIndex]];

          // Check for match if two cards are flipped
          let matches = gameData.matches;
          let moves = gameData.moves + 1;

          if (flippedCards.length === 2) {
            // Check if symbols match
            if (flippedCards[0].symbol === flippedCards[1].symbol) {
              // Mark both cards as matched
              items.forEach((card, idx) => {
                if (
                  card.id === flippedCards[0].id ||
                  card.id === flippedCards[1].id
                ) {
                  items[idx] = { ...items[idx], matched: true };
                }
              });

              matches += 1;

              // Check if game is complete
              if (matches === gameData.totalPairs) {
                const endTime = Date.now();
                const duration = Math.floor(
                  (endTime - gameData.startTime) / 1000
                );

                // Calculate score based on moves and time
                const baseScore = 1000;
                const movesPenalty = moves * 10;
                const timePenalty = duration * 2;
                const finalScore = Math.max(
                  0,
                  baseScore - movesPenalty - timePenalty
                );

                // Update high score if needed
                const highScores = { ...state.highScores };
                if (finalScore > highScores.memory) {
                  highScores.memory = finalScore;
                }

                // Add to history
                const history = [
                  ...state.history,
                  {
                    type: "memory",
                    date: new Date().toISOString(),
                    score: finalScore,
                    moves,
                    duration,
                    difficulty: state.difficulty,
                    context: state.context,
                    outcome: "completed",
                  },
                ];

                return {
                  isPlaying: false,
                  score: finalScore,
                  highScores,
                  history,
                  gameData: {
                    ...gameData,
                    items,
                    flippedCards: [],
                    matches,
                    moves,
                    completed: true,
                  },
                };
              }

              // Reset flipped cards for next turn
              return {
                gameData: {
                  ...gameData,
                  items,
                  flippedCards: [],
                  matches,
                  moves,
                },
              };
            } else {
              // No match, cards will flip back after a delay
              // This will be handled by the UI component with a setTimeout
              return {
                gameData: {
                  ...gameData,
                  items,
                  flippedCards,
                  moves,
                },
              };
            }
          }

          // Only one card flipped so far
          return {
            gameData: {
              ...gameData,
              items,
              flippedCards,
              moves,
            },
          };
        }),

      // Unflip unmatched cards (called after a delay in UI)
      unflipCards: () =>
        set((state) => {
          if (state.activeMinigame !== "memory" || !state.isPlaying)
            return state;

          const gameData = { ...state.gameData };

          // Only proceed if we have two flipped cards
          if (gameData.flippedCards.length !== 2) return state;

          // Get IDs of the flipped cards
          const flippedIds = gameData.flippedCards.map((card) => card.id);

          // Reset all non-matched flipped cards
          const items = gameData.items.map((card) => {
            if (flippedIds.includes(card.id) && !card.matched) {
              return { ...card, flipped: false };
            }
            return card;
          });

          return {
            gameData: {
              ...gameData,
              items,
              flippedCards: [],
            },
          };
        }),

      // Logic game actions
      submitLogicAnswer: (answer) =>
        set((state) => {
          if (state.activeMinigame !== "logic" || !state.isPlaying)
            return state;

          const gameData = { ...state.gameData };
          const patterns = [...gameData.patterns];
          const currentPattern = gameData.currentPattern;

          // Record user's answer
          patterns[currentPattern] = {
            ...patterns[currentPattern],
            userAnswer: answer,
          };

          // Check if this was the last pattern
          if (currentPattern === patterns.length - 1) {
            // Calculate score
            const correctAnswers = patterns.filter(
              (p) => p.userAnswer === p.answer
            ).length;
            const totalPatterns = patterns.length;

            const endTime = Date.now();
            const duration = Math.floor((endTime - gameData.startTime) / 1000);

            // Calculate score based on correct answers and time
            const baseScore = 1000;
            const correctScore = (correctAnswers / totalPatterns) * baseScore;
            const timePenalty = Math.min(duration * 2, baseScore / 2);
            const finalScore = Math.max(0, correctScore - timePenalty);

            // Update high score if needed
            const highScores = { ...state.highScores };
            if (finalScore > highScores.logic) {
              highScores.logic = finalScore;
            }

            // Add to history
            const history = [
              ...state.history,
              {
                type: "logic",
                date: new Date().toISOString(),
                score: finalScore,
                correctAnswers,
                totalPatterns,
                duration,
                difficulty: state.difficulty,
                context: state.context,
                outcome: "completed",
              },
            ];

            return {
              isPlaying: false,
              score: finalScore,
              highScores,
              history,
              gameData: {
                ...gameData,
                patterns,
                completed: true,
              },
            };
          }

          // Move to next pattern
          return {
            gameData: {
              ...gameData,
              patterns,
              currentPattern: currentPattern + 1,
            },
          };
        }),

      // Focus game actions
      selectDifferentItem: (position) =>
        set((state) => {
          if (state.activeMinigame !== "focus" || !state.isPlaying)
            return state;

          const gameData = { ...state.gameData };
          const grids = [...gameData.grids];
          const currentGrid = gameData.currentGrid;

          // Record user's selection
          grids[currentGrid] = {
            ...grids[currentGrid],
            userSelected: position,
            correct: position === grids[currentGrid].differentPos,
          };

          // Check if this was the last grid
          if (currentGrid === grids.length - 1) {
            // Calculate score
            const correctSelections = grids.filter((g) => g.correct).length;
            const totalGrids = grids.length;

            const endTime = Date.now();
            const duration = Math.floor((endTime - gameData.startTime) / 1000);

            // Calculate score based on correct selections and time
            const baseScore = 1000;
            const correctScore = (correctSelections / totalGrids) * baseScore;
            const timePenalty = Math.min(duration * 3, baseScore / 2);
            const finalScore = Math.max(0, correctScore - timePenalty);

            // Update high score if needed
            const highScores = { ...state.highScores };
            if (finalScore > highScores.focus) {
              highScores.focus = finalScore;
            }

            // Add to history
            const history = [
              ...state.history,
              {
                type: "focus",
                date: new Date().toISOString(),
                score: finalScore,
                correctSelections,
                totalGrids,
                duration,
                difficulty: state.difficulty,
                context: state.context,
                outcome: "completed",
              },
            ];

            return {
              isPlaying: false,
              score: finalScore,
              highScores,
              history,
              gameData: {
                ...gameData,
                grids,
                completed: true,
              },
            };
          }

          // Move to next grid
          return {
            gameData: {
              ...gameData,
              grids,
              currentGrid: currentGrid + 1,
            },
          };
        }),

      // Sequential game actions
      selectNumber: (number) =>
        set((state) => {
          if (state.activeMinigame !== "sequential" || !state.isPlaying)
            return state;

          const gameData = { ...state.gameData };

          // Check if this is the expected next number
          if (number !== gameData.currentExpected) {
            // Wrong selection
            return state;
          }

          // Add to selected numbers
          const selected = [...gameData.selected, number];
          const currentExpected = gameData.currentExpected + 1;

          // Check if game is complete
          if (currentExpected > gameData.numbers.length) {
            const endTime = Date.now();
            const duration = Math.floor((endTime - gameData.startTime) / 1000);

            // Calculate score based on time
            const baseScore = 1000;
            const timePenalty = duration * 5;
            const finalScore = Math.max(0, baseScore - timePenalty);

            // Update high score if needed
            const highScores = { ...state.highScores };
            if (finalScore > highScores.sequential) {
              highScores.sequential = finalScore;
            }

            // Add to history
            const history = [
              ...state.history,
              {
                type: "sequential",
                date: new Date().toISOString(),
                score: finalScore,
                duration,
                difficulty: state.difficulty,
                context: state.context,
                outcome: "completed",
              },
            ];

            return {
              isPlaying: false,
              score: finalScore,
              highScores,
              history,
              gameData: {
                ...gameData,
                selected,
                completed: true,
              },
            };
          }

          // Continue game
          return {
            gameData: {
              ...gameData,
              selected,
              currentExpected,
            },
          };
        }),

      // End the current minigame (player gives up)
      endMinigame: () =>
        set((state) => {
          if (!state.isPlaying) return state;

          // Add to history as abandoned
          const history = [
            ...state.history,
            {
              type: state.activeMinigame,
              date: new Date().toISOString(),
              score: 0,
              difficulty: state.difficulty,
              context: state.context,
              outcome: "abandoned",
            },
          ];

          return {
            isPlaying: false,
            activeMinigame: null,
            score: 0,
            context: null,
            gameData: null,
            history,
          };
        }),

      // Reset minigames state
      resetMinigames: () =>
        set({
          activeMinigame: null,
          isPlaying: false,
          difficulty: "normal",
          score: 0,
          context: null,
          gameData: null,
        }),
    }),
    {
      name: "azerbaijan-it-sim-minigames",
      getStorage: () => localStorage,
    }
  )
);
