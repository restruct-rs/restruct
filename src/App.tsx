"use client";

import { MainPage } from "./pages/MainPage";
import {createContext} from "react";

interface TauriAppWindowContextType {
    appWindow: Window | null,
    isWindowMaximized: boolean,
    minimizeWindow: () => Promise<void>,
    maximizeWindow: () => Promise<void>,
    fullscreenWindow: () => Promise<void>,
    closeWindow: () => Promise<void>
}

const TauriAppWindowContext = createContext<TauriAppWindowContextType>({
    appWindow: null,
    isWindowMaximized: false,
    minimizeWindow: () => Promise.resolve(),
    maximizeWindow: () => Promise.resolve(),
    fullscreenWindow: () => Promise.resolve(),
    closeWindow: () => Promise.resolve()
})

interface AppProps {
    children: React.ReactNode;
}

export default function App({ children }: AppProps) {
    return (
        <div
            className="h-screen bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] text-gray-200 flex flex-col text-xs overflow-hidden shadow-2xl select-none">
            <MainPage/>
        </div>
    );
}