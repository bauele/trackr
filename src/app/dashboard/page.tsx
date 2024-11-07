"use client";

import styles from "./styles.module.css";
import classNames from "classnames";

import { InventoryTable } from "../components/inventoryTable";

import { useEffect, useState } from "react";

import { useFirebase } from "../hooks/useFirebase";
import { useItems } from "../hooks/useItems";

export default function Dashboard() {
  const [items, setItems] = useState<Array<any>>([]);
  const { user } = useFirebase();
  const { hookItems } = useItems();

  useEffect(() => {
    //  Load dummy data
    let data = [
      {
        itemName: "Blanket",
        dateAdded: "10/30/2024",
        quantity: "3",
        lastModified: "10/31/2024",
      },
      {
        itemName: "Towel",
        dateAdded: "10/28/2024",
        quantity: "2",
        lastModified: "10/29/2024",
      },
      {
        itemName: "Water Bottle",
        dateAdded: "10/28/2024",
        quantity: "12",
        lastModified: "10/29/2024",
      },
    ];

    setItems(data);
  }, []);

  useEffect(() => {
    console.log("hookitems = ", hookItems);
  }, [hookItems]);

  function onAddItem() {
    //  Create a new item to be edited
    let item = {
      itemName: "New Item",
      dateAdded: "",
      quantity: "0",
      lastModified: "",
    };

    //  Create a copy of the current data
    let newItems = new Array<any>();
    newItems.push(item);
    newItems.push(...items);

    setItems(newItems);
  }

  function onDeleteItem(selectedRows: Array<number>) {
    //  Filter the new list of items to only contain
    //  the rows that are not selected
    let newItems = items.filter(
      (value, index) => !selectedRows.includes(index)
    );
    setItems(newItems);
  }

  function onRowUpdate(rowIndex: number, field: string, value: string) {
    //  Create a copy of the current data
    let newItems = [...items];

    //  Update the specified field with the new value
    if (field === "quantity") {
      newItems[rowIndex].quantity = value;
    }
    if (field === "itemName") {
      newItems[rowIndex].itemName = value;
    }

    //  Set the item list to the updated list
    setItems(newItems);
  }

  return (
    <div className={styles.page_container}>
      <div className={styles.content_container}>
        <div className={styles.page_upper_container}>
          <div className={styles.heading_container}>
            <div className={styles.heading_content}>
              <h1>{user} Inventory</h1>
              <h2>Last Modified: Today</h2>
            </div>
            <div>
              <button
                className={classNames(
                  "button",
                  "bg-pink",
                  "button-pad",
                  styles.button
                )}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
        <InventoryTable
          items={items}
          onAddItem={() => onAddItem()}
          onDeleteItem={(selectedRows) => onDeleteItem(selectedRows)}
          onRowUpdate={(index, field, value) =>
            onRowUpdate(index, field, value)
          }
        />
      </div>
    </div>
  );
}
