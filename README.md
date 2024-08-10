# MedRelay 🚑🏥👨‍⚕️👩‍⚕️
MedRelay is an innovative platform designed to revolutionize healthcare communication by streamlining the exchange of critical information between ambulances and hospitals. By integrating advanced AI technologies, MedRelay enhances the speed and accuracy of emergency responses, helping healthcare professionals make informed decisions swiftly and effectively.

## Features

- **Live Transcription**: Captures and transcribes patient data every 2 seconds, streaming it directly to the hospital for real-time monitoring.
- **AI-Powered Analysis**: Utilizes GPT-4 to analyze incoming data, generating potential diagnoses and treatment recommendations to aid hospital staff in their preparations.
- **ID Connectivity**: Connects ambulances and hospitals using unique IDs, ensuring organized data management and minimizing errors.
- **Customizable UI**: Built with a Next.js frontend, allowing hospitals to tailor the dashboard to fit their workflow seamlessly.
- **Secure and Fast**: Uses MongoDB for backend security and speed, ensuring data is both protected and quickly retrievable.
- **Historical Data Access**: Provides hospitals with the ability to download previous transcripts and manage active/inactive IDs efficiently.

### Demo

Watch our demo video to see MedRelay in action:

## System Requirements

- **Backend**: Flask app using MongoDB for data storage and retrieval.
- **Frontend**: Next.js for a responsive and customizable user interface.
- **AI Integration**: GPT-4 for real-time data analysis and recommendations.

## Getting Started

### Prerequisites

- Node.js and npm installed
- Python and Flask environment set up
- MongoDB database configured and accessible

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/MedRelay.git
   cd MedRelay
   
2. Install backend dependencies:

   ```bash
   pip install -r requirements.txt

3. Set up frontend:

   ```bash
   cd medrelay
   npm install

4. Start Flask Server:

   ```bash
   cd server
   flask run

5. Start the Next.js frontend:

   ```bash
   cd medrelay
   npm run dev

### Configuration

- Configure MongoDB connection settings in the backend configuration file.
- Set up environment variables for API keys and other necessary credentials.

### Usage

- Log in: Use the administrator password to access the platform.
- Choose Role: Select either “Ambulance Operator” or “Hospital Receiver” based on your role.
- Enter ID: Input the ambulance ID to connect and start receiving/transmitting data.
- Live Transcription: Monitor the live transcription and AI-generated insights.
- Upload and Analyze: Upload patient images for additional analysis alongside AI recommendations.
- Manage IDs: Track active and inactive IDs for organized record-keeping.
- Access Historical Data: Download previous transcriptions for comprehensive patient history.

### Developers

- Michael Chuang: https://github.com/mchuang413
- Aayush Palai: https://github.com/a2pro

### Special Thanks

The MedRelay team extends its heartfelt gratitude to MedHacks Season 2 for the invaluable opportunity to showcase our coding passion and contribute to improving community healthcare solutions.

