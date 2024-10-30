import styles from "./styles.module.css";

export default function Login() {
  return (
    <div className={styles.page_container}>
      <h1>Trackr</h1>
      <div className={styles.content_container}>
        <div className={styles.cta_container}>
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

            <input type="button" className={styles.button} value="Log In" />

            <div>
              <a>I don't have an account</a>
              <a>Forgot password</a>
            </div>
          </form>
        </div>
      </div>
      <div className={styles.footer}>
        <p>Terms of Service</p>
        <p>Privacy Policy</p>
      </div>
    </div>
  );
}
