const $ = id =>
  document.getElementById(id);


const random = arr =>
  arr[Math.floor(Math.random() * arr.length)];


const shuffle = arr =>
  [...arr].sort(() => Math.random() - 0.5);


const TOTAL_ROUNDS = 10;


let round = 1;
let score = 0;
let talkScore = 0;

let questionIndex = 0;

let answered = false;
let spoken = false;

let currentEvent = null;
let currentQuestion = null;


/* =========================
   BASIC DATA
========================= */

const people = [
  {
    name: "민수",
    icon: "👦"
  },
  {
    name: "지우",
    icon: "👧"
  },
  {
    name: "할머니",
    icon: "👵"
  },
  {
    name: "할아버지",
    icon: "👴"
  },
  {
    name: "엄마",
    icon: "👩"
  },
  {
    name: "아빠",
    icon: "👨"
  }
];


const children = [
  {
    name: "민수",
    icon: "👦"
  },
  {
    name: "지우",
    icon: "👧"
  }
];


const elderly = [
  {
    name: "할머니",
    icon: "👵"
  },
  {
    name: "할아버지",
    icon: "👴"
  }
];


const platforms = [
  "1번 승강장",
  "2번 승강장",
  "3번 승강장"
];


const trains = [
  "SRT",
  "KTX-산천"
];


/* =========================
   WORLD
========================= */

function resetWorld() {

  $("srt").style.left = "4vw";

  $("ktx").style.left = "73vw";

  $("srtStatus").textContent = "대기";

  $("ktxStatus").textContent = "대기";


  document
    .querySelectorAll(".platform")
    .forEach(
      platform => {

        platform
          .classList
          .remove("active");

      }
    );

}


function platformElement(name) {

  if (name === "1번 승강장") {
    return document.querySelector(".p1");
  }

  if (name === "2번 승강장") {
    return document.querySelector(".p2");
  }

  return document.querySelector(".p3");

}


function highlightPlatform(name) {

  document
    .querySelectorAll(".platform")
    .forEach(
      p =>
        p.classList.remove("active")
    );


  const target =
    platformElement(name);


  if (target) {

    target
      .classList
      .add("active");

  }

}


function movePerson(person, place) {

  $("personIcon").textContent =
    person.icon;


  $("personName").textContent =
    person.name;


  const positions = {

    "1번 승강장": {
      top: "13.2vh",
      left: "48vw"
    },

    "2번 승강장": {
      top: "21.2vh",
      left: "53vw"
    },

    "3번 승강장": {
      top: "29.2vh",
      left: "46vw"
    },

    "대합실": {
      top: "8.5vh",
      left: "19vw"
    },

    "계단 앞": {
      top: "10.5vh",
      left: "36vw"
    }

  };


  const position =
    positions[place] ||
    positions["2번 승강장"];


  $("person").style.top =
    position.top;


  $("person").style.left =
    position.left;

}


function moveTrain(train, state) {

  if (train === "SRT") {

    if (state === "arrive") {

      $("srt").style.left = "41vw";

      $("srtStatus").textContent =
        "도착";

    }


    if (state === "stop") {

      $("srt").style.left = "45vw";

      $("srtStatus").textContent =
        "정차";

    }


    if (state === "depart") {

      $("srt").style.left = "90vw";

      $("srtStatus").textContent =
        "출발";

    }

  }


  if (train === "KTX-산천") {

    if (state === "arrive") {

      $("ktx").style.left = "44vw";

      $("ktxStatus").textContent =
        "도착";

    }


    if (state === "stop") {

      $("ktx").style.left = "48vw";

      $("ktxStatus").textContent =
        "정차";

    }


    if (state === "depart") {

      $("ktx").style.left = "-20vw";

      $("ktxStatus").textContent =
        "출발";

    }

  }

}


/* =========================
   EVENT 1
========================= */

function lostChildEvent() {

  const child = random(children);

  const platform = random(platforms);

  const train = random(trains);


  return {

    title:
      "👦 보호자를 잃어버린 아이",

    person:
      child,

    platform,

    train,

    story:
      `${child.name}가 ${platform}에서 울고 있습니다. 화장실에 다녀온 뒤 보호자가 보이지 않는다고 합니다.`,

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
        type: "WHO",
        label: "WHO · 누구?",
        question:
          "누가 도움을 요청하고 있나요?",
        correct:
          child.name,
        wrong: [
          "역무원",
          "할머니",
          "할아버지"
        ]
      },

      {
        type: "WHERE",
        label: "WHERE · 어디?",
        question:
          `${child.name}는 어디에 있나요?`,
        correct:
          platform,
        wrong:
          shuffle([
            "대합실",
            ...platforms.filter(
              item =>
                item !== platform
            )
          ]).slice(0,3)
      },

      {
        type: "WHY",
        label: "WHY · 왜?",
        question:
          `${child.name}는 왜 울고 있나요?`,
        correct:
          "보호자를 찾지 못해서요.",
        wrong: [
          "기차가 늦어서요.",
          "표가 없어서요.",
          "배가 고파서요."
        ]
      },

      {
        type: "ACTION",
        label: "ACTION · 어떻게?",
        question:
          "관제사는 어떻게 해야 할까요?",
        correct:
          "아이를 안전한 곳에서 보호하고 역무원이 보호자를 찾게 해요.",
        wrong: [
          "아이 혼자 역 밖으로 나가게 해요.",
          "다른 승강장으로 가보라고 해요.",
          "아무 조치를 하지 않아요."
        ]
      }

    ],

    speak:
      `${child.name}야, 여기 안전한 곳에서 기다리자. 역무원과 함께 보호자를 찾아줄게.`,

    run:
      function() {

        movePerson(
          child,
          platform
        );

        highlightPlatform(
          platform
        );

        moveTrain(
          train,
          "arrive"
        );

      }

  };

}


/* =========================
   EVENT 2
========================= */

function wrongPlatformEvent() {

  const person = random(people);

  const current =
    random(platforms);

  const correctPlatform =
    random(
      platforms.filter(
        p =>
          p !== current
      )
    );

  const train =
    random(trains);


  return {

    title:
      "🚉 승강장을 잘못 찾았어요",

    person,

    platform:
      current,

    train,

    story:
      `${person.name}가 ${current}에서 ${train}을 기다리고 있습니다. 하지만 ${train}은 ${correctPlatform}에서 출발합니다.`,

    dialogue: [
      [
        person.name,
        `${train}을 타려고 하는데 여기에서 기다리면 되나요?`
      ],
      [
        "역무원",
        `${train}은 ${correctPlatform}에서 출발합니다.`
      ]
    ],

    questions: [

      {
        type: "WHO",
        label: "WHO · 누구?",
        question:
          "누가 승강장을 잘못 찾았나요?",
        correct:
          person.name,
        wrong:
          shuffle(
            people
              .filter(
                p =>
                  p.name !== person.name
              )
              .map(
                p => p.name
              )
          ).slice(0,3)
      },

      {
        type: "WHAT",
        label: "WHAT · 어떤 일?",
        question:
          "어떤 문제가 생겼나요?",
        correct:
          "타야 할 열차의 승강장을 잘못 찾았어요.",
        wrong: [
          "가방을 잃어버렸어요.",
          "열차가 고장 났어요.",
          "보호자를 잃어버렸어요."
        ]
      },

      {
        type: "WHERE",
        label: "WHERE · 어디?",
        question:
          `${train}은 어디에서 출발하나요?`,
        correct:
          correctPlatform,
        wrong:
          shuffle([
            "대합실",
            ...platforms.filter(
              p =>
                p !== correctPlatform
            )
          ]).slice(0,3)
      },

      {
        type: "ACTION",
        label: "ACTION · 어떻게?",
        question:
          "관제사는 무엇을 안내해야 할까요?",
        correct:
          `${correctPlatform}으로 안전하게 이동하도록 알려줘요.`,
        wrong: [
          "현재 승강장에서 계속 기다리게 해요.",
          "아무 열차나 타라고 해요.",
          "역 밖으로 나가라고 해요."
        ]
      }

    ],

    speak:
      `${person.name}님, ${train}은 ${correctPlatform}에서 출발합니다. 안전하게 이동해 주세요.`,

    run:
      function() {

        movePerson(
          person,
          current
        );

        highlightPlatform(
          current
        );

        moveTrain(
          train,
          "arrive"
        );

      }

  };

}


/* =========================
   EVENT 3
========================= */

function safetyLineEvent() {

  const child =
    random(children);

  const platform =
    random(platforms);

  const train =
    random(trains);


  return {

    title:
      "⚠️ 안전선 가까이에 아이가 있어요",

    person:
      child,

    platform,

    train,

    story:
      `${child.name}가 ${platform}의 노란 안전선 바로 옆에 서 있습니다. ${train}이 곧 들어옵니다.`,

    dialogue: [
      [
        child.name,
        "기차가 가까이 오는 걸 보고 싶어요!"
      ],
      [
        "역무원",
        `${train}이 진입합니다. 안전선 뒤로 이동해야 합니다.`
      ]
    ],

    questions: [

      {
        type: "WHO",
        label: "WHO · 누구?",
        question:
          "누가 안전선 가까이에 있나요?",
        correct:
          child.name,
        wrong: [
          "역무원",
          "할머니",
          "할아버지"
        ]
      },

      {
        type: "WHERE",
        label: "WHERE · 어디?",
        question:
          `${child.name}는 어디에 있나요?`,
        correct:
          platform,
        wrong:
          shuffle([
            "대합실",
            ...platforms.filter(
              p =>
                p !== platform
            )
          ]).slice(0,3)
      },

      {
        type: "WHY",
        label: "WHY · 왜?",
        question:
          "왜 위험한 상황인가요?",
        correct:
          `${train}이 들어오는데 안전선 가까이에 있기 때문이에요.`,
        wrong: [
          "기차역이 너무 넓기 때문이에요.",
          "표를 잃어버렸기 때문이에요.",
          "역무원이 없기 때문이에요."
        ]
      },

      {
        type: "ACTION",
        label: "ACTION · 어떻게?",
        question:
          "관제사는 어떻게 안내해야 할까요?",
        correct:
          "노란 안전선 뒤로 물러나라고 안내해요.",
        wrong: [
          "기차를 더 가까이에서 보라고 해요.",
          "선로 쪽으로 한 걸음 더 가라고 해요.",
          "아무 말도 하지 않아요."
        ]
      }

    ],

    speak:
      `${child.name}야, 기차가 들어오고 있어. 노란 안전선 뒤로 물러나 주세요.`,

    run:
      function() {

        movePerson(
          child,
          platform
        );

        highlightPlatform(
          platform
        );

        moveTrain(
          train,
          "arrive"
        );

      }

  };

}


/* =========================
   EVENT 4
========================= */

function fallenEvent() {

  const person =
    random(elderly);

  const place =
    random([
      "1번 승강장",
      "2번 승강장",
      "3번 승강장",
      "계단 앞"
    ]);


  return {

    title:
      "🩹 승객이 넘어졌어요",

    person,

    platform:
      place,

    train:
      random(trains),

    story:
      `${person.name}가 ${place}에서 발을 헛디뎌 넘어졌습니다. 혼자 일어나기 어려워 보입니다.`,

    dialogue: [
      [
        person.name,
        "아이고, 다리가 아파요."
      ],
      [
        "역무원",
        "관제실, 도움이 필요한 승객이 있습니다."
      ]
    ],

    questions: [

      {
        type: "WHO",
        label: "WHO · 누구?",
        question:
          "누가 넘어졌나요?",
        correct:
          person.name,
        wrong: [
          "민수",
          "지우",
          "역무원"
        ]
      },

      {
        type: "WHERE",
        label: "WHERE · 어디?",
        question:
          `${person.name}는 어디에서 넘어졌나요?`,
        correct:
          place,
        wrong:
          shuffle([
            "대합실",
            "1번 승강장",
            "2번 승강장",
            "3번 승강장"
          ])
          .filter(
            p => p !== place
          )
          .slice(0,3)
      },

      {
        type: "WHAT",
        label: "WHAT · 어떤 일?",
        question:
          "어떤 일이 생겼나요?",
        correct:
          `${person.name}가 넘어져 도움이 필요해요.`,
        wrong: [
          "열차를 잘못 탔어요.",
          "가방을 잃어버렸어요.",
          "기차표가 없어요."
        ]
      },

      {
        type: "ACTION",
        label: "ACTION · 어떻게?",
        question:
          "관제사는 어떻게 해야 할까요?",
        correct:
          "움직이지 않도록 안내하고 역무원에게 도움을 요청해요.",
        wrong: [
          "혼자 걸어가라고 해요.",
          "다른 승강장으로 이동하라고 해요.",
          "아무 조치도 하지 않아요."
        ]
      }

    ],

    speak:
      `${person.name}님, 움직이지 마시고 잠시 기다려 주세요. 역무원이 도와드릴게요.`,

    run:
      function() {

        movePerson(
          person,
          place
        );

        if (
          platforms.includes(place)
        ) {

          highlightPlatform(
            place
          );

        }

      }

  };

}


/* =========================
   EVENT 5
========================= */

function lostBagEvent() {

  const person =
    random(people);

  const platform =
    random(platforms);

  const train =
    random(trains);


  return {

    title:
      "👜 열차에 가방을 두고 내렸어요",

    person,

    platform,

    train,

    story:
      `${person.name}가 ${platform}에서 내린 뒤 ${train} 안에 가방을 두고 내린 것을 알게 되었습니다.`,

    dialogue: [
      [
        person.name,
        "가방을 기차 안에 두고 내렸어요!"
      ],
      [
        "역무원",
        `${train}이 아직 역에 정차하고 있습니다.`
      ]
    ],

    questions: [

      {
        type: "WHO",
        label: "WHO · 누구?",
        question:
          "누가 가방을 두고 내렸나요?",
        correct:
          person.name,
        wrong:
          shuffle(
            people
              .filter(
                p =>
                  p.name !== person.name
              )
              .map(
                p => p.name
              )
          ).slice(0,3)
      },

      {
        type: "WHAT",
        label: "WHAT · 어떤 것?",
        question:
          "무엇을 두고 내렸나요?",
        correct:
          "가방",
        wrong: [
          "우산",
          "신발",
          "기차표"
        ]
      },

      {
        type: "WHERE",
        label: "WHERE · 어디?",
        question:
          "가방은 어디에 있나요?",
        correct:
          `${train} 안`,
        wrong: [
          "대합실",
          "화장실",
          `${platform} 바닥`
        ]
      },

      {
        type: "ACTION",
        label: "ACTION · 어떻게?",
        question:
          "관제사는 어떻게 해야 할까요?",
        correct:
          "승객이 직접 열차를 따라가지 않게 하고 역무원에게 확인을 요청해요.",
        wrong: [
          "선로로 내려가 찾게 해요.",
          "열차를 직접 따라가게 해요.",
          "아무것도 하지 않아요."
        ]
      }

    ],

    speak:
      `${person.name}님, 열차를 직접 따라가지 마세요. 역무원이 가방을 확인해드릴게요.`,

    run:
      function() {

        movePerson(
          person,
          platform
        );

        highlightPlatform(
          platform
        );

        moveTrain(
          train,
          "stop"
        );

      }

  };

}


/* =========================
   EVENT LIST
========================= */

const eventFactories = [
  lostChildEvent,
  wrongPlatformEvent,
  safetyLineEvent,
  fallenEvent,
  lostBagEvent
];


function createEvent() {

  return random(
    eventFactories
  )();

}


/* =========================
   DIALOGUE
========================= */

function renderDialogue(dialogue) {

  $("dialogueBox").innerHTML = "";


  dialogue.forEach(
    item => {

      const line =
        document.createElement("div");


      line.className =
        "dialogue";


      line.innerHTML =
        `<b>${item[0]}</b><br>${item[1]}`;


      $("dialogueBox")
        .appendChild(line);

    }
  );

}


/* =========================
   EVENT
========================= */

function loadEvent() {

  resetWorld();


  answered = false;

  spoken = false;

  questionIndex = 0;


  currentEvent =
    createEvent();


  $("roundText").textContent =
    round;


  $("eventBadge").textContent =
    currentEvent.title;


  $("storyText").textContent =
    currentEvent.story;


  renderDialogue(
    currentEvent.dialogue
  );


  currentEvent.run();


  $("speakBtn").textContent =
    "말했어요!";


  renderQuestion();

}


/* =========================
   QUESTION
========================= */

function renderQuestion() {

  answered = false;


  currentQuestion =
    currentEvent.questions[
      questionIndex
    ];


  $("questionType").textContent =
    currentQuestion.label;


  $("questionText").textContent =
    currentQuestion.question;


  $("progressText").textContent =
    `질문 ${questionIndex + 1} / ${currentEvent.questions.length}`;


  $("feedback").textContent =
    "상황을 생각하고 알맞은 답을 골라보세요.";


  $("speakText").textContent =
    "질문을 모두 해결하면 직접 말해요.";


  $("speakBtn").disabled =
    true;


  $("nextBtn").disabled =
    true;


  $("nextBtn").textContent =
    "다음 질문 ▶";


  const answers =
    shuffle([
      currentQuestion.correct,
      ...currentQuestion.wrong
    ]);


  $("choiceBox").innerHTML =
    "";


  answers.forEach(
    answer => {

      const button =
        document.createElement(
          "button"
        );


      button.className =
        "choice";


      button.textContent =
        answer;


      button.onclick =
        () =>
          chooseAnswer(
            button,
            answer
          );


      $("choiceBox")
        .appendChild(
          button
        );

    }
  );

}


/* =========================
   ANSWER
========================= */

function chooseAnswer(
  button,
  answer
) {

  if (answered) {
    return;
  }


  answered = true;


  const buttons =
    [
      ...document
        .querySelectorAll(".choice")
    ];


  if (
    answer ===
    currentQuestion.correct
  ) {

    button
      .classList
      .add("correct");


    score += 2;


    $("feedback").textContent =
      "✅ 맞았어요! 상황을 잘 이해했어요.";

  }

  else {

    button
      .classList
      .add("wrong");


    const correctButton =
      buttons.find(
        b =>
          b.textContent ===
          currentQuestion.correct
      );


    if (correctButton) {

      correctButton
        .classList
        .add("correct");

    }


    score += 1;


    $("feedback").textContent =
      "💡 초록색 답을 다시 한번 확인해봐요.";

  }


  $("scoreText").textContent =
    score;


  const last =
    questionIndex ===
    currentEvent.questions.length - 1;


  if (last) {

    $("speakText").textContent =
      currentEvent.speak;


    $("speakBtn").disabled =
      false;


    $("nextBtn").disabled =
      true;

  }

  else {

    $("nextBtn").disabled =
      false;

  }

}


/* =========================
   NEXT
========================= */

$("nextBtn").onclick =
function() {

  const last =
    questionIndex ===
    currentEvent.questions.length - 1;


  if (!last) {

    questionIndex++;

    renderQuestion();

    return;

  }


  if (!spoken) {
    return;
  }


  if (
    round >= TOTAL_ROUNDS
  ) {

    finishGame();

    return;

  }


  round++;

  loadEvent();

};


/* =========================
   SPEAK
========================= */

$("speakBtn").onclick =
function() {

  if (spoken) {
    return;
  }


  spoken = true;


  talkScore += 2;


  $("talkText").textContent =
    talkScore;


  $("speakBtn").textContent =
    "👍 잘했어요";


  $("speakBtn").disabled =
    true;


  $("feedback").textContent =
    "🌟 관제 성공! 다음 사건으로 가요.";


  $("nextBtn").textContent =
    "다음 사건 ▶";


  $("nextBtn").disabled =
    false;

};


/* =========================
   FINISH
========================= */

function finishGame() {

  $("result").innerHTML =
    `
    🚨 해결한 사건 <b>${TOTAL_ROUNDS}</b>건
    <br><br>
    ⭐ 상황 이해 점수 <b>${score}</b>
    <br>
    💬 관제 말하기 점수 <b>${talkScore}</b>
    <br><br>
    WHO · WHERE · WHAT · WHY · ACTION을 모두 연습했어요!
    `;


  $("finish")
    .classList
    .remove("hidden");

}


/* =========================
   RESTART
========================= */

$("restartBtn").onclick =
function() {

  round = 1;

  score = 0;

  talkScore = 0;


  $("scoreText").textContent =
    "0";


  $("talkText").textContent =
    "0";


  $("finish")
    .classList
    .add("hidden");


  loadEvent();

};


/* =========================
   START
========================= */

loadEvent();
