import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http, { Server } from "http";

import { Server as SocketIOServer } from "socket.io";

dotenv.config();

export const app = express();
export const redisClient = "ok";
app.set("trust proxy", true);

const corsOptions = {
  origin: [
    process.env.CLIENT_URI,
    process.env.NEXT_URI,
    process.env.RMA_URI,
    process.env.NEW_URI,
  ],
  methods: ["GET", "HEAD", "POST", "PUT", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  req.userIp = ip.split(",")[0].trim();
  next();
});

app.use(express.json());

app.get("/", (req, res) => {
  // req.session.visited = true;
  res.json({
    success: true,
    message: "Home page",
  });
});

export const httpServer = http.createServer(app);

export const io = new SocketIOServer(httpServer, {
  cors: {
    origin: [
      process.env.CLIENT_URI,
      process.env.NEXT_URI,
      process.env.RMA_URI,
      process.env.NEW_URI,
    ],
    methods: ["GET", "HEAD", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("New scoket id", socket.id);

  socket.on("ping", async (flyArea) => {
    const pipeHeight = 90;
    const padding = 80;

    const pipes = [
      {
        topHeight: 189,
        bottomHeight: 141,
      },
      {
        topHeight: 167,
        bottomHeight: 163,
      },
      {
        topHeight: 167,
        bottomHeight: 163,
      },
      {
        topHeight: 167,
        bottomHeight: 163,
      },
      {
        topHeight: 167,
        bottomHeight: 163,
      },
      {
        topHeight: 167,
        bottomHeight: 163,
      },
      {
        topHeight: 167,
        bottomHeight: 163,
      },
      {
        topHeight: 167,
        bottomHeight: 163,
      },
      {
        topHeight: 167,
        bottomHeight: 163,
      },
      {
        topHeight: 167,
        bottomHeight: 163,
      },
      {
        topHeight: 167,
        bottomHeight: 163,
      },
      {
        topHeight: 167,
        bottomHeight: 163,
      },
      {
        topHeight: 167,
        bottomHeight: 163,
      },
      {
        topHeight: 167,
        bottomHeight: 163,
      },
      {
        topHeight: 167,
        bottomHeight: 163,
      },
      {
        topHeight: 167,
        bottomHeight: 163,
      },
      {
        topHeight: 167,
        bottomHeight: 163,
      },
      {
        topHeight: 167,
        bottomHeight: 163,
      },
      {
        topHeight: 167,
        bottomHeight: 163,
      },
      {
        topHeight: 167,
        bottomHeight: 163,
      },
      {
        topHeight: 167,
        bottomHeight: 163,
      },
      {
        topHeight: 167,
        bottomHeight: 163,
      },
      {
        topHeight: 167,
        bottomHeight: 163,
      },
      {
        topHeight: 167,
        bottomHeight: 163,
      },
    ];

    // random pipe generation code but using hard code for simulation debug

    // const pipes = [];
    // const constraint = flyArea - pipeHeight - padding * 2;

    // for (let i = 0; i < 5; i++) {
    //   const topHeight = Math.floor(Math.random() * constraint + padding);
    //   const bottomHeight = flyArea - pipeHeight - topHeight;
    //   pipes.push({ topHeight, bottomHeight });
    // }

    socket.emit("pong", pipes);
  });

  socket.on("flappyFly", (ts, name) => {
    console.log("fly");

    socket.nodeFlyTs = Date.now();
    socket.reactFlyTs = ts;
    console.log(socket.nodeFlyTs, socket.reactFlyTs);
  });
  socket.on(
    "flappyDied",
    async (ts, score, jumps, flyArea, startTime, endTime, pipeData) => {
      console.log("died", jumps, pipeData);
      //hard code same pipe data
      const pipeQueue = [
        {
          topHeight: 189,
          bottomHeight: 141,
        },
        {
          topHeight: 167,
          bottomHeight: 163,
        },
        {
          topHeight: 167,
          bottomHeight: 163,
        },
        {
          topHeight: 167,
          bottomHeight: 163,
        },
        {
          topHeight: 167,
          bottomHeight: 163,
        },
        {
          topHeight: 167,
          bottomHeight: 163,
        },
        {
          topHeight: 167,
          bottomHeight: 163,
        },
        {
          topHeight: 167,
          bottomHeight: 163,
        },
        {
          topHeight: 167,
          bottomHeight: 163,
        },
        {
          topHeight: 167,
          bottomHeight: 163,
        },
        {
          topHeight: 167,
          bottomHeight: 163,
        },
        {
          topHeight: 167,
          bottomHeight: 163,
        },
        {
          topHeight: 167,
          bottomHeight: 163,
        },
        {
          topHeight: 167,
          bottomHeight: 163,
        },
        {
          topHeight: 167,
          bottomHeight: 163,
        },
        {
          topHeight: 167,
          bottomHeight: 163,
        },
        {
          topHeight: 167,
          bottomHeight: 163,
        },
        {
          topHeight: 167,
          bottomHeight: 163,
        },
        {
          topHeight: 167,
          bottomHeight: 163,
        },
        {
          topHeight: 167,
          bottomHeight: 163,
        },
        {
          topHeight: 167,
          bottomHeight: 163,
        },
        {
          topHeight: 167,
          bottomHeight: 163,
        },
        {
          topHeight: 167,
          bottomHeight: 163,
        },
        {
          topHeight: 167,
          bottomHeight: 163,
        },
      ];

      //======SIMULATE CHECK HERE ++++++++++

      try {
        const verifier = new GameVerifier(pipeData);
        const result = verifier.simulateGame(jumps);

        console.log(verifier, result, "resver");

        if (result.verified && result.simulatedScore === score) {
          console.log("Game verified successfully");
        } else {
          console.warn("Game verify failed");
        }
      } catch (err) {
        console.error("Error verifying flappy game:", err);
      }

      // const result = simulateGame(jumps, pipeQueue, flyArea);
      // console.log("== Final Result ==");
      // console.log(result);
    }
  );

  socket.on("disconnect", () => {
    console.log("Disc socket id:", socket.id);
    // handleDisconnect(socket);
  });
});

class GameVerifier {
  constructor(pipeData) {
    // Initialize with same constants as the game
    this.gravity = 0.25;
    this.jump = -4.6;
    this.position = 180;
    this.velocity = 0;
    this.score = 0;
    this.gameOver = false;

    // Store the pipe data sent from the client
    this.pipes = pipeData;
    this.passedPipes = [];
  }

  simulateGame(jumpTimestamps) {
    const frameTime = 1000 / 60; // 60 FPS
    let currentTime = 0;
    let currentFrame = 0;
    let nextJumpIndex = 0;

    while (!this.gameOver && currentFrame < 10000) {
      // Safety limit
      // Check if player jumped at this time
      if (
        nextJumpIndex < jumpTimestamps.length &&
        jumpTimestamps[nextJumpIndex] <= currentTime
      ) {
        this.velocity = this.jump;
        nextJumpIndex++;
      }

      // Apply physics
      this.velocity += this.gravity;
      this.position += this.velocity;

      // Check collisions with pipes
      this.checkCollisions(currentTime);

      // Check if bird hit the ground or ceiling
      if (this.position >= 370 || this.position <= 0) {
        this.gameOver = true;
      }

      // Move to next frame
      currentTime += frameTime;
      currentFrame++;
    }

    return {
      verified: !this.gameOver, // Game was valid if it didn't end prematurely
      simulatedScore: this.score,
      frames: currentFrame,
    };
  }

  checkCollisions(currentTime) {
    // Check each pipe that would be active at this time
    this.pipes.forEach((pipe) => {
      if (pipe.time <= currentTime && !this.passedPipes.includes(pipe.id)) {
        // Calculate pipe position based on time elapsed
        const pipePosition = 288 - ((currentTime - pipe.time) / 1000) * 134;

        if (pipePosition < 0) {
          // Pipe has passed entirely
          if (!this.passedPipes.includes(pipe.id)) {
            this.passedPipes.push(pipe.id);
            this.score++;
          }
        } else if (pipePosition < 55) {
          // Check collision
          const birdRight = 65; // Position + width of bird
          const birdTop = this.position;
          const birdBottom = this.position + 30; // Height of bird

          if (
            birdRight > pipePosition &&
            birdRight < pipePosition + 52 &&
            (birdTop < pipe.topHeight || birdBottom > pipe.topHeight + 90)
          ) {
            this.gameOver = true;
          }
        }
      }
    });
  }
}

httpServer.listen(4000, () => {
  console.log(`Listening at port 4000`);

  console.log(`Server is running on http://localhost:4000`);
});
