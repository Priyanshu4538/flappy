import { useEffect, useRef, useState } from "react";
import "./App.css";
import { io, Socket } from "socket.io-client";

interface ClientToServerEvents {
  ping: (flyArea: any) => void;
  flappyFly: (ts: number, name: string) => void;
  flappyDied: (
    ts: number,
    score: number,
    jumps: number[],
    flyArea: any
  ) => void;
  revalidate: (ts: number, score: number, vallidator: number) => void;
}

interface ServerToClientEvents {
  pong: (pipes: any) => void;
  message: (msg: string) => void;
  startGame: (gameId: string) => void;
  updateUser: (user: any) => void;
}

function App() {
  const socketRef = useRef<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null); //iframe ref

  const startRef = useRef<number>(1);

  const [flappyKey, setFlappyKey] = useState(0); // to refresh states etc

  useEffect(() => {
    const newSocket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
      `http://localhost:4000`,
      { transports: ["websocket"], withCredentials: true }
    );

    socketRef.current = newSocket;

    newSocket.on("connect", () => {
      console.log("connected to flappy");
    });
    newSocket.on("pong", (pipes) => {
      console.log("connected to flappy and send pipes");
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          {
            type: "pipes",
            pipes,
          },
          "*"
        );
      }
    });

    newSocket.on("updateUser", (user) => {
      // not in demo as user is not stored anywhere but DB
      console.log("new user", user?.balance);
    });
    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleMessage = (event: any) => {
      if (event.data?.type === "score") {
        const ts = Math.floor(Date.now() / 1000);
        const round = startRef.current;
        const score = event.data.score;
        console.log(score, "score");

        if (iframeRef.current?.contentWindow) {
          console.log(round, ts, "roundts");
          const playTime = Math.max(7, ts - round);
          const newScore = (playTime - 7) * 5;
          iframeRef.current.contentWindow.postMessage(
            {
              type: "balance",
              balance: 0 + score * 10 + newScore,
            },
            "*"
          );
          console.log(
            "Sent New Score balance to iframe (default 0):",
            0 + score * 10 + (ts - round - 7) * 5,
            `round score ${ts - round}`
          );
          // subtracted 7 because it takes about 7 seconds for first pipe to appear
        }
      }
      if (event.data?.type === "flyarea") {
        const flyArea = event.data.flyArea;

        if (socketRef.current) {
          socketRef.current.emit("ping", flyArea);
          console.log("flyarea", flyArea, "ping");
        }
      }

      if (event.data?.type === "dead") {
        const { score, jumps, flyArea } = event.data;
        console.log(score, "dead score");
        const ts = Date.now();
        const flappyDied = () => {
          const socket = socketRef.current;
          console.log("flap 1", jumps);
          if (socket) {
            socket.emit("flappyDied", ts, score, jumps, flyArea);
            console.log("flappy fly");
          }
        };
        flappyDied();
      }
      if (event.data?.type === "startGame") {
        console.log("startGame");
        const ts = Date.now();
        startRef.current = Math.floor(ts / 1000);

        const flappyFly = () => {
          const socket = socketRef.current;
          console.log("flap 1", socket);
          if (socket) {
            socket.emit("flappyFly", ts, "playername");
            console.log("flappy fly");
          }
        };
        flappyFly();
      }
      if (event.data?.type === "restart") {
        console.log("Restart");
        setFlappyKey((prev) => prev + 1); //reset by changing key
      }
    };

    window.addEventListener("message", handleMessage);

    const handleIframeLoad = () => {
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          { type: "balance", balance: 0 },
          "*"
        );
        console.log("Sent score balance to iframe:", 0);
      }
    };

    const iframe = iframeRef.current;

    // Attach load event to iframe to send balance when iframe is fully loaded
    iframe?.addEventListener("load", handleIframeLoad);

    return () => {
      window.removeEventListener("message", handleMessage);
      iframe?.removeEventListener("load", handleIframeLoad);
    };
  }, [flappyKey]);

  return (
    <>
      <div
        style={{
          height: "100vh",
          margin: 0,
          padding: 0,
        }}
      >
        <iframe
          key={flappyKey}
          ref={iframeRef}
          src="/floppybird/index.html"
          title="Floppy Bird"
          width="100%"
          height="100%"
          style={{
            border: "none",
            pointerEvents: "auto",
            touchAction: "none",
          }}
        />
      </div>
    </>
  );
}

export default App;
