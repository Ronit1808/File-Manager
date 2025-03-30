from rest_framework import serializers
from django.contrib.auth.models import User
from .models import FileUpload, UserProfile , Address

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['phone_number']
        
class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['id','street', 'city', 'state', 'country', 'postal_code']


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer()
    address = AddressSerializer(many=True, required=False)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email' , 'profile' , 'address']
    
class FileUploadSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = FileUpload
        fields = ['id', 'user', 'file', 'upload_date', 'description', 'file_type' , 'file_url']
        extra_kwargs = {
            'user': {'read_only': True}, 
            'file_type': {'read_only': True},  
        }
        
    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file:
            if request:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url  #if request is not available
        return None
