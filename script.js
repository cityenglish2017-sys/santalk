/* =========================================================
   창원중앙역 어린이 관제사
   CONTENT EXPANDED VERSION
   Korean Particle Auto Correction
========================================================= */

const $ = id => document.getElementById(id);

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

let usedEventIndexes = [];


/* =========================================================
   한국어 조사 자동 처리
========================================================= */

function getLastHangulChar(text) {

  const chars = [...String(text)].reverse();

  return chars.find(char => {

    const code = char.charCodeAt(0);

    return (
      code >= 0xAC00 &&
      code <= 0xD7A3
    );

  });

}


function hasBatchim(text) {

  const lastHangul =
    getLastHangulChar(text);

  if (!lastHangul) {
    return false;
  }

  const code =
    lastHangul.charCodeAt(0);

  const jong =
    (code - 0xAC00) % 28;

  return jong !== 0;

}


function jongseongIndex(text) {

  const lastHangul =
    getLastHangulChar(text);

  if (!lastHangul) {
    return 0;
  }

  return (
    lastHangul.charCodeAt(0) -
    0xAC00
  ) % 28;

}


/* 이 / 가 */

function iga(word) {

  return `${word}${
    hasBatchim(word)
      ? "이"
      : "가"
  }`;

}


/* 은 / 는 */

function eunNeun(word) {

  return `${word}${
    hasBatchim(word)
      ? "은"
      : "는"
  }`;

}


/* 을 / 를 */

function eulReul(word) {

  return `${word}${
    hasBatchim(word)
      ? "을"
      : "를"
  }`;

}


/* 과 / 와 */

function gwaWa(word) {

  return `${word}${
    hasBatchim(word)
      ? "과"
      : "와"
  }`;

}


/* 으로 / 로 */

function euroRo(word) {

  const jong =
    jongseongIndex(word);

  /*
    받침 없음 → 로
    ㄹ 받침 → 로
    나머지 받침 → 으로
  */

  if (
    jong === 0 ||
    jong === 8
  ) {
    return `${word}로`;
  }

  return `${word}으로`;

}


/* 이라고 / 라고 */

function irago(word) {

  return `${word}${
    hasBatchim(word)
      ? "이라고"
      : "라고"
  }`;

}


/* =========================================================
   등장인물
========================================================= */

const people = [

  {
    name: "윤아준",
    icon: "👦",
    group: "child"
  },

  {
    name: "윤이서",
    icon: "👧",
    group: "child"
  },

  {
    name: "김세영",
    icon: "👨",
    group: "adult"
  },

  {
    name: "윤한성",
    icon: "👨",
    group: "adult"
  },

  {
    name: "김하영 이모",
    icon: "👩",
    group: "adult"
  },

  {
    name: "심보연",
    icon: "👩",
    group: "adult"
  },

  {
    name: "윤상현",
    icon: "👨",
    group: "adult"
  },

  {
    name: "윤동환 삼촌",
    icon: "👨",
    group: "adult"
  },

  {
    name: "엄마",
    icon: "👩",
    group: "adult"
  },

  {
    name: "진주할머니",
    icon: "👵",
    group: "elderly"
  },

  {
    name: "마산할머니",
    icon: "👵",
    group: "elderly"
  },

  {
    name: "김쌍곤 할아버지",
    icon: "👴",
    group: "elderly"
  },

  {
    name: "김시환",
    icon: "👦",
    group: "child"
  },

  {
    name: "김예나",
    icon: "👶",
    group: "baby"
  }

];


const toyPeople = [

  {
    name: "까꿍이",
    icon: "🐰",
    group: "toy"
  },

  {
    name: "아기까꿍이",
    icon: "🐇",
    group: "toy"
  },

  {
    name: "스파이디",
    icon: "🕷️",
    group: "toy"
  }

];


const children =
  people.filter(
    person =>
      person.group === "child"
  );


const adults =
  people.filter(
    person =>
      person.group === "adult"
  );


const elderly =
  people.filter(
    person =>
      person.group === "elderly"
  );


const babies =
  people.filter(
    person =>
      person.group === "baby"
  );


const allCharacters = [
  ...people,
  ...toyPeople
];


/* =========================================================
   장소 / 열차 / 물건
========================================================= */

const platforms = [
  "1번 승강장",
  "2번 승강장",
  "3번 승강장"
];


const stationPlaces = [
  "대합실",
  "계단 앞",
  "엘리베이터 앞",
  "화장실 앞",
  "매표소 앞",
  "전광판 앞",
  "개찰구 앞",
  ...platforms
];


const trains = [
  "SRT",
  "KTX-산천"
];


const objects = [
  "가방",
  "우산",
  "물병",
  "모자",
  "휴대폰",
  "기차표",
  "장난감"
];


/* =========================================================
   기본 유틸리티
========================================================= */

function otherPeopleExcept(
  name,
  count = 3
) {

  return shuffle(
    people
      .filter(
        person =>
          person.name !== name
      )
      .map(
        person =>
          person.name
      )
  ).slice(
    0,
    count
  );

}


function randomWrongPlaces(
  correct,
  count = 3
) {

  return shuffle(
    stationPlaces.filter(
      place =>
        place !== correct
    )
  ).slice(
    0,
    count
  );

}


function randomWrongPlatforms(
  correct,
  count = 3
) {

  return shuffle(
    [
      ...platforms.filter(
        place =>
          place !== correct
      ),
      "대합실",
      "매표소 앞"
    ]
  ).slice(
    0,
    count
  );

}


function getCharacterIcon(name) {

  const character =
    allCharacters.find(
      person =>
        person.name === name
    );


  if (character) {
    return character.icon;
  }


  if (name === "역무원") {
    return "👨‍✈️";
  }


  if (name === "SRT") {
    return "🚄";
  }


  if (name === "KTX-산천") {
    return "🚅";
  }


  return "🎛️";

}


/* =========================================================
   화면 / 움직임
========================================================= */

function resetWorld() {

  $("srt").style.left =
    "4vw";


  $("ktx").style.left =
    "73vw";


  $("srtStatus").textContent =
    "대기";


  $("ktxStatus").textContent =
    "대기";


  document
    .querySelectorAll(
      ".platform"
    )
    .forEach(
      platform => {

        platform.classList.remove(
          "active"
        );

      }
    );

}


function platformElement(name) {

  if (
    name === "1번 승강장"
  ) {
    return document.querySelector(
      ".p1"
    );
  }


  if (
    name === "2번 승강장"
  ) {
    return document.querySelector(
      ".p2"
    );
  }


  if (
    name === "3번 승강장"
  ) {
    return document.querySelector(
      ".p3"
    );
  }


  return null;

}


function highlightPlatform(name) {

  document
    .querySelectorAll(
      ".platform"
    )
    .forEach(
      platform => {

        platform.classList.remove(
          "active"
        );

      }
    );


  const target =
    platformElement(name);


  if (target) {

    target.classList.add(
      "active"
    );

  }

}


function movePerson(
  person,
  place
) {

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
    },

    "엘리베이터 앞": {
      top: "9.8vh",
      left: "30vw"
    },

    "화장실 앞": {
      top: "8.8vh",
      left: "24vw"
    },

    "매표소 앞": {
      top: "9.5vh",
      left: "15vw"
    },

    "전광판 앞": {
      top: "8.5vh",
      left: "72vw"
    },

    "개찰구 앞": {
      top: "10.5vh",
      left: "28vw"
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


function moveTrain(
  train,
  state
) {

  if (
    train === "SRT"
  ) {

    if (
      state === "arrive"
    ) {

      $("srt").style.left =
        "41vw";

      $("srtStatus").textContent =
        "도착";

    }


    if (
      state === "stop"
    ) {

      $("srt").style.left =
        "45vw";

      $("srtStatus").textContent =
        "정차";

    }


    if (
      state === "depart"
    ) {

      $("srt").style.left =
        "90vw";

      $("srtStatus").textContent =
        "출발";

    }

  }


  if (
    train === "KTX-산천"
  ) {

    if (
      state === "arrive"
    ) {

      $("ktx").style.left =
        "44vw";

      $("ktxStatus").textContent =
        "도착";

    }


    if (
      state === "stop"
    ) {

      $("ktx").style.left =
        "48vw";

      $("ktxStatus").textContent =
        "정차";

    }


    if (
      state === "depart"
    ) {

      $("ktx").style.left =
        "-20vw";

      $("ktxStatus").textContent =
        "출발";

    }

  }

}


/* =========================================================
   공통 질문
========================================================= */

function createWhoQuestion(person) {

  return {

    type: "WHO",

    label:
      "WHO · 누구?",

    question:
      "이 상황에서 도움이 필요한 사람은 누구인가요?",

    correct:
      person.name,

    wrong:
      otherPeopleExcept(
        person.name
      )

  };

}


function createWhereQuestion(
  person,
  place
) {

  return {

    type: "WHERE",

    label:
      "WHERE · 어디?",

    question:
      `${eunNeun(person.name)} 어디에 있나요?`,

    correct:
      place,

    wrong:
      randomWrongPlaces(
        place
      )

  };

}


/* =========================================================
   사건 1
   보호자를 잃어버림
========================================================= */

function lostChildEvent() {

  const child =
    random(children);

  const platform =
    random(platforms);

  const train =
    random(trains);


  return {

    title:
      "👦 보호자를 찾지 못하고 있어요",

    person:
      child,

    story:
      `${iga(child.name)} ${platform}에서 혼자 울고 있습니다. 잠시 다른 곳에 다녀온 사이 함께 있던 가족이 보이지 않는다고 합니다.`,

    dialogue: [

      [
        child.name,
        "같이 있던 가족이 안 보여요. 어디로 갔는지 모르겠어요."
      ],

      [
        "역무원",
        "관제실, 보호자를 찾지 못한 아이가 있습니다."
      ]

    ],

    questions: [

      createWhoQuestion(
        child
      ),

      createWhereQuestion(
        child,
        platform
      ),

      {

        type: "WHY",

        label:
          "WHY · 왜?",

        question:
          `${eunNeun(child.name)} 왜 도움을 요청하고 있나요?`,

        correct:
          "함께 있던 가족을 찾지 못해서요.",

        wrong: [
          "기차표를 잃어버려서요.",
          "열차가 늦어서요.",
          "가방이 무거워서요."
        ]

      },

      {

        type: "ACTION",

        label:
          "ACTION · 어떻게?",

        question:
          "관제사는 어떻게 해야 할까요?",

        correct:
          "안전한 곳에서 기다리게 하고 역무원이 가족을 찾도록 해요.",

        wrong: [
          "혼자 역 밖으로 나가게 해요.",
          "다른 승강장을 돌아다니게 해요.",
          "아무 조치도 하지 않아요."
        ]

      }

    ],

    speak:
      `${child.name}야, 안전한 곳에서 기다리자. 역무원이 가족을 찾아줄게.`,

    run() {

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


/* =========================================================
   사건 2
   승강장을 잘못 찾음
========================================================= */

function wrongPlatformEvent() {

  const person =
    random(people);

  const current =
    random(platforms);

  const correctPlatform =
    random(
      platforms.filter(
        place =>
          place !== current
      )
    );

  const train =
    random(trains);


  return {

    title:
      "🚉 승강장을 잘못 찾았어요",

    person,

    story:
      `${iga(person.name)} ${current}에서 ${eulReul(train)} 기다리고 있습니다. 하지만 ${eunNeun(train)} ${correctPlatform}에서 출발할 예정입니다.`,

    dialogue: [

      [
        person.name,
        `${eulReul(train)} 타려고 하는데 여기에서 기다리면 되나요?`
      ],

      [
        "역무원",
        `${eunNeun(train)} ${correctPlatform}에서 출발합니다.`
      ]

    ],

    questions: [

      createWhoQuestion(
        person
      ),

      {

        type:
          "WHAT",

        label:
          "WHAT · 어떤 일?",

        question:
          `${ege(person.name)} 어떤 문제가 생겼나요?`,

        correct:
          "타야 할 열차의 승강장을 잘못 찾았어요.",

        wrong: [
          "가방을 잃어버렸어요.",
          "기차표를 잃어버렸어요.",
          "열차가 고장 났어요."
        ]

      },

      {

        type:
          "WHERE",

        label:
          "WHERE · 어디?",

        question:
          `${eunNeun(train)} 어디에서 출발하나요?`,

        correct:
          correctPlatform,

        wrong:
          randomWrongPlatforms(
            correctPlatform
          )

      },

      {

        type:
          "ACTION",

        label:
          "ACTION · 어떻게?",

        question:
          "어떻게 도와주면 좋을까요?",

        correct:
          `${euroRo(correctPlatform)} 안전하게 이동하도록 알려줘요.`,

        wrong: [
          "현재 승강장에서 계속 기다리라고 해요.",
          "아무 열차나 타라고 해요.",
          "역 밖으로 나가라고 해요."
        ]

      }

    ],

    speak:
      `${person.name}님, ${eunNeun(train)} ${correctPlatform}에서 출발합니다. 천천히 이동해 주세요.`,

    run() {

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


/* =========================================================
   에게 조사
========================================================= */

function ege(word) {

  return `${word}에게`;

}


/* =========================================================
   사건 3
   안전선
========================================================= */

function safetyLineEvent() {

  const child =
    random(children);

  const platform =
    random(platforms);

  const train =
    random(trains);


  return {

    title:
      "⚠️ 안전선 가까이에 있어요",

    person:
      child,

    story:
      `${iga(child.name)} ${platform}의 노란 안전선 바로 앞에서 ${eulReul(train)} 기다리고 있습니다. ${iga(train)} 곧 승강장으로 들어옵니다.`,

    dialogue: [

      [
        child.name,
        "기차가 가까이 오는 걸 보고 싶어요."
      ],

      [
        "역무원",
        `${iga(train)} 곧 들어옵니다. 안전선 뒤로 물러나야 합니다.`
      ]

    ],

    questions: [

      createWhoQuestion(
        child
      ),

      createWhereQuestion(
        child,
        platform
      ),

      {

        type: "WHY",

        label: "WHY · 왜?",

        question:
          "왜 위험한 상황인가요?",

        correct:
          `${iga(train)} 들어오는데 안전선 가까이에 있기 때문이에요.`,

        wrong: [
          "기차역이 너무 넓기 때문이에요.",
          "기차표가 없기 때문이에요.",
          "승강장 번호가 많기 때문이에요."
        ]

      },

      {

        type:
          "ACTION",

        label:
          "ACTION · 어떻게?",

        question:
          "관제사는 어떻게 안내해야 할까요?",

        correct:
          "노란 안전선 뒤로 물러나도록 안내해요.",

        wrong: [
          "선로 쪽으로 더 가까이 가라고 해요.",
          "열차를 바로 앞에서 보라고 해요.",
          "아무 말도 하지 않아요."
        ]

      }

    ],

    speak:
      `${child.name}야, 기차가 들어오고 있어. 노란 안전선 뒤로 물러나 줘.`,

    run() {

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


/* =========================================================
   사건 4
   넘어짐
========================================================= */

function fallenEvent() {

  const person =
    random([
      ...elderly,
      ...adults
    ]);

  const place =
    random([
      ...platforms,
      "계단 앞"
    ]);


  return {

    title:
      "🩹 승객이 넘어졌어요",

    person,

    story:
      `${iga(person.name)} ${place}에서 발을 헛디뎌 넘어졌습니다. 혼자 바로 일어나기 어려워 보입니다.`,

    dialogue: [

      [
        person.name,
        "조금 아파요. 일어나기가 힘들어요."
      ],

      [
        "역무원",
        "관제실, 도움이 필요한 승객이 있습니다."
      ]

    ],

    questions: [

      createWhoQuestion(
        person
      ),

      createWhereQuestion(
        person,
        place
      ),

      {

        type:
          "WHAT",

        label:
          "WHAT · 어떤 일?",

        question:
          "어떤 일이 생겼나요?",

        correct:
          `${iga(person.name)} 넘어져 도움이 필요해요.`,

        wrong: [
          "열차를 잘못 탔어요.",
          "가방을 잃어버렸어요.",
          "기차표를 잃어버렸어요."
        ]

      },

      {

        type:
          "ACTION",

        label:
          "ACTION · 어떻게?",

        question:
          "관제사는 어떻게 해야 할까요?",

        correct:
          "무리하게 움직이지 않도록 안내하고 역무원에게 도움을 요청해요.",

        wrong: [
          "혼자 바로 걸어가라고 해요.",
          "다른 승강장으로 가라고 해요.",
          "아무 조치도 하지 않아요."
        ]

      }

    ],

    speak:
      `${person.name}님, 무리해서 움직이지 마시고 잠시 기다려 주세요. 역무원이 도와드릴게요.`,

    run() {

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


/* =========================================================
   사건 5
   물건을 열차에 두고 내림
========================================================= */

function lostBagEvent() {

  const person =
    random(people);

  const platform =
    random(platforms);

  const train =
    random(trains);

  const item =
    random(objects);


  return {

    title:
      `👜 ${eulReul(item)} 두고 내렸어요`,

    person,

    story:
      `${iga(person.name)} ${platform}에서 내린 뒤 ${train} 안에 ${eulReul(item)} 두고 내린 것을 알게 되었습니다.`,

    dialogue: [

      [
        person.name,
        `${eulReul(item)} 열차 안에 두고 내렸어요!`
      ],

      [
        "역무원",
        `${eunNeun(train)} 아직 역에 정차하고 있습니다.`
      ]

    ],

    questions: [

      createWhoQuestion(
        person
      ),

      {

        type:
          "WHAT",

        label:
          "WHAT · 어떤 것?",

        question:
          `${iga(person.name)} 무엇을 두고 내렸나요?`,

        correct:
          item,

        wrong:
          shuffle(
            objects.filter(
              object =>
                object !== item
            )
          ).slice(0,3)

      },

      {

        type:
          "WHERE",

        label:
          "WHERE · 어디?",

        question:
          `${eunNeun(item)} 어디에 있나요?`,

        correct:
          `${train} 안`,

        wrong: [
          "대합실",
          "화장실 앞",
          `${platform} 바닥`
        ]

      },

      {

        type:
          "ACTION",

        label:
          "ACTION · 어떻게?",

        question:
          "관제사는 어떻게 해야 할까요?",

        correct:
          "승객이 직접 열차를 따라가지 않도록 하고 역무원에게 확인을 요청해요.",

        wrong: [
          "선로로 내려가 찾게 해요.",
          "열차를 직접 따라가게 해요.",
          "그냥 포기하라고 해요."
        ]

      }

    ],

    speak:
      `${person.name}님, 직접 열차를 따라가지 마세요. 역무원이 ${eulReul(item)} 확인해드릴게요.`,

    run() {

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


/* =========================================================
   사건 6
   방송을 못 들음
========================================================= */

function missedAnnouncementEvent() {

  const person =
    random(people);

  const train =
    random(trains);

  const platform =
    random(platforms);


  return {

    title:
      "📢 안내 방송을 잘 못 들었어요",

    person,

    story:
      `${iga(person.name)} 역 안의 소음 때문에 ${train} 승강장 안내 방송을 정확히 듣지 못했습니다. ${eunNeun(train)} ${platform}에서 출발합니다.`,

    dialogue: [

      [
        person.name,
        "방송을 잘 못 들었어요. 어디로 가야 하나요?"
      ],

      [
        "역무원",
        `${eunNeun(train)} ${platform}에서 출발합니다.`
      ]

    ],

    questions: [

      createWhoQuestion(
        person
      ),

      {

        type:
          "WHAT",

        label:
          "WHAT · 어떤 일?",

        question:
          `${iga(person.name)} 무엇을 잘 듣지 못했나요?`,

        correct:
          "열차 승강장 안내 방송",

        wrong: [
          "날씨 안내",
          "전화 통화",
          "음악 방송"
        ]

      },

      {

        type:
          "WHERE",

        label:
          "WHERE · 어디?",

        question:
          `${eunNeun(train)} 어디에서 출발하나요?`,

        correct:
          platform,

        wrong:
          randomWrongPlatforms(
            platform
          )

      },

      {

        type:
          "ACTION",

        label:
          "ACTION · 어떻게?",

        question:
          "어떻게 설명하는 것이 좋을까요?",

        correct:
          "승강장 번호를 천천히 다시 알려줘요.",

        wrong: [
          "알아서 찾아가라고 해요.",
          "못 들었다고 화를 내요.",
          "아무 말도 하지 않아요."
        ]

      }

    ],

    speak:
      `${person.name}님, ${eunNeun(train)} ${platform}에서 출발합니다. 천천히 이동해 주세요.`,

    run() {

      movePerson(
        person,
        "전광판 앞"
      );

      moveTrain(
        train,
        "arrive"
      );

    }

  };

}


/* =========================================================
   사건 7
   화장실 찾기
========================================================= */

function restroomEvent() {

  const person =
    random(people);


  return {

    title:
      "🚻 화장실을 찾고 있어요",

    person,

    story:
      `${iga(person.name)} 대합실에서 화장실을 찾지 못해 주변을 둘러보고 있습니다.`,

    dialogue: [

      [
        person.name,
        "화장실이 어디에 있나요?"
      ],

      [
        "역무원",
        "대합실 오른쪽 안내표지판을 따라가시면 됩니다."
      ]

    ],

    questions: [

      createWhoQuestion(
        person
      ),

      {

        type:
          "WHAT",

        label:
          "WHAT · 어떤 것?",

        question:
          `${iga(person.name)} 찾고 있는 곳은 어디인가요?`,

        correct:
          "화장실",

        wrong: [
          "주차장",
          "승강장",
          "매표소"
        ]

      },

      {

        type:
          "WHY",

        label:
          "WHY · 왜?",

        question:
          `${eunNeun(person.name)} 왜 역무원에게 질문했나요?`,

        correct:
          "화장실 위치를 모르기 때문이에요.",

        wrong: [
          "기차표를 잃어버렸기 때문이에요.",
          "열차가 늦었기 때문이에요.",
          "가방을 찾고 있기 때문이에요."
        ]

      },

      {

        type:
          "ACTION",

        label:
          "ACTION · 어떻게?",

        question:
          "어떤 대답이 가장 좋을까요?",

        correct:
          "화장실 위치와 가는 방향을 알려줘요.",

        wrong: [
          "모른다고 하고 끝내요.",
          "다른 사람에게 물어보라고만 해요.",
          "승강장으로 가라고 해요."
        ]

      }

    ],

    speak:
      `${person.name}님, 화장실은 대합실 오른쪽에 있어요. 안내표지판을 따라가세요.`,

    run() {

      movePerson(
        person,
        "대합실"
      );

    }

  };

}


/* =========================================================
   사건 8
   열차를 놓칠까 봐 뜀
========================================================= */

function runningPassengerEvent() {

  const person =
    random(people);

  const train =
    random(trains);

  const platform =
    random(platforms);


  return {

    title:
      "🏃 열차를 놓칠까 봐 뛰고 있어요",

    person,

    story:
      `${iga(person.name)} ${eulReul(train)} 놓칠까 걱정되어 ${euroRo(platform)} 빠르게 뛰어가고 있습니다.`,

    dialogue: [

      [
        person.name,
        "기차를 놓치겠어요! 빨리 뛰어야 해요!"
      ],

      [
        "역무원",
        "역 안에서 뛰면 다른 사람과 부딪히거나 넘어질 수 있습니다."
      ]

    ],

    questions: [

      createWhoQuestion(
        person
      ),

      {

        type:
          "WHY",

        label:
          "WHY · 왜?",

        question:
          `${eunNeun(person.name)} 왜 뛰고 있나요?`,

        correct:
          "열차를 놓칠까 걱정해서요.",

        wrong: [
          "운동을 하려고요.",
          "가방을 찾으려고요.",
          "화장실을 찾으려고요."
        ]

      },

      {

        type:
          "WHAT",

        label:
          "WHAT · 어떤 일?",

        question:
          "역 안에서 뛰면 어떤 위험이 있을까요?",

        correct:
          "다른 사람과 부딪히거나 넘어질 수 있어요.",

        wrong: [
          "열차가 더 빨리 출발해요.",
          "승강장 번호가 바뀌어요.",
          "기차표가 사라져요."
        ]

      },

      {

        type:
          "ACTION",

        label:
          "ACTION · 어떻게?",

        question:
          "관제사는 어떻게 안내해야 할까요?",

        correct:
          "뛰지 말고 안전하게 이동하도록 안내해요.",

        wrong: [
          "더 빨리 뛰라고 해요.",
          "계단을 두 칸씩 뛰어가라고 해요.",
          "사람들을 밀고 가라고 해요."
        ]

      }

    ],

    speak:
      `${person.name}님, 역 안에서는 뛰지 말고 안전하게 이동해 주세요.`,

    run() {

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


/* =========================================================
   사건 9
   아기가 울음
========================================================= */

function cryingBabyEvent() {

  const baby =
    random(babies);

  const caregiver =
    random(adults);

  const place =
    random([
      "대합실",
      ...platforms
    ]);


  return {

    title:
      "👶 아기가 울고 있어요",

    person:
      baby,

    story:
      `${gwaWa(caregiver.name)} 함께 있던 ${iga(baby.name)} ${place}에서 갑자기 크게 울기 시작했습니다.`,

    dialogue: [

      [
        caregiver.name,
        `${iga(baby.name)} 계속 울어요. 잠깐 조용한 곳에서 쉬어야 할 것 같아요.`
      ],

      [
        "역무원",
        "필요하시면 잠시 쉴 수 있는 곳을 안내해드리겠습니다."
      ]

    ],

    questions: [

      {

        type:
          "WHO",

        label:
          "WHO · 누구?",

        question:
          "누가 울고 있나요?",

        correct:
          baby.name,

        wrong:
          otherPeopleExcept(
            baby.name
          )

      },

      createWhereQuestion(
        baby,
        place
      ),

      {

        type:
          "WHAT",

        label:
          "WHAT · 어떤 일?",

        question:
          "지금 어떤 상황인가요?",

        correct:
          `${iga(baby.name)} 크게 울고 있어요.`,

        wrong: [
          "열차가 고장 났어요.",
          "가방을 잃어버렸어요.",
          "승객이 넘어졌어요."
        ]

      },

      {

        type:
          "ACTION",

        label:
          "ACTION · 어떻게?",

        question:
          "어떻게 도와주면 좋을까요?",

        correct:
          "보호자에게 필요한 것이 있는지 묻고 쉴 수 있는 곳을 안내해요.",

        wrong: [
          "울지 말라고 크게 혼내요.",
          "아기를 혼자 두고 가라고 해요.",
          "아무 관심도 주지 않아요."
        ]

      }

    ],

    speak:
      `${caregiver.name}님, 필요한 것이 있으신가요? 잠시 쉴 수 있는 곳을 안내해드릴게요.`,

    run() {

      movePerson(
        baby,
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


/* =========================================================
   사건 10
   까꿍이를 잃어버림
========================================================= */

function missingKkakkungiEvent() {

  const child =
    random(children);

  const toy =
    random([
      toyPeople[0],
      toyPeople[1]
    ]);

  const place =
    random(stationPlaces);


  return {

    title:
      `🐰 ${eulReul(toy.name)} 찾고 있어요`,

    person:
      child,

    story:
      `${iga(child.name)} 소중한 ${eulReul(toy.name)} 찾고 있습니다. 마지막으로 ${place}에서 ${eulReul(toy.name)} 가지고 있었다고 합니다.`,

    dialogue: [

      [
        child.name,
        `${iga(toy.name)} 안 보여요. 아까까지 같이 있었는데요.`
      ],

      [
        "역무원",
        "마지막으로 본 장소부터 확인해볼게요."
      ]

    ],

    questions: [

      createWhoQuestion(
        child
      ),

      {

        type:
          "WHAT",

        label:
          "WHAT · 어떤 것?",

        question:
          `${iga(child.name)} 무엇을 찾고 있나요?`,

        correct:
          toy.name,

        wrong: [
          "기차표",
          "가방",
          "우산"
        ]

      },

      {

        type:
          "WHERE",

        label:
          "WHERE · 어디?",

        question:
          `${eulReul(toy.name)} 마지막으로 본 곳은 어디인가요?`,

        correct:
          place,

        wrong:
          randomWrongPlaces(
            place
          )

      },

      {

        type:
          "ACTION",

        label:
          "ACTION · 어떻게?",

        question:
          "어떻게 찾는 것이 좋을까요?",

        correct:
          "마지막으로 본 장소부터 역무원과 함께 차례로 확인해요.",

        wrong: [
          "선로에 직접 내려가 찾아요.",
          "혼자 역 전체를 뛰어다녀요.",
          "바로 포기해요."
        ]

      }

    ],

    speak:
      `${child.name}야, 걱정하지 마. ${eulReul(toy.name)} 마지막으로 본 곳부터 같이 찾아보자.`,

    run() {

      movePerson(
        child,
        place
      );

    }

  };

}


/* =========================================================
   사건 11
   스파이디가 위험한 곳에 떨어짐
========================================================= */

function spideyDangerEvent() {

  const child =
    random(children);

  const platform =
    random(platforms);

  const train =
    random(trains);


  return {

    title:
      "🕷️ 스파이디가 위험한 곳에 떨어졌어요",

    person:
      child,

    story:
      `${iga(child.name)} 가지고 놀던 스파이디가 ${platform}의 안전선 바깥쪽으로 떨어졌습니다. ${iga(train)} 곧 들어올 예정입니다.`,

    dialogue: [

      [
        child.name,
        "스파이디가 떨어졌어요! 제가 주워올게요!"
      ],

      [
        "역무원",
        "직접 가지 마세요. 위험합니다."
      ]

    ],

    questions: [

      createWhoQuestion(
        child
      ),

      {

        type:
          "WHAT",

        label:
          "WHAT · 어떤 것?",

        question:
          "무엇이 위험한 곳에 떨어졌나요?",

        correct:
          "스파이디",

        wrong: [
          "까꿍이",
          "가방",
          "우산"
        ]

      },

      {

        type:
          "WHY",

        label:
          "WHY · 왜?",

        question:
          `${iga(child.name)} 직접 주우러 가면 왜 위험할까요?`,

        correct:
          `${iga(train)} 들어올 수 있고 선로 가까이는 위험하기 때문이에요.`,

        wrong: [
          "스파이디가 너무 작기 때문이에요.",
          "기차표가 없기 때문이에요.",
          "승강장이 넓기 때문이에요."
        ]

      },

      {

        type:
          "ACTION",

        label:
          "ACTION · 어떻게?",

        question:
          "어떻게 해야 할까요?",

        correct:
          "직접 내려가지 말고 역무원에게 도움을 요청해요.",

        wrong: [
          "빨리 뛰어가서 직접 주워요.",
          "선로로 내려가요.",
          "다른 사람에게 대신 주워오라고 해요."
        ]

      }

    ],

    speak:
      `${child.name}야, 직접 가지 마. 위험하니까 역무원이 스파이디를 확인해줄게.`,

    run() {

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


/* =========================================================
   사건 12
   열차 지연
========================================================= */

function delayedTrainEvent() {

  const person =
    random(people);

  const train =
    random(trains);

  const platform =
    random(platforms);

  const delay =
    random([
      "5분",
      "10분",
      "15분"
    ]);


  return {

    title:
      "⏰ 열차가 조금 늦어지고 있어요",

    person,

    story:
      `${iga(train)} 운행 사정으로 약 ${delay} 늦어지고 있습니다. ${eunNeun(person.name)} ${platform}에서 열차를 기다리고 있습니다.`,

    dialogue: [

      [
        person.name,
        "기차가 왜 아직 안 오나요?"
      ],

      [
        "역무원",
        `${iga(train)} 약 ${delay} 지연되고 있습니다.`
      ]

    ],

    questions: [

      createWhoQuestion(
        person
      ),

      {

        type:
          "WHAT",

        label:
          "WHAT · 어떤 일?",

        question:
          `${ege(train)} 어떤 일이 생겼나요?`,

        correct:
          `${delay} 정도 지연되고 있어요.`,

        wrong: [
          "운행이 완전히 끝났어요.",
          "승강장이 없어졌어요.",
          "기차표가 필요 없게 되었어요."
        ]

      },

      {

        type:
          "WHY",

        label:
          "WHY · 왜?",

        question:
          `${ege(person.name)} 어떤 정보를 알려주는 것이 중요할까요?`,

        correct:
          "열차가 늦고 있다는 사실과 예상 시간을 알려줘요.",

        wrong: [
          "아무 설명도 하지 않아요.",
          "전혀 다른 이야기만 해요.",
          "이미 출발했다고 말해요."
        ]

      },

      {

        type:
          "ACTION",

        label:
          "ACTION · 어떻게?",

        question:
          "어떻게 안내해야 할까요?",

        correct:
          `${iga(train)} 약 ${delay} 늦는다고 차분히 안내해요.`,

        wrong: [
          "언제 오는지 모른다고만 해요.",
          "다른 역으로 가라고 해요.",
          "열차를 뛰어서 따라가라고 해요."
        ]

      }

    ],

    speak:
      `${person.name}님, ${iga(train)} 약 ${delay} 지연되고 있습니다. 조금만 기다려 주세요.`,

    run() {

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


/* =========================================================
   사건 13
   다른 좌석
========================================================= */

function wrongSeatEvent() {

  const person =
    random(people);

  const train =
    random(trains);

  const seat =
    random([
      "3A",
      "5B",
      "7C",
      "9D"
    ]);


  return {

    title:
      "💺 다른 좌석에 앉았어요",

    person,

    story:
      `${iga(person.name)} ${ege(train)} 탔습니다. 표에 적힌 좌석은 ${seat}인데 다른 좌석에 앉아 있습니다.`,

    dialogue: [

      [
        person.name,
        "여기가 제 자리인 줄 알았어요."
      ],

      [
        "역무원",
        `표에 적힌 좌석은 ${seat}입니다.`
      ]

    ],

    questions: [

      createWhoQuestion(
        person
      ),

      {

        type:
          "WHAT",

        label:
          "WHAT · 어떤 일?",

        question:
          "어떤 문제가 생겼나요?",

        correct:
          "표에 적힌 좌석과 다른 자리에 앉았어요.",

        wrong: [
          "기차표를 잃어버렸어요.",
          "열차를 놓쳤어요.",
          "가방을 두고 내렸어요."
        ]

      },

      {

        type:
          "WHERE",

        label:
          "WHERE · 어디?",

        question:
          `${iga(person.name)} 앉아야 하는 좌석은 어디인가요?`,

        correct:
          seat,

        wrong:
          shuffle([
            "1A",
            "2B",
            "4C",
            "8D"
          ]).slice(0,3)

      },

      {

        type:
          "ACTION",

        label:
          "ACTION · 어떻게?",

        question:
          "어떻게 해결하면 좋을까요?",

        correct:
          "표에 적힌 좌석 번호를 확인하고 자신의 자리로 이동해요.",

        wrong: [
          "아무 자리나 앉아요.",
          "다른 승객에게 무조건 자리를 비키라고 해요.",
          "바로 열차에서 내려요."
        ]

      }

    ],

    speak:
      `${person.name}님, 표에 적힌 좌석은 ${seat}입니다. 좌석 번호를 다시 확인해 주세요.`,

    run() {

      movePerson(
        person,
        random(platforms)
      );

      moveTrain(
        train,
        "stop"
      );

    }

  };

}


/* =========================================================
   사건 14
   줄 서기
========================================================= */

function queueEvent() {

  const person =
    random(children);

  const platform =
    random(platforms);

  const train =
    random(trains);


  return {

    title:
      "🚶 차례대로 열차를 타요",

    person,

    story:
      `${ege(platform)} ${iga(train)} 도착했습니다. ${iga(person.name)} 빨리 타고 싶어서 앞에 있는 사람보다 먼저 들어가려고 합니다.`,

    dialogue: [

      [
        person.name,
        "제가 먼저 타면 안 돼요?"
      ],

      [
        "역무원",
        "내리는 승객이 먼저 나온 뒤 차례대로 타야 합니다."
      ]

    ],

    questions: [

      createWhoQuestion(
        person
      ),

      createWhereQuestion(
        person,
        platform
      ),

      {

        type:
          "WHY",

        label:
          "WHY · 왜?",

        question:
          "왜 차례를 지켜야 하나요?",

        correct:
          "서로 부딪히지 않고 안전하게 타기 위해서예요.",

        wrong: [
          "열차가 더 빨라지기 때문이에요.",
          "기차표가 더 싸지기 때문이에요.",
          "승강장이 커지기 때문이에요."
        ]

      },

      {

        type:
          "ACTION",

        label:
          "ACTION · 어떻게?",

        question:
          "어떻게 행동해야 할까요?",

        correct:
          "내리는 사람이 먼저 나온 뒤 줄을 지켜 타요.",

        wrong: [
          "사람들을 밀고 먼저 타요.",
          "문이 열리기 전에 들어가요.",
          "줄을 무시하고 뛰어가요."
        ]

      }

    ],

    speak:
      `${person.name}야, 내리는 사람을 먼저 기다리고 차례대로 타자.`,

    run() {

      movePerson(
        person,
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


/* =========================================================
   사건 15
   엘리베이터
========================================================= */

function elevatorHelpEvent() {

  const person =
    random(elderly);


  return {

    title:
      "🛗 엘리베이터를 찾고 있어요",

    person,

    story:
      `${iga(person.name)} 계단 앞에서 무거운 짐을 들고 있습니다. 짐 때문에 계단으로 이동하기 어려워 보입니다.`,

    dialogue: [

      [
        person.name,
        "짐이 무거워서 계단으로 가기가 힘드네요."
      ],

      [
        "역무원",
        "가까운 엘리베이터를 안내해드리겠습니다."
      ]

    ],

    questions: [

      createWhoQuestion(
        person
      ),

      createWhereQuestion(
        person,
        "계단 앞"
      ),

      {

        type:
          "WHY",

        label:
          "WHY · 왜?",

        question:
          `${eunNeun(person.name)} 왜 도움이 필요한가요?`,

        correct:
          "무거운 짐 때문에 계단을 이용하기 어렵기 때문이에요.",

        wrong: [
          "기차표가 없기 때문이에요.",
          "열차가 늦기 때문이에요.",
          "화장실을 찾고 있기 때문이에요."
        ]

      },

      {

        type:
          "ACTION",

        label:
          "ACTION · 어떻게?",

        question:
          "어떻게 도와드리면 좋을까요?",

        correct:
          "가까운 엘리베이터 위치를 안내해요.",

        wrong: [
          "무거운 짐을 들고 계단으로 가라고 해요.",
          "혼자 알아서 찾으라고 해요.",
          "다른 역으로 가라고 해요."
        ]

      }

    ],

    speak:
      `${person.name}님, 가까운 엘리베이터를 안내해드릴게요.`,

    run() {

      movePerson(
        person,
        "계단 앞"
      );

    }

  };

}


/* =========================================================
   사건 16
   목적지 확인
========================================================= */

function destinationQuestionEvent() {

  const person =
    random(people);

  const train =
    random(trains);

  const destination =
    random([
      "서울",
      "대전",
      "부산"
    ]);


  return {

    title:
      "🗺️ 열차의 목적지를 확인해요",

    person,

    story:
      `${iga(person.name)} ${eulReul(train)} 타기 전에 이 열차가 ${euroRo(destination)} 가는 열차인지 확인하고 싶어합니다.`,

    dialogue: [

      [
        person.name,
        `이 ${iga(train)} ${euroRo(destination)} 가나요?`
      ],

      [
        "역무원",
        "전광판과 기차표의 목적지를 함께 확인해드릴게요."
      ]

    ],

    questions: [

      createWhoQuestion(
        person
      ),

      {

        type:
          "WHAT",

        label:
          "WHAT · 어떤 것?",

        question:
          `${iga(person.name)} 무엇을 확인하고 싶어하나요?`,

        correct:
          "열차의 목적지",

        wrong: [
          "화장실 위치",
          "가방 위치",
          "열차의 색깔"
        ]

      },

      {

        type:
          "WHY",

        label:
          "WHY · 왜?",

        question:
          "왜 열차의 목적지를 확인해야 하나요?",

        correct:
          "잘못된 열차를 타지 않기 위해서예요.",

        wrong: [
          "열차가 더 빨라지기 때문이에요.",
          "좌석이 더 커지기 때문이에요.",
          "기차표가 필요 없어지기 때문이에요."
        ]

      },

      {

        type:
          "ACTION",

        label:
          "ACTION · 어떻게?",

        question:
          "어떻게 도와주면 좋을까요?",

        correct:
          "전광판과 기차표를 함께 확인해 목적지를 알려줘요.",

        wrong: [
          "아무 열차나 타라고 해요.",
          "확인하지 말라고 해요.",
          "무조건 맞다고 대답해요."
        ]

      }

    ],

    speak:
      `${person.name}님, 전광판과 표를 함께 확인해서 ${destination} 방향 열차인지 알려드릴게요.`,

    run() {

      movePerson(
        person,
        "전광판 앞"
      );

      moveTrain(
        train,
        "stop"
      );

    }

  };

}


/* =========================================================
   사건 17
   문이 닫히는 열차
========================================================= */

function closingDoorEvent() {

  const person =
    random(people);

  const train =
    random(trains);

  const platform =
    random(platforms);


  return {

    title:
      "🚪 열차 문이 곧 닫혀요",

    person,

    story:
      `${iga(train)} ${platform}에서 출발을 준비하고 있습니다. 문이 닫히려는 순간 ${iga(person.name)} 뒤늦게 열차를 타기 위해 뛰어가고 있습니다.`,

    dialogue: [

      [
        person.name,
        "잠깐만요! 저도 타야 해요!"
      ],

      [
        "역무원",
        "문이 닫히는 열차에 무리하게 타면 위험합니다."
      ]

    ],

    questions: [

      createWhoQuestion(
        person
      ),

      createWhereQuestion(
        person,
        platform
      ),

      {

        type:
          "WHY",

        label:
          "WHY · 왜?",

        question:
          "왜 닫히는 문으로 뛰어들어가면 안 되나요?",

        correct:
          "문이 닫히면서 다칠 수 있기 때문이에요.",

        wrong: [
          "열차가 너무 깨끗하기 때문이에요.",
          "좌석 번호가 있기 때문이에요.",
          "역무원이 바쁘기 때문이에요."
        ]

      },

      {

        type:
          "ACTION",

        label:
          "ACTION · 어떻게?",

        question:
          "어떻게 안내해야 할까요?",

        correct:
          "무리하게 타지 말고 다음 안내를 기다리도록 해요.",

        wrong: [
          "문 사이로 빨리 뛰어들어가라고 해요.",
          "가방을 먼저 던지라고 해요.",
          "문을 손으로 잡으라고 해요."
        ]

      }

    ],

    speak:
      `${person.name}님, 위험하니 무리하게 타지 마시고 다음 안내를 기다려 주세요.`,

    run() {

      movePerson(
        person,
        platform
      );

      highlightPlatform(
        platform
      );

      moveTrain(
        train,
        "depart"
      );

    }

  };

}


/* =========================================================
   사건 18
   기차표 분실
========================================================= */

function lostTicketEvent() {

  const person =
    random(people);

  const place =
    random([
      "대합실",
      "개찰구 앞",
      "매표소 앞"
    ]);


  return {

    title:
      "🎫 기차표가 보이지 않아요",

    person,

    story:
      `${iga(person.name)} ${place}에서 기차표를 찾고 있지만 보이지 않아 당황하고 있습니다.`,

    dialogue: [

      [
        person.name,
        "기차표가 어디 갔는지 모르겠어요."
      ],

      [
        "역무원",
        "당황하지 마시고 마지막으로 확인한 장소부터 생각해볼게요."
      ]

    ],

    questions: [

      createWhoQuestion(
        person
      ),

      createWhereQuestion(
        person,
        place
      ),

      {

        type:
          "WHAT",

        label:
          "WHAT · 어떤 것?",

        question:
          `${iga(person.name)} 무엇을 찾고 있나요?`,

        correct:
          "기차표",

        wrong: [
          "우산",
          "모자",
          "가방"
        ]

      },

      {

        type:
          "ACTION",

        label:
          "ACTION · 어떻게?",

        question:
          "어떻게 하는 것이 좋을까요?",

        correct:
          "마지막으로 표를 확인한 곳을 생각하고 역무원에게 도움을 요청해요.",

        wrong: [
          "선로에서 찾아봐요.",
          "다른 사람의 표를 사용해요.",
          "아무 열차나 타요."
        ]

      }

    ],

    speak:
      `${person.name}님, 당황하지 마세요. 마지막으로 표를 본 곳부터 확인해볼게요.`,

    run() {

      movePerson(
        person,
        place
      );

    }

  };

}


/* =========================================================
   사건 19
   가족 기다리기
========================================================= */

function waitingFamilyEvent() {

  const person =
    random(people);

  const waitingFor =
    random(
      people.filter(
        other =>
          other.name !==
          person.name
      )
    );

  const place =
    random([
      "대합실",
      "개찰구 앞",
      ...platforms
    ]);


  return {

    title:
      "👨‍👩‍👧 가족을 기다리고 있어요",

    person,

    story:
      `${iga(person.name)} ${place}에서 ${eulReul(waitingFor.name)} 기다리고 있습니다. 하지만 아직 만나지 못했습니다.`,

    dialogue: [

      [
        person.name,
        `${iga(waitingFor.name)} 아직 안 보여요.`
      ],

      [
        "역무원",
        "어디에서 만나기로 했는지 먼저 확인해볼까요?"
      ]

    ],

    questions: [

      createWhoQuestion(
        person
      ),

      {

        type:
          "WHO",

        label:
          "WHO · 누구?",

        question:
          `${eunNeun(person.name)} 누구를 기다리고 있나요?`,

        correct:
          waitingFor.name,

        wrong:
          otherPeopleExcept(
            waitingFor.name
          )

      },

      createWhereQuestion(
        person,
        place
      ),

      {

        type:
          "ACTION",

        label:
          "ACTION · 어떻게?",

        question:
          "어떻게 하는 것이 좋을까요?",

        correct:
          "만나기로 한 장소를 다시 확인하고 그곳에서 기다려요.",

        wrong: [
          "역 전체를 뛰어다녀요.",
          "혼자 역 밖으로 나가요.",
          "아무 곳이나 계속 이동해요."
        ]

      }

    ],

    speak:
      `${person.name}님, 만나기로 한 장소를 다시 확인하고 그곳에서 기다려 주세요.`,

    run() {

      movePerson(
        person,
        place
      );

    }

  };

}


/* =========================================================
   사건 20
   안내를 잘못 이해
========================================================= */

function misunderstandingEvent() {

  const person =
    random(people);

  const platform =
    random(platforms);

  const train =
    random(trains);


  return {

    title:
      "🤔 안내를 잘못 이해했어요",

    person,

    story:
      `${iga(person.name)} 역무원의 말을 잘못 이해해 ${iga(train)} 다른 승강장에서 출발한다고 생각하고 있습니다.`,

    dialogue: [

      [
        person.name,
        `${eunNeun(train)} 3번 승강장이라고 하셨죠?`
      ],

      [
        "역무원",
        `아니요. 이번 ${eunNeun(train)} ${platform}에서 출발합니다.`
      ]

    ],

    questions: [

      createWhoQuestion(
        person
      ),

      {

        type:
          "WHAT",

        label:
          "WHAT · 어떤 일?",

        question:
          `${ege(person.name)} 어떤 일이 생겼나요?`,

        correct:
          "안내 내용을 잘못 이해했어요.",

        wrong: [
          "가방을 잃어버렸어요.",
          "넘어졌어요.",
          "기차표를 잃어버렸어요."
        ]

      },

      {

        type:
          "WHERE",

        label:
          "WHERE · 어디?",

        question:
          `${train}의 정확한 승강장은 어디인가요?`,

        correct:
          platform,

        wrong:
          randomWrongPlatforms(
            platform
          )

      },

      {

        type:
          "ACTION",

        label:
          "ACTION · 어떻게?",

        question:
          "어떻게 말하면 좋을까요?",

        correct:
          "정확한 승강장을 다시 천천히 알려줘요.",

        wrong: [
          "왜 못 들었냐고 화를 내요.",
          "아무 말도 하지 않아요.",
          "틀린 승강장으로 보내요."
        ]

      }

    ],

    speak:
      `${person.name}님, 이번 ${eunNeun(train)} ${platform}에서 출발합니다. 다시 천천히 안내해드릴게요.`,

    run() {

      movePerson(
        person,
        "전광판 앞"
      );

      moveTrain(
        train,
        "arrive"
      );

    }

  };

}


/* =========================================================
   사건 21
   물건 떨어짐
========================================================= */

function droppedObjectEvent() {

  const person =
    random(people);

  const object =
    random(objects);

  const platform =
    random(platforms);

  const train =
    random(trains);


  return {

    title:
      `⚠️ ${iga(object)} 위험한 곳에 떨어졌어요`,

    person,

    story:
      `${person.name}의 ${iga(object)} ${platform} 안전선 바깥쪽으로 떨어졌습니다. ${iga(train)} 접근할 수 있는 상황입니다.`,

    dialogue: [

      [
        person.name,
        `${iga(object)} 떨어졌어요. 제가 주워도 될까요?`
      ],

      [
        "역무원",
        "직접 가지 마세요. 위험합니다."
      ]

    ],

    questions: [

      createWhoQuestion(
        person
      ),

      {

        type:
          "WHAT",

        label:
          "WHAT · 어떤 것?",

        question:
          "무엇이 떨어졌나요?",

        correct:
          object,

        wrong:
          shuffle(
            objects.filter(
              item =>
                item !== object
            )
          ).slice(0,3)

      },

      {

        type:
          "WHY",

        label:
          "WHY · 왜?",

        question:
          "왜 직접 주우면 안 되나요?",

        correct:
          "열차가 접근할 수 있는 위험한 곳이기 때문이에요.",

        wrong: [
          "물건이 너무 작기 때문이에요.",
          "승강장이 넓기 때문이에요.",
          "기차표가 없기 때문이에요."
        ]

      },

      {

        type:
          "ACTION",

        label:
          "ACTION · 어떻게?",

        question:
          "어떻게 해야 하나요?",

        correct:
          "역무원에게 알려 안전하게 처리하도록 해요.",

        wrong: [
          "직접 선로로 내려가요.",
          "다른 사람에게 내려가 달라고 해요.",
          "빨리 뛰어가서 주워요."
        ]

      }

    ],

    speak:
      `${person.name}님, 직접 가지 마세요. 역무원이 안전하게 확인하겠습니다.`,

    run() {

      movePerson(
        person,
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


/* =========================================================
   사건 22
   두 사람이 동시에 말함
========================================================= */

function talkingTogetherEvent() {

  const person1 =
    random(people);

  const person2 =
    random(
      people.filter(
        person =>
          person.name !==
          person1.name
      )
    );


  return {

    title:
      "💬 두 사람이 동시에 말하고 있어요",

    person:
      person1,

    story:
      `${gwaWa(person1.name)} ${iga(person2.name)} 관제사에게 동시에 서로 다른 질문을 하고 있습니다. 두 사람의 말을 한꺼번에 듣기 어렵습니다.`,

    dialogue: [

      [
        person1.name,
        "제 질문부터 들어주세요!"
      ],

      [
        person2.name,
        "저도 궁금한 게 있어요!"
      ]

    ],

    questions: [

      {

        type:
          "WHO",

        label:
          "WHO · 누구?",

        question:
          "누가 동시에 말하고 있나요?",

        correct:
          `${person1.name}와 ${person2.name}`,

        wrong: [
          `${person1.name} 혼자`,
          "역무원 혼자",
          "기관사 혼자"
        ]

      },

      {

        type:
          "WHAT",

        label:
          "WHAT · 어떤 일?",

        question:
          "어떤 문제가 생겼나요?",

        correct:
          "두 사람이 동시에 말해서 내용을 정확히 듣기 어려워요.",

        wrong: [
          "열차가 고장 났어요.",
          "기차표가 없어졌어요.",
          "승강장이 바뀌었어요."
        ]

      },

      {

        type:
          "WHY",

        label:
          "WHY · 왜?",

        question:
          "왜 한 사람씩 말하는 것이 좋을까요?",

        correct:
          "서로의 말을 정확하게 듣고 이해할 수 있기 때문이에요.",

        wrong: [
          "열차가 빨라지기 때문이에요.",
          "역이 무조건 조용해야 하기 때문이에요.",
          "기차표가 싸지기 때문이에요."
        ]

      },

      {

        type:
          "ACTION",

        label:
          "ACTION · 어떻게?",

        question:
          "관제사는 어떻게 말하면 좋을까요?",

        correct:
          `${person1.name}의 말을 먼저 듣고 그다음 ${person2.name}의 말을 들어요.`,

        wrong: [
          "두 사람 모두 계속 동시에 말하게 해요.",
          "두 사람 모두 말하지 못하게 해요.",
          "아무 말도 듣지 않아요."
        ]

      }

    ],

    speak:
      `${person1.name}님 먼저 말씀해 주세요. 그다음 ${person2.name}님의 이야기를 들을게요.`,

    run() {

      movePerson(
        person1,
        "대합실"
      );

    }

  };

}


/* =========================================================
   사건 23
   잘 못 들었을 때 다시 묻기
========================================================= */

function askAgainEvent() {

  const person =
    random(people);

  const train =
    random(trains);


  return {

    title:
      "👂 안내를 잘 듣지 못했어요",

    person,

    story:
      `${iga(person.name)} ${train} 관련 안내를 들었지만 주변 소음 때문에 내용을 정확히 듣지 못했습니다.`,

    dialogue: [

      [
        "역무원",
        `${train} 탑승 안내를 말씀드렸습니다.`
      ],

      [
        person.name,
        "죄송하지만 잘 못 들었어요."
      ]

    ],

    questions: [

      createWhoQuestion(
        person
      ),

      {

        type:
          "WHAT",

        label:
          "WHAT · 어떤 일?",

        question:
          `${ege(person.name)} 어떤 문제가 생겼나요?`,

        correct:
          "안내 내용을 정확히 듣지 못했어요.",

        wrong: [
          "가방을 잃어버렸어요.",
          "열차를 놓쳤어요.",
          "넘어졌어요."
        ]

      },

      {

        type:
          "WHY",

        label:
          "WHY · 왜?",

        question:
          "잘 못 들었을 때 왜 다시 물어봐야 할까요?",

        correct:
          "잘못 이해하지 않고 정확한 정보를 알기 위해서예요.",

        wrong: [
          "열차가 빨라지기 때문이에요.",
          "역무원이 심심하기 때문이에요.",
          "표가 없어지기 때문이에요."
        ]

      },

      {

        type:
          "ACTION",

        label:
          "ACTION · 어떻게?",

        question:
          "어떤 말이 가장 좋을까요?",

        correct:
          "죄송하지만 다시 한번 말씀해 주세요.",

        wrong: [
          "들은 척하고 아무 데로나 가요.",
          "아무 말이나 대답해요.",
          "다른 이야기로 바꿔요."
        ]

      }

    ],

    speak:
      "죄송하지만 잘 못 들었어요. 다시 한번 말씀해 주세요.",

    run() {

      movePerson(
        person,
        "대합실"
      );

      moveTrain(
        train,
        "stop"
      );

    }

  };

}


/* =========================================================
   사건 24
   인형을 착각함
========================================================= */

function toyMixupEvent() {

  const child1 =
    random(children);

  const child2 =
    random(
      children.filter(
        child =>
          child.name !==
          child1.name
      )
    );

  const toy =
    random([
      toyPeople[0],
      toyPeople[1]
    ]);


  return {

    title:
      `🐇 ${eulReul(toy.name)} 두고 오해가 생겼어요`,

    person:
      child1,

    story:
      `${iga(child1.name)} ${eulReul(toy.name)} 찾고 있습니다. 그런데 ${iga(child2.name)} 가지고 있는 비슷한 인형을 보고 자신의 인형이라고 생각했습니다.`,

    dialogue: [

      [
        child1.name,
        `그거 제 ${toy.name} 아니에요?`
      ],

      [
        child2.name,
        "이건 제가 가져온 인형이에요."
      ]

    ],

    questions: [

      {

        type:
          "WHO",

        label:
          "WHO · 누구?",

        question:
          "누가 인형을 자신의 것이라고 생각했나요?",

        correct:
          child1.name,

        wrong:
          otherPeopleExcept(
            child1.name
          )

      },

      {

        type:
          "WHAT",

        label:
          "WHAT · 어떤 일?",

        question:
          "어떤 오해가 생겼나요?",

        correct:
          "비슷한 인형을 보고 자신의 것이라고 생각했어요.",

        wrong: [
          "열차를 잘못 탔어요.",
          "기차표를 잃어버렸어요.",
          "승강장을 잘못 찾았어요."
        ]

      },

      {

        type:
          "WHY",

        label:
          "WHY · 왜?",

        question:
          "왜 바로 인형을 가져가면 안 될까요?",

        correct:
          "다른 사람의 물건일 수 있으므로 먼저 확인해야 하기 때문이에요.",

        wrong: [
          "인형이 너무 작기 때문이에요.",
          "열차가 늦기 때문이에요.",
          "승강장이 좁기 때문이에요."
        ]

      },

      {

        type:
          "ACTION",

        label:
          "ACTION · 어떻게?",

        question:
          "어떻게 말하는 것이 좋을까요?",

        correct:
          "내 인형인지 먼저 물어보고 특징을 확인해요.",

        wrong: [
          "아무 말 없이 가져가요.",
          "상대방에게 화를 내요.",
          "인형을 숨겨요."
        ]

      }

    ],

    speak:
      `${child2.name}야, 혹시 그 인형을 한번 보여줄래? 내 ${toy.name}인지 확인해보고 싶어.`,

    run() {

      movePerson(
        child1,
        "대합실"
      );

    }

  };

}


/* =========================================================
   사건 25
   스파이디가 전광판을 가림
========================================================= */

function sillySpideyEvent() {

  const child =
    random(children);


  return {

    title:
      "🕷️ 스파이디가 안내판을 가리고 있어요",

    person:
      child,

    story:
      `${iga(child.name)} 스파이디를 전광판 앞에 올려두었습니다. 스파이디 때문에 다른 승객들이 열차 안내를 보기 어려워졌습니다.`,

    dialogue: [

      [
        child.name,
        "스파이디도 기차 안내를 보고 있어요!"
      ],

      [
        "역무원",
        "다른 승객들도 전광판을 볼 수 있도록 해주세요."
      ]

    ],

    questions: [

      createWhoQuestion(
        child
      ),

      {

        type:
          "WHAT",

        label:
          "WHAT · 어떤 일?",

        question:
          "어떤 문제가 생겼나요?",

        correct:
          "스파이디가 전광판을 가려 다른 승객이 보기 어려워요.",

        wrong: [
          "열차가 고장 났어요.",
          "스파이디가 기차를 운전하고 있어요.",
          "승강장이 사라졌어요."
        ]

      },

      {

        type:
          "WHY",

        label:
          "WHY · 왜?",

        question:
          "왜 스파이디를 옮겨야 할까요?",

        correct:
          "다른 사람들도 안내 정보를 봐야 하기 때문이에요.",

        wrong: [
          "스파이디가 무겁기 때문이에요.",
          "열차가 빨라지기 때문이에요.",
          "기차표가 작기 때문이에요."
        ]

      },

      {

        type:
          "ACTION",

        label:
          "ACTION · 어떻게?",

        question:
          "어떻게 하면 좋을까요?",

        correct:
          "스파이디를 다른 곳으로 옮겨 전광판이 잘 보이게 해요.",

        wrong: [
          "전광판을 더 가려요.",
          "다른 승객에게 보지 말라고 해요.",
          "스파이디를 승강장 바닥에 던져요."
        ]

      }

    ],

    speak:
      `${child.name}야, 다른 사람들도 안내판을 봐야 하니까 스파이디를 옆으로 옮겨주자.`,

    run() {

      movePerson(
        child,
        "전광판 앞"
      );

    }

  };

}


/* =========================================================
   사건 목록
========================================================= */

const eventFactories = [

  lostChildEvent,

  wrongPlatformEvent,

  safetyLineEvent,

  fallenEvent,

  lostBagEvent,

  missedAnnouncementEvent,

  restroomEvent,

  runningPassengerEvent,

  cryingBabyEvent,

  missingKkakkungiEvent,

  spideyDangerEvent,

  delayedTrainEvent,

  wrongSeatEvent,

  queueEvent,

  elevatorHelpEvent,

  destinationQuestionEvent,

  closingDoorEvent,

  lostTicketEvent,

  waitingFamilyEvent,

  misunderstandingEvent,

  droppedObjectEvent,

  talkingTogetherEvent,

  askAgainEvent,

  toyMixupEvent,

  sillySpideyEvent

];


/* =========================================================
   사건 랜덤 선택
========================================================= */

function createEvent() {

  if (
    usedEventIndexes.length >=
    eventFactories.length
  ) {

    usedEventIndexes = [];

  }


  let index;


  do {

    index =
      Math.floor(
        Math.random() *
        eventFactories.length
      );

  }

  while (
    usedEventIndexes.includes(
      index
    )
  );


  usedEventIndexes.push(
    index
  );


  return eventFactories[index]();

}


/* =========================================================
   대화 표시
========================================================= */

function renderDialogue(
  dialogue
) {

  $("dialogueBox").innerHTML =
    "";


  dialogue.forEach(
    item => {

      const line =
        document.createElement(
          "div"
        );


      line.className =
        "dialogue";


      const icon =
        getCharacterIcon(
          item[0]
        );


      line.innerHTML = `
        <b>${icon} ${item[0]}</b>
        <br>
        ${item[1]}
      `;


      $("dialogueBox")
        .appendChild(
          line
        );

    }
  );

}


/* =========================================================
   사건 시작
========================================================= */

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


  if (
    currentEvent.run
  ) {

    currentEvent.run();

  }


  $("speakBtn").textContent =
    "말했어요!";


  renderQuestion();

}


/* =========================================================
   질문 표시
========================================================= */

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


/* =========================================================
   정답 선택
========================================================= */

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
      ...document.querySelectorAll(
        ".choice"
      )
    ];


  if (
    answer ===
    currentQuestion.correct
  ) {

    button.classList.add(
      "correct"
    );


    score += 2;


    $("feedback").textContent =
      "✅ 맞았어요! 상황을 잘 이해했어요.";

  }

  else {

    button.classList.add(
      "wrong"
    );


    const correctButton =
      buttons.find(
        item =>
          item.textContent ===
          currentQuestion.correct
      );


    if (
      correctButton
    ) {

      correctButton.classList.add(
        "correct"
      );

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


/* =========================================================
   다음 질문
========================================================= */

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


/* =========================================================
   말하기 완료
========================================================= */

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


/* =========================================================
   게임 종료
========================================================= */

function finishGame() {

  $("result").innerHTML =
    `
      🚨 해결한 사건 <b>${TOTAL_ROUNDS}</b>건
      <br><br>

      ⭐ 상황 이해 점수 <b>${score}</b>
      <br>

      💬 관제 말하기 점수 <b>${talkScore}</b>

      <br><br>

      누구 · 어디 · 어떤 일 · 왜 · 어떻게를
      모두 연습했어요!
    `;


  $("finish")
    .classList
    .remove(
      "hidden"
    );

}


/* =========================================================
   다시 시작
========================================================= */

$("restartBtn").onclick =
function() {

  round = 1;

  score = 0;

  talkScore = 0;

  usedEventIndexes = [];


  $("scoreText").textContent =
    "0";


  $("talkText").textContent =
    "0";


  $("finish")
    .classList
    .add(
      "hidden"
    );


  loadEvent();

};


/* =========================================================
   시작
========================================================= */

loadEvent();
