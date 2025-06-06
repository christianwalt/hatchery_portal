# apps/egg_settings/views.py

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import EggSetting
from .serializers import EggSettingSerializer

class EggSettingViewSet(viewsets.ModelViewSet):
    """
    Provides list, create, retrieve, update, and destroy actions
    for EggSetting instances.
    """
    queryset           = EggSetting.objects.all()
    serializer_class   = EggSettingSerializer
    permission_classes = [IsAuthenticated]
