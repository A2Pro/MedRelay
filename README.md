# MedRelay 🚑🏥👨‍⚕️👩‍⚕️ [Project Start Date: 7/31/2024]
MedRelay is a platform designed to revolutionize healthcare communication by streamlining the exchange of critical information between ambulances and hospitals. By integrating advanced AI technologies into our app, we enhance the speed and accuracy of emergency responses, therefore helping healthcare professionals make informed decisions swiftly and effectively, saving lives.

## Inspiration

The inspiration for MedRelay was brought forth from the urgent need to enhance communication in emergency medical situations. During critical moments, every second counts, and we saw the limitations of traditional two-way radios in providing timely and accurate information between ambulances and hospitals.

Witnessing the impact of delayed or miscommunicated information on patient outcomes inspired us to create a solution that uses modern technology to streamline and improve this exchange of info. By integrating real-time data transcription and AI analysis, we aim to provide healthcare professionals with the tools they need to anticipate and address patient needs more effectively.

Our goal was to develop a platform that not only bridges communication gaps but also provides medical teams with the tools to deliver faster, more informed care, ultimately saving lives. MedRelay embodies our commitment to pushing the boundaries of what's possible in healthcare communication and making a tangible difference in the communities we serve.

## Features

- **Live Transcription**: Captures and transcribes patient data every 2 seconds, streaming it directly to the hospital for real-time monitoring.
- **AI-Powered Analysis**: Utilizes GPT-4 to analyze incoming data, generating potential diagnoses and treatment recommendations to aid hospital staff in their preparations.
- **ID Connectivity**: Connects ambulances and hospitals using unique IDs, ensuring organized data management and minimizing errors.
- **Customizable UI**: Built with a Next.js frontend, allowing hospitals to tailor the dashboard to fit their workflow seamlessly.
- **Secure and Fast**: Uses MongoDB for backend security and speed, ensuring data is both protected and quickly retrievable.
- **Historical Data Access**: Provides hospitals with the ability to download previous transcripts and manage active/inactive IDs efficiently.
- **By-Organization Database**: Each organization establishes its own dedicated database to connect with MedRelay, ensuring privacy and secure access to data. This design is highly effective as it eliminates the risk of retrieving incorrect or unauthorized sensitive information while providing tailored solutions to meet each organization's specific needs.

### Demo

- Watch our demo video to see MedRelay in action:
- Access our website here: https://main.d2e1li3e1k0bd0.amplifyapp.com/ 

### Important Side Notes
- Currently, the application is directly linked to mchuang413's personal MongoDB Database. Please change the MongoDB URL located in "app.py" under the server directory if you wish to use your own database.
- The BACKEND of this application MUST BE hosted LOCALLY as all requests to the backend directly request to localhost:5000. Please make sure you run the python script ("app.py" under the server directory) for the frontend to respond properly.

## Challenges Faced

Developing MedRelay presented several challenges that pushed our team to innovate and adapt:

- **Real-Time Data Processing**: Implementing a system capable of capturing and transcribing patient data every 2 seconds was a significant technical challenge for us. Ensuring low latency and high accuracy required optimization of both our data handling processes and the AI model integration, which leads us to the next point.

- **AI Integration**: Integrating GPT-4 for real-time analysis of medical data posed difficulties, particularly in balancing speed and accuracy. Our initial attempts using specialized medical language models, such as Medical-Llama, were too slow for our needs, more or less forcing us to fine-tune GPT-4 to meet the demands of real-time processing.

- **Data Security and Privacy**: Handling sensitive medical information requires rigorous data security measures. We used MongoDB, trusted by eBay, Toyota, Uber , and more to ensure secure data handling.

- **User Interface Design**: Creating a customizable and intuitive user interface that meets the diverse needs of healthcare providers was another challenge. We had to go through multiple iterations of designs to ensure ambulances and hospitals could accesss what they needed in "5 clicks or less" - login (2 clicks), role button + id (2 clicks), and finally "start recording" - 1 click ( 5 total for ambulance, 4 for hospital). 

- **System Reliability**: Ensuring consistent connectivity and data integrity between large distances required extensive testing. We developed mechanisms to manage data flow effectively, even in environments with varying network conditions. For example, I (Aayush) was in Hawaii for a break during this time, and we tested it with Michael in California. It worked seamlessly.

Despite these challenges, our dedication and collaboration enabled us to create a robust and effective solution that improves healthcare communication.

## Innovation

MedRelay is a groundbreaking platform that introduces several innovative features to revolutionize healthcare communication:

- **Seamless AI Integration**: By incorporating GPT-4, MedRelay offers real-time analysis of patient data, providing hospital staff with proactive insights and recommendations. This integration allows healthcare providers to anticipate patient needs and prepare more effectively, enhancing the quality of care.

- **Dynamic Transcription System**: Our platform captures and transcribes data every 2 seconds, ensuring that hospitals have access to the most up-to-date patient information. This real-time transcription capability improves situational awareness and aids in quick decision-making during critical moments.

- **Customizable User Interface**: Built with Next.js, MedRelay offers a highly adaptable user interface that can be tailored to fit the unique workflows of different healthcare providers. This flexibility enhances usability and ensures that the platform integrates smoothly into existing systems.

- **Enhanced Connectivity**: MedRelay connects ambulances and hospitals using unique IDs, streamlining data management and reducing the risk of errors. This feature ensures that all communications are organized and accessible, facilitating better coordination between emergency response teams and hospital staff.

- **Robust Security Measures**: Our use of MongoDB for backend storage ensures that all patient data is handled with the highest standards of security and speed. We prioritize data protection and compliance with healthcare regulations to build trust with our users.

MedRelay’s innovative approach to emergency medical communication not only optimizes existing processes but also sets new standards for how technology can be leveraged to improve patient outcomes and healthcare efficiency.

## Accomplishments That We're Proud Of

Throughout the development of MedRelay, we achieved several significant milestones that showcase our dedication and innovation:

- **Successful AI Integration**: We seamlessly integrated GPT-4 into our platform, allowing for real-time analysis of patient data and delivering valuable insights to healthcare professionals.

- **Real-Time Data Processing**: Developed a robust system capable of capturing and transcribing patient data every 2 seconds, ensuring hospitals receive the most current information.

- **User-Centric Design**: Created a customizable and intuitive user interface with Next.js, which adapts to the diverse needs of healthcare providers, enhancing user experience and efficiency.

- **Enhanced Connectivity**: Implemented a unique ID system that ensures accurate data management and seamless communication between ambulances and hospitals, minimizing errors and improving coordination.

## What We Learned

The journey of creating MedRelay provided us with invaluable insights and experiences:

- **Importance of User Feedback**: Engaging with healthcare professionals and gathering their feedback was crucial in refining our platform to meet real-world needs effectively.

- **Balancing Speed and Accuracy**: We learned to optimize AI models and data processing to achieve the perfect balance between speed and accuracy, ensuring that our platform performs reliably in time-sensitive situations.

- **Security and Compliance**: We deepened our understanding of data security and compliance requirements, emphasizing the need to protect sensitive medical information and adhere to healthcare regulations.

- **Team Collaboration**: Our team's collaboration and problem-solving skills were key in overcoming challenges and developing innovative solutions.

## What's Next for MedRelay

The development of MedRelay is just the beginning, and we are excited about the future possibilities:

- **Expanded AI Capabilities**: We plan to enhance our AI models to provide even more accurate and comprehensive analysis, further aiding healthcare professionals in their decision-making processes.

- **Integration with More Systems**: We aim to integrate MedRelay with various healthcare systems and platforms, ensuring broader adoption and seamless interoperability.

- **User Feedback and Iteration**: Continuously gather feedback from users to refine our platform, ensuring it remains user-friendly and meets the evolving needs of healthcare providers.

- **Exploration of New Technologies**: We are exploring new technologies and innovations that could enhance MedRelay's capabilities, such as machine learning and predictive analytics.

Our vision for MedRelay is to become a leading solution in emergency medical communication, continually improving and evolving to meet the needs of the healthcare community.

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

