"use client";

import styles from "./landingStyles.module.css";
import classNames from "classnames";

import { useFirebase } from "../hooks/useFirebase";
import { useState } from "react";

//  These props are callback functions that are called in
//  reponse to actions taken while using form
interface CreateAccountProps {
  onBackToLogIn: () => void;
}

export default function ResetPassword({ onBackToLogIn }: CreateAccountProps) {
  //  State variables used to track what text the user
  //  has suppied for each of the form fields
  const [email, setEmail] = useState("");
  const [lastError, setLastError] = useState("");
  const { firebaseResetPassword, firebaseErrorToUserError } = useFirebase();

  async function resetPassword() {
    //  Attempt to reset the password using the Firebase
    //  authentication module
    let result = await firebaseResetPassword(email);
    result = result?.trim();

    //  Map the error code to a user-friendly error message
    if (result === "success") {
      setLastError(
        "If an account exists with this email address, an email will be sent with instructions on resetting your password."
      );
    } else {
      const error = firebaseErrorToUserError(result);
      setLastError(error);
    }
  }

  const handleInputChange = (event: React.FormEvent) => {
    //  Ensure that target element is in fact an input field
    if (event.target instanceof HTMLInputElement) {
      const inputName = event.target.name;
      const value = event.target.value;

      //  Determine which input was changed and set
      //  the matching state variable
      if (inputName === "email") {
        setEmail(value);
      }
    }
  };

  return (
    <>
      <h2>Forgot Password</h2>
      <form className={styles.login_form}>
        <label htmlFor="email" />
        <input
          type="text"
          id="email"
          name="email"
          placeholder="Email"
          onChange={handleInputChange}
          value={email}
        />

        <p className={styles.error}>{lastError}</p>

        <input
          type="button"
          className={classNames("button", "bg-pink", styles.login_button)}
          value="Password Reset"
          onClick={resetPassword}
        />
        <input
          type="button"
          className={classNames("button", "bg-purple", styles.login_button)}
          value="Back to Log In"
          onClick={onBackToLogIn}
        />
      </form>
    </>
  );
}
