# apps/hatching/views.py

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models       import HatchingRecord
from .serializers  import HatchingRecordSerializer

class HatchingRecordViewSet(viewsets.ModelViewSet):
    """
    CRUD API for all HatchingRecord instances.
    """
    queryset           = HatchingRecord.objects.all()
    serializer_class   = HatchingRecordSerializer
    permission_classes = [IsAuthenticated]
