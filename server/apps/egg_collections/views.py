# apps/egg_collections/views.py

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import EggCollection
from .serializers import EggCollectionSerializer

class EggCollectionViewSet(viewsets.ModelViewSet):
    queryset = EggCollection.objects.all()
    serializer_class = EggCollectionSerializer
    permission_classes = [IsAuthenticated]
