from django.shortcuts import render, redirect
from django.http import HttpResponse, Http404, JsonResponse
from django.utils.http import is_safe_url
from django.conf import settings

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from .models import Tweet
from . import forms
from .serializers import TweetSerializer, TweetActionSerializer


# Create your views here.
def home_view(request, *args, **kwargs):
    print(request.user or None)
    return render(request, 'pages/home.html', context={}, status=200)


@api_view(['GET'])
def tweet_list_view(request, *args, **kwargs):
    qs = Tweet.objects.all()
    if not qs.exists():
        return Response({}, status=404)
    serializer = TweetSerializer(qs, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def tweet_detail_view(request, tweet_id, *args, **kwargs):
    qs = Tweet.objects.filter(id=tweet_id)
    if not qs.exists():
        return Response({}, status=404)
    serializer = TweetSerializer(qs.first())
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def tweet_action_view(request, *args, **kwargs):
    """
    id is required.
    Action options are: like, unlike, retweet
    """
    serializer = TweetActionSerializer(request.POST)
    if serializer.is_valid(raise_exception=True):
        data = serializer.validated_data
        tweet_id = data.get("id")
        action = data.get("action")
        qs = Tweet.objects.filter(id=tweet_id)
        if not qs.exists():
            return Response({}, status=404)
        obj = qs.first()
        if action == 'like':
            obj.likes.add(request.user)
        elif action == "unlike":
            obj.likes.remove(request.user)
        elif action == "retweet":
            # This is todo
            pass

    return Response({'message': 'Tweet removed.'}, status=200)


@api_view(['DELETE', 'POST'])
@permission_classes([IsAuthenticated])
def tweet_delete_view(request, tweet_id, *args, **kwargs):
    qs = Tweet.objects.filter(id=tweet_id)
    if not qs.exists():
        return Response({}, status=404)
    qs = qs.filter(user=request.user)
    if not qs.exists():
        return Response({'message': 'You cannot delete this tweet.'}, status=401)
    obj = qs.first()
    obj.delete()
    return Response({'message': 'Tweet removed.'}, status=200)


@api_view(['POST'])  # http method the client == POST
@permission_classes([IsAuthenticated])
def tweet_create_view(request):
    serializer = TweetSerializer(data=request.POST)
    if serializer.is_valid(raise_exception=True):
        serializer.save(user=request.user)
        return Response(serializer.data, status=201)
    return Response({}, status=400)


def tweet_list_view_pure_django(request, *args, **kwargs):
    """
        Rest API view
        Consume by JavaScript or Swift or Java or IOS/Android
        return json data
    """
    qs = Tweet.objects.all()
    tweets_list = [x.serialize() for x in qs]
    data = {
        "isUser": False,
        "response": tweets_list
    }
    return JsonResponse(data)


def tweet_detail_view_pure_django(request, tweet_id, *args, **kwargs):
    """
    Rest API view
    Consume by JavaScript or Swift or Java or IOS/Android
    return json data
    """
    data = {
        "id": tweet_id,
    }
    status = 200
    try:
        obj = Tweet.objects.get(id=tweet_id)
        data["content"] = obj.content
    except:
        data['message'] = 'Not found'
        status = 404
        # raise Http404

    return JsonResponse(data, status=status)


def tweet_create_view_pure_django(request):
    """REST API Create View with Django Rest Framework"""
    user = request.user
    if not request.user.is_authenticated:
        user = None
        if request.is_ajax():
            return JsonResponse({}, status=401)
        return redirect(settings.LOGIN_URL)
    form = forms.TweetForm(request.POST or None)
    next_url = request.POST.get('next') or None
    content = request.POST.get('content')
    print(form.is_valid())
    if form.is_valid():
        obj = form.save(commit=False)
        obj.user = user
        obj.save()
        if request.is_ajax():
            return JsonResponse(obj.serialize(), status=201)  # 201 == created items
        if next_url != None and is_safe_url(next_url, settings.ALLOWED_HOSTS):
            return redirect(next_url)
        form = forms.TweetForm()
    if form.errors:
        if request.is_ajax():
            return JsonResponse(form.errors, status=400)
    return render(request, 'components/form.html', context={"form": form})
