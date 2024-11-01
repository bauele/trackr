import styles from "./inventoryRecordStyles.module.css";
import classNames from "classnames";

interface InventoryRecordProps {
  itemName: string;
  dateAdded: string;
  quantity: number;
  lastModified: string;
}

export function InventoryRecord({
  itemName,
  dateAdded,
  quantity,
  lastModified,
}: InventoryRecordProps) {
  return (
    <tr className={styles.item_record}>
      <td>
        <input type="checkbox" />
      </td>
      <td>
        {itemName}
        <br></br>
        {dateAdded}
      </td>
      <td>
        {quantity}
        <br></br>
        {lastModified}
      </td>
    </tr>
  );
}
