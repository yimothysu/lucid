import { app } from "./config";
import {
  doc,
  getDoc,
  getFirestore,
  setDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { addVideoType, QuestionAnswerPair } from "./types";

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

export async function getVideoQuestions(videoId: string) {
  if (!(await checkIfExists("videos", videoId))) {
    return [];
  }

  // get all values from collection
  const collectionSnapshot = await getDocs(
    collection(doc(db, "videos", videoId), "timestamps")
  );

  const questionAnswer: QuestionAnswerPair[] = [];

  collectionSnapshot.forEach((doc) => {
    questionAnswer.push(doc.data() as QuestionAnswerPair);
  });

  return questionAnswer;
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
    await setDoc(doc(db, "videos", addVideoObj.videoId), {});
  }

  // get collection reference
  const collectionRef = collection(
    doc(db, "videos", addVideoObj.videoId),
    "timestamps"
  );

  // add question as a document to timestamps collection with id set to timestamp
  const docRef = doc(collectionRef, addVideoObj.timestamp.toString());

  getDoc(docRef)
    .then((docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as QuestionAnswerPair[];
        setDoc(
          docRef,
          {
            questionAnswerPairs: [
              ...data,
              {
                question: addVideoObj.question,
                answer: addVideoObj.answer,
              },
            ],
          },
          { merge: true }
        );
      } else {
        setDoc(docRef, {
          question: [addVideoObj.question],
          answer: [addVideoObj.answer],
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
}
