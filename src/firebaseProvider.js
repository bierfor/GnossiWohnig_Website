import firebaseConfig from "./firebaseConfig";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import "firebase/compat/functions";

const {
  initializeAppCheck,
  ReCaptchaV3Provider,
} = require("firebase/app-check");

const firebaseApp = firebase.initializeApp(firebaseConfig);

initializeAppCheck(firebaseApp, {
  provider: new ReCaptchaV3Provider("6Len09IjAAAAAKS_yAqxGvtnLRE8mceBdHw-dzVG"),
  isTokenAutoRefreshEnabled: true,
});

export const storage = firebaseApp.storage().ref();
export const firebaseAppAuth = firebaseApp.auth();
export const firestore = firebaseApp.firestore();
const functions = firebaseApp.functions();

export const getDocument = (collection, id) => {
  return firestore
    .collection(collection)
    .doc(id)
    .get()
    .then((snapshot) => {
      return snapshot.data();
    })
    .catch((err) => console.log(err));
};

export const setDocument = (collection, id, data) => {
  return firestore.collection(collection).doc(id).set(data);
};

export const updateDocument = (collection, id, data) => {
  return firestore.collection(collection).doc(id).update(data);
};

export const addToArrayInDocument = (collection, id, data) => {
  return firestore
    .collection(collection)
    .doc(id)
    .update({ files: firebase.firestore.FieldValue.arrayUnion(data) });
};

export const deleteDocument = (collection, id) => {
  return firestore.collection(collection).doc(id).delete();
};

export const getCollection = (collection) => {
  return firestore
    .collection(collection)
    .get()
    .then((snapshot) => {
      const rawData = snapshot.docs.map((doc) => {
        const docId = { doc: doc.id };
        const docData = doc.data();
        return { ...docId, ...docData };
      });
      return rawData;
    })
    .catch((err) => console.log(err));
};

export const setFile = async (collection, title, name, type, file) => {
  const fileRef = storage.child(file.name);
  await fileRef.put(file);
  const fileUrl = await fileRef.getDownloadURL();

  const data = {
    title: title,
    name: name,
    type: type,
    url: fileUrl,
    timestamp: Date.now(),
  };

  return setDocument(collection, name + file.name, data);
};

export const callCloudFunctionWithAppCheck = (functionToCall, data) => {
  return functions.httpsCallable(functionToCall)(data);
};