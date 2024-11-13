import styles from "./inventoryTableStyles.module.css";
import classNames from "classnames";

import { InventoryRecord } from "./inventoryRecord";
import { useState, useEffect, ChangeEvent, useRef } from "react";
import { Timestamp } from "firebase-admin/firestore";
import { ItemData } from "../hooks/useItems";

interface InventoryTableProps {
  items: Array<ItemData>;
  onAddItem: () => void;
  onDeleteItem: (selectedRows: Array<number>) => void;
  onRowUpdate: (rowIndex: number, field: string, value: string) => void;
  onSortTable: (sortOption: string) => void;
}

//  This component represent a table of inventory records. It will
//  be used to display all of the inventory that a user has added
//  into their account.
export function InventoryTable({
  items,
  onAddItem,
  onDeleteItem,
  onRowUpdate,
  onSortTable,
}: InventoryTableProps) {
  const [selectedRows, setSelectedRows] = useState<Array<number>>([]);
  const [newRecordAdded, setNewRecordAdded] = useState(false);
  const prevItems = useRef(items);

  useEffect(() => {
    if (prevItems.current.length == 0) {
      setNewRecordAdded(false);
    }
    //  If there are no items, then next item added should
    //  trigger auto focus
    else if (items.length === 0) {
      setNewRecordAdded(true);
    }
    //  If there are more items now than there were previously
    //  trigger auto focus
    else if (prevItems.current.length < items.length) {
      setNewRecordAdded(true);
    } else {
      setNewRecordAdded(false);
    }
    prevItems.current = items;
  }, [items]);

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

  function sortTable(event: ChangeEvent<HTMLSelectElement>) {
    let sortOption = event.target.value;
    onSortTable(sortOption);
  }

  function convertTimestamp(timestamp: Timestamp) {
    let date = timestamp.toDate();
    const now = new Date();

    const sameDay =
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate();

    if (sameDay) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString("en-US");
    }
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
          <select
            name="sort"
            id="sort"
            defaultValue={"date_added_dsc"}
            onChange={(event) => sortTable(event)}
          >
            <option value="date_added_asc">Date Added Asc.</option>
            <option value="date_added_dsc">Date Added Dsc.</option>
            <option value="item_name_asc">Item Name Asc.</option>
            <option value="item_name_dsc">Item Name Dsc.</option>
            <option value="quantity_asc">Quantity Asc.</option>
            <option value="quantity_dsc">Quantity Desc.</option>
            <option value="last_modified_asc">Last Modified Asc.</option>
            <option value="last_modified_dsc">Last Modified Dsc.</option>
          </select>
        </div>
      </div>

      <>
        {items.length === 0 && (
          <p className={styles.no_items}>Add an item to get started.</p>
        )}
        {items.length !== 0 && (
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
                  key={item.id}
                  itemName={item.itemName}
                  dateAdded={convertTimestamp(item.dateAdded)}
                  quantity={item.quantity}
                  lastModified={convertTimestamp(item.lastModified)}
                  //  The record's checkbox should show as checked if the row is selected
                  isSelected={selectedRows.includes(index)}
                  newRecord={index == 0 && newRecordAdded ? true : false}
                  //  If the user checks the row, this component should handle the process
                  //  of selecting that row
                  onSelect={() => toggleSelectRow(index)}
                  onRowUpdate={(field, value) =>
                    onRowUpdate(index, field, value)
                  }
                />
              ))}
            </tbody>
          </table>
        )}
      </>

      <div
        className={classNames(
          styles.floating_bar,
          selectedRows.length > 0 && styles.float_in,
          selectedRows.length === 0 && styles.float_out
        )}
      >
        <button
          className={classNames("button", "button-pad", styles.delete_button)}
          onClick={() => {
            //  Perform the delete callback
            onDeleteItem(selectedRows);

            //  Set the state to no longer contain any selected rows
            setSelectedRows([]);
          }}
        >
          Delete
        </button>
      </div>
    </>
  );
}
