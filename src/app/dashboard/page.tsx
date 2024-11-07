"use client";

import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import classNames from "classnames";
import { InventoryTable } from "../components/inventoryTable";
import { useFirebase } from "../hooks/useFirebase";
import { useItems } from "../hooks/useItems";
import { useRouter } from "next/navigation";

import { ItemData } from "../hooks/useItems";

export default function Dashboard() {
  //  The clientItems state holds what is currently loaded onto
  //  the dashboard
  const [clientItems, setClientItems] = useState<Array<any>>([]);

  //  The serverItems value is the list of items loaded directly
  //  from the server
  const { serverItems, buildItem, addItem, deleteItem, updateItem } =
    useItems();

  const { loading, userId, userDisplayName, firebaseSignOut } = useFirebase();

  const router = useRouter();

  //  Redirect user back to log in page if they are not
  //  authenticated
  useEffect(() => {
    if (!loading && userId === null) {
      router.push("/");
    }
  }, [userId, loading]);

  //  On page load, retrieve all items from the server and
  //  set the page to display them
  useEffect(() => {
    if (serverItems) {
      setClientItems(serverItems);
    }
  }, [serverItems]);

  function signOut() {
    firebaseSignOut();
    router.push("/");
  }

  async function onAddItem() {
    //  Create a new item to be added
    let item = buildItem();

    //  Create the record in the database, then assigned
    //  the generated document id to the item object
    let docId = await addItem(item);
    if (docId !== null) {
      item.id = docId;
    }

    //  Create a new list of items, adding the new item
    //  first and then including all the previous items
    let newItems = new Array<any>();
    newItems.push(item);
    newItems.push(...clientItems);
    setClientItems(newItems);
  }

  function onDeleteItem(selectedRows: Array<number>) {
    //  Delete every item that was selected
    for (let i = 0; i < selectedRows.length; i++) {
      deleteItem(clientItems[i]);
    }

    let newItems = clientItems.filter(
      (value, index) => !selectedRows.includes(index)
    );
    setClientItems(newItems);
  }

  function onRowUpdate(rowIndex: number, field: string, value: string) {
    //  Copy the item being updated
    let oldItem = clientItems[rowIndex];

    //  Create a copy of the current data
    let newItems = [...clientItems];

    //  Update the specified field with the new value
    if (field === "quantity") {
      newItems[rowIndex].quantity = value;
    }
    if (field === "itemName") {
      newItems[rowIndex].itemName = value;
    }

    //  Update the item in the database
    updateItem(oldItem, newItems[rowIndex]);

    //  Set the item list to the updated list
    setClientItems(newItems);
  }

  return (
    <>
      {
        //  Avoid rendering page content if user is not authenticated
        !loading && userId !== null && (
          <div className={styles.page_container}>
            <div className={styles.content_container}>
              <div className={styles.page_upper_container}>
                <div className={styles.heading_container}>
                  <div className={styles.heading_content}>
                    <h1>{userDisplayName}'s Inventory</h1>
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
                      onClick={signOut}
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              </div>
              <InventoryTable
                items={clientItems}
                onAddItem={() => onAddItem()}
                onDeleteItem={(selectedRows) => onDeleteItem(selectedRows)}
                onRowUpdate={(index, field, value) =>
                  onRowUpdate(index, field, value)
                }
              />
            </div>
          </div>
        )
      }
    </>
  );
}
