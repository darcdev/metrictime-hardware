const { Board, Led, Thermometer, Sensor } = require("johnny-five");
const Agent = require("./agent-connection");

// Agent Configuration
const agent = new Agent({
  name: "Prueba Arduino",
  username: "arduino",
  interval: 2000,
  token: "lWfv36dfs61ixtTa",
  mqtt: {
    host: "mqtt://localhost",
  },
});

let myBoard, myLed;

myBoard = new Board();

myBoard.on("ready", function () {
  myLed = new Led(13);
  myLed.strobe(2000);

  this.repl.inject({
    ledControl: myLed,
  });

  let temp = 0;
  let ir = 0;
  let poten = 0;
  const sensorTemperature = new Thermometer({
    controller: "LM35",
    pin: "A0",
  });
  const sensorIr = new Sensor("A1");
  const potentiometer = new Sensor("A2");

  agent.addMetric("temperatura", function () {
    return temp;
  });

  agent.addMetric("proximidad", function () {
    return ir;
  });

  agent.addMetric("potenciometro 2k", function () {
    return poten;
  });

  sensorTemperature.on("change", function () {
    temp = this.celsius;
  });

  sensorIr.on("change", function () {
    ir = this.value;
  });

  potentiometer.on("change", function () {
    if (!this.value) {
      poten = 0;
      return;
    }
    poten = this.value;
  });

  agent.connect();
});

myBoard.on("error", function (error) {
  console.log(error);
});
