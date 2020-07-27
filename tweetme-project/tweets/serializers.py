from rest_framework import serializers
from django.conf import settings
from .models import Tweet


class TweetActionSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    action = serializers.CharField()


class TweetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tweet
        fields = ['content', 'id']

    def validate_content(self, value):
        if len(value) > settings.MAX_TWEET_LENGTH:
            raise serializers.ValidationError('This tweet is too long.')
        return value
