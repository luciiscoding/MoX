
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Movies and TV Shows Explorer: Software Requirements Specification</title>
    <link rel = "stylesheet" href="documentatie-style.css">
    <link rel="icon" href="/images/movie-logo.png" type="image/icon">
</head>
<body>
    <div class="container">
        <div class="content-summary">
            <h2 class = "purple-text">Movies and TV Shows Explorer</h2>
            <ul>
                <li><a href="#1.0">1. Introduction</a></li>
                <li>
                    <a href="#2.0">2. Description</a>
                    <ul>
                        <li><a href="#2.1">2.1 Product Perspective</a></li>
                        <li><a href="#2.2">2.2 Product Functions</a></li>
                        <li><a href="#2.3">2.3 User Classes</a></li>
                        <li><a href="#2.4">2.4 Operating Environment</a></li>
                        <li><a href="#2.5">2.5 Assumptions</a></li>
                    </ul>
                </li>
                <li>
                  <a href="#3.0">3. Interface</a>
                  <ul>
                      <li><a href="#3.1">3.1 API Interface</a></li>
                      <li><a href="#3.2">3.2 Database Interface</a></li>
                      <li><a href="#3.3">3.3 User Interface</a></li>
                      <li><a href="#3.4">3.4 Third-Party APIs</a></li>
                      <li><a href="#3.5">3.5 Export Interface</a></li>
                      <li><a href="#3.6">3.6 Search and Filter Interface</a></li>
                  </ul>
                    <li>
                      <a href="#4.0">4. System Features</a>
                      <ul>
                          <li><a href="#4.1">4.1 Feature 1: Netflix and Disney Data Presentation</a></li>
                          <li><a href="#4.2">4.2 Data Export and Visualizations</a></li>
                          <li><a href="#4.3">4.3 Multi-Criteria Search and Filtering</a></li>
                      </ul>
                  </li>
                <li>
                    <a href="#5.0">5. Other Requirements</a>
                    <ul>
                        <li><a href="#5.1">5.1 Performance </a></li>
                        <li><a href="#5.2">5.2 Safety</a></li>
                        <li><a href="#5.3">5.3 Security</a></li>
                        <li><a href="#5.4">5.4 Software Quality</a></li>
                        <li><a href="#5.5">5.5 Business Rules</a></li>
                    </ul>
                </li>
            </ul>
        </div>
    <p><strong>Product Name:</strong> Movies and TV Shows Explorer</p>
    <p><strong>Revision/Release Number:</strong>  1.0</p>

    `<h1 id="1.0" class="purple-text">`1. Introduction`</h1>`
    `<h2 id="1.1">`1.1 Intended Audience:`</h2>`
    `<p>`The Software Requirements Specification (SRS) document for the Movies and TV Shows Exploreris intended for:`</p>`
    `<ul>`
        `<li>`Colab. Isepciuc Daniel `</li>`
    `</ul>`

    `<h2 id="1.2">`1.2 Scope`</h2>`
    `<p>`The scope of the project includes the development of a custom API-based web application that presents interactive data from streaming services like Netflix and Disney, correlated with additional information available from The Movie Database (TMDb). The application will offer at least three different visualization methods and support exporting statistics and visualizations in CSV, WebP, and SVG formats. The system will also support multi-criteria search and filtering of data.`</p>`

    `<h2 id="1.3">`1.3 References`</h2>`
    `<ol>`
        `<li><strong>`Logo Generator`</strong><a href="https://www.design.com">` design.com`</a></li>`
        `<li><strong>`Guide about using CSS Box Model`</strong><a href="https://www.youtube.com/watch?v=rIO5326FgPE&ab_channel=WebDevSimplified">` Youtube Link`</a></li>`
        `<li><strong>`Inspiration:`</strong>` a similar website `<a href="https://www1.divxfilmeonline.net/home02/">`DivXFilmeOnline`</a></li>`
    `</ol>`

    `<h1 id="2.0" class="purple-text">`2. Description`</h1>`
    `<h2 id="2.1">`2.1 Product Perspective`</h2>`
        `<p><strong>`The product:`</strong>` is a standalone web application that aims to provide a comprehensive and interactive platform for exploring and analyzing data from streaming services and The Movie Database (TMDb).`</p>`
        `<p><strong>`System Components: `</strong>`The system will consist of the following components:`</p>`
        `<ul>`
            `<li><strong>`API Server: `</strong>`The API server will be responsible for handling requests from the frontend application and fetching data from various sources such as Netflix, Disney, and TMDb.`</li>`
            `<li><strong>`Database: `</strong>`The database will store the fetched data and provide it to the API server for further processing and analysis.`</li>`
            `<li><strong>`Frontend Application: `</strong>`The frontend application will be responsible for displaying the fetched data to the end-users and providing them with the ability to interact with it.`</li>`

    `</ul>`

    `<h2 id="2.2">`2.2 Product Functions`</h2>`

<ul>
        <li>Custom API development</li>
        <li>Data fetching from streaming services and TMDb</li>
        <li>Data correlation and analysis</li>
        <li>Interactive visualization of data</li>
        <li>Exporting statistics and visualizations</li>
        <li>Multi-criteria search and filtering</li>
   </ul>
    <h1 id="2.3">2.3 User Classes</h1>
    <ul>
        <li><strong>End-users:</strong> Individuals who use the application to explore and analyze data from streaming services and TMDb.</li>
        <li><strong>Administrators:</strong> Individuals who manage the application, including data management and system maintenance.</li>   
    </ul>
    <h2 id="2.4">2.4 Operating Environment</h2>
    <h3>Frontend:</h3>
  <ul>
    <li><strong>HTML and CSS:</strong> The frontend of the application will be built using HTML and CSS for structuring and styling the user interface. (via Visual Studio Code)</li>
  </ul>

<h3>Backend:</h3>
  <ul>
    <li><strong>JavaScript:</strong> The backend of the application will be developed using JavaScript, particularly with Node.js runtime environment. (also with Visual Studio Code)</li>
  </ul>

<h3>Database:</h3>
  <ul>
    <li><strong>MongoDB:</strong> The database will be implemented using MongoDB, which provides a query language for interacting with the database.</li>
  </ul>

<h3>Operating System:</h3>
  <ul>
    <li>The software should be compatible with various operating systems including Windows, macOS, and Linux distributions.</li>
  </ul>

<h3>Web Browser Compatibility:</h3>
  <ul>
    <li>The frontend should be compatible with popular web browsers such as Google Chrome, Mozilla Firefox, Safari, and Microsoft Edge.</li>
  </ul>
  <h2 id="2.5">2.5 Assumptions</h2>
  <ul>
    <li>The availability and functionality of third-party APIs for fetching data from streaming services and TMDb.</li>
    <li>The availability and compatibility of required libraries for developing the custom API and web application.</li>
    <li>The adherence to relevant data privacy and security regulations.</li>
  </ul>
  <h1 id="3.0" class="purple-text">3. Interface</h1>

<h3 id="3.1">3.1 API Interface</h3>
  <p>The API interface in our project acts as the intermediary between the frontend application and the backend API server. It defines the endpoints, request methods, and data formats for communication. Through this interface, our frontend can make requests to the server to fetch or manipulate data related to Netflix, Disney and TMDb.</p>

<h3 id="3.2">3.2 Database Interface</h3>
  <p>Our database interface facilitates seamless communication between the API server and the underlying database system. It handles tasks such as storing and retrieving data related to streaming content, user preferences, and statistical information. This interface ensures efficient data management and persistence within our system.</p>

<h3 id="3.3">3.3 User Interface</h3>
  <p>The user interface (UI) is the primary point of interaction between our platform and its users. It presents the fetched data from Netflix, Disney, and TMDb in a visually appealing and intuitive manner, allowing users to explore and interact with the content seamlessly. Our UI design prioritizes usability, accessibility, and responsiveness to deliver an exceptional user experience.</p>

<h3 id="3.4">3.4 Third-Party APIs and local APIs</h3>
  <p>Our system interfaces with third-party APIs provided by TMDb to access poster-photos.The local APIs are used to recive the information such as duration, rating and genre for each.</p>

<h3 id="3.5">3.5 Export Interface</h3>
  <p>The export interface in our project empowers users to export statistics and visualizations generated by the system in various formats, including CSV, WebP, and SVG. This functionality enhances data portability and allows users to share or analyze data outside of our platform. Our export interface offers customization options to tailor the exported data to users' specific needs.</p>

<h3 id="3.6">3.6 Search and Filter Interface</h3>
  <p>Our search and filter interface provides users with robust tools to refine and narrow down the dataset based on specific criteria. Users can perform multi-criteria searches, apply filters, and sort results to find relevant streaming content efficiently. This interface enhances user productivity and aids in discovering insights within the vast dataset available on our platform.</p>
<p>These interfaces will ensure that the system is modular, scalable, and maintainable, and can be easily integrated with other systems and services.</p>
<h1 id="4.0" class="purple-text">4. System Features</h1>

<h3 id="4.1">4.1 Feature 1: Netflix and Disney Data Presentation</h3>
<p>Description and Priority: This functionality aims to provide an interactive presentation of data from Netflix and Disney, including information such as movie titles, TV shows, ratings, reviews, and actor details.</p>
<ul>
    <li>Data Access: Users can access detailed information about the content available on the Netflix and Disney platforms, including details about movies and TV shows.</li>
    <li>Correlation with TMDb: Data from Netflix and Disney is correlated with additional information available in the TMDb database to provide a broader and more detailed perspective.</li>
    <li>Visualizations and Statistics: Users can view statistics and visualizations generated in at least three different ways, including charts, diagrams, and interactive tables.</li>
</ul>
<h3 id="4.2">4.2 Data Export and Visualizations</h3>
<p>Description and Priority: This functionality allows users to export the generated statistics and visualizations in CSV, WebP, and SVG formats for later use or distribution.</p>
<ul>
    <li>Export in Multiple Formats: Users have the ability to export data and visualizations generated in CSV, WebP, and SVG formats, providing flexibility in managing and distributing information.</li>
    <li>User-Friendly: The export functionality is integrated into the user interface and is easily accessible, facilitating the process of exporting data.</li>
</ul>

<h3 id="4.3">4.3 Multi-Criteria Search and Filtering</h3>
<p>Description and Priority: This functionality supports multi-criteria search and filtering of data, allowing users to quickly and efficiently find the desired information.</p>
<ul>
    <li>Advanced Search: Users can perform advanced searches using multiple criteria, such as genre, release year, rating, etc.</li>
    <li>Multi-Criteria Filtering: The filtering functionality allows users to apply multiple filtering criteria simultaneously to refine search results.</li>
    <li>Ease of Use: The user interface is intuitive and user-friendly, making the process of searching and filtering data straightforward.</li>
</ul>

<h2 id="4.4">4.4 Additional Resources for Data Visualization</h2>
<p>In addition to the main functionalities listed above, the platform also utilizes additional resources to enhance and diversify the ways data is presented, such as:</p>
<ul>
    <li>Visualization Libraries and Frameworks: Used to generate and display charts, diagrams, and interactive tables, ensuring an attractive and informative presentation of data.</li>
    <li>Data Analysis Tools: Used to perform complex analyses and extract valuable insights from the available data, contributing to improving the quality and relevance of the presented information.</li>
</ul>

<h1 id="5.0" class="purple-text">5. Other Requirements</h1>
  <h2 id="5.1">5.1 Performance Requirements</h2>
  <ul>
    <li><strong>Performance Requirements: </strong>The application should be able to handle a large volume of data and provide fast and responsive user interactions.</li>
    <li><strong>Security Requirements: </strong> The application should ensure data privacy and security by implementing appropriate measures such as data encryption, access control, and user authentication.</li>
    <li><strong>Usability Requirements: </strong> The application should provide an intuitive and user-friendly interface that enables users to easily explore and analyze data.</li>
    <li><strong>Compatibility Requirements: </strong> The application should be compatible with various devices, platforms, and browsers.</li>
    <li><strong>Scalability Requirements: </strong> The application should be scalable to handle increasing data volume and user traffic.</li>
    <li><strong>Maintainability Requirements: </strong>  The application should be easy to maintain and update with new features and improvements. </li>
    <li><strong>Network Latency: </strong> Network latency: < 100 milliseconds.</li>
    <li><strong>Real-Time Updates: </strong> Real-time updates delivery: < 1 second.</li>
  </ul>
  <h2 id="5.2">5.2 Safety Requirements</h2>
  <ul>
    <li><strong>Data Security:</strong> Safeguard sensitive user information through encryption and access control.</li>
    <li><strong>Backup and Recovery:</strong> Establish regular data backup procedures and reliable recovery processes.</li>
    <li><strong>Error Handling:</strong> Implement comprehensive error handling mechanisms.</li>
    <li><strong>System Reliability:</strong> Conduct thorough testing for reliability and stability.</li>
    <li><strong>Safety Certifications:</strong> Obtain necessary safety certifications.</li>
  </ul>
  <h2 id="5.3">5.3 Security Requirements</h2>
  <ul>
    <li><strong>Access Control:</strong> Implement role-based access control (RBAC) for data protection.</li>
    <li><strong>User Authentication:</strong> Enforce strong user authentication mechanisms.</li>
    <li><strong>Secure Communication:</strong> Use HTTPS for secure data transmission.</li>
    <li><strong>Regular Updates:</strong> Keep software and dependencies updated for security.</li>
    <li><strong>Regulatory Compliance:</strong> Ensure compliance with security and privacy regulations.</li>
    <li><strong>Security Testing:</strong> Conduct regular security assessments and penetration testing.</li>
    <li><strong>Privacy Certifications:</strong> Obtain relevant privacy certifications for assurance.</li>
  </ul>
  <h2 id="5.4">5.4 Software Quality Attributes</h2>
  <ul>
    <li><strong>Reliability:</strong> Ensure a system reliability rating of at least 99%.</li>
    <li><strong>Usability:</strong> Maintain a user interface usability score above 85%.</li>
    <li><strong>Security:</strong> Achieve a security score of 90% or higher in vulnerability assessments.</li>
    <li><strong>Testability:</strong> Implement comprehensive testing strategies for thorough test coverage.</li>
    <li><strong>Adaptability:</strong> Adapt to evolving user needs and technological advancements.</li>
    <li><strong>Availability:</strong> Maintain a system availability of 99.9%.</li>
    <li><strong>Correctness:</strong> Ensure a correctness rating of 95% or higher based on thorough testing.</li>
  </ul>
  <h2 id="5.5">5.5 Business Rules</h2>
  <ul>
    <li><strong>User Roles and Permissions:</strong> Administrators have full access, while regular users have restricted access.</li>
    <li><strong>Data Privacy:</strong> Personal information must be kept confidential.</li>
    <li><strong>Compliance with Regulations:</strong> The application must comply with relevant data privacy and security regulations.</li>
  </ul>
  <br>
  <p><strong>Thank you for reading!</strong></p>
  </div>
</body>
</html>
