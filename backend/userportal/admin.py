from django.contrib import admin
from .models import FileUpload, UserProfile, Address

# Register your models here.
admin.site.register([FileUpload, UserProfile, Address])