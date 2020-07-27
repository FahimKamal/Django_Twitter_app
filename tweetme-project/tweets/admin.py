from django.contrib import admin
from . import models


# Register your models here.
class TweetLikeAdmin(admin.TabularInline):
    model = models.TweetLike


class TweetAdmin(admin.ModelAdmin):
    inlines = [TweetLikeAdmin]
    list_display = ['__str__', 'user']
    search_fields = ['content', 'user__username', 'user__email']

    class Meta:
        model = models.Tweet


admin.site.register(models.Tweet, TweetAdmin)
