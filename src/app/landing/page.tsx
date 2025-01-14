"use client";

import styles from "./landingStyles.module.css";
import classNames from "classnames";

import { useEffect, useState } from "react";
import Login from "./login";
import CreateAccount from "./createAccount";
import { useRouter } from "next/navigation";
import ResetPassword from "./resetPassword";
import { useFirebase } from "../hooks/useFirebase";

//  An enum to determine what the user is doing
//  on the page. They are either attempting to log in,
//  creating a new account, or resetting their password
enum PAGE_STATE {
  LOG_IN,
  CREATE_ACCOUNT,
  RESET_PASSWORD,
}

//  This component represents the Landing page. It will allow
//  the user to log in, create an account, or reset their password.
//  If the user is already logged in when accessing this page, it
//  will redirect them to the Dashboard page
export default function Landing() {
  //  Values obtained from a hook that return the user's id or
  //  whether or not the log in state is still being loaded
  const { userId, loading } = useFirebase();
  const router = useRouter();

  //  Page state that determines whether to show the content for
  //  logging in, creating an account, or resetting a password
  const [pageState, setPageState] = useState(PAGE_STATE.LOG_IN);

  //  When the userId value updates, redirect the user to the
  //  dashboard if they are actively logged in
  useEffect(() => {
    if (userId !== null) {
      router.push("/dashboard");
    }
  }, [userId]);

  return (
    <>
      {/*Do not render anything until page stops loading and the user id has been obtained */}
      {!userId && !loading && (
        <div
          className={classNames(styles.page_container, styles.letter_spacing)}
        >
          <h1>Trackr</h1>
          <div className={styles.content_container}>
            <div
              className={classNames(
                styles.cta_container,
                styles.letter_spacing
              )}
            >
              <h2>Inventory management anytime, anywhere.</h2>
              <p>
                Join the thousands of users that are transforming the way they
                track their stuff.
              </p>
            </div>

            <div className={styles.state_action_container}>
              {pageState === PAGE_STATE.LOG_IN && (
                <Login
                  onCreateAccount={() =>
                    setPageState(PAGE_STATE.CREATE_ACCOUNT)
                  }
                  onForgotPassword={() =>
                    setPageState(PAGE_STATE.RESET_PASSWORD)
                  }
                  onLogInSuccess={() => router?.push("/dashboard")}
                />
              )}
              {pageState === PAGE_STATE.CREATE_ACCOUNT && (
                <CreateAccount
                  onBackToLogIn={() => setPageState(PAGE_STATE.LOG_IN)}
                  onCreateAccountSuccess={() => router?.push("/dashboard")}
                />
              )}
              {pageState === PAGE_STATE.RESET_PASSWORD && (
                <ResetPassword
                  onBackToLogIn={() => setPageState(PAGE_STATE.LOG_IN)}
                />
              )}
            </div>
          </div>
          <div className={classNames(styles.footer, styles.letter_spacing)}>
            <p>Terms of Service</p>
            <p>Privacy Policy</p>
          </div>
        </div>
      )}
    </>
  );
}
