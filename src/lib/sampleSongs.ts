import { Song } from "./types";

export const sampleSongs: Song[] = [
  {
    id: "sample-1",
    title: "주님의 사랑",
    artist: "",
    bpm: 76,
    sections: [
      {
        name: "1절",
        lines: [
          { text: "주님의 사랑이 이 곳에 넘치네", duration: 4 },
          { text: "우리 함께 모여 주를 찬양해", duration: 4 },
          { text: "어둠 속에 빛을 비추시는 주", duration: 4 },
          { text: "영원토록 주의 이름 높이리", duration: 4 },
        ],
      },
      {
        name: "2절",
        lines: [
          { text: "주님의 은혜가 강같이 흐르네", duration: 4 },
          { text: "목마른 이 영혼 주 앞에 나와", duration: 4 },
          { text: "생명수 주시는 우리 주님께", duration: 4 },
          { text: "감사의 노래를 올려 드리네", duration: 4 },
        ],
      },
      {
        name: "코러스",
        lines: [
          { text: "할렐루야 할렐루야", duration: 3 },
          { text: "영원히 주를 찬양하리", duration: 4 },
          { text: "할렐루야 할렐루야", duration: 3 },
          { text: "주님께 영광 돌리세", duration: 4 },
        ],
      },
    ],
  },
  {
    id: "sample-2",
    title: "찬양하라",
    artist: "",
    bpm: 92,
    sections: [
      {
        name: "1절",
        lines: [
          { text: "온 땅이여 주를 찬양하라", duration: 4 },
          { text: "하늘과 땅 모두 주의 것이라", duration: 4 },
          { text: "만물이 주께 영광 돌리며", duration: 4 },
          { text: "창조주 하나님 높이 찬양해", duration: 4 },
        ],
      },
      {
        name: "코러스",
        lines: [
          { text: "찬양하라 찬양하라", duration: 3 },
          { text: "우리 주 하나님을 찬양하라", duration: 4 },
          { text: "높고 높은 보좌 위에 앉으신 주", duration: 4 },
          { text: "영원히 영광 받으소서", duration: 4 },
        ],
      },
      {
        name: "브릿지",
        lines: [
          { text: "주의 이름 영원히 빛나리", duration: 4 },
          { text: "세상 끝날 그 날까지", duration: 3 },
          { text: "온 민족이 무릎 꿇어", duration: 3 },
          { text: "주 예수 이름 찬양해", duration: 4 },
        ],
      },
    ],
  },
  {
    id: "sample-3",
    title: "할렐루야",
    artist: "",
    bpm: 80,
    sections: [
      {
        name: "찬양",
        lines: [
          { text: "할렐루야 주님을 찬양해", duration: 4 },
          { text: "온 마음 다해 주를 높이리", duration: 4 },
          { text: "새벽부터 저녁까지 주의 이름 찬양해", duration: 5 },
          { text: "할렐루야 아멘", duration: 3 },
        ],
      },
    ],
  },
];
