import styles from "./inventoryTableStyles.module.css";
import classNames from "classnames";

import { InventoryRecord } from "./inventoryRecord";
import { useEffect } from "react";

interface InventoryTableProps {
  items: Array<any>;
}

export function InventoryTable({ items }: InventoryTableProps) {
  useEffect(() => {}, [items]);

  return (
    <>
      <div className={styles.inventory_table_controls}>
        <button className={classNames("button", "button-pad", styles.button)}>
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
      <table className={styles.inventory_table}>
        <tbody>
          <tr>
            <th>
              <input type="checkbox" />
            </th>

            <th>Item Name</th>
            <th>Quantity</th>
          </tr>
          {items?.map((item, index) => (
            <InventoryRecord
              key={index}
              itemName={item.itemName}
              dateAdded={item.dateAdded}
              quantity={item.quantity}
              lastModified={item.lastModified}
            />
          ))}
        </tbody>
      </table>
    </>
  );
}
