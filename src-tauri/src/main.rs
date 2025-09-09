#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;

mod runner;
use crate::runner::Runner;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let app_handle = app.app_handle().clone();

            let main_window = app_handle.get_webview_window("main").unwrap();
            main_window.set_visible_on_all_workspaces(true).unwrap();

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![])
        .run_app()
        .expect("error while running tauri application");
}
