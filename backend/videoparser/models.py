import uuid
from django.db import models

class TimeStampedModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        abstract = True

class Video(TimeStampedModel):
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to='videos/')
    thumbnail = models.ImageField(upload_to='thumbnails/',  null=True, blank=True)
    processed = models.BooleanField(default=False)

    def __str__(self):
        return self.title

class Subtitle(TimeStampedModel):
    video = models.ForeignKey(Video, on_delete=models.CASCADE, related_name='subtitles')
    language = models.CharField(max_length=10)
    content = models.TextField()

    class Meta:
        unique_together = ('video', 'language')

    def __str__(self):
        return f"{self.video.title} - {self.language}"

class SubtitleLine(TimeStampedModel):
    subtitle = models.ForeignKey(Subtitle, on_delete=models.CASCADE, related_name='lines')
    start_time = models.FloatField()
    end_time = models.FloatField()
    text = models.TextField()

    def __str__(self):
        return f"{self.subtitle.video.title} - {self.start_time}"