import { FirebaseError } from "firebase/app";
import { auth } from "../../firebase/firebase";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { useEffect, useState } from "react";

//  Logs a user into the service
//  If successful, returns success indicator
//  Otherwise, returns an error code
async function firebaseLogIn(email: string, password: string) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return "success";
  } catch (error) {
    //  A Firebase-specific error occured, such as an email email or password
    if (error instanceof FirebaseError) {
      const errorCode = error.code;
      return errorCode;
    }

    //  A different type of error occured
    else {
      return "";
    }
  }
}

//  Creates a user account on the service
//  If successful, returns success indicator
//  Otherwise, returns an error code
async function firebaseCreateAccount(
  email: string,
  password: string,
  displayName: string
) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    await updateProfile(user, {
      displayName: displayName,
    });

    return "success";
  } catch (error) {
    //  A Firebase-specific error occured, such as an email email or password
    if (error instanceof FirebaseError) {
      const errorCode = error.code;
      return errorCode;
    }

    //  A different type of error occured
    else {
      return "";
    }
  }
}

//  Sends a password reset email to the user
//  If successful, returns success indicator
//  Otherwise, returns an error code
async function firebaseResetPassword(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
    return "success";
  } catch (error) {
    if (error instanceof FirebaseError) {
      const errorCode = error.code;
      return errorCode;
    } else {
      return "";
    }
  }
}

async function firebaseSignOut() {
  try {
    await signOut(auth);
  } catch (error) {
    if (error instanceof FirebaseError) {
      const errorCode = error.code;
      return errorCode;
    } else {
      return "";
    }
  }
}
//  Maps a Firebase-specific error code to a user friendly string
//  If error is not Firebase-specific, returns a generic error
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

//  Custom authentication hook
export function useFirebase() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userDisplayName, setUserDisplayName] = useState<string | null>(null);

  useEffect(() => {
    //  Set an observer function to watch for user authentication
    //  and set the state
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await user.reload();
        setUserId(user.uid);
        setUserDisplayName(user.displayName);
      } else {
        setUserId(null);
        setUserDisplayName(null);
      }

      setLoading(false);
    });

    //  Clean up on component dismount
    return () => unsubscribe();
  }, [auth]);

  return {
    firebaseLogIn,
    firebaseCreateAccount,
    firebaseResetPassword,
    firebaseSignOut,
    firebaseErrorToUserError,
    userId,
    userDisplayName,
    loading,
  };
}
