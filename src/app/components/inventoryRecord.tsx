import { ChangeEvent, useEffect, forwardRef } from "react";
import styles from "./inventoryRecordStyles.module.css";
import classNames from "classnames";

import { EditableLabel } from "./editableLabel";

interface InventoryRecordProps {
  itemName: string;
  dateAdded: string;
  quantity: string;
  lastModified: string;
  isSelected: boolean;
  newRecord: boolean;
  onSelect: (event: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onRowUpdate: (field: string, value: string) => void;
}

export const InventoryRecord = forwardRef<
  HTMLInputElement,
  InventoryRecordProps
>(
  (
    {
      itemName,
      dateAdded,
      quantity,
      lastModified,
      isSelected,
      newRecord,
      onSelect,
      onKeyDown,
      onRowUpdate,
    },
    ref
  ) => {
    return (
      <tr
        className={classNames(
          styles.item_record,
          isSelected && styles.selected
        )}
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
            onKeyDown={(event) => onKeyDown(event)}
          />
        </td>
        <td>
          <span className={styles.row}>
            <EditableLabel
              text={itemName}
              fieldName="itemName"
              inputMode="text"
              isExternalEditing={newRecord ? true : false}
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
              isExternalEditing={false}
              onUpdate={(field, value) => onRowUpdate(field, value)}
            />
            {lastModified}
          </span>
        </td>
      </tr>
    );
  }
);
