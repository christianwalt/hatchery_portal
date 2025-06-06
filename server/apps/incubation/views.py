# apps/incubation/views.py

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Incubator, IncubationBatch
from .serializers import IncubatorSerializer, IncubationBatchSerializer

class IncubatorViewSet(viewsets.ModelViewSet):
    queryset           = Incubator.objects.all()
    serializer_class   = IncubatorSerializer
    permission_classes = [IsAuthenticated]

class IncubationBatchViewSet(viewsets.ModelViewSet):
    queryset           = IncubationBatch.objects.all()
    serializer_class   = IncubationBatchSerializer
    permission_classes = [IsAuthenticated]
