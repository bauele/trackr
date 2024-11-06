"use client";

import styles from "./landingStyles.module.css";
import classNames from "classnames";

import { firebaseLogIn, firebaseErrorToUserError } from "../api/firebase/route";
import { useState } from "react";

interface LoginProps {
  onCreateAccount: () => void;
  onForgotPassword: () => void;
  onLogInSuccess: () => void;
}

export default function Login({
  onCreateAccount,
  onForgotPassword,
  onLogInSuccess,
}: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [lastError, setLastError] = useState("");

  async function logIn() {
    console.log(`Email: ${email} Password: ${password}`);
    let result = await firebaseLogIn(email, password);
    result = result?.trim();
    console.log(result);

    //  Map the error code to a user-friendly error message
    if (result === "success") {
      onLogInSuccess();
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
          <a onClick={onCreateAccount}>I don't have an account</a>
          <a onClick={onForgotPassword}>Forgot password</a>
        </div>
      </form>
    </>
  );
}
