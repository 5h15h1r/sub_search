# Subsearch
An app to extract subtitles from uploaded videos and  and have transcript features with search functionality.
## Assignment


**Video Upload and Processing**: Develop a website that allows users to upload videos, which will be processed in the background. After processing and extracting subtitles from the video, the subtitles should be returned to the frontend, integrated with the video, and displayed as closed captions. Ensure that the logic supports multiple language subtitles.


**Search Functionality**: Implement a search feature on the website that enables users to search for a phrase within the video and retrieve the timestamp of its occurrence. When a user clicks on the timestamp, the video should start playing from that specific point. Ensure that the search functionality is case-insensitive.


**List View for Uploaded Videos**: Implement a list view for uploaded video files. When a video file is selected, it should retrieve the corresponding video and subtitles, and provide all the aforementioned features.


## Run Locally
Clone the repository 
### Backend
1. `cd backend`
2. Set up an .env file by reffering to .env.example
3. `docker compose up --build`
4. Apply migrations with following commands:
    ```bash
        docker compose exec web python3 manage.py makemigrations
        docker compose exec web python3 manage.py migrate
    ```

### Frontend
1. `cd client`
2. Install the dependencies
    ```bash
        npm install
    ```
3. Run the app:
    ```bash
        npm run dev
    ```

## Approach
![](https://raw.githubusercontent.com/5h15h1r/sub_search/main/screenshots/architecture.png)
## Screenshots

<p float="left">
  <img src="https://raw.githubusercontent.com/5h15h1r/sub_search/main/screenshots/ss1.jpeg" width="200" />
  <img src="https://raw.githubusercontent.com/5h15h1r/sub_search/main/screenshots/ss2.jpeg" width="200" /> 
  <img src="https://raw.githubusercontent.com/5h15h1r/sub_search/main/screenshots/ss3.jpeg" width="200" />
</p>

<p float="left">
  <img src="https://raw.githubusercontent.com/5h15h1r/sub_search/main/screenshots/ss4.jpeg" width="200" />
  <img src="https://raw.githubusercontent.com/5h15h1r/sub_search/main/screenshots/ss5.jpeg" width="200" />
  <img src="https://raw.githubusercontent.com/5h15h1r/sub_search/main/screenshots/ss6.jpeg" width="200" />
</p>

<p float="left">
  <img src="https://raw.githubusercontent.com/5h15h1r/sub_search/main/screenshots/ss7.jpeg" width="200" />
  <img src="https://raw.githubusercontent.com/5h15h1r/sub_search/main/screenshots/ss8.jpeg" width="200" />
</p>





## Recording
https://github.com/user-attachments/assets/1f5ccadf-4cfa-4f52-ae51-1e8352618674
