# Para-Master: Multimodal Fine-Tuning for Parasite Identification 🦠🔍

Building on previous work with vision models and embeddings, **Para-Master** is a specialized, highly accurate model for identifying parasites from various sources. It is fine-tuned on a vast dataset of microscopic images of blood smears, tissue samples, and fecal samples to classify different parasite species and stages with unprecedented accuracy.

-----

## ✨ Features

  * **Highly Accurate Classification:** The fine-tuned **Vision Transformer** can recognize subtle morphological features of parasites that are often difficult for the human eye to detect.
  * **Multimodal Data Analysis:** Analyzes both visual data (microscopic images) and genomic data (DNA/protein sequences) for a comprehensive identification.
  * **Genomic Identification:** The custom **vector embeddings model** for parasite genomics enables rapid comparison and identification of novel or mutated parasite strains.
  * **High-Quality Data Curation:** Leverages **Argilla** to ensure the massive dataset of microscopic images is accurately curated and labeled, leading to a robust and reliable model.
  * **Fast Genomic Search:** Uses **Milvus**, a high-performance vector database, to enable ultra-fast searching of genomic embeddings.

-----

## ⚙️ Tech Stack

  * **Frontend:** [SvelteKit](https://kit.svelte.dev/)
  * **Backend:** Python (for model serving)
  * **Vision Model:** Fine-tuned Swin Transformer (or specialized variant)
  * **Vector Database:** [Milvus](https://milvus.io/)
  * **Data Curation:** [Argilla](https://www.argilla.io/)

-----

## 🚀 Getting Started

### Prerequisites

  * Python 3.10+
  * Node.js (for SvelteKit)
  * Docker (for Milvus)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/saadsalmanakram/Para-Master.git
    cd Para-Master
    ```
2.  **Start Docker containers:**
    ```bash
    docker-compose up -d
    ```
3.  **Set up the Python backend:**
    ```bash
    cd backend
    pip install -r requirements.txt
    ```
4.  **Set up the frontend:**
    ```bash
    cd frontend
    npm install
    ```

### Configuration

Follow the instructions in the `config/` directory to connect to your Milvus instance and set up the model paths.

### Usage

Run the Python backend and the SvelteKit frontend to begin the parasite identification process.

-----

