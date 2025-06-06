# apps/egg_candling/views.py

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models      import FertileEggCandling, ClearEggCandling
from .serializers import FertileEggCandlingSerializer, ClearEggCandlingSerializer

class FertileEggCandlingViewSet(viewsets.ModelViewSet):
    queryset           = FertileEggCandling.objects.all()
    serializer_class   = FertileEggCandlingSerializer
    permission_classes = [IsAuthenticated]

class ClearEggCandlingViewSet(viewsets.ModelViewSet):
    queryset           = ClearEggCandling.objects.all()
    serializer_class   = ClearEggCandlingSerializer
    permission_classes = [IsAuthenticated]
