# apps/notifications/views.py

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models       import Notification
from .serializers  import NotificationSerializer

class NotificationViewSet(viewsets.ModelViewSet):
    """
    CRUD API for Notification instances tied to authenticated users.
    """
    queryset           = Notification.objects.all()
    serializer_class   = NotificationSerializer
    permission_classes = [IsAuthenticated]
