from django.urls import path
from .views import FileUploadListCreateAPIView, FileUploadDetailAPIView,  UserProfileAPIView, UpdateUsernameAPIView, UpdatePhoneNumberAPIView, AddAddressAPIView,ListAddressesAPIView,UpdateAddressAPIView, DeleteAddressAPIView, DashboardAPIView

urlpatterns = [
    path('files/', FileUploadListCreateAPIView.as_view(), name='file-list-create'),
    path('files/<int:file_id>/', FileUploadDetailAPIView.as_view(), name='file-detail'),
    path("profile/", UserProfileAPIView.as_view(), name="user-profile"),
    path("dashboard/", DashboardAPIView.as_view(), name="dashboard"),
    path("profile/update-username/", UpdateUsernameAPIView.as_view(), name="update-username"),
    path("profile/update-phone/", UpdatePhoneNumberAPIView.as_view(), name="update-phone"),
    path("profile/addresses/", ListAddressesAPIView.as_view(), name="list-addresses"),
    path("profile/addresses/add/", AddAddressAPIView.as_view(), name="add-address"),
    path("profile/addresses/update/<int:address_id>/", UpdateAddressAPIView.as_view(), name="update-address"),
    path("profile/addresses/delete/<int:address_id>/", DeleteAddressAPIView.as_view(), name="delete-address"),
]

