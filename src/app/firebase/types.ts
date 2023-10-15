export type addVideoType = {
  videoId: string;
  timestamp: number;
  question: string;
  answer: string;
  title: string;
};

export type QuestionAnswerPair = {
  question: string;
  answer: string;
  timestamp: number;
};

export type QuestionAnswerPairs = {
  questionAnswerPairs: QuestionAnswerPair[];
  title: string;
};

export type GetRandomVideo = QuestionAnswerPairs & {
  id: string;
};
