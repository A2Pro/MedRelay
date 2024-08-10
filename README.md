# MedRelay 🚑🏥👨‍⚕️👩‍⚕️ [Project Start Date: 7/31/2024]
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

## Challenges Faced

Developing MedRelay presented several challenges that pushed our team to innovate and adapt:

- **Real-Time Data Processing**: Implementing a system capable of capturing and transcribing patient data every 2 seconds was a significant technical challenge. Ensuring low latency and high accuracy required optimization of both our data handling processes and the AI model integration.

- **AI Integration**: Integrating GPT-4 for real-time analysis of medical data posed difficulties, particularly in balancing speed and accuracy. Our initial attempts using specialized medical language models, such as Medical-Llama, were too slow for our needs, prompting us to fine-tune GPT-4 to meet the demands of real-time processing.

- **Data Security and Privacy**: Handling sensitive medical information necessitated rigorous data security measures. Ensuring compliance with healthcare regulations and maintaining robust encryption and access controls were essential in building trust with healthcare providers.

- **User Interface Design**: Creating a customizable and intuitive user interface that meets the diverse needs of healthcare providers was another challenge. We focused on user feedback to refine the Next.js frontend, making it both adaptable and user-friendly.

- **System Reliability**: Ensuring consistent connectivity and data integrity between ambulances and hospitals required extensive testing and refinement. We developed mechanisms to manage data flow effectively, even in environments with varying network conditions.

Despite these challenges, our team's dedication and collaboration enabled us to create a robust and effective solution that improves healthcare communication.

## Innovation

MedRelay is a groundbreaking platform that introduces several innovative features to revolutionize healthcare communication:

- **Seamless AI Integration**: By incorporating GPT-4, MedRelay offers real-time analysis of patient data, providing hospital staff with proactive insights and recommendations. This integration allows healthcare providers to anticipate patient needs and prepare more effectively, enhancing the quality of care.

- **Dynamic Transcription System**: Our platform captures and transcribes data every 2 seconds, ensuring that hospitals have access to the most up-to-date patient information. This real-time transcription capability improves situational awareness and aids in quick decision-making during critical moments.

- **Customizable User Interface**: Built with Next.js, MedRelay offers a highly adaptable user interface that can be tailored to fit the unique workflows of different healthcare providers. This flexibility enhances usability and ensures that the platform integrates smoothly into existing systems.

- **Enhanced Connectivity**: MedRelay connects ambulances and hospitals using unique IDs, streamlining data management and reducing the risk of errors. This feature ensures that all communications are organized and accessible, facilitating better coordination between emergency response teams and hospital staff.

- **Robust Security Measures**: Our use of MongoDB for backend storage ensures that all patient data is handled with the highest standards of security and speed. We prioritize data protection and compliance with healthcare regulations to build trust with our users.

MedRelay’s innovative approach to emergency medical communication not only optimizes existing processes but also sets new standards for how technology can be leveraged to improve patient outcomes and healthcare efficiency.

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

4. Create .env in the root directory to store OpenAI API Key:

   ```bash
   OPENAI_API_KEY=REPLACE_WITH_PERSONAL_OPENAI_API_KEY

(Side Note: You can easily connect to your personal MongoDB database by editing the "URL" inside the python file named app.py inside the server directory.)

5. Start Flask Server:

   ```bash
   cd server
   flask run

6. Start the Next.js frontend:

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

