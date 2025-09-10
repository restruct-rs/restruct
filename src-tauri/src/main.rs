#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use crate::managers::process_manager::ProcessManager;
use std::sync::Arc;
use tauri::Manager;

mod commands;
mod error;
mod managers;
mod runner;

use crate::runner::Runner;

pub struct AppState {
    process_manager: Arc<ProcessManager>,
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let process_manager = Arc::new(ProcessManager::new());

            let app_state = AppState {
                process_manager: Arc::clone(&process_manager),
            };
            app.manage(app_state);

            let app_handle = app.app_handle().clone();

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![commands::list_processes,])
        .run_app()
        .expect("error while running tauri application");
}
