import { ChangeEvent, ChangeEventHandler } from "react";
import styles from "./inventoryRecordStyles.module.css";
import classNames from "classnames";

interface InventoryRecordProps {
  itemName: string;
  dateAdded: string;
  quantity: number;
  lastModified: string;
  isSelected: boolean;
  onSelect: (event: ChangeEvent<HTMLInputElement>) => void;
}

export function InventoryRecord({
  itemName,
  dateAdded,
  quantity,
  lastModified,
  isSelected,
  onSelect,
}: InventoryRecordProps) {
  return (
    <tr
      className={classNames(styles.item_record, isSelected && styles.selected)}
    >
      <td>
        <input
          type="checkbox"
          //  The checked state of the checkbox should be determined by
          //  the parent component
          checked={isSelected}
          //  If checkbox is clicked, call the provided callback function
          //  provided by parent
          onChange={(event) => onSelect(event)}
        />
      </td>
      <td>
        <input type="text" placeholder={itemName}></input>

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
