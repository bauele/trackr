import styles from "./inventoryTableStyles.module.css";
import classNames from "classnames";

import { InventoryRecord } from "./inventoryRecord";
import { useState, useEffect } from "react";

interface InventoryTableProps {
  items: Array<any>; //  TODO: Change this to be of the model type
  onAddItem: () => void;
  onDeleteItem: (selectedRows: Array<number>) => void;
  onRowUpdate: (rowIndex: number, field: string, value: string) => void;
}

//  This component represent a table of inventory records. It will
//  be used to display all of the inventory that a user has added
//  into their account.
export function InventoryTable({
  items,
  onAddItem,
  onDeleteItem,
  onRowUpdate,
}: InventoryTableProps) {
  const [selectedRows, setSelectedRows] = useState<Array<number>>([]);

  //  Add or remove a selected row
  const toggleSelectRow = (rowIndex: number) => {
    //  If the row is already select it, unselect it
    if (selectedRows.includes(rowIndex)) {
      setSelectedRows(
        selectedRows.filter((rowNumber) => rowNumber !== rowIndex)
      );
    }

    //  Otherwise, do select it
    else {
      setSelectedRows([...selectedRows, rowIndex]);
    }
  };

  //  Toggle the selection of all rows.
  //  Case 0: Initially no rows are selected    -> all rows will be selected
  //  Case 1: Initially some rows are selected  -> all rows will be selected
  //  Case 2: Initially all rows are selected   -> all rows will be deselected
  function toggleSelectAllRows() {
    //  Create a new array to contain the new rows to be selected
    let newSelectedRows = Array<number>();
    if (
      selectedRows.length === 0 ||
      (selectedRows.length > 0 && selectedRows.length !== items.length)
    ) {
      for (let i = 0; i < items.length; i++) {
        newSelectedRows.push(i);
      }
    }

    //  Update the list of selected rows
    setSelectedRows(newSelectedRows);
  }

  return (
    <>
      <div className={styles.inventory_table_controls}>
        <button
          className={classNames(
            "button",
            "bg-pink",
            "button-pad",
            styles.button
          )}
          onClick={() => onAddItem()}
        >
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
              <input
                type="checkbox"
                //  The checked state of the checkbox should be determined by
                //  the number of selected rows and not the user's direct input.
                //  This checkbox should only show as checked if all rows are
                //  currently selected.
                checked={selectedRows.length === items.length}
                onChange={toggleSelectAllRows}
              />
            </th>

            <th>Item Name</th>
            <th>Quantity</th>
          </tr>

          {items?.map((item, index) => (
            //  For every item in the user's account, create an InventoyRecord
            //  component onto the page
            <InventoryRecord
              key={index}
              itemName={item.itemName}
              dateAdded={item.dateAdded}
              quantity={item.quantity}
              lastModified={item.lastModified}
              //  The record's checkbox should show as checked if the row is selected
              isSelected={selectedRows.includes(index)}
              //  If the user checks the row, this component should handle the process
              //  of selecting that row
              onSelect={() => toggleSelectRow(index)}
              onRowUpdate={(field, value) => onRowUpdate(index, field, value)}
            />
          ))}
        </tbody>
      </table>

      <div
        className={classNames(
          styles.floating_bar,
          selectedRows.length > 0 && styles.float_in,
          selectedRows.length === 0 && styles.float_out
        )}
      >
        <button
          className={classNames("button", "button-pad", styles.delete_button)}
          onClick={() => onDeleteItem(selectedRows)}
        >
          Delete
        </button>
      </div>
    </>
  );
}
