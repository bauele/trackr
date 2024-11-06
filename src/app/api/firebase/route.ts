import { initializeApp, FirebaseError } from "firebase/app";

import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

//  Firebase web app configuration
//  In a real life production environment, these values would
//  be kept outside of source control
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId,
};

//  Initial the firebase configuration
const app = initializeApp(firebaseConfig);

//  Logs a user into the service
//  If successful, returns the auth token for the user
//  Otherwise, returns an error code
export async function firebaseLogIn(email: string, password: string) {
  const auth = getAuth();

  try {
    let credentials = await signInWithEmailAndPassword(auth, email, password);
    console.log(credentials);
    return "success";
  } catch (error) {
    //  A Firebase-specific error occured, such as an email email or password
    if (error instanceof FirebaseError) {
      let errorCode = error.code;
      return errorCode;
    }

    //  A different type of error occured
    else {
      return "";
    }
  }
}

export async function firebaseCreateAccount(email: string, password: string) {
  const auth = getAuth();

  try {
    let credentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return "success";
  } catch (error) {
    //  A Firebase-specific error occured, such as an email email or password
    if (error instanceof FirebaseError) {
      let errorCode = error.code;
      return errorCode;
    }

    //  A different type of error occured
    else {
      return "";
    }
  }
}

export async function firebaseResetPassword(email: string) {
  const auth = getAuth();
  try {
    let result = await sendPasswordResetEmail(auth, email);
    return "success";
  } catch (error) {
    if (error instanceof FirebaseError) {
      let errorCode = error.code;
      return errorCode;
    } else {
      return "";
    }
  }
}

export function firebaseErrorToUserError(error: string) {
  let errorMessage = "";

  switch (error) {
    case "auth/too-many-requests":
      errorMessage = "Too many attempts. Please try again later.";
      break;
    case "auth/invalid-credential":
      errorMessage = "Invalid email address or password.";
      break;
    case "auth/email-already-in-use":
      errorMessage = "That email is already is use.";
      break;
    case "auth/invalid-email":
      errorMessage = "Invalid email address or password.";
      break;
    case "auth/user-not-found":
      errorMessage = "Account not found. Please sign up.";
      break;
    case "auth/missing-email":
      errorMessage = "Please enter an email address.";
      break;
    case "auth/missing-password":
      errorMessage = "Please enter your password.";
      break;
    case "auth/wrong-password":
      errorMessage = "Invalid email address or password.";
      break;
    case "auth/weak-password":
      errorMessage = "Password does not meet minimum requirements.";
      break;
    default:
      errorMessage = "An unknown error occured.";
      break;
  }

  return errorMessage;
}
