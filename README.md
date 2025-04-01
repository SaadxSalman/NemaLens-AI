# Vanna.AI - Teach Your Database to Understand Natural Language

![Vanna.AI Logo](https://vanna.ai/docs/img/how-vanna-works.gif)

## 🚀 Let Vanna.AI Write Your SQL for You
The fastest way to get actionable insights from your database just by asking questions in plain English.

## 📖 About This Repository
This repository is dedicated to teaching developers, data analysts, and business users how to leverage Vanna.AI for text-to-SQL translation. Whether you're an experienced data engineer or a beginner looking to enhance your data querying capabilities, this repo covers everything you need to know.

## 🌟 Features of Vanna.AI
- **Natural Language to SQL**: Generate SQL queries from simple English prompts.
- **Enterprise-Grade AI**: Supports advanced security, governance, and compliance needs.
- **Self-Learning AI**: Improves query accuracy as it learns from user interactions.
- **Multi-Database Support**: Works with PostgreSQL, MySQL, Snowflake, BigQuery, and more.
- **Customizable & Open Source**: Available for both cloud-based and self-hosted environments.
- **Seamless Frontend Integrations**: Use with Slack, Streamlit, Jupyter Notebooks, and custom applications.

---

## 🛠️ Getting Started
### Prerequisites
To start using Vanna.AI, ensure you have:
- Python 3.7+
- `pip` package manager
- A supported SQL database (PostgreSQL, MySQL, Snowflake, etc.)

### Installation
```sh
pip install vanna
```

### Basic Usage
#### 1️⃣ Initialize Vanna.AI
```python
import vanna
vn = vanna.Vanna()
vn.connect(database_url="your_database_connection_url")
```

#### 2️⃣ Generate SQL from a Natural Language Query
```python
query = vn.ask("Show me the total sales for the last quarter.")
print(query)
```
Output:
```sql
SELECT SUM(sales) FROM orders WHERE order_date >= DATE_SUB(NOW(), INTERVAL 3 MONTH);
```

#### 3️⃣ Execute the Query
```python
results = vn.run(query)
print(results)
```

---

## 🔥 Vanna Products
### 1️⃣ **Vanna Cloud**
- Zero setup required.
- Train AI on your unique business data.
- Enterprise-grade governance and permissions.

[Get Started for Free](https://vanna.ai/cloud)

### 2️⃣ **Vanna Self-Hosted Enterprise**
- Deploy within your infrastructure for full data sovereignty.
- Works with any LLM provider.

[Contact Us](mailto:support@vanna.ai)

### 3️⃣ **Vanna Embedded**
- API integration for existing applications.
- Supports AI-driven SQL interactions for users.

[Get Started for Free](https://vanna.ai/embedded)

### 4️⃣ **Vanna OSS (Open Source Software)**
- Full customization control.
- Free and flexible for developers.

[Read the Docs](https://vanna.ai/docs)

---

## 📖 Learning Resources
- **Whitepaper**: [How to achieve high SQL accuracy using AI](https://vanna.ai/whitepaper)
- **Blog**: [Why use AI for SQL generation?](https://vanna.ai/blog)
- **Documentation**: [Comprehensive Vanna Docs](https://vanna.ai/docs)

---

## 🔍 Why Use Vanna.AI?
✅ **Open-Source & Secure** - No database content is sent to an LLM unless explicitly enabled.
✅ **Self-Learning AI** - Continuous model improvement with user interactions.
✅ **Customizable** - Works with various databases, LLMs, and frontends.
✅ **Enterprise-Ready** - Compliance with strict security and data governance policies.

---

## 🏗️ How It Works
| Component | Function |
|-----------|----------|
| **Database** | Stores structured data for querying |
| **Metadata Storage** | Uses ChromaDB to find relevant tables, documentation, and queries |
| **AI Model** | Generates SQL based on metadata |
| **Execution Engine** | Runs the SQL queries and returns results |
| **User Interface** | Displays results via web apps, Slack, or custom UIs |

---

## ⚙️ Supported Databases
Vanna.AI works with:
- ✅ PostgreSQL
- ✅ Microsoft SQL Server
- ✅ MySQL
- ✅ DuckDB
- ✅ Snowflake
- ✅ BigQuery
- ✅ SQLite
- ✅ Oracle
- ✅ Custom Databases (via connector API)

---

## 💡 Use Cases
- **Data Analysts** - Quickly generate SQL queries without manual coding.
- **Business Intelligence Teams** - Provide non-technical users with easy data access.
- **Software Engineers** - Embed AI-powered SQL generation in applications.
- **Enterprise IT Teams** - Ensure security and compliance while enhancing productivity.

---

## 🌍 Community & Support
Join active community to get help and contribute:
- 💬 [Discord](https://discord.gg/vanna)
- ⭐ [GitHub](https://github.com/vanna-ai)
- 📝 [Blog](https://vanna.ai/blog)
- 📧 Email: [support@vanna.ai](mailto:support@vanna.ai)

---

## 📜 Legal & Security
- 🔐 [Data Security FAQ](https://vanna.ai/security)
- 📝 [Privacy Policy](https://vanna.ai/privacy)
- 📜 [Terms & Conditions](https://vanna.ai/terms)

---

## 📌 Connect with Me
- **LinkedIn**: [Saad Salman Akram](https://www.linkedin.com/in/saadsalmanakram/)
- **GitHub**: [SaadSalmanAkram](https://github.com/saadsalmanakram)
- **Hugging Face**: [SaadSalman7](https://huggingface.co/SaadSalman7)
- 📧 Email: [saadsalmanakram1@gmail.com](mailto:saadsalmanakram1@gmail.com)

---