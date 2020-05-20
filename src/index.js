import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import beep from "./beep.mp3";
import tomato from "./tomato.png";

function App() {
  const [mode, setMode] = useState("session");
  const [timer, setTimer] = useState(0);
  const [status, setStatus] = useState("stop");

  const [length, setLength] = useState({ break: 5 * 60, session: 25 * 60 });

  const alarm = useRef();
  const timerRef = useRef();

  useEffect(() => {
    if (status === "run") {
      if (timer >= 0) {
        let start = Date.now();
        timerRef.current = setTimeout(() => {
          counter(start);
        }, 1000);
        if (timer === 0) {
          alarm.current.play();
        }
      } else if (timer < 0) {
        if (mode === "session") {
          setMode("break");
          setTimer(length["break"]);
        } else if (mode === "break") {
          setMode("session");
          setTimer(length["session"]);
        }
      }
    } else if (status === "stop" && timer !== length.session) {
      setTimer(length.session);
    } else if (status === "pause") {
      clearTimeout(timerRef.current);
    }
  }, [status, timer, length.session]);

  function counter(start) {
    setTimer(
      (prevTimer) => prevTimer - Math.round((Date.now() - start) / 1000)
    );
  }

  const adjust = (e) => {
    let value = e.target.value;
    let type = e.target.id.split("-")[0];

    if (value === "+" && status === "stop" && length[type] < 59 * 61) {
      setLength((prevLength) => ({
        ...prevLength,
        [type]: prevLength[type] + 60,
      }));
    } else if (value === "-" && status === "stop" && length[type] > 60) {
      setLength((prevLength) => ({
        ...prevLength,
        [type]: prevLength[type] - 60,
      }));
    }
  };

  const startStop = () => {
    if (status === "stop") {
      setStatus("run");
    } else if (status === "pause") {
      setStatus("run");
    } else if (status === "run") {
      setStatus("pause");
    }
  };

  const reset = () => {
    setStatus("stop");
    setMode("session");
    setTimer(25 * 60);
    setLength({ break: 5 * 60, session: 25 * 60 });
    alarm.current.load();
  };

  return (
    <div id="App">
      <img id="tomato" src={tomato} alt="tomato logo" />
      <Adjuster
        id="break"
        type={"break"}
        length={length["break"]}
        onClick={adjust}
      />
      <Adjuster
        id="session"
        type="session"
        length={length["session"]}
        onClick={adjust}
      />
      <Timer id="timer" timer={timer} mode={mode} />
      <button id="start_stop" onClick={startStop}>
        &#9654;&#9208;
      </button>
      <button id="reset" onClick={reset}>
        &#8634;
      </button>
      <audio id="beep" src={beep} ref={alarm}></audio>
    </div>
  );
}

const Adjuster = (props) => {
  return (
    <div className="adjuster">
      <div className="label" id={`${props.type}-label`}>
        {props.type} length
      </div>
      <button id={`${props.type}-increment`} value="+" onClick={props.onClick}>
        +
      </button>
      <div id={`${props.type}-length`}>{Math.floor(props.length / 60)}</div>
      <button id={`${props.type}-decrement`} value="-" onClick={props.onClick}>
        -
      </button>
    </div>
  );
};

const Timer = (props) => {
  let min = Math.floor(props.timer / 60);
  let sec = props.timer % 60;
  return (
    <div id="timer">
      <div className="label" id="timer-label">
        {props.mode}{" "}
      </div>
      <div id="time-left">
        {min < 10 ? "0" + min : min}:{sec < 10 ? "0" + sec : sec}
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
