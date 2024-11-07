import { useEffect, useState } from "react";
import { useFirebase } from "./useFirebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";

export type ItemData = {
  //  id is optional because it is auto generated
  id: string | null;
  userId: string | null;
  itemName: string;
  quantity: string;
  dateAdded: Timestamp;
  lastModified: Timestamp;
};

//  Custom hook for interacting with item objects in
//  the database
export function useItems() {
  //  This type represents the shape of the items the users
  //  can store into the database

  //  State containing items loaded directly from the database
  const [serverItems, setServerItems] = useState<Array<ItemData> | null>(null);

  //  If authenticated, the user's authentication id
  const { userId } = useFirebase();

  //  Whenever authentication state changes, load all items from the
  //  database and set them into component state
  useEffect(() => {
    if (userId === null) {
      return;
    }

    const fetchData = async () => {
      let items = await getAllItems();
      setServerItems(items);
    };

    fetchData();
  }, [userId]);

  function buildItem() {
    let item = {
      id: null,
      userId: null,
      itemName: "New Item",
      quantity: "0",
      dateAdded: Timestamp.fromDate(new Date()),
      lastModified: Timestamp.fromDate(new Date()),
    } as ItemData;

    return item;
  }

  //  GET: all items from server
  async function getAllItems() {
    //  Ensure the user is authenticated
    if (userId) {
      //  Build a query to find all matching documents with the
      //  user's userId
      const itemsRef = collection(db, "items");
      const q = query(itemsRef, where("userId", "==", userId));

      //  Get all of the documents, then iterate through them and
      //  compile them into a list
      let itemList = Array<ItemData>();
      try {
        let querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          //  Store the item data in an object
          let item = doc.data();

          //  Attach the document id to the object
          item.id = doc.id;

          //  Add the item to the list
          itemList.push(item as ItemData);
        });
        return itemList;
      } catch (error) {
        //  If an error occurs, report it to the caller
        console.error("Error getting documents: ", error);
        return null;
      }
    }

    return null;
  }

  async function addItem(item: ItemData) {
    //  Ensure the user is authenticated
    if (userId) {
      try {
        item.userId = userId;

        const docRef = await addDoc(collection(db, "items"), item);
        return docRef.id;
      } catch (error) {
        //  If an error occurs, report it to the caller
        console.error("Error getting documents: ", error);
        return null;
      }
    }

    return null;
  }

  async function deleteItem(item: ItemData) {
    //  Ensure the user is authenticated
    if (userId && item.id) {
      try {
        const docRef = doc(collection(db, "items"), item.id);
        await deleteDoc(docRef);
      } catch (error) {
        //  If an error occurs, report it to the caller
        console.error("Error getting documents: ", error);
        return null;
      }
    }

    return null;
  }

  async function updateItem(oldItem: ItemData, newItem: ItemData) {
    //  Ensure the user is authenticated
    if (userId && newItem.id && oldItem.id) {
      try {
        const docRef = doc(collection(db, "items"), oldItem.id);
        (newItem.lastModified = Timestamp.fromDate(new Date())),
          await updateDoc(docRef, newItem);
      } catch (error) {
        //  If an error occurs, report it to the caller
        console.error("Error getting documents: ", error);
        return null;
      }
    }

    return null;
  }

  return {
    serverItems,
    buildItem,
    addItem,
    deleteItem,
    updateItem,
  };
}
