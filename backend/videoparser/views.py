from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from .models import Video, Subtitle, SubtitleLine
from .serializers import VideoSerializer
from django.contrib.postgres.search import SearchVector, SearchQuery
from .tasks import process_video

class VideoListCreateAPIView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    serializer_class = VideoSerializer
    def get(self, request):
        videos = Video.objects.all()
        serializer = VideoSerializer(videos, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = VideoSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            video = serializer.save()
            process_video.delay(video.id)
            video.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VideoDetailAPIView(APIView):
    def get(self, request, pk):
        video = get_object_or_404(Video, pk=pk)
        serializer = VideoSerializer(video)
        return Response(serializer.data)


class VideoSearchAPIView(APIView):
    def get(self, request, pk):
        query = request.query_params.get('q', '')

        if query:
            search_vector = SearchVector('text')
            search_query = SearchQuery(query)
            subtitle_lines = SubtitleLine.objects.filter(
                subtitle__video=pk
            ).annotate(
                search=search_vector
            ).filter(search=search_query)

            results = [{'text': line.text, 'start_time': line.start_time} for line in subtitle_lines]
            return Response(results)
        
        return Response([])

class ServeSubtitleAPIView(APIView):

    def get(self, request, video_id, language):
        try:
            subtitle = Subtitle.objects.get(video_id=video_id, language=language)
            return Response({"content": subtitle.content})
        except Subtitle.DoesNotExist:
            return Response({"detail": "Subtitle not found."}, status=404)

class GetSubAvailableAPIView(APIView):

    def get(self, request, video_id):
        try:
            languages = Subtitle.objects.filter(video_id=video_id).values('language').distinct()
            return Response({"languages": languages})
        except Subtitle.DoesNotExist:
            return Response({"detail": "No languages found."}, status=404)