import styles from "./styles.module.css";
import classNames from "classnames";

export default function Login() {
  return (
    <div className={classNames(styles.page_container, styles.letter_spacing)}>
      <h1>Trackr</h1>
      <div className={styles.content_container}>
        <div
          className={classNames(styles.cta_container, styles.letter_spacing)}
        >
          <h2>Inventory management anytime, anywhere.</h2>
          <p>
            Join the thousands of users that are transforming the way they track
            their stuff.
          </p>
        </div>
        <div className={styles.login_container}>
          <h2>Log In</h2>
          <form className={styles.login_form}>
            <label htmlFor="email" />
            <input type="text" id="email" name="email" placeholder="Email" />

            <label htmlFor="password" />
            <input
              type="text"
              id="password"
              name="password"
              placeholder="Password"
            />

            <input
              type="button"
              className={classNames("button", styles.login_button)}
              value="Log In"
            />

            <div>
              <a>I don't have an account</a>
              <a>Forgot password</a>
            </div>
          </form>
        </div>
      </div>
      <div className={classNames(styles.footer, styles.letter_spacing)}>
        <p>Terms of Service</p>
        <p>Privacy Policy</p>
      </div>
    </div>
  );
}
