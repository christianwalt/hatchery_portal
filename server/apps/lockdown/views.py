# apps/lockdown/views.py

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models      import LockdownBatch
from .serializers import LockdownBatchSerializer

class LockdownBatchViewSet(viewsets.ModelViewSet):
    """
    Provides list, create, retrieve, update, and destroy actions
    for LockdownBatch instances.
    """
    queryset           = LockdownBatch.objects.all()
    serializer_class   = LockdownBatchSerializer
    permission_classes = [IsAuthenticated]
