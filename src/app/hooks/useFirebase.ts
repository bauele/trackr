import { initializeApp, FirebaseError } from "firebase/app";
import { app } from "../../firebase/firebase";
import { auth } from "../../firebase/firebase";

import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useEffect, useState } from "react";

//  Logs a user into the service
//  If successful, returns the auth token for the user
//  Otherwise, returns an error code
async function firebaseLogIn(email: string, password: string) {
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

async function firebaseCreateAccount(email: string, password: string) {
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

async function firebaseResetPassword(email: string) {
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

function firebaseErrorToUserError(error: string) {
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

//  Custom hook
export function useFirebase() {
  const [user, setUser] = useState<string | null>(null);
  const auth = getAuth();

  useEffect(() => {
    if (auth.currentUser) {
      setUser(auth.currentUser.uid);
    }
  }, []);

  return {
    firebaseLogIn,
    firebaseCreateAccount,
    firebaseResetPassword,
    firebaseErrorToUserError,
    user,
  };
}
