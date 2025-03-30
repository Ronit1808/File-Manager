
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404
from .models import FileUpload, Address, UserProfile
from django.db.models import Count
from django.contrib.auth.models import User
from .serializers import FileUploadSerializer , UserSerializer , AddressSerializer


# File Upload API Views
class FileUploadListCreateAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """Retrieve all files uploaded by the authenticated user"""
        files = FileUpload.objects.filter(user=request.user)
        serializer = FileUploadSerializer(files, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        """Upload a new file"""
        if 'file' not in request.FILES:  # Check if file exists in request
            return Response({"error": "No file was uploaded."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = FileUploadSerializer(data=request.data)
        if serializer.is_valid():
            uploaded_file = request.FILES.get('file')
            file_type = uploaded_file.name.split('.')[-1] if uploaded_file else ''
            serializer.save(user=request.user,file=uploaded_file, file_type=file_type)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# File Upload Detail API Views
class FileUploadDetailAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, file_id):
        """Retrieve a specific file by ID"""
        file = get_object_or_404(FileUpload, id=file_id, user=request.user)
        serializer = FileUploadSerializer(file)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, file_id):
        """Delete a specific file"""
        file = get_object_or_404(FileUpload, id=file_id, user=request.user)
        file.delete()
        return Response({"message": "File deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    
# Dashboard API View
class DashboardAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        total_files = FileUpload.objects.count()
        file_types = FileUpload.objects.values('file_type').annotate(count=Count('file_type'))
        users_file_count = User.objects.annotate(file_count=Count('files')).values('username', 'file_count')

        return Response({
            "totalFiles": total_files,
            "fileTypes": {item['file_type']: item['count'] for item in file_types},
            "usersFileCount": {item['username']: item['file_count'] for item in users_file_count},
        })
    

# Get Logged-in User Profile
class UserProfileAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """Retrieve the logged-in user's profile"""
        user = request.user
        serializer = UserSerializer(user, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

# Update Username
class UpdateUsernameAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request):
        """Update the authenticated user's username"""
        user = request.user
        new_username = request.data.get("username")

        if not new_username:
            return Response({"error": "Username is required"}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=new_username).exists():
            return Response({"error": "Username already taken"}, status=status.HTTP_400_BAD_REQUEST)

        user.username = new_username
        user.save()
        return Response({"message": "Username updated successfully", "username": user.username}, status=status.HTTP_200_OK)

# Update Phone Number
class UpdatePhoneNumberAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request):
        """Update the phone number in the user profile"""
        user_profile, created = UserProfile.objects.get_or_create(user=request.user)
        phone_number = request.data.get("phone_number")

        if not phone_number:
            return Response({"error": "Phone number is required"}, status=status.HTTP_400_BAD_REQUEST)

        user_profile.phone_number = phone_number
        user_profile.save()
        return Response({"message": "Phone number updated successfully", "phone_number": phone_number}, status=status.HTTP_200_OK)
    
# Add a New Address
class AddAddressAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        """Add a new address for the authenticated user"""
        serializer = AddressSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# List All Addresses
class ListAddressesAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """List all addresses of the authenticated user"""
        addresses = Address.objects.filter(user=request.user)
        serializer = AddressSerializer(addresses, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

# Update an Address
class UpdateAddressAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, address_id):
        """Update an existing address"""
        try:
            address = Address.objects.get(id=address_id, user=request.user)
        except Address.DoesNotExist:
            return Response({"error": "Address not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = AddressSerializer(address, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Delete an Address
class DeleteAddressAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, address_id):
        """Delete an address"""
        try:
            address = Address.objects.get(id=address_id, user=request.user)
            address.delete()
            return Response({"message": "Address deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Address.DoesNotExist:
            return Response({"error": "Address not found"}, status=status.HTTP_404_NOT_FOUND)