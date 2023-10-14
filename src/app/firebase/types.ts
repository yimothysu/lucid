export type addVideoType = {
  videoId: string;
  timestamp: number;
  question: string;
  answer: string;
};

export type getVideoQuestionAnswerType = {
  question: string[];
  answer: string[];
};
