# 🔪 Port Killer CLI

A simple Node.js CLI tool to detect and free up any port by force-killing the process using it.

Perfect for developers who frequently face port conflicts during development (e.g., ports 3000, 3306, 8000, etc.).

---

## ⚙️ Features

- Detects if a port is in use
- Identifies the PID using that port
- Kills the process (cross-platform: Windows, macOS, Linux)


---

## 🚀 Installation

Clone this repository and link it globally:

```bash
git clone https://github.com/your-username/port-killer.git
cd port-killer
npm install
node freeport.js <portnumber>
