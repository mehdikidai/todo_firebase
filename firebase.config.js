import { initializeApp } from "firebase/app";
import { collection, getFirestore,doc } from "firebase/firestore";
import config from "./config";

export const app = initializeApp(config.firebaseConfig);
export const db = getFirestore(app);
export const todoRef = collection(db, config.name_collection_todo);
export const docRefById = (id) => doc(db, config.name_collection_todo, id);
export const nameCollectionTodo = config.name_collection_todo
