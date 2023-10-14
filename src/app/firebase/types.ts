export type addVideoType = {
  videoId: string;
  timestamp: number;
  question: string;
  answer: string;
};

export type QuestionAnswerPair = {
  question: string;
  answer: string;
  timestamp: number;
};

export type QuestionAnswerPairs = {
  questionAnswerPairs: QuestionAnswerPair[];
};
