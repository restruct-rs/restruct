"use client";

import { MainPage } from "./pages/MainPage";

interface AppProps {
    children: React.ReactNode;
}

export default function App({ children }: AppProps) {
    return (
        <div
            className="h-screen bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] text-gray-200 flex flex-col text-xs overflow-hidden shadow-2xl">
            <MainPage/>
        </div>
    );
}