# # serializers.py
# from rest_framework import serializers
# from .models import Video

# class VideoSerializer(serializers.ModelSerializer):
#     # file = serializers.FileField()
#     class Meta:
#         model = Video
#         fields = [ 'file']
from rest_framework import serializers
from .models import Video, Subtitle, SubtitleLine

class SubtitleLineSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubtitleLine
        fields = ['id', 'start_time', 'end_time', 'text']

class SubtitleSerializer(serializers.ModelSerializer):
    lines = SubtitleLineSerializer(many=True, read_only=True)

    class Meta:
        model = Subtitle
        fields = ['id', 'language', 'content', 'lines']

class VideoSerializer(serializers.ModelSerializer):
    # subtitles = SubtitleSerializer(many=True, read_only=True)

    class Meta:
        model = Video
        fields = ['id','title', 'file', 'created_at', 'processed','thumbnail']
        read_only_fields = ['processed', 'created_at']

    # def create(self, validated_data):
    #     validated_data['user'] = self.context['request'].user
    #     return super().create(validated_data)
class VideoListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ['file']