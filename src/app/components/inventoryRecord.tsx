import { ChangeEvent, useEffect } from "react";
import styles from "./inventoryRecordStyles.module.css";
import classNames from "classnames";

import { EditableLabel } from "./editableLabel";

interface InventoryRecordProps {
  itemName: string;
  dateAdded: string;
  quantity: string;
  lastModified: string;
  isSelected: boolean;
  onSelect: (event: ChangeEvent<HTMLInputElement>) => void;
  onRowUpdate: (field: string, value: string) => void;
}

export function InventoryRecord({
  itemName,
  dateAdded,
  quantity,
  lastModified,
  isSelected,
  onSelect,
  onRowUpdate,
}: InventoryRecordProps) {
  function updateValue() {
    //  Send message to table insructing it that a value was.
    //  Each editable label in this row should have an id
    //  assigned that will allow it to be modified in json
    //  at the table level
  }

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
        <span className={styles.row}>
          <EditableLabel
            text={itemName}
            fieldName="itemName"
            inputMode="text"
            onUpdate={(field, value) => onRowUpdate(field, value)}
          />
          {dateAdded}
        </span>
      </td>
      <td>
        <span className={styles.row}>
          <EditableLabel
            text={quantity}
            fieldName="quantity"
            inputMode="numeric"
            onUpdate={(field, value) => onRowUpdate(field, value)}
          />
          {lastModified}
        </span>
      </td>
    </tr>
  );
}
