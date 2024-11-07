"use client";

import styles from "./landingStyles.module.css";
import classNames from "classnames";

import { useFirebase } from "../hooks/useFirebase";
import { useState } from "react";

interface CreateAccountProps {
  onBackToLogIn: () => void;
}

export default function ResetPassword({ onBackToLogIn }: CreateAccountProps) {
  const [email, setEmail] = useState("");
  const [lastError, setLastError] = useState("");
  const { firebaseResetPassword, firebaseErrorToUserError } = useFirebase();

  async function resetPassword() {
    let result = await firebaseResetPassword(email);
    result = result?.trim();
    console.log(result);

    //  Map the error code to a user-friendly error message
    if (result === "success") {
      setLastError(
        "If an account exists with this email address, an email will be sent with instructions on resetting your password."
      );
    } else {
      let error = firebaseErrorToUserError(result);
      console.log(error);
      setLastError(error);
    }
  }

  const handleInputChange = (event: React.FormEvent) => {
    //  Ensure that target element is in fact an input field
    if (event.target instanceof HTMLInputElement) {
      let inputName = event.target.name;
      let value = event.target.value;

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
