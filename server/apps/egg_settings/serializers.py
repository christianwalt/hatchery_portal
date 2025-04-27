# apps/egg_settings/serializers.py

from rest_framework import serializers
from .models import EggSetting

class EggSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model  = EggSetting
        fields = '__all__'
