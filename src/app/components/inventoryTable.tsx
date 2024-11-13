import styles from "./inventoryTableStyles.module.css";
import classNames from "classnames";

import { InventoryRecord } from "./inventoryRecord";
import { useState, useEffect, ChangeEvent, useRef } from "react";
import { Timestamp } from "firebase-admin/firestore";
import { ItemData } from "../hooks/useItems";

interface InventoryTableProps {
  items: Array<ItemData>;
  onAddItem: () => Promise<string | null>;
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
  const [selectedRows, setSelectedRows] = useState<Array<number> | null>(null);
  const [recentlyAddedItem, setRecentlyAddedItem] = useState<
    string | undefined | null
  >(undefined);

  useEffect(() => {}, [items]);

  //  Add or remove a selected row
  const toggleSelectRow = (rowIndex: number) => {
    //  If selectedRows is null, initialize it to an array
    if (!selectedRows) {
      setSelectedRows([rowIndex]);
    }

    //  If the row is already select it, unselect it
    if (selectedRows?.includes(rowIndex)) {
      setSelectedRows(
        selectedRows.filter((rowNumber) => rowNumber !== rowIndex)
      );
    }

    //  Otherwise, do select it
    else {
      if (selectedRows) {
        setSelectedRows([...selectedRows, rowIndex]);
      }
    }
  };

  //  Toggle the selection of all rows.
  //  Case 0: Initially no rows are selected    -> all rows will be selected
  //  Case 1: Initially some rows are selected  -> all rows will be selected
  //  Case 2: Initially all rows are selected   -> all rows will be deselected
  function toggleSelectAllRows() {
    //  Create a new array to contain the new rows to be selected
    let newSelectedRows = Array<number>();

    if (!selectedRows) {
      for (let i = 0; i < items.length; i++) {
        newSelectedRows.push(i);
        setSelectedRows(newSelectedRows);
      }
    }

    if (selectedRows) {
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

  function onKeyDown(event: any) {
    if (event.key === "Delete") {
      if (selectedRows) {
        onDeleteItem(selectedRows);
        setSelectedRows([]);
      }
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
          onClick={() =>
            onAddItem().then((id) => {
              setRecentlyAddedItem(id);
            })
          }
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
                    checked={selectedRows?.length === items.length}
                    onChange={toggleSelectAllRows}
                    onKeyDown={(event) => onKeyDown(event)}
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
                  isSelected={selectedRows?.includes(index) ?? false}
                  newRecord={item.id === recentlyAddedItem}
                  //  If the user checks the row, this component should handle the process
                  //  of selecting that row
                  onSelect={() => toggleSelectRow(index)}
                  onKeyDown={(event) => onKeyDown(event)}
                  onRowUpdate={(field, value) => {
                    setRecentlyAddedItem(null);
                    onRowUpdate(index, field, value);
                  }}
                />
              ))}
            </tbody>
          </table>
        )}
      </>

      <div
        className={classNames(
          styles.floating_bar,
          !selectedRows && styles.float_none,
          selectedRows && selectedRows.length > 0 && styles.float_in,
          selectedRows && selectedRows.length === 0 && styles.float_out
        )}
      >
        <button
          className={classNames("button", "button-pad", styles.delete_button)}
          onClick={() => {
            //  Perform the delete callback
            if (selectedRows) {
              onDeleteItem(selectedRows);
            }

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
