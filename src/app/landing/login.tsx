"use client";

import styles from "./landingStyles.module.css";
import classNames from "classnames";

import { useFirebase } from "../hooks/useFirebase";
import { useState } from "react";

//  These props are callback functions that are called in
//  reponse to actions taken while using form
interface LoginProps {
  onCreateAccount: () => void;
  onForgotPassword: () => void;
  onLogInSuccess: () => void;
}

//  This component represents the Login form.
export default function Login({
  onCreateAccount,
  onForgotPassword,
  onLogInSuccess,
}: LoginProps) {
  //  State variables used to track what text the user
  //  has suppied for each of the form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [lastError, setLastError] = useState("");

  //  This hook exposes functions that can be used to
  //  perform actions using the Firebase module
  const { firebaseLogIn, firebaseErrorToUserError } = useFirebase();

  async function logIn() {
    //  Attempt to log in to the authentication service
    let result = await firebaseLogIn(email, password);
    result = result?.trim();

    //  Map the error code to a user-friendly error message
    if (result === "success") {
      onLogInSuccess();
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
      } else if (inputName === "password") {
        setPassword(value);
      }
    }
  };

  return (
    <>
      <h2>Log In</h2>
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

        <label htmlFor="password" />
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          onChange={handleInputChange}
          value={password}
        />

        <p className={styles.error}>{lastError}</p>

        <input
          type="button"
          className={classNames("button", "bg-pink", styles.login_button)}
          value="Log In"
          onClick={logIn}
        />

        <div>
          <a onClick={onCreateAccount}>I don&apos;t have an account</a>
          <a onClick={onForgotPassword}>Forgot password</a>
        </div>
      </form>
    </>
  );
}
