import { app } from "./config";
import {
  doc,
  getDoc,
  getFirestore,
  setDoc,
  collection,
  getDocs,
  limit,
  query,
} from "firebase/firestore";
import { addVideoType, GetRandomVideo, QuestionAnswerPairs } from "./types";

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

// Query firebase randomly to get 12 videos. If there are less than 12 videos, return all videos.
export async function getRandomVideos() {
  const videosRef = collection(db, "videos");
  const q = query(videosRef, limit(12));
  const videosSnapshot = await getDocs(q);

  const videos: GetRandomVideo[] = videosSnapshot.docs.map((doc) => {
    return {
      id: doc.id,
      ...(doc.data() as QuestionAnswerPairs),
    };
  });

  const randomVideos = videos
    .sort(() => Math.random() - Math.random())
    .slice(0, 12);

  return randomVideos;
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

export async function addVideoQuestion(addVideoObj: addVideoType) {
  // check if videoId exists
  const exists = await checkIfExists("videos", addVideoObj.videoId);
  if (!exists) {
    // add videoId to videos collection
    await setDoc(doc(db, "videos", addVideoObj.videoId), {
      questionAnswerPairs: [],
      title: addVideoObj.title,
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
        title: addVideoObj.title,
      });
    })
    .catch((error) => {
      console.log(error);
    });
}
