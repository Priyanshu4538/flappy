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
  socket.on("flappyDied", async (ts, score, jumps, flyArea) => {
    console.log("died");
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

    // const result = simulateGame(jumps, pipeQueue, flyArea);
    // console.log("== Final Result ==");
    // console.log(result);
  });

  socket.on("disconnect", () => {
    console.log("Disc socket id:", socket.id);
    // handleDisconnect(socket);
  });
});

httpServer.listen(4000, () => {
  console.log(`Listening at port 4000`);

  console.log(`Server is running on http://localhost:4000`);
});
