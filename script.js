const $ = id =>
  document.getElementById(id);


const random = array =>
  array[
    Math.floor(
      Math.random() *
      array.length
    )
  ];


const shuffle = array =>
  [...array].sort(
    () =>
      Math.random() - 0.5
  );


const TOTAL_ROUNDS = 10;


let round = 1;

let stars = 0;

let talkScore = 0;

let currentEvent = null;

let currentQuestionIndex = 0;

let answered = false;

let spoken = false;

let currentQuestion = null;

let usedEventTypes = [];



const people = [

  {
    name: "민수",
    icon: "👦",
    type: "아이"
  },

  {
    name: "지우",
    icon: "👧",
    type: "아이"
  },

  {
    name: "할머니",
    icon: "👵",
    type: "어르신"
  },

  {
    name: "할아버지",
    icon: "👴",
    type: "어르신"
  },

  {
    name: "아빠",
    icon: "👨",
    type: "어른"
  },

  {
    name: "엄마",
    icon: "👩",
    type: "어른"
  }

];


const platforms = [

  {
    name: "1번 승강장",
    id: "platform1",
    top: "14.7vh",
    left: "48vw"
  },

  {
    name: "2번 승강장",
    id: "platform2",
    top: "22.7vh",
    left: "54vw"
  },

  {
    name: "3번 승강장",
    id: "platform3",
    top: "30.7vh",
    left: "45vw"
  }

];


const extraPlaces = [

  {
    name: "대합실",
    top: "10vh",
    left: "18vw"
  },

  {
    name: "계단 앞",
    top: "14vh",
    left: "36vw"
  },

  {
    name: "전광판 앞",
    top: "9vh",
    left: "75vw"
  }

];


const trains = [
  "SRT",
  "KTX-산천"
];



function iconFor(name) {

  if (
    name === "SRT"
  ) {
    return "🚄";
  }


  if (
    name === "KTX-산천"
  ) {
    return "🚅";
  }


  if (
    name === "역무원"
  ) {
    return "👨‍✈️";
  }


  const person =
    people.find(
      item =>
        item.name === name
    );


  return person
    ? person.icon
    : "🎛️";
}



/* =========================
   DISPLAY HELPERS
========================= */

function clearHighlights() {

  [
    "platform1",
    "platform2",
    "platform3"
  ].forEach(
    id => {

      $(id)
        .classList
        .remove(
          "highlight-zone"
        );

    }
  );

}


function highlightPlace(
  place
) {

  clearHighlights();


  const platform =
    platforms.find(
      item =>
        item.name === place
    );


  if (platform) {

    $(platform.id)
      .classList
      .add(
        "highlight-zone"
      );

  }

}



function movePassenger(
  place
) {

  const platform =
    platforms.find(
      item =>
        item.name === place
    );


  const extra =
    extraPlaces.find(
      item =>
        item.name === place
    );


  const target =
    platform || extra;


  if (!target) {
    return;
  }


  $("passengerMarker")
    .style.top =
    target.top;


  $("passengerMarker")
    .style.left =
    target.left;

}



function setPerson(
  person
) {

  $("passengerIcon")
    .textContent =
    person.icon;


  $("passengerName")
    .textContent =
    person.name;

}



function setTrainStatus(
  train,
  text
) {

  if (
    train === "SRT"
  ) {

    $("srtBoard")
      .textContent =
      text;

  }

  else {

    $("ktxBoard")
      .textContent =
      text;

  }

}



/* =========================
   TRAIN MOVEMENT
========================= */

function resetTrains() {

  $("srt")
    .style.left =
    "4vw";


  $("srt")
    .style.top =
    "17.5vh";


  $("ktx")
    .style.left =
    "76vw";


  $("ktx")
    .style.top =
    "33.5vh";


  $("srt")
    .style.opacity =
    "1";


  $("ktx")
    .style.opacity =
    "1";


  setTrainStatus(
    "SRT",
    "대기"
  );


  setTrainStatus(
    "KTX-산천",
    "대기"
  );

}



function moveTrain(
  train,
  mode
) {

  if (
    train === "SRT"
  ) {

    if (
      mode === "arrive"
    ) {

      $("srt")
        .style.left =
        "40vw";


      setTrainStatus(
        "SRT",
        "도착"
      );

    }


    if (
      mode === "depart"
    ) {

      $("srt")
        .style.left =
        "86vw";


      setTrainStatus(
        "SRT",
        "출발"
      );

    }


    if (
      mode === "stop"
    ) {

      $("srt")
        .style.left =
        "41vw";


      setTrainStatus(
        "SRT",
        "정차"
      );

    }

  }


  else {

    if (
      mode === "arrive"
    ) {

      $("ktx")
        .style.left =
        "43vw";


      setTrainStatus(
        "KTX-산천",
        "도착"
      );

    }


    if (
      mode === "depart"
    ) {

      $("ktx")
        .style.left =
        "-20vw";


      setTrainStatus(
        "KTX-산천",
        "출발"
      );

    }


    if (
      mode === "stop"
    ) {

      $("ktx")
        .style.left =
        "48vw";


      setTrainStatus(
        "KTX-산천",
        "정차"
      );

    }

  }

}



/* =========================
   DIALOGUE
========================= */

function renderDialogue(
  dialogue
) {

  $("dialogueList")
    .innerHTML =
    "";


  dialogue.forEach(
    ([name, text]) => {

      const row =
        document.createElement(
          "div"
        );


      row.className =
        "dialogue-row";


      row.innerHTML = `

        <div class="dialogue-icon">
          ${iconFor(name)}
        </div>

        <div>

          <div class="dialogue-speaker">
            ${name}
          </div>

          <div class="dialogue-text">
            ${text}
          </div>

        </div>

      `;


      $("dialogueList")
        .appendChild(
          row
        );

    }
  );

}



/* =========================
   EVENT BUILDERS
========================= */

function lostChildEvent() {

  const child =
    random(
      people.filter(
        item =>
          item.type === "아이"
      )
    );


  const place =
    random(platforms);


  const train =
    random(trains);


  return {

    type:
      "미아 발생",

    badge:
      "👦 보호자를 잃어버린 아이",

    person:
      child,

    place:
      place.name,

    train,

    situation:
      `${child.name}가 ${place.name}에서 울고 있습니다. 잠깐 화장실에 다녀온 뒤 보호자가 보이지 않는다고 합니다.`,

    dialogue: [

      [
        child.name,
        "엄마가 안 보여요. 어디로 갔는지 모르겠어요."
      ],

      [
        "역무원",
        "관제실, 보호자를 찾지 못한 아이가 있습니다."
      ]

    ],

    questions: [

      {
        type:
          "WHO",

        text:
          "누가 도움을 요청하고 있나요?",

        answer:
          child.name,

        wrong:
          shuffle(
            people
              .filter(
                p =>
                  p.name !== child.name
              )
              .map(
                p =>
                  p.name
              )
          )
          .slice(
            0,
            3
          )
      },

      {
        type:
          "WHERE",

        text:
          `${child.name}는 어디에 있나요?`,

        answer:
          place.name,

        wrong:
          shuffle([
            "대합실",
            "계단 앞",
            ...platforms
              .filter(
                p =>
                  p.name !== place.name
              )
              .map(
                p =>
                  p.name
              )
          ])
          .slice(
            0,
            3
          )
      },

      {
        type:
          "WHY",

        text:
          `${child.name}는 왜 울고 있나요?`,

        answer:
          "보호자를 찾지 못해서요.",

        wrong: [
          "기차가 너무 빨라서요.",
          "표를 잃어버려서요.",
          "배가 고파서요."
        ]
      },

      {
        type:
          "ACTION",

        text:
          "관제사는 어떻게 조치하는 것이 좋을까요?",

        answer:
          "아이를 안전한 곳에서 보호하고 역무원에게 보호자 찾기를 요청해요.",

        wrong: [
          "아이 혼자 역 밖으로 나가서 보호자를 찾게 해요.",
          "아무 조치 없이 기차를 출발시켜요.",
          "아이에게 다른 승강장으로 가보라고 해요."
        ]
      }

    ],

    speak:
      `${child.name}야, 여기 안전한 곳에서 기다리자. 역무원과 함께 보호자를 찾아줄게.`,

    visualAction:
      () => {

        movePassenger(
          place.name
        );

        highlightPlace(
          place.name
        );

        moveTrain(
          train,
          "arrive"
        );

      }

  };

}



function wrongPlatformEvent() {

  const person =
    random(people);


  const current =
    random(platforms);


  const correct =
    random(
      platforms.filter(
        p =>
          p.name !== current.name
      )
    );


  const train =
    random(trains);


  return {

    type:
      "승강장 착오",

    badge:
      "🚉 승객이 승강장을 잘못 찾았어요",

    person,

    place:
      current.name,

    train,

    situation:
      `${person.name}가 ${current.name}에서 ${train}을 기다리고 있습니다. 하지만 ${train}은 ${correct.name}에서 출발할 예정입니다.`,

    dialogue: [

      [
        person.name,
        `${train}을 타려고 하는데 여기에서 기다리면 되나요?`
      ],

      [
        "역무원",
        `${train}은 ${correct.name}에서 출발합니다.`
      ]

    ],

    questions: [

      {
        type:
          "WHO",

        text:
          "누가 승강장을 잘못 찾았나요?",

        answer:
          person.name,

        wrong:
          shuffle(
            people
              .filter(
                p =>
                  p.name !== person.name
              )
              .map(
                p =>
                  p.name
              )
          )
          .slice(
            0,
            3
          )
      },

      {
        type:
          "WHAT",

        text:
          `${person.name}에게 어떤 문제가 생겼나요?`,

        answer:
          "타야 할 열차의 승강장을 잘못 찾았어요.",

        wrong: [
          "기차표를 잃어버렸어요.",
          "가방을 열차에 두고 내렸어요.",
          "보호자를 잃어버렸어요."
        ]
      },

      {
        type:
          "WHERE",

        text:
          `${train}은 어디에서 출발하나요?`,

        answer:
          correct.name,

        wrong:
          shuffle(
            platforms
              .filter(
                p =>
                  p.name !== correct.name
              )
              .map(
                p =>
                  p.name
              )
              .concat(
                ["대합실"]
              )
          )
          .slice(
            0,
            3
          )
      },

      {
        type:
          "ACTION",

        text:
          "관제사는 무엇을 안내해야 할까요?",

        answer:
          `${correct.name}으로 안전하게 이동하도록 안내해요.`,

        wrong: [
          "현재 승강장에서 계속 기다리라고 해요.",
          "역 밖으로 나가라고 해요.",
          "아무 열차나 타라고 해요."
        ]
      }

    ],

    speak:
      `${person.name}님, ${train}은 ${correct.name}에서 출발합니다. 안전하게 이동해 주세요.`,

    visualAction:
      () => {

        movePassenger(
          current.name
        );

        highlightPlace(
          current.name
        );

        moveTrain(
          train,
          "arrive"
        );

      }

  };

}



function fallenPassengerEvent() {

  const person =
    random(
      people.filter(
        p =>
          p.type === "어르신"
      )
    );


  const place =
    random([
      random(platforms).name,
      "계단 앞"
    ]);


  return {

    type:
      "승객 넘어짐",

    badge:
      "🩹 승객이 넘어졌어요",

    person,

    place,

    train:
      random(trains),

    situation:
      `${person.name}가 ${place}에서 발을 헛디뎌 넘어졌습니다. 혼자 바로 일어나기 어려워 보입니다.`,

    dialogue: [

      [
        person.name,
        "아이고, 다리가 조금 아파요."
      ],

      [
        "역무원",
        "관제실, 도움이 필요한 승객이 있습니다."
      ]

    ],

    questions: [

      {
        type:
          "WHO",

        text:
          "누가 넘어졌나요?",

        answer:
          person.name,

        wrong: [
          "민수",
          "지우",
          "역무원"
        ]
      },

      {
        type:
          "WHERE",

        text:
          `${person.name}는 어디에서 넘어졌나요?`,

        answer:
          place,

        wrong: shuffle([
          "대합실",
          "전광판 앞",
          "1번 승강장",
          "2번 승강장",
          "3번 승강장"
        ])
        .filter(
          item =>
            item !== place
        )
        .slice(
          0,
          3
        )
      },

      {
        type:
          "WHAT",

        text:
          "어떤 일이 생겼나요?",

        answer:
          `${person.name}가 넘어져서 도움이 필요해요.`,

        wrong: [
          `${person.name}가 열차를 잘못 탔어요.`,
          `${person.name}가 표를 잃어버렸어요.`,
          `${person.name}가 보호자를 잃어버렸어요.`
        ]
      },

      {
        type:
          "ACTION",

        text:
          "가장 적절한 조치는 무엇일까요?",

        answer:
          "안전한 상태인지 확인하고 역무원에게 도움을 요청해요.",

        wrong: [
          "혼자 바로 걸어가라고 해요.",
          "아무 일 없는 것처럼 기차를 출발시켜요.",
          "다른 승강장으로 이동하라고 해요."
        ]
      }

    ],

    speak:
      `${person.name}님, 움직이지 마시고 잠시 기다려 주세요. 역무원이 도와드릴게요.`,

    visualAction:
      () => {

        movePassenger(
          place
        );

        highlightPlace(
          place
        );

      }

  };

}



function bagLeftOnTrainEvent() {

  const person =
    random(people);


  const train =
    random(trains);


  const platform =
    random(platforms);


  return {

    type:
      "분실물",

    badge:
      "👜 열차에 가방을 두고 내렸어요",

    person,

    place:
      platform.name,

    train,

    situation:
      `${person.name}가 ${platform.name}에서 내린 뒤 ${train} 안에 가방을 두고 내린 것을 알게 되었습니다.`,

    dialogue: [

      [
        person.name,
        "제 가방을 열차 안에 두고 내렸어요!"
      ],

      [
        "역무원",
        `${train}이 아직 역을 완전히 출발하지 않았습니다.`
      ]

    ],

    questions: [

      {
        type:
          "WHO",

        text:
          "누가 가방을 두고 내렸나요?",

        answer:
          person.name,

        wrong:
          shuffle(
            people
              .filter(
                p =>
                  p.name !== person.name
              )
              .map(
                p =>
                  p.name
              )
          )
          .slice(
            0,
            3
          )
      },

      {
        type:
          "WHAT",

        text:
          "무엇을 잃어버렸나요?",

        answer:
          "가방",

        wrong: [
          "기차표",
          "우산",
          "신발"
        ]
      },

      {
        type:
          "WHERE",

        text:
          "가방은 어디에 있나요?",

        answer:
          `${train} 안`,

        wrong: [
          "대합실",
          `${platform.name} 바닥`,
          "화장실"
        ]
      },

      {
        type:
          "ACTION",

        text:
          "관제사는 어떻게 해야 할까요?",

        answer:
          "승객이 직접 선로로 가지 않게 하고 역무원에게 분실물 확인을 요청해요.",

        wrong: [
          "승객이 열차를 직접 따라가게 해요.",
          "선로로 내려가 찾아보라고 해요.",
          "아무 조치도 하지 않아요."
        ]
      }

    ],

    speak:
      `${person.name}님, 직접 열차를 따라가지 마세요. 역무원이 가방을 확인해드릴게요.`,

    visualAction:
      () => {

        movePassenger(
          platform.name
        );

        highlightPlace(
          platform.name
        );

        moveTrain(
          train,
          "stop"
        );

      }

  };

}



function safetyLineEvent() {

  const child =
    random(
      people.filter(
        p =>
          p.type === "아이"
      )
    );


  const platform =
    random(platforms);


  const train =
    random(trains);


  return {

    type:
      "안전선 위험",

    badge:
      "⚠️ 안전선 가까이에 아이가 있어요",

    person:
      child,

    place:
      platform.name,

    train,

    situation:
      `${child.name}가 ${platform.name}의 노란 안전선 바로 옆에서 열차를 기다리고 있습니다. ${train}이 곧 들어올 예정입니다.`,

    dialogue: [

      [
        child.name,
        "기차가 가까이 오는 걸 보고 싶어요!"
      ],

      [
        "역무원",
        `${train} 진입 예정입니다. 안전선 뒤로 이동해야 합니다.`
      ]

    ],

    questions: [

      {
        type:
          "WHO",

        text:
          "누가 안전선 가까이에 있나요?",

        answer:
          child.name,

        wrong: [
          "역무원",
          "할머니",
          "할아버지"
        ]
      },

      {
        type:
          "WHERE",

        text:
          `${child.name}는 어디에 있나요?`,

        answer:
          platform.name,

        wrong:
          shuffle(
            platforms
              .filter(
                p =>
                  p.name !== platform.name
              )
              .map(
                p =>
                  p.name
              )
              .concat(
                ["대합실"]
              )
          )
          .slice(
            0,
            3
          )
      },

      {
        type:
          "WHY",

        text:
          "왜 위험한 상황인가요?",

        answer:
          `${train}이 들어오는데 안전선 너무 가까이에 있기 때문이에요.`,

        wrong: [
          "기차역이 너무 넓기 때문이에요.",
          "표를 잃어버렸기 때문이에요.",
          "승강장 번호가 많기 때문이에요."
        ]
      },

      {
        type:
          "ACTION",

        text:
          "관제사는 어떻게 안내해야 할까요?",

        answer:
          "안전선 뒤로 물러나도록 바로 안내해요.",

        wrong: [
          "열차를 더 가까이에서 보게 해요.",
          "선로 쪽으로 한 걸음 더 가라고 해요.",
          "아무 말도 하지 않아요."
        ]
      }

    ],

    speak:
      `${child.name}야, 기차가 들어오고 있어. 노란 안전선 뒤로 물러나 주세요.`,

    visualAction:
      () => {

        movePassenger(
          platform.name
        );

        highlightPlace(
          platform.name
        );

        moveTrain(
          train,
          "arrive"
        );

      }

  };

}



function signalProblemEvent() {

  const train =
    random(trains);


  const platform =
    random(platforms);


  return {

    type:
      "신호 문제",

    badge:
      "🚦 열차가 신호 때문에 정차했어요",

    person:
      {
        name:
          `${train} 기관사`,

        icon:
          train === "SRT"
            ? "🚄"
            : "🚅"
      },

    place:
      platform.name,

    train,

    situation:
      `${train}이 ${platform.name} 근처에서 빨간 신호 때문에 멈춰 있습니다. 승객들은 왜 열차가 움직이지 않는지 궁금해합니다.`,

    dialogue: [

      [
        train,
        "관제실, 신호가 빨간색이라 정차 중입니다."
      ],

      [
        "역무원",
        "승객들에게 정차 이유를 안내해야 합니다."
      ]

    ],

    questions: [

      {
        type:
          "WHAT",

        text:
          `${train}에는 어떤 일이 생겼나요?`,

        answer:
          "빨간 신호 때문에 열차가 멈췄어요.",

        wrong: [
          "승객이 가방을 잃어버렸어요.",
          "열차가 다른 역에 도착했어요.",
          "승객이 승강장을 잘못 찾았어요."
        ]
      },

      {
        type:
          "WHERE",

        text:
          `${train}은 어디에서 정차하고 있나요?`,

        answer:
          `${platform.name} 근처`,

        wrong:
          shuffle([
            "대합실",
            "주차장",
            "역 밖",
            ...platforms
              .filter(
                p =>
                  p.name !== platform.name
              )
              .map(
                p =>
                  `${p.name} 근처`
              )
          ])
          .slice(
            0,
            3
          )
      },

      {
        type:
          "WHY",

        text:
          "왜 열차가 움직이지 않나요?",

        answer:
          "신호가 빨간색이기 때문이에요.",

        wrong: [
          "승객이 모두 잠들었기 때문이에요.",
          "기차역이 너무 커서요.",
          "승강장에 사람이 없어서요."
        ]
      },

      {
        type:
          "ACTION",

        text:
          "관제사는 승객들에게 어떻게 안내하면 좋을까요?",

        answer:
          "안전을 위해 잠시 정차 중이라고 이유를 설명하고 기다려 달라고 안내해요.",

        wrong: [
          "아무 설명 없이 기다리게 해요.",
          "열차에서 모두 내리라고 해요.",
          "빨간 신호를 지나가라고 해요."
        ]
      }

    ],

    speak:
      `승객 여러분, 안전을 위해 ${train}이 잠시 정차하고 있습니다. 신호가 바뀔 때까지 기다려 주세요.`,

    visualAction:
      () => {

        highlightPlace(
          platform.name
        );

        moveTrain(
          train,
          "stop"
        );


        if (
          train === "SRT"
        ) {

          $("signalA")
            .className =
            "rail-signal signal-a red";

        }

        else {

          $("signalB")
            .className =
            "rail-signal signal-b red";

        }

      }

  };

}



/* =========================
   EVENT LIST
========================= */

const eventFactories = [

  lostChildEvent,

  wrongPlatformEvent,

  fallenPassengerEvent,

  bagLeftOnTrainEvent,

  safetyLineEvent,

  signalProblemEvent

];



function getEvent() {

  if (
    usedEventTypes.length >=
    eventFactories.length
  ) {

    usedEventTypes = [];

  }


  let number;


  do {

    number =
      Math.floor(
        Math.random() *
        eventFactories.length
      );

  }

  while (
    usedEventTypes.includes(
      number
    )
  );


  usedEventTypes.push(
    number
  );


  return eventFactories[number]();

}



/* =========================
   LOAD EVENT
========================= */

function loadEvent() {

  currentQuestionIndex = 0;

  answered = false;

  spoken = false;


  resetTrains();

  clearHighlights();


  $("signalA")
    .className =
    "rail-signal signal-a green";


  $("signalB")
    .className =
    "rail-signal signal-b red";


  currentEvent =
    getEvent();


  $("roundText")
    .textContent =
    round;


  $("eventBadge")
    .textContent =
    currentEvent.badge;


  $("situationText")
    .textContent =
    currentEvent.situation;


  if (
    currentEvent.person &&
    currentEvent.person.icon
  ) {

    $("passengerIcon")
      .textContent =
      currentEvent.person.icon;


    $("passengerName")
      .textContent =
      currentEvent.person.name;

  }


  renderDialogue(
    currentEvent.dialogue
  );


  currentEvent
    .visualAction();


  renderQuestion();

}



/* =========================
   QUESTION
========================= */

function renderQuestion() {

  answered = false;


  currentQuestion =
    currentEvent
      .questions[
        currentQuestionIndex
      ];


  const typeClass =
    currentQuestion.type
      .toLowerCase();


  $("questionType")
    .className =
    `question-type ${typeClass}`;


  const labels = {

    WHO:
      "WHO · 누구?",

    WHERE:
      "WHERE · 어디?",

    WHAT:
      "WHAT · 어떤 일?",

    WHY:
      "WHY · 왜?",

    ACTION:
      "ACTION · 어떻게?"

  };


  $("questionType")
    .textContent =
    labels[
      currentQuestion.type
    ];


  $("questionText")
    .textContent =
    currentQuestion.text;


  $("progressText")
    .textContent =
    `질문 ${currentQuestionIndex + 1} / ${currentEvent.questions.length}`;


  $("feedback")
    .textContent =
    "상황을 다시 생각해보고 골라보세요.";


  $("speakPrompt")
    .textContent =
    "질문을 모두 해결하면 관제사 말하기를 해요.";


  $("speakDoneBtn")
    .disabled =
    true;


  $("nextBtn")
    .disabled =
    true;


  $("nextBtn")
    .textContent =
    currentQuestionIndex ===
    currentEvent.questions.length - 1
      ? "관제 말하기 ▶"
      : "다음 질문 ▶";


  const options =
    shuffle([

      currentQuestion.answer,

      ...currentQuestion.wrong

    ]);


  $("choices")
    .innerHTML =
    "";


  options.forEach(
    text => {

      const button =
        document.createElement(
          "button"
        );


      button.className =
        "choice";


      button.textContent =
        text;


      button.onclick =
        () =>
          selectAnswer(
            button,
            text
          );


      $("choices")
        .appendChild(
          button
        );

    }
  );

}



/* =========================
   ANSWER
========================= */

function selectAnswer(
  button,
  text
) {

  if (
    answered
  ) {

    return;

  }


  answered = true;


  const buttons =
    [
      ...document
        .querySelectorAll(
          ".choice"
        )
    ];


  if (
    text ===
    currentQuestion.answer
  ) {

    button
      .classList
      .add(
        "correct"
      );


    stars += 2;


    $("feedback")
      .textContent =
      "✅ 좋아요! 상황을 잘 이해했어요.";

  }


  else {

    button
      .classList
      .add(
        "wrong"
      );


    const correctButton =
      buttons.find(
        item =>
          item.textContent ===
          currentQuestion.answer
      );


    if (
      correctButton
    ) {

      correctButton
        .classList
        .add(
          "correct"
        );

    }


    stars += 1;


    $("feedback")
      .textContent =
      "💡 초록색 답을 보고 상황을 다시 생각해봐요.";

  }


  $("starText")
    .textContent =
    stars;


  if (
    currentQuestionIndex ===
    currentEvent.questions.length - 1
  ) {

    $("speakPrompt")
      .textContent =
      currentEvent.speak;


    $("speakDoneBtn")
      .disabled =
      false;


    $("nextBtn")
      .disabled =
      true;

  }


  else {

    $("nextBtn")
      .disabled =
      false;

  }

}



/* =========================
   SPEAK
========================= */

$("speakDoneBtn")
  .onclick =
  function() {

    if (
      spoken
    ) {

      return;

    }


    spoken = true;


    talkScore += 2;


    $("talkText")
      .textContent =
      talkScore;


    $("speakDoneBtn")
      .textContent =
      "👍 잘했어요!";


    $("speakDoneBtn")
      .disabled =
      true;


    $("nextBtn")
      .disabled =
      false;


    $("nextBtn")
      .textContent =
      "다음 사건 ▶";


    $("feedback")
      .textContent =
      "🌟 관제 성공! 다음 사건으로 이동해요.";

  };



/* =========================
   NEXT
========================= */

$("nextBtn")
  .onclick =
  function() {

    if (
      currentQuestionIndex <
      currentEvent.questions.length - 1
    ) {

      currentQuestionIndex++;


      renderQuestion();


      return;

    }


    if (
      !spoken
    ) {

      return;

    }


    if (
      round >= TOTAL_ROUNDS
    ) {

      finishGame();


      return;

    }


    round++;


    $("speakDoneBtn")
      .textContent =
      "말했어요!";


    loadEvent();

  };



/* =========================
   FINISH
========================= */

function finishGame() {

  $("resultText")
    .innerHTML = `

      🚉 해결한 역 사건
      <b>${TOTAL_ROUNDS}</b>건

      <br><br>

      ⭐ 상황 이해 점수
      <b>${stars}</b>

      <br><br>

      💬 관제 말하기 점수
      <b>${talkScore}</b>

      <br><br>

      WHO · WHERE · WHAT · WHY · ACTION을
      모두 연습했어요!

    `;


  $("finishModal")
    .classList
    .remove(
      "hidden"
    );

}



/* =========================
   RESTART
========================= */

$("restartBtn")
  .onclick =
  function() {

    round = 1;

    stars = 0;

    talkScore = 0;

    usedEventTypes = [];


    $("starText")
      .textContent =
      "0";


    $("talkText")
      .textContent =
      "0";


    $("speakDoneBtn")
      .textContent =
      "말했어요!";


    $("finishModal")
      .classList
      .add(
        "hidden"
      );


    loadEvent();

  };



/* =========================
   START
========================= */

loadEvent();