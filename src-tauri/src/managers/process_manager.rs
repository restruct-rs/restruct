use crate::error::{Error, Result};
use serde::Serialize;
use std::cmp::max;
use std::sync::{Arc, Mutex};
use sysinfo::System;
use windows::Win32::Foundation::{CloseHandle, FALSE};
use windows::Win32::System::Threading::{IsWow64Process, OpenProcess, PROCESS_QUERY_INFORMATION};

trait ProcessDiscovery: Send + Sync {
    fn list_processes(&self) -> Vec<ProcessInfo>;
}

#[derive(Debug, Clone, Serialize)]
pub struct ProcessInfo {
    pub pid: u32,
    pub name: String,
    pub path: String,
    pub arch: String,
    pub memory: u64,
    pub cpu_usage: f32,
    pub disk_usage: f64,
    pub user_id: String,
}

pub struct SystemProcessDiscovery {
    system: System,
}

impl SystemProcessDiscovery {
    pub fn new() -> Self {
        let mut system = System::new_all();
        system.refresh_all();
        Self { system }
    }

    pub fn get_process_arch(pid: u32) -> Result<String> {
        let handle = unsafe { OpenProcess(PROCESS_QUERY_INFORMATION, false, pid) }
            .map_err(|_| anyhow::anyhow!("Failed to open process"))?;
        if handle.is_invalid() {
            return Err(Error::Reason("Invalid handle".to_string()));
        }

        let mut is_wow64 = FALSE;
        let result = unsafe { IsWow64Process(handle, &mut is_wow64) };
        unsafe {
            CloseHandle(handle);
        }

        if result.is_ok() {
            if is_wow64 != FALSE {
                Ok("x86".to_string())
            } else {
                Ok("x64".to_string())
            }
        } else {
            Ok("Unknown".to_string())
        }
    }
}

impl ProcessDiscovery for SystemProcessDiscovery {
    fn list_processes(&self) -> Vec<ProcessInfo> {
        let mut processes: Vec<ProcessInfo> = Vec::new();

        for process in self.system.processes() {
            processes.push(ProcessInfo {
                pid: process.0.as_u32(),
                name: process.1.name().to_str().unwrap().to_string(),
                path: if process.1.exe().is_none() {
                    "".to_string()
                } else {
                    process.1.exe().unwrap().to_str().unwrap().to_string()
                },
                arch: Self::get_process_arch(process.0.as_u32()).unwrap_or("Unknown".to_string()),
                memory: process.1.memory(),
                cpu_usage: process.1.cpu_usage(),
                disk_usage: (max(1, process.1.disk_usage().written_bytes)
                    / max(1, process.1.disk_usage().total_written_bytes))
                    as f64,
                user_id: if process.1.user_id().is_none() {
                    "".to_string()
                } else {
                    process.1.user_id().unwrap().to_string()
                },
            })
        }

        processes
    }
}

pub struct ProcessManager {
    current_process: Arc<Mutex<Option<Box<ProcessInfo>>>>,
    discovery: Box<dyn ProcessDiscovery>,
}

impl ProcessManager {
    pub fn new() -> Self {
        Self {
            current_process: Arc::new(Mutex::new(None)),
            discovery: Box::new(SystemProcessDiscovery::new()),
        }
    }

    pub fn is_attached(&self) -> bool {
        let current = self.current_process.lock().unwrap();
        current.is_some()
    }

    pub fn list_processes(&self) -> Vec<ProcessInfo> {
        self.discovery.list_processes()
    }
}
