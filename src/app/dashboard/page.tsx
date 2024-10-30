import styles from "./styles.module.css";
import classNames from "classnames";

export default function Login() {
  return (
    <div className={styles.page_container}>
      <div className={styles.heading_container}>
        <div className={styles.heading_content}>
          <h1>Kyle's Inventory</h1>
          <h2>Last Modified: Today</h2>
        </div>
        <div>
          <button className={classNames("button", styles.button)}>
            Log Out
          </button>
        </div>
      </div>
      <button className={classNames("button", styles.button)}>Add Item</button>
      <table className={styles.inventory_table}>
        <tbody>
          <tr>
            <th>Date Added</th>
            <th>Item Name</th>
            <th>Quantity</th>
            <th>Last Modified</th>
          </tr>
          <tr>
            <td>10/30/2024</td>
            <td>Blanket</td>
            <td>3</td>
            <td>10/30/2024</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
