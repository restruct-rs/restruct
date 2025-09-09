import { useState } from "react";

export function MenuBar() {
    const [activeMenu, setActiveMenu] = useState<String | null>(null);

    const menus = [
        {
            name: "File",
            items: []
        }
    ];

    return (
        <div></div>
    );
}