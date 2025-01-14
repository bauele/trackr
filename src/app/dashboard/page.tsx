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
  const [clientItems, setClientItems] = useState<Array<ItemData>>([]);
  const [sortMode, setSortMode] = useState("date_added_dsc");

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
      //  Sort items by descending date first
      serverItems.sort((a: ItemData, b: ItemData) => {
        if (a.dateAdded.seconds < b.dateAdded.seconds) {
          return 1;
        } else if (a.dateAdded.seconds > b.dateAdded.seconds) {
          return -1;
        }

        return 0;
      });

      setClientItems(serverItems);
    }
  }, [serverItems]);

  function signOut() {
    firebaseSignOut();
    router.push("/");
  }

  function onSortItems(sortOption: string) {
    //  Create a copy of the items to use later
    const sortedItems = [...clientItems];

    if (sortOption === "quantity_asc") {
      sortedItems.sort((a: ItemData, b: ItemData) => {
        const quantityA = Number(a.quantity);
        const quantityB = Number(b.quantity);
        return quantityA - quantityB;
      });
    } else if (sortOption === "quantity_dsc") {
      sortedItems.sort((a: ItemData, b: ItemData) => {
        const quantityA = Number(a.quantity);
        const quantityB = Number(b.quantity);
        return quantityB - quantityA;
      });
    } else if (sortOption === "item_name_asc") {
      sortedItems.sort((a: ItemData, b: ItemData) => {
        if (a.itemName.toUpperCase() < b.itemName.toUpperCase()) {
          return -1;
        } else if (a.itemName.toUpperCase() > b.itemName.toUpperCase()) {
          return 1;
        }

        return 0;
      });
    } else if (sortOption === "item_name_dsc") {
      sortedItems.sort((a: ItemData, b: ItemData) => {
        if (a.itemName.toUpperCase() > b.itemName.toUpperCase()) {
          return -1;
        } else if (a.itemName.toUpperCase() < b.itemName.toUpperCase()) {
          return 1;
        }

        return 0;
      });
    } else if (sortOption === "date_added_asc") {
      sortedItems.sort((a: ItemData, b: ItemData) => {
        if (a.dateAdded.seconds > b.dateAdded.seconds) {
          return 1;
        } else if (a.dateAdded.seconds < b.dateAdded.seconds) {
          return -1;
        }

        return 0;
      });
    } else if (sortOption === "date_added_dsc") {
      sortedItems.sort((a: ItemData, b: ItemData) => {
        if (a.dateAdded.seconds < b.dateAdded.seconds) {
          return 1;
        } else if (a.dateAdded.seconds > b.dateAdded.seconds) {
          return -1;
        }

        return 0;
      });
    } else if (sortOption === "last_modified_asc") {
      sortedItems.sort((a: ItemData, b: ItemData) => {
        if (a.lastModified.seconds > b.lastModified.seconds) {
          return 1;
        } else if (a.lastModified.seconds < b.lastModified.seconds) {
          return -1;
        }

        return 0;
      });
    } else if (sortOption === "last_modified_dsc") {
      sortedItems.sort((a: ItemData, b: ItemData) => {
        if (a.lastModified.seconds < b.lastModified.seconds) {
          return 1;
        } else if (a.lastModified.seconds > b.lastModified.seconds) {
          return -1;
        }

        return 0;
      });
    }

    setClientItems(sortedItems);
    setSortMode(sortOption);
  }

  async function onAddItem() {
    //  Create a new item to be added
    const item = buildItem();

    //  Create the record in the database, then assigned
    //  the generated document id to the item object
    const docId = await addItem(item);
    if (docId !== null) {
      item.id = docId;
    }

    //  Create a new list of items, adding the new item
    //  first and then including all the previous items
    const newItems = new Array<ItemData>();
    newItems.push(item);
    newItems.push(...clientItems);
    setClientItems(newItems);

    return item.id;
  }

  function onDeleteItem(selectedRows: Array<number>) {
    //  Delete every item that was selected
    for (let i = 0; i < selectedRows.length; i++) {
      deleteItem(clientItems[selectedRows[i]]);
    }

    const newItems = clientItems.filter(
      (value, index) => !selectedRows.includes(index)
    );
    setClientItems(newItems);
  }

  function onRowUpdate(rowIndex: number, field: string, value: string) {
    //  Copy the item being updated
    const oldItem = clientItems[rowIndex];

    //  Create a copy of the current data
    const newItems = [...clientItems];

    //  Update the specified field with the new value
    if (field === "quantity") {
      newItems[rowIndex].quantity = value;
    }
    if (field === "itemName") {
      newItems[rowIndex].itemName = value;
    }

    //  Update the item in the database
    updateItem(oldItem, newItems[rowIndex]);

    //  Sort the new item list
    onSortItems(sortMode);
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
                    <h1>{userDisplayName}&apos;s Inventory</h1>
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
                onAddItem={onAddItem}
                onDeleteItem={(selectedRows) => onDeleteItem(selectedRows)}
                onRowUpdate={(index, field, value) =>
                  onRowUpdate(index, field, value)
                }
                onSortTable={onSortItems}
              />
            </div>
          </div>
        )
      }
    </>
  );
}
