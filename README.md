# Massaal.ai - AI-Powered Note Management System

Massaal.ai is a Laravel and React application that allows users to upload text documents, process them with AI, and ask questions about their content. The application uses vector embeddings and AI models to provide accurate answers based on the document content.

## Features

- **Document Upload**: Upload text files to be processed and analyzed
- **AI-Powered Question Answering**: Ask questions about your documents and get AI-generated answers
- **Vector Search**: Uses embeddings to find the most relevant parts of your documents
- **Real-time Processing**: Track the progress of document processing in real-time
- **User Authentication**: Secure user accounts and document management

## Tech Stack

- **Backend**: Laravel 12
- **Frontend**: React 19 with TypeScript
- **UI Components**: Radix UI and Tailwind CSS
- **AI Integration**: OpenAI GPT-3.5 Turbo (production) / Llama3.2 via Ollama (local development)
- **Database**: PostgreSQL with pgvector for vector similarity search
- **Authentication**: Laravel's built-in authentication

## Installation

### Prerequisites

- PHP 8.2 or higher
- Composer
- Node.js and npm
- PostgreSQL with pgvector extension

### Setup

1. Clone the repository
   ```
   git clone https://github.com/yourusername/massaal.ai.git
   cd massaal.ai
   ```

2. Install PHP dependencies
   ```
   composer install
   ```

3. Install JavaScript dependencies
   ```
   npm install
   ```

4. Copy the environment file and configure it
   ```
   cp .env.example .env
   ```

5. Generate application key
   ```
   php artisan key:generate
   ```

6. Run database migrations
   ```
   php artisan migrate
   ```

7. Start the development server
   ```
   composer dev
   ```

## Usage

1. Register an account or log in
2. Navigate to the dashboard
3. Upload a text document with a title
4. Wait for the document to be processed
5. Ask questions about your document
6. View and manage your documents and question history

## Development

### Running Tests

```
composer test
```

### Code Formatting

```
npm run format
```

### Type Checking

```
npm run types
```

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
