import styles from "./styles.module.css";
import classNames from "classnames";

export default function Login() {
  return (
    <div className={styles.page_container}>
      <div className={styles.content_container}>
        <div className={styles.page_upper_container}>
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
          <div className={styles.inventory_table_controls}>
            <button className={classNames("button", styles.button)}>
              Add Item
            </button>
            <div className={styles.sort_controls}>
              <label htmlFor="sort">Sort By</label>
              <select name="sort" id="sort">
                <option value="date_added">Date Added</option>
                <option value="item_name">Item Name</option>
                <option value="quantity">Quantity</option>
                <option value="last_modified">Last Modified</option>
              </select>
            </div>
          </div>
        </div>

        <table className={styles.inventory_table}>
          <tbody>
            <tr>
              <th>
                <input type="checkbox" />
              </th>

              <th>Item Name</th>
              <th>Quantity</th>
            </tr>
            <tr className={styles.item_record}>
              <td>
                <input type="checkbox" />
              </td>
              <td>
                Blanket
                <td>10/30/2024</td>
              </td>
              <td>
                3<td>10/30/2024</td>
              </td>
            </tr>
            <tr className={styles.item_record}>
              <td>
                <input type="checkbox" />
              </td>
              <td>
                Blanket
                <td>10/30/2024</td>
              </td>
              <td>
                3<td>10/30/2024</td>
              </td>
            </tr>
            <tr className={styles.item_record}>
              <td>
                <input type="checkbox" />
              </td>
              <td>
                Blanket
                <td>10/30/2024</td>
              </td>
              <td>
                3<td>10/30/2024</td>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
