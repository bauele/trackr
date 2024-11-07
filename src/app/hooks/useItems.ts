import { useEffect, useState } from "react";

export type ItemData = {
  //  id is optional because it is auto-generated by Firestore
  id?: string;
  itemName: string;
  quantity: number;
  dateAdded: string;
  lastModified: string;
};

//  Custom hook
export function useItems() {
  const [hookItems, setItems] = useState<Array<ItemData> | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      let item = await getItems();
      setItems(item);
    };

    fetchData();
  }, []);

  async function getItems() {
    let res = await fetch("/api/items");
    let json = await res.json();
    return json;
  }

  return {
    getItems,
    hookItems,
  };
}
