# apps/alerts/views.py

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models      import Alert
from .serializers import AlertSerializer

class AlertViewSet(viewsets.ModelViewSet):
    """
    CRUD API for Alert instances.
    """
    queryset           = Alert.objects.all()
    serializer_class   = AlertSerializer
    permission_classes = [IsAuthenticated]
