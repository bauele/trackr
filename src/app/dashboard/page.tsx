"use client";

import styles from "./styles.module.css";
import classNames from "classnames";

import { InventoryTable } from "../components/inventoryTable";

import { useEffect, useState } from "react";

export default function Login() {
  const [items, setItems] = useState<Array<any>>([]);

  useEffect(() => {
    //  Load dummy data
    let data = [
      {
        itemName: "Blanket",
        dateAdded: "10/30/2024",
        quantity: 3,
        dateModified: "10/31/2024",
      },
      {
        itemName: "Towel",
        dateAdded: "10/28/2024",
        quantity: 2,
        dateModified: "10/29/2024",
      },
      {
        itemName: "Water Bottle",
        dateAdded: "10/28/2024",
        quantity: 12,
        dateModified: "10/29/2024",
      },
    ];

    setItems(data);
  }, []);

  return (
    <div className={styles.page_container}>
      <div className={styles.content_container}>
        <div className={styles.page_upper_container}>
          <div className={styles.heading_container}>
            <div className={styles.heading_content}>
              <h1>Kyle's Inventory</h1>
              <h2>Last Modified: Today</h2>
            </div>
            <div>
              <button
                className={classNames("button", "button-pad", styles.button)}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
        <InventoryTable items={items} />
      </div>
    </div>
  );
}
