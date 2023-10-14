import { app } from "./config";
import {
  doc,
  getDoc,
  getFirestore,
  setDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { addVideoType, QuestionAnswerPair, QuestionAnswerPairs } from "./types";

export const db = getFirestore(app);

// Given a collection named videos check if an id exists

export async function checkIfExists(collection: string, id: string) {
  const docRef = doc(db, collection, id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return true;
  } else {
    return false;
  }
}

export async function getVideoTimeStamps(videoId: string) {
  if (!(await checkIfExists("videos", videoId))) {
    return [];
  }

  // get all values from collection
  const collectionSnapshot = await getDoc(doc(db, "videos", videoId));

  const questionAnswerPairs = collectionSnapshot.data() as QuestionAnswerPairs;

  return questionAnswerPairs.questionAnswerPairs;
}

export async function getVideoQuestionAnswer(
  videoId: string,
  timestamp: number
) {
  if (
    !(await checkIfExists(`videos/${videoId}/timestamps`, timestamp.toString()))
  ) {
    return {
      question: [],
      answer: [],
    };
  }

  // get collection reference
  const collectionRef = collection(doc(db, "videos", videoId), "timestamps");

  // get document reference
  const docRef = doc(collectionRef, timestamp.toString());

  // get document snapshot
  const docSnap = await getDoc(docRef);

  // return document data
  return docSnap.data() as QuestionAnswerPair;
}

export async function addVideoQuestion(addVideoObj: addVideoType) {
  // check if videoId exists
  const exists = await checkIfExists("videos", addVideoObj.videoId);
  if (!exists) {
    // add videoId to videos collection
    await setDoc(doc(db, "videos", addVideoObj.videoId), {
      questionAnswerPairs: [],
    });
  }

  // get collection reference
  const documentReference = doc(db, "videos", addVideoObj.videoId);

  getDoc(documentReference)
    .then((docSnap) => {
      const data = docSnap.data() as QuestionAnswerPairs;
      const questionAnswerPairs = data.questionAnswerPairs;
      questionAnswerPairs.push({
        question: addVideoObj.question,
        answer: addVideoObj.answer,
        timestamp: addVideoObj.timestamp,
      });
      setDoc(documentReference, {
        questionAnswerPairs: questionAnswerPairs,
      });
    })
    .catch((error) => {
      console.log(error);
    });
}
