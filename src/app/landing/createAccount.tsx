"use client";

import styles from "./landingStyles.module.css";
import classNames from "classnames";

import { useFirebase } from "../hooks/useFirebase";
import { useState } from "react";

//  These props are callback functions that are called in
//  reponse to actions taken while using form
interface CreateAccountProps {
  onBackToLogIn: () => void;
  onCreateAccountSuccess: () => void;
}

export default function CreateAccount({
  onBackToLogIn,
  onCreateAccountSuccess,
}: CreateAccountProps) {
  //  State variables used to track what text the user
  //  has suppied for each of the form fields
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [lastError, setLastError] = useState("");

  const { firebaseCreateAccount, firebaseErrorToUserError } = useFirebase();

  async function createAccount() {
    //  Ensure a display name has been entered
    if (displayName === "") {
      setLastError("Please enter a display name.");
      return;
    }

    //  Ensure that the both password fields match
    if (password !== confirmPassword) {
      setLastError("Your passwords do not match.");
      return;
    }

    //  Attempt to create an account useing the firebase authentication
    //  module
    let result = await firebaseCreateAccount(email, password, displayName);
    result = result?.trim();

    //  Map the error code to a user-friendly error message
    if (result === "success") {
      onCreateAccountSuccess();
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
      if (inputName === "display-name") {
        setDisplayName(value);
      } else if (inputName === "email") {
        setEmail(value);
      } else if (inputName === "password") {
        setPassword(value);
      } else if (inputName === "confirm-password") {
        setConfirmPassword(value);
      }
    }
  };

  return (
    <>
      <h2>Create Account</h2>
      <form className={styles.login_form}>
        <label htmlFor="display-name" />
        <input
          type="text"
          id="display-name"
          name="display-name"
          placeholder="Display Name"
          onChange={handleInputChange}
          value={displayName}
        />

        <label htmlFor="email" />
        <input
          type="text"
          id="email"
          name="email"
          placeholder="Email"
          onChange={handleInputChange}
          value={email}
        />

        <label htmlFor="password" />
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          onChange={handleInputChange}
          value={password}
        />

        <label htmlFor="verify-password" />
        <input
          type="password"
          id="confirm-password"
          name="confirm-password"
          placeholder="Confirm Password"
          onChange={handleInputChange}
          value={confirmPassword}
        />

        <p className={styles.error}>{lastError}</p>

        <input
          type="button"
          className={classNames("button", "bg-pink", styles.login_button)}
          value="Create Account"
          onClick={createAccount}
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
