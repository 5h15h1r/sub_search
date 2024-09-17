# from django.urls import path
# from .views import GetRoutes, UploadVideo

# urlpatterns = [
#     path('', GetRoutes.as_view()),
#     path('upload/', UploadVideo.as_view())
# ]
from django.urls import path
from .views import (
    VideoListCreateAPIView,
    VideoDetailAPIView,
    ServeSubtitleAPIView,
    VideoSearchAPIView,
    GetSubAvailableAPIView,
)

urlpatterns = [
    path('videos/', VideoListCreateAPIView.as_view()),
    path('videos/<uuid:pk>/', VideoDetailAPIView.as_view() ),
    path('videos/<uuid:pk>/search/', VideoSearchAPIView.as_view()),
    path('subtitles/<uuid:video_id>/<str:language>/', ServeSubtitleAPIView.as_view() ),
    path('subtitles/<uuid:video_id>/', GetSubAvailableAPIView.as_view())

]